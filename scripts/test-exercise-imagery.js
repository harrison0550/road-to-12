const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = { self: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, "exercise-library.js"), "utf8"),
  context,
  { filename: "exercise-library.js" },
);

const entries = context.self.ROAD12_EXERCISE_LIBRARY.entries;
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "app.css"), "utf8");

const safetyChecks = [
  [
    "Treadmill Walk",
    ["upright", "safety clip"],
  ],
  [
    "Hip Hinge",
    ["hips backward", "neutral spine"],
  ],
  [
    "Incline Cable Press",
    ["two handles", "front-post pulleys"],
  ],
  [
    "Cable Hammer Curl",
    ["one red front post", "neutral grip", "fixed elbows"],
  ],
  [
    "Bodyweight Squat",
    ["heels planted", "knees tracking over the toes"],
  ],
  [
    "Lat Pulldown",
    ["centered single-cable", "upper chest"],
  ],
];

for (const [name, phrases] of safetyChecks) {
  const entry = entries[name];
  assert(entry, `${name} must have reviewed movement guidance`);
  assert.strictEqual(entry.sourceType, "app-original");
  assert.strictEqual(entry.mediaType, "animation");
  assert(fs.existsSync(path.join(root, entry.media)), `${name} animation must be local`);
  assert(fs.existsSync(path.join(root, entry.motionPoster)), `${name} poster must be local`);
  for (const phrase of phrases) {
    assert(
      entry.mediaAlt.toLowerCase().includes(phrase.toLowerCase()),
      `${name} alternative text must explain ${phrase}`,
    );
  }
}

assert(
  entries["Lat Pulldown"].commonMistakes.includes("Pulling the bar behind the neck"),
  "Lat Pulldown coaching must explicitly reject a behind-the-neck finish",
);
assert(
  entries["Cable Chest Press"].reference?.sourceType === "official-manual",
  "an app-created animation must retain its official equipment reference when available",
);
for (const name of ["Smith Machine Squat", "Smith Machine RDL", "Smith Machine Calf Raise"]) {
  assert.strictEqual(
    entries[name].reference,
    null,
    `${name} must not retain an inexact free-barbell equipment crop`,
  );
}

assert.match(
  app,
  /function entryDisplayAsset\(entry\)\{return entry\?\.mediaType==="animation"&&entry\.motionPoster\?entry\.motionPoster:/,
  "animation cards must choose the non-moving poster by default",
);
assert.match(
  app,
  /const displayAsset=isAnimation\?entry\.motionPoster:entry\.media/,
  "the exercise screen must render an animation poster before playback",
);
assert.match(
  app,
  /data-motion-toggle aria-pressed="false">Play animation<\/button>/,
  "motion must start from an explicit, stateful Play animation button",
);
assert.match(
  app,
  /image\.src=playing\?image\.dataset\.posterSrc:image\.dataset\.animationSrc/,
  "the motion control must switch between the reviewed poster and animation",
);
assert.match(
  app,
  /button\.textContent=playing\?"Play animation":"Pause animation"/,
  "the motion control must expose both Play and Pause labels",
);
assert.match(
  app,
  /button\.setAttribute\("aria-pressed",String\(!playing\)\)/,
  "the motion control must announce its pressed state",
);
assert.match(
  app,
  /<img class="exercise-asset-image"[^>]+alt="\$\{entry\.mediaAlt\}"/,
  "the embedded visual must use the reviewed alternative text",
);

assert.match(app, /overlay\.setAttribute\("role","dialog"\)/);
assert.match(app, /overlay\.setAttribute\("aria-modal","true"\)/);
assert.match(app, /overlay\.setAttribute\("aria-labelledby","exerciseAssetTitle"\)/);
assert.match(
  app,
  /if\(event\.key==="Escape"\)\{event\.preventDefault\(\);close\(\);return\}/,
  "the enlarged exercise visual must close with Escape",
);
assert.match(
  app,
  /previousFocus\?\.focus\?\.\(\)/,
  "closing the visual dialog must restore focus",
);
assert.match(
  app,
  /if\(event\.shiftKey&&document\.activeElement===first\)[\s\S]*document\.activeElement===last/,
  "the visual dialog must contain keyboard focus",
);
assert.match(
  app,
  /const mediaTiles=items=>[\s\S]*entryDisplayAsset\(entry\)/,
  "the exercise library must also use poster-first media resolution",
);

assert(
  (app.match(/<img[^>]+width="600" height="600"[^>]+data-motion-image/g) || []).length >= 2,
  "embedded and enlarged movement media must reserve intrinsic 600 by 600 dimensions",
);
assert.match(
  app,
  /<span class="motion-media-viewport"><img class="exercise-asset-image" width="600" height="600"/,
  "the workout card must place motion media in the stable viewport",
);
assert.match(
  app,
  /<div class="motion-media-viewport asset-motion-viewport"><img width="600" height="600"/,
  "the enlarged dialog must reuse the stable motion viewport",
);
assert.match(
  css,
  /\.motion-media-viewport\{[^}]*aspect-ratio:1\/1[^}]*overflow:hidden/,
  "movement media must retain a square, overflow-safe viewport while poster and GIF swap",
);
assert.match(
  css,
  /\.motion-media-viewport \.exercise-asset-image,[^{]+\{[^}]*width:100%;height:100%;[^}]*object-fit:contain/,
  "poster and animation frames must use the same contained viewport dimensions",
);

assert.match(app, /const background=document\.querySelector\("\.shell"\)/);
assert.match(app, /const backgroundWasInert=background\?\.hasAttribute\("inert"\)\|\|false/);
assert.match(
  app,
  /if\(background&&!backgroundWasInert\)background\.setAttribute\("inert",""\)/,
  "opening exercise media must make the application shell inert",
);
assert.match(
  app,
  /if\(background&&!backgroundWasInert\)background\.removeAttribute\("inert"\)/,
  "closing exercise media must restore a shell that was not previously inert",
);
assert.match(
  css,
  /\.asset-overlay\{[^}]*safe-area-inset-top[^}]*safe-area-inset-right[^}]*safe-area-inset-bottom[^}]*safe-area-inset-left/,
  "the enlarged media overlay must respect every safe area",
);
assert.match(
  css,
  /\.asset-overlay-panel\{[^}]*100dvh[^}]*safe-area-inset-top[^}]*safe-area-inset-bottom/,
  "the media dialog must fit the dynamic viewport between top and bottom safe areas",
);
assert.match(
  css,
  /\.asset-close\{[^}]*min-width:44px;min-height:44px/,
  "the media dialog Close control must retain a 44 by 44 pixel minimum target",
);

assert.match(
  css,
  /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.motion-part\s*\{\s*animation: none !important;/,
  "reduced-motion mode must suppress decorative CSS animation",
);
assert(!app.includes("No reviewed free demonstration yet"));

console.log(
  "Exercise media UI tests passed: exact references, poster-first playback, stable square viewports, accessible controls, inert/focus restoration, safe areas, and reduced motion are present.",
);
