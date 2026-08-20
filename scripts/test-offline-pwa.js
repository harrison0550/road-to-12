const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const swSource = fs.readFileSync(path.join(root, "sw.js"), "utf8");

function sourceArray(name) {
  const match = swSource.match(new RegExp(`const\\s+${name}\\s*=\\s*(\\[[\\s\\S]*?\\]);`));
  assert(match, `sw.js must define ${name}`);
  return JSON.parse(match[1]);
}

const coreAssets = sourceArray("CORE_ASSETS");
const mediaAssets = sourceArray("MEDIA_ASSETS");
const mediaAssetSet = new Set(mediaAssets);
const posterReferenceAssets = mediaAssets.filter((asset) => !asset.toLowerCase().endsWith(".gif"));
const animationAssets = mediaAssets.filter((asset) => asset.toLowerCase().endsWith(".gif"));

const metaContext = { self: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, "app-meta.js"), "utf8"),
  metaContext,
  { filename: "app-meta.js" },
);
const expectedMeta = metaContext.self.ROAD12_META;

const libraryContext = { self: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, "exercise-library.js"), "utf8"),
  libraryContext,
  { filename: "exercise-library.js" },
);
const exerciseEntries = libraryContext.self.ROAD12_EXERCISE_LIBRARY.entries;
const reviewedMedia = new Set();
for (const entry of Object.values(exerciseEntries)) {
  reviewedMedia.add(`./${entry.media}`);
  if (entry.motionPoster) reviewedMedia.add(`./${entry.motionPoster}`);
  if (entry.reference?.media) reviewedMedia.add(`./${entry.reference.media}`);
}
assert.deepStrictEqual(
  [...reviewedMedia].filter((asset) => !mediaAssetSet.has(asset)),
  [],
  "every registry animation, poster, and retained reference must be listed in MEDIA_ASSETS",
);
assert.deepStrictEqual(
  mediaAssets,
  [...posterReferenceAssets, ...animationAssets],
  "MEDIA_ASSETS must list posters and references before animation files",
);

const listeners = new Map();
const stores = new Map();
const deletedCaches = [];
const operationLog = [];
const unavailableMedia = new Set();
let networkOnline = true;
let mediaNetworkOnline = false;
let networkRequests = 0;
let activeMediaFetches = 0;
let maxActiveMediaFetches = 0;
let mediaFetchLog = [];
let skipWaitingCalled = false;
let claimCalled = false;

function requestKey(request) {
  return typeof request === "string" ? request : request.url;
}

function cacheFor(name) {
  if (!stores.has(name)) stores.set(name, new Map());
  const store = stores.get(name);
  return {
    async addAll(assets) {
      for (const asset of assets) {
        store.set(asset, { source: "cache", url: asset, ok: true });
      }
    },
    async match(request) {
      return store.get(requestKey(request));
    },
    async put(request, response) {
      const key = requestKey(request);
      operationLog.push(`put:${name}:${key}`);
      store.set(key, response);
    },
  };
}

function isMediaRequest(request) {
  const key = requestKey(request).split("?")[0].split("#")[0];
  return mediaAssets.some((asset) => key.endsWith(asset.slice(1)));
}

const context = {
  console,
  Promise,
  URL,
  setTimeout,
  importScripts(relativePath) {
    const source = fs.readFileSync(
      path.join(root, relativePath.replace(/^\.\//, "").split("?")[0]),
      "utf8",
    );
    vm.runInContext(source, context, { filename: relativePath });
  },
  caches: {
    async open(name) {
      return cacheFor(name);
    },
    async keys() {
      return [...stores.keys()];
    },
    async delete(name) {
      operationLog.push(`delete:${name}`);
      deletedCaches.push(name);
      return stores.delete(name);
    },
    async match(request) {
      const key = requestKey(request);
      for (const store of stores.values()) {
        if (store.has(key)) return store.get(key);
      }
      return undefined;
    },
  },
  async fetch(request) {
    networkRequests += 1;
    const key = requestKey(request);
    const media = isMediaRequest(request);
    if (media) {
      mediaFetchLog.push(key);
      activeMediaFetches += 1;
      maxActiveMediaFetches = Math.max(maxActiveMediaFetches, activeMediaFetches);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1));
        if (!networkOnline || !mediaNetworkOnline || unavailableMedia.has(key)) {
          throw new Error("offline");
        }
      } finally {
        activeMediaFetches -= 1;
      }
    } else if (!networkOnline) {
      throw new Error("offline");
    }
    return {
      source: "network",
      url: key,
      ok: true,
      clone() {
        return { source: "network-cache", url: key, ok: true };
      },
    };
  },
  self: {
    location: { origin: "https://road12.test" },
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
    skipWaiting() {
      skipWaitingCalled = true;
    },
    clients: {
      claim() {
        claimCalled = true;
      },
    },
  },
};
context.self.self = context.self;
vm.createContext(context);
vm.runInContext(swSource, context, { filename: "sw.js" });

