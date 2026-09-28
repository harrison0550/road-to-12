const assert=require("assert");
const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
global.ROAD12_EXERCISES=require(path.join(root,"exercise-identity.js"));
const media=require(path.join(root,"exercise-media-v2.js"));
const anatomy=require(path.join(root,"exercise-muscle-anatomy.js"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");
const front=fs.readFileSync(path.join(root,"assets/exercise-library/v2/shared/muscles-front.svg"),"utf8");
const back=fs.readFileSync(path.join(root,"assets/exercise-library/v2/shared/muscles-back.svg"),"utf8");

const fixtures={
  "Smith Machine Bench Press":{primary:["chest"],secondary:["front-deltoid","triceps"]},
  "GMWD Converging Chest Press":{primary:["chest"],secondary:["front-deltoid","triceps"]},
  "Lat Pulldown":{primary:["lats","upper-back"],secondary:["biceps"]},
  "Seated Cable Row":{primary:["lats","upper-back"],secondary:["rear-deltoid","biceps"]},
  "Seated Concentration Curl":{primary:["biceps"],secondary:["brachialis","forearms"]},
  "Dumbbell Lateral Raise":{primary:["lateral-deltoid"],secondary:["upper-back"]}
};
for(const [name,expected] of Object.entries(fixtures)){
  const record=media.getForName(name);
  assert(record,`${name} needs v2 muscle metadata`);
  assert.deepStrictEqual(record.muscleHighlights.primary,expected.primary,`${name} primary map changed`);
  assert.deepStrictEqual(record.muscleHighlights.secondary,expected.secondary,`${name} secondary map changed`);
  const regions=record.muscleHighlights;
  const runtime=`${anatomy.renderFigure("front",regions)}${anatomy.renderFigure("back",regions)}`;
  for(const region of expected.primary){
    assert.match(runtime,new RegExp(`class="muscle-region primary" data-muscle-region="${region}" fill="#39FF14" style="fill:#39FF14"`),`${name} primary ${region} must receive the exact runtime class and fill`);
  }
  for(const region of expected.secondary){
    assert.match(runtime,new RegExp(`class="muscle-region secondary" data-muscle-region="${region}" fill="#FF4FD8" style="fill:#FF4FD8"`),`${name} secondary ${region} must receive the exact runtime class and fill`);
  }
  assert.doesNotMatch(runtime,/<use\b|href=|fill="(?:white|#fff(?:fff)?)"/i,`${name} runtime anatomy must be fully inline with no white or external-use fallback`);
  assert.doesNotMatch(runtime,/\sid="(?:body|muscle)-/i,`${name} runtime anatomy must not duplicate source SVG IDs`);
}

assert.match(css,/\.muscle-region\.primary\{[^}]*color:#39ff14[^}]*fill:#39ff14!important/);
assert.match(css,/\.muscle-region\.secondary\{[^}]*color:#ff4fd8[^}]*fill:#ff4fd8!important/);
assert.doesNotMatch(css,/\.muscle-target-panel:(?::)?after\s*\{/i,"Muscles Worked card must not draw the removed decorative circle");
assert.match(app,/data-renderer="inline-anatomical-svg"/);
assert.match(app,/data-anatomy-figure="\$\{side\}"/);
assert.match(app,/data-anatomy-inline="true"/);
assert.match(app,/EXERCISE_MUSCLE_ANATOMY\?\.renderFigure/);
assert.match(app,/muscleFigureView\("front",regions\)\}\$\{muscleFigureView\("back",regions\)/);
const component=app.slice(app.indexOf("function muscleFigureView"),app.indexOf("function mediaStatus"));
assert.doesNotMatch(component,/svg-human|stick-figure|placeholder|<img\b/i,"anatomical renderer must not include a legacy or image fallback layer");
assert.doesNotMatch(component,/class="muscle-body"/,"legacy muscle-body layer must be removed");
assert.doesNotMatch(component,/<use\b|href=/i,"production component must not use external SVG fragments");
assert.match(component,/legend-primary">Primary/);
assert.match(component,/legend-secondary">Secondary/);
for(const svg of [front,back]){
  assert.doesNotMatch(svg,/<image\b/i,"anatomy artwork must be native SVG paths");
  assert.match(svg,/id="body-(front|back)"/);
}
for(const id of ["chest","front-deltoid","biceps","brachialis","forearms"])
  assert(front.includes(`id="muscle-${id}"`),`front anatomy missing ${id}`);
for(const id of ["triceps","lats","upper-back","rear-deltoid"])
  assert(back.includes(`id="muscle-${id}"`),`back anatomy missing ${id}`);
assert.doesNotMatch(front,/M122 0h3v1/,"front-deltoid map must not contain the stray head pixels");
assert.doesNotMatch(back,/L90 291|L130 291/,"lat map must stop above the pelvis");
const lateral=media.getForName("Dumbbell Lateral Raise");
const lateralRuntime=`${anatomy.renderFigure("front",lateral.muscleHighlights)}${anatomy.renderFigure("back",lateral.muscleHighlights)}`;
assert.doesNotMatch(lateralRuntime,/data-muscle-region="(?:abdominals|obliques|hip-flexors|adductors|gluteus-maximus|spinal-erectors)"/,"lateral raise must not color pelvis, groin, central torso, or oversized spinal regions");
console.log("Muscles Worked rendering tests passed: 6 real runtime maps use inline anatomical paths, exact neon fills, no external-use/white/legacy layers, and no lateral-raise pelvis or torso spill.");
