(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_STRAVA_DATA=api;
})(typeof self!=="undefined"?self:globalThis,function(){
  const CLASSIFICATION=Object.freeze({
    deleteOnDisconnect:Object.freeze([
      "athleteId","athleteName","grantedScopes","accessToken","refreshToken","tokenExpiration",
      "connectionTimestamps","oauthProviderMetadata","uploadId","activityId","providerSyncState",
      "providerErrors","providerTimestamps","viewOnStravaReference"
    ]),
    safeLocalNonStrava:Object.freeze([
      "road12SessionId","workoutName","exercises","sets","repetitions","locallyLoggedWeights",
      "road12Timestamps","progressionHistory","coachingFeedback","locallyGeneratedExternalId","deletionTombstone"
    ]),
    temporaryExpiring:Object.freeze(["oauthState","requestNonce","rateLimitMetadata"])
  });
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const time=value=>{
    const parsed=new Date(value||0).getTime();
    return Number.isFinite(parsed)?parsed:0;
  };
  function providerRecordTime(record){
    return Math.max(time(record?.uploadedAt),time(record?.lastAttemptAt),time(record?.connectedAt));
  }
  function stripSession(session){
    const next=clone(session||{});
    if(!next.externalSync?.strava)return next;
    delete next.externalSync.strava;
    if(!Object.keys(next.externalSync).length)delete next.externalSync;
    return next;
  }
  function normalizeMarker(marker){
    if(!marker||!time(marker.deletedAt))return null;
    return {
      version:1,
      deletedAt:new Date(marker.deletedAt).toISOString(),
      blockedSessionIds:[...new Set((marker.blockedSessionIds||[]).map(String).filter(Boolean))]
    };
  }
  function newestMarker(a,b){
    const first=normalizeMarker(a),second=normalizeMarker(b);
    if(!first)return second;
    if(!second)return first;
    const newest=time(second.deletedAt)>time(first.deletedAt)?second:first;
    return {version:1,deletedAt:newest.deletedAt,blockedSessionIds:[...new Set([...first.blockedSessionIds,...second.blockedSessionIds])]};
  }
  function shouldStrip(session,marker){
    const record=session?.externalSync?.strava;
    if(!record||!marker)return false;
    if(marker.blockedSessionIds.includes(String(session.id||"")))return true;
    const recordedAt=providerRecordTime(record);
    return !recordedAt||recordedAt<=time(marker.deletedAt);
  }
  function enforce(state,marker=state?.stravaDeletion){
    const next=clone(state||{}),normalized=normalizeMarker(marker);
    if(!normalized)return next;
    next.stravaDeletion=normalized;
    next.history=(next.history||[]).map(session=>shouldStrip(session,normalized)?stripSession(session):session);
    if(next.currentSession&&shouldStrip(next.currentSession,normalized))next.currentSession=stripSession(next.currentSession);
    return next;
  }
  function clearAfterConfirmedDisconnect(state,deletedAt=new Date().toISOString()){
    const next=clone(state||{});
    const touched=[...(next.history||[]),next.currentSession].filter(Boolean).filter(session=>session.externalSync?.strava).map(session=>String(session.id||"")).filter(Boolean);
    const marker=newestMarker(next.stravaDeletion,{version:1,deletedAt,blockedSessionIds:touched});
    next.stravaDeletion=marker;
    next.history=(next.history||[]).map(stripSession);
    if(next.currentSession)next.currentSession=stripSession(next.currentSession);
    return next;
  }
  return Object.freeze({CLASSIFICATION,providerRecordTime,stripSession,normalizeMarker,newestMarker,enforce,clearAfterConfirmedDisconnect});
});
