# Project Context

Read this file at the beginning of every Codex or engineering session. It is the concise handoff for the current production state. Consult the linked canonical documents before making changes.

## Current production

- Product: Road to 12%
- Version: 13.2.0
- Build: 2026.08.21.2
- Last updated: August 21, 2026
- Service Worker cache: `road12-v13-2-54-shell`
- Exercise media cache: `road12-v13-2-54-media`
- Runtime: static, client-only, offline-first PWA
- Primary storage key: `road12v5`

## Current architecture

- `index.html` is the application shell.
- `app.js` owns screen rendering, workout flow, scheduling, recovery, and progress behavior.
- `scheduling.js` owns pure recovery and date-shifting rules without DOM or storage access.
- `adaptive-coaching.js` owns pure phase-readiness and exercise-progression projections without mutating workout definitions.
- `workout-prescriptions.js` captures an approved target into the next matching session and classifies the completed prescription outcome without mutating Foundation definitions.
- `backup-restore.js` owns versioned backup creation, untrusted-input validation, and compatibility-preserving merge rules.
- `workout-navigation.js` owns testable workout scroll capture, restoration, and intentional advancement behavior.
- `data.js` contains workout definitions.
- `exercise-library.js` contains reviewed exercise education metadata plus animation, pause-state poster, and retained-reference mappings.
- `exercise-identity.js` owns stable exercise IDs and provider mappings independently of display names.
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
- BUG-009: Home repeats a completed workout as Next Workout — resolved in build 2026.08.04.1 and hardened for stale legacy schedule state in build 2026.08.04.9.
- BUG-010: Muscle recovery map remains green after training — resolved in build 2026.08.04.1.
- BUG-011: Progress tab does not show its selected red state — resolved in build 2026.08.04.2.
- BUG-012: Workout timer pauses while another iPhone app is active — resolved in build 2026.08.04.4.
- BUG-013: Starting a future workout preview launches today’s workout — fully resolved in build 2026.08.04.6 after repairing both preview and step-zero landing handoffs.
- BUG-014: Cardio and recovery previews show an obsolete preview-only alert — resolved in build 2026.08.05.1.
- BUG-015: Confirmed dumbbell exercises are absent from a workout preview when an older equipment preference remains disabled — resolved in build 2026.08.13.1.
- BUG-016: Active guided exercises lack an exact movement-animation mapping — resolved in build 2026.08.15.4.
- BUG-017: Exercise GIFs begin moving without an explicit motion control — resolved in build 2026.08.15.4.
- BUG-019: Attachment Locker forces the camera instead of offering Photo Library — resolved in build 2026.08.20.1.
- BUG-020: Exercise guides show a still storyboard first and repeat an older reference illustration beneath the approved animation — resolved in build 2026.08.20.2.
- BUG-021: Installed iPhone PWA remains on stale shell files or returns animations to Play-first mode — resolved in build 2026.08.20.3.

- BUG-022: Development-era incomplete sessions reduce Program Adherence — resolved in build 2026.08.20.4 with a non-destructive August 20 adherence baseline.

See `KNOWN_BUGS.md` before diagnosing or fixing defects.

## Active sprint goals

All High Priority tasks for the current sprint are complete.

Next recommended goals:

1. Improve calendar navigation and filtering without altering schedule truth.
2. Document adherence and recovery-score formulas.
3. Preserve v13.2 behavior while gradually creating clearer module boundaries.
4. Validate prescription-outcome signals across additional real Foundation sessions before using them for automatic recommendations.
5. Re-audit active exercise media when Foundation prescriptions change; keep future-phase media deferred until those workout definitions are approved.

See `CODEX_TASKS.md` for priority and acceptance detail.

## Recent design decisions

