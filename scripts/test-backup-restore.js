const assert=require("assert");
const fs=require("fs");
const path=require("path");
const backup=require("../backup-restore.js");
const root=path.resolve(__dirname,"..");

const state={schemaVersion:11,preferredName:"Andy",weight:210,waist:40,sessions:1,tab:"progress",step:2,history:[{id:"session-1",name:"Full Body A",completedAt:"2026-08-15T12:00:00.000Z",exercises:[{exerciseId:"smith-machine-squat",prescription:{sets:3,reps:10},sets:[{setNumber:1,repetitions:10,weight:70,completed:true}],externalMappings:{strava:{sportType:"WeightTraining"}}}],externalSync:{strava:{status:"NOT_SYNCED"}}}],workoutRatings:{"session-1":"Good"},dailyCheckins:{},achievements:{},trainingProfile:{age:40},trainingPhase:{id:"foundation"},measurementHistory:[{id:"m-1",date:"2026-08-15",weight:210,waist:40}],cardioHistory:[{id:"c-1",sessionId:"session-1",name:"Warm-up",actualDurationMinutes:8}],approvedProgressions:{"smith-machine-squat":{exerciseId:"smith-machine-squat",status:"approved",prescription:{sets:3,reps:10,weight:75}}},equipment:{dumbbells:true},attachmentPhotos:{},workoutSessions:[{id:"scheduled-1",plannedDate:"2026-08-15",scheduledDate:"2026-08-16",status:"rescheduled"}],scheduleActivatedDate:"2026-08-01",currentSession:{id:"active-1",sessionPrescriptions:{}},logs:{},exerciseFeedback:{},cardioTimers:{},exerciseTimings:{}};
const payload=backup.create({version:"13.2.0",build:"2026.08.15.3"},state,11);
assert.equal(payload.appVersion,"13.2.0");
assert.equal(payload.build,"2026.08.15.3");
assert.equal(payload.schemaVersion,11);
const validated=backup.validate(JSON.parse(JSON.stringify(payload)),11);
const restored=backup.merge({},validated.state);
backup.STATE_KEYS.forEach(key=>{if(state[key]!==undefined)assert.deepStrictEqual(restored[key],state[key],`round trip changed ${key}`);});
assert.throws(()=>backup.validate({...payload,state:{...payload.state,history:"bad"}},11),/history/i);
assert.throws(()=>backup.validate({...payload,schemaVersion:12,state:{...payload.state,schemaVersion:12}},11),/newer/i);
assert.throws(()=>backup.validate({...payload,format:"other-app-backup"},11),/unknown backup format/i);
assert.throws(()=>backup.validate({...payload,build:null},11),/release metadata/i);
const untouched=JSON.stringify(state);
try{backup.validate({state:{history:null}},11);}catch(_error){}
assert.equal(JSON.stringify(state),untouched,"invalid validation mutated live data");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8"),index=fs.readFileSync(path.join(root,"index.html"),"utf8"),sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert(!app.includes('version:"11.3.1"'),"backup export must not hardcode an obsolete version");
assert(app.includes("ROAD12_BACKUP.validate(payload,ROAD12_SCHEMA_VERSION)"));
assert(index.includes('<script src="backup-restore.js"></script>'));
assert(sw.includes('"./backup-restore.js"'),"backup module must work offline");
console.log("backup restore tests passed");
