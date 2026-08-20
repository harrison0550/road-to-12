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
const coreExercises = ["Dead Bug", "Bird Dog", "Side Plank from Knees"];

function definitionBlock(name) {
  const start = app.indexOf(`name:"${name}"`);
  assert(start >= 0, `${name} must remain a dedicated guided exercise`);
  const next = app.indexOf("cloneExerciseByName(", start + name.length + 7);
  return app.slice(start, next < 0 ? app.length : next);
}

for (const name of coreExercises) {
  const entry = entries[name];
  assert(entry, `${name} must have reviewed media`);
  assert.strictEqual(entry.sourceType, "app-original");
  assert.strictEqual(entry.mediaType, "animation");
  assert.match(entry.media, /assets\/exercise-library\/original\/.*-animation\.gif$/);
  assert.match(entry.motionPoster, /assets\/exercise-library\/original\/.*-motion-guide\.webp$/);
  assert(fs.existsSync(path.join(root, entry.media)), `${name} animation must exist`);
  assert(fs.existsSync(path.join(root, entry.motionPoster)), `${name} poster must exist`);
}

const deadBug = definitionBlock("Dead Bug");
assert.match(deadBug, /opposite heel/i, "Dead Bug must cue opposite-side extension");
assert.match(deadBug, /lower back/i, "Dead Bug must cue trunk control");

const birdDog = definitionBlock("Bird Dog");
assert.match(birdDog, /left arm forward as your right leg/i);
assert.match(birdDog, /right arm and left leg/i);
assert.match(birdDog, /hips level/i, "Bird Dog must cue a level pelvis");

const sidePlank = definitionBlock("Side Plank from Knees");
assert.match(sidePlank, /shoulders, hips and knees form a straight line/i);
assert.match(sidePlank, /elbow directly below your shoulder/i);

console.log(
  "Core animation checks passed: Dead Bug, Bird Dog, and Side Plank from Knees retain dedicated coaching plus reviewed poster-backed animations.",
);
