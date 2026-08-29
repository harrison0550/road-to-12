(function(root,factory){
  const body=root.ROAD12_BODY_MEASUREMENTS||(typeof require==="function"?require("./body-measurements.js"):null);
  const api=factory(body);
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_WYZE_IMPORT=api;
})(typeof self!=="undefined"?self:globalThis,function(body){
  const SOURCE="wyze-import";
  const DUPLICATE_WINDOW_MS=10*60*1000;
  const HEADER_MAP=Object.freeze({
    "number":"sourceRecordNumber",
    "date and time":"sourceTimestamp",
    "weight(lb)":"weightLb",
    "weight(kg)":"weightKg",
    "bmi":"bmi",
    "body fat":"bodyFatPercent",
    "muscle mass":"muscleMassLb",
    "muscle mass %":"muscleMassPercent",
    "body water":"bodyWaterPercent",
    "lean body mass":"leanBodyMassLb",
    "bone mass":"boneMassLb",
    "protein":"proteinPercent",
    "visceral fat":"visceralFat",
    "bmr":"bmrKcal",
    "metabolic age":"metabolicAge",
    "skeletal muscle rate %":"skeletalMusclePercent",
    "fat content":"fatMassLb",
    "subcutaneous fat":"subcutaneousFatPercent"
  });
  const COMPOSITION_FIELDS=Object.freeze([
    "bmi","bodyFatPercent","muscleMassLb","muscleMassPercent","bodyWaterPercent","leanBodyMassLb",
    "boneMassLb","proteinPercent","visceralFat","bmrKcal","metabolicAge","skeletalMusclePercent",
    "fatMassLb","subcutaneousFatPercent"
  ]);

  function normalizeHeader(value){
    return String(value??"").trim().toLowerCase().replace(/\s+/g," ").replace(/\s*\(\s*/g,"(").replace(/\s*\)\s*/g,")");
  }
  function parseNumeric(value){
    if(typeof value==="number")return Number.isFinite(value)?value:null;
    const text=String(value??"").trim();
    if(!text||/^-\s*-$/.test(text))return null;
    const match=text.replace(/,/g,"").match(/-?\d+(?:\.\d+)?/);
    if(!match)return null;
    const number=Number(match[0]);
    return Number.isFinite(number)?number:null;
  }
  function parseLocalTimestamp(value){
    if(value instanceof Date&&!Number.isNaN(value.getTime())){
      const local=new Date(value.getFullYear(),value.getMonth(),value.getDate(),value.getHours(),value.getMinutes(),value.getSeconds(),value.getMilliseconds());
      return {timestamp:local.toISOString(),sourceTimestamp:value.toString()};
    }
    const sourceTimestamp=String(value??"").trim();
    if(!sourceTimestamp)return null;
    let match=sourceTimestamp.match(/^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AP]M)?$/i);
    if(!match)match=sourceTimestamp.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AP]M)?$/i);
    if(!match)return null;
    let year,month,day,hour,minute,second,meridiem;
    if(match[1].length===4){
      [,year,month,day,hour,minute,second="0",meridiem=""]=match;
    }else{
      const [,monthValue,dayValue,yearValue,hourValue,minuteValue,secondValue="0",meridiemValue=""]=match;
      year=yearValue.length===2?`20${yearValue}`:yearValue;month=monthValue;day=dayValue;hour=hourValue;minute=minuteValue;second=secondValue;meridiem=meridiemValue;
    }
    let hourNumber=Number(hour);
    if(meridiem){
      if(hourNumber===12)hourNumber=0;
      if(meridiem.toUpperCase()==="PM")hourNumber+=12;
    }
    const local=new Date(Number(year),Number(month)-1,Number(day),hourNumber,Number(minute),Number(second));
    if(local.getFullYear()!==Number(year)||local.getMonth()!==Number(month)-1||local.getDate()!==Number(day)||Number.isNaN(local.getTime()))return null;
    return {timestamp:local.toISOString(),sourceTimestamp};
  }
  function deterministicIdentity(timestamp,weight){return `${SOURCE}|${timestamp}|${weight}`;}
  function deterministicId(timestamp,weight){return `body-measurement-${encodeURIComponent(deterministicIdentity(timestamp,weight))}`;}
  function detectHeader(rows){
    for(let index=0;index<rows.length;index++){
      const headers=(rows[index]||[]).map(normalizeHeader);
      if(headers.includes("date and time")&&(headers.includes("weight(lb)")||headers.includes("weight(kg)"))){
        const columns={};
        headers.forEach((header,column)=>{if(HEADER_MAP[header])columns[HEADER_MAP[header]]=column;});
        return {index,columns};
      }
    }
    return null;
  }
  function recordRichness(record){return COMPOSITION_FIELDS.reduce((count,field)=>count+(record?.[field]!==null&&record?.[field]!==undefined?1:0),0);}
  function parseRows(rows){
    if(!Array.isArray(rows))throw new Error("The Wyze worksheet could not be read.");
    const header=detectHeader(rows);
    if(!header)throw new Error("A Wyze header row with Date and Time and Weight was not found.");
    const parsed=[];
    rows.slice(header.index+1).forEach((row,offset)=>{
      if(!Array.isArray(row))return;
      const dateValue=row[header.columns.sourceTimestamp];
      const parsedDate=parseLocalTimestamp(dateValue);
      if(!parsedDate)return;
      const values={
        sourceRecordNumber:header.columns.sourceRecordNumber===undefined?null:row[header.columns.sourceRecordNumber],
        sourceTimestamp:parsedDate.sourceTimestamp,
        timestamp:parsedDate.timestamp
      };
      Object.entries(header.columns).forEach(([field,column])=>{
        if(field!=="sourceTimestamp"&&field!=="sourceRecordNumber")values[field]=parseNumeric(row[column]);
      });
      const weightLb=values.weightLb??(values.weightKg===null||values.weightKg===undefined?null:Number((values.weightKg*2.2046226218).toFixed(1)));
      if(weightLb===null)return;
      values.weightLb=weightLb;
      values.weight=weightLb;
      values.id=deterministicId(values.timestamp,weightLb);
      const record=body.adapters[SOURCE].adapt(values,offset);
      if(record)parsed.push({record,rowNumber:header.index+offset+2,status:"pending",reason:""});
    });
    return parsed;
  }
  function measurementWeight(record){return record?.weight??record?.weightLb??null;}
  function sameWeight(left,right){
    const leftWeight=measurementWeight(left),rightWeight=measurementWeight(right);
    return leftWeight!==null&&rightWeight!==null&&Number(leftWeight)===Number(rightWeight);
  }
  function deduplicateCandidates(rows){
    const sorted=rows.slice().sort((a,b)=>new Date(a.record.timestamp)-new Date(b.record.timestamp));
    const clusters=[];
    sorted.forEach(item=>{
      const time=new Date(item.record.timestamp).getTime();
      const cluster=clusters.find(candidate=>sameWeight(candidate.items[0].record,item.record)&&time-candidate.lastTime<=DUPLICATE_WINDOW_MS);
      if(cluster){cluster.items.push(item);cluster.lastTime=time;}
      else clusters.push({items:[item],lastTime:time});
    });
    clusters.forEach(cluster=>{
      const winner=cluster.items.slice().sort((a,b)=>recordRichness(b.record)-recordRichness(a.record)||new Date(b.record.timestamp)-new Date(a.record.timestamp))[0];
      cluster.items.forEach(item=>{
        if(item!==winner){item.status="duplicate";item.reason="A newer or richer reading with the same weight was found within 10 minutes.";}
      });
    });
    return rows;
  }
  function findExact(existing,record){
    return existing.find(item=>item.id===record.id||(item.source===SOURCE&&item.timestamp===record.timestamp&&sameWeight(item,record)));
  }
  function analyze(parsedRows,existingRecords=[]){
    const rows=deduplicateCandidates(parsedRows.map(item=>Object.assign({},item)));
    const comparableExisting=existingRecords.map((record,index)=>body.adapters[record?.source]?.adapt(record,index)||record);
    rows.filter(item=>item.status==="pending").forEach(item=>{
      const exact=findExact(comparableExisting,item.record);
      if(exact){
        if(recordRichness(item.record)>recordRichness(exact)){
          item.status="update";item.targetId=exact.id;item.reason="This reading will add body-composition values to the existing measurement.";
        }else{
          item.status="duplicate";item.reason="This Wyze reading is already stored.";
        }
        return;
      }
      const time=new Date(item.record.timestamp).getTime();
      const nearbyRicher=comparableExisting.find(existing=>existing.source===SOURCE&&sameWeight(existing,item.record)&&Math.abs(new Date(existing.timestamp).getTime()-time)<=DUPLICATE_WINDOW_MS&&recordRichness(existing)>=recordRichness(item.record));
      if(nearbyRicher){item.status="duplicate";item.reason="A matching or richer Wyze reading is already stored within 10 minutes.";}
      else item.status="import";
    });
    rows.sort((a,b)=>new Date(b.record.timestamp)-new Date(a.record.timestamp));
    const uniqueCount=rows.filter(item=>item.status==="import"||item.status==="update").length;
    return {foundCount:rows.length,uniqueCount,duplicateCount:rows.length-uniqueCount,rows};
  }
  function mergeRicher(existing,incoming){
    const merged=JSON.parse(JSON.stringify(existing));
    body.FIELDS.forEach(field=>{
      if((merged[field]===null||merged[field]===undefined)&&incoming[field]!==null&&incoming[field]!==undefined)merged[field]=incoming[field];
    });
    if((merged.sourceRecordNumber===null||merged.sourceRecordNumber===undefined)&&incoming.sourceRecordNumber!==null)merged.sourceRecordNumber=incoming.sourceRecordNumber;
    if(!merged.sourceTimestamp&&incoming.sourceTimestamp)merged.sourceTimestamp=incoming.sourceTimestamp;
    return merged;
  }
  function applyReview(existingRecords,review){
    const records=JSON.parse(JSON.stringify(Array.isArray(existingRecords)?existingRecords:[]));
    let imported=0,updated=0,skipped=0;
    review.rows.forEach(item=>{
      if(item.status==="import"){
        if(!findExact(records,item.record)){records.push(JSON.parse(JSON.stringify(item.record)));imported++;}
        else skipped++;
      }else if(item.status==="update"){
        const index=records.findIndex(record=>record.id===item.targetId);
        if(index>=0){records[index]=mergeRicher(records[index],item.record);updated++;}
        else skipped++;
      }else skipped++;
    });
    return {records,imported,updated,skipped};
  }
  function parseWorkbook(arrayBuffer,xlsx=(typeof XLSX!=="undefined"?XLSX:null)){
    if(!xlsx?.read||!xlsx?.utils?.sheet_to_json)throw new Error("The offline XLSX reader is unavailable. Reload Road to 12% and try again.");
    const workbook=xlsx.read(arrayBuffer,{type:"array",cellDates:false});
    for(const sheetName of workbook.SheetNames||[]){
      const rows=xlsx.utils.sheet_to_json(workbook.Sheets[sheetName],{header:1,raw:false,defval:null,blankrows:true});
      if(detectHeader(rows))return parseRows(rows);
    }
    throw new Error("No worksheet contained the expected Wyze Scale headers.");
  }
  async function parseFile(file,xlsx=(typeof XLSX!=="undefined"?XLSX:null)){
    if(!file||!/\.xlsx$/i.test(file.name||""))throw new Error("Choose a Wyze .xlsx export file.");
    return parseWorkbook(await file.arrayBuffer(),xlsx);
  }

  return Object.freeze({SOURCE,HEADER_MAP,COMPOSITION_FIELDS,parseNumeric,parseLocalTimestamp,detectHeader,parseRows,recordRichness,deterministicIdentity,deterministicId,analyze,applyReview,parseWorkbook,parseFile});
});
