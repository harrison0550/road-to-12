# Architecture

## Overview

Road to 12% is a client-only, offline-first PWA. `index.html` loads version metadata, exercise content, workout data, and the production application script. The application renders screens into a single main container and persists state locally. A Service Worker caches the application shell and reviewed media.

The current architecture favors reliability and portability: no application server is required, no account is required, and the installed app remains useful without connectivity.

Exercise media may be an official equipment reference, reviewed licensed media, or a clearly identified app-created movement animation. App-created artwork supplements but never replaces the written setup, execution, and safety cues. All production exercise media is locally stored and becomes offline-ready after the bounded media-cache warm-up.

## Exercise media

`exercise-library.js` is the canonical media registry. Active guided exercises resolve by their exact display name to a reviewed entry containing media type, motion-poster path, animation path, meaningful alternative text, review date, and any retained source reference. Alias entries may share an exact movement asset, but the Workout Engine keeps each exercise's written prescription and identity separate.

The current Foundation audit maps all 62 active guided names to 55 distinct Road to 12% animations. Three explicitly approved, review-gated lower-ab Phase 2 movements are also registered. Legacy and alias mappings bring the registry to 60 distinct GIFs across 76 exact-name mappings. The visible Library-only Stationary Bike Setup uses a reviewed static equipment guide. Scope and exact names are recorded in `EXERCISE_MEDIA_AUDIT.md`. The registry must not pre-create or map speculative media for later training phases whose workout definitions are not approved.

Focused exercise surfaces are animation-first. The reviewed GIF always starts when the workout or enlarged exercise view opens and can be paused back to its static WebP storyboard. Exercise-library grids continue using still previews so dozens of GIFs do not animate simultaneously. Larger media views reuse the same state model inside a labelled, focus-managed dialog.

When a new app-created animation supplements an existing official or reviewed source, the earlier reference remains nested in the registry and credited in the centralized Image Sources & Licenses screen. Do not repeat legacy reference imagery beneath the reviewed animation, and do not erase source provenance merely because the primary instructional surface changes.

## Workout Engine

Phase 1 Foundation remains Full Body A/B/C. The progression engine derives exercise-specific PROGRESS, BUILD, HOLD, or DELOAD guidance from completed sets, reps, weight and feedback; it does not mutate workout definitions or apply a whole-workout rating uniformly. Phase readiness is a separate multi-signal projection and cannot change the schedule without a milestone review and explicit acceptance.

The lower-ab track is a bounded subprogram inside Thursday Core + Recovery, not a change to the global Foundation phase. Schema-14 state records its completed session IDs, readiness timestamp, explicit Phase 2 acceptance, and completion timestamp. Only completed Thursday sessions count. Two Phase 1 exposures create a review milestone; elapsed weeks do not advance the exercise selection. Tuesday and Saturday pelvic-floor content is a relaxation/mobility block and must not be presented as diagnosis or medical treatment. Schema 15 independently records the confirmed 30 lb kettlebell. Thursday places a short technique-first kettlebell block after the warm-up and before the existing floor-core work; it does not remove or replace the lower-ab track.

Strength feedback records optional reps in reserve, form quality, and discomfort with the completed exercise snapshot. Concrete next-session prescriptions require explicit approval. `workout-prescriptions.js` snapshots an approval only into the next newly started session containing the same stable exercise ID; unrelated and already-active sessions are unaffected. The Workout Engine displays the session prescription while keeping actual set entries editable. Completion records whether the target was followed, partially followed, overridden, or not attempted. Base Foundation prescriptions remain separate and are never rewritten.

Chest presses additionally record optional target-muscle engagement as `{target, rating}`. Strong or Moderate engagement, clean form, completed targets, no discomfort, and the intended RIR range are required before progression. Low or None holds the load; repeated low engagement flags coaching review. An optional activation set may be marked complete in active-session state for resumability, but it is deliberately absent from working-set snapshots, volume, PRs, and progression evidence. `programRevision` on newly started sessions prevents a deployed definition change from rewriting an already-active A/B workout, injecting newly added attachment work into it, or adding the Smith Machine Hip Thrust to an older active Full Body C session. Corrective safety/form guidance may replace an inaccurate guide immediately while stable exercise identity preserves history.

The Workout Engine selects the appropriate program day, resolves exercises against available equipment, starts or resumes a session, tracks sets and timers, and writes a completed snapshot to workout history.

