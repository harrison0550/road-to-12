const assert=require("assert");
const fs=require("fs");
const path=require("path");
const backup=require("../backup-restore.js");
const root=path.resolve(__dirname,"..");

const state={schemaVersion:16,preferredName:"Andy",weight:210,waist:40,sessions:1,tab:"progress",step:2,history:[{id:"session-1",name:"Full Body A",completedAt:"2026-08-15T12:00:00.000Z",exercises:[{exerciseId:"smith-machine-squat",prescription:{sets:3,reps:10},sets:[{setNumber:1,repetitions:10,weight:70,completed:true}],externalMappings:{strava:{sportType:"WeightTraining"}}}],externalSync:{strava:{status:"NOT_SYNCED"}}}],workoutRatings:{"session-1":"Good"},dailyCheckins:{},achievements:{},trainingProfile:{age:40},trainingPhase:{id:"foundation"},measurementHistory:[{id:"m-1",date:"2026-08-15",weight:210,waist:40}],bodyMeasurements:[{id:"bm-1",source:"manual",timestamp:"2026-08-15T12:00:00.000Z",weight:210,waist:40},{id:"wyze-1",source:"wyze-import",timestamp:"2026-08-16T12:00:00.000Z",sourceTimestamp:"2026.08.16 8:00 AM",sourceRecordNumber:"9",weight:209.8,weightLb:209.8,weightKg:95.2,bmi:27.1,bodyFatPercent:25,muscleMassLb:145,muscleMassPercent:69.1,leanBodyMassLb:157.3,boneMassLb:8.9,bmrKcal:1880,fatMassLb:52.5}],cardioHistory:[{id:"c-1",sessionId:"session-1",name:"Warm-up",actualDurationMinutes:8}],approvedProgressions:{"smith-machine-squat":{exerciseId:"smith-machine-squat",status:"approved",prescription:{sets:3,reps:10,weight:75}}},lowerAbsProgram:{version:1,phase:1,status:"active",completedSessionIds:[],phase2ReadyAt:null,phase2AcceptedAt:null,completedAt:null},equipment:{dumbbells:true,dumbbellPairWeights:[10,15,20,25]},attachmentPhotos:{},workoutSessions:[{id:"scheduled-1",plannedDate:"2026-08-15",scheduledDate:"2026-08-16",status:"rescheduled"}],scheduleActivatedDate:"2026-08-01",adherenceBaselineDate:"2026-08-20",currentSession:{id:"active-1",sessionPrescriptions:{}},logs:{},exerciseFeedback:{},cardioTimers:{},exerciseTimings:{}};
const payload=backup.create({version:"13.2.0",build:"2026.08.29.1"},state,16);
assert.equal(payload.appVersion,"13.2.0");
assert.equal(payload.build,"2026.08.29.1");
assert.equal(payload.schemaVersion,16);
assert.equal(payload.state.adherenceBaselineDate,"2026-08-20");
const validated=backup.validate(JSON.parse(JSON.stringify(payload)),16);
const restored=backup.merge({},validated.state);
backup.STATE_KEYS.forEach(key=>{if(state[key]!==undefined)assert.deepStrictEqual(restored[key],state[key],`round trip changed ${key}`);});
assert.throws(()=>backup.validate({...payload,state:{...payload.state,history:"bad"}},16),/history/i);
assert.throws(()=>backup.validate({...payload,schemaVersion:17,state:{...payload.state,schemaVersion:17}},16),/newer/i);
assert.throws(()=>backup.validate({...payload,state:{...payload.state,bodyMeasurements:[{source:"wyze-bluetooth",timestamp:"2026-08-15T12:00:00.000Z",weight:210}]}},16),/body measurement/i);
assert.throws(()=>backup.validate({...payload,format:"other-app-backup"},16),/unknown backup format/i);
assert.throws(()=>backup.validate({...payload,build:null},16),/release metadata/i);
const untouched=JSON.stringify(state);
try{backup.validate({state:{history:null}},16);}catch(_error){}
assert.equal(JSON.stringify(state),untouched,"invalid validation mutated live data");
const localSynced={id:"session-sync",name:"Full Body C",completedAt:"2026-08-20T12:00:00.000Z",externalSync:{strava:{status:"SYNCED",activityId:"activity-123",uploadId:"upload-123",uploadedAt:"2026-08-20T13:00:00.000Z",lastAttemptAt:"2026-08-20T12:59:00.000Z",lastError:null,externalId:"road12-session-sync"}}};
const oldImported={id:"session-sync",name:"Full Body C",completedAt:"2026-08-20T12:00:00.000Z",externalSync:{strava:{status:"NOT_SYNCED",activityId:null,uploadId:null,uploadedAt:null,lastAttemptAt:null,lastError:null,externalId:"road12-session-sync"}}};
const protectedMerge=backup.merge({history:[localSynced],sessions:1},{history:[oldImported],sessions:1});
assert.strictEqual(protectedMerge.history[0].externalSync.strava.status,"SYNCED","older backup downgraded a confirmed Strava sync");
assert.strictEqual(protectedMerge.history[0].externalSync.strava.activityId,"activity-123");
assert.strictEqual(protectedMerge.history[0].externalSync.strava.uploadId,"upload-123");
assert.strictEqual(protectedMerge.history[0].externalSync.strava.uploadedAt,"2026-08-20T13:00:00.000Z");
const enrichedMerge=backup.merge(
  {history:[{id:"session-enrich",externalSync:{strava:{status:"FAILED",lastAttemptAt:"2026-08-20T12:00:00.000Z",lastError:"Temporary failure",externalId:"road12-session-enrich"}}}]},
  {history:[{id:"session-enrich",externalSync:{strava:{status:"SYNCING",uploadId:"upload-456",lastAttemptAt:"2026-08-20T12:05:00.000Z",externalId:"road12-session-enrich"}}}]}
);
assert.strictEqual(enrichedMerge.history[0].externalSync.strava.status,"SYNCING");
assert.strictEqual(enrichedMerge.history[0].externalSync.strava.uploadId,"upload-456");
assert.strictEqual(enrichedMerge.history[0].externalSync.strava.lastAttemptAt,"2026-08-20T12:05:00.000Z");
const deletionState={history:[localSynced],stravaDeletion:{version:1,deletedAt:"2026-08-30T12:00:00.000Z",blockedSessionIds:["session-sync"]}};
const deletionBackup=backup.create({version:"13.2.0",build:"2026.08.30.2"},deletionState,17);
assert.equal(deletionBackup.state.history[0].externalSync?.strava,undefined,"backup after disconnect retained Strava provider metadata");
const resurrected=backup.merge(deletionState,{history:[localSynced]});
assert.equal(resurrected.history[0].externalSync?.strava,undefined,"old backup resurrected deleted Strava provider metadata");
assert.equal(resurrected.history[0].name,"Full Body C","Strava cleanup deleted the underlying workout");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8"),index=fs.readFileSync(path.join(root,"index.html"),"utf8"),sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert(!app.includes('version:"11.3.1"'),"backup export must not hardcode an obsolete version");
assert(app.includes("ROAD12_BACKUP.validate(payload,ROAD12_SCHEMA_VERSION)"));
assert.match(index, /<script src="backup-restore\.js(?:\?build=[^"]+)?"><\/script>/);
assert(sw.includes('"./backup-restore.js"'),"backup module must work offline");
console.log("backup restore tests passed");
