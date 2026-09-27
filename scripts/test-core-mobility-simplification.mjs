import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {createRequire} from "node:module";
import {fileURLToPath} from "node:url";
import {ALLOWED_EXERCISES,validateUploadPayload} from "../worker/strava/src/contract.mjs";

const require=createRequire(import.meta.url);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const identities=require(path.join(root,"exercise-identity.js"));
const payloads=require(path.join(root,"strava-strength-payload.js"));
const backup=require(path.join(root,"backup-restore.js"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");

const lowerSource=app.slice(app.indexOf("function lowerAbsProgramExercises("),app.indexOf("function pelvicFloorRelaxationBlock("));
const lowerContext={currentLowerAbsPhase:()=>2,cloneExerciseByName:name=>({clonedFrom:name})};
vm.runInNewContext(`${lowerSource};this.result=lowerAbsProgramExercises(2);`,lowerContext);
const phase2=JSON.parse(JSON.stringify(lowerContext.result));
assert.deepEqual(phase2.map(item=>item.name),["Seated Bench Knee Tuck","Decline Bench Reverse Crunch","Kettlebell Suitcase Carry"]);
const tuck=phase2[0],carry=phase2[2];
assert.equal(tuck.sets,3);assert.equal(tuck.reps,"10-15");assert.deepEqual(tuck.targetRirRange,[2,3]);
assert.equal(tuck.requires[0],"bench");assert.equal(tuck.demoImage,"assets/placeholders/core-activation.svg");
assert.equal(carry.sets,3);assert.equal(carry.reps,"30-45");assert.equal(carry.repUnit,"seconds");
assert.equal(carry.weightEntry.mode,"total");assert.equal(carry.weightEntry.label,"Single kettlebell weight");
for(const text of ["Hold one kettlebell at one side","Stand tall with ribs stacked over the pelvis","Walk slowly and under control.","Switch sides each set.","Stop if it causes back or hip discomfort."])
  assert(app.includes(text),`missing suitcase-carry guidance: ${text}`);
for(const text of ["Sit near the edge of the bench","Hold the bench lightly with both hands for support","Lean the torso back slightly while keeping a neutral spine","Draw both knees toward the chest under control.","Extend the legs without letting the feet rest on the floor.","Avoid swinging or using momentum.","Progress later by holding a light kettlebell at the chest if needed."])
  assert(app.includes(text),`missing knee-tuck guidance: ${text}`);

const mobilitySource=app.slice(app.indexOf("function pelvicFloorRelaxationBlock("),app.indexOf("function cardioMobilityWorkout("));
for(const removed of ["Supine Diaphragmatic Breathing","Wide-Knee Child's Pose Breathing","Happy Baby Pelvic Floor Stretch","90/90 Hip Switch"])
  assert(!mobilitySource.includes(removed),`${removed} remains in a future template`);
const coreSource=app.slice(app.indexOf("function coreRecoveryWorkout("),app.indexOf("function zone2CardioWorkout("));
assert(coreSource.includes('cloneExerciseByName("Easy Treadmill Cooldown"'));
assert(!coreSource.includes("Slow Breathing Cooldown"));

const dataContext={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"data.js"),"utf8"),dataContext);
const cooldown=dataContext.window.WORKOUT_DATA.find(item=>item.name==="Easy Treadmill Cooldown");
assert.equal(cooldown.duration,"5:00");
assert.deepEqual(JSON.parse(JSON.stringify(cooldown.setup)),["Speed: approximately 2–3 mph","Incline: 0–1%","Use the rails only when needed"]);
assert.match(cooldown.why,/gradually lowers heart rate and transitions you out of training/i);

assert.equal(identities.resolve("Seated Bench Knee Tuck").id,"road12.core.seated-bench-knee-tuck");
assert.equal(identities.resolve("Seated Bench Knee Tuck").externalMappings.strava.exerciseType,"CORE_GENERIC");
assert.equal(identities.resolve("Kettlebell Suitcase Carry").id,"road12.carry.kettlebell-suitcase");
assert.equal(identities.resolve("Kettlebell Suitcase Carry").externalMappings.strava.exerciseType,"SUITCASE_CARRY");
assert.equal(identities.resolve("Easy Treadmill Cooldown").id,"road12.cooldown.treadmill-easy");
assert.deepEqual(payloads.normalizeExternalLoadLb(carry,{weight:30}),{loadLb:30,rule:"recorded-total"});
assert(ALLOWED_EXERCISES.has("CORE_GENERIC"));assert(ALLOWED_EXERCISES.has("SUITCASE_CARRY"));
const workerPayload={name:"Andy's Home Gym — Full Body A",sportType:"WeightTraining",externalId:"road12-session-core-test",dataType:"json",file:{version:"1.0",start_time:"2026-09-26T18:00:00-04:00",utc_offset:-14400,elapsed_time:1800,sets:[{exercise_type:"CORE_GENERIC",repetitions:12},{exercise_type:"SUITCASE_CARRY",duration:30,weight:13.608}]}};
assert.equal(validateUploadPayload(workerPayload).valid,true);

const historicalNames=["Hanging Knee Raise","Hanging Garhammer Raise","Slow Breathing Cooldown","Wide-Knee Child's Pose Breathing","Supine Diaphragmatic Breathing","Happy Baby Pelvic Floor Stretch","90/90 Hip Switch"];
const historicalState={schemaVersion:21,history:[{id:"legacy-core-session",name:"Core + Recovery",completionStatus:"completed",exercises:historicalNames.map((name,index)=>({name,exerciseId:identities.resolve(name).id,sets:[{setNumber:1,repetitions:10+index,weight:index,completed:true}]}))}]};
const restored=backup.validate(backup.create({version:"13.3.0",build:"historical-test"},historicalState,21),21).state;
assert.deepEqual(restored.history,historicalState.history,"backup round trip rewrote historical exercise records");
for(const name of historicalNames)assert(identities.resolve(name).id,"legacy identity resolution was removed");

const libraryContext={self:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"exercise-library.js"),"utf8"),libraryContext);
const tuckMedia=libraryContext.self.ROAD12_EXERCISE_LIBRARY.entries["Seated Bench Knee Tuck"].media;
assert.equal(tuckMedia,"assets/placeholders/core-activation.svg");
assert(fs.existsSync(path.join(root,tuckMedia)));
assert(fs.readFileSync(path.join(root,"sw.js"),"utf8").includes(`"./${tuckMedia}"`));

console.log("Core, mobility, cooldown, history, media, load, and Strava simplification tests passed.");
