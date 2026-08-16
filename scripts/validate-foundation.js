const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function requireFile(relativePath, source) {
  if (/^(?:data:|https?:|#)/i.test(relativePath)) return;
  const cleanPath = relativePath.replace(/[?#].*$/, "").replace(/^\.\//, "");
  if (!fs.existsSync(path.join(root, cleanPath))) {
    fail(`${source} references missing file: ${relativePath}`);
  }
}

for (const file of [
  "app-meta.js",
  "exercise-library.js",
  "data.js",
  "adaptive-coaching.js",
  "scheduling.js",
  "workout-navigation.js",
  "app.js",
  "sw.js",
  "scripts/validate-foundation.js",
]) {
  try {
    new vm.Script(read(file), { filename: file });
  } catch (error) {
    fail(`${file} has invalid JavaScript: ${error.message}`);
  }
}

const html = read("index.html");
const htmlReferences = [
  ...html.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/gi),
].map((match) => match[1]);

for (const reference of htmlReferences) {
  requireFile(reference, "index.html");
}

const expectedEntryPoints = [
  "manifest.webmanifest",
  "app.css",
  "app-meta.js",
  "exercise-library.js",
  "data.js",
  "adaptive-coaching.js",
  "scheduling.js",
  "workout-navigation.js",
  "app.js",
];
for (const entryPoint of expectedEntryPoints) {
  if (!htmlReferences.includes(entryPoint)) {
    fail(`index.html is missing production entry point: ${entryPoint}`);
  }
}

const sw = read("sw.js");
const assetListMatch = sw.match(/\bASSETS\s*=\s*(\[[\s\S]*?\])/);
if (!assetListMatch) {
  fail("sw.js does not define an ASSETS array");
} else {
  try {
    const assets = JSON.parse(assetListMatch[1]);
    for (const asset of assets) requireFile(asset, "sw.js");
  } catch (error) {
    fail(`sw.js ASSETS is not a JSON-compatible string array: ${error.message}`);
  }
}

const app = read("app.js");
const storageKeys = [...app.matchAll(/["'](road12v\d+)["']/g)].map(
  (match) => match[1],
);
if (!storageKeys.includes("road12v5")) {
  fail("app.js no longer references the compatible road12v5 storage key");
}
const incompatibleKeys = [...new Set(storageKeys.filter((key) => key !== "road12v5"))];
if (incompatibleKeys.length) {
  fail(`unexpected versioned storage key(s): ${incompatibleKeys.join(", ")}`);
}

if (!/const ROAD12_SCHEMA_VERSION=10;/.test(app)) {
  fail("app.js does not expose the current progression-data migration schema");
}
if (!/version:4,[\s\S]*?bumperPlates:true[\s\S]*?value\.schemaVersion=4;/.test(app)) {
  fail("app.js does not migrate existing road12v5 profiles to available bumper plates");
}
if (!/bumperPlates:true,/.test(app)) {
  fail("app.js does not enable bumper plates for new profiles");
}
if (!/version:6,[\s\S]*?dumbbells:true,kettlebells:false[\s\S]*?value\.schemaVersion=6;/.test(app)) {
  fail("app.js does not migrate existing road12v5 profiles to separate dumbbells and kettlebells");
}
if (!/version:8,[\s\S]*?trainingPhase[\s\S]*?measurementHistory[\s\S]*?cardioHistory[\s\S]*?value\.schemaVersion=8;/.test(app)||!/version:9,[\s\S]*?exerciseFeedback[\s\S]*?approvedProgressions[\s\S]*?value\.schemaVersion=9;/.test(app)||!/version:10,[\s\S]*?cardioTimers[\s\S]*?value\.schemaVersion=10;/.test(app)) {
  fail("app.js does not add the Foundation phase, measurement history, and cardio history compatibly");
}
if (!/matched 10–45 lb bumper plates/.test(app)) {
  fail("app.js does not document the available Smith-machine bumper-plate range");
}
if (!/const SMITH_BAR_WEIGHT_LB=33;/.test(app)) {
  fail("app.js does not include the official 33 lb RitFit M1 Pro Smith bar weight");
}
if (!/Total plate weight across both sides/.test(app) || !/PLATES TOTAL/.test(app)) {
  fail("app.js does not clearly label Smith entries as total plate weight across both sides");
}
if (!/SMITH_BAR_WEIGHT_LB\+added/.test(app)) {
  fail("app.js does not add the Smith bar to the plate weight calculation");
}

if (failures.length) {
  console.error("Foundation validation failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(
  `Foundation validation passed: JavaScript syntax, ${htmlReferences.length} HTML references, service-worker assets, and road12v5 compatibility.`,
);
