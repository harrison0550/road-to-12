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
assert.deepStrictEqual(Object.keys(mediaV2.records).sort(),Object.values(expected).sort());
for(const [name,id] of Object.entries(expected)){
  assert.strictEqual(identities.resolve(name).id,id,`${name} canonical identity changed`);
  const record=mediaV2.getForName(name);
  assert(record,`${name} must have pilot metadata`);
  assert.strictEqual(record.exerciseId,id);
  assert.strictEqual(record.mediaVersion,2);
  const approved=["Smith Machine Bench Press","Seated Cable Chest Fly"].includes(name);
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
assert.strictEqual(manifest.approvedAssets.length,8);
assert.deepStrictEqual(manifest.cacheAssets,[...manifest.sharedAssets,...manifest.approvedAssets]);
manifest.cacheAssets.forEach(asset=>assert(fs.existsSync(path.join(root,asset)),`${asset} must exist before entering the cache manifest`));
manifest.plannedAssets
  .filter(asset=>!manifest.approvedAssets.includes(asset))
  .forEach(asset=>assert(!manifest.cacheAssets.includes(asset),`${asset} must remain uncached until approval`));

const front=fs.readFileSync(path.join(root,"assets/exercise-library/v2/shared/muscles-front.svg"),"utf8");
const back=fs.readFileSync(path.join(root,"assets/exercise-library/v2/shared/muscles-back.svg"),"utf8");
["chest","front-deltoid","lateral-deltoid","biceps","brachialis","forearms","abdominals","obliques","hip-flexors","adductors","quadriceps","calves"].forEach(id=>assert(front.includes(`id="muscle-${id}"`),`front SVG missing ${id}`));
["upper-back","rear-deltoid","triceps","forearms","lats","spinal-erectors","gluteus-maximus","hamstrings","calves"].forEach(id=>assert(back.includes(`id="muscle-${id}"`),`back SVG missing ${id}`));
assert.match(app,/function muscleHighlightMarkup\(ex\)/);
assert.match(app,/EXERCISE_MEDIA_V2\?\.resolve/);
assert.match(css,/\.muscle-region\.primary\{[^}]*opacity:\.94/);
assert.match(css,/\.muscle-region\.primary\{[^}]*fill:#39ff14/);
assert.match(css,/\.muscle-region\.primary\{[^}]*color:#39ff14/);
assert.match(css,/\.muscle-region\{[^}]*mix-blend-mode:normal/);
assert.match(css,/\.muscle-region\.secondary\{[^}]*color:#ff4fd8[^}]*fill:#ff4fd8[^}]*opacity:\.74/);
assert.match(css,/rgba\(255,79,216,\.42\)/);
assert.match(front,/<g id="muscle-chest" fill="currentColor">/);
assert.match(back,/<g id="muscle-triceps" fill="currentColor">/);
assert.match(css,/\.legend-primary\{color:#39ff14\}/);
assert.match(css,/\.legend-secondary\{color:#ff4fd8\}/);
assert.match(front,/Native vector anatomy derived from the approved Road to 12% Smith Machine Bench Press guide/);
assert.match(back,/Native vector anatomy derived from the approved Road to 12% Smith Machine Bench Press guide/);
assert.doesNotMatch(front,/<image\b/,"front anatomy SVG must be self-contained native vector artwork");
assert.doesNotMatch(back,/<image\b/,"back anatomy SVG must be self-contained native vector artwork");
assert.match(front,/viewBox="0 0 220 500" fill="none"/);
assert.match(back,/viewBox="0 0 220 500" fill="none"/);
assert.match(app,/legend-primary">Primary/);
assert.doesNotMatch(app,/muscle-map-legend[^\n]*class="primary"/);
assert.match(sw,/ROAD12_MEDIA_V2_MANIFEST\.cacheAssets\.forEach/);
assert.match(app,/const ROAD12_SCHEMA_VERSION=21;/);

const buildNames=new Set(Object.values(build.TEMPLATES).flatMap(template=>template.exercises.map(exercise=>exercise.name)));
Object.keys(expected).forEach(name=>assert(buildNames.has(name),`${name} must remain present in the unchanged Build templates`));
console.log("Exercise Media Library v2 tests passed: Smith Bench and Seated Cable Chest Fly approved, 11 records pending, fallbacks, shared muscle SVGs, offline manifest safety, and schema 21 are intact.");
