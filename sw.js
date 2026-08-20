/* Keep this query aligned with app-meta.js so Safari cannot reuse stale imported metadata. */
importScripts("./app-meta.js?build=2026.08.15.4");

const CACHE=self.ROAD12_META.serviceWorkerCache;
const MEDIA_CACHE=CACHE.endsWith("-shell")?`${CACHE.slice(0,-6)}-media`:`${CACHE}-media`;
const CACHE_PREFIX="road12-";
const MEDIA_CACHE_CONCURRENCY=4;

const MUTABLE_ASSETS=[
  "index.html",
  "app.css",
  "app-meta.js",
  "exercise-library.js",
  "exercise-identity.js",
  "data.js",
  "adaptive-coaching.js",
  "backup-restore.js",
  "workout-prescriptions.js",
  "scheduling.js",
  "workout-navigation.js",
  "app.js",
  "manifest.webmanifest"
];

const CORE_ASSETS=[
  "./",
  "./index.html",
  "./app.css",
  "./app-meta.js",
  "./exercise-library.js",
  "./exercise-identity.js",
  "./data.js",
  "./adaptive-coaching.js",
  "./backup-restore.js",
  "./workout-prescriptions.js",
  "./scheduling.js",
  "./workout-navigation.js",
  "./app.js",
  "./manifest.webmanifest"
];

