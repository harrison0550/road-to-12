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
const exercises = [
  ["Dumbbell Lateral Raise", "dumbbell-lateral-raise-animation.gif", "10 pound"],
  ["Dumbbell Floor Press", "dumbbell-floor-press-animation.gif", "10 pound"],
  ["Dumbbell Romanian Deadlift", "dumbbell-romanian-deadlift-animation.gif", "15 pound"],
];

for (const [name, filename, loadCue] of exercises) {
  const entry = entries[name];
  assert(entry, `${name} must remain registered`);
  assert.strictEqual(entry.sourceType, "app-original");
  assert.strictEqual(entry.mediaType, "animation");
  assert.strictEqual(
    entry.media,
    `assets/exercise-library/original/${filename}`,
    `${name} must retain its approved animation`,
  );
  assert.match(entry.motionPoster, /-motion-guide\.webp$/);
  assert(entry.mediaAlt.toLowerCase().includes(loadCue), `${name} must describe the illustrated load`);
  assert(entry.equipment.some((item) => /dumbbell/i.test(item)), `${name} must identify dumbbells`);
  assert(fs.existsSync(path.join(root, entry.media)), `${name} animation must exist`);
  assert(fs.existsSync(path.join(root, entry.motionPoster)), `${name} poster must exist`);
  assert(app.includes(`name:"${name}"`), `${name} must remain in a Foundation workout`);
}

console.log(
  "Dumbbell animation checks passed: all three approved dumbbell movements retain reviewed animations, static posters, equipment cues, and active workout definitions.",
);
