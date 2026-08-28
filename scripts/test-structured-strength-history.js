const assert=require("assert");
const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const identities=require(path.join(root,"exercise-identity.js"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");

assert.strictEqual(identities.resolve("Smith Machine Squat").id,"road12.squat.smith-machine");
assert.strictEqual(identities.resolve("Lat Pull Down").id,"road12.pull.lat-pulldown");
assert.strictEqual(identities.resolve("Cable Hammer Curl").externalMappings.strava.exerciseType,"CABLE_HAMMER_CURL");
assert.strictEqual(identities.resolve("Smith Machine Single-Leg Squat").id,"road12.lunge.smith-bulgarian");
assert.strictEqual(identities.resolve("Smith Bulgarian Split Squat").id,"road12.lunge.smith-bulgarian","legacy split-squat history must retain its stable identity");
assert.strictEqual(identities.resolve("V-Bar Triceps Pushdown").id,"road12.triceps.v-bar-pushdown");
assert.strictEqual(identities.resolve("Kettlebell Swing").id,"road12.hinge.kettlebell-swing");
assert.strictEqual(identities.resolve("Kettlebell Around the World").id,"road12.core.kettlebell-around-world");
assert.strictEqual(identities.resolve("Kettlebell Suitcase Carry").id,"road12.carry.kettlebell-suitcase");
assert.strictEqual(identities.resolve("Future Movement").id,"road12.exercise.future-movement");
assert.match(app,/ROAD12_SCHEMA_VERSION=15/);
assert.match(app,/version:11,[\s\S]*?exerciseTimings[\s\S]*?schemaVersion=11/);
[
  "exerciseId:identity.id","basePrescription","prescription:effectivePrescription","setNumber:setIndex+1","repetitions:Number(set?.reps)",
  "weightUnit:\"lb\"","startedAt:set?.startedAt","completedAt:set?.completedAt","status:set?.done",
  "externalSync={strava:{status:\"NOT_SYNCED\"","actualPerformance=sessionTotals(session)"
].forEach(fragment=>assert(app.includes(fragment),`missing structured-history fragment: ${fragment}`));
assert.match(index, /<script src="exercise-identity\.js(?:\?build=[^"]+)?"><\/script>/);
assert(sw.includes('"./exercise-identity.js"'));
assert(!/client_secret|STRAVA_CLIENT_SECRET|access_token\s*[:=]\s*["'][^"']+/i.test([app,index,sw].join("\n")),"browser bundle must not contain Strava credentials");
console.log("Structured strength history tests passed.");
