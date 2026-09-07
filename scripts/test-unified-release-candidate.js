const assert=require("assert");
const fs=require("fs");
const path=require("path");
const vm=require("vm");

const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
const backup=require("../backup-restore.js");
const extra=require("../extra-activity.js");
const strava=require("../strava-strength-payload.js");

const migrationStart=app.indexOf("const ROAD12_MIGRATIONS=[");
const migrationEnd=app.indexOf("\n];\nconst road12Storage",migrationStart);
assert(migrationStart>=0&&migrationEnd>migrationStart,"migration table must remain extractable for compatibility tests");
const migrationSource=`${app.slice(migrationStart,migrationEnd+3)}\nglobalThis.migrations=ROAD12_MIGRATIONS;`;
const migrationContext={window:{},globalThis:null};
migrationContext.globalThis=migrationContext;
vm.runInNewContext(migrationSource,migrationContext,{filename:"app-migrations.js"});
const plain=value=>JSON.parse(JSON.stringify(value));
const migrate=input=>migrationContext.migrations
  .filter(item=>item.version>Number(input.schemaVersion||0)&&item.version<=21)
  .reduce((state,item)=>item.up(state),JSON.parse(JSON.stringify(input)));

const activity=extra.createRecord({source:"iFIT",sourceActivityName:"Outdoor Run",date:"2026-08-30",startTime:"15:37",endTime:"17:03",durationSeconds:5143,distance:5.25,distanceUnit:"mi",averagePaceSecondsPerMile:979,activeCalories:584,totalCalories:584},{method:"screenshot",now:"2026-08-30T21:04:00.000Z"});
const transition={id:"foundation-build-1",from:"foundation",to:"build",acceptedAt:"2026-09-07T12:00:00.000Z",firstBuildDate:"2026-09-14",evidenceSnapshot:{score:100}};

const old=migrate({schemaVersion:18,history:[],trainingPhase:{id:"foundation"}});
assert.equal(old.schemaVersion,21);assert.deepStrictEqual(plain(old.extraActivities),[]);assert.deepStrictEqual(plain(old.phaseTransitions),[]);assert.equal(old.buildProgramVersion,null);assert.equal(old.trainingPhase.id,"foundation");
const extra19=migrate({schemaVersion:19,history:[],trainingPhase:{id:"foundation"},extraActivities:[activity]});
assert.deepStrictEqual(plain(extra19.extraActivities),[activity]);assert.deepStrictEqual(plain(extra19.phaseTransitions),[]);assert.equal(extra19.buildProgramVersion,null);
const build19=migrate({schemaVersion:19,history:[],trainingPhase:{id:"foundation"},phaseTransitions:[transition]});
assert.deepStrictEqual(plain(build19.phaseTransitions),[transition]);assert.deepStrictEqual(plain(build19.extraActivities),[]);assert.equal(build19.trainingPhase.id,"foundation","transition evidence alone must not activate Build");
const build20=migrate({schemaVersion:20,history:[],trainingPhase:{id:"build"},phaseTransitions:[transition],buildProgramVersion:"build-upper-lower-v1"});
assert.deepStrictEqual(plain(build20.phaseTransitions),[transition]);assert.deepStrictEqual(plain(build20.extraActivities),[]);assert.equal(build20.buildProgramVersion,"build-upper-lower-v1");
const unified21={schemaVersion:21,history:[],trainingPhase:{id:"build"},phaseTransitions:[transition],buildProgramVersion:"build-upper-lower-v1",extraActivities:[activity]};
assert.deepStrictEqual(migrate(unified21),unified21);

