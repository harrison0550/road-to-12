const assert=require("assert");
const fs=require("fs");
const path=require("path");
const vm=require("vm");
const backup=require("../backup-restore.js");

const root=path.resolve(__dirname,"..");
const context={self:{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,"scheduling.js"),"utf8"),context);
const scheduling=context.self.ROAD12_SCHEDULING;

function buildWeek(){
  return [
    ["planned-2026-09-27","2026-09-27",6,"Recovery + Check-in","restDay",null],
    ["planned-2026-09-28","2026-09-28",0,"Upper A","missed","build-upper-a"],
    ["planned-2026-09-29","2026-09-29",1,"Lower A","scheduled","build-lower-a"],
    ["planned-2026-09-30","2026-09-30",2,"Cardio + Recovery","scheduled",null],
    ["planned-2026-10-01","2026-10-01",3,"Upper B","scheduled","build-upper-b"],
    ["planned-2026-10-02","2026-10-02",4,"Lower B","scheduled","build-lower-b"],
    ["planned-2026-10-03","2026-10-03",5,"Zone 2","scheduled",null],
    ["planned-2026-10-04","2026-10-04",6,"Recovery + Check-in","restDay",null],
    ["planned-2026-10-05","2026-10-05",0,"Upper A","scheduled","build-upper-a"],
    ["planned-2026-10-06","2026-10-06",1,"Lower A","scheduled","build-lower-a"],
    ["planned-2026-10-07","2026-10-07",2,"Cardio + Recovery","scheduled",null],
    ["planned-2026-10-08","2026-10-08",3,"Upper B","scheduled","build-upper-b"],
    ["planned-2026-10-09","2026-10-09",4,"Lower B","scheduled","build-lower-b"],
    ["planned-2026-10-10","2026-10-10",5,"Zone 2","scheduled",null],
    ["planned-2026-10-11","2026-10-11",6,"Recovery + Check-in","restDay",null],
  ].map(([id,date,planDay,name,status,templateId])=>({id,plannedDate:date,scheduledDate:date,planDay,name,status,templateId,templateVersion:"build-upper-lower-v1"}));
}

{
  const sessions=buildWeek();
  const completedHistorical={id:"historical",plannedDate:"2026-09-26",scheduledDate:"2026-09-26",status:"completed",completedDate:"2026-09-26"};
  sessions.unshift(completedHistorical);
  const completed={id:"session-upper-a",name:"Upper A",templateId:"build-upper-a",scheduleOccurrenceId:"planned-2026-09-28",scheduleId:"planned-2026-09-28",completedDate:"2026-09-29",dateKey:"2026-09-29"};
  const occurrence=scheduling.associateCompletedSession(sessions,completed);
  assert.equal(occurrence.id,"planned-2026-09-28","completion must resolve the exact launched occurrence");
  assert.equal(occurrence.plannedDate,"2026-09-28","plannedDate must remain immutable");
  assert.equal(occurrence.scheduledDate,"2026-09-29","the performed date becomes the occurrence scheduledDate");
  assert.equal(occurrence.status,"completed");
  assert.equal(occurrence.completedDate,"2026-09-29");
  assert.deepStrictEqual(
    sessions.filter(item=>item.plannedDate>"2026-09-28").map(item=>[item.id,item.scheduledDate,item.status]),
    [
      ["planned-2026-09-29","2026-09-30","rescheduled"],
      ["planned-2026-09-30","2026-10-01","rescheduled"],
      ["planned-2026-10-01","2026-10-02","rescheduled"],
      ["planned-2026-10-02","2026-10-03","rescheduled"],
      ["planned-2026-10-03","2026-10-04","rescheduled"],
      ["planned-2026-10-04","2026-10-04","displaced"],
      ["planned-2026-10-05","2026-10-05","scheduled"],
      ["planned-2026-10-06","2026-10-06","scheduled"],
      ["planned-2026-10-07","2026-10-07","scheduled"],
      ["planned-2026-10-08","2026-10-08","scheduled"],
      ["planned-2026-10-09","2026-10-09","scheduled"],
      ["planned-2026-10-10","2026-10-10","scheduled"],
      ["planned-2026-10-11","2026-10-11","restDay"],
    ],
    "only the recovery week must shift, with Sunday recovery yielding to the catch-up workout",
  );
  assert.deepStrictEqual(completedHistorical,{id:"historical",plannedDate:"2026-09-26",scheduledDate:"2026-09-26",status:"completed",completedDate:"2026-09-26"},"completed history must not move");
  assert.notEqual(sessions.find(item=>item.id==="planned-2026-10-05").status,"completed","the next Upper A must remain unresolved");
}

