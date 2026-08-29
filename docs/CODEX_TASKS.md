# Codex Sprint Backlog

This file contains implementation-ready work. Move completed user-visible work to `CHANGELOG.md`; retain defect history in `KNOWN_BUGS.md`.

## High priority

- [ ] Validate Foundation readiness weighting against real A/B/C, recovery, cardio, and measurement history before enabling advancement.
- [ ] Design the Phase 2 Build plan and explicit milestone review/acceptance flow without activating it.

- [x] Add an offline adaptive training profile with explainable, confirm-before-apply volume, cardio, and progression recommendations.
- [x] Add deterministic tests for recovery sequence shifting.
- [x] Test that rest days remain fixed during every rescheduling mode.
- [x] Add regression coverage for BUG-001 workout scroll restoration.
- [x] Add regression coverage for BUG-002 small-iPhone check-in layout.
- [x] Add offline install, update, and relaunch smoke tests.
- [x] Audit Calendar and recovery dialogs with VoiceOver.
- [x] Audit every active Foundation exercise and visible Exercise Library entry for exact, accessible, offline-capable media.

## Medium priority

- [ ] Add calendar filters for status and workout type.
- [ ] Improve calendar navigation for jumping to Today.
- [ ] Document adherence and recovery-score formulas for users.
- [x] Add structured validation for imported backup data.
- [ ] Review coach recommendations for stale missed sessions.
- [ ] Consolidate duplicated legacy styling where tests permit.

## Low priority

- [ ] Add exercise search.
- [ ] Add exercise category filters.
- [ ] Add an agenda-style calendar option.
- [ ] Improve empty states for historical calendar dates.
- [ ] Add printable or exportable progress summaries.

## Parking lot

- [x] Establish stable exercise identities and export-ready discrete strength-set history.
- [ ] Build a secure Strava OAuth/backend boundary; never place provider secrets or refresh tokens in the PWA.
- [ ] Convert completed strength sessions to Strava structured JSON, poll asynchronous uploads, and enforce idempotency.
- [ ] Design explicit iFIT/Strava cardio source selection and duplicate protection.
- [x] Define a progressive-overload recommendation data contract.
- [ ] Research privacy-preserving optional synchronization.
- [ ] Research Apple Health integration requirements.
- [ ] Research wearable and heart-rate data sources.
- [ ] Define nutrition feature boundaries and safety language.
- [ ] Create and approve Phase 2–4 exercise media only after the corresponding workout definitions exist.
- [ ] Avoid re-downloading unchanged exercise media on cache rotations by introducing content-hashed or shared immutable media caching.

## Future task template

Copy this block for new work:

```markdown
### TASK-000 — Short title

- Priority:
- Target release:
- Owner:
- Status:
- Problem:
- Acceptance criteria:
  - [ ]
- Architecture notes:
- UI notes:
- Test plan:
- Dependencies:
```

## Completed this sprint

- [x] Repair the installed-iPhone Wyze XLSX file picker and compact the long Progress screen into accessible state-preserving disclosures without removing metrics, controls, or history.
- [x] Add a local-first Wyze Scale XLSX importer with dynamic header detection, unit-safe nullable parsing, review-before-confirmation, ten-minute richness-aware deduplication, deterministic re-import safety, exact-record enrichment, current-value summaries, offline packaging, and backup compatibility.
- [x] Add schema-16 canonical body measurements, legacy-compatible manual check-ins and backups, newest-value summaries, a seven-day rolling weight average, source adapters, and a documented native HealthKit bridge boundary without allowing daily scale values to affect training progression.
- [x] Add the approved Smith Machine Hip Thrust to future Full Body C sessions with the owned bar pad, outside-bench setup, full strength tracking, revision-safe activation, reviewed offline animation, and regression coverage.
- [x] Record the owned 30 lb kettlebell and add conservative swings, around-the-worlds, and suitcase carries to Thursday without removing existing core work, including reviewed offline animations and storage compatibility.
- [x] Correct the Smith single-leg squat to the approved forward-facing no-bench form, add the owned V-bar as additive Full Body B triceps work, and record the rotating close-grip row handle without disrupting older active sessions or history.
- [x] Save displayed recommended weights without requiring re-entry, add an evidence-based historical repair review, and correct Smith-machine working-volume totals.
- [x] Replace future Foundation A/B chest presses with Smith Machine Bench Press and Low-Incline Dumbbell Press, preserve active and completed legacy sessions, add approved offline motion guides, and gate progression on technique, RIR, comfort, and target-muscle engagement.

