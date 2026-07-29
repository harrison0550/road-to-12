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
  "./app.js",
  "./manifest.webmanifest",
  "./assets/exercise-library/wger/triceps-pushdown.webp",
  "./assets/exercise-library/wger/smith-split-squat.gif",
  "./assets/exercise-library/wger/straight-arm-pulldown.png",
  "./assets/exercise-library/wger/smith-machine-squat.jpg",
  "./assets/exercise-library/wger/hip-flexor-stretch.webp"
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