Workout timers use an absolute wall-clock finish timestamp rather than counting interval callbacks. The UI reconciles remaining time when the document becomes visible, receives focus, or is restored, because iOS may suspend JavaScript while another app is active. Completion chimes are generated locally through the browser audio API so the cue remains available offline, although iOS may delay the cue until the PWA resumes. Previous-weight guidance is read from the latest completed snapshot for the same exercise and must never prefill or mutate the active set automatically. An explicitly approved session prescription is different: its target weight becomes the editable default value for each new set so the displayed number and saved result cannot diverge.

Meaningful cardio timers have two states: a prescribed countdown and an optional user-started Keep Going interval. Both use persisted wall-clock timestamps. Stopping the timer or advancing the workout finalizes the measured duration and prefills the matching cardio completion record; users may still correct it or add iFIT/Strava metrics before saving.

Session snapshots should remain stable after completion. Future changes to exercise definitions must not silently rewrite historical workout records. Active workout state may be resumed, but completed history is append-oriented. A narrowly scoped correction may update an affected set only after the user confirms it, only when the exact prior value is supported by captured session evidence, and only with correction metadata retained on the set and session; unknown values must never be guessed.

New strength snapshots use stable IDs from `exercise-identity.js`; display-name changes and aliases must not change historical identity. Prescriptions and actual performance are separate structures. Actual sets remain discrete and retain repetitions, weight, unit, completion state, and observed timestamps. Unknown active time, rest time, or set duration is stored as `null`, never inferred as fact. Legacy snapshots remain readable and are not rewritten.

Workout navigation and scroll-state rules live in `workout-navigation.js`. The UI captures position before leaving a workout and restores it after returning; only an intentional next-exercise action requests smooth scrolling to the top.

## Scheduling

Scheduling represents training intent separately from execution:

- `plannedDate` records the original program date and is immutable.
- `scheduledDate` records when the session is currently expected to occur.
- `status` records scheduled, in-progress, completed, missed, rescheduled, or rest-day state.
- `reason` records optional recovery context such as travel, illness, or competing priorities.

Recovery operations move `scheduledDate` values while preserving `plannedDate`, workout order, completed sessions, and protected rest days. Scheduling rules should remain deterministic and independently testable as the codebase evolves.

Starting a recovered workout does not mutate the schedule. It creates a normal Workout Engine session linked to the missed schedule entry. Completion records `completedDate` while retaining `actualCompletionDate` as a compatibility alias; any shift of today and future workouts occurs only after the user explicitly chooses the replacement option.

Starting a future workout early links the active session to the explicitly selected future schedule entry rather than re-resolving today’s entry. A selected session remains authoritative on the pre-workout landing screen even while `step` is zero; workout progress is not required merely to preserve that selection. Dismissing a Home coach recommendation adds `coachDismissedAt` and `coachDisposition` metadata to the missed session; it does not change `status`, `plannedDate`, `scheduledDate`, or later workouts, and the missed session remains recoverable from Calendar.

Calendar rescheduling delegates to the pure scheduling module. Moving into an occupied training date shifts later incomplete sessions in order; completed dates and protected rest dates are treated as unavailable. Moving into an open date does not shift unrelated sessions.

Pure recovery and date-shifting rules live in `scheduling.js`. UI code supplies the current session collection and persists the result; the scheduling module does not access the DOM or `localStorage`. This boundary allows deterministic Node.js regression tests without changing the versioned storage model.

## Calendar

The Calendar is a projection of scheduled sessions, not a separate source of truth. It groups sessions by `scheduledDate` and renders status and workout type independently. Every date remains interactive, including empty dates and rest days.

Calendar actions delegate changes to scheduling rules. Calendar UI code should never directly invent or reorder program state.

The existing Calendar Workout Details modal is the single entry point for past-session recovery actions. It renders Start Workout and Reschedule directly for incomplete past sessions rather than opening a second details modal.

A fresh application launch initializes the Calendar viewport to the device's current local month. Incomplete sessions scheduled for today can start or resume through the same Workout Engine entry point; only sessions scheduled before today are classified as recovered workouts.

## Progress Tracking

Progress combines immutable workout history, body check-ins, exercise records, adherence, recovery indicators, and aggregate session counts. Calculated metrics should be derived from saved facts whenever possible rather than stored redundantly.

Program Adherence is derived only from resolved completed or missed training sessions on or after the saved adherence baseline. The baseline is additive metadata: resetting the metric must never delete or rewrite earlier Calendar sessions or completed history. Scheduled and in-progress workouts are unresolved and do not lower adherence.

