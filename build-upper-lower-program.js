(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_BUILD=api;
})(typeof self!=="undefined"?self:globalThis,function(){
  const VERSION="build-upper-lower-v1-2026-09-06";
  const DEFAULT_RIR=Object.freeze([2,3]);
  const PRIORITY_GROUPS=Object.freeze(["chest","biceps","calves","core"]);
  const template=(id,name,planDay,emphasis,time,exercises)=>Object.freeze({id,name,planDay,emphasis,time,version:VERSION,exercises:Object.freeze(exercises.map(item=>Object.freeze(Object.assign({targetRirRange:DEFAULT_RIR},item))))});
  const TEMPLATES=Object.freeze({
    UPPER_A:template("build-upper-a","Upper A",0,"Chest emphasis","60–70 min",[
      {name:"Treadmill Walk",purpose:"Raise temperature without creating fatigue."},{name:"Arm Circles",purpose:"Prepare the shoulders."},
      {name:"Smith Machine Bench Press",sets:4,reps:"6–10",rest:120,primaryGroup:"chest",purpose:"Primary heavier chest press."},
      {name:"GMWD Converging Chest Press",sets:4,reps:"8–12",rest:90,primaryGroup:"chest",purpose:"Converging chest press with weight-per-side tracking."},
      {name:"Seated Cable Row",sets:3,reps:"8–12",rest:90,primaryGroup:"back",purpose:"Primary horizontal pull."},
      {name:"Lat Pulldown",sets:2,reps:"8–12",rest:90,primaryGroup:"back",purpose:"Vertical-pull frequency."},
      {name:"Dumbbell Lateral Raise",sets:2,reps:"12–15",rest:60,primaryGroup:"shoulders",purpose:"Direct lateral-delt work; pressing already trains the front delts."},
      {name:"Seated Concentration Curl",sets:3,reps:"10–15",rest:60,primaryGroup:"biceps",purpose:"Strict biceps work."},
      {name:"Cable Hammer Curl",sets:2,reps:"10–15",rest:60,primaryGroup:"biceps",purpose:"Complementary neutral-grip biceps work."},
      {name:"Rope Triceps Pushdown",sets:2,reps:"10–15",rest:60,primaryGroup:"triceps",purpose:"Moderate direct triceps work."},
      {name:"Easy Treadmill Cooldown",purpose:"Lower heart rate gradually."},{name:"Post-Workout Stretch",purpose:"Restore comfortable range."}
    ]),
    LOWER_A:template("build-lower-a","Lower A",1,"Quads and glutes emphasis","60–70 min",[
      {name:"Treadmill Walk",purpose:"Raise temperature."},{name:"Bodyweight Squat",purpose:"Rehearse the squat pattern."},
      {name:"Smith Machine Squat",sets:4,reps:"8–12",rest:120,primaryGroup:"quads",purpose:"Primary quad compound."},
      {name:"Smith Machine Hip Thrust",sets:3,reps:"8–12",rest:120,primaryGroup:"glutes",purpose:"Stable glute loading."},
      {name:"Standing Single-Leg Cable Hamstring Curl",sets:2,reps:"10–15",rest:60,primaryGroup:"hamstrings",purpose:"Low-back-friendly hamstring work per leg."},
      {name:"Smith Machine Single-Leg Squat",sets:2,reps:"8–12",rest:90,primaryGroup:"quads",purpose:"Supported unilateral quad work."},
      {name:"Smith Machine Calf Raise",sets:4,reps:"8–12",rest:60,primaryGroup:"calves",purpose:"Priority calf work with full stretch and controlled eccentric."},
      {name:"Cable Crunch",sets:2,reps:"10–15",rest:60,primaryGroup:"core",purpose:"Progressive weighted abdominal flexion."},
      {name:"Lying Leg Raise",sets:2,reps:"10–15",rest:60,primaryGroup:"core",purpose:"Progressive lower-ab work with a controlled eccentric."},
      {name:"Easy Treadmill Cooldown",purpose:"Lower heart rate gradually."},{name:"Post-Workout Stretch",purpose:"Restore comfortable range."}
    ]),
    UPPER_B:template("build-upper-b","Upper B",3,"Back and shoulders emphasis","65–75 min",[
      {name:"Treadmill Walk",purpose:"Raise temperature."},{name:"Arm Circles",purpose:"Prepare the shoulders."},
      {name:"Lat Pulldown",sets:4,reps:"8–12",rest:90,primaryGroup:"back",purpose:"Primary vertical pull."},
      {name:"Single Arm Cable Row",sets:3,reps:"8–12",rest:75,primaryGroup:"back",purpose:"Unilateral horizontal pull."},
      {name:"Low-Incline Dumbbell Press",sets:4,reps:"10–15",rest:90,primaryGroup:"chest",purpose:"Second weekly chest exposure."},
      {name:"Dumbbell Lateral Raise",sets:2,reps:"12–15",rest:60,primaryGroup:"shoulders",purpose:"Side-delt work without redundant front-delt pressing."},
      {name:"Rear Delt Cable Fly",sets:2,reps:"12–15",rest:60,primaryGroup:"shoulders",purpose:"Rear-delt balance."},
      {name:"Alternating Dumbbell Curl",sets:2,reps:"8–12",rest:60,primaryGroup:"biceps",purpose:"Free-weight curl progression."},
      {name:"Cable Curl",sets:2,reps:"10–15",rest:60,primaryGroup:"biceps",purpose:"Constant-tension biceps work."},
      {name:"V-Bar Triceps Pushdown",sets:2,reps:"10–15",rest:60,primaryGroup:"triceps",purpose:"Moderate direct triceps work; presses provide additional indirect volume."},
      {name:"Easy Treadmill Cooldown",purpose:"Lower heart rate gradually."},{name:"Post-Workout Stretch",purpose:"Restore comfortable range."}
    ]),
    LOWER_B:template("build-lower-b","Lower B",4,"Hamstrings and glutes emphasis","55–65 min",[
      {name:"Treadmill Walk",purpose:"Raise temperature."},{name:"Hip Hinge",purpose:"Practice an unloaded pain-free pattern only."},
      {name:"Smith Machine Hip Thrust",sets:3,reps:"8–12",rest:120,primaryGroup:"glutes",purpose:"Primary stable glute movement."},
      {name:"Standing Single-Leg Cable Hamstring Curl",sets:4,reps:"10–15",rest:60,primaryGroup:"hamstrings",purpose:"Primary direct hamstring work per leg."},
      {name:"Smith Machine Squat",sets:3,reps:"10–12",rest:120,primaryGroup:"quads",purpose:"Moderate-rep quad exposure."},
      {name:"Smith Machine Single-Leg Squat",sets:2,reps:"10–12",rest:90,primaryGroup:"glutes",purpose:"Supported unilateral glute and quad work."},
      {name:"Smith Machine Calf Raise",sets:4,reps:"12–15",rest:60,primaryGroup:"calves",purpose:"Second priority calf exposure with controlled full range."},
      {name:"High to Low Cable Chop",sets:2,reps:"10–12",rest:60,primaryGroup:"core",purpose:"Progressive rotational abdominal work."},
      {name:"Reverse Crunch",sets:2,reps:"12–15",rest:60,primaryGroup:"core",purpose:"Progressive lower-ab pelvic-curl work."},
      {name:"Easy Treadmill Cooldown",purpose:"Lower heart rate gradually."},{name:"Post-Workout Stretch",purpose:"Restore comfortable range."}
    ])
  });
  const TEMPLATE_KEY_BY_PLAN_DAY=Object.freeze({0:"UPPER_A",1:"LOWER_A",3:"UPPER_B",4:"LOWER_B"});
  const TEMPLATE_BY_ID=Object.freeze(Object.fromEntries(Object.values(TEMPLATES).map(item=>[item.id,item])));
  function templateForPlanDay(day){return TEMPLATES[TEMPLATE_KEY_BY_PLAN_DAY[day]]||null;}
  function templateForId(id){return TEMPLATE_BY_ID[id]||null;}
  function strengthSetCount(value){return (value?.exercises||[]).reduce((sum,item)=>sum+(Number(item.sets)||0),0);}
  function weeklyPrimarySets(){return Object.values(TEMPLATES).flatMap(item=>item.exercises).reduce((totals,item)=>{if(item.primaryGroup)totals[item.primaryGroup]=(totals[item.primaryGroup]||0)+(Number(item.sets)||0);return totals;},{});}
  function validateTemplates(){
    const values=Object.values(TEMPLATES),errors=[],expected=["build-upper-a","build-lower-a","build-upper-b","build-lower-b"];
    if(values.length!==4)errors.push("Build requires exactly four active strength templates.");
    if(values.some((item,index)=>item.id!==expected[index]))errors.push("Build template IDs do not match the approved identities.");
    values.forEach(item=>{
      const count=strengthSetCount(item);
      if(count<16||count>22)errors.push(`${item.name} has ${count} working sets; expected 16–22.`);
      if(item.exercises.some(exercise=>/Romanian Deadlift|\bRDL\b|loaded hinge/i.test(exercise.name)))errors.push(`${item.name} contains a prohibited hinge.`);
      item.exercises.filter(exercise=>exercise.sets).forEach(exercise=>{if(!exercise.reps||!exercise.rest||!exercise.primaryGroup)errors.push(`${item.name}: ${exercise.name} lacks a complete prescription.`);});
    });
    const names=values.flatMap(item=>item.exercises.map(exercise=>exercise.name));
    ["GMWD Converging Chest Press","Seated Concentration Curl","Standing Single-Leg Cable Hamstring Curl"].forEach(name=>{if(!names.includes(name))errors.push(`Required exercise missing: ${name}.`);});
    const volume=weeklyPrimarySets(),expectedVolume={chest:12,back:12,shoulders:6,biceps:9,triceps:4,quads:9,glutes:8,hamstrings:6,calves:8,core:8};
    Object.entries(expectedVolume).forEach(([group,target])=>{if((volume[group]||0)!==target)errors.push(`${group} volume is ${volume[group]||0}; expected exactly ${target}.`);});
    return Object.freeze({valid:errors.length===0,errors:Object.freeze(errors),version:VERSION,weeklyPrimarySets:Object.freeze(volume)});
  }
  function scheduleDefinitionForDay(day){
    const value=templateForPlanDay(day);
    if(value)return {name:value.name,workoutType:"strength",phaseId:"build",templateId:value.id,templateVersion:VERSION};
    if(day===2)return {name:"Cardio + Recovery",workoutType:"recovery",phaseId:"build",templateId:null,templateVersion:VERSION};
    if(day===5)return {name:"Zone 2 Cardio",workoutType:"cardio",phaseId:"build",templateId:null,templateVersion:VERSION};
    return {name:"Rest / Recovery",workoutType:"recovery",phaseId:"build",templateId:null,templateVersion:VERSION};
  }
  function activateSchedule(input={}){
    const acceptanceDate=String(input.acceptanceDate||"").slice(0,10);
    if(!acceptanceDate)return {activated:false,reason:"A local acceptance date is required."};
    if(input.eligible!==true)return {activated:false,reason:"Foundation eligibility must pass before Build can activate."};
    if(input.templatesValidated!==true||validation.valid!==true)return {activated:false,reason:"All four approved Build templates must pass validation."};
    const completedIds=new Set((input.history||[]).map(item=>item.scheduleId).filter(Boolean));
    const activeId=input.currentSession&&!input.currentSession.completedId?input.currentSession.scheduleId:null;
    const unresolved=(input.workoutSessions||[]).filter(item=>item.status==="scheduled"&&!completedIds.has(item.id)&&item.id!==activeId&&item.scheduledDate>=acceptanceDate).slice().sort((a,b)=>a.scheduledDate.localeCompare(b.scheduledDate)||(a.plannedDate||a.scheduledDate).localeCompare(b.plannedDate||b.scheduledDate));
    const anchor=unresolved.find(item=>item.planDay===0);
    if(!anchor)return {activated:false,reason:"No unresolved future Monday is available for a complete Build sequence."};
    const candidates=unresolved.filter(item=>item.scheduledDate>=anchor.scheduledDate);
    const ids=new Set(candidates.map(item=>item.id));
    const workoutSessions=(input.workoutSessions||[]).map(item=>ids.has(item.id)?Object.assign({},item,scheduleDefinitionForDay(item.planDay)):Object.assign({},item));
    return {activated:true,firstBuildDate:anchor.scheduledDate,sequenceAnchorDate:anchor.scheduledDate,workoutSessions,updatedSessionIds:[...ids],version:VERSION};
  }
  const validation=validateTemplates();
  return Object.freeze({VERSION,DEFAULT_RIR,PRIORITY_GROUPS,TEMPLATES,TEMPLATE_KEY_BY_PLAN_DAY,validation,templateForPlanDay,templateForId,strengthSetCount,weeklyPrimarySets,validateTemplates,scheduleDefinitionForDay,activateSchedule});
});
