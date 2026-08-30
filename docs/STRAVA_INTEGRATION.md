# Strava Integration Direction

## Status

Phase 1 is included in the configured pilot build: Road to 12% validates exercise mappings, determines explicit workout eligibility, generates a deterministic structured-strength payload, and displays that payload in a completed-workout preview. Preview mode makes no network request.

Phase 2A is provisioned as a manual-only pilot. The dedicated Cloudflare Worker and D1 database are deployed, exact-origin CORS is verified, provider credentials and the encryption key exist only as Cloudflare secrets, and the production PWA points to the reviewed Worker endpoint. OAuth consent has been reached successfully; the first user-initiated live upload remains pending.

## Phase 1 product rules

Only completed Full Body A, Full Body B, and Full Body C sessions containing at least one valid completed working set are eligible. Eligibility is based on explicit workout identity and completion state, never merely `workoutType === "strength"`. Core + Recovery, treadmill, rowing, cycling, mobility, recovery, cardio-only, previewed, abandoned, partial, and incomplete sessions are excluded.

The public title is exactly `Andy's Home Gym — Full Body A`, B, or C. The generated payload excludes Road to 12%, the body-fat goal, RIR, discomfort, form feedback, progression decisions, coaching details, body measurements, and private notes.

Historical Full Body sessions may be previewed only when their saved completion state and actual working sets are sufficient. Preview never changes or rewrites historical records, and no historical workout is automatically posted.

## Verified Strava format

Strava's current Uploads API accepts structured JSON for `WeightTraining`, `HIIT`, `Workout`, and `Crossfit`. A workout includes start time, UTC offset, elapsed time, and a required sets collection. Each set can carry an exercise type, repetitions, kilograms, duration, and start time. Upload processing is asynchronous and supports an external ID for duplicate identification.

Authoritative references, verified August 15, 2026:

