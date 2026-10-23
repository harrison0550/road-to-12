const assert=require("assert");
const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const anatomy=require(path.join(root,"exercise-muscle-anatomy.js"));
const media=require(path.join(root,"exercise-media-v2.js"));
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");
const front=fs.readFileSync(path.join(root,"assets/exercise-library/v2/shared/muscles-front.svg"),"utf8");
const back=fs.readFileSync(path.join(root,"assets/exercise-library/v2/shared/muscles-back.svg"),"utf8");

const fixtures={
  "road12.press.smith-bench":{primary:["chest"],secondary:["front-deltoid","triceps"]},
  "road12.press.gmwd-converging-chest-press":{primary:["chest"],secondary:["front-deltoid","triceps"]},
  "road12.fly.cable-seated":{primary:["chest"],secondary:["front-deltoid","biceps"]},
  "road12.pull.lat-pulldown":{primary:["lats","upper-back"],secondary:["biceps"]},
  "road12.row.seated-cable":{primary:["lats","upper-back"],secondary:["rear-deltoid","biceps"]},
  "road12.curl.dumbbell-concentration":{primary:["biceps"],secondary:["brachialis","forearms"]},
  "road12.lateral-raise.dumbbell":{primary:["lateral-deltoid"],secondary:["upper-back"]},
  "road12.calf-raise.smith":{primary:["calves"],secondary:[]},
  "road12.hamstring.cable-standing-single-leg-curl":{primary:["hamstrings"],secondary:["calves","glute-stabilizers"]},
  "road12.squat.smith-machine":{primary:["quadriceps","gluteus-maximus"],secondary:["hamstrings","adductors","abdominals"]},
  "road12.crunch.cable":{primary:["abdominals"],secondary:["obliques","hip-flexors"]},
  "road12.lunge.dumbbell-reverse":{primary:["quadriceps","gluteus-maximus"],secondary:["hamstrings","adductors","abdominals","obliques"]},
  "road12.hip-thrust.smith":{primary:["gluteus-maximus"],secondary:["hamstrings","adductors","abdominals"]}
};

for(const [id,expected] of Object.entries(fixtures)){
  const record=media.records[id];
  assert(record,`${id} needs v2 muscle metadata`);
  assert.deepStrictEqual(record.muscleHighlights.primary,expected.primary,`${id} primary map changed`);
  assert.deepStrictEqual(record.muscleHighlights.secondary,expected.secondary,`${id} secondary map changed`);
  const runtime=`${anatomy.renderFigure("front",record.muscleHighlights)}${anatomy.renderFigure("back",record.muscleHighlights)}`;
  assert.doesNotMatch(runtime,/<(?:rect|ellipse|polygon|image|use|mask)\b/i,`${id} must use anatomical paths only`);
  assert.doesNotMatch(runtime,/fill="(?:white|#fff(?:fff)?)"/i,`${id} must never emit white highlights`);
  const expectedPathCount=anatomy.FIGURES.front.paths.length+anatomy.FIGURES.back.paths.length;
  assert.equal((runtime.match(/data-anatomy-id=/g)||[]).length,expectedPathCount,`${id} must render exactly one front and one back set of anatomy paths`);
  const runtimeIds=[...runtime.matchAll(/ id="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(runtimeIds).size,runtimeIds.length,`${id} runtime anatomy IDs must be unique`);
  for(const region of expected.primary){
    const ids=[...(anatomy.REGION_PATHS.front[region]||[]),...(anatomy.REGION_PATHS.back[region]||[])];
    assert(ids.length,`${region} must resolve to actual anatomy IDs`);
    ids.forEach(anatomyId=>assert.match(runtime,new RegExp(`class="anatomy-path muscle-region primary" data-anatomy-id="${anatomyId}" data-muscle-region="${region}" fill="#39FF14"`)));
  }
  for(const region of expected.secondary){
    const ids=[...(anatomy.REGION_PATHS.front[region]||[]),...(anatomy.REGION_PATHS.back[region]||[])];
    if(region==="brachialis")continue;
    assert(ids.length,`${region} must resolve to actual anatomy IDs`);
    ids.forEach(anatomyId=>assert.match(runtime,new RegExp(`class="anatomy-path muscle-region secondary" data-anatomy-id="${anatomyId}" data-muscle-region="${region}" fill="#FF4FD8"`)));
  }
}

const expectedRegions={
  calves:["gastrocnemius_l","gastrocnemius_r"],
  hamstrings:["biceps_femoris_l","biceps_femoris_r","semitendinosus_l","semitendinosus_r","semimembranosus_1_l","semimembranosus_1_r","semimembranosus_2_l","semimembranosus_2_r"],
  "gluteus-maximus":["gluteus_maximus_l","gluteus_maximus_r"],
  "glute-stabilizers":["gluteus_medius_1_l","gluteus_medius_1_r","gluteus_medius_2_l","gluteus_medius_2_r"],
  quadriceps:["vastus_lateralis_l","vastus_lateralis_r","vastus_medialis_l","vastus_medialis_r","rectus_femoris_l","rectus_femoris_r"],
  abdominals:["rectus_abdominis_1","rectus_abdominis_2_l","rectus_abdominis_2_r","rectus_abdominis_3_l","rectus_abdominis_3_r","rectus_abdominis_4_l","rectus_abdominis_4_r"]
};
for(const [region,ids] of Object.entries(expectedRegions)){
  const mapped=[...(anatomy.REGION_PATHS.front[region]||[]),...(anatomy.REGION_PATHS.back[region]||[])];
  assert.deepStrictEqual(mapped,ids,`${region} must resolve only to its anatomical source paths`);
}

assert.match(css,/\.muscle-region\.primary\{[^}]*fill:#39ff14!important/);
assert.match(css,/\.muscle-region\.secondary\{[^}]*fill:#ff4fd8!important/);
assert.match(css,/\.anatomy-neutral\{fill:#737b84\}/);
assert.doesNotMatch(css,/\.muscle-target-panel:(?::)?after\s*\{/i);
assert.match(app,/data-renderer="inline-anatomical-svg"/);
assert.match(app,/EXERCISE_MUSCLE_ANATOMY\.viewBox\?\.\(side\)/);
assert.doesNotMatch(front+back,/<(?:rect|ellipse|polygon|image|use|mask)\b/i);
assert.match(front,/id="pectoralis_major_l"/);
assert.match(back,/id="latissimus_dorsi_l"/);

console.log("Muscles Worked rendering tests passed: 13 runtime fixtures use one set of licensed anatomical paths, exact neon fills, semantic source IDs, grayscale neutral anatomy, and no overlay geometry.");
