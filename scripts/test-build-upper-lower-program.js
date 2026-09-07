const assert=require("node:assert");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const root=path.resolve(__dirname,"..");
const build=require(path.join(root,"build-upper-lower-program.js"));
const identities=require(path.join(root,"exercise-identity.js"));
const payloads=require(path.join(root,"strava-strength-payload.js"));
const backup=require(path.join(root,"backup-restore.js"));
const coach=require(path.join(root,"adaptive-coaching.js"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
const libraryContext={self:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"exercise-library.js"),"utf8"),libraryContext,{filename:"exercise-library.js"});
const media=libraryContext.self.ROAD12_EXERCISE_LIBRARY.entries;

assert.strictEqual(build.validation.valid,true,build.validation.errors.join("\n"));
assert.deepStrictEqual(Object.keys(build.TEMPLATES),["UPPER_A","LOWER_A","UPPER_B","LOWER_B"]);
assert.deepStrictEqual(Object.values(build.TEMPLATES).map(item=>item.id),["build-upper-a","build-lower-a","build-upper-b","build-lower-b"]);
assert.deepStrictEqual(Object.values(build.TEMPLATES).map(item=>item.planDay),[0,1,3,4]);
assert.deepStrictEqual(Object.values(build.TEMPLATES).map(item=>build.strengthSetCount(item)),[22,19,21,20]);
assert.deepStrictEqual(build.PRIORITY_GROUPS,["chest","biceps","calves","core"]);
assert(Object.values(build.TEMPLATES).every(item=>build.strengthSetCount(item)>=16&&build.strengthSetCount(item)<=22));
assert.strictEqual(Object.values(build.TEMPLATES).reduce((sum,item)=>sum+build.strengthSetCount(item),0),82);
assert(!Object.values(build.TEMPLATES).some(item=>item.id.startsWith("build-full-body-")),"prototype IDs must never be active");

const exercises=Object.values(build.TEMPLATES).flatMap(template=>template.exercises);
const names=exercises.map(item=>item.name);
assert(!names.some(name=>/Romanian Deadlift|\bRDL\b|loaded hinge/i.test(name)),"Build must remain free of loaded unsupported hinge work");
for(const name of ["Smith Machine Bench Press","GMWD Converging Chest Press","Low-Incline Dumbbell Press","Seated Concentration Curl","Standing Single-Leg Cable Hamstring Curl","Smith Machine Calf Raise","Cable Crunch","High to Low Cable Chop"]){
  assert(names.includes(name),`${name} must be present`);
}
for(const template of Object.values(build.TEMPLATES))for(const exercise of template.exercises){
  assert(media[exercise.name],`${template.name}: ${exercise.name} needs reviewed media`);
  if(!exercise.sets)continue;
  assert.deepStrictEqual(exercise.targetRirRange,[2,3]);
  assert(exercise.primaryGroup&&exercise.reps&&exercise.rest,`${template.name}: ${exercise.name} needs a complete prescription`);
  const identity=identities.resolve(exercise.name);
  assert(!identity.id.startsWith("road12.exercise."),`${exercise.name} needs a canonical identity`);
  assert(identities.isSupportedStravaExerciseType(identity.externalMappings.strava?.exerciseType),`${exercise.name} needs a supported Strava mapping`);
}

const volume=build.weeklyPrimarySets();
assert.deepStrictEqual(volume,{chest:12,back:12,shoulders:6,biceps:9,triceps:4,quads:9,glutes:8,hamstrings:6,calves:8,core:8});
assert(volume.chest>=12&&volume.chest<=14);
assert(volume.biceps>=9&&volume.biceps<=12);
assert(volume.calves>=8&&volume.calves<=10);
assert(volume.back>=12&&volume.back<=16);
assert(volume.quads>=9&&volume.quads<=12);
assert(volume.hamstrings>=6&&volume.hamstrings<=8);
assert(volume.glutes>=8&&volume.glutes<=12);
assert.strictEqual(volume.core,8,"the two lower days must provide the approved eight direct core sets");
const exposureCount=group=>Object.values(build.TEMPLATES).filter(template=>template.exercises.some(item=>item.primaryGroup===group)).length;
assert.strictEqual(exposureCount("biceps"),2);
assert.strictEqual(exposureCount("calves"),2);
assert(Object.values(build.TEMPLATES).every(template=>template.exercises.filter(item=>item.primaryGroup==="biceps").length<=2));