- [Strava Uploads documentation](https://developers.strava.com/docs/uploads/)
- [Strava API changelog](https://developers.strava.com/docs/changelog/)

Strava identifiers must be stored as strings because remote IDs can exceed JavaScript's safe integer range.

`strava-strength-payload.js` is a pure boundary: it does not access the DOM, storage, or network. It produces preview metadata plus a JSON 1.0 file object with `start_time`, `utc_offset`, `elapsed_time`, and flattened structured sets. Only completed, non-skipped working sets are included. Warm-up and activation sets are excluded. Repetitions must be numeric and unambiguous; ranges such as `12-15` are not guessed.

## Mapping policy

`exercise-identity.js` contains one bounded allowlist of documented Strava tokens used by Road to 12%. Automated validation fails when a canonical mapping falls outside it, protecting against typos. Unknown future movements remain visible in preview with `UNMAPPED_EXERCISE`; they are omitted from the API-specific set list rather than assigned an invented token.

Phase 1 maps all 38 current canonical identities. Smith Machine Hip Thrust uses the documented `BARBELL_HIP_THRUST_WITH_BENCH` approximation because the movement uses a guided bar and an external bench and Strava has no exact Smith-machine equivalent. The mapping is explicit and can be revised without rewriting completed history.

## Load normalization

Road to 12% remains pounds-first internally. The payload boundary converts normalized external resistance to kilograms using `1 lb = 0.45359237 kg`, rounded to three decimal places.

- Smith machine: stored total plate weight plus the known 33 lb Smith bar.
- Paired dumbbells: the app already stores the combined weight of both dumbbells, so it is not doubled again.
- Dual cable stacks: the app stores one stack's selector value, so payload resistance is twice the entry.
- Single cable stack: use the one active stack's selector value directly.
- Bodyweight: omit external load.
- Missing or unknown load: omit external load rather than publishing zero.

Strava documents `weight` as kilograms but does not further define paired-implement biomechanics. Phase 1 therefore uses total selected external resistance consistently and exposes the applied rule in preview/test metadata.

## Security boundary

The installed PWA is a public client and must never contain a Strava client secret, long-lived access token, or refresh token. The intended path is:

```text
Road to 12% PWA
  -> authenticated HTTPS request
Secure backend or serverless integration service
  -> OAuth token storage, JSON conversion, upload, and polling
Strava API
```

Offline workout completion remains authoritative. A failed or unavailable sync can never block saving a workout.

## Canonical local record

New completed strength sessions preserve:

- A stable Road to 12% exercise ID independent of the display name.
- Display name, exercise order, muscles, equipment, and provider mappings.
- Prescribed sets, reps, rest, and unit separately from actual performance.
- One record per actual set: set number, type, repetitions, weight, unit, completion status, and timestamps when observed.
- Session start/end and elapsed duration, with active/rest duration left `null` until they can be measured honestly.
- Workout difficulty, notes, training phase, recovery dates, and aggregate actual performance.
- Per-provider synchronization metadata.

Older history remains valid and is not rewritten. Consumers must tolerate legacy records that do not contain the newer fields.

## Synchronization lifecycle

Provider state is stored beneath the workout, beginning with:

`NOT_SYNCED -> QUEUED -> SYNCING -> SYNCED`

Failures use `FAILED` and retain a human-safe `lastError`. The Strava record reserves `externalId`, `uploadId`, `activityId`, `lastAttemptAt`, and `uploadedAt`. No activity is marked synced until Strava confirms the asynchronous upload.

`strava-sync-state.js` formalizes these allowed transitions:

- `NOT_SYNCED -> QUEUED`
- `QUEUED -> SYNCING`
- `SYNCING -> SYNCED`
- `SYNCING -> FAILED`
- `FAILED -> QUEUED`

`SYNCED` is terminal during normal processing. While connected, backup merge preserves a confirmed `SYNCED` record and its provider identifiers when an older or poorer backup contains `NOT_SYNCED` or missing state. Confirmed disconnect is the exception: it removes the provider record and writes a local deletion tombstone so an older backup cannot restore it.

## Duplicate policy

- Use the stable Road to 12% session external ID for strength-upload idempotency.
- Never create a second strength activity after an activity ID is recorded unless the user explicitly chooses a future repair workflow.
- Default cardio to no Road to 12% upload when iFIT is the recording source.
- A future UI must clearly show source, queued/failed/synced state, and retry behavior without implying that local data depends on Strava.

## Delivery phases

### Phase 1 — local payload and preview

Implemented in the configured pilot build:

- Stable exercise identities and validated mappings.
- Explicit Full Body A/B/C eligibility.
- Pure structured-strength payload generation.
- Equipment-aware load normalization and pound-to-kilogram conversion.
- Local completed-workout preview with mapping and warning visibility.
- Formal sync-state transitions and protective backup merging.
- No OAuth, credentials, backend, fetch, queue, or upload.

### Phase 2A — secure manual proof of concept

Implemented and provisioned for a limited manual pilot:

- A Cloudflare Worker plus D1 persistence owns OAuth exchange, encrypted access/refresh tokens, refresh, revocation, upload submission, polling, and `installationId + externalId` idempotency.
- A per-installation P-256 key authenticates privileged browser requests. Cloudflare stores only the public key; timestamp and nonce checks reject stale or replayed requests.
- OAuth requests use only `activity:write`. State is unpredictable, installation-bound, expires after ten minutes, and is consumed once.
- The exact CORS origin remains `https://harrison0550.github.io`, while the separate OAuth application return URL is `https://harrison0550.github.io/road-to-12/`. Success, denial, and callback failure return to that full application path with the existing `strava` status parameter.
- Token material is encrypted with AES-256-GCM before D1 storage. The encryption key and Strava application credentials are Worker secrets and never enter the PWA or backup.
- Eligible session details preserve local Preview and add Post only while connected and online. A second confirmation states that a real activity will be created and shows activity title, exercise count, set count, and warnings.
- The Worker validates the external ID, title allowlist, `WeightTraining` sport, `json` data type, JSON 1.0 structure, supported exercise tokens, size limits, and prohibited private fields.
- The current official production contract is multipart `POST /api/v3/uploads` with a JSON file, `data_type=json`, `sport_type=WeightTraining`, `external_id`, and name. Strava's API reference still lists older file-type enums, but the current Uploads guide explicitly documents JSON and is the implemented authority.
- The Worker stores `uploadId` immediately, polls no more than once per second, and returns only sanitized state. A confirmed `activityId` produces the View on Strava link.
- Session-detail reconciliation may adopt an existing backend processing, failed, or synced record but never resubmits automatically. Confirmed local `SYNCED` state cannot be downgraded by backup import or poorer backend state.
- Disconnect revokes the provider token, then atomically deletes the installation's OAuth state, connection/profile/token record, and every upload/activity/error record from D1. Only after the Worker confirms deletion does the PWA remove all Strava provider metadata and activity links from workout history. The original Road to 12% workouts remain intact, and a local tombstone prevents older backups from restoring deleted provider data.
- `strava-data-boundary.js` is the canonical classification and stripping boundary. Strava-derived records are excluded from coaching, readiness, analytics, AI/model input, and agent contexts.
- HTTP `429` responses expose only a sanitized rate-limit code and optional `Retry-After`; provider headers are not persisted.

Worker routes:

- `POST /api/install/register`
- `GET /api/strava/status`
- `POST /api/strava/connect`
- `GET /api/strava/callback`
- `POST /api/strava/upload`
- `GET /api/strava/upload/:externalId/status`
- `POST /api/strava/disconnect`

Phase 2A explicitly excludes automatic sync, background queues, bulk history, Core + Recovery, cardio, update/delete propagation, multiple users, silent retry, and scheduled jobs. `strava-config.js` points only to the reviewed Phase 2A Worker. No connection or activity is created without explicit user action.

### Phase 2B — not approved

Automatic strength sync is not implemented. It must not begin until Phase 2A has completed one successful, explicitly approved live pilot and a separate product/security decision authorizes the next phase. Cardio remains excluded until source arbitration prevents iFIT duplication.

Foundation A/B/C, adaptive progression, recovery scheduling, and offline use remain unchanged while this integration matures.
