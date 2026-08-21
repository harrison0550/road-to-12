const assert=require("assert");
const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");

assert.match(app,/class="preview-exercise-button"[\s\S]*?data-preview-exercise="\$\{i\}"[\s\S]*?aria-label="View \$\{item\} exercise details"/,"each guided preview row must be an accessible exercise-details button");
assert.match(app,/function showPreviewExerciseDetails\(ex,dayIndex\)[\s\S]*?exerciseTeachingMarkup\(ex\)[\s\S]*?previewPerformanceMarkup\(ex\)/,"preview details must reuse reviewed animation and teaching content");
assert.match(app,/function previewPerformanceMarkup\(ex\)[\s\S]*?lastCompletedWeight\(ex\)[\s\S]*?LAST WEIGHT USED[\s\S]*?quickSettings\(ex\)/,"strength preview details must show the target and previous completed weight");
assert.match(app,/previousCardioBlock\(ex\.name,null\)[\s\S]*?LAST PERFORMANCE/,"timed preview details must show previous cardio performance when available");
assert.match(app,/data-preview-detail-back[\s\S]*?showDayPlan\(dayIndex\)[\s\S]*?previewReturnScroll/,"returning from details must restore the workout preview and its scroll position");
const detailSource=app.slice(app.indexOf("function showPreviewExerciseDetails"),app.indexOf("function showDayPlan"));
assert.doesNotMatch(detailSource,/startNewSession|state\.currentSession\s*=|state\.logs\s*=/,"opening preview details must not start or mutate a workout");
assert.match(css,/\.preview-exercise-list \.preview-exercise-button[\s\S]*?min-height:56px/,"preview exercise buttons must meet touch-target guidance");
assert.match(css,/\.preview-exercise-list li strong\{[\s\S]*?overflow-wrap:anywhere/,"long exercise names must not create horizontal overflow");

console.log("Workout preview detail tests passed: rows are accessible, read-only, animation-backed, history-aware, and return to the saved list position.");