{
  const sessions=buildWeek();
  sessions.find(item=>item.id==="planned-2026-09-28").status="completed";
  const repeat={id:"repeat-upper-a",name:"Upper A",templateId:"build-upper-a",completedDate:"2026-09-29",dateKey:"2026-09-29"};
  assert.equal(scheduling.associateCompletedSession(sessions,repeat),null,"an intentional repeat without an occurrence ID must not consume a future matching template");
  assert.equal(sessions.find(item=>item.id==="planned-2026-10-05").status,"scheduled");
}

{
  const sessions=buildWeek();
  const history=[{id:"session-upper-a",name:"Upper A",templateId:"build-upper-a",scheduleOccurrenceId:"planned-2026-10-05",scheduleId:"planned-2026-10-05",completedDate:"2026-09-29",dateKey:"2026-09-29"}];
  const future=sessions.find(item=>item.id==="planned-2026-10-05");
  future.status="completed";future.completedDate="2026-09-29";future.actualCompletionDate="2026-09-29";
  assert.equal(scheduling.repairOccurrenceAssociation(sessions,history,{sessionId:"session-upper-a",intendedOccurrenceId:"planned-2026-09-28",incorrectOccurrenceId:"planned-2026-10-05"}),true);
  assert.equal(history.length,1,"repair must reuse the existing history session");
  assert.equal(history[0].scheduleOccurrenceId,"planned-2026-09-28");
  assert.equal(sessions.find(item=>item.id==="planned-2026-09-28").status,"completed");
  assert.equal(future.status,"scheduled");
  assert.equal(future.scheduledDate,"2026-10-05");
  assert.equal(sessions.find(item=>item.id==="planned-2026-10-06").scheduledDate,"2026-10-06","the next Tuesday must return to normal cadence");

  const state={schemaVersion:21,history,workoutSessions:sessions};
  const payload=backup.create({version:"13.3.0",build:"occurrence-test"},state,21);
  const restored=backup.replace(backup.validate(JSON.parse(JSON.stringify(payload)),21).state);
  assert.equal(restored.history[0].scheduleOccurrenceId,"planned-2026-09-28","backup restore must preserve the history association");
  assert.equal(restored.workoutSessions.find(item=>item.id==="planned-2026-09-28").status,"completed");
}

const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
assert.match(app,/scheduleOccurrenceId:todaySchedule\?\.id\|\|null/,"launch must persist the exact occurrence ID");
assert.match(app,/associateCompletedSession\(state\.workoutSessions,session\)/,"completion must use the occurrence association boundary");
assert.match(app,/previewScheduleForDay\(state\.workoutSessions,dayIndex,localDateKey\(\),scheduleOccurrenceId\)/,"preview launch must retain the selected occurrence");
assert.doesNotMatch(app,/find\([^\n]+templateId[^\n]+status\s*=\s*["']completed/,"completion must not mark a schedule row by template identity");

console.log("Build occurrence completion tests passed: exact identity, recovery-week-only shift, Sunday catch-up buffer, Monday cadence reset, immutable history, repeat safety, same-template separation, repair, and schema-21 backup roundtrip.");