- Workout-preview exercise rows are interactive, non-mutating entry points to a full exercise guide. The preview detail reuses the reviewed automatic animation, setup and execution guidance, equipment-specific coaching, prescription summary, and historical performance lookup without creating or changing an active workout. Returning restores the preview list position.
- Program Adherence starts from the saved August 20, 2026 baseline for the current installation. Earlier development-era sessions remain visible in Calendar and history but do not affect the metric. Only resolved completed or missed training sessions on or after the baseline count; an unresolved scheduled workout never lowers adherence.
- The current active Foundation program has complete exact-name media coverage: 47 guided names resolve to 40 distinct movement animations. This audit adds 34 Road to 12% originals and retains six earlier approved originals. Shared warm-up, cooldown, recovery, and alias names may reuse one accurate movement asset while keeping their written prescriptions distinct. The visible Library-only Stationary Bike Setup uses a reviewed static setup guide.
- Exercise animations always run automatically in focused workout and enlarged exercise views, with a labelled Pause control that returns to the still storyboard. Older official or licensed references remain recorded and credited in Image Sources & Licenses, but are not repeated beneath the approved Road to 12% demonstration.
- The Service Worker installs the core shell independently, then warms a separate media cache poster-first with bounded concurrency. Older media remains an offline fallback until the new cache completes without failures. See `EXERCISE_MEDIA_AUDIT.md` for the current manifest and validation procedure.

- Backup format v2 records the actual app version, build, storage schema, authoritative schedule, active session, structured history, cardio, measurements, equipment, approved prescriptions, and provider metadata. Import validates the complete envelope before mutating live state and remains compatible with older name-keyed progression records.
- An approved exercise target is captured only when the next session containing that stable exercise ID begins. Base Foundation prescriptions remain separate and immutable; actual sets remain user-editable, and completion records followed, partially followed, overridden, or not attempted.

- Strava Strength Training is planned, not connected. New completed strength sessions preserve stable exercise IDs, prescribed-versus-actual data, discrete set results, timestamps, muscles/equipment, and provider sync metadata. OAuth secrets and tokens must live behind a secure backend/serverless boundary; local workout completion remains authoritative and offline.

- Timed cardio uses a prescribed countdown followed by an explicit Keep Going mode. Extended time is derived from wall-clock timestamps, survives iOS suspension, and automatically prefills the matching cardio block at workout completion.
- Each meaningful cardio block stores its own planned and actual duration, distance, average heart rate, average pace, incline/resistance, and effort. Prescribed timers are cues rather than hard stops, and prior matching performance is shown for comparison.
- Progress shows seven- and thirty-day weight direction, thirty-day waist direction, and recent strength-volume direction. Readiness reports evidence quality separately from readiness so sparse data cannot look authoritative.
- Strength exercises collect optional reps-in-reserve, form-quality, and discomfort feedback. Progress then proposes a concrete next-session prescription that the user must approve; approval remains advisory and never rewrites workout definitions or completed history.

