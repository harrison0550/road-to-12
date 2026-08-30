const ALLOWED_EXERCISES=new Set([
  "BARBELL_HIP_THRUST_WITH_BENCH","BENCH_PRESS_GENERIC","CABLE_BICEPS_CURL","CABLE_CRUNCH","CABLE_HAMMER_CURL",
  "CABLE_LATERAL_RAISE","CABLE_REAR_DELT_FLY","CABLE_TRICEPS_PUSHDOWN","CHEST_PRESS","CRUNCH","DUMBBELL_FLOOR_PRESS",
  "DUMBBELL_ROMANIAN_DEADLIFTS","FACE_PULL","GOBLET_SQUAT","HANGING_KNEE_RAISE","INCLINE_DUMBBELL_BENCH_PRESS",
  "KETTLEBELL_AROUND_THE_WORLD","KETTLEBELL_SWING","LATERAL_RAISE_GENERIC","LAT_PULLDOWN","LYING_STRAIGHT_LEG_RAISE",
  "MACHINE_INCLINE_CHEST_PRESS","PLANK_HOLD","ROMANIAN_DEADLIFTS","ROW_GENERIC","SEATED_CABLE_ROW","SHOULDER_PRESS_GENERIC",
  "SMITH_MACHINE_LUNGE","SMITH_MACHINE_SQUAT","STANDING_CALF_RAISE","STANDING_DUMBBELL_BICEPS_CURL","STRAIGHT_ARM_PULLDOWN",
  "SUITCASE_CARRY","UP_TO_DOWN_CABLE_TWIST"
]);
const PROHIBITED_KEYS=new Set(["bodyfat","bodyfatpercent","rir","repsinreserve","discomfort","formfeedback","progressionprescription","private","privatenotes","notes","coachingnotes","progressiondecision"]);
const normalizeKey=value=>String(value).replace(/[^a-z0-9]/gi,"").toLowerCase();
export function hasProhibitedFields(value){
  if(!value||typeof value!=="object")return false;
  if(Array.isArray(value))return value.some(hasProhibitedFields);
  return Object.entries(value).some(([key,item])=>PROHIBITED_KEYS.has(normalizeKey(key))||hasProhibitedFields(item));
}
export function validateUploadPayload(payload,{maxBytes=262144}={}){
  const errors=[];
  let size=0;
  try{size=new TextEncoder().encode(JSON.stringify(payload)).byteLength;}catch{errors.push("Payload is not serializable.");}
  if(size>maxBytes)errors.push("Payload exceeds the 256 KB limit.");
  if(hasProhibitedFields(payload))errors.push("Payload contains a prohibited private field.");
  if(!/^road12-session-[A-Za-z0-9._:-]{1,120}$/.test(String(payload?.externalId||"")))errors.push("External ID is invalid.");
  if(!/^Andy's Home Gym — Full Body [ABC]$/.test(String(payload?.name||"")))errors.push("Activity name is not allowed.");
  if(payload?.sportType!=="WeightTraining")errors.push("Only WeightTraining uploads are allowed.");
  if(payload?.dataType!=="json")errors.push("Only JSON uploads are allowed.");
  const file=payload?.file;
  if(!file||typeof file!=="object"||Array.isArray(file))errors.push("Structured strength file is missing.");
  else{
    if(file.version!=="1.0")errors.push("Structured strength version must be 1.0.");
    if(!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:?\d{2})$/.test(String(file.start_time||"")))errors.push("Start time must include a timezone.");
    if(!Number.isInteger(file.utc_offset)||Math.abs(file.utc_offset)>50400)errors.push("UTC offset is invalid.");
    if(!Number.isInteger(file.elapsed_time)||file.elapsed_time<1||file.elapsed_time>86400)errors.push("Elapsed time is invalid.");
    if(!Array.isArray(file.sets)||file.sets.length<1||file.sets.length>200)errors.push("One to 200 structured sets are required.");
    else file.sets.forEach((set,index)=>{
      if(!ALLOWED_EXERCISES.has(set?.exercise_type))errors.push(`Set ${index+1} has an unsupported exercise type.`);
      if(set?.repetitions!==undefined&&(!Number.isInteger(set.repetitions)||set.repetitions<1||set.repetitions>1000))errors.push(`Set ${index+1} repetitions are invalid.`);
      if(set?.duration!==undefined&&(!Number.isFinite(set.duration)||set.duration<1||set.duration>86400))errors.push(`Set ${index+1} duration is invalid.`);
      if(set?.weight!==undefined&&(!Number.isFinite(set.weight)||set.weight<=0||set.weight>1000))errors.push(`Set ${index+1} weight is invalid.`);
      if(set?.repetitions===undefined&&set?.duration===undefined)errors.push(`Set ${index+1} needs repetitions or duration.`);
    });
  }
  return {valid:errors.length===0,errors,size};
}
export {ALLOWED_EXERCISES};
