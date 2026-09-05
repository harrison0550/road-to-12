const assert=require("node:assert");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const identities=require(path.join(root,"exercise-identity.js"));
const coach=require(path.join(root,"adaptive-coaching.js"));
const backup=require(path.join(root,"backup-restore.js"));
const strava=require(path.join(root,"strava-strength-payload.js"));

const identity=identities.resolve("Seated Concentration Curl");
assert.equal(identity.id,"road12.curl.dumbbell-concentration");
assert.equal(identity.externalMappings.strava.exerciseType,"STANDING_DUMBBELL_BICEPS_CURL");
assert(identities.isSupportedStravaExerciseType(identity.externalMappings.strava.exerciseType));
assert.equal(identities.resolve("Behind-the-Back Single-Arm Cable Curl").id,"road12.curl.cable-behind-back-single-arm","legacy identity must remain readable");

assert.match(app,/function seatedConcentrationCurlExercise\(\)[\s\S]*?name:"Seated Concentration Curl"[\s\S]*?sets:2,reps:"10-15",rest:60/);
assert.match(app,/unilateral:true[\s\S]*?targetRirRange:\[2,3\],progressionModel:"double-progression"/);
assert.match(app,/weightEntry:\{mode:"total",paired:false,label:"One dumbbell weight"[\s\S]*?do not combine both arms/);
assert.match(app,/useConcentrationCurl\?seatedConcentrationCurlExercise\(\):behindBackCableCurlExercise\(\)/);
assert.match(app,/const useConcentrationCurl=!activeSession\|\|state\.currentSession\.programRevision===FOUNDATION_PROGRAM_REVISION/);

const exercise={exerciseId:identity.id,name:identity.name,displayName:identity.name,type:"strength",sets:2,reps:"10-15",rest:60,requires:["dumbbells","bench"],weightEntry:{mode:"total",paired:false,label:"One dumbbell weight"}};
const normalized=strava.normalizeExternalLoadLb(exercise,{weight:20,completed:true,repetitions:12});
assert.deepStrictEqual(normalized,{loadLb:20,rule:"recorded-total"},"one dumbbell must not be doubled");

const exposure=(id,reps=10,weight=20)=>({id,exercises:[{name:exercise.name,sets:[1,2].map(()=>({done:true,weight,reps})),feedback:{rir:3,form:"Clean",discomfort:false}}]});
const repProgress=coach.exerciseRecommendation([exposure("one"),exposure("two")],{},exercise);
assert.equal(repProgress.action,"PROGRESS");
assert.equal(repProgress.prescription.reps,11,"double progression must add reps before load");
assert.equal(repProgress.prescription.weight,20);
const loadProgress=coach.exerciseRecommendation([exposure("one",15),exposure("two",15)],{},exercise);
assert.equal(loadProgress.prescription.weight,25,"single-dumbbell progression must use the next owned dumbbell, not a paired total");

const state={schemaVersion:18,history:[{id:"curl-session",name:"Full Body C",exercises:[{exerciseId:identity.id,name:identity.name,displayName:identity.name,unilateral:true,weightEntry:exercise.weightEntry,sets:[{setNumber:1,repetitions:12,reps:12,weight:20,done:true,completed:true}]}]}]};
const payload=backup.create({version:"13.2.0",build:"test"},state,18);
const restored=backup.merge({},backup.validate(JSON.parse(JSON.stringify(payload)),18).state);
const restoredExercise=restored.history[0].exercises[0];
assert.equal(restoredExercise.exerciseId,identity.id);
assert.equal(restoredExercise.weightEntry.paired,false);
assert.equal(restoredExercise.sets[0].weight,20);

console.log("Seated concentration curl tests passed: identity, replacement, single-dumbbell load, progression, backup, and supported Strava mapping are valid.");
