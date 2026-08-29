(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_BACKUP=api;
})(typeof self!=="undefined"?self:globalThis,function(){
  const FORMAT="road12-backup";
  const FORMAT_VERSION=2;
  const STATE_KEYS=Object.freeze([
    "schemaVersion","preferredName","weight","waist","sessions","history","workoutRatings",
    "dailyCheckins","achievements","trainingProfile","adaptiveRecommendation","acceptedAdaptivePlan",
    "trainingPhase","measurementHistory","bodyMeasurements","cardioHistory","approvedProgressions","lowerAbsProgram","equipment",
    "attachmentPhotos","workoutSessions","scheduleActivatedDate","adherenceBaselineDate","currentSession","logs",
    "exerciseFeedback","cardioTimers","exerciseTimings","selectedDay","previewDay","coachMode",
    "tab","step","setupReady","historyView","calendarMonth","workoutScroll"
  ]);
  const ARRAY_KEYS=Object.freeze(["history","measurementHistory","bodyMeasurements","cardioHistory","workoutSessions"]);
  const OBJECT_KEYS=Object.freeze([
    "workoutRatings","dailyCheckins","achievements","trainingProfile","trainingPhase","approvedProgressions",
    "lowerAbsProgram","equipment","attachmentPhotos","logs","exerciseFeedback","cardioTimers","exerciseTimings"
  ]);
  const BODY_MEASUREMENT_FIELDS=Object.freeze([
    "weight","bodyFatPercent","fatMass","leanBodyMass","muscleMass","skeletalMuscleMass",
    "skeletalMusclePercent","bodyWaterPercent","subcutaneousFatPercent","visceralFat",
    "proteinPercent","BMR","metabolicAge","BMI","waist","weightLb","weightKg","bmi",
    "muscleMassLb","muscleMassPercent","leanBodyMassLb","boneMassLb","bmrKcal","fatMassLb"
  ]);
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const isObject=value=>!!value&&typeof value==="object"&&!Array.isArray(value);
  function create(meta,state,schemaVersion){
    const snapshot={};
    STATE_KEYS.forEach(key=>{if(state[key]!==undefined)snapshot[key]=clone(state[key]);});
    snapshot.schemaVersion=Number(schemaVersion);
    return {
      format:FORMAT,
      formatVersion:FORMAT_VERSION,
      app:"Road to 12%",
      appVersion:String(meta.version),
      build:String(meta.build),
      schemaVersion:Number(schemaVersion),
      exportedAt:new Date().toISOString(),
      state:snapshot
    };
  }
  function validate(payload,currentSchemaVersion){
    if(!isObject(payload))throw new Error("Backup must contain a JSON object.");
    if(payload.format!==undefined&&payload.format!==FORMAT)throw new Error("This file uses an unknown backup format.");
    const modern=payload.format===FORMAT;
    if(modern&&payload.formatVersion!==FORMAT_VERSION)throw new Error("This backup format is not supported by this version of Road to 12%.");
    if(payload.app&&payload.app!=="Road to 12%")throw new Error("This file is not a Road to 12% backup.");
    if(modern&&(typeof payload.appVersion!=="string"||typeof payload.build!=="string"))throw new Error("Backup release metadata is missing or invalid.");
    const incoming=isObject(payload.state)?payload.state:payload;
    if(!Array.isArray(incoming.history))throw new Error("Backup workout history is missing or invalid.");
    const schema=Number(payload.schemaVersion??incoming.schemaVersion??0);
    if(modern&&(!Number.isInteger(schema)||schema<1))throw new Error("Backup schema metadata is missing or invalid.");
    if(schema>Number(currentSchemaVersion))throw new Error("This backup was created by a newer Road to 12% data schema.");
    ARRAY_KEYS.forEach(key=>{if(incoming[key]!==undefined&&!Array.isArray(incoming[key]))throw new Error(`Backup ${key} must be a list.`);});
    OBJECT_KEYS.forEach(key=>{if(incoming[key]!==undefined&&!isObject(incoming[key]))throw new Error(`Backup ${key} must be an object.`);});
    incoming.history.forEach((session,index)=>{if(!isObject(session))throw new Error(`Workout history entry ${index+1} is invalid.`);});
    (incoming.workoutSessions||[]).forEach((session,index)=>{
      if(!isObject(session)||typeof session.id!=="string"||typeof session.plannedDate!=="string"||typeof session.scheduledDate!=="string")throw new Error(`Scheduled workout entry ${index+1} is invalid.`);
    });
    (incoming.measurementHistory||[]).forEach((item,index)=>{if(!isObject(item))throw new Error(`Measurement entry ${index+1} is invalid.`);});
    (incoming.bodyMeasurements||[]).forEach((item,index)=>{
      if(!isObject(item)||typeof item.id!=="string"||!["manual","wyze-import","apple-health"].includes(item.source)||!Number.isFinite(new Date(item.timestamp).getTime()))throw new Error(`Body measurement entry ${index+1} is invalid.`);
      BODY_MEASUREMENT_FIELDS.forEach(field=>{
        if(item[field]!==undefined&&item[field]!==null&&!Number.isFinite(Number(item[field])))throw new Error(`Body measurement entry ${index+1} has an invalid ${field} value.`);
      });
      if(item.sourceTimestamp!==undefined&&item.sourceTimestamp!==null&&typeof item.sourceTimestamp!=="string")throw new Error(`Body measurement entry ${index+1} has an invalid source timestamp.`);
      if(item.sourceRecordNumber!==undefined&&item.sourceRecordNumber!==null&&!(["string","number"].includes(typeof item.sourceRecordNumber)))throw new Error(`Body measurement entry ${index+1} has an invalid source record number.`);
    });
    return {modern,schema,state:clone(incoming)};
  }
  function mergeBy(itemsA=[],itemsB=[],identity){
    const map=new Map();
    [...itemsA,...itemsB].forEach((item,index)=>{if(isObject(item))map.set(identity(item,index),clone(item));});
    return [...map.values()];
  }
  function sessionIdentity(session,index){return session.id||`${session.completedAt||session.startedAt||session.date||"legacy"}-${session.name||"workout"}-${session.planDay??"unknown"}`;}
  function merge(current,incoming){
    const next=clone(current||{}),source=clone(incoming||{});
    STATE_KEYS.forEach(key=>{if(source[key]!==undefined)next[key]=source[key];});
    next.history=mergeBy(current.history||[],source.history||[],sessionIdentity);
    next.workoutSessions=mergeBy(current.workoutSessions||[],source.workoutSessions||[],(item,index)=>item.id||`schedule-${index}`);
    next.measurementHistory=mergeBy(current.measurementHistory||[],source.measurementHistory||[],item=>item.id||`${item.recordedAt||item.date||"measurement"}-${item.weight??""}-${item.waist??""}`);
    next.bodyMeasurements=mergeBy(current.bodyMeasurements||[],source.bodyMeasurements||[],item=>item.id||`${item.source||"measurement"}-${item.timestamp||"unknown"}`);
    next.cardioHistory=mergeBy(current.cardioHistory||[],source.cardioHistory||[],(item,index)=>item.id||[
      item.sessionId||"legacy",item.exerciseId||item.name||"cardio",item.completedAt||item.date||index
    ].join(":"));
    ["workoutRatings","dailyCheckins","achievements","approvedProgressions","attachmentPhotos","exerciseFeedback"].forEach(key=>{
      next[key]=Object.assign({},current[key]||{},source[key]||{});
    });
    next.sessions=Math.max(Number(current.sessions)||0,Number(source.sessions)||0,next.history.length);
    return next;
  }
  return Object.freeze({FORMAT,FORMAT_VERSION,STATE_KEYS,create,validate,merge});
});
