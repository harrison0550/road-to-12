const assert=require("assert");
const fs=require("fs");
const path=require("path");
const coach=require("../adaptive-coaching.js");
const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");

assert.deepStrictEqual(coach.PHASES.map(phase=>phase.name),["Foundation","Build","Upper / Lower","Hypertrophy / Definition"]);
assert.strictEqual(coach.normalizeProfile({}).goal,"fatLoss");

const definition={name:"Smith Machine Squat",type:"strength",sets:3,reps:10};
const completed=(weight,reps=10)=>({name:definition.name,sets:[1,2,3].map(()=>({done:true,weight,reps}))});
assert.strictEqual(coach.exerciseRecommendation([],{},definition).action,"BUILD");
assert.strictEqual(coach.exerciseRecommendation([{id:"one",exercises:[completed(20)]}],{one:"Good"},definition).action,"HOLD");
const withFeedback=(weight,feedback,reps=10)=>Object.assign(completed(weight,reps),{feedback});
const progressRecommendation=coach.exerciseRecommendation([{id:"one",exercises:[completed(20)]},{id:"two",exercises:[withFeedback(20,{rir:3,form:"Clean",discomfort:false})]}],{two:"Good"},definition);
assert.strictEqual(progressRecommendation.action,"PROGRESS");
assert.strictEqual(progressRecommendation.prescription.weight,30,"Smith progression should use the smallest 10 lb total plate increase");
assert.strictEqual(coach.exerciseRecommendation([{id:"one",exercises:[completed(20)]},{id:"two",exercises:[completed(20,8)]}],{two:"Good"},definition).action,"HOLD");
assert.strictEqual(coach.exerciseRecommendation([{id:"one",exercises:[completed(20)]},{id:"two",exercises:[completed(20)]}],{two:"Too Hard"},definition).action,"DELOAD");
assert.strictEqual(coach.exerciseRecommendation([{id:"one",exercises:[completed(20)]},{id:"two",exercises:[withFeedback(20,{rir:2,form:"Clean",discomfort:true})]}],{two:"Good"},definition).action,"DELOAD");

const history=[];
for(let i=0;i<15;i++)history.push({id:`s${i}`,name:`Full Body ${["A","B","C"][i%3]}`,scheduleId:`p${i}`,exercises:[completed(20+i)]});
const sessions=history.map((item,i)=>({id:`p${i}`,scheduledDate:"2026-08-01",status:"completed"}));
const ratings=Object.fromEntries(history.map(item=>[item.id,"Good"]));
const readiness=coach.phaseReadiness({history,ratings,sessions,today:"2026-08-13"});
assert(readiness.score>50,"complete balanced Foundation data should raise readiness");
assert.strictEqual(readiness.locked,true,"phase advancement must remain locked until review and acceptance exist");
assert(readiness.score<=85,"a locked readiness model must not imply automatic graduation");

const source=[{name:"Lift",type:"strength",sets:3}];
const unchanged=coach.applyRecommendation(source);
assert.deepStrictEqual(unchanged,source,"the new coach must preserve current Foundation prescriptions");
assert.notStrictEqual(unchanged[0],source[0],"workout definitions must remain immutable clones");

assert(html.includes('src="adaptive-coaching.js"'));
assert(sw.includes('"./adaptive-coaching.js"'));
assert(/version:9,[\s\S]*?exerciseFeedback[\s\S]*?approvedProgressions[\s\S]*?schemaVersion=9;/.test(app),"exercise feedback and approvals need an additive migration");
assert(/QUICK EXERCISE FEEDBACK[\s\S]*?exerciseRir[\s\S]*?exerciseForm[\s\S]*?exerciseDiscomfort/.test(app),"strength exercises need quick exercise-specific feedback controls");
assert(/Approve next-session target/.test(app),"concrete progression recommendations must require approval");
assert(/Phase advancement is locked/.test(app),"UI must explain that readiness cannot silently change the schedule");
assert(/plannedDurationMinutes[\s\S]*?actualDurationMinutes[\s\S]*?averageHeartRate/.test(app),"cardio must preserve planned and actual performance");
assert(/completedWorkout\.filter[\s\S]*?sort\(\(a,b\)=>/.test(app),"cardio logging must select the main target from the completed session rather than its warm-up");
assert(/planDay:Number\.isInteger\(state\.currentSession\?\.planDay\)/.test(app),"completed history must retain the actual selected plan day for cardio and progression analysis");
assert(/state\.measurementHistory\.push/.test(app),"check-ins must append measurement history");
assert(/@media\(max-width:370px\)[\s\S]*?\.cardio-log-grid/.test(css),"new progression UI must collapse safely on small iPhones");

console.log("Foundation progression tests passed: phase readiness is multi-signal and locked, exercise guidance is specific, and cardio/measurement history is additive.");
