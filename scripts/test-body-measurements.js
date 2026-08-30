const assert=require("assert");
const fs=require("fs");
const path=require("path");
const body=require("../body-measurements.js");
const coach=require("../adaptive-coaching.js");
const root=path.resolve(__dirname,"..");

assert.deepStrictEqual(body.SOURCES,["manual","wyze-import","apple-health"]);
assert.deepStrictEqual(Object.keys(body.adapters),["manual","wyze-import","apple-health"]);
const complete=body.adapters["wyze-import"].adapt({
  id:"wyze-1",timestamp:"2026-08-29T12:00:00.000Z",weight:200,bodyFatPercent:20,fatMass:40,
  leanBodyMass:160,muscleMass:150,skeletalMuscleMass:80,skeletalMusclePercent:40,
  bodyWaterPercent:55,subcutaneousFatPercent:15,visceralFat:9,proteinPercent:18,BMR:1900,
  metabolicAge:40,BMI:27,waist:39
});
[
  "weight","bodyFatPercent","fatMass","leanBodyMass","muscleMass","skeletalMuscleMass",
  "skeletalMusclePercent","bodyWaterPercent","subcutaneousFatPercent","visceralFat",
  "proteinPercent","BMR","metabolicAge","BMI","waist"
].forEach(field=>assert.strictEqual(typeof complete[field],"number",`${field} must be retained`));
assert.strictEqual(complete.source,"wyze-import");
assert.throws(()=>body.adapt("wyze-bluetooth",{timestamp:new Date().toISOString(),weight:200}),/unsupported/i);
assert.strictEqual(body.adapters.manual.adapt({timestamp:"bad",weight:200}),null);

const records=[
  body.adapt("manual",{timestamp:"2026-08-23T12:00:00.000Z",weight:200,waist:40}),
  body.adapt("apple-health",{timestamp:"2026-08-25T12:00:00.000Z",weight:204}),
  body.adapt("wyze-import",{timestamp:"2026-08-29T12:00:00.000Z",weight:202,waist:39})
];
assert.deepStrictEqual(body.current(records,{weight:221,waist:43}),{weight:202,waist:39});
assert.deepStrictEqual(body.current([records[1]],{weight:221,waist:43}),{weight:204,waist:43},"newest values are derived independently and legacy summaries remain valid fallbacks");
const average=body.rollingAverage(records,"weight",7,"2026-08-29T13:00:00.000Z");
assert.strictEqual(average.average,202);
assert.strictEqual(average.count,3);
assert.strictEqual(body.trend(records,"waist",30,"2026-08-29T13:00:00.000Z").change,-1);

const readinessInput={history:[],ratings:{},sessions:[],today:"2026-08-29",cardio:[]};
const stable=coach.phaseReadiness({...readinessInput,measurements:[{weight:200},{weight:200},{weight:200},{weight:200}]});
const volatile=coach.phaseReadiness({...readinessInput,measurements:[{weight:180},{weight:240},{weight:175},{weight:250}]});
assert.strictEqual(volatile.score,stable.score,"single-day scale values must not alter training readiness");

const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.match(app,/const ROAD12_SCHEMA_VERSION=18;/);
assert.match(app,/version:16,[\s\S]*?bodyMeasurements[\s\S]*?fromLegacy[\s\S]*?schemaVersion=16;/);
assert.match(app,/road12Storage\.migrate\(window\.ROAD12_BACKUP\.merge/,"older backup imports must migrate before replacing live state");
assert.match(app,/adapters\.manual\.adapt[\s\S]*?state\.bodyMeasurements\.push[\s\S]*?state\.measurementHistory\.push/);
assert.match(app,/7-DAY WEIGHT AVERAGE/);
assert.match(app,/7-DAY CHANGE/);
assert.match(index,/src="body-measurements\.js(?:\?build=[^"]+)?"/);
assert(sw.includes('"./body-measurements.js"'));

console.log("body measurement tests passed: canonical adapters, migration, rolling trends, compatibility, and readiness isolation are intact");
