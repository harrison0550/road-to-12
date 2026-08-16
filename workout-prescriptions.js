(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_PRESCRIPTIONS=api;
})(typeof self!=="undefined"?self:globalThis,function(){
  const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
  function exerciseIdentity(exercise,resolver){
    const name=typeof exercise==="string"?exercise:exercise&&exercise.name;
    if(exercise&&exercise.exerciseId)return exercise.exerciseId;
    const resolved=typeof resolver==="function"?resolver(name):null;
    return resolved&&(resolved.id||resolved.exerciseId)||name;
  }
  function basePrescription(exercise){
    return {sets:Number(exercise&&exercise.sets)||0,reps:exercise&&exercise.reps||0,weight:null,weightUnit:"lb",restSeconds:Number(exercise&&exercise.rest)||0};
  }
  function findApproval(approvals,exercise,resolver){
    if(!approvals||!exercise)return null;
    const candidate=approvals[exerciseIdentity(exercise,resolver)]||approvals[exercise.name];
    return !candidate||candidate.status==="consumed"||candidate.consumedAt?null:candidate;
  }
  function normalizePrescription(approval,exercise){
    const source=approval&&approval.prescription?approval.prescription:approval||{},base=basePrescription(exercise);
    return {sets:Number(source.sets)||base.sets,reps:source.reps!==undefined&&source.reps!==null?source.reps:base.reps,weight:source.weight!=null&&Number.isFinite(Number(source.weight))?Number(source.weight):null,weightUnit:source.weightUnit||"lb",restSeconds:Number(source.restSeconds)||base.restSeconds,summary:source.summary||approval&&approval.summary||""};
  }
  function capture(exercises,approvals,resolver){
    return (exercises||[]).reduce((result,exercise)=>{
      const approval=findApproval(approvals,exercise,resolver);
      if(!approval)return result;
      const exerciseId=exerciseIdentity(exercise,resolver);
      result[exerciseId]={exerciseId,exerciseName:exercise.name,action:approval.action||"HOLD",sourceSessionId:approval.sourceSessionId||null,approvedAt:approval.approvedAt||null,basePrescription:basePrescription(exercise),prescription:normalizePrescription(approval,exercise),status:"pending"};
      return result;
    },{});
  }
  function forExercise(session,exercise,resolver){
    const value=session&&session.sessionPrescriptions&&session.sessionPrescriptions[exerciseIdentity(exercise,resolver)];
    return value?clone(value):null;
  }
  function effective(session,exercise,resolver){
    const value=forExercise(session,exercise,resolver);
    return value?clone(value.prescription):basePrescription(exercise);
  }
  const attempted=set=>Boolean(set&&!(set.status==="skipped"||set.skipped===true)&&(
    set.done||set.completed||(set.weight!==""&&set.weight!=null)||(set.reps!==""&&set.reps!=null)||(set.repetitions!==""&&set.repetitions!=null)
  ));
  const minimumReps=value=>Number(String(value??0).match(/\d+(?:\.\d+)?/)?.[0]||0);
  function outcome(prescription,sets){
    const target=prescription||{},tried=(sets||[]).filter(attempted);
    if(!tried.length)return "notAttempted";
    const required=Math.max(1,Number(target.sets)||1);
    const successful=tried.filter(set=>(set.done||set.completed)&&Number(set.reps??set.repetitions)>=minimumReps(target.reps)&&(target.weight==null||Number(set.weight)===Number(target.weight))).length;
    if(tried.length>=required&&successful>=required)return "followed";
    if(successful>0)return "partiallyFollowed";
    return "overridden";
  }
  function completeApprovals(approvals,sessionPrescriptions,snapshots,sessionId,completedAt){
    const next=clone(approvals||{});
    Object.keys(sessionPrescriptions||{}).forEach(exerciseId=>{
      const captured=sessionPrescriptions[exerciseId];
      const snapshot=(snapshots||[]).find(item=>item.exerciseId===exerciseId||item.name===captured.exerciseName);
      const key=next[exerciseId]?exerciseId:captured.exerciseName;
      if(next[key])next[key]=Object.assign({},next[key],{status:"consumed",consumedAt:completedAt,consumedSessionId:sessionId,outcome:outcome(captured.prescription,snapshot&&snapshot.sets)});
    });
    return next;
  }
  return Object.freeze({exerciseIdentity,basePrescription,findApproval,capture,forExercise,effective,outcome,completeApprovals,minimumReps});
});
