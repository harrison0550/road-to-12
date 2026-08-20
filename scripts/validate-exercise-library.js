const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function loadExerciseLibrary() {
  const context = { self: {} };
  vm.runInNewContext(
    fs.readFileSync(path.join(root, "exercise-library.js"), "utf8"),
    context,
    { filename: "exercise-library.js" },
  );
  return context.self.ROAD12_EXERCISE_LIBRARY;
}

function loadServiceWorkerAssetList(name) {
  const source = fs.readFileSync(path.join(root, "sw.js"), "utf8");
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*(\\[[\\s\\S]*?\\]);`));
  if (!match) throw new Error(`Service Worker does not define ${name}.`);
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`${name} must be a JSON-compatible string array: ${error.message}`);
  }
}

function localPathFor(media) {
  if (typeof media !== "string" || !media || /^(?:[a-z]+:|\/)/i.test(media)) return null;
  const resolved = path.resolve(root, media.replace(/^\.\//, ""));
  return resolved.startsWith(`${root}${path.sep}`) ? resolved : null;
}

function skipGifSubBlocks(buffer, offset) {
  while (offset < buffer.length) {
    const size = buffer[offset];
    offset += 1;
    if (size === 0) return offset;
    offset += size;
    if (offset > buffer.length) throw new Error("truncated data sub-block");
  }
  throw new Error("unterminated data sub-block");
}

function gifFrameCount(buffer) {
  if (!/^GIF8[79]a$/.test(buffer.subarray(0, 6).toString("ascii"))) {
    throw new Error("invalid GIF signature");
  }
  if (buffer.length < 13) throw new Error("truncated logical screen descriptor");

  const packed = buffer[10];
  let offset = 13;
  if (packed & 0x80) offset += 3 * 2 ** ((packed & 0x07) + 1);

  let frames = 0;
  while (offset < buffer.length) {
    const introducer = buffer[offset];
    offset += 1;
    if (introducer === 0x3b) break;
    if (introducer === 0x21) {
      if (offset >= buffer.length) throw new Error("truncated extension block");
      offset += 1;
      offset = skipGifSubBlocks(buffer, offset);
      continue;
    }
    if (introducer !== 0x2c) {
      throw new Error(`unexpected GIF block 0x${introducer.toString(16)}`);
    }
    if (offset + 9 > buffer.length) throw new Error("truncated image descriptor");
    const imagePacked = buffer[offset + 8];
    offset += 9;
    if (imagePacked & 0x80) offset += 3 * 2 ** ((imagePacked & 0x07) + 1);
    if (offset >= buffer.length) throw new Error("missing LZW code size");
    offset += 1;
    offset = skipGifSubBlocks(buffer, offset);
    frames += 1;
  }
  return frames;
}

function validateSourceMetadata(entry, label, invalid) {
  const required = (keys) => {
    for (const key of keys) {
      if (!entry[key]) invalid.push(`${label}: missing ${key}`);
    }
  };

  if (entry.sourceType === "official-manual") {
    required(["provider", "sourceDocument", "sourceExercise", "author", "rightsNote"]);
  } else if (entry.sourceType === "app-original") {
    required(["provider", "sourceExercise", "author", "rightsNote"]);
  } else if (entry.sourceType === "licensed-community") {
    required(["provider", "sourceExercise", "sourceUrl", "author"]);
    if (!entry.license?.shortName || !entry.license?.url) {
      invalid.push(`${label}: incomplete license metadata`);
    }
  } else {
    invalid.push(`${label}: unsupported sourceType ${entry.sourceType || "(missing)"}`);
  }
}

function validateMediaFile(media, label, kind, missing, invalid) {
  const file = localPathFor(media);
  if (!file) {
    invalid.push(`${label}: media must be a repository-local path`);
    return;
  }
  if (!fs.existsSync(file)) {
    missing.push(`${label}: ${media}`);
    return;
  }

  const bytes = fs.readFileSync(file);
  if (!bytes.length) {
    invalid.push(`${label}: media file is empty`);
    return;
  }
  if (kind === "animation") {
    try {
      const frames = gifFrameCount(bytes);
      if (frames < 2) invalid.push(`${label}: animation contains only ${frames} frame`);
    } catch (error) {
      invalid.push(`${label}: ${error.message}`);
    }
  } else if (kind === "poster") {
    const webp =
      bytes.length >= 12 &&
      bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
      bytes.subarray(8, 12).toString("ascii") === "WEBP";
    if (!webp) invalid.push(`${label}: poster is not a valid WebP file`);
  }
}

(async () => {
  const library = loadExerciseLibrary();
  if (!library?.entries) throw new Error("Exercise library did not initialize.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(library.reviewedOn || "")) {
    throw new Error("Exercise library must declare an ISO media review date.");
  }

  const coreAssets = loadServiceWorkerAssetList("CORE_ASSETS");
  const mediaAssets = loadServiceWorkerAssetList("MEDIA_ASSETS");
  const mediaSet = new Set(mediaAssets);
  const missing = [];
  const notListed = [];
  const invalid = [];
  let animationCount = 0;

  if (new Set(coreAssets).size !== coreAssets.length) invalid.push("CORE_ASSETS contains duplicates");
  if (mediaSet.size !== mediaAssets.length) invalid.push("MEDIA_ASSETS contains duplicates");
  for (const asset of [...coreAssets, ...mediaAssets]) {
    if (asset === "./") continue;
    const file = localPathFor(asset);
    if (!file || !fs.existsSync(file)) missing.push(`Service Worker: ${asset}`);
  }

  const requireListed = (media, label) => {
    const cacheKey = media.startsWith("./") ? media : `./${media}`;
    if (!mediaSet.has(cacheKey)) notListed.push(`${label}: ${media}`);
  };

  for (const [name, entry] of Object.entries(library.entries)) {
    const label = name;
    validateSourceMetadata(entry, label, invalid);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewedOn || "")) {
      invalid.push(`${label}: missing or invalid reviewedOn`);
    }
    if (entry.reviewedOn !== library.reviewedOn) {
      invalid.push(`${label}: review date does not match the library review date`);
    }
    if (typeof entry.mediaAlt !== "string" || entry.mediaAlt.trim().length < 30) {
      invalid.push(`${label}: alternative text is missing or too generic`);
    }
    for (const key of ["primaryMuscles", "secondaryMuscles", "equipment", "commonMistakes"]) {
      if (!Array.isArray(entry[key])) invalid.push(`${label}: ${key} must be an array`);
    }
    if (!entry.primaryMuscles?.length) invalid.push(`${label}: primaryMuscles must not be empty`);
    if (!entry.equipment?.length) invalid.push(`${label}: equipment must not be empty`);
    if (!entry.commonMistakes?.length) invalid.push(`${label}: commonMistakes must not be empty`);

    if (entry.mediaType === "animation") {
      animationCount += 1;
      if (!/\.gif$/i.test(entry.media || "")) invalid.push(`${label}: animation must use a GIF asset`);
      if (!/-motion-guide\.webp$/i.test(entry.motionPoster || "")) {
        invalid.push(`${label}: animation must provide a WebP motion storyboard`);
      }
      if (entry.motionPoster === entry.media) invalid.push(`${label}: poster and animation must be separate assets`);
      validateMediaFile(entry.media, `${label} animation`, "animation", missing, invalid);
      validateMediaFile(entry.motionPoster, `${label} poster`, "poster", missing, invalid);
      requireListed(entry.media, `${label} animation`);
      requireListed(entry.motionPoster, `${label} poster`);
    } else if (entry.mediaType === "still") {
      validateMediaFile(entry.media, `${label} still`, "still", missing, invalid);
      requireListed(entry.media, `${label} still`);
    } else {
      invalid.push(`${label}: mediaType must be animation or still`);
    }

    if (entry.reference) {
      validateSourceMetadata(entry.reference, `${label} reference`, invalid);
      if (typeof entry.reference.mediaAlt !== "string" || entry.reference.mediaAlt.trim().length < 20) {
        invalid.push(`${label} reference: alternative text is missing or too generic`);
      }
      validateMediaFile(entry.reference.media, `${label} reference`, "still", missing, invalid);
      requireListed(entry.reference.media, `${label} reference`);
    }
  }

  if (missing.length) throw new Error(`Missing media:\n${[...new Set(missing)].join("\n")}`);
  if (notListed.length) {
    throw new Error(`Media missing from MEDIA_ASSETS:\n${[...new Set(notListed)].join("\n")}`);
  }
  if (invalid.length) throw new Error(`Invalid exercise media contract:\n${invalid.join("\n")}`);

  const distinctAnimations = new Set(
    Object.values(library.entries)
      .filter((entry) => entry.mediaType === "animation")
      .map((entry) => entry.media),
  ).size;
  console.log(
    `Exercise library validation passed: ${animationCount} reviewed animation mappings, ${distinctAnimations} distinct GIFs, valid posters/references, and a complete split-cache media manifest.`,
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
