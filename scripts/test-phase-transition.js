const assert=require("assert");
const fs=require("fs");
const path=require("path");
const coach=require("../adaptive-coaching.js");

const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const backup=require("../backup-restore.js");

function session(letter,index,overrides={}){
  const day=String(index+1).padStart(2,"0");
  return Object.assign({
    id:`session-${letter}-${index}`,
    scheduleId:`schedule-${letter}-${index}`,
    name:`Full Body ${letter}`,
    completedDate:`2026-08-${day}`,
    completedAt:`2026-08-${day}T20:00:00.000Z`,
    workoutType:"strength",
    completionStatus:"completed",
    exercises:[
      {exerciseId:`shared-${index%8}`,name:`Exercise ${index%8}`,sets:[{done:true,reps:10,weight:25}]}
    ]
  },overrides);
}
function eligibleFixture(){
  const letters=["A","B","C","A","B","C","A","B","C","A","B","C"];
  const history=letters.map((letter,index)=>session(letter,index));
  const ratings=Object.fromEntries(history.map(item=>[item.id,"Good"]));
  const sessions=history.map(item=>({id:item.scheduleId,plannedDate:item.completedDate,scheduledDate:item.completedDate,status:"completed"}));
  return {history,ratings,sessions,today:"2026-08-20",adherenceBaselineDate:"2026-08-01",trainingPhase:{id:"foundation",number:1,startedAt:"2026-08-01",status:"active",advancementLocked:true}};
}

const fixture=eligibleFixture();
const originalHistory=JSON.parse(JSON.stringify(fixture.history));
const ready=coach.phaseReadiness(fixture);
assert.strictEqual(ready.score,100,"readiness must be allowed to reach 100");
assert.strictEqual(ready.rawScore,100);
assert.strictEqual(ready.dataQuality,100);
assert.strictEqual(ready.eligible,true);
assert.strictEqual(ready.locked,false);
assert.strictEqual(ready.eligibleAt,"2026-08-12");
assert.deepStrictEqual(ready.exposure,{A:4,B:4,C:4});
assert(Object.values(ready.gates).every(gate=>gate.passed),"every explicit eligibility gate should pass");
assert.deepStrictEqual(fixture.history,originalHistory,"readiness calculation must not rewrite history");

const componentWeights=Object.fromEntries(Object.entries(ready.components).map(([key,value])=>[key,value.weight]));
assert.deepStrictEqual(componentWeights,{exposure:35,consistency:25,recovery:20,performance:20});

const old=session("A",20,{id:"old",completedDate:"2026-07-20",completedAt:"2026-07-20T20:00:00.000Z"});
const phaseFiltered=coach.phaseReadiness({...fixture,history:[old,...fixture.history],ratings:{...fixture.ratings,old:"Good"},trainingPhase:{...fixture.trainingPhase,startedAt:"2026-08-01"}});
assert.deepStrictEqual(phaseFiltered.exposure,{A:4,B:4,C:4},"pre-Foundation sessions must not count toward phase readiness");
assert.strictEqual(coach.qualifiedPhaseSessions([old,...fixture.history],"2026-08-01").length,12);

const invalidVariants=[
  session("A",20,{name:"Full Body A Preview"}),
  session("A",21,{completionStatus:"incomplete"}),
  session("A",22,{workoutType:"cardio"}),
  session("A",23,{exercises:[{name:"Empty",sets:[{done:false,reps:10,weight:25}]}]})
];
assert.strictEqual(coach.qualifiedPhaseSessions(invalidVariants,"2026-08-01").length,0,"qualified sessions require an exact canonical name, completed strength status, and a completed working set");

for(const letter of ["A","B","C"]){
  const reduced=fixture.history.filter((item,index)=>!(item.name===`Full Body ${letter}`&&index===fixture.history.findIndex(candidate=>candidate.name===`Full Body ${letter}`)));
  const result=coach.phaseReadiness({...fixture,history:reduced});
  assert.strictEqual(result.gates[`fullBody${letter}`].passed,false,`Full Body ${letter} must require four phase-qualified exposures`);
  assert(result.blockers.some(blocker=>blocker.includes(`Full Body ${letter}`)));
}

const unratedId=fixture.history[11].id;
const unrated=coach.phaseReadiness({...fixture,ratings:Object.fromEntries(Object.entries(fixture.ratings).filter(([id])=>id!==unratedId))});
assert.strictEqual(unrated.gates.ratings.passed,false);
assert(unrated.blockers.some(blocker=>/rated strength workout/.test(blocker)));

