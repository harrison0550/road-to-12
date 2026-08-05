const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const app = fs.readFileSync(path.resolve(__dirname, "..", "app.js"), "utf8");
const helperSource = app.match(/function previewScheduleForDay\([\s\S]*?\n}/)?.[0];
assert(helperSource, "previewScheduleForDay helper must exist");

const context = {};
vm.runInNewContext(`${helperSource}; result=previewScheduleForDay;`, context);
const selectPreview = context.result;
const sessions = [
  {id:"today",planDay:1,scheduledDate:"2026-08-04",status:"scheduled"},
  {id:"tomorrow",planDay:2,scheduledDate:"2026-08-05",status:"scheduled"},
  {id:"next-week",planDay:2,scheduledDate:"2026-08-12",status:"scheduled"}
];

assert.strictEqual(selectPreview(sessions,2,"2026-08-04").id,"tomorrow","starting tomorrow's preview must select tomorrow's schedule entry");
assert.strictEqual(selectPreview(sessions,1,"2026-08-04").id,"today","starting today's preview must select today's schedule entry");
assert.match(app, /startNewSession\(dayIndex,selectedSchedule\)/, "preview launch must pass the selected day and schedule to the workout engine");
assert.match(app, /isToday=dayIndex===currentPlanIndex\(\)/, "preview must identify today on every weekday, not only Monday");
assert.match(app, /item\.status==="missed"&&!item\.coachDismissedAt/, "dismissed missed workouts must stop producing coach recommendations");
assert.match(app, /session\.coachDismissedAt=new Date\(\)\.toISOString\(\)/, "leave-missed action must record its additive dismissal state");
assert.match(app, /session\.coachDisposition="leaveMissed"/, "leave-missed intent must be explicit");

console.log("Home workout-selection checks passed: future previews launch correctly and missed recommendations can be dismissed safely.");
