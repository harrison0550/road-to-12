(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_EXTRA_ACTIVITY=api;
})(typeof self!=="undefined"?self:globalThis,function(){
  const PARSER_VERSION="ifit-screenshot-v2-plain-text";
  const CATEGORIES=Object.freeze(["Walking","Running","Treadmill","Rowing","Cycling","Elliptical","Other Cardio"]);
  const CONFIDENCE=Object.freeze(["HIGH","MEDIUM","LOW","NOT_FOUND"]);
  const numeric=value=>value===""||value===null||value===undefined?null:(Number.isFinite(Number(value))?Number(value):null);
  const text=value=>String(value??"").trim()||null;
  const round=(value,places=2)=>value===null?null:Number(value.toFixed(places));
  function fitImageWithin(width,height,maxWidth=1280,maxHeight=720){
    const sourceWidth=Math.max(1,Number(width)||1),sourceHeight=Math.max(1,Number(height)||1);
    const scale=Math.min(1,Math.max(1,Number(maxWidth)||1)/sourceWidth,Math.max(1,Number(maxHeight)||1)/sourceHeight);
    return {width:Math.max(1,Math.round(sourceWidth*scale)),height:Math.max(1,Math.round(sourceHeight*scale)),scale};
  }
  function parseClock(value){
    const match=String(value||"").trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    return match?Number(match[1])*3600+Number(match[2])*60+Number(match[3]||0):null;
  }
  function paceFrom(durationSeconds,distance){
    const duration=numeric(durationSeconds),miles=numeric(distance);
    return duration&&miles&&miles>0?Math.round(duration/miles):null;
  }
  function paceDisplay(seconds){
    const value=numeric(seconds);
    if(value===null)return null;
    return `${Math.floor(value/60)}:${String(Math.round(value%60)).padStart(2,"0")}/mi`;
  }
  function categoryFor(sourceName,fallback="Other Cardio"){
    const name=String(sourceName||"").toLowerCase();
    if(/row/.test(name))return "Rowing";
    if(/ellipt/.test(name))return "Elliptical";
    if(/cycl|bike|ride/.test(name))return "Cycling";
    if(/treadmill/.test(name))return "Treadmill";
    if(/run|jog/.test(name))return "Running";
    if(/walk|hike/.test(name))return "Walking";
    return CATEGORIES.includes(fallback)?fallback:"Other Cardio";
  }
  function normalizeConfidence(input={}){
    const output={};
    ["sourceActivityName","date","startTime","endTime","durationSeconds","distance","activeCalories","totalCalories","averagePaceSecondsPerMile","averageHeartRate","inclineResistance"].forEach(key=>{
      const raw=typeof input[key]==="object"?input[key]?.confidence:input[key];
      output[key]=CONFIDENCE.includes(raw)?raw:"NOT_FOUND";
    });
    return output;
  }
  function normalizeCandidate(candidate={}){
    const sourceActivityName=text(candidate.sourceActivityName);
    const durationSeconds=numeric(candidate.durationSeconds);
    const distance=numeric(candidate.distance);
    const averagePaceSecondsPerMile=numeric(candidate.averagePaceSecondsPerMile);
    return {
      source:text(candidate.source)||"iFIT",
      sourceActivityName,
      activityCategory:categoryFor(sourceActivityName,candidate.activityCategory),
      date:text(candidate.date),startTime:text(candidate.startTime),endTime:text(candidate.endTime),
      durationSeconds:durationSeconds===null?null:Math.round(durationSeconds),
      distance:distance===null?null:round(distance),distanceUnit:text(candidate.distanceUnit)||"mi",
      activeCalories:numeric(candidate.activeCalories),totalCalories:numeric(candidate.totalCalories),
      averagePaceSecondsPerMile:averagePaceSecondsPerMile===null?null:Math.round(averagePaceSecondsPerMile),
      averagePaceDisplay:text(candidate.averagePaceDisplay)||paceDisplay(averagePaceSecondsPerMile),
      averageHeartRate:numeric(candidate.averageHeartRate),inclineResistance:text(candidate.inclineResistance),
      confidence:normalizeConfidence(candidate.confidence),warnings:Array.isArray(candidate.warnings)?candidate.warnings.map(String):[]
    };
  }
  function validate(candidate){
    const item=normalizeCandidate(candidate),warnings=[...item.warnings];
    const calculatedPace=paceFrom(item.durationSeconds,item.distance);
    if(calculatedPace!==null&&item.averagePaceSecondsPerMile!==null&&Math.abs(calculatedPace-item.averagePaceSecondsPerMile)>30)warnings.push("Duration, distance, and average pace may not agree. Please review them.");
    const start=parseClock(item.startTime),end=parseClock(item.endTime);
    if(start!==null&&end!==null&&item.durationSeconds!==null){
      const clockDuration=(end-start+86400)%86400;
      if(Math.abs(clockDuration-item.durationSeconds)>180)warnings.push("Start time, end time, and duration may not agree. Please review them.");
    }
    if(item.activeCalories!==null&&item.totalCalories!==null&&item.activeCalories>item.totalCalories)warnings.push("Active calories are greater than total calories. Please review them.");
    return Object.assign(item,{warnings:[...new Set(warnings)]});
  }
  function hash(value){let result=2166136261;for(let index=0;index<value.length;index++){result^=value.charCodeAt(index);result=Math.imul(result,16777619);}return (result>>>0).toString(36);}
  function identity(input){
    const item=normalizeCandidate(input);
    return `extra-${item.date||"unknown"}-${hash([item.date,item.startTime,item.durationSeconds,item.distance,item.source].join("|"))}`;
  }
  function isLikelyDuplicate(a,b){
    const left=normalizeCandidate(a),right=normalizeCandidate(b);
    if(left.date!==right.date||String(left.source).toLowerCase()!==String(right.source).toLowerCase())return false;
    const sameStart=left.startTime&&right.startTime&&left.startTime===right.startTime;
    const sameDuration=left.durationSeconds!==null&&right.durationSeconds!==null&&Math.abs(left.durationSeconds-right.durationSeconds)<=60;
    const sameDistance=left.distance!==null&&right.distance!==null&&Math.abs(left.distance-right.distance)<=0.02;
    return sameStart||(sameDuration&&sameDistance);
  }
  function duplicates(candidate,records){return (records||[]).filter(record=>isLikelyDuplicate(candidate,record));}
  function createRecord(input,options={}){
    const item=validate(input),now=options.now||new Date().toISOString();
    const date=item.date||now.slice(0,10),startedAt=item.startTime?`${date}T${item.startTime}:00`:null;
    const endedAt=item.endTime?`${date}T${item.endTime}:00`:null;
    return {
      id:identity(Object.assign({},item,{date})),sessionOrigin:"extra",isScheduled:false,
      source:String(item.source||"manual").toLowerCase()==="ifit"?"ifit":"manual",
      sourceActivityName:item.sourceActivityName,activityCategory:item.activityCategory,date,
      startedAt,endedAt,elapsedDurationMs:item.durationSeconds===null?null:item.durationSeconds*1000,
      distance:item.distance,distanceUnit:item.distanceUnit,averagePace:item.averagePaceSecondsPerMile,
      averageHeartRate:item.averageHeartRate,activeCalories:item.activeCalories,totalCalories:item.totalCalories,
      inclineResistance:item.inclineResistance,effort:text(options.effort),notes:text(options.notes),
      importMetadata:{method:options.method==="screenshot"?"screenshot":"manual",parserVersion:options.method==="screenshot"?PARSER_VERSION:null,importedAt:now},
      createdAt:now
    };
  }
  function backupSafe(record){
    const clean=JSON.parse(JSON.stringify(record));
    delete clean.screenshot;delete clean.image;delete clean.imageDataUrl;delete clean.thumbnail;
    return clean;
  }
  return Object.freeze({PARSER_VERSION,CATEGORIES,CONFIDENCE,fitImageWithin,parseClock,paceFrom,paceDisplay,categoryFor,normalizeCandidate,validate,identity,isLikelyDuplicate,duplicates,createRecord,backupSafe});
});