Completed exercise snapshots include their muscle description. Recovery-map rendering may resolve missing muscle descriptions from matching exercise definitions for older compatible history, but it must not rewrite those historical snapshots during rendering.

Changes to formulas must be documented because users may compare results across releases.

Body measurements are append-only observations owned by `body-measurements.js`. Schema 16 stores canonical timestamped records from the `manual`, `wyze-import`, and `apple-health` adapters while retaining legacy `weight`, `waist`, and `measurementHistory` summaries. `wyze-xlsx-import.js` is a pure parse/analyze/apply boundary for locally selected Wyze XLSX exports: it dynamically locates headers, normalizes units and nulls, creates deterministic source identities, produces a user-reviewable import plan, and applies duplicate-safe enrichment only after confirmation. The locally vendored SheetJS reader is cached as part of the offline shell; it does not make a network request at import time. Current weight and waist are derived independently from the newest valid canonical values. Trend displays use a true seven-day rolling weight average plus longer-window weight and waist direction; consumer-scale composition estimates remain supporting trend data. A single weigh-in never changes readiness, exercise progression, or warning state. See `BODY_MEASUREMENTS.md` for the record and HealthKit bridge contract. Cardio history stores one record per meaningful workout block with planned duration separately from actual duration plus optional distance, average heart rate, average pace, incline/resistance, and effort. Prescribed timers are completion cues, not hard stops.

Readiness exposes a separate data-quality projection covering A/B/C exposure, exercise baselines, rated workouts, cardio records, and measurement history. Data quality communicates confidence; it does not unlock a phase or alter the schedule.

## Data Storage

Application state is stored in browser `localStorage` behind a versioned storage boundary. Migrations are ordered, additive, and idempotent. Existing data must be preserved if a migration or parse fails.

Key constraints:

- Never change the production storage key without an explicit migration plan.
- Record fixed-weight equipment as additive inventory metadata so progression can select an owned increment without rewriting completed history or automatically changing an active prescription.
- Never overwrite completed history during routine rendering.
- Treat imports as untrusted input and validate their structure.
- Keep backup export compatibility across releases.
- Store dates in a stable local-date representation when calendar identity matters.
- Derive schedule activation from the device's local calendar date. Backfill boundaries through additive, idempotent migrations; never replace existing session records to repair a boundary.

Optional future synchronization must not make the local store unusable offline.

`backup-restore.js` defines the versioned portable backup envelope independently of UI and storage mutation. Exports include the actual application version, build, current schema, canonical schedule, structured history, active workout state, progression approvals, legacy and canonical body measurements, cardio history, equipment, attachments, and permitted provider state while connected. Imports are untrusted: the entire envelope and supported schema are validated before a merged replacement state is calculated. Only then may `app.js` update the live `road12v5` object. Older compatible backups remain readable; restore must not normalize or broadly rewrite completed history. A Strava deletion tombstone is merged before history and strips deleted provider metadata from exports and overlapping older imports, preventing a backup from resurrecting data after consent is withdrawn.

## External integrations

Provider integrations are downstream consumers of the canonical completed session; they do not own workout truth. Each provider has an independent synchronization record so failures and retries cannot mutate the completed workout.

Strava Phase 1 remains a pure local projection. `strava-strength-payload.js` converts an eligible completed Full Body A/B/C snapshot to preview metadata and Strava JSON 1.0 sets. It owns equipment-aware external-load normalization and never reads storage, renders UI, or performs network work. `strava-sync-state.js` owns canonical provider statuses, allowed transitions, authoritative backend reconciliation, and protective provider-state merging. `exercise-identity.js` owns the bounded documented-token allowlist. `app.js` may display the projection but must not reconstruct or duplicate these rules.

`strava-data-boundary.js` owns the canonical classification of Strava-derived, safe local, and temporary data. Provider profile, scope, token, upload, activity, error, link, and provider-timestamp fields are delete-on-disconnect. Workout exercises, sets, repetitions, local weights, local timestamps, progression data, the local external ID, and the deletion tombstone are Road to 12% data. Provider records are stripped before deterministic coaching or readiness receives history, and they must never enter AI/model/agent contexts.

Phase 2A adds an optional manual-only online boundary. `strava-client.js` creates a per-installation P-256 keypair, signs timestamped nonce-bound requests, and calls only the configured Worker URL. Its private installation key remains in a separate browser storage key and is excluded from normal backups. The Cloudflare Worker in `worker/strava/` verifies installation signatures, owns OAuth and provider requests, persists idempotency records in D1, and encrypts Strava token material again at the application layer with AES-256-GCM. D1 access and the encryption key are separate Cloudflare bindings/secrets.