const difficultRatings={...fixture.ratings,[fixture.history[10].id]:"Too Hard",[fixture.history[11].id]:"Tough"};
const difficult=coach.phaseReadiness({...fixture,ratings:difficultRatings});
assert.strictEqual(difficult.gates.ratings.passed,false,"more than one difficult result in the latest six must block eligibility");
assert(difficult.blockers.some(blocker=>/include 2 difficult ratings/.test(blocker)));

const missedSchedule={id:"missed-extra",plannedDate:"2026-08-13",scheduledDate:"2026-08-13",status:"missed"};
const lowAdherence=coach.phaseReadiness({...fixture,sessions:[...fixture.sessions.slice(0,5),...Array.from({length:3},(_,index)=>({...missedSchedule,id:`missed-${index}`,plannedDate:`2026-08-${13+index}`,scheduledDate:`2026-08-${13+index}`}))]});
assert.strictEqual(lowAdherence.gates.adherence.passed,false);

const noContext=coach.phaseReadiness({...fixture,cardio:[],measurements:[],profile:{healthClearance:false}});
const withContext=coach.phaseReadiness({...fixture,cardio:[{actualDurationMinutes:60,date:"2026-08-20"}],measurements:[{weight:200,date:"2026-08-20"}],profile:{healthClearance:true}});
assert.strictEqual(noContext.eligible,true,"cardio, measurements, and health clearance must not gate Build eligibility");
assert.strictEqual(withContext.score,noContext.score,"context-only evidence must not change readiness scoring");
assert.strictEqual(withContext.dataQuality,noContext.dataQuality,"context-only evidence must not change the data-quality gate");

const lockedActivation=coach.acceptBuildPhase({trainingPhase:fixture.trainingPhase,phaseTransitions:[],readiness:{...ready,eligible:false,locked:true},buildTemplateValidated:true});
assert.strictEqual(lockedActivation.activated,false);
const missingTemplate=coach.acceptBuildPhase({trainingPhase:fixture.trainingPhase,phaseTransitions:[],readiness:ready,buildTemplateValidated:false});
assert.strictEqual(missingTemplate.activated,false,"eligibility cannot activate Build before workout templates are approved");
const acceptedAt="2026-08-20T12:00:00.000Z";
const accepted=coach.acceptBuildPhase({trainingPhase:fixture.trainingPhase,phaseTransitions:[],readiness:ready,buildTemplateValidated:true,acceptedAt,acceptanceDate:"2026-08-20",firstBuildDate:"2026-08-21",buildProgramVersion:"build-test-v1"});
assert.strictEqual(accepted.activated,true);
assert.deepStrictEqual(accepted.trainingPhase,{id:"build",number:2,startedAt:"2026-08-20",status:"active",advancementLocked:true,programVersion:"build-test-v1"});
assert.strictEqual(accepted.transition.from,"foundation");
assert.strictEqual(accepted.transition.to,"build");
assert.strictEqual(accepted.transition.acceptedAt,acceptedAt);
assert.strictEqual(accepted.transition.firstBuildDate,"2026-08-21");
assert.strictEqual(accepted.transition.programVersion,"build-test-v1");
assert.strictEqual(accepted.transition.evidenceSnapshot.score,100);

const backupState={schemaVersion:20,history:fixture.history,trainingPhase:accepted.trainingPhase,phaseTransitions:accepted.phaseTransitions,buildProgramVersion:"build-test-v1"};
const payload=backup.create({version:"test",build:"test"},backupState,20);
const restored=backup.validate(payload,21).state;
assert.deepStrictEqual(restored.phaseTransitions,accepted.phaseTransitions,"backup round-trip must preserve explicit phase transitions");
assert.strictEqual(restored.buildProgramVersion,"build-test-v1","backup round-trip must preserve the accepted Build version");
const oldPayload=backup.create({version:"test",build:"test"},{schemaVersion:18,history:fixture.history,trainingPhase:fixture.trainingPhase},18);
const oldRestored=backup.validate(oldPayload,21).state;
assert.strictEqual(oldRestored.phaseTransitions,undefined,"older backups must not receive a manufactured transition");

assert.match(app,/const BUILD_WORKOUT_TEMPLATE_VALIDATED=window\.ROAD12_BUILD/);
assert.match(app,/Review Build Plan/);
assert.match(app,/Start Build Phase/);
assert.match(app,/Stay in Foundation/);
assert.match(app,/Build workout programming still needs review and approval/);
assert.match(app,/version:20,[\s\S]*?buildProgramVersion[\s\S]*?schemaVersion=20/);

console.log("Foundation → Build eligibility and transition tests passed.");
