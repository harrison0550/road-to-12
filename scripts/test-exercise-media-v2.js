const assert=require("assert");
const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const identities=require(path.join(root,"exercise-identity.js"));
global.ROAD12_EXERCISES=identities;
const mediaV2=require(path.join(root,"exercise-media-v2.js"));
const manifest=require(path.join(root,"exercise-media-manifest-v2.js"));
const build=require(path.join(root,"build-upper-lower-program.js"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");

const expected={
  "Smith Machine Bench Press":"road12.press.smith-bench",
  "GMWD Converging Chest Press":"road12.press.gmwd-converging-chest-press",
  "Seated Cable Chest Fly":"road12.fly.cable-seated",
  "Lat Pulldown":"road12.pull.lat-pulldown",
  "Seated Cable Row":"road12.row.seated-cable",
  "Smith Machine Squat":"road12.squat.smith-machine",
  "Smith Machine Hip Thrust":"road12.hip-thrust.smith",
  "Dumbbell Reverse Lunge":"road12.lunge.dumbbell-reverse",
  "Standing Single-Leg Cable Hamstring Curl":"road12.hamstring.cable-standing-single-leg-curl",
  "Dumbbell Lateral Raise":"road12.lateral-raise.dumbbell",
  "Seated Concentration Curl":"road12.curl.dumbbell-concentration",
  "Smith Machine Calf Raise":"road12.calf-raise.smith",
  "Cable Crunch":"road12.crunch.cable"
};
assert.strictEqual(mediaV2.VERSION,2);
Object.values(expected).forEach(id=>assert(mediaV2.records[id],`${id} pilot record must remain registered`));
const muscleMappedDefinitions=identities.definitions.filter(item=>item.id!=="road12.cooldown.treadmill-easy");
assert.strictEqual(Object.keys(mediaV2.records).length,muscleMappedDefinitions.length,"every canonical strength/core exercise needs a muscle-map record");
muscleMappedDefinitions.forEach(item=>{
  const record=mediaV2.getById(item.id);
  assert(record,`${item.name} needs canonical muscle-map metadata`);
  assert(record.primaryMuscles.length,`${item.name} needs authoritative primary muscle text`);
  assert(record.muscleHighlights.primary.length,`${item.name} needs a primary anatomical region`);
});
for(const [name,id] of Object.entries(expected)){
  assert.strictEqual(identities.resolve(name).id,id,`${name} canonical identity changed`);
  const record=mediaV2.getForName(name);
  assert(record,`${name} must have pilot metadata`);
  assert.strictEqual(record.exerciseId,id);
  assert.strictEqual(record.mediaVersion,2);
  const approved=["Smith Machine Bench Press","GMWD Converging Chest Press","Seated Cable Chest Fly","Lat Pulldown","Seated Cable Row","Smith Machine Squat","Standing Single-Leg Cable Hamstring Curl","Smith Machine Hip Thrust","Smith Machine Calf Raise","Dumbbell Lateral Raise","Seated Concentration Curl","Dumbbell Reverse Lunge","Cable Crunch"].includes(name);
  assert.strictEqual(record.status,approved?"approved":"pending-review");
  assert.strictEqual(record.approved,approved);
  assert(record.assets.poster.endsWith(`road12-v2-${record.slug}-poster.webp`));
  assert(record.assets.movementSequence.endsWith(`road12-v2-${record.slug}-sequence.webp`));
  assert(record.assets.animation.endsWith(`road12-v2-${record.slug}-motion.mp4`));
  assert(record.assets.animationFallback.endsWith(`road12-v2-${record.slug}-motion.webp`));
  assert(record.primaryMuscles.length&&record.muscleHighlights.primary.length,`${name} needs authoritative primary muscle metadata`);
  assert(Array.isArray(record.secondaryMuscles)&&Array.isArray(record.muscleHighlights.secondary));
  const v1={media:"v1.gif",mediaType:"animation"};
  const resolved=mediaV2.resolve(name,v1);
  if(approved){
    assert.strictEqual(resolved.sourceType,"app-original-v2");
    assert.strictEqual(resolved.media,record.assets.animationFallback);
    assert.strictEqual(resolved.motionPoster,record.assets.poster);
  }else assert.strictEqual(resolved,v1,`${name} must retain v1 while v2 is pending`);
}
const placeholder={media:"placeholder.svg",mediaType:"still"};
assert.strictEqual(mediaV2.resolve("Unregistered Movement",null,placeholder),placeholder,"resolution must fall back to a local placeholder after v2 and v1");
assert.strictEqual(manifest.pilotSlugs.length,13);
assert.strictEqual(manifest.plannedAssets.length,52);
assert.strictEqual(manifest.approvedAssets.length,52);
assert.deepStrictEqual(manifest.cacheAssets,[...manifest.sharedAssets,...manifest.approvedAssets]);
manifest.cacheAssets.forEach(asset=>assert(fs.existsSync(path.join(root,asset)),`${asset} must exist before entering the cache manifest`));
manifest.plannedAssets
  .filter(asset=>!manifest.approvedAssets.includes(asset))
  .forEach(asset=>assert(!manifest.cacheAssets.includes(asset),`${asset} must remain uncached until approval`));

const front=fs.readFileSync(path.join(root,"assets/exercise-library/v2/shared/muscles-front.svg"),"utf8");
const back=fs.readFileSync(path.join(root,"assets/exercise-library/v2/shared/muscles-back.svg"),"utf8");
["pectoralis_major_l","anterior_deltoid_l","lateral_deltoid_l","biceps_brachii_caput_longum_l","brachioradialis_l","rectus_abdominis_2_l","external_oblique_1_l","pectineus_l","adductor_longus_l","rectus_femoris_l"].forEach(id=>assert(front.includes(`id="${id}"`),`front SVG missing ${id}`));
["trapezius_upper_l","posterior_deltoid_l","triceps_brachii_caput_longum_l","extensor_digitorum_l","latissimus_dorsi_l","gluteus_maximus_l","gluteus_medius_1_l","biceps_femoris_l","gastrocnemius_l"].forEach(id=>assert(back.includes(`id="${id}"`),`back SVG missing ${id}`));
assert.match(app,/function muscleHighlightMarkup\(ex\)/);
assert.match(app,/EXERCISE_MEDIA_V2\?\.resolve/);
assert.match(css,/\.muscle-region\{[^}]*opacity:1/);
assert.match(css,/\.muscle-region\.primary\{[^}]*fill:#39ff14/);
assert.match(css,/\.muscle-region\.primary\{[^}]*color:#39ff14/);
assert.match(css,/\.muscle-region\{[^}]*mix-blend-mode:normal/);
assert.match(css,/\.muscle-region\.secondary\{[^}]*color:#ff4fd8[^}]*fill:#ff4fd8!important/);
assert.match(css,/rgba\(255,79,216,\.38\)/);
assert.match(front,/id="pectoralis_major_l"/);
assert.match(back,/id="triceps_brachii_caput_longum_l"/);
assert.match(css,/\.legend-primary\{color:#39ff14\}/);
assert.match(css,/\.legend-secondary\{color:#ff4fd8\}/);
assert(fs.existsSync(path.join(root,"assets/exercise-library/v2/shared/MUSCLE-MAPPER-LICENSE.txt")),"licensed anatomy source notice must ship beside the SVG assets");
assert.doesNotMatch(front,/<image\b/,"front anatomy SVG must be self-contained native vector artwork");
assert.doesNotMatch(back,/<image\b/,"back anatomy SVG must be self-contained native vector artwork");
assert.match(front,/viewBox="0 0 587 1137"/);
assert.match(back,/viewBox="0 0 596 1133"/);
assert.match(app,/legend-primary">Primary/);
assert.doesNotMatch(app,/muscle-map-legend[^\n]*class="primary"/);
assert.match(sw,/ROAD12_MEDIA_V2_MANIFEST\.cacheAssets\.forEach/);
assert.match(app,/const ROAD12_SCHEMA_VERSION=21;/);

const buildNames=new Set(Object.values(build.TEMPLATES).flatMap(template=>template.exercises.map(exercise=>exercise.name)));
Object.keys(expected).forEach(name=>assert(buildNames.has(name),`${name} must remain present in the unchanged Build templates`));
Object.values(build.TEMPLATES).flatMap(template=>template.exercises).filter(exercise=>exercise.sets).forEach(exercise=>{
  assert(mediaV2.getForName(exercise.name),`${exercise.name} needs Muscles Worked anatomy in active Build programming`);
});
console.log("Exercise Media Library v2 tests passed: every canonical strength/core exercise and active Build movement has muscle-map metadata; approved media, fallbacks, offline manifest safety, and schema 21 are intact.");