The Worker keeps the exact browser origin and the post-OAuth application destination separate. `PWA_ORIGIN` contains only the scheme and host used for strict CORS comparison; `PWA_RETURN_URL` contains the full GitHub Pages application path used by successful, denied, and failed OAuth callback redirects. A pathname must never be added to the CORS origin value.

The Worker submits the already-validated Phase 1 file as multipart form data with `data_type=json` and `sport_type=WeightTraining`, then polls Strava's asynchronous upload status. The browser cannot mark a workout `SYNCED` until the Worker returns a confirmed activity ID. Backend `installationId + externalId` state is authoritative after interruption. The browser never retries or resubmits automatically; polling occurs only while an explicitly opened session is in progress.

While consent remains active, backup merge treats confirmed provider state as monotonic: an imported older or poorer record cannot downgrade a local `SYNCED` activity or discard its activity/upload identifiers and timestamps. After confirmed disconnect, the deletion tombstone overrides that rule and strips provider state from both live history and older backups while leaving the completed workout immutable.

Disconnect is backend-confirmed and failure-safe. The Worker first revokes the provider token, then atomically deletes the installation's OAuth states, upload/activity/error rows, athlete/profile fields, scopes, encrypted credentials, and provider timestamps from D1. The browser performs local cleanup only after the Worker confirms deletion. If either provider revocation or D1 deletion fails, no success is reported and local provider state is retained for a safe retry. The installation public-key identity may remain because it is local application security state, not Strava-derived data.

The static PWA remains an untrusted public client. OAuth client secrets, refresh tokens, provider upload submission, and provider status polling belong in the Cloudflare Worker. Browser code may request or display sanitized state but must never embed provider credentials. The Phase 2A pilot config points to the reviewed HTTPS Worker, but the integration remains optional: without a network or connection, workout completion and local preview remain fully available. See `STRAVA_INTEGRATION.md` for the route, credential, privacy, and duplicate contracts.

## Service Worker

The Service Worker separates the small application shell from the larger exercise-media cache. Installation atomically caches only the core shell, so a missing animation cannot block activation of a new app build. After activation, the application requests a bounded, best-effort media warm-up: still posters and exact retained references are fetched before GIFs, with no more than four requests in flight. Media opened earlier is cached on demand. Mutable shell files use a no-store network-first strategy with cached fallback, the Service Worker URL is keyed by build, and versioned HTML entry points prevent Safari from silently retaining an older PWA shell; reviewed media remains cache-first.

During an update, an older versioned media cache remains available as an offline fallback. It is removed only after the current media cache warms with zero failures. `app-meta.js` owns the cache version. Each release that changes cached production files must rotate the cache name and update the `app-meta.js` import query in `sw.js` so installed iOS PWAs receive fresh metadata.

Offline validation must cover first installation, cached relaunch, update activation, missing-network behavior, and poster-to-animation playback after connectivity is removed. The Service Worker must not conceal stale application code indefinitely.

## Future AI modules

AI capabilities should enter through explicit, testable boundaries:

- Recommendation input builder: produces a minimal, structured summary.
- Recommendation engine: returns advice and rationale without mutating state.
- Policy layer: validates that recommendations respect program and safety rules.
- User confirmation layer: applies only approved schedule or progression changes.
- Audit record: stores the recommendation, rationale, and accepted action.

AI modules must be optional, privacy-conscious, and gracefully unavailable offline. Deterministic scheduling and workout completion rules remain authoritative. Strava-derived data is prohibited from recommendation, readiness, analytics, profiling, AI/model input, agent context, training, development, and evaluation; the integration boundary must remove it before any coaching input is built.

The first adaptive-coaching foundation is deterministic and offline. `adaptive-coaching.js` normalizes profile inputs, builds an explainable recommendation from the profile and saved workout feedback, and returns cloned workout definitions with an accepted set cap or cardio target. It never accesses the DOM, storage, Calendar, or scheduling state. The UI stores a recommendation only after explicit acceptance and snapshots it into a newly started session so feedback changes cannot alter an active workout. Recorded limitations disable load-increase recommendations; they are not parsed into medical exercise prescriptions.

## Architectural boundaries

New work should move toward clear modules without large one-release rewrites:

```text
UI screens
   ↓
Workout / Scheduling / Progress services
   ↓
Versioned local storage
   ↓
Service Worker and browser platform
```

Refactoring production code requires dedicated tests and a separate task. Documentation-only work must not alter these runtime boundaries.