async function dispatchExtendable(type, eventData = {}) {
  let completion;
  const handler = listeners.get(type);
  assert(handler, `${type} handler must exist`);
  handler({
    ...eventData,
    waitUntil(promise) {
      completion = Promise.resolve(promise);
    },
  });
  assert(completion, `${type} must register asynchronous completion`);
  await completion;
}

async function dispatchFetch(url) {
  let response;
  listeners.get("fetch")({
    request: {
      url,
      method: "GET",
      mode: url.endsWith("index.html") ? "navigate" : "same-origin",
    },
    respondWith(promise) {
      response = Promise.resolve(promise);
    },
  });
  assert(response, "fetch must provide a response");
  return response;
}

(async () => {
  const shellCacheName = context.self.ROAD12_META.serviceWorkerCache;
  const mediaCacheName = shellCacheName.endsWith("-shell")
    ? `${shellCacheName.slice(0, -6)}-media`
    : `${shellCacheName}-media`;

  assert.strictEqual(shellCacheName, expectedMeta.serviceWorkerCache);
  assert(swSource.includes(`app-meta.js?build=${expectedMeta.build}`));
  assert.match(swSource, /const MEDIA_CACHE_CONCURRENCY=4;/);
  assert.match(
    fs.readFileSync(path.join(root, "app.js"), "utf8"),
    /postMessage\(\{type:"CACHE_EXERCISE_MEDIA"\}\)/,
    "the app must request best-effort media warming after Service Worker readiness",
  );

  // Media is deliberately unavailable here. Installation must still succeed
  // because only the lightweight shell is part of the atomic install.
  mediaNetworkOnline = false;
  await dispatchExtendable("install");
  assert.strictEqual(skipWaitingCalled, true, "a complete shell must activate promptly");
  const shellStore = stores.get(shellCacheName);
  assert(shellStore, "install must create the current shell cache");
  assert(!stores.has(mediaCacheName), "install must not depend on opening or filling the media cache");
  for (const asset of coreAssets) assert(shellStore.has(asset), `install must cache ${asset}`);
  for (const media of mediaAssets) {
    assert(!shellStore.has(media), `large media must stay out of the atomic shell cache: ${media}`);
  }

  // Activation cleans stale shells and claims clients while preserving older
  // media caches as offline fallback until the new media cache is complete.
  const oldMediaCacheName = "road12-v13-2-45-media";
  const carriedPoster = `./${exerciseEntries["Cable Chest Press"].motionPoster}`;
  const oldAnimation = `./${exerciseEntries["Cable Chest Press"].media}`;
  stores.set(
    oldMediaCacheName,
    new Map([
      [carriedPoster, { source: "old-media", url: carriedPoster, ok: true }],
      [oldAnimation, { source: "old-media", url: oldAnimation, ok: true }],
    ]),
  );
  stores.set("road12-v13-1-shell", new Map([["./index.html", { stale: true }]]));
  stores.set("unrelated-cache", new Map([["other", { keep: true }]]));
  await dispatchExtendable("activate");
  assert.strictEqual(claimCalled, true, "activation must claim clients independently of media");
  assert(deletedCaches.includes("road12-v13-1-shell"));
  assert(stores.has(shellCacheName));
  assert(stores.has("unrelated-cache"));
  assert(stores.has(oldMediaCacheName), "activation must retain the prior media fallback");

  networkOnline = false;
  const fallbackPoster = await dispatchFetch(carriedPoster);
  const fallbackAnimation = await dispatchFetch(oldAnimation);
  assert.strictEqual(fallbackPoster.source, "old-media");
  assert.strictEqual(fallbackAnimation.source, "old-media");
  networkOnline = true;

  // Media warming is bounded and best-effort. One failed poster and one failed
  // GIF must not reject the job, duplicate concurrent jobs, or remove fallback.
  const failedPoster = carriedPoster;
  const failedAnimation = oldAnimation;
  unavailableMedia.add(failedPoster);
  unavailableMedia.add(failedAnimation);
  mediaNetworkOnline = true;
  mediaFetchLog = [];
  maxActiveMediaFetches = 0;
  await Promise.all([
    dispatchExtendable("message", { data: { type: "CACHE_EXERCISE_MEDIA" } }),
    dispatchExtendable("message", { data: { type: "CACHE_EXERCISE_MEDIA" } }),
  ]);
  assert(maxActiveMediaFetches <= 4, "media warming must honor its four-request concurrency bound");
  assert(maxActiveMediaFetches > 1, "media warming should use bounded parallelism");
  assert.strictEqual(
    new Set(mediaFetchLog).size,
    mediaFetchLog.length,
    "concurrent CACHE_EXERCISE_MEDIA messages must coalesce into one warm-up job",
  );
  const firstAnimationRequest = mediaFetchLog.findIndex((asset) => asset.toLowerCase().endsWith(".gif"));
  assert(firstAnimationRequest > 0, "animation warming must follow poster/reference attempts");
  assert(
    mediaFetchLog.slice(0, firstAnimationRequest).every((asset) => !asset.toLowerCase().endsWith(".gif")),
    "all poster/reference requests must begin before any animation request",
  );
  const mediaStore = stores.get(mediaCacheName);
  assert(!mediaStore.has(failedPoster), "a failed poster should remain retryable");
  assert(!mediaStore.has(failedAnimation), "a failed animation should remain retryable");
  assert(
    mediaAssets.some((asset) => mediaStore.has(asset)),
    "best-effort warming must retain successful media when individual requests fail",
  );
  assert(stores.has(oldMediaCacheName), "any warm-up failure must retain the older media fallback");
  networkOnline = false;
  assert.strictEqual((await dispatchFetch(failedPoster)).source, "old-media");
  assert.strictEqual((await dispatchFetch(failedAnimation)).source, "old-media");

  unavailableMedia.clear();
  networkOnline = true;
  operationLog.length = 0;
  await dispatchExtendable("message", { data: { type: "CACHE_EXERCISE_MEDIA" } });
  assert.deepStrictEqual(
    mediaAssets.filter((asset) => !mediaStore.has(asset)),
    [],
    "the current media cache must become fully warm after a successful retry",
  );
  assert(!stores.has(oldMediaCacheName), "a zero-failure warm-up must remove the older media cache");
  const finalPosterPut = operationLog.indexOf(`put:${mediaCacheName}:${failedPoster}`);
  const finalAnimationPut = operationLog.indexOf(`put:${mediaCacheName}:${failedAnimation}`);
  const oldMediaDelete = operationLog.indexOf(`delete:${oldMediaCacheName}`);
  assert(
    finalPosterPut >= 0 && finalAnimationPut >= 0 && oldMediaDelete > finalPosterPut && oldMediaDelete > finalAnimationPut,
    "old media must be deleted only after all retry media is stored",
  );

  // Immutable media is cache-first and fills on demand if a warm was missed.
  const onDemandAnimation = oldAnimation;
  mediaStore.delete(onDemandAnimation);
  const requestsBeforeOnDemand = networkRequests;
  const firstMediaResponse = await dispatchFetch(onDemandAnimation);
  assert.strictEqual(firstMediaResponse.source, "network");
  assert.strictEqual(mediaStore.get(onDemandAnimation).source, "network-cache");
  networkOnline = false;
  const cachedMediaResponse = await dispatchFetch(onDemandAnimation);
  assert.strictEqual(cachedMediaResponse.source, "network-cache");
  assert.strictEqual(
    networkRequests,
    requestsBeforeOnDemand + 1,
    "a cached immutable animation must not make a second network request",
  );

  const requestsBeforeOfflineRelaunch = networkRequests;
  const cachedRelaunch = await dispatchFetch("./index.html");
  assert.strictEqual(cachedRelaunch.source, "cache");
  assert.strictEqual(networkRequests, requestsBeforeOfflineRelaunch + 1);

  networkOnline = true;
  const refreshedApp = await dispatchFetch("./app.js");
  assert.strictEqual(refreshedApp.source, "network");
  assert.strictEqual(shellStore.get("./app.js").source, "network-cache");
  const networkResponse = await dispatchFetch("./not-cached.txt");
  assert.strictEqual(networkResponse.source, "network");

  console.log(
    "Offline PWA smoke tests passed: atomic shell install, independent activation, poster-first bounded media warming, migration ordering, retry completion, cache-on-demand, and offline relaunch.",
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
