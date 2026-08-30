(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_STRAVA_SYNC=api;
})(typeof self!=="undefined"?self:globalThis,function(){
  const STATUSES=Object.freeze({
    NOT_SYNCED:"NOT_SYNCED",
    QUEUED:"QUEUED",
    SYNCING:"SYNCING",
    SYNCED:"SYNCED",
    FAILED:"FAILED"
  });
  const ALLOWED_TRANSITIONS=Object.freeze({
    NOT_SYNCED:Object.freeze([STATUSES.QUEUED]),
    QUEUED:Object.freeze([STATUSES.SYNCING]),
    SYNCING:Object.freeze([STATUSES.SYNCED,STATUSES.FAILED]),
    SYNCED:Object.freeze([]),
    FAILED:Object.freeze([STATUSES.QUEUED])
  });
  const rank=Object.freeze({NOT_SYNCED:0,QUEUED:1,FAILED:2,SYNCING:3,SYNCED:4});
  const fields=Object.freeze(["activityId","uploadId","uploadedAt","lastAttemptAt","lastError","externalId"]);
  const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
  function isStatus(value){return Object.values(STATUSES).includes(value);}
  function canTransition(from,to){
    if(from===to)return true;
    return !!ALLOWED_TRANSITIONS[from]?.includes(to);
  }
  function transition(record,to,patch={}){
    const current=record&&isStatus(record.status)?record.status:STATUSES.NOT_SYNCED;
    if(!isStatus(to))throw new Error(`Unknown Strava sync status: ${to}`);
    if(!canTransition(current,to))throw new Error(`Strava sync cannot transition from ${current} to ${to}`);
    return Object.assign({},clone(record||{}),clone(patch||{}),{status:to});
  }
  const nonEmpty=value=>value!==undefined&&value!==null&&value!=="";
  function laterValue(first,second){
    if(!nonEmpty(first))return second??null;
    if(!nonEmpty(second))return first;
    const firstTime=Date.parse(first),secondTime=Date.parse(second);
    if(Number.isFinite(firstTime)&&Number.isFinite(secondTime))return secondTime>firstTime?second:first;
    return second;
  }
  function evidenceScore(record){return fields.reduce((score,field)=>score+(nonEmpty(record?.[field])?1:0),0);}
  function mergeRecords(localRecord,incomingRecord){
    const local=clone(localRecord||{}),incoming=clone(incomingRecord||{});
    const localStatus=isStatus(local.status)?local.status:STATUSES.NOT_SYNCED;
    const incomingStatus=isStatus(incoming.status)?incoming.status:STATUSES.NOT_SYNCED;
    const localConfirmed=localStatus===STATUSES.SYNCED&&nonEmpty(local.activityId);
    const incomingConfirmed=incomingStatus===STATUSES.SYNCED&&nonEmpty(incoming.activityId);
    let preferred;
    if(localConfirmed&&!incomingConfirmed)preferred=local;
    else if(incomingConfirmed&&!localConfirmed)preferred=incoming;
    else if((rank[incomingStatus]??0)>(rank[localStatus]??0))preferred=incoming;
    else if((rank[incomingStatus]??0)<(rank[localStatus]??0))preferred=local;
    else preferred=evidenceScore(incoming)>evidenceScore(local)?incoming:local;
    const other=preferred===local?incoming:local;
    const merged=Object.assign({},other,preferred,{status:isStatus(preferred.status)?preferred.status:STATUSES.NOT_SYNCED});
    fields.forEach(field=>{
      if(field==="externalId")merged[field]=nonEmpty(local[field])?local[field]:(nonEmpty(incoming[field])?incoming[field]:null);
      else if(!nonEmpty(merged[field]))merged[field]=nonEmpty(other[field])?other[field]:null;
    });
    merged.uploadedAt=laterValue(local.uploadedAt,incoming.uploadedAt);
    merged.lastAttemptAt=laterValue(local.lastAttemptAt,incoming.lastAttemptAt);
    return merged;
  }
  function reconcile(record,backend={}){
    const status=isStatus(backend.state)?backend.state:(isStatus(backend.status)?backend.status:null);
    if(!status)return clone(record||{});
    const current=record&&isStatus(record.status)?record.status:STATUSES.NOT_SYNCED;
    if(current===STATUSES.SYNCED&&status!==STATUSES.SYNCED)return clone(record);
    return Object.assign({},clone(record||{}),{
      status,
      externalId:backend.externalId||record?.externalId||null,
      uploadId:backend.uploadId||record?.uploadId||null,
      activityId:backend.activityId||record?.activityId||null,
      uploadedAt:backend.uploadedAt||record?.uploadedAt||null,
      lastAttemptAt:backend.lastAttemptAt||record?.lastAttemptAt||null,
      lastError:backend.lastError||null
    });
  }
  return Object.freeze({STATUSES,ALLOWED_TRANSITIONS,isStatus,canTransition,transition,mergeRecords,reconcile});
});
