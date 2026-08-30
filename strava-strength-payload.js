(function(root,factory){
  const identities=root.ROAD12_EXERCISES||(typeof require!=="undefined"?require("./exercise-identity.js"):null);
  const api=factory(identities);
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_STRAVA_PAYLOAD=api;
})(typeof self!=="undefined"?self:globalThis,function(identities){
  const ELIGIBLE_WORKOUTS=Object.freeze(["Full Body A","Full Body B","Full Body C"]);
  const SMITH_BAR_WEIGHT_LB=33;
  const LB_TO_KG=0.45359237;
  const round=(value,places=3)=>Number(Number(value).toFixed(places));
  const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
  const finitePositive=value=>Number.isFinite(Number(value))&&Number(value)>0;
  function lbToKg(value){return Number.isFinite(Number(value))?round(Number(value)*LB_TO_KG):null;}
  function workoutName(session){return ELIGIBLE_WORKOUTS.includes(String(session?.name||"").trim())?String(session.name).trim():null;}
  function numericRepetitions(value){
    if(typeof value==="number")return Number.isInteger(value)&&value>0?value:null;
    const text=String(value??"").trim();
    return /^\d+$/.test(text)&&Number(text)>0?Number(text):null;
  }
  function isCompletedWorkingSet(set){
    return !!set&&(set.completed===true||set.done===true)&&set.skipped!==true&&(set.setType||"working")==="working";
  }
  function exerciseIdentity(exercise){
    const byId=(identities?.definitions||[]).find(item=>item.id===exercise?.exerciseId);
    return byId||identities?.resolve(exercise?.displayName||exercise?.name)||null;
  }
  function isSmithExercise(exercise){
    return exercise?.weightEntry?.mode==="total"&&(
      String(exercise?.exerciseId||"").includes(".smith")||/^Smith Machine\b/i.test(String(exercise?.displayName||exercise?.name||""))
    );
  }
  function normalizeExternalLoadLb(exercise,set){
    const mode=exercise?.weightEntry?.mode||"total";
    if(mode==="bodyweight")return {loadLb:null,rule:"bodyweight"};
    if(set?.weight===""||set?.weight===null||set?.weight===undefined||!Number.isFinite(Number(set.weight)))return {loadLb:null,rule:"missing"};
    const entered=Number(set.weight);
    if(isSmithExercise(exercise))return {loadLb:round(entered+SMITH_BAR_WEIGHT_LB),rule:"smith-total-plates-plus-bar"};
    if(mode==="dual")return {loadLb:entered>0?round(entered*2):null,rule:"dual-stack-combined"};
    if(mode==="single")return {loadLb:entered>0?round(entered):null,rule:"single-stack"};
    if(mode==="total"&&exercise?.weightEntry?.paired)return {loadLb:entered>0?round(entered):null,rule:"paired-dumbbells-combined"};
    return {loadLb:entered>0?round(entered):null,rule:"recorded-total"};
  }
  function normalizeSet(exercise,set,setIndex){
    if(!isCompletedWorkingSet(set))return null;
    const repetitions=numericRepetitions(set.repetitions??set.reps);
    const durationSeconds=finitePositive(set.durationSeconds)?Math.round(Number(set.durationSeconds)):null;
    if(repetitions===null&&durationSeconds===null)return null;
    const load=normalizeExternalLoadLb(exercise,set);
    const normalized={
      setOrder:Number(set.setNumber)||setIndex+1,
      repetitions,
      durationSeconds,
      externalLoadLb:load.loadLb,
      externalLoadKg:load.loadLb===null?null:lbToKg(load.loadLb),
      loadUnit:load.loadLb===null?null:"kg",
      loadRule:load.rule,
      startedAt:set.startedAt||null
    };
    return normalized;
  }
  function validCompletedSets(session){
    return (session?.exercises||[]).flatMap(exercise=>(exercise.sets||[]).map((set,index)=>normalizeSet(exercise,set,index)).filter(Boolean));
  }
  function isSessionStravaEligible(session){
    return session?.completionStatus==="completed"&&!!workoutName(session)&&validCompletedSets(session).length>0;
  }
  function elapsedSeconds(session){
    const stored=Number(session?.elapsedDurationMs??session?.durationMs);
    if(Number.isFinite(stored)&&stored>0)return Math.max(1,Math.round(stored/1000));
    const started=Date.parse(session?.startedAt),ended=Date.parse(session?.endedAt||session?.completedAt);
    return Number.isFinite(started)&&Number.isFinite(ended)&&ended>started?Math.max(1,Math.round((ended-started)/1000)):null;
  }
  function utcOffsetSeconds(session,options,startTime){
    if(Number.isInteger(options?.utcOffsetSeconds))return options.utcOffsetSeconds;
    if(Number.isInteger(session?.utcOffsetSeconds))return session.utcOffsetSeconds;
    const date=new Date(startTime);
    return Number.isFinite(date.getTime())?-date.getTimezoneOffset()*60:null;
  }
  function warning(exercise,code,detail){return {exerciseId:exercise?.exerciseId||null,exerciseName:exercise?.displayName||exercise?.name||null,code,detail};}
  function buildStravaStrengthPayload(session,options={}){
    const eligible=isSessionStravaEligible(session),name=workoutName(session);
    const warnings=[];
    const exercises=(session?.exercises||[]).map((exercise,exerciseIndex)=>{
      const identity=exerciseIdentity(exercise);
      const token=identity?.externalMappings?.strava?.exerciseType||null;
      const mapped=!!token&&!!identities?.isSupportedStravaExerciseType(token);
      const sets=(exercise.sets||[]).map((set,setIndex)=>normalizeSet(exercise,set,setIndex)).filter(Boolean);
      const completedWorkingCount=(exercise.sets||[]).filter(isCompletedWorkingSet).length;
      if(!mapped)warnings.push(warning(exercise,"UNMAPPED_EXERCISE","No supported Strava exercise type is assigned."));
      if(completedWorkingCount>sets.length)warnings.push(warning(exercise,"INCOMPLETE_SET_DATA","A completed working set was omitted because it has no unambiguous repetitions or duration."));
      return {
        exerciseOrder:Number(exercise.exerciseOrder)||exerciseIndex+1,
        exerciseId:identity?.id||exercise.exerciseId||null,
        displayName:exercise.displayName||exercise.name||identity?.name||"Exercise",
        stravaExerciseType:mapped?token:null,
        mappingStatus:mapped?"mapped":"unmapped",
        sets
      };
    });
    const structuredSets=exercises.flatMap(exercise=>exercise.stravaExerciseType?exercise.sets.map(set=>{
      const value={exercise_type:exercise.stravaExerciseType};
      if(set.repetitions!==null)value.repetitions=set.repetitions;
      if(set.externalLoadKg!==null)value.weight=set.externalLoadKg;
      if(set.durationSeconds!==null)value.duration=set.durationSeconds;
      if(set.startedAt)value.start_time=set.startedAt;
      return value;
    }):[]);
    const startTime=session?.startedAt||null;
    const elapsed=elapsedSeconds(session);
    const offset=utcOffsetSeconds(session,options,startTime);
    const externalId=session?.externalSync?.strava?.externalId||null;
    if(!eligible)warnings.push({exerciseId:null,exerciseName:null,code:"INELIGIBLE_SESSION",detail:"Only completed Full Body A, B, or C sessions with a valid completed working set are eligible."});
    if(!startTime)warnings.push({exerciseId:null,exerciseName:null,code:"MISSING_START_TIME",detail:"The session has no recorded start time."});
    if(elapsed===null)warnings.push({exerciseId:null,exerciseName:null,code:"MISSING_ELAPSED_TIME",detail:"The session has no reliable elapsed duration."});
    if(offset===null)warnings.push({exerciseId:null,exerciseName:null,code:"MISSING_UTC_OFFSET",detail:"The session UTC offset is unavailable."});
    if(!externalId)warnings.push({exerciseId:null,exerciseName:null,code:"MISSING_EXTERNAL_ID",detail:"The session has no stable Strava external ID."});
    if(!structuredSets.length)warnings.push({exerciseId:null,exerciseName:null,code:"NO_STRUCTURED_SETS",detail:"No mapped completed working sets are available."});
    const completedSets=exercises.reduce((sum,exercise)=>sum+exercise.sets.length,0);
    const totalReps=exercises.reduce((sum,exercise)=>sum+exercise.sets.reduce((setSum,set)=>setSum+(set.repetitions||0),0),0);
    const selectedVolumeLb=exercises.reduce((sum,exercise)=>sum+exercise.sets.reduce((setSum,set)=>setSum+((set.externalLoadLb||0)*(set.repetitions||0)),0),0);
    const file={version:"1.0",start_time:startTime,utc_offset:offset,elapsed_time:elapsed,sets:structuredSets};
    return {
      eligible,
      ready:eligible&&!!startTime&&elapsed!==null&&offset!==null&&!!externalId&&structuredSets.length>0,
      name:name?`Andy's Home Gym — ${name}`:"Andy's Home Gym — Workout",
      sportType:"WeightTraining",
      externalId,
      dataType:"json",
      file,
      exercises,
      summary:{
        completedSets,
        totalReps,
        selectedVolumeLb:round(selectedVolumeLb),
        elapsedDurationSeconds:elapsed,
        mappedExercises:exercises.filter(exercise=>exercise.mappingStatus==="mapped"&&exercise.sets.length).length,
        unmappedExercises:exercises.filter(exercise=>exercise.mappingStatus==="unmapped"&&exercise.sets.length).length
      },
      warnings:clone(warnings)
    };
  }
  return Object.freeze({
    ELIGIBLE_WORKOUTS,SMITH_BAR_WEIGHT_LB,lbToKg,numericRepetitions,isCompletedWorkingSet,
    normalizeExternalLoadLb,normalizeSet,isSessionStravaEligible,buildStravaStrengthPayload
  });
});
