(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_EXERCISES=api;
})(typeof self!=="undefined"?self:globalThis,function(){
  const definitions=[
    ["road12.squat.smith-machine","Smith Machine Squat","SMITH_MACHINE_SQUAT",[]],
    ["road12.squat.goblet","Goblet Squat","GOBLET_SQUAT",[]],
    ["road12.press.cable-chest","Cable Chest Press","CHEST_PRESS",[]],
    ["road12.row.seated-cable","Seated Cable Row","SEATED_CABLE_ROW",[]],
    ["road12.pull.lat-pulldown","Lat Pulldown","LAT_PULLDOWN",["Lat Pull Down"]],
    ["road12.press.cable-shoulder","Cable Shoulder Press","SHOULDER_PRESS_GENERIC",[]],
    ["road12.triceps.rope-pushdown","Rope Triceps Pushdown","CABLE_TRICEPS_PUSHDOWN",[]],
    ["road12.curl.cable","Cable Curl","CABLE_BICEPS_CURL",[]],
    ["road12.curl.dumbbell-alternating","Alternating Dumbbell Curl","BICEPS_CURL",[]],
    ["road12.curl.cable-behind-back-single-arm","Behind-the-Back Single-Arm Cable Curl","CABLE_BICEPS_CURL",[]],
    ["road12.deadlift.smith-rdl","Smith Machine RDL","ROMANIAN_DEADLIFTS",[]],
    ["road12.lunge.smith-bulgarian","Smith Bulgarian Split Squat","SMITH_MACHINE_LUNGE",[]],
    ["road12.calf-raise.smith","Smith Machine Calf Raise","STANDING_CALF_RAISE",[]],
    ["road12.press.incline-cable","Incline Cable Press","MACHINE_INCLINE_CHEST_PRESS",[]],
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
    ["road12.core.lying-leg-raise","Lying Leg Raise","LEG_RAISE",[]],
    ["road12.core.forearm-plank-posterior-tilt","Forearm Plank with Posterior Pelvic Tilt","PLANK",[]],
    ["road12.core.hanging-knee-raise","Hanging Knee Raise","HANGING_KNEE_RAISE",[]],
    ["road12.core.decline-reverse-crunch","Decline Bench Reverse Crunch","CRUNCH",[]],
    ["road12.core.hanging-garhammer","Hanging Garhammer Raise","HANGING_KNEE_RAISE",[]]
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
  return Object.freeze({definitions:Object.freeze(definitions),resolve});
});
