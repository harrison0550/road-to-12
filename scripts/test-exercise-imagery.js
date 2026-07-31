const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const librarySource = fs.readFileSync(path.join(root, "exercise-library.js"), "utf8");
const context = { self: {} };
vm.runInNewContext(librarySource, context, { filename: "exercise-library.js" });

const treadmill = context.self.ROAD12_EXERCISE_LIBRARY.entries["Treadmill Walk"];
assert(treadmill, "Treadmill Walk must have an exercise-library visual");
assert.strictEqual(treadmill.sourceType, "app-original");
assert(treadmill.mediaAlt.includes("safety clip"), "the visual needs useful alternative text");
assert(
  fs.existsSync(path.join(root, treadmill.media)),
  "the treadmill illustration must be stored locally",
);

const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
assert(!app.includes("No reviewed free demonstration yet"));
assert(app.includes("POSTURE ILLUSTRATION"));
assert(
  treadmill.rightsNote.includes("Written setup and movement cues remain the authoritative coaching guide"),
);

const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
assert(
  sw.includes(`./${treadmill.media}`),
  "the treadmill illustration must be available offline",
);

console.log(
  "Exercise imagery tests passed: treadmill artwork, provenance, accessible text, polished fallback, and offline caching.",
);
