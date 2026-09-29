(function(root,factory){
  const api=factory(root.ROAD12_EXERCISES);
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_EXERCISE_MEDIA_V2=api;
})(typeof self!=="undefined"?self:globalThis,function(exercises){
  const VERSION=2;
  const STATUS_PENDING="pending-review";
  const STATUS_APPROVED="approved";
  const asset=(slug,type,extension)=>`assets/exercise-library/v2/${slug}/road12-v2-${slug}-${type}.${extension}`;
  const media=(slug)=>Object.freeze({
    poster:asset(slug,"poster","webp"),
    movementSequence:asset(slug,"sequence","webp"),
    animation:asset(slug,"motion","mp4"),
    animationFallback:asset(slug,"motion","webp")
  });
  const record=(exerciseId,slug,primaryMuscles,secondaryMuscles,primaryRegions,secondaryRegions,approved=false)=>Object.freeze({
    exerciseId,slug,mediaVersion:VERSION,status:approved?STATUS_APPROVED:STATUS_PENDING,approved,
    assets:media(slug),
    primaryMuscles:Object.freeze(primaryMuscles),
    secondaryMuscles:Object.freeze(secondaryMuscles),
    muscleHighlights:Object.freeze({
      primary:Object.freeze(primaryRegions),
      secondary:Object.freeze(secondaryRegions)
    })
  });
  const records=Object.freeze({
    "road12.press.smith-bench":record("road12.press.smith-bench","smith-machine-bench-press",["Chest"],["Front shoulders","Triceps"],["chest"],["front-deltoid","triceps"],true),
    "road12.press.gmwd-converging-chest-press":record("road12.press.gmwd-converging-chest-press","gmwd-converging-chest-press",["Chest"],["Front shoulders","Triceps"],["chest"],["front-deltoid","triceps"],true),
    /* Serratus anterior remains authoritative accessible text. The shared
       anatomy SVG has no serratus region, so only supported front-deltoid and
       biceps secondary paths are highlighted. */
    "road12.fly.cable-seated":record("road12.fly.cable-seated","seated-cable-chest-fly",["Chest"],["Front deltoids","Serratus anterior","Biceps stabilizer"],["chest"],["front-deltoid","biceps"],true),
    "road12.pull.lat-pulldown":record("road12.pull.lat-pulldown","lat-pulldown",["Lats","Upper back"],["Biceps"],["lats","upper-back"],["biceps"]),
    "road12.row.seated-cable":record("road12.row.seated-cable","seated-cable-row",["Lats","Upper back"],["Rear shoulders","Biceps"],["lats","upper-back"],["rear-deltoid","biceps"]),
    "road12.squat.smith-machine":record("road12.squat.smith-machine","smith-machine-squat",["Quadriceps","Glutes"],["Hamstrings","Adductors","Core"],["quadriceps","gluteus-maximus"],["hamstrings","adductors","abdominals"]),
    "road12.hip-thrust.smith":record("road12.hip-thrust.smith","smith-machine-hip-thrust",["Glutes"],["Hamstrings","Adductors","Core"],["gluteus-maximus"],["hamstrings","adductors","abdominals"]),
    "road12.lunge.dumbbell-reverse":record("road12.lunge.dumbbell-reverse","dumbbell-reverse-lunge",["Quadriceps","Glutes"],["Hamstrings","Adductors","Core and stability"],["quadriceps","gluteus-maximus"],["hamstrings","adductors","abdominals","obliques"]),
    "road12.hamstring.cable-standing-single-leg-curl":record("road12.hamstring.cable-standing-single-leg-curl","standing-single-leg-cable-hamstring-curl",["Hamstrings"],["Calves","Glute stabilizers"],["hamstrings"],["calves","gluteus-maximus"]),
    "road12.lateral-raise.dumbbell":record("road12.lateral-raise.dumbbell","dumbbell-lateral-raise",["Side shoulders"],["Upper back","Core stabilizers"],["lateral-deltoid"],["upper-back"]),
    "road12.curl.dumbbell-concentration":record("road12.curl.dumbbell-concentration","seated-concentration-curl",["Biceps"],["Brachialis","Forearms"],["biceps"],["brachialis","forearms"]),
    "road12.calf-raise.smith":record("road12.calf-raise.smith","smith-machine-calf-raise",["Calves"],["Foot and ankle stabilizers"],["calves"],[]),
    "road12.crunch.cable":record("road12.crunch.cable","cable-crunch",["Abdominals"],["Obliques","Hip flexors"],["abdominals"],["obliques","hip-flexors"])
  });
  function identityFor(name){return exercises?.resolve?.(name)||null;}
  function getById(exerciseId){return records[exerciseId]||null;}
  function getForName(name){const identity=identityFor(name);return identity?getById(identity.id):null;}
  function approvedRecord(recordValue){
    return Boolean(recordValue?.approved&&recordValue.status==="approved"&&recordValue.assets?.poster&&recordValue.assets?.movementSequence&&(recordValue.assets?.animation||recordValue.assets?.animationFallback));
  }
  function resolve(name,v1Entry,placeholderEntry=null){
    const v2=getForName(name);
    if(approvedRecord(v2))return Object.freeze(Object.assign({},v1Entry||{},v2,{media:v2.assets.animationFallback||v2.assets.animation,motionPoster:v2.assets.poster,movementSequence:v2.assets.movementSequence,mediaType:"animation",sourceType:"app-original-v2"}));
    return v1Entry||placeholderEntry||null;
  }
  return Object.freeze({VERSION,STATUS_PENDING,STATUS_APPROVED,records,getById,getForName,approvedRecord,resolve});
});