function roundTrip(state){
  const normalized=backup.merge({},state);
  const first=backup.create({version:"13.3.0",build:"2026.09.07.2"},normalized,21);
  const restored=backup.merge({},backup.validate(JSON.parse(JSON.stringify(first)),21).state);
  const second=backup.create({version:"13.3.0",build:"2026.09.07.2"},restored,21);
  assert.deepStrictEqual(second.state,first.state);
  return second.state;
}
const foundationRoundTrip=roundTrip({...unified21,trainingPhase:{id:"foundation",number:1,status:"active",advancementLocked:true},phaseTransitions:[],buildProgramVersion:null});
assert.deepStrictEqual(foundationRoundTrip.extraActivities,[activity]);assert.equal(foundationRoundTrip.trainingPhase.id,"foundation");
const buildRoundTrip=roundTrip({...unified21,
  history:[{id:"foundation-1",name:"Full Body A",completedAt:"2026-09-04T12:00:00.000Z",completionStatus:"completed"}],
  workoutRatings:{"foundation-1":"Good"},exerciseFeedback:{"foundation-1":{rir:3,form:"Clean"}},
  approvedProgressions:{"road12.press.smith-bench":{status:"approved"}},
  bodyMeasurements:[{id:"measurement-1",source:"manual",timestamp:"2026-09-07T11:00:00.000Z",weight:210,waist:40}],
  cardioHistory:[{id:"cardio-1",name:"Zone 2 Cardio",actualDurationMinutes:45}],
  workoutSessions:[{id:"build-1",plannedDate:"2026-09-14",scheduledDate:"2026-09-14",phaseId:"build",templateId:"build-upper-a",templateVersion:"build-upper-lower-v1",status:"inProgress"}],
  currentSession:{id:"active-build-1",scheduleId:"build-1",name:"Upper A",templateId:"build-upper-a",templateVersion:"build-upper-lower-v1",trainingPhase:{id:"build"}},
  stravaDeletion:{version:1,deletedAt:"2026-09-01T12:00:00.000Z",blockedSessionIds:[]}
});
assert.deepStrictEqual(buildRoundTrip.extraActivities,[activity]);assert.deepStrictEqual(buildRoundTrip.phaseTransitions,[transition]);assert.equal(buildRoundTrip.buildProgramVersion,"build-upper-lower-v1");
const privateImageState=roundTrip({...unified21,extraActivities:[{...activity,imageDataUrl:"data:image/jpeg;base64,private",thumbnail:"private"}]});
assert.equal(privateImageState.extraActivities[0].imageDataUrl,undefined);assert.equal(privateImageState.extraActivities[0].thumbnail,undefined);

const completedSet={setType:"working",repetitions:10,weight:20,completed:true,skipped:false};
const strengthSession=(name,templateId)=>({id:`session-${templateId||name}`,name,templateId,completionStatus:"completed",exercises:[{name:"Cable Curl",weightEntry:{mode:"single"},sets:[completedSet]}]});
const approvedTemplates={"build-upper-a":"Upper A","build-lower-a":"Lower A","build-upper-b":"Upper B","build-lower-b":"Lower B"};
Object.entries(approvedTemplates).forEach(([templateId,name])=>{
  assert.equal(strava.isSessionStravaEligible(strengthSession("Localized label",templateId)),true,`${templateId} must be eligible by canonical template identity`);
  assert.equal(strava.isSessionStravaEligible(strengthSession(name,null)),true,`${name} must remain eligible for compatible history`);
});
["Build A","Build B","Build C","Core + Recovery","Zone 2 Cardio"].forEach(name=>assert.equal(strava.isSessionStravaEligible(strengthSession(name,null)),false,`${name} must be ineligible`));
assert.equal(strava.isSessionStravaEligible({...strengthSession("Upper A","build-upper-a"),sessionOrigin:"extra"}),false);

assert.match(index,/build-upper-lower-program\.js/);assert.match(index,/extra-activity\.js/);assert.doesNotMatch(index,/build-program\.js/);
assert(sw.includes('"./build-upper-lower-program.js"'));assert(sw.includes('"./extra-activity.js"'));assert(!sw.includes('"./build-program.js"'));
assert.match(app,/const ROAD12_SCHEMA_VERSION=21;/);assert.match(index,/build=2026\.09\.07\.2/);assert.match(sw,/app-meta\.js\?build=2026\.09\.07\.2/);

console.log("Unified release candidate tests passed: schema 21 collision recovery, combined backup roundtrips, canonical Build Strava eligibility, Extra Activity isolation, and stale-module removal.");
