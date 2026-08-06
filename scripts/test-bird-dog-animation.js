const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const library = fs.readFileSync(path.join(root, "exercise-library.js"), "utf8");
const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const animationNames = ["dead-bug-animation.gif", "bird-dog-animation.gif", "side-plank-from-knees-animation.gif"];
for (const name of animationNames) {
  const assetPath = path.join(root, "assets", "exercise-library", "original", name);
  const asset = fs.readFileSync(assetPath);
  assert.match(asset.subarray(0, 6).toString("ascii"), /^GIF8[79]a$/, `${name} must be a valid GIF`);
  assert.ok([...asset].filter(byte => byte === 0x2c).length >= 2, `${name} must contain multiple animation frames`);
}
assert.match(app, /function coreRecoveryWorkout\(\)[\s\S]*?name:"Dead Bug"[\s\S]*?name:"Bird Dog"[\s\S]*?name:"Side Plank from Knees"/, "Core + Recovery must expose all three core movements as separate guided steps");
assert.match(app, /name:"Bird Dog"[\s\S]*?left arm forward as your right leg[\s\S]*?right arm and left leg[\s\S]*?bird-dog-animation\.gif/, "Bird Dog coaching must describe both opposite-side pairings and use the approved animation");
assert.match(app, /name:"Dead Bug"[\s\S]*?opposite heel[\s\S]*?dead-bug-animation\.gif/, "Dead Bug coaching must describe opposite-side movement and use the approved animation");
assert.match(app, /name:"Side Plank from Knees"[\s\S]*?shoulders, hips and knees form a straight line[\s\S]*?side-plank-from-knees-animation\.gif/, "Side Plank from Knees coaching must describe the supported line and use the approved animation");
assert.match(library, /"Bird Dog": road12Illustration\([\s\S]*?bird-dog-animation\.gif/, "Bird Dog must be registered as an original reviewed exercise asset");
assert.match(library, /"Dead Bug": road12Illustration\([\s\S]*?dead-bug-animation\.gif/, "Dead Bug must be registered as an original reviewed exercise asset");
assert.match(library, /"Side Plank from Knees": road12Illustration\([\s\S]*?side-plank-from-knees-animation\.gif/, "Side Plank from Knees must be registered as an original reviewed exercise asset");
assert.match(serviceWorker, /\.\/assets\/exercise-library\/original\/bird-dog-animation\.gif/, "Bird Dog animation must be cached for offline workouts");
assert.match(serviceWorker, /\.\/assets\/exercise-library\/original\/dead-bug-animation\.gif/, "Dead Bug animation must be cached for offline workouts");
assert.match(serviceWorker, /\.\/assets\/exercise-library\/original\/side-plank-from-knees-animation\.gif/, "Side Plank from Knees animation must be cached for offline workouts");

console.log("Core animation checks passed: dedicated directions, approved animations, and offline caching are present.");
