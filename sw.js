importScripts("./app-meta.js");

const CACHE=self.ROAD12_META.serviceWorkerCache;
const CACHE_PREFIX="road12-";
const ASSETS=[
  "./",
  "./index.html",
  "./app.css",
  "./app-meta.js",
  "./exercise-library.js",
  "./data.js",
  "./scheduling.js",
  "./workout-navigation.js",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/exercise-library/wger/hip-flexor-stretch.webp",
  "./assets/exercise-library/wger/triceps-pushdown.webp",
  "./assets/exercise-library/wger/smith-split-squat.gif",
  "./assets/exercise-library/ritfit/cable-chest-press.webp",
  "./assets/exercise-library/ritfit/cable-crunch.webp",
  "./assets/exercise-library/ritfit/cable-curl.webp",
  "./assets/exercise-library/ritfit/cable-face-pull.webp",
  "./assets/exercise-library/ritfit/cable-lateral-raise.webp",
  "./assets/exercise-library/ritfit/cable-shoulder-press.webp",
  "./assets/exercise-library/ritfit/high-to-low-cable-chop.webp",
  "./assets/exercise-library/ritfit/rear-delt-cable-fly.webp",
  "./assets/exercise-library/ritfit/seated-cable-row.webp",
  "./assets/exercise-library/ritfit/single-arm-cable-row.webp",
  "./assets/exercise-library/ritfit/smith-machine-calf-raise.webp",
  "./assets/exercise-library/ritfit/smith-machine-rdl.webp",
  "./assets/exercise-library/ritfit/smith-machine-squat.webp",
  "./assets/exercise-library/ritfit/straight-arm-pulldown.webp"
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys
        .filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE)
        .map(key=>caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request)));
});
