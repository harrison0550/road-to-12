(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_ADAPTIVE=api;
})(typeof self!=="undefined"?self:this,function(){
  const PHASES=Object.freeze([
    {id:"foundation",number:1,name:"Foundation",next:"Build"},
    {id:"build",number:2,name:"Build",next:"Upper / Lower"},
    {id:"upperLower",number:3,name:"Upper / Lower",next:"Hypertrophy / Definition"},
    {id:"hypertrophy",number:4,name:"Hypertrophy / Definition",next:null}
  ]);
  const DEFAULT_PROFILE={age:null,heightIn:null,targetWeight:null,goal:"fatLoss",experience:"beginner",trainingDays:5,sessionMinutes:60,limitations:"",healthClearance:false};
  function numberBetween(value,min,max,fallback=null){
    const number=Number(value);
    return Number.isFinite(number)&&number>=min&&number<=max?number:fallback;
  }
  function normalizeProfile(value={}){
    const profile=Object.assign({},DEFAULT_PROFILE,value||{});
    profile.age=numberBetween(profile.age,18,100,null);
    profile.heightIn=numberBetween(profile.heightIn,48,84,null);
    profile.targetWeight=numberBetween(profile.targetWeight,90,500,null);
    profile.goal=["fatLoss","recomposition","strength","general"].includes(profile.goal)?profile.goal:"fatLoss";
    profile.experience=["beginner","intermediate","advanced"].includes(profile.experience)?profile.experience:"beginner";
    profile.trainingDays=numberBetween(profile.trainingDays,2,7,5);
    profile.sessionMinutes=numberBetween(profile.sessionMinutes,20,120,60);
    profile.limitations=String(profile.limitations||"").trim().slice(0,500);
    profile.healthClearance=profile.healthClearance===true;
    return profile;
  }
  function completedSets(exercise){return (exercise?.sets||[]).filter(set=>set?.done);}
  function exerciseTrend(history=[],name){
    return history.map(session=>({session,exercise:(session.exercises||[]).find(item=>item.name===name)}))
      .filter(item=>item.exercise&&completedSets(item.exercise).length)
      .slice(-3);
  }
  function exerciseRecommendation(history=[],ratings={},definition={}){
    const exposures=exerciseTrend(history,definition.name);
    if(!exposures.length)return {action:"BUILD",reason:"Establish a reliable working-weight baseline with controlled completed sets.",confidence:"collecting"};
    const latest=exposures[exposures.length-1],sets=completedSets(latest.exercise);
    const prescribed=Number(definition.sets)||sets.length;
    const target=Number(definition.reps)||0;
    const allTargets=sets.length>=prescribed&&sets.every(set=>(Number(set.reps)||0)>=target);
    const rating=ratings[latest.session.id]||"";
    if(["Too Hard","Exhausting","Tough"].includes(rating)||sets.length<prescribed)return {action:"DELOAD",reason:"Recent difficulty or missed prescribed sets favors a temporary reduction before progressing.",confidence:"moderate"};
    if(!allTargets)return {action:"HOLD",reason:"Repeat the current prescription until every working set reaches its rep target.",confidence:"moderate"};
    if(exposures.length<2)return {action:"HOLD",reason:"One successful exposure is encouraging; repeat it once to confirm the result.",confidence:"collecting"};
    const previous=completedSets(exposures[exposures.length-2].exercise);
    const latestBest=Math.max(...sets.map(set=>Number(set.weight)||0));
    const previousBest=Math.max(...previous.map(set=>Number(set.weight)||0));
    if(rating==="Easy"||latestBest>previousBest)return {action:"PROGRESS",reason:"All prescribed work was completed and recent performance supports the smallest available resistance or rep increase.",confidence:"high"};
    return {action:"HOLD",reason:"Quality work is complete; hold this prescription while the app gathers another recovery and performance signal.",confidence:"moderate"};
  }
  function phaseReadiness(input={}){
    const history=input.history||[],ratings=input.ratings||{},sessions=input.sessions||[];
    const strength=history.filter(item=>/Full Body [ABC]/.test(item.name||""));
    const exposure={A:0,B:0,C:0};
    strength.forEach(item=>{const match=(item.name||"").match(/Full Body ([ABC])/);if(match)exposure[match[1]]++;});
    const planned=sessions.filter(item=>item.status!=="restDay"&&item.scheduledDate<=input.today);
    const completedIds=new Set(history.map(item=>item.scheduleId).filter(Boolean));
    const completed=planned.filter(item=>item.status==="completed"||completedIds.has(item.id)).length;
    const adherence=planned.length?completed/planned.length:0;
    const recent=strength.slice(-6),positive=recent.filter(item=>["Easy","Good"].includes(ratings[item.id])).length;
    const difficult=recent.filter(item=>["Too Hard","Exhausting","Tough"].includes(ratings[item.id])).length;
    const exposureScore=Math.min(1,(Math.min(exposure.A,4)+Math.min(exposure.B,4)+Math.min(exposure.C,4))/12);
    const consistencyScore=Math.min(1,adherence);
    const recoveryScore=recent.length?Math.max(0,(positive-difficult*.75)/recent.length):0;
    const performanceSessions=strength.filter(item=>(item.exercises||[]).some(ex=>completedSets(ex).length)).length;
    const performanceScore=Math.min(1,performanceSessions/12);
    const raw=Math.round((exposureScore*.35+consistencyScore*.25+recoveryScore*.2+performanceScore*.2)*100);
    const score=Math.min(85,raw); // Phase advancement remains locked until its decision policy is mature.
    const reasons=[
      {label:"Consistency",status:adherence>=.8?"positive":"collecting",detail:adherence>=.8?"You've completed planned training consistently.":"More consistent planned sessions will strengthen this signal."},
      {label:"Workout exposure",status:Math.min(exposure.A,exposure.B,exposure.C)>=4?"positive":"collecting",detail:`Foundation exposure: A ${exposure.A} • B ${exposure.B} • C ${exposure.C}.`},
      {label:"Recovery feedback",status:difficult?"hold":positive>=2?"positive":"collecting",detail:difficult?"Recent difficult ratings support holding the current phase.":positive>=2?"Recent workouts have been rated Good or Easy.":"Rate completed workouts so recovery can influence readiness."},
      {label:"Performance data",status:performanceSessions>=12?"positive":"collecting",detail:performanceSessions>=12?"Enough set and rep records exist to begin evaluating trends.":"More completed set, rep and weight records are needed."}
    ];
    return {phase:PHASES[0],nextPhase:PHASES[1],score,locked:true,exposure,adherence:Math.round(adherence*100),reasons};
  }
  function applyRecommendation(exercises=[]){return exercises.map(exercise=>Object.assign({},exercise));}
  return {PHASES,DEFAULT_PROFILE,normalizeProfile,exerciseRecommendation,phaseReadiness,applyRecommendation};
});
