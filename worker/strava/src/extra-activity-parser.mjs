export const EXTRA_ACTIVITY_MODEL="@cf/meta/llama-3.2-11b-vision-instruct";
export const EXTRA_ACTIVITY_PARSER_VERSION="ifit-screenshot-v2-plain-text";

const LABELS=["ACTIVITY","DATE","START","END","DURATION","DISTANCE","PACE","ACTIVE_CALORIES","TOTAL_CALORIES","AVERAGE_HR","INCLINE"];
const FIELD_NAMES=["sourceActivityName","date","startTime","endTime","durationSeconds","distance","activeCalories","totalCalories","averagePaceSecondsPerMile","averageHeartRate","inclineResistance"];
const MONTHS={january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12,jan:1,feb:2,mar:3,apr:4,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12};
const nullValue=value=>/^(?:null|not_found|not found|n\/a|--?)$/i.test(String(value||"").trim());
const addWarning=(warnings,message)=>{if(!warnings.includes(message))warnings.push(message);};

function parseLabeledText(raw){
  const literalFields={},duplicates=[];
  for(const line of String(raw||"").split(/\r?\n/)){
    const match=line.trim().match(/^([A-Z_]+)\s*:\s*(.*?)\s*$/i);
    if(!match)continue;
    const label=match[1].toUpperCase();
    if(!LABELS.includes(label))continue;
    if(Object.hasOwn(literalFields,label)){duplicates.push(label);continue;}
    literalFields[label]=match[2];
  }
  return {literalFields,duplicates};
}
function parseNumber(value,{integer=false}={}){
  if(value===undefined||nullValue(value))return null;
  const cleaned=String(value).replace(/,/g,"").trim();
  if(!/^-?\d+(?:\.\d+)?(?:\s*(?:cal|kcal|bpm|%))?$/i.test(cleaned))return undefined;
  const number=Number.parseFloat(cleaned);
  return Number.isFinite(number)&&(integer?Number.isInteger(number):true)&&number>=0?number:undefined;
}
function validDate(year,month,day){
  if(!month||day<1||day>31)return undefined;
  const date=new Date(Date.UTC(year,month-1,day));
  return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day?`${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`:undefined;
}
function parseDate(value){
  if(value===undefined||nullValue(value))return null;
  const text=String(value).trim();
  let match=text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if(match)return validDate(+match[1],+match[2],+match[3]);
  match=text.replace(/,/g,"").match(/^([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})$/);
  return match?validDate(+match[3],MONTHS[match[1].toLowerCase()],+match[2]):undefined;
}
function parseTime(value){
  if(value===undefined||nullValue(value))return null;
  const match=String(value).trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AP]M)?$/i);
  if(!match)return undefined;
  let hour=+match[1];const minute=+match[2];
  if(minute>59||hour>(match[3]?12:23)||match[3]&&hour<1)return undefined;
  if(match[3])hour=(hour%12)+(match[3].toUpperCase()==="PM"?12:0);
  return `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
}
function parseDuration(value){
  if(value===undefined||nullValue(value))return null;
  const parts=String(value).trim().split(":");
  if(parts.length<2||parts.length>3||parts.some(part=>!/^\d{1,2}$/.test(part)))return undefined;
  const values=parts.map(Number),seconds=parts.length===3?values[0]*3600+values[1]*60+values[2]:values[0]*60+values[1];
  return values.slice(-2).some(number=>number>59)||seconds<=0?undefined:seconds;
}
function parseDistance(value){
  if(value===undefined||nullValue(value))return {value:null,unit:null};
  const match=String(value).replace(/,/g,"").trim().match(/^(\d+(?:\.\d+)?)\s*(mi|mile|miles|km|kilometer|kilometers)?$/i);
  return !match||+match[1]<=0?{value:undefined,unit:undefined}:{value:+match[1],unit:/^k/i.test(match[2]||"")?"km":"mi"};
}
function parsePace(value){
  if(value===undefined||nullValue(value))return {seconds:null,display:null};
  const normalized=String(value).trim().replace(/[’']/g,":").replace(/[”"]/g,"");
  const match=normalized.match(/^(\d{1,3}):(\d{2})\s*(?:\/\s*(mi|mile|km)|per\s+(mi|mile|km))?$/i);
  if(!match||+match[2]>59)return {seconds:undefined,display:undefined};
  const unit=(match[3]||match[4]||"mi").toLowerCase(),rawSeconds=+match[1]*60 + +match[2];
  const seconds=unit==="km"?Math.round(rawSeconds*1.609344):rawSeconds;
  return {seconds,display:`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}/mi`};
}
const clockSeconds=value=>{if(!value)return null;const [hour,minute]=value.split(":").map(Number);return hour*3600+minute*60;};

export function parseExtraActivityVisionText(raw){
  const {literalFields,duplicates}=parseLabeledText(raw),warnings=[],malformed=new Set();
  const activity=literalFields.ACTIVITY===undefined||nullValue(literalFields.ACTIVITY)?null:String(literalFields.ACTIVITY).trim()||null;
  const date=parseDate(literalFields.DATE),start=parseTime(literalFields.START),end=parseTime(literalFields.END),duration=parseDuration(literalFields.DURATION);
  const distance=parseDistance(literalFields.DISTANCE),pace=parsePace(literalFields.PACE);
  const active=parseNumber(literalFields.ACTIVE_CALORIES,{integer:true}),total=parseNumber(literalFields.TOTAL_CALORIES,{integer:true}),heartRate=parseNumber(literalFields.AVERAGE_HR,{integer:true});
  const incline=literalFields.INCLINE===undefined||nullValue(literalFields.INCLINE)?null:String(literalFields.INCLINE).trim()||null;
  const values={sourceActivityName:activity,date,startTime:start,endTime:end,durationSeconds:duration,distance:distance.value,activeCalories:active,totalCalories:total,averagePaceSecondsPerMile:pace.seconds,averageHeartRate:heartRate,inclineResistance:incline};
  for(const [key,value] of Object.entries(values))if(value===undefined){values[key]=null;malformed.add(key);addWarning(warnings,`${key} was present but malformed. Enter or correct it manually.`);}
  const labelFields=Object.fromEntries(LABELS.map((label,index)=>[label,FIELD_NAMES[index]]));
  for(const label of duplicates){const key=labelFields[label];if(key)malformed.add(key);addWarning(warnings,`${label} appeared more than once. The first value is shown for review.`);}
  const confidence=Object.fromEntries(FIELD_NAMES.map(key=>[key,malformed.has(key)?"LOW":values[key]===null?"NOT_FOUND":"HIGH"]));
  if(values.startTime&&values.endTime&&values.durationSeconds!==null){
    const clockDuration=(clockSeconds(values.endTime)-clockSeconds(values.startTime)+86400)%86400;
    if(Math.abs(clockDuration-values.durationSeconds)>180){addWarning(warnings,"Start time, end time, and duration conflict by more than 3 minutes. Review all three values.");confidence.startTime=confidence.endTime=confidence.durationSeconds="LOW";}
  }
  if(values.durationSeconds!==null&&values.distance!==null&&values.averagePaceSecondsPerMile!==null){
    const miles=distance.unit==="km"?values.distance/1.609344:values.distance,calculated=values.durationSeconds/miles;
    if(Math.abs(calculated-values.averagePaceSecondsPerMile)>30){addWarning(warnings,"Duration, distance, and pace conflict by more than 30 seconds per mile. Review all three values.");confidence.durationSeconds=confidence.distance=confidence.averagePaceSecondsPerMile="LOW";}
  }
  if(values.activeCalories!==null&&values.totalCalories!==null&&values.activeCalories>values.totalCalories){addWarning(warnings,"Active calories are greater than total calories. Review both values.");confidence.activeCalories=confidence.totalCalories="LOW";}
  const usable=[values.sourceActivityName,values.date,values.durationSeconds,values.distance].filter(value=>value!==null).length;
  if(usable<2)addWarning(warnings,"Extraction was incomplete. Enter the missing workout details manually.");
  return {candidate:{source:"iFIT",...values,distanceUnit:distance.unit,averagePaceDisplay:pace.display,confidence,warnings},literalFields,extractionComplete:usable>=2,reviewRequired:true};
}

export function classifyWorkersAiError(error){
  const providerCode=error?.code??error?.cause?.code??null,providerStatus=Number(error?.status??error?.statusCode??error?.cause?.status)||null;
  const message=String(error?.message||error?.cause?.message||"").toLowerCase();
  if(providerCode===3006||providerStatus===413||/request too large|image.*too (?:large|big)/.test(message))return {code:"AI_REQUEST_TOO_LARGE",status:413,diagnosticCategory:"REQUEST_TOO_LARGE"};
  if(providerCode===3007||providerStatus===408||/timeout|timed out/.test(message))return {code:"AI_TIMEOUT",status:504,diagnosticCategory:"TIMEOUT"};
  if(providerCode===5004||/invalid.*(?:image|base64)|base64.*invalid|unsupported image/.test(message))return {code:"AI_INVALID_IMAGE",status:400,diagnosticCategory:"INVALID_IMAGE_OR_BASE64"};
  return {code:"AI_PROVIDER_INTERNAL",status:502,diagnosticCategory:"MODEL_PROVIDER_INTERNAL"};
}
const safeWorkersAiError=error=>Object.assign(new Error("Screenshot recognition is temporarily unavailable. Continue with manual entry or retry later."),classifyWorkersAiError(error));

export async function extractExtraActivityScreenshot({env,imageDataUrl}){
  if(!env.AI?.run)throw Object.assign(new Error("Screenshot processing is not configured. Continue with manual entry."),{code:"PARSER_UNAVAILABLE",status:503});
  if(typeof imageDataUrl!=="string"||!/^data:image\/(?:jpeg|png|webp);base64,/i.test(imageDataUrl))throw Object.assign(new Error("Choose a JPEG, PNG, or WebP workout screenshot."),{code:"INVALID_IMAGE",status:400});
  if(imageDataUrl.length>6_500_000)throw Object.assign(new Error("The workout screenshot is too large."),{code:"IMAGE_TOO_LARGE",status:413});
  let result;
  try{
    result=await env.AI.run(EXTRA_ACTIVITY_MODEL,{messages:[
      {role:"system",content:"Read only facts visibly printed in this iFIT workout-summary screenshot. Do not calculate, infer, or explain anything. Return exactly one line for each requested label. Use null when missing or unreadable."},
      {role:"user",content:"Return ONLY these lines:\nACTIVITY:\nDATE:\nSTART:\nEND:\nDURATION:\nDISTANCE:\nPACE:\nACTIVE_CALORIES:\nTOTAL_CALORIES:\nAVERAGE_HR:\nINCLINE:\nThis image is not Strava data."}
    ],image:imageDataUrl,max_tokens:500});
  }catch(error){throw safeWorkersAiError(error);}
  const raw=result?.response??result,parsed=parseExtraActivityVisionText(typeof raw==="string"?raw:"");
  return {...parsed,processor:"Cloudflare Workers AI",model:EXTRA_ACTIVITY_MODEL,parserVersion:EXTRA_ACTIVITY_PARSER_VERSION,stored:false};
}
