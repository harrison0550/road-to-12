const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const data = fs.readFileSync(path.join(root, "data.js"), "utf8");

assert.match(app, /const ROAD12_SCHEMA_VERSION=16;/, "progression architecture must preserve the additive storage migration chain");
assert.match(app, /version:6,[\s\S]*?dumbbells:true,kettlebells:false[\s\S]*?schemaVersion=6;/, "existing profiles must gain the user's confirmed equipment without losing saved state");
assert.match(app, /version:7,[\s\S]*?dumbbells:true,rower:true,kettlebells:false[\s\S]*?schemaVersion=7;/, "the current device profile must restore confirmed dumbbells and rower so added exercises are not filtered from previews");
assert.match(app, /version:13,[\s\S]*?dumbbellPairWeights:\[10,15,20,25\][\s\S]*?schemaVersion=13;/, "existing profiles must gain the confirmed 20 and 25 lb dumbbell pairs additively");
assert.match(app, /version:15,[\s\S]*?kettlebells:true,kettlebellWeights:\[30\][\s\S]*?schemaVersion=15;/, "existing profiles must gain the confirmed 30 lb kettlebell additively");
assert.match(app, /dumbbells:true,[\s\S]*?dumbbellPairWeights:\[10,15,20,25\],[\s\S]*?kettlebells:true,[\s\S]*?kettlebellWeights:\[30\]/, "new profiles must default to all confirmed dumbbell pairs and the owned 30 lb kettlebell");
assert.match(app, /dumbbells:"Dumbbells",\s*kettlebells:"Kettlebells"/, "equipment labels must remain independent");
assert.match(app, /\["dumbbells","🔩","Dumbbells"/, "Profile must show a dedicated dumbbell control");
assert.match(app, /Available fixed pairs: 10, 15, 20 and 25 lb/, "Profile must list every confirmed dumbbell pair");
assert.match(app, /\["kettlebells","⚫","Kettlebell — 30 lb"/, "Profile must show the owned 30 lb kettlebell independently");
assert.match(app, /gobletSquatTemplate\.setup=\["Equipment: one dumbbell"/, "Goblet Squat instructions must match the available dumbbell");
assert.match(data, /"name":"Goblet Squat"[\s\S]*?"requires":\["dumbbells"\]/, "Goblet Squat must enter the workout only when dumbbells are enabled");
assert.match(
  app,
  /<input type="file" accept="image\/\*" data-photo="\$\{key\}">/,
  "Attachment Locker must use the iOS image picker so users can choose an existing photo",
);
assert.doesNotMatch(
  app,
  /<input type="file"[^>]*capture=["']environment["'][^>]*data-photo=/,
  "Attachment Locker must not force the rear camera instead of offering Photo Library",
);
assert.match(app, /\["vBar","Angled V-bar pressdown attachment","Used for V-bar triceps pushdowns\."\]/, "Attachment Locker must include the new V-bar");
assert.match(app, /\["rowHandle","Rotating close-grip double-D row handle","Used for seated cable rows\."\]/, "Attachment Locker must identify the rotating row handle");

console.log("Equipment profile checks passed: equipment remains compatible and Attachment Locker offers the iOS photo picker.");
