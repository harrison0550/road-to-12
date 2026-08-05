# Project Context

Read this file at the beginning of every Codex or engineering session. It is the concise handoff for the current production state. Consult the linked canonical documents before making changes.

## Current production

- Product: Road to 12%
- Version: 13.2.0
- Build: 2026.08.04.8
- Last updated: August 4, 2026
- Service Worker cache: `road12-v13-2-31-shell`
- Runtime: static, client-only, offline-first PWA
- Primary storage key: `road12v5`

## Current architecture

- `index.html` is the application shell.
- `app.js` owns screen rendering, workout flow, scheduling, recovery, and progress behavior.
- `scheduling.js` owns pure recovery and date-shifting rules without DOM or storage access.
- `adaptive-coaching.js` owns pure profile normalization, explainable recommendation rules, and non-mutating workout adaptation.
- `workout-navigation.js` owns testable workout scroll capture, restoration, and intentional advancement behavior.
- `data.js` contains workout definitions.
- `exercise-library.js` contains reviewed exercise education metadata.
- `app.css` contains the current responsive design system.
- `app-meta.js` is the single source for About/version and cache metadata.
- `localStorage` holds versioned device-local state and completed history.
- `sw.js` provides application-shell and exercise-media caching.

See `ARCHITECTURE.md` for boundaries and constraints.

## Outstanding bugs

No confirmed active production bugs are documented.

Historical regressions requiring automated coverage:

- BUG-001: Workout page scroll jumps — resolved in 13.2.0.
- BUG-002: Save Check-In button exceeds screen width — resolved in 13.2.0.
- BUG-003: Past workout opens Close-only details — resolved in build 2026.07.30.7.
- BUG-004: Installed PWA remains on an older shell — resolved in build 2026.07.30.8.

- BUG-005: UTC activation date hides yesterday's missed workout — resolved in build 2026.07.30.9.

- BUG-006: Calendar retains the previous month on a later app launch — resolved in build 2026.08.03.1.
- BUG-007: Today's scheduled Calendar workout has no Start action — resolved in build 2026.08.03.1.
- BUG-008: Full Body A cooldowns appear in the middle of the workout — resolved in build 2026.08.03.4.
- BUG-009: Home repeats a completed workout as Next Workout — resolved in build 2026.08.04.1.
- BUG-010: Muscle recovery map remains green after training — resolved in build 2026.08.04.1.
- BUG-011: Progress tab does not show its selected red state — resolved in build 2026.08.04.2.
- BUG-012: Workout timer pauses while another iPhone app is active — resolved in build 2026.08.04.4.
- BUG-013: Starting a future workout preview launches today’s workout — fully resolved in build 2026.08.04.6 after repairing both preview and step-zero landing handoffs.

See `KNOWN_BUGS.md` before diagnosing or fixing defects.

## Active sprint goals

All High Priority tasks for the current sprint are complete.

Next recommended goals:

1. Improve calendar navigation and filtering without altering schedule truth.
2. Document adherence and recovery-score formulas.
3. Add structured validation for imported backup data.
4. Preserve v13.2 behavior while gradually creating clearer module boundaries.

See `CODEX_TASKS.md` for priority and acceptance detail.

## Recent design decisions

