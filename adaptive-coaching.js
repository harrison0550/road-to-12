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
  function sessionDateKey(session={}){
    const candidates=[session.completedDate,session.actualCompletionDate,session.dateKey,session.completedAt,session.startedAt];
    for(const value of candidates){
      const match=String(value||"").match(/^\d{4}-\d{2}-\d{2}/);
      if(match)return match[0];
    }
    return "";
  }
  function fullBodyLetter(session={}){
    return /^Full Body ([ABC])$/.exec(String(session.name||""))?.[1]||null;
  }
  function qualifiedPhaseSessions(history=[],phaseStartedAt=""){
    const start=String(phaseStartedAt||"").slice(0,10);
    return history.filter(session=>{
      const date=sessionDateKey(session),letter=fullBodyLetter(session);
      const completed=session.completionStatus===undefined||session.completionStatus===null||session.completionStatus==="completed";
      const strength=session.workoutType===undefined||session.workoutType===null||session.workoutType==="strength";
      return !!letter&&!!date&&(!start||date>=start)&&completed&&strength&&(session.exercises||[]).some(exercise=>completedSets(exercise).length);
    }).slice().sort((a,b)=>sessionDateKey(a).localeCompare(sessionDateKey(b)));
  }
  function phaseEvidenceAt({qualified,ratings,sessions,today,adherenceBaselineDate,cardio,measurements}){
    const strength=qualified.filter(session=>sessionDateKey(session)<=today);
    const exposure={A:0,B:0,C:0};
    strength.forEach(session=>{exposure[fullBodyLetter(session)]++;});
    const completedIds=new Set(strength.map(item=>item.scheduleId).filter(Boolean));
    const planned=sessions.filter(item=>item.status!=="restDay"&&(["completed","missed"].includes(item.status)||completedIds.has(item.id))&&item.scheduledDate<=today&&(!adherenceBaselineDate||(item.plannedDate||item.scheduledDate)>=adherenceBaselineDate));
    const completed=planned.filter(item=>item.status==="completed"||completedIds.has(item.id)).length;
    const adherence=planned.length?completed/planned.length:1;
    const recent=strength.slice(-6);
    const ratedRecent=recent.filter(item=>!!ratings[item.id]);
    const positive=recent.filter(item=>["Easy","Good"].includes(ratings[item.id])).length;
    const difficult=recent.filter(item=>["Too Hard","Exhausting","Tough"].includes(ratings[item.id])).length;
    const exposureScore=Math.min(1,(Math.min(exposure.A,4)+Math.min(exposure.B,4)+Math.min(exposure.C,4))/12);
    const consistencyScore=Math.min(1,adherence);
    const recoveryScore=recent.length?Math.max(0,(positive-difficult*.75)/recent.length):0;
    const performanceSessions=strength.length;
    const performanceScore=Math.min(1,performanceSessions/12);
    const reliableBaselines=new Set(strength.flatMap(item=>(item.exercises||[]).filter(ex=>completedSets(ex).length).map(ex=>ex.exerciseId||ex.name))).size;
    const ratedWorkouts=strength.filter(item=>ratings[item.id]).length;
    const qualitySignals=[exposureScore,Math.min(1,reliableBaselines/8),Math.min(1,ratedWorkouts/6),performanceScore,Math.min(1,adherence/.85)];
    const dataQuality=Math.round(qualitySignals.reduce((sum,value)=>sum+value,0)/qualitySignals.length*100);
    const cardioRecords=cardio.filter(item=>Number(item.actualDurationMinutes)>0&&String(item.completedAt||item.dateKey||item.date||"").slice(0,10)<=today).length;
    const measurementRecords=measurements.filter(item=>(Number(item.weight)>0||Number(item.waist)>0)&&String(item.timestamp||item.recordedAt||item.date||"").slice(0,10)<=today).length;
    const components={
      exposure:{weight:35,score:Math.round(exposureScore*100),counts:exposure},
      consistency:{weight:25,score:Math.round(consistencyScore*100),adherence:Math.round(adherence*100)},
      recovery:{weight:20,score:Math.round(recoveryScore*100),rated:ratedRecent.length,difficult,total:recent.length},
      performance:{weight:20,score:Math.round(performanceScore*100),qualifiedSessions:performanceSessions}
    };
    const rawScore=Math.round((exposureScore*.35+consistencyScore*.25+recoveryScore*.2+performanceScore*.2)*100);
    const gates={
      fullBodyA:{passed:exposure.A>=4,current:exposure.A,required:4},
      fullBodyB:{passed:exposure.B>=4,current:exposure.B,required:4},
      fullBodyC:{passed:exposure.C>=4,current:exposure.C,required:4},
      strengthSessions:{passed:performanceSessions>=12,current:performanceSessions,required:12},
      adherence:{passed:adherence>=.85,current:Math.round(adherence*100),required:85},
      ratings:{passed:recent.length===6&&ratedRecent.length===6&&difficult<=1,current:ratedRecent.length,required:6,difficult,maximumDifficult:1},
      dataQuality:{passed:dataQuality>=80,current:dataQuality,required:80},
      baselines:{passed:reliableBaselines>=8,current:reliableBaselines,required:8}
    };
    const blockers=[];
    [["A",gates.fullBodyA],["B",gates.fullBodyB],["C",gates.fullBodyC]].forEach(([letter,gate])=>{if(!gate.passed)blockers.push(`Need ${gate.required-gate.current} more Full Body ${letter} session${gate.required-gate.current===1?"":"s"}`);});
    if(!gates.strengthSessions.passed)blockers.push(`Need ${gates.strengthSessions.required-gates.strengthSessions.current} more qualified Full Body strength session${gates.strengthSessions.required-gates.strengthSessions.current===1?"":"s"}`);
    if(recent.length<6)blockers.push(`Need ${6-recent.length} more qualified strength workout${6-recent.length===1?"":"s"} before recovery can be evaluated`);
    else if(ratedRecent.length<6)blockers.push(`Need ${6-ratedRecent.length} more rated strength workout${6-ratedRecent.length===1?"":"s"}`);
    if(difficult>1)blockers.push(`Latest 6 strength workouts include ${difficult} difficult ratings; no more than 1 may be Tough, Too Hard, or Exhausting`);
    if(!gates.adherence.passed)blockers.push(`Adherence must remain at or above 85% (currently ${gates.adherence.current}%)`);
    if(!gates.dataQuality.passed)blockers.push(`Readiness data quality must reach 80% (currently ${dataQuality}%)`);
    if(!gates.baselines.passed)blockers.push(`Need ${gates.baselines.required-gates.baselines.current} more reliable exercise baseline${gates.baselines.required-gates.baselines.current===1?"":"s"}`);
    const eligible=Object.values(gates).every(gate=>gate.passed);
    return {strength,exposure,adherence:Math.round(adherence*100),recent,positive,difficult,performanceSessions,reliableBaselines,ratedWorkouts,cardioRecords,measurementRecords,components,rawScore,dataQuality,gates,blockers,eligible};
  }
  function phaseReadiness(input={}){
    const history=input.history||[],ratings=input.ratings||{},sessions=input.sessions||[],cardio=input.cardio||[],measurements=input.measurements||[];
    const phaseStartedAt=String(input.trainingPhase?.startedAt||input.phaseStartedAt||"").slice(0,10);
    const qualified=qualifiedPhaseSessions(history,phaseStartedAt);
    const current=phaseEvidenceAt({qualified,ratings,sessions,today:input.today||"9999-12-31",adherenceBaselineDate:input.adherenceBaselineDate,cardio,measurements});
    let eligibleAt=null;
    if(current.eligible){
      const dates=[...new Set(qualified.map(sessionDateKey))].sort();
      eligibleAt=dates.find(today=>phaseEvidenceAt({qualified,ratings,sessions,today,adherenceBaselineDate:input.adherenceBaselineDate,cardio,measurements}).eligible)||input.today||null;
    }
    const reasons=[
      {label:"Consistency",status:current.gates.adherence.passed?"positive":"collecting",detail:current.gates.adherence.passed?"You've completed planned training consistently.":current.blockers.find(item=>item.startsWith("Adherence"))},
      {label:"Workout exposure",status:current.gates.fullBodyA.passed&&current.gates.fullBodyB.passed&&current.gates.fullBodyC.passed?"positive":"collecting",detail:`Foundation exposure since ${phaseStartedAt||"phase start"}: A ${current.exposure.A} • B ${current.exposure.B} • C ${current.exposure.C}.`},
      {label:"Recovery feedback",status:current.difficult>1?"hold":current.gates.ratings.passed?"positive":"collecting",detail:current.gates.ratings.passed?"The latest six qualified strength workouts are rated with no more than one difficult result.":current.blockers.find(item=>item.includes("rated strength")||item.includes("recovery")||item.includes("difficult ratings"))},
      {label:"Performance data",status:current.gates.strengthSessions.passed?"positive":"collecting",detail:current.gates.strengthSessions.passed?"At least twelve qualified Foundation strength sessions contain completed working sets.":current.blockers.find(item=>item.includes("qualified Full Body strength"))}
    ];
    const dataQualityItems=[
      {label:"A/B/C coverage",value:`A ${current.exposure.A} • B ${current.exposure.B} • C ${current.exposure.C}`,ready:current.gates.fullBodyA.passed&&current.gates.fullBodyB.passed&&current.gates.fullBodyC.passed,required:true},
      {label:"Reliable exercise baselines",value:`${current.reliableBaselines} exercises`,ready:current.gates.baselines.passed,required:true},
      {label:"Rated strength workouts",value:`${current.ratedWorkouts} recorded`,ready:current.gates.ratings.passed,required:true},
      {label:"Qualified strength sessions",value:`${current.performanceSessions} recorded`,ready:current.gates.strengthSessions.passed,required:true},
      {label:"Schedule adherence",value:`${current.adherence}%`,ready:current.gates.adherence.passed,required:true},
      {label:"Cardio records",value:`${current.cardioRecords} blocks • context only`,ready:current.cardioRecords>0,required:false},
      {label:"Measurement history",value:`${current.measurementRecords} check-ins • context only`,ready:current.measurementRecords>0,required:false}
    ];
    return {phase:PHASES[0],nextPhase:PHASES[1],score:current.rawScore,rawScore:current.rawScore,dataQuality:current.dataQuality,eligible:current.eligible,locked:!current.eligible,components:current.components,gates:current.gates,blockers:current.blockers,phaseStartedAt,eligibleAt,exposure:current.exposure,adherence:current.adherence,reasons,dataQualityLabel:current.dataQuality>=80?"Strong evidence":current.dataQuality>=50?"Building evidence":"Early data",dataQualityItems};
  }
  function acceptBuildPhase(input={}){
    const readiness=input.readiness||{};
    if(input.trainingPhase?.id!=="foundation")return {activated:false,reason:"Only an active Foundation phase can transition to Build."};
    if(!readiness.eligible||readiness.locked)return {activated:false,reason:"Foundation eligibility requirements are not yet complete."};
    if(input.buildTemplateValidated!==true)return {activated:false,reason:"Build workout programming still needs review and approval before activation."};
    const acceptedAt=input.acceptedAt||new Date().toISOString(),startedAt=input.acceptanceDate||String(acceptedAt).slice(0,10);
    const evidenceSnapshot={score:readiness.score,rawScore:readiness.rawScore,dataQuality:readiness.dataQuality,components:readiness.components,gates:readiness.gates,phaseStartedAt:readiness.phaseStartedAt};
    const programVersion=input.buildProgramVersion||null;
    const transition={id:`foundation-build-${acceptedAt}`,from:"foundation",to:"build",eligibleAt:readiness.eligibleAt||acceptedAt,acceptedAt,firstBuildDate:input.firstBuildDate||startedAt,programVersion,readinessScore:readiness.score,evidenceSnapshot:JSON.parse(JSON.stringify(evidenceSnapshot))};
    return {activated:true,trainingPhase:{id:"build",number:2,startedAt,status:"active",advancementLocked:true,programVersion},phaseTransitions:[...(input.phaseTransitions||[]),transition],transition};
  }
  function applyRecommendation(exercises=[]){return exercises.map(exercise=>Object.assign({},exercise));}
  return {PHASES,DEFAULT_PROFILE,normalizeProfile,repRange,exerciseRecommendation,sessionDateKey,qualifiedPhaseSessions,phaseReadiness,acceptBuildPhase,applyRecommendation};
});