- [x] Add the approved biceps accessories, four-session lower-ab progression with explicit Phase 2 acceptance, and twice-weekly pelvic-floor relaxation/mobility sequence, including 13 offline animations and schema-14 tracking.
- [x] Open a read-only, animation-first exercise guide with setup and previous performance when an exercise is selected from Workout Preview.
- [x] Audit every active guided exercise name and deliver 47-of-47 animation coverage with automatic focused playback, explicit Pause/Play controls, centralized retained-reference attribution, offline caching, and automated validation.
- [x] Modernize backup/restore with real release metadata, complete schedule and training state, pre-mutation validation, legacy compatibility, and realistic round-trip tests.
- [x] Apply explicitly approved progression targets to the next matching exercise session, keep base and actual data separate, and record the completed target outcome.

- [x] Continue cardio beyond its prescribed countdown and automatically log the measured total duration.
- [x] Add flexible per-block cardio results, body-composition trend context, and a readiness data-quality indicator.
- [x] Add reps-in-reserve, form, and discomfort feedback plus concrete next-session prescriptions that require approval.
- [x] Replace the unused whole-workout adaptive plan with locked phase readiness, exercise-specific guidance, actual cardio logging, and append-only body measurements while preserving Foundation A/B/C.
- [x] Add the three approved dumbbell exercise animations with offline caching and reviewed-media metadata.
- [x] Add conservative iFIT rowing practice and two-set dumbbell accessories using the available 10/15/20/25 lb pairs without removing existing workout content.
- [x] Implement the approved Concept B Training Command Center visual refresh for Home using only existing application data and actions.
- [x] Launch the explicitly selected future workout from Start This Workout Early and allow missed-workout coach recommendations to be dismissed without changing the schedule.
- [x] Keep workout timers accurate while the iPhone PWA is suspended behind another app.
- [x] Add approved offline illustrations and matching single-movement instructions for all three Tuesday mobility exercises.
- [x] Add an offline timer-completion sound and accessible completion announcement.
- [x] Show the most recent completed weight during each strength exercise.
- [x] Select the next incomplete scheduled session on Home after workout completion.
- [x] Derive the muscle recovery map from completed workout history with legacy fallback coverage.
- [x] Add an offline red-cage Lat Pulldown illustration with a safe upper-chest finish.
- [x] Keep Full Body A cooldown and stretching exercises at the end of the workout.
- [x] Add an offline two-position Bodyweight Squat posture illustration.
- [x] Add an offline Arm Circles posture and motion illustration.
- [x] Open Calendar on the current month at app launch and allow today's workout to start from its details.
- [x] Correct the Cable Hammer Curl start and finish positions to face one front pulley post.
- [x] Add an offline Cable Hammer Curl illustration on the red Smith cage.
- [x] Move the Incline Cable Press left carriage to the inner front-left upright.
- [x] Correct the Incline Cable Press pulley placement and red Smith cage finish.
- [x] Add an offline cage-style Smith machine Incline Cable Press illustration.
- [x] Add an offline two-position Hip Hinge posture illustration.
- [x] Add an offline treadmill posture illustration and polish the reviewed-media fallback.
- [x] Repair local-date schedule activation so yesterday's missed workout remains visible and recoverable.
- [x] Complete yesterday’s missed workout today without changing today’s schedule before completion.
- [x] Add Calendar recovery rescheduling with completed-workout and rest-day collision protection.
- [x] Add deterministic recovery, sequence, immutability, and rest-day tests.
- [x] Add BUG-001 workout scroll restoration regression tests.
- [x] Add BUG-002 responsive Save Check-In layout regression tests.
- [x] Add Service Worker install, update, cache, and offline relaunch smoke tests.
- [x] Audit and test Calendar names, recovery dialog focus, dismissal, and focus return.
- [x] Establish the `/docs` documentation system.
- [x] Record architecture, UI, contribution, and release standards.
- [x] Add `PROJECT_CONTEXT.md` as the current project handoff.
