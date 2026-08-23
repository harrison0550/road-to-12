const assert=require("assert");
const fs=require("fs");
const path=require("path");
const vm=require("vm");

const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");

function extractFunction(source,name){
  const marker=`function ${name}(`;
  const start=source.indexOf(marker);
  assert(start>=0,`missing ${name}()`);
  const brace=source.indexOf("{",start);
  let depth=0,quote=null,escaped=false;
  for(let index=brace;index<source.length;index+=1){
    const char=source[index];
    if(quote){
      if(escaped)escaped=false;
      else if(char==="\\")escaped=true;
      else if(char===quote)quote=null;
      continue;
    }
    if(char==='"'||char==="'"||char==='`'){quote=char;continue;}
    if(char==="{")depth+=1;
    if(char==="}"&&--depth===0)return source.slice(start,index+1);
  }
  throw new Error(`unterminated ${name}()`);
}

const context={state:{history:[],lowerAbsProgram:{version:1,phase:1,status:"active",completedSessionIds:[],phase2ReadyAt:null,phase2AcceptedAt:null,completedAt:null}}};
vm.createContext(context);
vm.runInContext([
  extractFunction(app,"currentLowerAbsPhase"),
  extractFunction(app,"lowerAbsProgramStatus"),
  extractFunction(app,"recordLowerAbsCompletion"),
].join("\n"),context);

function complete(id,date){
  const session={id,planDay:3,completedAt:date};
  context.recordLowerAbsCompletion(session);
  context.state.history.push(session);
  return session;
}

complete("phase1-a","2026-08-27T12:00:00.000Z");
assert.equal(context.lowerAbsProgramStatus().phase1Count,1);
assert.equal(context.lowerAbsProgramStatus().readyForPhase2,false);
complete("phase1-b","2026-09-03T12:00:00.000Z");
assert.equal(context.lowerAbsProgramStatus().phase1Count,2);
assert.equal(context.lowerAbsProgramStatus().readyForPhase2,true);
assert(context.state.lowerAbsProgram.phase2ReadyAt,"two completed sessions must create a review milestone");
assert.equal(context.currentLowerAbsPhase(),1,"readiness alone must not advance the program");

context.state.lowerAbsProgram.phase=2;
context.state.lowerAbsProgram.phase2AcceptedAt="2026-09-04T12:00:00.000Z";
assert.equal(context.currentLowerAbsPhase(),2,"acceptance must activate Phase 2");
complete("phase2-a","2026-09-10T12:00:00.000Z");
complete("phase2-b","2026-09-17T12:00:00.000Z");
assert.equal(context.state.lowerAbsProgram.status,"completed");
assert(context.state.lowerAbsProgram.completedAt,"two Phase 2 sessions must complete the block");
assert.equal(new Set(context.state.lowerAbsProgram.completedSessionIds).size,4);

assert.match(app,/version:14,[\s\S]*?lowerAbsProgram[\s\S]*?value\.schemaVersion=14;/,"older localStorage must migrate additively");
assert.match(app,/if\(session\.planDay!==3\)return;/,"only completed Thursday Core + Recovery sessions count");
assert.match(app,/id="acceptLowerAbsPhase2"/,"Progress must provide explicit Phase 2 acceptance");
assert.match(app,/name:"Alternating Dumbbell Curl"[\s\S]*?sets:2[\s\S]*?reps:"10-12"/);
assert.match(app,/name:"Behind-the-Back Single-Arm Cable Curl"[\s\S]*?sets:2[\s\S]*?reps:"12-15"/);
assert.match(app,/function pelvicFloorRelaxationBlock\(\)\{\s*const shared=\{type:"mobility",duration:"1:00"/);
assert.match(app,/name:"Supine Diaphragmatic Breathing"/);
assert.match(app,/name:"90\/90 Hip Switch"/);

console.log("Training expansion checks passed: additive arm work, relaxation blocks, review-gated lower-ab phases, completion tracking, and schema migration are protected.");
