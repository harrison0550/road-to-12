const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const identities = require(path.join(root, "exercise-identity.js"));
const libraryContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "exercise-library.js"), "utf8"), libraryContext, { filename: "exercise-library.js" });
const library = libraryContext.window.ROAD12_EXERCISE_LIBRARY;

assert.strictEqual(identities.resolve("Smith Machine Hip Thrust").id, "road12.hip-thrust.smith");
assert.match(app, /function smithMachineHipThrustExercise\(\)[\s\S]*?name:"Smith Machine Hip Thrust",type:"strength",sets:3,reps:10,rest:90/);
assert.match(app, /Smith Machine Hip Thrust[\s\S]*?Place the flat bench completely outside the front opening of the Smith cage/);
assert.match(app, /Smith Machine Hip Thrust[\s\S]*?legs extending into the cage/);
assert.match(app, /Smith Machine Hip Thrust[\s\S]*?Smith barbell pad securely around the center of the bar/);
assert.match(app, /Smith Machine Hip Thrust[\s\S]*?attachmentCard:\{key:"smithBarPad",name:"Smith barbell pad",qty:1\}/);
assert.match(app, /Smith Machine Hip Thrust[\s\S]*?Do not include the 33 lb Smith bar; the app adds it separately/);
assert.match(app, /const includeHipThrust=!activeSession\|\|\[PREVIOUS_FOUNDATION_PROGRAM_REVISION,GMWD_FOUNDATION_PROGRAM_REVISION,FOUNDATION_PROGRAM_REVISION\]\.includes\(state\.currentSession\.programRevision\)/);
assert.match(app, /dayIndex===4\?fullBodyCWorkout\(includeHipThrust,useGmwdChest,useConcentrationCurl\)/);
assert.match(app, /\["smithBarPad","Smith barbell pad","Used to cushion the Smith bar during hip thrusts\."\]/);

const entry = library.entries["Smith Machine Hip Thrust"];
assert(entry, "Smith Machine Hip Thrust must have reviewed media");
assert.strictEqual(entry.mediaType, "animation");
assert.match(entry.media, /smith-machine-hip-thrust\.gif$/);
assert.match(entry.motionPoster, /smith-machine-hip-thrust-motion-guide\.webp$/);
assert.match(entry.mediaAlt, /bench outside the red cage/i);
assert.match(entry.mediaAlt, /both feet planted inside it/i);
assert(entry.equipment.some(item => /Smith barbell pad/i.test(item)));
for (const mediaPath of [entry.media, entry.motionPoster]) {
  assert(fs.existsSync(path.join(root, mediaPath)), `${mediaPath} must exist`);
  assert(sw.includes(`./${mediaPath}`), `${mediaPath} must be available offline`);
}

console.log("Smith hip-thrust tests passed: schedule, revision guard, set logging, attachment, media and offline contracts are present.");
