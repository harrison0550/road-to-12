const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const library = fs.readFileSync(path.join(root, "exercise-library.js"), "utf8");
const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");

const assets = [
  ["Dumbbell Lateral Raise", "dumbbell-lateral-raise-animation.gif"],
  ["Dumbbell Floor Press", "dumbbell-floor-press-animation.gif"],
  ["Dumbbell Romanian Deadlift", "dumbbell-romanian-deadlift-animation.gif"]
];

for (const [exercise, filename] of assets) {
  const file = path.join(root, "assets", "exercise-library", "original", filename);
  assert.ok(fs.existsSync(file), `${exercise} animation must exist`);
  assert.ok(fs.statSync(file).size > 100000, `${exercise} animation must contain substantive offline artwork`);
  assert.ok(app.includes(`demoImage:"assets/exercise-library/original/${filename}"`), `${exercise} must use its approved animation`);
  assert.ok(library.includes(`"${exercise}": road12Illustration({`), `${exercise} must be registered as original reviewed media`);
  assert.ok(library.includes(`media: "${filename}"`), `${exercise} media registration must point to the approved GIF`);
  assert.ok(serviceWorker.includes(`./assets/exercise-library/original/${filename}`), `${exercise} animation must be cached offline`);
}

console.log("Dumbbell animation checks passed: all approved GIFs are registered, connected, and cached offline.");
