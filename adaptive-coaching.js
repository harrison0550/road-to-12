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
  function repRange(value){
    const values=String(value??"").match(/\d+(?:\.\d+)?/g)?.map(Number)||[];
    const minimum=values[0]||0,maximum=values[1]||minimum;
    return {minimum,maximum};
  }
  function exerciseTrend(history=[],name){
    return history.map(session=>({session,exercise:(session.exercises||[]).find(item=>item.name===name)}))
      .filter(item=>item.exercise&&completedSets(item.exercise).length)
      .slice(-3);
  }
  function latestFeedback(item){return item?.exercise?.feedback||item?.session?.exerciseFeedback?.[item?.exercise?.name]||null;}
  function nextLoad(current,definition){
    const name=definition.name||"",mode=definition.weightEntry?.mode||"total";
    if(definition.weightEntry?.paired===true||(definition.weightEntry?.paired===undefined&&name.includes("Dumbbell"))){
      const availablePairTotals=[20,30,40,50];
      return availablePairTotals.find(weight=>weight>current)||current;
    }
    if((definition.requires||[]).includes("dumbbells")){
      const availableSingleWeights=[10,15,20,25];
      return availableSingleWeights.find(weight=>weight>current)||current;
    }
    if(name.includes("Smith"))return current+10;
    if(mode==="perSide")return current+5;
    if(mode==="dual"||mode==="single")return current+5;
    return current+5;
  }
  function prescription(action,sets,definition){
    const weights=sets.map(set=>Number(set.weight)||0).filter(weight=>weight>=0);
    const currentWeight=weights.length?weights[weights.length-1]:0;
    const range=repRange(definition.reps);
    const performedReps=sets.map(set=>Number(set.reps)||0).filter(Boolean);
    const currentReps=range.minimum||Math.max(0,...performedReps);
    const currentSets=Number(definition.sets)||sets.length;
    if(action==="PROGRESS"){
      const completedMinimum=performedReps.length?Math.min(...performedReps):currentReps;
      if(range.maximum>range.minimum&&completedMinimum<range.maximum){
        const reps=Math.min(range.maximum,Math.max(range.minimum,completedMinimum+1));
        return {sets:currentSets,reps,weight:currentWeight,weightUnit:definition.weightEntry?.mode==="perSide"?"lb per side":"lb",summary:`${currentSets} × ${reps} at ${currentWeight} lb${definition.weightEntry?.mode==="perSide"?" per side":""}`};
      }
      const weight=nextLoad(currentWeight,definition);
      return weight>currentWeight
        ?{sets:currentSets,reps:currentReps,weight,weightUnit:definition.weightEntry?.mode==="perSide"?"lb per side":"lb",summary:`${currentSets} × ${currentReps} at ${weight} lb${definition.weightEntry?.mode==="perSide"?" per side":""}`}
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
    if(!exposures.length){const target=repRange(definition.reps).minimum;return {action:"BUILD",reason:"Establish a reliable working-weight baseline with controlled completed sets.",confidence:"collecting",prescription:{sets:Number(definition.sets)||0,reps:target,weight:null,weightUnit:definition.weightEntry?.mode==="perSide"?"lb per side":"lb",summary:`${Number(definition.sets)||0} × ${target} • choose a controlled baseline`}};}
    const latest=exposures[exposures.length-1],sets=completedSets(latest.exercise);
    const prescribed=Number(definition.sets)||sets.length;
    const target=repRange(definition.reps).minimum;
    const allTargets=sets.length>=prescribed&&sets.every(set=>(Number(set.reps)||0)>=target);
    const rating=ratings[latest.session.id]||"";
    const feedback=latestFeedback(latest);
    const engagement=feedback?.muscleEngagement?.rating||"";
    const engagementRequired=!!definition.engagementTarget;
    const lowEngagement=["Low","None","Mostly front delts/triceps"].includes(engagement);
    const recentLowEngagement=exposures.filter(item=>["Low","None","Mostly front delts/triceps"].includes(latestFeedback(item)?.muscleEngagement?.rating)).length;
    const intendedRir=exposures.length<=1&&definition.firstExposureRirRange?definition.firstExposureRirRange:definition.progressionRirRange;
    const rir=feedback?.rir===null||feedback?.rir===undefined||feedback?.rir===""?null:Number(feedback.rir);
    const rirInRange=!intendedRir||(rir!==null&&rir>=Number(intendedRir[0])&&rir<=Number(intendedRir[1]));
    let action="HOLD",reason="Quality work is complete; hold this prescription while the app gathers another recovery and performance signal.",confidence="moderate";
    if(feedback?.discomfort===true||feedback?.form==="Breaking down"||["Too Hard","Exhausting","Tough"].includes(rating)){action="DELOAD";reason=feedback?.discomfort===true?"Discomfort was recorded, so reduce the next exposure and prioritize a pain-free movement.":"Recent difficulty or form breakdown favors a temporary reduction before progressing.";}
    else if(!allTargets){action="HOLD";reason="Repeat the current prescription until every working set reaches its rep target.";}
    else if(lowEngagement||(engagementRequired&&recentLowEngagement>=2)){action="HOLD";reason=engagement==="Mostly front delts/triceps"?"Retain the load and adjust seat position, handle height, and shoulder-blade setup before progressing.":recentLowEngagement>=2?"Hold load and flag this exercise for coaching review because target-muscle engagement has remained low.":"Hold load while improving target-muscle engagement.";confidence=recentLowEngagement>=2?"high":"moderate";}
    else if(exposures.length<Math.max(2,Number(definition.minimumProgressionExposures)||2)){action="HOLD";reason=definition.minimumProgressionExposures?`Complete ${definition.minimumProgressionExposures} clean exposures before increasing load; prioritize setup and target-muscle engagement.`:"One successful exposure is encouraging; repeat it once to confirm the result.";confidence="collecting";}
    else if(engagementRequired&&!engagement){action="HOLD";reason="Record target-muscle engagement before increasing this exercise.";confidence="collecting";}
    else if(engagementRequired&&(!["Strong","Moderate"].includes(engagement)||feedback?.form!=="Clean"||!rirInRange)){action="HOLD";reason="Repeat the current load until form, target-muscle engagement, and reps in reserve all match the intended range.";}
    else if(feedback?.rir!==null&&feedback?.rir!==undefined&&feedback.rir!==""&&Number(feedback.rir)<=1){action="HOLD";reason="The target was completed near your limit. Repeat it before increasing the challenge.";}
    else {
      if((engagementRequired&&rirInRange&&feedback?.form==="Clean"&&["Strong","Moderate"].includes(engagement))||(Number(feedback?.rir)>=3&&feedback?.form==="Clean")||(!feedback&&rating==="Easy")){action="PROGRESS";reason=engagementRequired?"All prescribed work was completed with enough reserve, clean form, and reliable target-muscle engagement for the smallest available increase.":"All prescribed work was completed with enough reserve and clean form for the smallest available increase.";confidence="high";}
    }
    return {action,reason,confidence,sourceSessionId:latest.session.id,coachingReview:engagementRequired&&recentLowEngagement>=2,prescription:prescription(action,sets,definition)};
  }
  function phaseReadiness(input={}){
    const history=input.history||[],ratings=input.ratings||{},sessions=input.sessions||[],cardio=input.cardio||[],measurements=input.measurements||[];
    const strength=history.filter(item=>/Full Body [ABC]/.test(item.name||""));
    const exposure={A:0,B:0,C:0};
    strength.forEach(item=>{const match=(item.name||"").match(/Full Body ([ABC])/);if(match)exposure[match[1]]++;});
    const completedIds=new Set(history.map(item=>item.scheduleId).filter(Boolean));
    const planned=sessions.filter(item=>item.status!=="restDay"&&(["completed","missed"].includes(item.status)||completedIds.has(item.id))&&item.scheduledDate<=input.today&&(!input.adherenceBaselineDate||(item.plannedDate||item.scheduledDate)>=input.adherenceBaselineDate));
    const completed=planned.filter(item=>item.status==="completed"||completedIds.has(item.id)).length;
    const adherence=planned.length?completed/planned.length:1;
    const recent=strength.slice(-6),positive=recent.filter(item=>["Easy","Good"].includes(ratings[item.id])).length;
    const difficult=recent.filter(item=>["Too Hard","Exhausting","Tough"].includes(ratings[item.id])).length;
    const exposureScore=Math.min(1,(Math.min(exposure.A,4)+Math.min(exposure.B,4)+Math.min(exposure.C,4))/12);
    const consistencyScore=Math.min(1,adherence);
    const recoveryScore=recent.length?Math.max(0,(positive-difficult*.75)/recent.length):0;
    const performanceSessions=strength.filter(item=>(item.exercises||[]).some(ex=>completedSets(ex).length)).length;
    const reliableBaselines=new Set(strength.flatMap(item=>(item.exercises||[]).filter(ex=>completedSets(ex).length).map(ex=>ex.name))).size;
    const ratedWorkouts=history.filter(item=>ratings[item.id]).length;
    const cardioRecords=cardio.filter(item=>Number(item.actualDurationMinutes)>0).length;
    const measurementRecords=measurements.filter(item=>Number(item.weight)>0||Number(item.waist)>0).length;
    const qualitySignals=[Math.min(1,(exposure.A+exposure.B+exposure.C)/9),Math.min(1,reliableBaselines/8),Math.min(1,ratedWorkouts/6),Math.min(1,cardioRecords/4),Math.min(1,measurementRecords/4)];
    const dataQuality=Math.round(qualitySignals.reduce((sum,value)=>sum+value,0)/qualitySignals.length*100);
    const performanceScore=Math.min(1,performanceSessions/12);
    const raw=Math.round((exposureScore*.35+consistencyScore*.25+recoveryScore*.2+performanceScore*.2)*100);
    const score=Math.min(85,raw); // Phase advancement remains locked until its decision policy is mature.
    const reasons=[
      {label:"Consistency",status:adherence>=.8?"positive":"collecting",detail:adherence>=.8?"You've completed planned training consistently.":"More consistent planned sessions will strengthen this signal."},
      {label:"Workout exposure",status:Math.min(exposure.A,exposure.B,exposure.C)>=4?"positive":"collecting",detail:`Foundation exposure: A ${exposure.A} • B ${exposure.B} • C ${exposure.C}.`},
      {label:"Recovery feedback",status:difficult?"hold":positive>=2?"positive":"collecting",detail:difficult?"Recent difficult ratings support holding the current phase.":positive>=2?"Recent workouts have been rated Good or Easy.":"Rate completed workouts so recovery can influence readiness."},
      {label:"Performance data",status:performanceSessions>=12?"positive":"collecting",detail:performanceSessions>=12?"Enough set and rep records exist to begin evaluating trends.":"More completed set, rep and weight records are needed."}
    ];
    const dataQualityItems=[
      {label:"A/B/C coverage",value:`A ${exposure.A} • B ${exposure.B} • C ${exposure.C}`,ready:Math.min(exposure.A,exposure.B,exposure.C)>=3},
      {label:"Reliable exercise baselines",value:`${reliableBaselines} exercises`,ready:reliableBaselines>=8},
      {label:"Rated workouts",value:`${ratedWorkouts} recorded`,ready:ratedWorkouts>=6},
      {label:"Cardio records",value:`${cardioRecords} blocks`,ready:cardioRecords>=4},
      {label:"Measurement history",value:`${measurementRecords} check-ins`,ready:measurementRecords>=4}
    ];
    return {phase:PHASES[0],nextPhase:PHASES[1],score,locked:true,exposure,adherence:Math.round(adherence*100),reasons,dataQuality,dataQualityLabel:dataQuality>=80?"Strong evidence":dataQuality>=50?"Building evidence":"Early data",dataQualityItems};
  }
  function applyRecommendation(exercises=[]){return exercises.map(exercise=>Object.assign({},exercise));}
  return {PHASES,DEFAULT_PROFILE,normalizeProfile,repRange,exerciseRecommendation,phaseReadiness,applyRecommendation};
});
