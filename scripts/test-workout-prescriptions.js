const assert=require("assert");
const fs=require("fs");
const path=require("path");
const prescriptions=require("../workout-prescriptions.js");
const resolve=name=>({id:name.toLowerCase().replace(/[^a-z0-9]+/g,"-")});
const squat={name:"Smith Machine Squat",type:"strength",sets:3,reps:10,rest:90};
const press={name:"Cable Shoulder Press",type:"strength",sets:3,reps:10,rest:75};
const base=JSON.parse(JSON.stringify(squat));
for(const action of ["PROGRESS","HOLD","DELOAD"]){
  const approvals={"smith-machine-squat":{action,status:"approved",sourceSessionId:"prior",prescription:{sets:3,reps:10,weight:75,summary:`${action} target`}}};
  const captured=prescriptions.capture([squat,press],approvals,resolve);
  assert.deepStrictEqual(Object.keys(captured),["smith-machine-squat"]);
  assert.equal(captured["smith-machine-squat"].action,action);
  assert.equal(prescriptions.effective({sessionPrescriptions:captured},squat,resolve).weight,75);
  assert.equal(prescriptions.effective({sessionPrescriptions:captured},press,resolve).weight,null);
}
assert.deepStrictEqual(squat,base,"base Foundation exercise was mutated");
const target={sets:3,reps:10,weight:75};
assert.equal(prescriptions.outcome(target,[]),"notAttempted");
assert.equal(prescriptions.outcome(target,[{status:"skipped",skipped:true,weight:0,repetitions:0}]),"notAttempted");
assert.equal(prescriptions.outcome(target,[{done:true,reps:10,weight:75},{done:true,reps:10,weight:75},{done:true,reps:10,weight:75}]),"followed");
assert.equal(prescriptions.outcome(target,[{done:true,reps:10,weight:75},{done:true,reps:8,weight:75}]),"partiallyFollowed");
assert.equal(prescriptions.outcome(target,[{weight:60,reps:8}]),"overridden");
assert.equal(prescriptions.outcome({sets:1,reps:"8–10",weight:75},[{done:true,reps:8,weight:75}]),"followed","rep ranges must preserve their minimum target");
const legacy=prescriptions.capture([squat],{"Smith Machine Squat":{action:"HOLD",sets:3,reps:10,weight:70}},resolve);
assert.equal(legacy["smith-machine-squat"].prescription.weight,70,"legacy name fallback failed");
const approval={"smith-machine-squat":{status:"approved",prescription:target}};
const completed=prescriptions.completeApprovals(approval,{"smith-machine-squat":legacy["smith-machine-squat"]},[{exerciseId:"smith-machine-squat",sets:[]}],"session-2","now");
assert.equal(completed["smith-machine-squat"].outcome,"notAttempted");
assert.equal(approval["smith-machine-squat"].status,"approved","completion mutated source approvals");
assert.equal(prescriptions.inputWeight("",35),35,"a displayed prescription must become the real input value");
assert.equal(prescriptions.inputWeight(undefined,"35"),35);
assert.equal(prescriptions.inputWeight(0,35),0,"an explicit zero must not be overwritten");
assert.equal(prescriptions.inputWeight("",null),"");
assert.equal(prescriptions.selectedLoad({name:"Lat Pulldown",weightEntry:{mode:"single"}},{weight:35}),35);
assert.equal(prescriptions.selectedLoad({name:"Cable Chest Press",weightEntry:{mode:"dual"}},{weight:20}),40);
assert.equal(prescriptions.selectedLoad({name:"Smith Machine Squat",weightEntry:{mode:"total"}},{weight:20},33),53,"Smith working load includes the known bar weight");
assert.equal(prescriptions.selectedLoad({name:"Smith Machine Squat",weightEntry:{mode:"total"}},{weight:0},33),33,"an empty Smith bar still contributes working load");
const repairHistory=[{
  id:"session-1",name:"Full Body A",dateKey:"2026-08-24",exercises:[
    {name:"Lat Pulldown",weightEntry:{mode:"single"},progressionPrescription:{prescription:{weight:35}},sets:[{done:true,reps:10,weight:0},{done:true,reps:10,weight:""}]},
    {name:"Bodyweight Squat",weightEntry:{mode:"bodyweight"},progressionPrescription:{prescription:{weight:20}},sets:[{done:true,reps:10,weight:0}]},
    {name:"Cable Curl",weightEntry:{mode:"single"},sets:[{done:true,reps:10,weight:0}]}
  ]
}];
const candidates=prescriptions.recommendedWeightRepairCandidates(repairHistory);
assert.equal(candidates.length,1,"only exact saved prescription evidence may qualify for repair");
assert.deepStrictEqual(candidates[0].setIndexes,[0,1]);
const restored=prescriptions.resolveRecommendedWeightHistory(repairHistory,"restore","2026-08-26T12:00:00.000Z");
assert.deepStrictEqual(restored.history[0].exercises[0].sets.map(set=>set.weight),[35,35]);
assert.equal(restored.setCount,2);
assert.equal(repairHistory[0].exercises[0].sets[0].weight,0,"history repair must not mutate its source");
assert.equal(restored.history[0].historyCorrections[0].type,"recommendedWeightRestore");
assert.equal(prescriptions.recommendedWeightRepairCandidates(restored.history).length,0);
const kept=prescriptions.resolveRecommendedWeightHistory(repairHistory,"keep","2026-08-26T12:00:00.000Z");
assert.equal(kept.history[0].exercises[0].sets[0].weight,0);
assert.equal(kept.history[0].exercises[0].sets[0].weightReviewStatus,"keptAsRecorded");
assert.equal(prescriptions.recommendedWeightRepairCandidates(kept.history).length,0);
const root=path.resolve(__dirname,".."),app=fs.readFileSync(path.join(root,"app.js"),"utf8"),index=fs.readFileSync(path.join(root,"index.html"),"utf8"),sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
assert(app.includes("sessionPrescriptions=window.ROAD12_PRESCRIPTIONS.capture"));
assert(app.includes("ROAD12_PRESCRIPTIONS.completeApprovals"));
assert(app.includes("prescriptionOutcome"));
assert(app.includes("ROAD12_PRESCRIPTIONS.inputWeight(v?.weight,target.weight)"),"prescribed weight must render as an actual set input value");
assert(!app.includes('placeholder="${target.weight!=null?target.weight'),"prescribed weight must not be placeholder-only text");
assert(app.includes("ROAD12_PRESCRIPTIONS.selectedLoad(ex,s,SMITH_BAR_WEIGHT_LB)"),"session volume must use the normalized selected load");
assert(app.includes("restoreRecommendedWeights"),"Progress must offer an explicit history-repair action");
assert.match(index, /<script src="workout-prescriptions\.js(?:\?build=[^"]+)?"><\/script>/);
assert(sw.includes('"./workout-prescriptions.js"'),"prescriptions must remain available offline");
console.log("workout prescription tests passed");