assert.match(app,/GMWD Converging Chest Press"[\s\S]*?mode:"perSide",label:"Weight per side"/);
assert.match(app,/Standing Single-Leg Cable Hamstring Curl"[\s\S]*?mode:"single"/);
assert.match(app,/Seated Concentration Curl"[\s\S]*?mode:"total",paired:false,label:"One dumbbell weight"/);

const prior=["foundation-bench-1","foundation-bench-2"].map(id=>({id,name:"Full Body A",completionStatus:"completed",exercises:[{name:"Smith Machine Bench Press",sets:[1,2,3,4].map(()=>({done:true,reps:10,weight:60})),feedback:{rir:3,form:"Clean",discomfort:false}}]}));
assert.strictEqual(coach.exerciseRecommendation(prior,{"foundation-bench-1":"Good","foundation-bench-2":"Good"},{name:"Smith Machine Bench Press",type:"strength",sets:4,reps:"6–10",progressionRirRange:[2,3]}).action,"PROGRESS");
const discomfort=[{...prior[0],id:"pain",exercises:[{...prior[0].exercises[0],feedback:{rir:3,form:"Clean",discomfort:true}}]}];
assert.notStrictEqual(coach.exerciseRecommendation(discomfort,{pain:"Good"},{name:"Smith Machine Bench Press",type:"strength",sets:4,reps:"6–10",progressionRirRange:[2,3]}).action,"PROGRESS","priority status must not bypass discomfort safeguards");

function scheduleRows(){
  const rows=[];
  for(let day=7;day<=27;day++){
    const planDay=(day-7)%7;
    rows.push({id:`planned-2026-09-${String(day).padStart(2,"0")}`,plannedDate:`2026-09-${String(day).padStart(2,"0")}`,scheduledDate:`2026-09-${String(day).padStart(2,"0")}`,planDay,name:planDay===6?"Foundation Recovery":"Foundation",workoutType:planDay===6?"recovery":"strength",status:planDay===6?"restDay":"scheduled"});
  }
  return rows;
}
assert.strictEqual(build.activateSchedule({acceptanceDate:"2026-09-09",eligible:false,templatesValidated:true,workoutSessions:scheduleRows()}).activated,false,"an ineligible projection must be rejected at the scheduler boundary");
assert.strictEqual(build.activateSchedule({acceptanceDate:"2026-09-09",eligible:true,templatesValidated:false,workoutSessions:scheduleRows()}).activated,false,"an invalid template set must be rejected");
for(const [label,acceptanceDate,mutate,expectedAnchor] of [
  ["Sunday","2026-09-13",()=>{},"2026-09-14"],
  ["Monday before workout","2026-09-14",()=>{},"2026-09-14"],
  ["Monday after completion","2026-09-14",rows=>{rows.find(item=>item.scheduledDate==="2026-09-14").status="completed";},"2026-09-21"],
  ["Wednesday","2026-09-16",()=>{},"2026-09-21"],
  ["Friday after workout","2026-09-18",rows=>{rows.find(item=>item.scheduledDate==="2026-09-18").status="completed";},"2026-09-21"]
]){
  const rows=scheduleRows();
  mutate(rows);
  const original=JSON.parse(JSON.stringify(rows));
  const projected=build.activateSchedule({acceptanceDate,eligible:true,templatesValidated:true,workoutSessions:rows,history:[],currentSession:null});
  assert.strictEqual(projected.activated,true,label);
  assert.strictEqual(projected.firstBuildDate,expectedAnchor,`${label} acceptance must use the next intact Monday`);
  assert.deepStrictEqual(projected.workoutSessions.filter(item=>item.scheduledDate<expectedAnchor),original.filter(item=>item.scheduledDate<expectedAnchor),`${label} must preserve every earlier row`);
  const firstWeek=projected.workoutSessions.filter(item=>item.scheduledDate>=expectedAnchor&&item.scheduledDate<`${expectedAnchor.slice(0,8)}${String(Number(expectedAnchor.slice(8))+7).padStart(2,"0")}`);
  assert.deepStrictEqual(firstWeek.filter(item=>item.workoutType==="strength").map(item=>[item.planDay,item.name,item.templateId]),[[0,"Upper A","build-upper-a"],[1,"Lower A","build-lower-a"],[3,"Upper B","build-upper-b"],[4,"Lower B","build-lower-b"]]);
  assert.strictEqual(firstWeek.find(item=>item.planDay===2).name,"Cardio + Recovery");
  assert.strictEqual(firstWeek.find(item=>item.planDay===5).name,"Zone 2 Cardio");
  assert.strictEqual(firstWeek.find(item=>item.planDay===6).status,"restDay");
  assert.strictEqual(new Set(projected.workoutSessions.map(item=>item.id)).size,projected.workoutSessions.length,"activation must not duplicate rows");
}

const rows=scheduleRows();
const protectedActive=rows.find(item=>item.scheduledDate==="2026-09-14");
const projected=build.activateSchedule({acceptanceDate:"2026-09-14",eligible:true,templatesValidated:true,workoutSessions:rows,history:[],currentSession:{scheduleId:protectedActive.id}});
assert.strictEqual(projected.firstBuildDate,"2026-09-21","an active Monday Foundation workout must remain active and defer Build one week");
assert.strictEqual(projected.workoutSessions.find(item=>item.id===protectedActive.id).name,"Foundation");

const state={schemaVersion:20,history:[{id:"foundation-history",name:"Full Body A"}],trainingPhase:{id:"build",programVersion:build.VERSION},phaseTransitions:[{from:"foundation",to:"build",acceptedAt:"2026-09-09T12:00:00.000Z",firstBuildDate:projected.firstBuildDate,programVersion:build.VERSION,evidenceSnapshot:{score:100}}],buildProgramVersion:build.VERSION,workoutSessions:projected.workoutSessions};
assert.deepStrictEqual(backup.validate(backup.create({version:"test",build:"test"},state,20),21).state,state);

assert.strictEqual(typeof payloads.buildStravaStrengthPayload,"function","existing Strava payload boundary must remain intact");

assert(!index.includes("build-program.js"),"the obsolete three-day Build module must not load in production");
assert(!sw.includes('"./build-program.js"'),"the obsolete three-day Build module must not be cached");
assert(sw.includes('"build-upper-lower-program.js"')&&sw.includes('"./build-upper-lower-program.js"'));
assert.match(app,/Build changes lifting frequency from 3 strength days per week to 4 strength days per week/);
assert.match(app,/Start Build Phase/);
assert.match(app,/if\(!readiness\.eligible\)return/);
assert.match(app,/stayInFoundation"\)\.onclick=closeV42Dialog/,"Stay in Foundation must close review without mutating state");
assert.match(app,/activateSchedule\(\{acceptanceDate,eligible:readiness\.eligible/,"the explicit Start action must pass live eligibility into the schedule gate");
assert.match(app,/acceptedTransition\?\.firstBuildDate\|\|state\.trainingPhase\.startedAt/,"future generation must honor the recorded clean-cycle anchor rather than a midweek acceptance date");
assert.match(app,/phaseId==="build"&&\[0,1,3,4\]\.includes\(index\)/,"new Build weeks must generate exactly four strength weekdays");
assert.match(app,/phaseId==="build"&&dayIndex===2\)workoutData=coreRecoveryWorkout\(\)/,"Wednesday must retain the existing recovery workout");
assert(!/auto.?activate/i.test(build.activateSchedule.toString()));

console.log("Priority four-day Build templates, progression, transition, media, backup, and Strava tests passed.");
