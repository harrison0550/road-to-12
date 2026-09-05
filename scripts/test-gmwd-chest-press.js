const assert=require("node:assert");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const identities=require(path.join(root,"exercise-identity.js"));
const prescriptions=require(path.join(root,"workout-prescriptions.js"));
const strava=require(path.join(root,"strava-strength-payload.js"));
const coach=require(path.join(root,"adaptive-coaching.js"));
const backup=require(path.join(root,"backup-restore.js"));

const identity=identities.resolve("GMWD Converging Chest Press");
assert.equal(identity.id,"road12.press.gmwd-converging-chest-press");
assert.equal(identity.externalMappings.strava.exerciseType,"CHEST_PRESS");
assert(identities.isSupportedStravaExerciseType("CHEST_PRESS"));

assert.match(app,/function fullBodyAWorkout\(\)[\s\S]*?smithMachineBenchPressExercise\(\)/);
assert.match(app,/function fullBodyBWorkout\([^)]*useGmwdChest=true[^)]*\)[\s\S]*?gmwdConvergingChestPressExercise\(\)/);
assert.match(app,/function fullBodyCWorkout\([^)]*includeLowInclinePress=true[^)]*\)[\s\S]*?lowInclineDumbbellPressExercise\(\)/);
assert.match(app,/weightPerSide:ex\.weightEntry\?\.mode==="perSide"/);
assert.match(app,/totalExternalLoadLb:ex\.weightEntry\?\.mode==="perSide"/);

const exercise={exerciseId:identity.id,name:identity.name,displayName:identity.name,type:"strength",sets:3,reps:"10–12",rest:90,engagementTarget:"chest",progressionRirRange:[2,3],minimumProgressionExposures:3,weightEntry:{mode:"perSide",label:"Weight per side"}};
assert.equal(prescriptions.selectedLoad(exercise,{weight:25,weightPerSide:25,totalExternalLoadLb:50}),50);
assert.equal(prescriptions.basePrescription(exercise).weightUnit,"lb per side");
const normalized=strava.normalizeExternalLoadLb(exercise,{weight:25,weightPerSide:25,totalExternalLoadLb:50});
assert.deepStrictEqual(normalized,{loadLb:50,rule:"plate-loaded-per-side-combined"});

const exposure=(id,reps=10,engagement="Strong")=>({id,exercises:[{name:exercise.name,sets:[1,2,3].map(()=>({done:true,weight:25,weightPerSide:25,totalExternalLoadLb:50,reps})),feedback:{rir:2,form:"Clean",discomfort:false,muscleEngagement:{target:"chest",rating:engagement}}}]});
assert.equal(coach.exerciseRecommendation([exposure("one")],{},exercise).action,"HOLD");
assert.equal(coach.exerciseRecommendation([exposure("one"),exposure("two")],{},exercise).action,"HOLD");
const repProgress=coach.exerciseRecommendation([exposure("one"),exposure("two"),exposure("three")],{},exercise);
assert.equal(repProgress.action,"PROGRESS");
assert.equal(repProgress.prescription.reps,11,"double progression must add reps before plate load");
assert.equal(repProgress.prescription.weight,25);
const loadProgress=coach.exerciseRecommendation([exposure("one",12),exposure("two",12),exposure("three",12)],{},exercise);
assert.equal(loadProgress.prescription.weight,30,"load may increase only after the top of the rep range is achieved");
const dominance=coach.exerciseRecommendation([exposure("one"),exposure("two"),exposure("three",10,"Mostly front delts/triceps")],{},exercise);
assert.equal(dominance.action,"HOLD");
assert.match(dominance.reason,/adjust seat position, handle height, and shoulder-blade setup/i);

const state={schemaVersion:19,history:[{id:"gmwd-session",name:"Full Body B",exercises:[{exerciseId:identity.id,name:identity.name,weightEntry:exercise.weightEntry,sets:[{setNumber:1,repetitions:12,reps:12,weight:25,weightPerSide:25,totalExternalLoadLb:50,done:true,completed:true}]}]}]};
const payload=backup.create({version:"13.2.0",build:"test"},state,19);
const restored=backup.merge({},backup.validate(JSON.parse(JSON.stringify(payload)),19).state);
assert.equal(restored.history[0].exercises[0].sets[0].weightPerSide,25);
assert.equal(restored.history[0].exercises[0].sets[0].totalExternalLoadLb,50);

console.log("GMWD chest press tests passed: A/B/C assignment, per-side storage, double progression, backup, and supported Strava mapping are valid.");
