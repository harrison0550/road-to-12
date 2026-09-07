const assert=require("assert");
const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
const extra=require("../extra-activity.js"),backup=require("../backup-restore.js"),strava=require("../strava-strength-payload.js");

const fixture={
  source:"iFIT",sourceActivityName:"Outdoor Run",date:"2026-08-30",startTime:"15:37",endTime:"17:03",
  durationSeconds:5143,distance:5.25,distanceUnit:"mi",activeCalories:584,totalCalories:584,
  averagePaceSecondsPerMile:979,averagePaceDisplay:"16:19/mi",averageHeartRate:null,inclineResistance:null,
  confidence:{sourceActivityName:"HIGH",date:"HIGH",startTime:"HIGH",endTime:"HIGH",durationSeconds:"HIGH",distance:"HIGH",activeCalories:"HIGH",totalCalories:"HIGH",averagePaceSecondsPerMile:"HIGH",averageHeartRate:"NOT_FOUND",inclineResistance:"NOT_FOUND"}
};
const candidate=extra.validate(fixture);
assert.deepEqual(extra.fitImageWithin(739,1600),{width:333,height:720,scale:.45});
assert.deepEqual(extra.fitImageWithin(720,1280),{width:405,height:720,scale:.5625});
assert.deepEqual(extra.fitImageWithin(720,720),{width:720,height:720,scale:1});
assert.deepEqual(extra.fitImageWithin(1280,720),{width:1280,height:720,scale:1});
assert.equal(candidate.sourceActivityName,"Outdoor Run");assert.equal(candidate.activityCategory,"Running");assert.equal(candidate.durationSeconds,5143);
assert.equal(candidate.distance,5.25);assert.equal(candidate.activeCalories,584);assert.equal(candidate.totalCalories,584);assert.equal(candidate.averagePaceDisplay,"16:19/mi");assert.equal(candidate.averageHeartRate,null);
assert.deepEqual(candidate.warnings,[]);
assert(extra.validate({...fixture,averagePaceSecondsPerMile:1200}).warnings.some(item=>/may not agree/.test(item)));
assert(extra.validate({...fixture,endTime:"18:03"}).warnings.some(item=>/Start time/.test(item)));
const record=extra.createRecord(candidate,{method:"screenshot",effort:"Moderate",notes:"Felt good",now:"2026-08-30T21:10:00.000Z"});
assert.equal(record.sessionOrigin,"extra");assert.equal(record.isScheduled,false);assert.equal(record.source,"ifit");assert.equal(record.elapsedDurationMs,5143000);
assert.equal(extra.identity(candidate),extra.identity({...candidate}),"stable input must have a deterministic identity");
assert(extra.isLikelyDuplicate(candidate,{...record,startTime:"15:37",durationSeconds:5143}));
assert(!extra.isLikelyDuplicate(candidate,{...record,date:"2026-08-31"}));
const screenshotRecord={...record,imageDataUrl:"data:image/png;base64,secret",thumbnail:"secret"};
const payload=backup.create({version:"13.2.0",build:"test"},{schemaVersion:19,history:[],extraActivities:[screenshotRecord]},19);
assert.equal(payload.state.extraActivities.length,1);assert(!JSON.stringify(payload).includes("base64"));assert(!JSON.stringify(payload).includes("thumbnail"));
const restored=backup.merge({history:[],extraActivities:[]},backup.validate(payload,19).state);
assert.equal(restored.extraActivities[0].id,record.id,"extra activity must survive backup round trip");
assert.equal(strava.isSessionStravaEligible(record),false,"extra cardio must never be Strava eligible");

const app=fs.readFileSync(path.join(root,"app.js"),"utf8"),css=fs.readFileSync(path.join(root,"app.css"),"utf8"),client=fs.readFileSync(path.join(root,"strava-client.js"),"utf8"),worker=fs.readFileSync(path.join(root,"worker/strava/src/index.mjs"),"utf8"),sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert(app.includes("Log Extra Activity")&&app.includes("Import Workout Screenshot")&&app.includes("Enter Manually")&&app.includes("Review Extra Activity"));
const homeSource=app.slice(app.indexOf("function home(){"),app.indexOf("function lowerAbsProgramMarkup(){"));
const bodyImportSource=app.slice(app.indexOf("function bodyMeasurementsImport(){"),app.indexOf("function progress(){"));
assert(homeSource.includes('querySelector("#logExtraActivity")'),"Home must wire the Log Extra Activity action");
assert(!bodyImportSource.includes('querySelector("#logExtraActivity")'),"Home action wiring must not be stranded inside Body Measurements");
assert(app.includes('accept="image/jpeg,image/png,image/webp,image/*"')&&!/extraScreenshotFile[^>]+capture=/.test(app),"Photos and Files picker must not force the camera");
assert(app.includes("Cloudflare Workers AI")&&app.includes("Nothing is saved until you review and confirm"));
assert(app.includes("state.extraActivities.push")&&app.includes("This activity may already be logged"));
assert(app.includes("planned schedule")&&app.includes("sessionOrigin:\"extra\"")===false,"extra session identity must be created only by the isolated module");
assert(app.includes("state.extraActivities.filter(item=>item.date===key)"),"calendar must coexist with extra activities");
assert(app.includes("extra-activity-history"),"Progress must show extra activity history");
assert(css.includes("@media(max-width:370px)")&&css.includes(".extra-activity-grid"),"review UI must collapse below 370px");
assert(client.includes("/api/extra-activity/parse-screenshot"));assert(worker.includes("extractExtraActivityScreenshot"));
assert(app.includes("fitImageWithin(image.naturalWidth,image.naturalHeight)"),"screenshots must fit within the conservative 1280 by 720 vision boundary");
assert(app.includes('item.date||(pendingExtraThumbnail?"":localDateKey())'),"an unreadable screenshot date must remain blank for review instead of silently becoming today");
assert(!/API_KEY|AI_TOKEN|CLOUDFLARE_AUTH_TOKEN/.test([app,client].join("\n")),"browser code must not contain parsing credentials");
assert(sw.includes('"./extra-activity.js"'),"extra activity logic must remain available offline for manual entry");
console.log("Extra activity tests passed: iFIT fixture, editable review model, validation, duplicates, schedule/Strava isolation, backup safety, privacy, and mobile UI.");
