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
    "assets/exercise-library/v2/seated-cable-chest-fly/road12-v2-seated-cable-chest-fly-poster.webp",
    "assets/exercise-library/v2/seated-cable-chest-fly/road12-v2-seated-cable-chest-fly-sequence.webp",
    "assets/exercise-library/v2/seated-cable-chest-fly/road12-v2-seated-cable-chest-fly-motion.mp4",
    "assets/exercise-library/v2/seated-cable-chest-fly/road12-v2-seated-cable-chest-fly-motion.webp"
  ]);
  const cacheAssets=Object.freeze([...sharedAssets,...approvedAssets]);
  return Object.freeze({VERSION,pilotSlugs,sharedAssets,plannedAssets,approvedAssets,cacheAssets});
});