const MEDIA_ASSETS=[
  "./assets/exercise-library/generated/arm-circles-motion-guide.webp",
  "./assets/exercise-library/generated/bodyweight-squat-motion-guide.webp",
  "./assets/exercise-library/generated/cable-chest-press-motion-guide.webp",
  "./assets/exercise-library/generated/cable-crunch-motion-guide.webp",
  "./assets/exercise-library/generated/cable-curl-motion-guide.webp",
  "./assets/exercise-library/generated/cable-face-pull-motion-guide.webp",
  "./assets/exercise-library/generated/cable-hammer-curl-motion-guide.webp",
  "./assets/exercise-library/generated/cable-lateral-raise-motion-guide.webp",
  "./assets/exercise-library/generated/cable-shoulder-press-motion-guide.webp",
  "./assets/exercise-library/generated/cable-straight-arm-pushdown-motion-guide.webp",
  "./assets/exercise-library/generated/chest-shoulder-mobility-motion-guide.webp",
  "./assets/exercise-library/generated/goblet-squat-motion-guide.webp",
  "./assets/exercise-library/generated/hamstring-mobility-motion-guide.webp",
  "./assets/exercise-library/generated/high-to-low-cable-chop-motion-guide.webp",
  "./assets/exercise-library/generated/hip-flexor-mobility-motion-guide.webp",
  "./assets/exercise-library/generated/hip-glute-mobility-motion-guide.webp",
  "./assets/exercise-library/generated/hip-hinge-motion-guide.webp",
  "./assets/exercise-library/generated/ifit-rowing-technique-motion-guide.webp",
  "./assets/exercise-library/generated/incline-cable-press-motion-guide.webp",
  "./assets/exercise-library/generated/lat-pulldown-motion-guide.webp",
  "./assets/exercise-library/generated/post-workout-stretch-motion-guide.webp",
  "./assets/exercise-library/generated/rear-delt-cable-fly-motion-guide.webp",
  "./assets/exercise-library/generated/rope-triceps-pushdown-motion-guide.webp",
  "./assets/exercise-library/generated/seated-cable-row-motion-guide.webp",
  "./assets/exercise-library/generated/single-arm-cable-row-motion-guide.webp",
  "./assets/exercise-library/generated/slow-breathing-cooldown-motion-guide.webp",
  "./assets/exercise-library/generated/smith-bulgarian-split-squat-motion-guide.webp",
  "./assets/exercise-library/generated/smith-machine-calf-raise-motion-guide.webp",
  "./assets/exercise-library/generated/smith-machine-rdl-motion-guide.webp",
  "./assets/exercise-library/generated/smith-machine-squat-motion-guide.webp",
  "./assets/exercise-library/generated/treadmill-easy-walk-motion-guide.webp",
  "./assets/exercise-library/generated/treadmill-hiit-interval-motion-guide.webp",
  "./assets/exercise-library/generated/treadmill-incline-walk-motion-guide.webp",
  "./assets/exercise-library/generated/zone-2-cardio-motion-guide.webp",
  "./assets/exercise-library/original/arm-circles-posture.webp",
  "./assets/exercise-library/original/bird-dog-motion-guide.webp",
  "./assets/exercise-library/original/bodyweight-squat-posture.webp",
  "./assets/exercise-library/original/cable-hammer-curl-red-cage.webp",
  "./assets/exercise-library/original/chest-shoulder-mobility.webp",
  "./assets/exercise-library/original/dead-bug-motion-guide.webp",
  "./assets/exercise-library/original/dumbbell-floor-press-motion-guide.webp",
  "./assets/exercise-library/original/dumbbell-lateral-raise-motion-guide.webp",
  "./assets/exercise-library/original/dumbbell-romanian-deadlift-motion-guide.webp",
  "./assets/exercise-library/original/hamstring-mobility.webp",
  "./assets/exercise-library/original/hip-flexor-mobility.webp",
  "./assets/exercise-library/original/hip-hinge-posture.webp",
  "./assets/exercise-library/original/incline-cable-press-cage.webp",
  "./assets/exercise-library/original/lat-pulldown-red-cage.webp",
  "./assets/exercise-library/original/side-plank-from-knees-motion-guide.webp",
  "./assets/exercise-library/original/treadmill-walk-posture.webp",
  "./assets/exercise-library/ritfit/cable-chest-press.webp",
  "./assets/exercise-library/ritfit/cable-crunch.webp",
  "./assets/exercise-library/ritfit/cable-curl.webp",
  "./assets/exercise-library/ritfit/cable-face-pull.webp",
  "./assets/exercise-library/ritfit/high-to-low-cable-chop.webp",
  "./assets/exercise-library/ritfit/rear-delt-cable-fly.webp",
  "./assets/exercise-library/ritfit/seated-cable-row.webp",
  "./assets/exercise-library/ritfit/single-arm-cable-row.webp",
  "./assets/exercise-library/ritfit/straight-arm-pulldown.webp",
  "./assets/exercise-library/wger/triceps-pushdown.webp",
  "./assets/phase3/kickr-core-bike-setup.jpg",
  "./assets/phase3/rower-technique.jpg",
  "./assets/exercise-library/generated/arm-circles.gif",
  "./assets/exercise-library/generated/bodyweight-squat.gif",
  "./assets/exercise-library/generated/cable-chest-press.gif",
  "./assets/exercise-library/generated/cable-crunch.gif",
  "./assets/exercise-library/generated/cable-curl.gif",
  "./assets/exercise-library/generated/cable-face-pull.gif",
  "./assets/exercise-library/generated/cable-hammer-curl.gif",
  "./assets/exercise-library/generated/cable-lateral-raise.gif",
  "./assets/exercise-library/generated/cable-shoulder-press.gif",
  "./assets/exercise-library/generated/cable-straight-arm-pushdown.gif",
  "./assets/exercise-library/generated/chest-shoulder-mobility.gif",
  "./assets/exercise-library/generated/goblet-squat.gif",
  "./assets/exercise-library/generated/hamstring-mobility.gif",
  "./assets/exercise-library/generated/high-to-low-cable-chop.gif",
  "./assets/exercise-library/generated/hip-flexor-mobility.gif",
  "./assets/exercise-library/generated/hip-glute-mobility.gif",
  "./assets/exercise-library/generated/hip-hinge.gif",
  "./assets/exercise-library/generated/ifit-rowing-technique.gif",
  "./assets/exercise-library/generated/incline-cable-press.gif",
  "./assets/exercise-library/generated/lat-pulldown.gif",
  "./assets/exercise-library/generated/post-workout-stretch.gif",
  "./assets/exercise-library/generated/rear-delt-cable-fly.gif",
  "./assets/exercise-library/generated/rope-triceps-pushdown.gif",
  "./assets/exercise-library/generated/seated-cable-row.gif",
  "./assets/exercise-library/generated/single-arm-cable-row.gif",
  "./assets/exercise-library/generated/slow-breathing-cooldown.gif",
  "./assets/exercise-library/generated/smith-bulgarian-split-squat.gif",
  "./assets/exercise-library/generated/smith-machine-calf-raise.gif",
  "./assets/exercise-library/generated/smith-machine-rdl.gif",
  "./assets/exercise-library/generated/smith-machine-squat.gif",
  "./assets/exercise-library/generated/treadmill-easy-walk.gif",
  "./assets/exercise-library/generated/treadmill-hiit-interval.gif",
  "./assets/exercise-library/generated/treadmill-incline-walk.gif",
  "./assets/exercise-library/generated/zone-2-cardio.gif",
  "./assets/exercise-library/original/bird-dog-animation.gif",
  "./assets/exercise-library/original/dead-bug-animation.gif",
  "./assets/exercise-library/original/dumbbell-floor-press-animation.gif",
  "./assets/exercise-library/original/dumbbell-lateral-raise-animation.gif",
  "./assets/exercise-library/original/dumbbell-romanian-deadlift-animation.gif",
  "./assets/exercise-library/original/side-plank-from-knees-animation.gif"
];

const MEDIA_ASSET_PATHS=MEDIA_ASSETS.map(asset=>asset.slice(1));
const MEDIA_POSTER_REFERENCE_ASSETS=MEDIA_ASSETS.filter(asset=>!asset.toLowerCase().endsWith(".gif"));
const MEDIA_ANIMATION_ASSETS=MEDIA_ASSETS.filter(asset=>asset.toLowerCase().endsWith(".gif"));

