const assert=require("node:assert");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
const identities=require(path.join(root,"exercise-identity.js"));
const coach=require(path.join(root,"adaptive-coaching.js"));
const backup=require(path.join(root,"backup-restore.js"));
const strava=require(path.join(root,"strava-strength-payload.js"));

const name="Standing Single-Leg Cable Hamstring Curl";
const identity=identities.resolve(name);
assert.equal(identity.id,"road12.hamstring.cable-standing-single-leg-curl");
assert.equal(identity.externalMappings.strava.exerciseType,"STANDING_LEG_CURL");
assert(identities.isSupportedStravaExerciseType("STANDING_LEG_CURL"));
assert.equal(identities.resolve("Dumbbell Romanian Deadlift").id,"road12.deadlift.dumbbell-rdl","historical RDL identity must remain intact");

assert.match(app,/name:"Standing Single-Leg Cable Hamstring Curl",sets:3,reps:"10-15",rest:60,unilateral:true/);
assert.match(app,/targetRirRange:\[2,3\],progressionModel:"double-progression",minimumProgressionExposures:2/);
assert.match(app,/weightEntry:\{mode:"single",label:"Weight selected on one stack"[\s\S]*?do not double or combine the load/);
assert.match(app,/if\(!useCableHamstringCurl\)return[\s\S]*?name:"Dumbbell Romanian Deadlift"[\s\S]*?return Object\.assign[\s\S]*?name:"Standing Single-Leg Cable Hamstring Curl"/);
assert.match(app,/return Object\.assign\(cloneExerciseByName\("Cable Curl"\),shared,\{\s*name:"Standing Single-Leg Cable Hamstring Curl"/,"new movement must inherit a cable-strength template, not hip-hinge semantics");
assert.match(app,/const useCableHamstringCurl=!activeSession\|\|state\.currentSession\.programRevision===FOUNDATION_PROGRAM_REVISION/);
assert.match(app,/dumbbellAccessoryForDay\(dayIndex,useCableHamstringCurl\)/);
assert.match(app,/\["ankleStrap","Ankle \/ Velcro strap","Used for standing single-leg cable hamstring curls\."\]/);

const exercise={exerciseId:identity.id,name,type:"strength",sets:3,reps:"10-15",unilateral:true,requires:["ritfitM1"],weightEntry:{mode:"single",label:"Weight selected on one stack"}};
assert.deepStrictEqual(strava.normalizeExternalLoadLb(exercise,{weight:25,repetitions:12,completed:true}),{loadLb:25,rule:"single-stack"});

const legacyHistory=[{id:"rdl-old",name:"Full Body C",exercises:[{exerciseId:"road12.deadlift.dumbbell-rdl",name:"Dumbbell Romanian Deadlift",sets:[{done:true,weight:30,reps:12}]}]}];
const fresh=coach.exerciseRecommendation(legacyHistory,{},exercise);
assert.equal(fresh.action,"BUILD");
assert.equal(fresh.prescription.weight,null,"RDL weight must not seed the cable exercise");
const exposure=(id,reps=10,weight=20)=>({id,name:"Full Body C",exercises:[{exerciseId:identity.id,name,sets:[1,2,3].map(()=>({done:true,weight,reps})),feedback:{rir:3,form:"Clean",discomfort:false}}]});
assert.equal(coach.exerciseRecommendation([exposure("one")],{},exercise).action,"HOLD","first cable exposure is calibration");
const progressed=coach.exerciseRecommendation([exposure("one"),exposure("two")],{},exercise);
assert.equal(progressed.action,"PROGRESS");
assert.equal(progressed.prescription.reps,11);
assert.equal(progressed.prescription.weight,20);

const state={schemaVersion:18,history:[...legacyHistory,{id:"curl-new",name:"Full Body C",exercises:[{exerciseId:identity.id,name,unilateral:true,weightEntry:exercise.weightEntry,sets:[{setNumber:1,repetitions:12,reps:12,weight:25,done:true,completed:true}]}]}]};
const payload=backup.create({version:"13.2.0",build:"test"},state,18);
const restored=backup.merge({},backup.validate(JSON.parse(JSON.stringify(payload)),18).state);
assert.equal(restored.history[0].exercises[0].name,"Dumbbell Romanian Deadlift");
assert.equal(restored.history[0].exercises[0].sets[0].weight,30);
assert.equal(restored.history[1].exercises[0].exerciseId,identity.id);
assert.equal(restored.history[1].exercises[0].weightEntry.mode,"single");
assert.equal(restored.history[1].exercises[0].sets[0].weight,25);

for(const file of ["standing-single-leg-cable-hamstring-curl-guide.png","standing-single-leg-cable-hamstring-curl-sequence.png"]){
  const relative=`assets/exercise-library/generated/${file}`;
  assert(fs.existsSync(path.join(root,relative)),`${file} must exist`);
  assert(sw.includes(`./${relative}`),`${file} must be cached offline`);
}

console.log("Cable hamstring curl tests passed: targeted replacement, revision safety, independent history, single-stack load, progression, backup, assets, and Strava mapping are valid.");
