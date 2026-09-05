const assert=require("assert");
const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const identities=require(path.join(root,"exercise-identity.js"));
const payloads=require(path.join(root,"strava-strength-payload.js"));
const sync=require(path.join(root,"strava-sync-state.js"));

const mapped=identities.definitions.filter(item=>item.externalMappings.strava.exerciseType);
assert.strictEqual(identities.definitions.length,40,"canonical identity coverage changed unexpectedly");
assert.strictEqual(mapped.length,40,"every canonical exercise should have a reviewed Phase 1 mapping");
mapped.forEach(item=>assert(
  identities.isSupportedStravaExerciseType(item.externalMappings.strava.exerciseType),
  `${item.name} uses a Strava token outside the canonical allowlist`
));
assert.strictEqual(identities.isSupportedStravaExerciseType("BENCH_PRES_TYPO"),false);
assert.strictEqual(identities.resolve("Cable Chest Press").id,"road12.press.cable-chest","legacy cable press identity was removed");
assert.strictEqual(identities.resolve("Incline Cable Press").id,"road12.press.incline-cable","legacy incline press identity was removed");
assert.strictEqual(identities.resolve("Smith Bulgarian Split Squat").id,"road12.lunge.smith-bulgarian","legacy split-squat alias was removed");

const completedSet=(repetitions,weight,extra={})=>Object.assign({
  setType:"working",repetitions,weight,completed:true,skipped:false
},extra);
const exercise=(name,weightEntry,sets,extra={})=>Object.assign({
  exerciseId:identities.resolve(name).id,name,displayName:name,category:"strength",weightEntry,sets
},extra);
const fullBodySession=(name="Full Body C")=>({
  id:"session-full-body-c",
  name,
  completionStatus:"completed",
  startedAt:"2026-08-29T21:00:00.000Z",
  endedAt:"2026-08-29T22:00:00.000Z",
  elapsedDurationMs:3600000,
  utcOffsetSeconds:-14400,
  externalSync:{strava:{externalId:"road12-session-full-body-c",status:"NOT_SYNCED"}},
  privateNote:"never publish this private note",
  bodyFat:25,
  exercises:[
    exercise("Smith Machine Hip Thrust",{mode:"total"},[
      completedSet(10,100,{setNumber:1}),
      completedSet(10,100,{setNumber:2,setType:"activation"}),
      completedSet(8,100,{setNumber:3,setType:"warmup"}),
      completedSet(10,100,{setNumber:4,skipped:true}),
      completedSet("12-15",100,{setNumber:5}),
      {setNumber:6,setType:"working",repetitions:10,weight:100,completed:false,skipped:false}
    ],{progressionPrescription:{private:true},feedback:{rir:2,discomfort:"none"}}),
    exercise("Dumbbell Romanian Deadlift",{mode:"total",paired:true},[completedSet(12,50)]),
    exercise("Cable Shoulder Press",{mode:"dual"},[completedSet(10,55)]),
    exercise("Cable Curl",{mode:"single"},[completedSet(10,30)]),
    exercise("Lying Leg Raise",{mode:"bodyweight"},[completedSet(12,0)]),
    exercise("Future Movement",{mode:"bodyweight"},[completedSet(8,0)])
  ]
});

["Full Body A","Full Body B","Full Body C"].forEach(name=>assert.strictEqual(payloads.isSessionStravaEligible(fullBodySession(name)),true,`${name} should be eligible`));
assert.strictEqual(payloads.isSessionStravaEligible(fullBodySession("Core + Recovery")),false);
assert.strictEqual(payloads.isSessionStravaEligible(fullBodySession("Treadmill Cardio")),false);
assert.strictEqual(payloads.isSessionStravaEligible({...fullBodySession("Full Body A"),completionStatus:"inProgress"}),false);
assert.strictEqual(payloads.isSessionStravaEligible({...fullBodySession("Full Body B"),completionStatus:"abandoned"}),false);
assert.strictEqual(payloads.isSessionStravaEligible({...fullBodySession("Full Body C"),exercises:[]}),false);

assert.deepStrictEqual(payloads.normalizeExternalLoadLb(exercise("Smith Machine Squat",{mode:"total"},[]),{weight:100}),{loadLb:133,rule:"smith-total-plates-plus-bar"});
assert.deepStrictEqual(payloads.normalizeExternalLoadLb(exercise("Dumbbell Romanian Deadlift",{mode:"total",paired:true},[]),{weight:50}),{loadLb:50,rule:"paired-dumbbells-combined"});
assert.deepStrictEqual(payloads.normalizeExternalLoadLb(exercise("Cable Shoulder Press",{mode:"dual"},[]),{weight:55}),{loadLb:110,rule:"dual-stack-combined"});
assert.deepStrictEqual(payloads.normalizeExternalLoadLb(exercise("Cable Curl",{mode:"single"},[]),{weight:30}),{loadLb:30,rule:"single-stack"});
assert.deepStrictEqual(payloads.normalizeExternalLoadLb(exercise("Lying Leg Raise",{mode:"bodyweight"},[]),{weight:200}),{loadLb:null,rule:"bodyweight"});
assert.deepStrictEqual(payloads.normalizeExternalLoadLb(exercise("Cable Curl",{mode:"single"},[]),{weight:""}),{loadLb:null,rule:"missing"});
assert.strictEqual(payloads.lbToKg(50),22.68);
assert.strictEqual(payloads.lbToKg(133),60.328);

