const assert=require("node:assert");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8").replace(/\s+/g," ");

const statusMappings={
  completed:'🟢',scheduled:'🔵',inProgress:'🟡',rescheduled:'🟠',missed:'⚫',restDay:'🟣'
};
const typeMappings={strength:'💪',cardio:'❤️',mobility:'🧘',conditioning:'🏃',recovery:'😴',rest:'—'};
for(const [key,icon] of Object.entries(statusMappings)){
  assert(app.includes(`${key}:{icon:"${icon}"`),`calendar status ${key} must retain its production semantic indicator ${icon}`);
}
for(const [key,icon] of Object.entries(typeMappings)){
  assert(app.includes(`${key}:{icon:"${icon}"`),`calendar type ${key} must retain its production semantic indicator ${icon}`);
}
assert(css.includes(".calendar-day.status-missed{border-color:#727b87;background:linear-gradient(145deg,#171b21,#0d1014);box-shadow:inset 3px 0 0 #89929d}"),"missed days must retain the exact production gray treatment");
assert(css.includes(".calendar-day.has-extra-activity{box-shadow:inset 0 -3px 0 #ff9f43}"),"Extra Activity must retain the production orange indicator");
assert(css.lastIndexOf(".calendar-day.today{")>css.lastIndexOf(".calendar-day.status-missed{"),"the Phase 2 blue selected-day treatment must remain visually authoritative");
assert(!css.includes(".calendar-day.status-completed{border-color:color-mix"),"Phase 2 must not replace production status semantics with a card-wide completed tint");

console.log("Calendar semantic-color tests passed: production status/type indicators and missed/Extra Activity treatments are restored while selected-day blue remains authoritative.");
