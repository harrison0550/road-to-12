const assert=require("node:assert");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const root=path.resolve(__dirname,"..");
const build=require(path.join(root,"build-upper-lower-program.js"));
const identities=require(path.join(root,"exercise-identity.js"));
const coach=require(path.join(root,"adaptive-coaching.js"));
const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const libraryContext={self:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"exercise-library.js"),"utf8"),libraryContext,{filename:"exercise-library.js"});
const media=libraryContext.self.ROAD12_EXERCISE_LIBRARY.entries;

const expected={
  UPPER_A:{id:"build-upper-a",planDay:0,sets:22,exercises:[
    ["Smith Machine Bench Press",4,"6–10"],["GMWD Converging Chest Press",4,"8–12"],["Seated Cable Row",3,"8–12"],["Lat Pulldown",2,"8–12"],
    ["Dumbbell Lateral Raise",2,"12–15"],["Seated Concentration Curl",3,"10–15"],["Cable Hammer Curl",2,"10–15"],["Rope Triceps Pushdown",2,"10–15"]
  ]},
  LOWER_A:{id:"build-lower-a",planDay:1,sets:19,exercises:[
    ["Smith Machine Squat",4,"8–12"],["Smith Machine Hip Thrust",3,"8–12"],["Standing Single-Leg Cable Hamstring Curl",2,"10–15"],
    ["Smith Machine Single-Leg Squat",2,"8–12"],["Smith Machine Calf Raise",4,"8–12"],["Cable Crunch",2,"10–15"],["Lying Leg Raise",2,"10–15"]
  ]},
  UPPER_B:{id:"build-upper-b",planDay:3,sets:21,exercises:[
    ["Lat Pulldown",4,"8–12"],["Single Arm Cable Row",3,"8–12"],["Low-Incline Dumbbell Press",4,"10–15"],["Dumbbell Lateral Raise",2,"12–15"],
    ["Rear Delt Cable Fly",2,"12–15"],["Alternating Dumbbell Curl",2,"8–12"],["Cable Curl",2,"10–15"],["V-Bar Triceps Pushdown",2,"10–15"]
  ]},
  LOWER_B:{id:"build-lower-b",planDay:4,sets:20,exercises:[
    ["Smith Machine Hip Thrust",3,"8–12"],["Standing Single-Leg Cable Hamstring Curl",4,"10–15"],["Smith Machine Squat",3,"10–12"],
    ["Smith Machine Single-Leg Squat",2,"10–12"],["Smith Machine Calf Raise",4,"12–15"],["High to Low Cable Chop",2,"10–12"],["Reverse Crunch",2,"12–15"]
  ]}
};

assert.strictEqual(build.validation.valid,true,build.validation.errors.join("\n"));
assert.deepStrictEqual(Object.keys(build.TEMPLATES),Object.keys(expected));
assert.strictEqual(Object.values(build.TEMPLATES).length,4);
for(const [key,spec] of Object.entries(expected)){
  const template=build.TEMPLATES[key];
  assert.strictEqual(template.id,spec.id);
  assert.strictEqual(template.planDay,spec.planDay);
  assert.strictEqual(build.strengthSetCount(template),spec.sets);
  const working=template.exercises.filter(exercise=>exercise.sets);
  assert.deepStrictEqual(working.map(exercise=>[exercise.name,exercise.sets,exercise.reps]),spec.exercises,`${key} order or prescription changed`);
  working.forEach(exercise=>{
    assert.deepStrictEqual(exercise.targetRirRange,[2,3]);
    assert(media[exercise.name],`${exercise.name} lacks reviewed media`);
    const identity=identities.resolve(exercise.name);
    assert(!identity.id.startsWith("road12.exercise."),`${exercise.name} lacks a canonical identity`);
    assert(identities.isSupportedStravaExerciseType(identity.externalMappings.strava?.exerciseType),`${exercise.name} lacks a supported Strava mapping`);
  });
}

const names=Object.values(build.TEMPLATES).flatMap(template=>template.exercises.map(exercise=>exercise.name));
assert(!names.some(name=>/Romanian Deadlift|\bRDL\b/i.test(name)));
assert(build.TEMPLATES.UPPER_A.exercises.some(exercise=>exercise.name==="GMWD Converging Chest Press"));
assert(build.TEMPLATES.UPPER_A.exercises.some(exercise=>exercise.name==="Seated Concentration Curl"));
for(const key of ["LOWER_A","LOWER_B"]){
  assert(build.TEMPLATES[key].exercises.some(exercise=>exercise.name==="Standing Single-Leg Cable Hamstring Curl"));
  assert(build.TEMPLATES[key].exercises.some(exercise=>exercise.name==="Smith Machine Calf Raise"));
  assert(build.TEMPLATES[key].exercises.some(exercise=>exercise.primaryGroup==="core"));
}
assert.deepStrictEqual(build.weeklyPrimarySets(),{chest:12,back:12,shoulders:6,biceps:9,triceps:4,quads:9,glutes:8,hamstrings:6,calves:8,core:8});

const history=["one","two"].map(id=>({id,name:"Full Body A",completionStatus:"completed",exercises:[{name:"Smith Machine Bench Press",sets:[1,2,3,4].map(()=>({done:true,reps:10,weight:60})),feedback:{rir:3,form:"Clean",discomfort:false}}]}));
assert.strictEqual(coach.exerciseRecommendation(history,{one:"Good",two:"Good"},{name:"Smith Machine Bench Press",type:"strength",sets:4,reps:"6–10",progressionRirRange:[2,3]}).action,"PROGRESS","canonical continuing history must remain usable");

assert.strictEqual(typeof build.activateSchedule,"function","approved templates must expose the guarded scheduler activation projection");
assert(index.includes("build-upper-lower-program.js"),"approved templates must load in production");
assert(!index.includes("build-program.js"),"obsolete three-day templates must not load in production");

console.log("Approved four-day Build template validation passed.");
