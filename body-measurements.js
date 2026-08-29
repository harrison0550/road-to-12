(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_BODY_MEASUREMENTS=api;
})(typeof self!=="undefined"?self:globalThis,function(){
  const SOURCES=Object.freeze(["manual","wyze-import","apple-health"]);
  const FIELDS=Object.freeze([
    "weight","bodyFatPercent","fatMass","leanBodyMass","muscleMass","skeletalMuscleMass",
    "skeletalMusclePercent","bodyWaterPercent","subcutaneousFatPercent","visceralFat",
    "proteinPercent","BMR","metabolicAge","BMI","waist",
    "weightLb","weightKg","bmi","muscleMassLb","muscleMassPercent","leanBodyMassLb",
    "boneMassLb","bmrKcal","fatMassLb"
  ]);
  const PERCENT_FIELDS=new Set([
    "bodyFatPercent","muscleMassPercent","skeletalMusclePercent","bodyWaterPercent","subcutaneousFatPercent","proteinPercent"
  ]);

  function validTimestamp(value){
    const time=new Date(value).getTime();
    return Number.isFinite(time)?new Date(time).toISOString():null;
  }
  function validValue(field,value){
    if(value===null||value===undefined||value==="")return null;
    const number=Number(value);
    if(!Number.isFinite(number)||number<0)return null;
    if(PERCENT_FIELDS.has(field)&&number>100)return null;
    if(["weight","weightLb","weightKg","waist","BMR","bmrKcal","metabolicAge","BMI","bmi"].includes(field)&&number<=0)return null;
    return number;
  }
  function hasMeasurement(record){return FIELDS.some(field=>record[field]!==null);}
  function normalize(input,source,inputIndex=0){
    if(!input||typeof input!=="object"||Array.isArray(input))return null;
    if(!SOURCES.includes(source))throw new Error(`Unsupported body-measurement source: ${source}`);
    const timestamp=validTimestamp(input.timestamp||input.recordedAt||input.date);
    if(!timestamp)return null;
    const record={
      id:typeof input.id==="string"&&input.id.trim()?input.id.trim():`body-measurement-${source}-${timestamp}-${inputIndex}`,
      source,
      timestamp,
      sourceRecordNumber:input.sourceRecordNumber===null||input.sourceRecordNumber===undefined?null:String(input.sourceRecordNumber),
      sourceTimestamp:typeof input.sourceTimestamp==="string"?input.sourceTimestamp:null
    };
    FIELDS.forEach(field=>{record[field]=validValue(field,input[field]);});
    [["weight","weightLb"],["BMI","bmi"],["muscleMass","muscleMassLb"],["leanBodyMass","leanBodyMassLb"],["BMR","bmrKcal"],["fatMass","fatMassLb"]].forEach(([legacy,canonical])=>{
      if(record[legacy]===null&&record[canonical]!==null)record[legacy]=record[canonical];
      if(record[canonical]===null&&record[legacy]!==null)record[canonical]=record[legacy];
    });
    return hasMeasurement(record)?record:null;
  }
  function createAdapter(source){
    return Object.freeze({source,adapt(input,inputIndex=0){return normalize(input,source,inputIndex);}});
  }
  const adapters=Object.freeze({
    manual:createAdapter("manual"),
    "wyze-import":createAdapter("wyze-import"),
    "apple-health":createAdapter("apple-health")
  });
  function adapt(source,input,inputIndex=0){
    const adapter=adapters[source];
    if(!adapter)throw new Error(`Unsupported body-measurement source: ${source}`);
    return adapter.adapt(input,inputIndex);
  }
  function adaptMany(source,items){
    if(!Array.isArray(items))throw new Error("Body-measurement import must be a list.");
    return items.map((item,index)=>adapt(source,item,index)).filter(Boolean);
  }
  function fromLegacy(input,index=0){
    if(!input||typeof input!=="object")return null;
    return adapt("manual",{
      id:input.id?`body-${input.id}`:undefined,
      timestamp:input.recordedAt||input.timestamp||input.date,
      weight:input.weight,
      waist:input.waist
    },index);
  }
  function toLegacy(record){
    const timestamp=validTimestamp(record?.timestamp);
    if(!timestamp)return null;
    return {
      id:`legacy-${record.id}`,
      date:timestamp.slice(0,10),
      recordedAt:timestamp,
      weight:validValue("weight",record.weight),
      waist:validValue("waist",record.waist),
      source:record.source
    };
  }
  function normalizedRecords(records){
    return (Array.isArray(records)?records:[])
      .map((record,index)=>SOURCES.includes(record?.source)?normalize(record,record.source,index):null)
      .filter(Boolean);
  }
  function newestValue(records,field){
    if(!FIELDS.includes(field))return null;
    const match=normalizedRecords(records)
      .filter(record=>record[field]!==null)
      .sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))[0];
    return match?match[field]:null;
  }
  function newestRecord(records,field){
    if(!FIELDS.includes(field))return null;
    return normalizedRecords(records)
      .filter(record=>record[field]!==null)
      .sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))[0]||null;
  }
  function current(records,fallback={}){
    return {
      weight:newestValue(records,"weight")??validValue("weight",fallback.weight),
      waist:newestValue(records,"waist")??validValue("waist",fallback.waist)
    };
  }
  function windowed(records,field,days,asOf=new Date()){
    if(!FIELDS.includes(field)||!Number.isFinite(Number(days))||Number(days)<=0)return [];
    const end=new Date(asOf).getTime();
    if(!Number.isFinite(end))return [];
    const start=end-Number(days)*86400000;
    return normalizedRecords(records)
      .filter(record=>record[field]!==null&&new Date(record.timestamp).getTime()>=start&&new Date(record.timestamp).getTime()<=end)
      .sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp));
  }
  function rollingAverage(records,field,days=7,asOf=new Date()){
    const items=windowed(records,field,days,asOf);
    if(!items.length)return null;
    return {
      average:Number((items.reduce((sum,item)=>sum+item[field],0)/items.length).toFixed(1)),
      count:items.length,
      startAt:items[0].timestamp,
      endAt:items.at(-1).timestamp
    };
  }
  function trend(records,field,days=30,asOf=new Date()){
    const items=windowed(records,field,days,asOf);
    if(items.length<2)return null;
    return {
      change:Number((items.at(-1)[field]-items[0][field]).toFixed(1)),
      count:items.length,
      startAt:items[0].timestamp,
      endAt:items.at(-1).timestamp
    };
  }

  return Object.freeze({SOURCES,FIELDS,adapters,adapt,adaptMany,fromLegacy,toLegacy,newestValue,newestRecord,current,rollingAverage,trend});
});
