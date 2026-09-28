const assert=require("node:assert");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const root=path.resolve(__dirname,"..");
const build=require(path.join(root,"build-upper-lower-program.js"));
const identities=require(path.join(root,"exercise-identity.js"));
const payloads=require(path.join(root,"strava-strength-payload.js"));
global.ROAD12_EXERCISES=identities;
const mediaV2=require(path.join(root,"exercise-media-v2.js"));
const manifest=require(path.join(root,"exercise-media-manifest-v2.js"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const libraryContext={self:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"exercise-library.js"),"utf8"),libraryContext,{filename:"exercise-library.js"});
const library=libraryContext.self.ROAD12_EXERCISE_LIBRARY.entries;

const displayName="Seated Cable Chest Fly";
const identity=identities.resolve(displayName);
assert.strictEqual(identity.id,"road12.fly.cable-seated");
assert.strictEqual(identity.externalMappings.strava.exerciseType,null,"no supported fly token exists in the app/Worker contract");
for(const alias of ["Cable Seated Chest Fly","Seated Chest Fly","Seated Cable Fly","Chest Fly (Seated Cable)"]){
  assert.strictEqual(identities.resolve(alias).id,identity.id,`${alias} must resolve to the canonical fly`);
}

const metadata=library[displayName];
assert(metadata,"the Exercise Library must expose movement metadata");
assert.deepStrictEqual(Array.from(metadata.primaryMuscles),["Chest"]);
assert.deepStrictEqual(Array.from(metadata.secondaryMuscles),["Front delts","Serratus anterior","Biceps stabilizer"]);
assert.strictEqual(metadata.mediaType,"text","unreviewed media must use the written-guide fallback");
assert.strictEqual(metadata.media,undefined,"unreviewed media must not be activated");
assert.match(app,/function seatedCableChestFlyExercise\(\)/);
assert.match(app,/mode:"dual",label:"Weight selected on each stack"/);
assert.match(app,/Bring both handles together in front of the chest in a wide hugging arc/);

const upperB=build.TEMPLATES.UPPER_B;
const working=upperB.exercises.filter(item=>item.sets);
const incline=working.find(item=>item.name==="Low-Incline Dumbbell Press");
const fly=working.find(item=>item.name===displayName);
assert.deepStrictEqual([incline.sets,incline.reps],[3,"10–15"]);
assert.deepStrictEqual([fly.sets,fly.reps,fly.rest,Array.from(fly.targetRirRange)],[2,"12–15",60,[2,3]]);
assert.strictEqual(build.strengthSetCount(upperB),22);
assert.strictEqual(upperB.time,"65–75 min","the approved duration band must still cover the one-net-set change");
assert.strictEqual(build.weeklyPrimarySets().chest,13);
assert.deepStrictEqual(["UPPER_A","LOWER_A","LOWER_B"].map(key=>build.strengthSetCount(build.TEMPLATES[key])),[22,19,20]);
assert.strictEqual(build.validation.valid,true,build.validation.errors.join("\n"));

const normalized=payloads.normalizeExternalLoadLb({name:displayName,exerciseId:identity.id,weightEntry:{mode:"dual"}},{weight:25});
assert.deepStrictEqual(normalized,{loadLb:50,rule:"dual-stack-combined"});
const completed=(name,mode,weight)=>({name,displayName:name,exerciseId:identities.resolve(name).id,weightEntry:{mode},sets:[{setType:"working",repetitions:12,weight,completed:true,skipped:false}]});
const preview=payloads.buildStravaStrengthPayload({
  id:"fly-strava-regression",name:"Upper B",templateId:"build-upper-b",completionStatus:"completed",
  startedAt:"2026-09-27T14:00:00.000Z",endedAt:"2026-09-27T15:00:00.000Z",utcOffsetSeconds:-14400,
  externalSync:{strava:{externalId:"road12-fly-strava-regression"}},
  exercises:[completed("Low-Incline Dumbbell Press","total",40),completed(displayName,"dual",25)]
});
assert.strictEqual(preview.ready,true,"an unmapped fly must not block the rest of an eligible upload");
assert.strictEqual(preview.summary.mappedExercises,1);
assert.strictEqual(preview.summary.unmappedExercises,1);
assert.strictEqual(preview.file.sets.length,1,"only the unsupported fly sets should be excluded");
assert(preview.warnings.some(item=>item.code==="UNMAPPED_EXERCISE"&&item.exerciseName===displayName));

const v2=mediaV2.getById(identity.id);
assert(v2);
assert.strictEqual(v2.slug,"seated-cable-chest-fly");
assert.strictEqual(v2.status,"approved");
assert.strictEqual(v2.approved,true);
assert.deepStrictEqual(Array.from(v2.muscleHighlights.primary),["chest"]);
assert.deepStrictEqual(Array.from(v2.muscleHighlights.secondary),["front-deltoid","biceps"]);
v2.assets&&Object.values(v2.assets).forEach(asset=>assert(manifest.cacheAssets.includes(asset),`${asset} must be cached after approval`));
assert.strictEqual(mediaV2.resolve(displayName,metadata).sourceType,"app-original-v2","approved v2 media must override written guidance");

assert.match(app,/const ROAD12_SCHEMA_VERSION=21;/);
console.log("Seated Cable Chest Fly identity, Build programming, dual-load semantics, graceful Strava exclusion, and approved offline Media v2 tests passed.");
