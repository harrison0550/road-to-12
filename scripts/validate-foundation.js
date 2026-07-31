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
  "scheduling.js",
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
  "scheduling.js",
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

if (failures.length) {
  console.error("Foundation validation failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(
  `Foundation validation passed: JavaScript syntax, ${htmlReferences.length} HTML references, service-worker assets, and road12v5 compatibility.`,
);
