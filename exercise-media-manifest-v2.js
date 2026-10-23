(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_MEDIA_V2_MANIFEST=api;
})(typeof self!=="undefined"?self:globalThis,function(){
  const VERSION=2;
  const sharedAssets=Object.freeze([
    "assets/exercise-library/v2/shared/muscles-front.svg",
    "assets/exercise-library/v2/shared/muscles-back.svg"
  ]);
  const pilotSlugs=Object.freeze([
    "smith-machine-bench-press","gmwd-converging-chest-press","lat-pulldown","seated-cable-row",
    "seated-cable-chest-fly",
    "smith-machine-squat","smith-machine-hip-thrust","dumbbell-reverse-lunge","standing-single-leg-cable-hamstring-curl",
    "dumbbell-lateral-raise","seated-concentration-curl","smith-machine-calf-raise","cable-crunch"
  ]);
  const plannedAssets=Object.freeze(pilotSlugs.flatMap(slug=>[
    `assets/exercise-library/v2/${slug}/road12-v2-${slug}-poster.webp`,
    `assets/exercise-library/v2/${slug}/road12-v2-${slug}-sequence.webp`,
    `assets/exercise-library/v2/${slug}/road12-v2-${slug}-motion.mp4`,
    `assets/exercise-library/v2/${slug}/road12-v2-${slug}-motion.webp`
  ]));
  /* Only reviewed files that physically exist belong in cacheAssets. Pending
     pilot paths stay in plannedAssets so a missing draft can never break SW install. */
  const approvedAssets=Object.freeze([
    "assets/exercise-library/v2/smith-machine-bench-press/road12-v2-smith-machine-bench-press-poster.webp",
    "assets/exercise-library/v2/smith-machine-bench-press/road12-v2-smith-machine-bench-press-sequence.webp",
    "assets/exercise-library/v2/smith-machine-bench-press/road12-v2-smith-machine-bench-press-motion.mp4",
    "assets/exercise-library/v2/smith-machine-bench-press/road12-v2-smith-machine-bench-press-motion.webp",
    "assets/exercise-library/v2/gmwd-converging-chest-press/road12-v2-gmwd-converging-chest-press-poster.webp",
    "assets/exercise-library/v2/gmwd-converging-chest-press/road12-v2-gmwd-converging-chest-press-sequence.webp",
    "assets/exercise-library/v2/gmwd-converging-chest-press/road12-v2-gmwd-converging-chest-press-motion.mp4",
    "assets/exercise-library/v2/gmwd-converging-chest-press/road12-v2-gmwd-converging-chest-press-motion.webp",
    "assets/exercise-library/v2/lat-pulldown/road12-v2-lat-pulldown-poster.webp",
    "assets/exercise-library/v2/lat-pulldown/road12-v2-lat-pulldown-sequence.webp",
    "assets/exercise-library/v2/lat-pulldown/road12-v2-lat-pulldown-motion.mp4",
    "assets/exercise-library/v2/lat-pulldown/road12-v2-lat-pulldown-motion.webp",
    "assets/exercise-library/v2/seated-cable-row/road12-v2-seated-cable-row-poster.webp",
    "assets/exercise-library/v2/seated-cable-row/road12-v2-seated-cable-row-sequence.webp",
    "assets/exercise-library/v2/seated-cable-row/road12-v2-seated-cable-row-motion.mp4",
    "assets/exercise-library/v2/seated-cable-row/road12-v2-seated-cable-row-motion.webp",
    "assets/exercise-library/v2/seated-cable-chest-fly/road12-v2-seated-cable-chest-fly-poster.webp",
    "assets/exercise-library/v2/seated-cable-chest-fly/road12-v2-seated-cable-chest-fly-sequence.webp",
    "assets/exercise-library/v2/seated-cable-chest-fly/road12-v2-seated-cable-chest-fly-motion.mp4",
    "assets/exercise-library/v2/seated-cable-chest-fly/road12-v2-seated-cable-chest-fly-motion.webp",
    "assets/exercise-library/v2/smith-machine-squat/road12-v2-smith-machine-squat-poster.webp",
    "assets/exercise-library/v2/smith-machine-squat/road12-v2-smith-machine-squat-sequence.webp",
    "assets/exercise-library/v2/smith-machine-squat/road12-v2-smith-machine-squat-motion.mp4",
    "assets/exercise-library/v2/smith-machine-squat/road12-v2-smith-machine-squat-motion.webp",
    "assets/exercise-library/v2/standing-single-leg-cable-hamstring-curl/road12-v2-standing-single-leg-cable-hamstring-curl-poster.webp",
    "assets/exercise-library/v2/standing-single-leg-cable-hamstring-curl/road12-v2-standing-single-leg-cable-hamstring-curl-sequence.webp",
    "assets/exercise-library/v2/standing-single-leg-cable-hamstring-curl/road12-v2-standing-single-leg-cable-hamstring-curl-motion.mp4",
    "assets/exercise-library/v2/standing-single-leg-cable-hamstring-curl/road12-v2-standing-single-leg-cable-hamstring-curl-motion.webp",
    "assets/exercise-library/v2/smith-machine-hip-thrust/road12-v2-smith-machine-hip-thrust-poster.webp",
    "assets/exercise-library/v2/smith-machine-hip-thrust/road12-v2-smith-machine-hip-thrust-sequence.webp",
    "assets/exercise-library/v2/smith-machine-hip-thrust/road12-v2-smith-machine-hip-thrust-motion.mp4",
    "assets/exercise-library/v2/smith-machine-hip-thrust/road12-v2-smith-machine-hip-thrust-motion.webp",
    "assets/exercise-library/v2/smith-machine-calf-raise/road12-v2-smith-machine-calf-raise-poster.webp",
    "assets/exercise-library/v2/smith-machine-calf-raise/road12-v2-smith-machine-calf-raise-sequence.webp",
    "assets/exercise-library/v2/smith-machine-calf-raise/road12-v2-smith-machine-calf-raise-motion.mp4",
    "assets/exercise-library/v2/smith-machine-calf-raise/road12-v2-smith-machine-calf-raise-motion.webp",
    "assets/exercise-library/v2/dumbbell-lateral-raise/road12-v2-dumbbell-lateral-raise-poster.webp",
    "assets/exercise-library/v2/dumbbell-lateral-raise/road12-v2-dumbbell-lateral-raise-sequence.webp",
    "assets/exercise-library/v2/dumbbell-lateral-raise/road12-v2-dumbbell-lateral-raise-motion.mp4",
    "assets/exercise-library/v2/dumbbell-lateral-raise/road12-v2-dumbbell-lateral-raise-motion.webp",
    "assets/exercise-library/v2/seated-concentration-curl/road12-v2-seated-concentration-curl-poster.webp",
    "assets/exercise-library/v2/seated-concentration-curl/road12-v2-seated-concentration-curl-sequence.webp",
    "assets/exercise-library/v2/seated-concentration-curl/road12-v2-seated-concentration-curl-motion.mp4",
    "assets/exercise-library/v2/seated-concentration-curl/road12-v2-seated-concentration-curl-motion.webp",
    "assets/exercise-library/v2/dumbbell-reverse-lunge/road12-v2-dumbbell-reverse-lunge-poster.webp",
    "assets/exercise-library/v2/dumbbell-reverse-lunge/road12-v2-dumbbell-reverse-lunge-sequence.webp",
    "assets/exercise-library/v2/dumbbell-reverse-lunge/road12-v2-dumbbell-reverse-lunge-motion.mp4",
    "assets/exercise-library/v2/dumbbell-reverse-lunge/road12-v2-dumbbell-reverse-lunge-motion.webp",
    "assets/exercise-library/v2/cable-crunch/road12-v2-cable-crunch-poster.webp",
    "assets/exercise-library/v2/cable-crunch/road12-v2-cable-crunch-sequence.webp",
    "assets/exercise-library/v2/cable-crunch/road12-v2-cable-crunch-motion.mp4",
    "assets/exercise-library/v2/cable-crunch/road12-v2-cable-crunch-motion.webp"
  ]);
  const cacheAssets=Object.freeze([...sharedAssets,...approvedAssets]);
  return Object.freeze({VERSION,pilotSlugs,sharedAssets,plannedAssets,approvedAssets,cacheAssets});
});
