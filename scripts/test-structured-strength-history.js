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
assert.strictEqual(identities.resolve("Future Movement").id,"road12.exercise.future-movement");
assert.match(app,/ROAD12_SCHEMA_VERSION=11/);
assert.match(app,/version:11,[\s\S]*?exerciseTimings[\s\S]*?schemaVersion=11/);
[
  "exerciseId:identity.id","prescription:{sets:","setNumber:setIndex+1","repetitions:Number(set?.reps)",
  "weightUnit:\"lb\"","startedAt:set?.startedAt","completedAt:set?.completedAt","status:set?.done",
  "externalSync={strava:{status:\"NOT_SYNCED\"","actualPerformance=sessionTotals(session)"
].forEach(fragment=>assert(app.includes(fragment),`missing structured-history fragment: ${fragment}`));
assert(index.includes('<script src="exercise-identity.js"></script>'));
assert(sw.includes('"./exercise-identity.js"'));
assert(!/client_secret|STRAVA_CLIENT_SECRET|access_token\s*[:=]\s*["'][^"']+/i.test([app,index,sw].join("\n")),"browser bundle must not contain Strava credentials");
console.log("Structured strength history tests passed.");