async function cacheMediaBatch(cache,assets){
  let nextIndex=0;
  let failureCount=0;
  const worker=async()=>{
    while(nextIndex<assets.length){
      const asset=assets[nextIndex++];
      try{
        if(await cache.match(asset))continue;
        const response=await fetch(asset);
        if(!response||response.ok===false)throw new Error("Media request failed");
        await cache.put(asset,response.clone?response.clone():response);
      }catch(error){
        failureCount++;
        // Media is optional during updates; a later message or request can retry it.
      }
    }
  };
  const workerCount=Math.min(MEDIA_CACHE_CONCURRENCY,assets.length);
  await Promise.all(Array.from({length:workerCount},()=>worker()));
  return failureCount;
}

async function cacheExerciseMedia(){
  const cache=await caches.open(MEDIA_CACHE);
  const posterReferenceFailures=await cacheMediaBatch(cache,MEDIA_POSTER_REFERENCE_ASSETS);
  const animationFailures=await cacheMediaBatch(cache,MEDIA_ANIMATION_ASSETS);
  return posterReferenceFailures+animationFailures;
}

function isMediaCacheName(key){
  return key.startsWith(CACHE_PREFIX)&&key.endsWith("-media");
}

async function olderMediaCacheNames(){
  const keys=await caches.keys();
  return keys
    .filter(key=>isMediaCacheName(key)&&key!==MEDIA_CACHE)
    .sort()
    .reverse();
}

async function deleteOlderMediaCaches(){
  const keys=await olderMediaCacheNames();
  await Promise.all(keys.map(async key=>{
    try{
      await caches.delete(key);
    }catch(error){
      // A later successful warm-up can retry cleanup.
    }
  }));
}

let mediaCacheJob=null;
function scheduleExerciseMediaCache(){
  if(!mediaCacheJob){
    mediaCacheJob=cacheExerciseMedia()
      .then(async failureCount=>{
        if(failureCount===0)await deleteOlderMediaCaches();
        return failureCount;
      })
      .finally(()=>{
        mediaCacheJob=null;
      });
  }
  return mediaCacheJob;
}

function isSameOriginMediaRequest(request){
  const requestUrl=typeof request==="string"?request:request.url;
  if(typeof requestUrl!=="string")return false;
  if(/^[a-z][a-z\d+.-]*:/i.test(requestUrl)){
    try{
      if(!self.location||new URL(requestUrl).origin!==self.location.origin)return false;
    }catch(error){
      return false;
    }
  }
  const requestPath=requestUrl.split("?")[0].split("#")[0];
  return MEDIA_ASSET_PATHS.some(assetPath=>requestPath.endsWith(assetPath));
}

async function mediaCacheFirst(request){
  let cache=null;
  try{
    cache=await caches.open(MEDIA_CACHE);
    const cached=await cache.match(request);
    if(cached)return cached;
  }catch(error){
    cache=null;
  }

  try{
    const response=await fetch(request);
    if(response&&response.ok!==false&&cache){
      try{
        await cache.put(request,response.clone?response.clone():response);
      }catch(error){
        // A successful media response remains usable even if persistence fails.
      }
    }
    return response;
  }catch(networkError){
    const fallbackNames=await olderMediaCacheNames();
    for(const cacheName of fallbackNames){
      try{
        const fallback=await (await caches.open(cacheName)).match(request);
        if(fallback)return fallback;
      }catch(error){
        // Continue through older media caches before reporting the network failure.
      }
    }
    throw networkError;
  }
}

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(CORE_ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    (async()=>{
      const keys=await caches.keys();
      await Promise.all(
        keys
          .filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE&&!isMediaCacheName(key))
          .map(key=>caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message",event=>{
  if(!event.data||event.data.type!=="CACHE_EXERCISE_MEDIA")return;
  event.waitUntil(scheduleExerciseMediaCache().catch(()=>undefined));
});

self.addEventListener("fetch",event=>{
  if(isSameOriginMediaRequest(event.request)){
    event.respondWith(mediaCacheFirst(event.request));
    return;
  }

  const requestUrl=typeof event.request==="string"?event.request:event.request.url;
  const requestPath=requestUrl.split("?")[0];
  const isMutable=event.request.mode==="navigate"||MUTABLE_ASSETS.some(asset=>requestPath.endsWith(asset));
  if(!isMutable){
    event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request)));
    return;
  }

  event.respondWith(
    fetch(event.request).then(async response=>{
      if(response&&response.ok!==false){
        const cache=await caches.open(CACHE);
        try{
          await cache.put(event.request,response.clone?response.clone():response);
        }catch(error){
          // Return the fresh shell even when a storage quota temporarily blocks caching.
        }
      }
      return response;
    }).catch(async()=>{
      const cached=await caches.match(event.request);
      return cached||caches.match("./index.html");
    })
  );
});