- Foundation A/B/C is Phase 1 of a four-phase journey: Foundation, Build, Upper / Lower, and Hypertrophy / Definition. Readiness is multi-signal, capped while validation is immature, and cannot advance the phase or replace the schedule without an explicit milestone review and acceptance.
- Exercise guidance is PROGRESS, BUILD, HOLD, or DELOAD per movement using actual completed sets, reps, weight and feedback. Whole-workout ratings are supporting evidence only.
- Cardio stores planned and actual duration separately with optional distance, average heart rate, pace/incline, effort and notes. Body check-ins append immutable measurement observations rather than overwriting trend history.
- Dumbbell Lateral Raise, Dumbbell Floor Press, and Dumbbell Romanian Deadlift use user-approved, locally stored two-position animations in the established red-shirt instructional style; the written coaching remains authoritative.
- Weekly equipment integration is additive: Tuesday includes an easy eight-minute iFIT rowing technique block, and each strength day gains one two-set dumbbell accessory using the available 10, 15, 20, or 25 lb pairs. Existing movements and Saturday's flexible Zone 2 modality choice remain intact.
- Core + Recovery presents Dead Bug, Bird Dog, and Side Plank from Knees as separate guided steps; all three use approved, stylistically consistent original animations bundled for offline use, while written coaching remains authoritative.
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
- Dumbbells are available and enabled independently from kettlebells; fixed pairs of 10, 15, 20, and 25 lb are recorded, while kettlebells remain unavailable. Goblet Squat may therefore use one dumbbell in the equipment-safe rotation. Progression may recommend only the next owned dumbbell size and still requires explicit approval.
- Smith set entries store total added plate weight across both sides for backward compatibility; the calculator divides that load per side and adds the official 33 lb M1 Pro Smith bar to show working weight.
- Timer completion uses a locally generated Web Audio chime, vibration where supported, and an accessible status announcement; it does not require a network asset.
- Active timers use an absolute wall-clock finish time and reconcile on foreground restoration so iOS suspension does not pause elapsed time; completion audio may be delayed until the PWA resumes because of platform restrictions.
- Previous-weight guidance is derived from the most recent completed set for the same exercise and never overwrites the current set entry.
- Home's Next Workout card follows the next incomplete scheduled session; the recovery map derives recent muscle groups from immutable workout history with a legacy name-based fallback.
- Mobility education uses one clearly named movement per exercise; the approved Hip Flexor, supported standing Hamstring, and Chest and Shoulder wall-slide illustrations are cached for offline workouts and match their written steps.
- Future workout previews carry the selected schedule entry through the step-zero landing screen and into the existing Workout Engine; Home coach recommendations can be dismissed with an additive disposition while the workout remains Missed and recoverable from Calendar.
- Every non-check-in program preview uses the actual equipment-safe workout sequence and can launch it through the existing Workout Engine; Sunday continues to route to Progress.
- Home uses the approved Concept B “Training Command Center” language: compact current-week status, one dominant workout action, coach context, existing adherence/recovery/session metrics, and a restrained red/amber/green hierarchy. No wearable or invented health metrics are displayed.

## Important implementation constraints

- Progression analysis is on-device and advisory. Phase readiness and exercise guidance never mutate planned dates, rest days, completed history, or current Foundation definitions.
- Backup restore must validate fully before mutating `road12v5`; malformed or newer-schema files must leave existing device data untouched.
- Stable exercise IDs own new prescription relationships, with a read-only display-name fallback for legacy approvals. Do not broadly rewrite historical records.

- Preserve existing workout history and `road12v5` compatibility.
- Migrations must be additive, ordered, and idempotent.
- Equipment migration v4 enables the newly available bumper plates without changing completed workout snapshots.
- Equipment migration v6 separates dumbbells from kettlebells, enables the user's dumbbells, and leaves kettlebells disabled without changing completed workout snapshots.
- Equipment migration v7 reconciles the confirmed iFIT rower and dumbbell availability for existing device profiles so additive exercises are not filtered from previews; completed history remains unchanged.
- Migration v8 initializes the locked Foundation phase, measurement history and cardio history, and retires the unused accepted whole-workout adaptive plan without altering completed sessions.
- Migration v9 initializes active exercise feedback and approved next-session prescriptions without altering completed sessions.
- Migration v10 initializes resumable active cardio-timer state without altering completed sessions or prior cardio history.
- Do not overwrite `plannedDate`.
- Do not shift rest days or reorder completed sessions.
- Do not make network access a requirement for core workouts.
- Rotate the Service Worker cache for every release that changes cached files.
- Keep iPhone safe areas, 320px layouts, and standalone PWA behavior working.
- Do not rely on color alone for meaning.
- Use reviewed, licensed, or official exercise media only.
- Preserve the animation-first focused exercise experience, explicit Pause/Play controls, meaningful alternative text, centralized source attribution, and offline cache coverage.
- Do not create or map speculative Phase 2–4 exercise assets until the corresponding workout definitions and transition experience are approved.
- Avoid broad production refactors without dedicated tests and an approved task.

## Session startup checklist

1. Read every file in `/docs`.
2. Read `CONTRIBUTING.md`.
3. Confirm the current branch and working-tree state.
4. Verify version metadata in `app-meta.js`.
5. Identify the relevant roadmap item, task, bug, architecture boundary, and UI rule.
6. Preserve unrelated user changes.
7. Update this file when a release, architecture decision, active sprint, or important constraint changes.
