const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const data = fs.readFileSync(path.join(root, "data.js"), "utf8");

assert.match(app, /const ROAD12_SCHEMA_VERSION=11;/, "progression architecture must preserve the additive storage migration chain");
assert.match(app, /version:6,[\s\S]*?dumbbells:true,kettlebells:false[\s\S]*?schemaVersion=6;/, "existing profiles must gain the user's confirmed equipment without losing saved state");
assert.match(app, /version:7,[\s\S]*?dumbbells:true,rower:true,kettlebells:false[\s\S]*?schemaVersion=7;/, "the current device profile must restore confirmed dumbbells and rower so added exercises are not filtered from previews");
assert.match(app, /dumbbells:true,\s*kettlebells:false,/, "new profiles must default to dumbbells available and kettlebells unavailable");
assert.match(app, /dumbbells:"Dumbbells",\s*kettlebells:"Kettlebells"/, "equipment labels must remain independent");
assert.match(app, /\["dumbbells","🔩","Dumbbells"/, "Profile must show a dedicated dumbbell control");
assert.match(app, /\["kettlebells","⚫","Kettlebells"/, "Profile must show a dedicated kettlebell control");
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

console.log("Equipment profile checks passed: equipment remains compatible and Attachment Locker offers the iOS photo picker.");
