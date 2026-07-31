const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const librarySource = fs.readFileSync(path.join(root, "exercise-library.js"), "utf8");
const context = { self: {} };
vm.runInNewContext(librarySource, context, { filename: "exercise-library.js" });

const treadmill = context.self.ROAD12_EXERCISE_LIBRARY.entries["Treadmill Walk"];
const hipHinge = context.self.ROAD12_EXERCISE_LIBRARY.entries["Hip Hinge"];
assert(treadmill, "Treadmill Walk must have an exercise-library visual");
assert.strictEqual(treadmill.sourceType, "app-original");
assert(treadmill.mediaAlt.includes("safety clip"), "the visual needs useful alternative text");
assert(
  fs.existsSync(path.join(root, treadmill.media)),
  "the treadmill illustration must be stored locally",
);
assert(hipHinge, "Hip Hinge must have an exercise-library visual");
assert.strictEqual(hipHinge.sourceType, "app-original");
assert(
  hipHinge.mediaAlt.includes("hips pushed backward") &&
    hipHinge.mediaAlt.includes("neutral spine"),
  "the hip-hinge visual needs movement-specific alternative text",
);
assert(
  fs.existsSync(path.join(root, hipHinge.media)),
  "the hip-hinge illustration must be stored locally",
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
assert(
  sw.includes(`./${hipHinge.media}`),
  "the hip-hinge illustration must be available offline",
);

console.log(
  "Exercise imagery tests passed: treadmill and hip-hinge artwork, provenance, accessible text, polished fallback, and offline caching.",
);
