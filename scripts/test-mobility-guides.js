const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const context = { self: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, "exercise-library.js"), "utf8"),
  context,
  { filename: "exercise-library.js" },
);

const entries = context.self.ROAD12_EXERCISE_LIBRARY.entries;
const guides = [
  ["Hip Flexor Mobility", "half-kneeling", /small forward hip shift/i],
  ["Hamstring Mobility", "supported standing", /hinging forward with a long spine/i],
  ["Chest and Shoulder Mobility", "wall slide", /W position into a wide overhead Y/i],
];

for (const [name, movement, altCue] of guides) {
  const entry = entries[name];
  assert(entry, `${name} must have reviewed movement guidance`);
  assert.strictEqual(entry.sourceType, "app-original");
  assert.strictEqual(entry.mediaType, "animation");
  assert.match(entry.media, /assets\/exercise-library\/generated\/.*\.gif$/);
  assert.match(entry.motionPoster, /assets\/exercise-library\/generated\/.*-motion-guide\.webp$/);
  assert(
    entry.sourceExercise.toLowerCase().includes(movement),
    `${name} must identify the exact ${movement} movement`,
  );
  assert.match(entry.mediaAlt, altCue, `${name} alternative text must match its movement`);
  assert(fs.existsSync(path.join(root, entry.media)), `${name} animation must exist`);
  assert(fs.existsSync(path.join(root, entry.motionPoster)), `${name} poster must exist`);
  assert(app.includes(`name:"${name}"`), `${name} must remain in the workout definition`);
}

assert(
  !app.includes('setup:["Use a supported standing or seated position"'),
  "Hamstring instructions must not offer conflicting positions",
);
assert(
  !app.includes(
    '"Perform controlled arm circles in both directions.",\n        "Open and close the arms across the chest."',
  ),
  "Chest and shoulder instructions must describe one illustrated drill",
);

console.log(
  "Mobility guide regression checks passed: all three Tuesday movements match reviewed poster-backed animations and one unambiguous written drill.",
);
