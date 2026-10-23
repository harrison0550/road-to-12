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
    "road12.pull.lat-pulldown":record("road12.pull.lat-pulldown","lat-pulldown",["Lats","Upper back"],["Biceps"],["lats","upper-back"],["biceps"],true),
    "road12.row.seated-cable":record("road12.row.seated-cable","seated-cable-row",["Lats","Upper back"],["Rear shoulders","Biceps"],["lats","upper-back"],["rear-deltoid","biceps"],true),
    "road12.squat.smith-machine":record("road12.squat.smith-machine","smith-machine-squat",["Quadriceps","Glutes"],["Hamstrings","Adductors","Core"],["quadriceps","gluteus-maximus"],["hamstrings","adductors","abdominals"],true),
    "road12.hip-thrust.smith":record("road12.hip-thrust.smith","smith-machine-hip-thrust",["Glutes"],["Hamstrings","Adductors","Core"],["gluteus-maximus"],["hamstrings","adductors","abdominals"],true),
    "road12.lunge.dumbbell-reverse":record("road12.lunge.dumbbell-reverse","dumbbell-reverse-lunge",["Quadriceps","Glutes"],["Hamstrings","Adductors","Core and stability"],["quadriceps","gluteus-maximus"],["hamstrings","adductors","abdominals","obliques"],true),
    "road12.hamstring.cable-standing-single-leg-curl":record("road12.hamstring.cable-standing-single-leg-curl","standing-single-leg-cable-hamstring-curl",["Hamstrings"],["Calves","Glute stabilizers"],["hamstrings"],["calves","glute-stabilizers"],true),
    "road12.lateral-raise.dumbbell":record("road12.lateral-raise.dumbbell","dumbbell-lateral-raise",["Side shoulders"],["Upper back","Core stabilizers"],["lateral-deltoid"],["upper-back"],true),
    "road12.curl.dumbbell-concentration":record("road12.curl.dumbbell-concentration","seated-concentration-curl",["Biceps"],["Brachialis","Forearms"],["biceps"],["brachialis","forearms"],true),
    "road12.calf-raise.smith":record("road12.calf-raise.smith","smith-machine-calf-raise",["Calves"],["Foot and ankle stabilizers"],["calves"],[],true),
    "road12.crunch.cable":record("road12.crunch.cable","cable-crunch",["Abdominals"],["Obliques","Hip flexors"],["abdominals"],["obliques","hip-flexors"],true),
    "road12.squat.goblet":record("road12.squat.goblet","goblet-squat",["Quadriceps","Glutes"],["Hamstrings","Core"],["quadriceps","gluteus-maximus"],["hamstrings","abdominals"]),
    "road12.press.cable-chest":record("road12.press.cable-chest","cable-chest-press",["Chest"],["Front shoulders","Triceps"],["chest"],["front-deltoid","triceps"]),
    "road12.press.cable-shoulder":record("road12.press.cable-shoulder","cable-shoulder-press",["Shoulders"],["Triceps","Upper chest"],["front-deltoid","lateral-deltoid"],["triceps","chest"]),
    "road12.triceps.rope-pushdown":record("road12.triceps.rope-pushdown","rope-triceps-pushdown",["Triceps"],[],["triceps"],[],true),
    "road12.curl.cable":record("road12.curl.cable","cable-curl",["Biceps"],["Forearms"],["biceps"],["forearms"],true),
    "road12.curl.dumbbell-alternating":record("road12.curl.dumbbell-alternating","alternating-dumbbell-curl",["Biceps","Brachialis"],["Forearms"],["biceps","brachialis"],["forearms"],true),
    "road12.curl.cable-behind-back-single-arm":record("road12.curl.cable-behind-back-single-arm","behind-the-back-single-arm-cable-curl",["Biceps"],["Brachialis","Forearms"],["biceps"],["brachialis","forearms"]),
    "road12.deadlift.smith-rdl":record("road12.deadlift.smith-rdl","smith-machine-rdl",["Hamstrings","Glutes"],["Core","Back extensors"],["hamstrings","gluteus-maximus"],["abdominals","upper-back"]),
    "road12.lunge.smith-bulgarian":record("road12.lunge.smith-bulgarian","smith-machine-single-leg-squat",["Quadriceps","Glutes"],["Hamstrings","Core"],["quadriceps","gluteus-maximus"],["hamstrings","abdominals"]),
    "road12.triceps.v-bar-pushdown":record("road12.triceps.v-bar-pushdown","v-bar-triceps-pushdown",["Triceps"],["Forearms","Core"],["triceps"],["forearms","abdominals"],true),
    "road12.press.incline-cable":record("road12.press.incline-cable","incline-cable-press",["Upper chest"],["Front shoulders","Triceps"],["chest"],["front-deltoid","triceps"]),
    "road12.press.dumbbell-low-incline":record("road12.press.dumbbell-low-incline","low-incline-dumbbell-press",["Upper chest"],["Front shoulders","Triceps"],["chest"],["front-deltoid","triceps"],true),
    "road12.row.single-arm-cable":record("road12.row.single-arm-cable","single-arm-cable-row",["Lats","Mid-back"],["Rear shoulders","Biceps","Core"],["lats","upper-back"],["rear-deltoid","biceps","abdominals"],true),
    "road12.lateral-raise.cable":record("road12.lateral-raise.cable","cable-lateral-raise",["Side shoulders"],["Upper traps"],["lateral-deltoid"],["upper-back"]),
    "road12.curl.cable-hammer":record("road12.curl.cable-hammer","cable-hammer-curl",["Biceps","Brachialis"],["Forearms"],["biceps","brachialis"],["forearms"],true),
    "road12.press.dumbbell-floor":record("road12.press.dumbbell-floor","dumbbell-floor-press",["Chest"],["Front shoulders","Triceps"],["chest"],["front-deltoid","triceps"]),
    "road12.deadlift.dumbbell-rdl":record("road12.deadlift.dumbbell-rdl","dumbbell-romanian-deadlift",["Hamstrings","Glutes"],["Upper back","Core","Grip"],["hamstrings","gluteus-maximus"],["upper-back","abdominals","forearms"]),
    "road12.fly.cable-rear-delt":record("road12.fly.cable-rear-delt","rear-delt-cable-fly",["Rear shoulders"],["Upper back"],["rear-deltoid"],["upper-back"],true),
    "road12.pull.cable-face":record("road12.pull.cable-face","cable-face-pull",["Rear shoulders","Upper back"],["Rotator cuff","Biceps"],["rear-deltoid","upper-back"],["biceps"]),
    "road12.pull.cable-straight-arm":record("road12.pull.cable-straight-arm","cable-straight-arm-pushdown",["Lats"],["Triceps","Core"],["lats"],["triceps","abdominals"]),
    "road12.rotation.cable-high-low":record("road12.rotation.cable-high-low","high-to-low-cable-chop",["Obliques","Abdominals"],["Shoulders","Hips"],["obliques","abdominals"],["front-deltoid","lateral-deltoid","glute-stabilizers"],true),
    "road12.core.reverse-crunch":record("road12.core.reverse-crunch","reverse-crunch",["Lower abdominals","Deep core"],["Hip flexors"],["abdominals"],["hip-flexors"],true),
    "road12.core.lying-leg-raise":record("road12.core.lying-leg-raise","lying-leg-raise",["Lower abdominals","Deep core"],["Hip flexors"],["abdominals"],["hip-flexors"],true),
    "road12.core.forearm-plank-posterior-tilt":record("road12.core.forearm-plank-posterior-tilt","forearm-plank-posterior-pelvic-tilt",["Deep core","Lower abdominals"],["Glutes","Shoulders"],["abdominals","obliques"],["glute-stabilizers","front-deltoid","lateral-deltoid"]),
    "road12.core.hanging-knee-raise":record("road12.core.hanging-knee-raise","hanging-knee-raise",["Lower abdominals","Deep core"],["Hip flexors","Grip"],["abdominals"],["hip-flexors","forearms"]),
    "road12.core.seated-bench-knee-tuck":record("road12.core.seated-bench-knee-tuck","seated-bench-knee-tuck",["Abdominals"],["Hip flexors"],["abdominals"],["hip-flexors"]),
    "road12.core.decline-reverse-crunch":record("road12.core.decline-reverse-crunch","decline-bench-reverse-crunch",["Lower abdominals","Deep core"],["Hip flexors"],["abdominals"],["hip-flexors"]),
    "road12.core.hanging-garhammer":record("road12.core.hanging-garhammer","hanging-garhammer-raise",["Lower abdominals","Deep core"],["Hip flexors","Grip"],["abdominals"],["hip-flexors","forearms"]),
    "road12.hinge.kettlebell-swing":record("road12.hinge.kettlebell-swing","kettlebell-swing",["Glutes","Hamstrings"],["Core","Grip","Upper back"],["gluteus-maximus","hamstrings"],["abdominals","forearms","upper-back"]),
    "road12.core.kettlebell-around-world":record("road12.core.kettlebell-around-world","kettlebell-around-the-world",["Deep core","Obliques"],["Shoulders","Forearms","Grip"],["abdominals","obliques"],["front-deltoid","lateral-deltoid","forearms"]),
    "road12.carry.kettlebell-suitcase":record("road12.carry.kettlebell-suitcase","kettlebell-suitcase-carry",["Obliques","Deep core","Grip"],["Shoulders","Glutes","Walking muscles"],["obliques","abdominals","forearms"],["lateral-deltoid","glute-stabilizers"])
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
