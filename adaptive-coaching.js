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
  function latestFeedback(item){return item?.exercise?.feedback||item?.session?.exerciseFeedback?.[item?.exercise?.name]||null;}
  function nextLoad(current,definition){
    const name=definition.name||"",mode=definition.weightEntry?.mode||"total";
    if(name.includes("Dumbbell")){
      if(current<=20)return 30;
      return current;
    }
    if(name.includes("Smith"))return current+10;
    if(mode==="dual"||mode==="single")return current+5;
    return current+5;
  }
  function prescription(action,sets,definition){
    const weights=sets.map(set=>Number(set.weight)||0).filter(weight=>weight>=0);
    const currentWeight=weights.length?weights[weights.length-1]:0;
    const currentReps=Number(definition.reps)||Math.max(0,...sets.map(set=>Number(set.reps)||0));
    const currentSets=Number(definition.sets)||sets.length;
    if(action==="PROGRESS"){
      const weight=nextLoad(currentWeight,definition);
      return weight>currentWeight
        ?{sets:currentSets,reps:currentReps,weight,summary:`${currentSets} × ${currentReps} at ${weight} lb`}
        :{sets:currentSets,reps:currentReps+2,weight:currentWeight,summary:`${currentSets} × ${currentReps+2} at ${currentWeight} lb`};
    }
    if(action==="DELOAD"){
      const weight=Math.max(0,Math.round(currentWeight*.9/5)*5);
      return {sets:Math.max(1,currentSets-1),reps:currentReps,weight,summary:`${Math.max(1,currentSets-1)} × ${currentReps} at ${weight} lb`};
    }
    return {sets:currentSets,reps:currentReps,weight:currentWeight,summary:`${currentSets} × ${currentReps} at ${currentWeight} lb`};
  }
  function exerciseRecommendation(history=[],ratings={},definition={}){
    const exposures=exerciseTrend(history,definition.name);
    if(!exposures.length)return {action:"BUILD",reason:"Establish a reliable working-weight baseline with controlled completed sets.",confidence:"collecting",prescription:{sets:Number(definition.sets)||0,reps:Number(definition.reps)||0,weight:null,summary:`${Number(definition.sets)||0} × ${Number(definition.reps)||0} • choose a controlled baseline`}};
    const latest=exposures[exposures.length-1],sets=completedSets(latest.exercise);
    const prescribed=Number(definition.sets)||sets.length;
    const target=Number(definition.reps)||0;
    const allTargets=sets.length>=prescribed&&sets.every(set=>(Number(set.reps)||0)>=target);
    const rating=ratings[latest.session.id]||"";
    const feedback=latestFeedback(latest);
    let action="HOLD",reason="Quality work is complete; hold this prescription while the app gathers another recovery and performance signal.",confidence="moderate";
    if(feedback?.discomfort===true||feedback?.form==="Breaking down"||["Too Hard","Exhausting","Tough"].includes(rating)){action="DELOAD";reason=feedback?.discomfort===true?"Discomfort was recorded, so reduce the next exposure and prioritize a pain-free movement.":"Recent difficulty or form breakdown favors a temporary reduction before progressing.";}
    else if(!allTargets){action="HOLD";reason="Repeat the current prescription until every working set reaches its rep target.";}
    else if(exposures.length<2){action="HOLD";reason="One successful exposure is encouraging; repeat it once to confirm the result.";confidence="collecting";}
    else if(feedback?.rir!==null&&feedback?.rir!==undefined&&feedback.rir!==""&&Number(feedback.rir)<=1){action="HOLD";reason="The target was completed near your limit. Repeat it before increasing the challenge.";}
    else {
      if((Number(feedback?.rir)>=3&&feedback?.form==="Clean")||(!feedback&&rating==="Easy")){action="PROGRESS";reason="All prescribed work was completed with enough reserve and clean form for the smallest available increase.";confidence="high";}
    }
    return {action,reason,confidence,sourceSessionId:latest.session.id,prescription:prescription(action,sets,definition)};
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
