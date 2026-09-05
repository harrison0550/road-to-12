(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_EXERCISES=api;
})(typeof self!=="undefined"?self:globalThis,function(){
  /* Keep this list intentionally bounded to documented Strava tokens used by
     Road to 12%. Adding a mapping requires an explicit allowlist update so a
     typo cannot silently reach the future transport boundary. */
  const stravaSupportedExerciseTypes=Object.freeze([
    "BARBELL_HIP_THRUST_WITH_BENCH","BENCH_PRESS_GENERIC","CABLE_BICEPS_CURL",
    "CABLE_CRUNCH","CABLE_HAMMER_CURL","CABLE_LATERAL_RAISE","CABLE_REAR_DELT_FLY",
    "CABLE_TRICEPS_PUSHDOWN","CHEST_PRESS","CRUNCH","DUMBBELL_FLOOR_PRESS",
    "DUMBBELL_ROMANIAN_DEADLIFTS","FACE_PULL","GOBLET_SQUAT","HANGING_KNEE_RAISE",
    "INCLINE_DUMBBELL_BENCH_PRESS","KETTLEBELL_AROUND_THE_WORLD","KETTLEBELL_SWING",
    "LATERAL_RAISE_GENERIC","LAT_PULLDOWN","LYING_STRAIGHT_LEG_RAISE","MACHINE_INCLINE_CHEST_PRESS",
    "PLANK_HOLD","ROMANIAN_DEADLIFTS","ROW_GENERIC","SEATED_CABLE_ROW",
    "SHOULDER_PRESS_GENERIC","SMITH_MACHINE_LUNGE","SMITH_MACHINE_SQUAT",
    "STANDING_CALF_RAISE","STANDING_DUMBBELL_BICEPS_CURL","STRAIGHT_ARM_PULLDOWN",
    "SUITCASE_CARRY","UP_TO_DOWN_CABLE_TWIST"
  ]);
  const stravaSupportedExerciseTypeSet=new Set(stravaSupportedExerciseTypes);
  const definitions=[
    ["road12.squat.smith-machine","Smith Machine Squat","SMITH_MACHINE_SQUAT",[]],
    ["road12.squat.goblet","Goblet Squat","GOBLET_SQUAT",[]],
    ["road12.press.cable-chest","Cable Chest Press","CHEST_PRESS",[]],
    ["road12.press.smith-bench","Smith Machine Bench Press","BENCH_PRESS_GENERIC",[]],
    ["road12.press.gmwd-converging-chest-press","GMWD Converging Chest Press","CHEST_PRESS",[]],
    ["road12.row.seated-cable","Seated Cable Row","SEATED_CABLE_ROW",[]],
    ["road12.pull.lat-pulldown","Lat Pulldown","LAT_PULLDOWN",["Lat Pull Down"]],
    ["road12.press.cable-shoulder","Cable Shoulder Press","SHOULDER_PRESS_GENERIC",[]],
    ["road12.triceps.rope-pushdown","Rope Triceps Pushdown","CABLE_TRICEPS_PUSHDOWN",[]],
    ["road12.curl.cable","Cable Curl","CABLE_BICEPS_CURL",[]],
    ["road12.curl.dumbbell-alternating","Alternating Dumbbell Curl","STANDING_DUMBBELL_BICEPS_CURL",[]],
    ["road12.curl.cable-behind-back-single-arm","Behind-the-Back Single-Arm Cable Curl","CABLE_BICEPS_CURL",[]],
    ["road12.curl.dumbbell-concentration","Seated Concentration Curl","STANDING_DUMBBELL_BICEPS_CURL",[]],
    ["road12.deadlift.smith-rdl","Smith Machine RDL","ROMANIAN_DEADLIFTS",[]],
    ["road12.lunge.smith-bulgarian","Smith Machine Single-Leg Squat","SMITH_MACHINE_LUNGE",["Smith Bulgarian Split Squat"]],
    ["road12.triceps.v-bar-pushdown","V-Bar Triceps Pushdown","CABLE_TRICEPS_PUSHDOWN",[]],
    ["road12.calf-raise.smith","Smith Machine Calf Raise","STANDING_CALF_RAISE",[]],
    ["road12.hip-thrust.smith","Smith Machine Hip Thrust","BARBELL_HIP_THRUST_WITH_BENCH",[]],
    ["road12.press.incline-cable","Incline Cable Press","MACHINE_INCLINE_CHEST_PRESS",[]],
    ["road12.press.dumbbell-low-incline","Low-Incline Dumbbell Press","INCLINE_DUMBBELL_BENCH_PRESS",[]],
    ["road12.row.single-arm-cable","Single Arm Cable Row","ROW_GENERIC",["Single-Arm Cable Row"]],
    ["road12.lateral-raise.cable","Cable Lateral Raise","CABLE_LATERAL_RAISE",[]],
    ["road12.crunch.cable","Cable Crunch","CABLE_CRUNCH",[]],
    ["road12.curl.cable-hammer","Cable Hammer Curl","CABLE_HAMMER_CURL",[]],
    ["road12.lateral-raise.dumbbell","Dumbbell Lateral Raise","LATERAL_RAISE_GENERIC",[]],
    ["road12.press.dumbbell-floor","Dumbbell Floor Press","DUMBBELL_FLOOR_PRESS",[]],
    ["road12.deadlift.dumbbell-rdl","Dumbbell Romanian Deadlift","DUMBBELL_ROMANIAN_DEADLIFTS",["Dumbbell RDL"]],
    ["road12.fly.cable-rear-delt","Rear Delt Cable Fly","CABLE_REAR_DELT_FLY",[]],
    ["road12.pull.cable-face","Cable Face Pull","FACE_PULL",[]],
    ["road12.pull.cable-straight-arm","Cable Straight Arm Pushdown","STRAIGHT_ARM_PULLDOWN",[]],
    ["road12.rotation.cable-high-low","High to Low Cable Chop","UP_TO_DOWN_CABLE_TWIST",[]],
    ["road12.core.reverse-crunch","Reverse Crunch","CRUNCH",[]],
    ["road12.core.lying-leg-raise","Lying Leg Raise","LYING_STRAIGHT_LEG_RAISE",[]],
    ["road12.core.forearm-plank-posterior-tilt","Forearm Plank with Posterior Pelvic Tilt","PLANK_HOLD",[]],
    ["road12.core.hanging-knee-raise","Hanging Knee Raise","HANGING_KNEE_RAISE",[]],
    ["road12.core.decline-reverse-crunch","Decline Bench Reverse Crunch","CRUNCH",[]],
    ["road12.core.hanging-garhammer","Hanging Garhammer Raise","HANGING_KNEE_RAISE",[]],
    ["road12.hinge.kettlebell-swing","Kettlebell Swing","KETTLEBELL_SWING",[]],
    ["road12.core.kettlebell-around-world","Kettlebell Around the World","KETTLEBELL_AROUND_THE_WORLD",[]],
    ["road12.carry.kettlebell-suitcase","Kettlebell Suitcase Carry","SUITCASE_CARRY",[]]
  ].map(([id,name,stravaExerciseType,aliases])=>Object.freeze({id,name,aliases:Object.freeze(aliases),externalMappings:Object.freeze({strava:Object.freeze({exerciseType:stravaExerciseType})})}));
  const normalize=value=>String(value||"").trim().toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
  const byName=new Map();
  definitions.forEach(item=>[item.name,...item.aliases].forEach(name=>byName.set(normalize(name),item)));
  function slug(value){return normalize(value).replace(/\s+/g,"-")||"unknown";}
  function resolve(name){
    const known=byName.get(normalize(name));
    if(known)return known;
    return Object.freeze({id:`road12.exercise.${slug(name)}`,name:String(name||"Unknown exercise"),aliases:Object.freeze([]),externalMappings:Object.freeze({strava:null})});
  }
  function isSupportedStravaExerciseType(value){return stravaSupportedExerciseTypeSet.has(value);}
  return Object.freeze({
    definitions:Object.freeze(definitions),
    stravaSupportedExerciseTypes,
    isSupportedStravaExerciseType,
    resolve
  });
});
