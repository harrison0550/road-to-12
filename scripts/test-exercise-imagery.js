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
const inclineCablePress =
  context.self.ROAD12_EXERCISE_LIBRARY.entries["Incline Cable Press"];
const cableHammerCurl =
  context.self.ROAD12_EXERCISE_LIBRARY.entries["Cable Hammer Curl"];
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
assert(inclineCablePress, "Incline Cable Press must have an exercise-library visual");
assert.strictEqual(inclineCablePress.sourceType, "app-original");
assert(
  inclineCablePress.mediaAlt.includes("low pulleys") &&
    inclineCablePress.mediaAlt.includes("both front posts") &&
    inclineCablePress.mediaAlt.includes("red cage-style Smith machine"),
  "the incline cable press needs equipment-specific alternative text",
);
assert(
  fs.existsSync(path.join(root, inclineCablePress.media)),
  "the incline cable press illustration must be stored locally",
);
assert(cableHammerCurl, "Cable Hammer Curl must have an exercise-library visual");
assert.strictEqual(cableHammerCurl.sourceType, "app-original");
assert(
  cableHammerCurl.mediaAlt.includes("neutral-grip rope hammer curl") &&
    cableHammerCurl.mediaAlt.includes("inner front-left post") &&
    cableHammerCurl.mediaAlt.includes("red cage-style Smith machine"),
  "the cable hammer curl needs grip- and equipment-specific alternative text",
);
assert(
  fs.existsSync(path.join(root, cableHammerCurl.media)),
  "the cable hammer curl illustration must be stored locally",
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
assert(
  sw.includes(`./${inclineCablePress.media}`),
  "the incline cable press illustration must be available offline",
);
assert(
  sw.includes(`./${cableHammerCurl.media}`),
  "the cable hammer curl illustration must be available offline",
);

console.log(
  "Exercise imagery tests passed: treadmill, hip-hinge, incline-cable-press, and cable-hammer-curl artwork, provenance, accessible text, polished fallback, and offline caching.",
);