const session=fullBodySession();
const preview=payloads.buildStravaStrengthPayload(session);
assert.strictEqual(preview.name,"Andy's Home Gym — Full Body C");
assert.strictEqual(preview.sportType,"WeightTraining");
assert.strictEqual(preview.externalId,"road12-session-full-body-c");
assert.strictEqual(preview.eligible,true);
assert.strictEqual(preview.ready,true);
assert.strictEqual(preview.summary.completedSets,6,"only valid completed working sets should count");
assert.strictEqual(preview.summary.totalReps,62);
assert.strictEqual(preview.summary.mappedExercises,5);
assert.strictEqual(preview.summary.unmappedExercises,1);
assert.strictEqual(preview.file.sets.length,5,"unmapped exercises must remain in preview but not the API set list");
assert.strictEqual(preview.file.sets[0].exercise_type,"BARBELL_HIP_THRUST_WITH_BENCH");
assert.strictEqual(preview.file.sets[0].weight,60.328);
assert.strictEqual(preview.file.sets.find(item=>item.exercise_type==="DUMBBELL_ROMANIAN_DEADLIFTS").weight,22.68);
assert.strictEqual(preview.file.sets.find(item=>item.exercise_type==="SHOULDER_PRESS_GENERIC").weight,49.895);
assert.strictEqual(preview.file.sets.find(item=>item.exercise_type==="CABLE_BICEPS_CURL").weight,13.608);
const bodyweightSet=preview.file.sets.find(item=>item.exercise_type==="LYING_STRAIGHT_LEG_RAISE");
assert.strictEqual(bodyweightSet.repetitions,12);
assert.strictEqual(Object.hasOwn(bodyweightSet,"weight"),false,"bodyweight must not fabricate external load");
assert(preview.warnings.some(item=>item.code==="UNMAPPED_EXERCISE"&&item.exerciseName==="Future Movement"));
assert(preview.warnings.some(item=>item.code==="INCOMPLETE_SET_DATA"&&item.exerciseName==="Smith Machine Hip Thrust"));
const serialized=JSON.stringify(preview).toLowerCase();
["bodyfat","body fat","road to 12%","rir","discomfort","progressionprescription","private note"].forEach(value=>assert(!serialized.includes(value),`payload leaked private value: ${value}`));

const historical=fullBodySession("Full Body A");
historical.exercises=[exercise("Smith Machine Squat",{mode:"total"},[{setType:"working",reps:"10",weight:70,done:true}])];
assert.strictEqual(payloads.buildStravaStrengthPayload(historical).ready,true,"sufficient legacy set fields should remain previewable without rewriting history");

assert.deepStrictEqual(sync.ALLOWED_TRANSITIONS.NOT_SYNCED,["QUEUED"]);
assert.strictEqual(sync.canTransition("NOT_SYNCED","QUEUED"),true);
assert.strictEqual(sync.canTransition("QUEUED","SYNCING"),true);
assert.strictEqual(sync.canTransition("SYNCING","SYNCED"),true);
assert.strictEqual(sync.canTransition("SYNCING","FAILED"),true);
assert.strictEqual(sync.canTransition("FAILED","QUEUED"),true);
assert.strictEqual(sync.canTransition("SYNCED","NOT_SYNCED"),false);
assert.throws(()=>sync.transition({status:"SYNCED"},"NOT_SYNCED"),/cannot transition/);
const mergedSync=sync.mergeRecords(
  {status:"SYNCED",activityId:"activity-1",uploadId:"upload-1",uploadedAt:"2026-08-29T22:01:00.000Z",lastError:null,externalId:"road12-session-1"},
  {status:"NOT_SYNCED",activityId:null,lastError:"Older offline error",externalId:"road12-session-1"}
);
assert.strictEqual(mergedSync.status,"SYNCED");
assert.strictEqual(mergedSync.activityId,"activity-1");
assert.strictEqual(mergedSync.uploadId,"upload-1");
assert.strictEqual(mergedSync.lastError,"Older offline error","merge must preserve richer provider diagnostics without downgrading status");

const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert.match(index,/strava-sync-state\.js[^"]*"><\/script><script src="strava-data-boundary\.js[^"]*"><\/script><script src="strava-strength-payload\.js/);
assert(sw.includes('"./strava-sync-state.js"')&&sw.includes('"./strava-strength-payload.js"'),"Phase 1 modules must remain available offline");
assert(app.includes("Preview Strava Post")&&app.includes("Preview only — nothing has been sent to Strava."));
const phaseOnePureModules=[fs.readFileSync(path.join(root,"strava-strength-payload.js"),"utf8"),fs.readFileSync(path.join(root,"strava-sync-state.js"),"utf8")].join("\n");
assert(!/fetch\s*\(|oauth|access_token|refresh_token|client_secret|\/api\/v3\/uploads/i.test(phaseOnePureModules),"Phase 1 payload and sync-state modules must remain pure and local-only");
const publicBrowserBundle=[app,index,sw,fs.readFileSync(path.join(root,"strava-client.js"),"utf8"),fs.readFileSync(path.join(root,"strava-config.js"),"utf8")].join("\n");
assert(!/STRAVA_CLIENT_SECRET|client_secret|refresh_token|access_token|www\.strava\.com\/oauth|www\.strava\.com\/api\/v3\/uploads/i.test(publicBrowserBundle),"the public PWA must not contain provider credentials or call Strava directly");
console.log("Strava Phase 1 tests passed.");
