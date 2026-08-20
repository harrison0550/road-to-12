const assert = require("assert");
const fs = require("fs");
const path = require("path");

const app = fs.readFileSync(path.resolve(__dirname, "..", "app.js"), "utf8");

assert.match(app, /name:"iFIT Rowing Technique",\s*duration:"8:00"/, "Tuesday must add a short iFIT rowing block");
assert.match(app, /name:"iFIT Rowing Technique"[\s\S]*?requires:\["rower"\]/, "the rowing addition must respect the equipment profile");
assert.match(app, /title:"Zone 2 Cardio"[\s\S]*?Choose treadmill, rower or KICKR CORE/, "Saturday's existing cardio choice must remain available");

assert.match(app, /name:"Dumbbell Lateral Raise",reps:12/, "Full Body A must add the lateral raise accessory");
assert.match(app, /name:"Dumbbell Floor Press",reps:12/, "Full Body B must add the floor press accessory");
assert.match(app, /name:"Dumbbell Romanian Deadlift",reps:12/, "Full Body C must add the Romanian deadlift accessory");
assert.match(app, /version:7,[\s\S]*?dumbbells:true,rower:true,kettlebells:false/, "confirmed equipment must remain enabled for existing saved profiles");
assert.match(app, /type:"strength",sets:2,rest:60,requires:\["dumbbells"\]/, "dumbbell accessories must use two conservative sets and require dumbbells");
assert.match(app, /combined weight of both dumbbells[\s\S]*?Available pairs are 10, 15, 20 and 25 lb per hand/, "weight entry must explain combined dumbbell weight and every available pair");
assert.match(app, /const workoutData=dumbbellAccessory\?\[\.\.\.baseWorkout,dumbbellAccessory\]:baseWorkout;/, "accessories must be appended without replacing the existing strength workout");
assert.match(app, /if\(ex\.type==="cooldown"\)return 7;/, "cooldowns must remain ordered after added accessories");

console.log("Weekly equipment mix checks passed: rowing and two-set dumbbell accessories are additive and cooldowns remain last.");
