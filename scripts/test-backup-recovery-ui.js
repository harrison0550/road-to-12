const assert=require("assert");
const fs=require("fs");
const path=require("path");
const backup=require("../backup-restore.js");
const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");

const history=Array.from({length:49},(_,index)=>({
  id:`completed-${index+1}`,
  name:index%2?"Upper B":"Lower A",
  completedAt:new Date(Date.UTC(2026,7,1+index)).toISOString()
}));
const payload={
  format:"road12-backup",formatVersion:2,app:"Road to 12%",appVersion:"15.0.0",build:"2026.09.26.8",
  schemaVersion:21,exportedAt:"2026-09-26T22:30:00.000Z",
  state:{schemaVersion:21,history,sessions:49,trainingPhase:{id:"build",number:2,status:"active"},
    workoutSessions:[{id:"scheduled-1",plannedDate:"2026-09-20",scheduledDate:"2026-09-20"}],
    bodyMeasurements:[{id:"measure-1",source:"manual",timestamp:"2026-09-26T12:00:00.000Z",weight:200}],
    measurementHistory:[{id:"legacy-measure-1",date:"2026-09-26",weight:200}]}
};
const preview=backup.restorePreview(payload,21);
assert.equal(preview.sessionCount,49,"recovery preview must count completed sessions");
assert.equal(preview.phaseLabel,"Build / Phase 2","recovery preview must identify Build / Phase 2");
assert.equal(preview.calendarEntryCount,1,"recovery preview must expose calendar records");
assert.equal(preview.measurementCount,1,"recovery preview must expose measurement records");
assert.equal(preview.firstSessionAt,history[0].completedAt);
assert.equal(preview.lastSessionAt,history.at(-1).completedAt);

const current={schemaVersion:21,history:[{id:"fresh-default"}],trainingPhase:{id:"foundation"},preferredName:"Temporary"};
const replaced=backup.replace(preview.validated.state);
assert.equal(replaced.history.length,49);
assert.equal(replaced.trainingPhase.id,"build");
assert.equal(replaced.preferredName,undefined,"replacement must not merge fields from the fresh store");
assert.equal(current.history.length,1,"replacement must not mutate the current store");

assert.match(app,/function backupRecoveryMarkup\(\)/,"Profile must render the recovery control");
assert.match(app,/\$\{stravaProfileMarkup\(\)\}\s*\$\{backupRecoveryMarkup\(\)\}/,"Profile must expose Data & Backup near its top");
assert.match(app,/Restore Backup<input data-restore-backup type="file" accept="application\/json,\.json">/);
assert.match(app,/Download safety backup/);
assert.match(app,/safetySaved&&confirmation\.checked/,"restore requires both safety export and explicit confirmation");
assert.match(app,/ROAD12_BACKUP\.replace\(preview\.validated\.state\)/,"restore must replace rather than merge");
assert.doesNotMatch(app,/function importV1131Backup/,"unsafe immediate merge importer must be removed");
assert.match(app,/location\.reload\(\)/,"restored views must reload from the replaced store");
assert.match(css,/\.recovery-backup-card/);
assert.match(css,/\.restore-preview-grid/);
assert.match(app,/const ROAD12_SCHEMA_VERSION=21;/,"recovery must leave schema 21 unchanged");

console.log("backup recovery UI tests passed: schema-21 preview, safety export gate, explicit confirmation, replacement semantics, and 49-session recovery verified");
