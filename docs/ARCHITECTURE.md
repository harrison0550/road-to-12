# Architecture

## Overview

Road to 12% is a client-only, offline-first PWA. `index.html` loads version metadata, exercise content, workout data, and the production application script. The application renders screens into a single main container and persists state locally. A Service Worker caches the application shell and reviewed media.

The current architecture favors reliability and portability: no application server is required, no account is required, and the installed app remains useful without connectivity.

## Workout Engine

The Workout Engine selects the appropriate program day, resolves exercises against available equipment, starts or resumes a session, tracks sets and timers, and writes a completed snapshot to workout history.

Session snapshots should remain stable after completion. Future changes to exercise definitions must not silently rewrite historical workout records. Active workout state may be resumed, but completed history is append-oriented.

Workout navigation and scroll-state rules live in `workout-navigation.js`. The UI captures position before leaving a workout and restores it after returning; only an intentional next-exercise action requests smooth scrolling to the top.

## Scheduling

Scheduling represents training intent separately from execution:

- `plannedDate` records the original program date and is immutable.
- `scheduledDate` records when the session is currently expected to occur.
- `status` records scheduled, in-progress, completed, missed, rescheduled, or rest-day state.
- `reason` records optional recovery context such as travel, illness, or competing priorities.

Recovery operations move `scheduledDate` values while preserving `plannedDate`, workout order, completed sessions, and protected rest days. Scheduling rules should remain deterministic and independently testable as the codebase evolves.

Pure recovery and date-shifting rules live in `scheduling.js`. UI code supplies the current session collection and persists the result; the scheduling module does not access the DOM or `localStorage`. This boundary allows deterministic Node.js regression tests without changing the versioned storage model.

## Calendar

The Calendar is a projection of scheduled sessions, not a separate source of truth. It groups sessions by `scheduledDate` and renders status and workout type independently. Every date remains interactive, including empty dates and rest days.

Calendar actions delegate changes to scheduling rules. Calendar UI code should never directly invent or reorder program state.

## Progress Tracking

Progress combines immutable workout history, body check-ins, exercise records, adherence, recovery indicators, and aggregate session counts. Calculated metrics should be derived from saved facts whenever possible rather than stored redundantly.

Changes to formulas must be documented because users may compare results across releases.

## Data Storage

Application state is stored in browser `localStorage` behind a versioned storage boundary. Migrations are ordered, additive, and idempotent. Existing data must be preserved if a migration or parse fails.

Key constraints:

- Never change the production storage key without an explicit migration plan.
- Never overwrite completed history during routine rendering.
- Treat imports as untrusted input and validate their structure.
- Keep backup export compatibility across releases.
- Store dates in a stable local-date representation when calendar identity matters.

Optional future synchronization must not make the local store unusable offline.

## Service Worker

The Service Worker precaches the application shell and required exercise media. `app-meta.js` owns the cache version. Each release that changes cached production files must rotate the cache name so installed PWAs receive the update.

Offline validation must cover first installation, cached relaunch, update activation, and missing-network behavior. The Service Worker must not conceal stale application code indefinitely.

## Future AI modules

AI capabilities should enter through explicit, testable boundaries:

- Recommendation input builder: produces a minimal, structured summary.
- Recommendation engine: returns advice and rationale without mutating state.
- Policy layer: validates that recommendations respect program and safety rules.
- User confirmation layer: applies only approved schedule or progression changes.
- Audit record: stores the recommendation, rationale, and accepted action.

AI modules must be optional, privacy-conscious, and gracefully unavailable offline. Deterministic scheduling and workout completion rules remain authoritative.

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