- The five primary destinations are Home, Calendar, Progress, Exercises, and Profile.
- Calendar status and workout type are independent and never color-only.
- Calendar cells announce date, status, and workout type to assistive technology.
- Recovery dialogs use labelled headings, modal background isolation, Escape dismissal, and focus return.
- The Calendar is a projection of scheduling state, not its own data source.
- `plannedDate` is immutable; only `scheduledDate` moves.
- Rest days remain protected when workouts shift.
- Recovery recommendations explain impact and require an explicit user action.
- Starting a missed workout does not alter today’s schedule; replacement shifting occurs only after completion and explicit confirmation.
- Recovered history records the immutable planned date separately from the actual completion date.
- Past incomplete Calendar sessions offer immediate start or explicit rescheduling to today, tomorrow, or a chosen available date.
- Recovery actions are rendered directly by the existing Calendar Workout Details modal; there is no separate recovery-details modal.
- Mutable shell files use network-first refresh with cached offline fallback, and Service Worker metadata imports carry the current build query to prevent stale iOS updates.
- Rescheduling inserts into an occupied training date by shifting later incomplete sessions around completed workouts and protected rest days.
- Schedule activation uses local calendar dates and backfills yesterday without replacing existing sessions or earlier history.
- A fresh app launch opens Calendar on the device's current local month; deliberate month navigation remains intact during that app session.
- Today's incomplete Calendar session starts or resumes through the existing Workout Engine and is not marked as a recovered workout.
- Traditional streak emphasis was replaced with adherence, recovery, and total-session context.
- Workout scroll is restored only when resuming; intentional next-exercise navigation may scroll to the top.
- Cooldown exercises always sort after all working blocks in every strength workout.
- Primary buttons are full-width inside their content container.
- App-created exercise illustrations are identified as posture illustrations; written setup and movement cues remain authoritative.
- Exercise artwork is previewed for user approval before it replaces an application asset; the approved Lat Pulldown guide shows the full cage with one center-connected cable on the facing front post.
- Olympic bumper plates from 10–45 lb are available and enabled; existing Smith-machine squat, hinge, split-squat, and calf-raise programming may use progressive added plate weight.
- Smith set entries store total added plate weight across both sides for backward compatibility; the calculator divides that load per side and adds the official 33 lb M1 Pro Smith bar to show working weight.
- Timer completion uses a locally generated Web Audio chime, vibration where supported, and an accessible status announcement; it does not require a network asset.
- Active timers use an absolute wall-clock finish time and reconcile on foreground restoration so iOS suspension does not pause elapsed time; completion audio may be delayed until the PWA resumes because of platform restrictions.
- Previous-weight guidance is derived from the most recent completed set for the same exercise and never overwrites the current set entry.
- Home's Next Workout card follows the next incomplete scheduled session; the recovery map derives recent muscle groups from immutable workout history with a legacy name-based fallback.
- Mobility education uses one clearly named movement per exercise; the approved Hip Flexor, supported standing Hamstring, and Chest and Shoulder wall-slide illustrations are cached for offline workouts and match their written steps.
- Future workout previews carry the selected schedule entry through the step-zero landing screen and into the existing Workout Engine; Home coach recommendations can be dismissed with an additive disposition while the workout remains Missed and recoverable from Calendar.
- Home uses the approved Concept B “Training Command Center” language: compact current-week status, one dominant workout action, coach context, existing adherence/recovery/session metrics, and a restrained red/amber/green hierarchy. No wearable or invented health metrics are displayed.

## Important implementation constraints

- Adaptive coaching is on-device and confirmation-based. Age supplies safety context, experience and available time shape set caps, goals shape cardio emphasis, and recent ratings/recovery govern progression versus holding. Weight remains a progress trend, not a lifting-load formula. Accepted plans are snapshotted into new sessions and never mutate planned dates, rest days, or completed history.

- Preserve existing workout history and `road12v5` compatibility.
- Migrations must be additive, ordered, and idempotent.
- Equipment migration v4 enables the newly available bumper plates without changing completed workout snapshots.
- Do not overwrite `plannedDate`.
- Do not shift rest days or reorder completed sessions.
- Do not make network access a requirement for core workouts.
- Rotate the Service Worker cache for every release that changes cached files.
- Keep iPhone safe areas, 320px layouts, and standalone PWA behavior working.
- Do not rely on color alone for meaning.
- Use reviewed, licensed, or official exercise media only.
- Avoid broad production refactors without dedicated tests and an approved task.

## Session startup checklist

1. Read every file in `/docs`.
2. Read `CONTRIBUTING.md`.
3. Confirm the current branch and working-tree state.
4. Verify version metadata in `app-meta.js`.
5. Identify the relevant roadmap item, task, bug, architecture boundary, and UI rule.
6. Preserve unrelated user changes.
7. Update this file when a release, architecture decision, active sprint, or important constraint changes.
