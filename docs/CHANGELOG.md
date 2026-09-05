# Changelog

All notable changes to Road to 12% are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses Semantic Versioning for public release numbers.

## [Unreleased]

### Added

- Added a narrow first-pilot workflow that can re-approve only the newest eligible tombstoned Full Body session after renewed consent, plus an in-app duplicate-protection check that reuses the confirmed backend record without submitting another Strava upload.
- Added an accessible pre-OAuth Strava disclosure and persistent Strava & Privacy view covering requested scope, data flow, retention, consent withdrawal, deletion, support, monitoring, and non-endorsement.
- Added a canonical Strava data boundary and schema-17 deletion tombstone so confirmed disconnect removes provider metadata without deleting workouts and older backups cannot restore deleted provider records.
- Added an undeployed Strava Phase 2A manual proof-of-concept: Profile connection controls, per-installation signed requests, secure Cloudflare OAuth/token handling, explicit real-activity confirmation, validated Full Body A/B/C structured uploads, polling, duplicate-safe reconciliation, failure/retry states, disconnect, and confirmed activity links.
- Added a Cloudflare Worker and D1 schema that keep Strava provider credentials out of the public PWA, encrypt token material with AES-256-GCM, bind OAuth state to one installation, reject replayed request proofs, and preserve server-side upload/activity identity across browser interruption.

- Added a completely local Strava Phase 1 preview for eligible completed Full Body A/B/C workouts, including validated structured-set JSON, exact public titles, exercise mapping status, warnings, summary totals, and an explicit nothing-sent notice.
- Added pure Strava payload and sync-state modules with equipment-aware Smith, dumbbell, cable, and bodyweight normalization; documented pound-to-kilogram conversion; canonical state transitions; and no OAuth, credential, backend, or network behavior.
- Added an offline Wyze Scale XLSX importer under Progress / Body Measurements with dynamic header discovery, local-time preservation, unit/null normalization, weight-only support, per-reading review, richness-aware duplicate handling, and deterministic re-import enrichment.
- Added dated body-fat and lean-mass reference cards that never copy older composition values into a newer weight-only reading, plus locally bundled SheetJS CE parsing and license notices.
- Added schema-16 timestamped `bodyMeasurements` records covering weight, waist, and consumer-scale composition fields, with validated adapters for manual entry, Wyze exports, and a future Apple Health bridge.
- Added a documented native HealthKit bridge boundary and preserved backup/import support for both canonical and legacy measurement histories.
- Added three technique-first sets of Smith Machine Hip Thrust to future Full Body C sessions, including normal set/rep/weight logging, a 90-second rest timer, last-performance history, the 33 lb Smith-bar calculation, and a new Smith barbell pad Attachment Locker entry.
- Added the approved Smith Machine Hip Thrust animation and pause-state guide showing the bench outside the cage, feet facing into the cage, padded bar at the hip crease, and continuous hand/wrist anatomy; both assets are cached for offline use.
- Added the owned 30 lb kettlebell to My Equipment and schema-15 backup-compatible storage.
- Added a conservative Thursday kettlebell block: two sets of Around the World, three sets of two-hand Swings, and two Suitcase Carry intervals per side without removing Dead Bug, Bird Dog, Side Plank, lower-ab work, or mobility.
- Added three reviewed, locally bundled kettlebell animations and pause-state guides with offline caching.
- Added the owned angled V-bar to Full Body B as two additive sets of V-Bar Triceps Pushdown, plus exact Attachment Locker records for the V-bar and rotating close-grip double-D row handle.
- Added an approved offline V-Bar Triceps Pushdown animation and pause-state guide using one high front-post pulley and a centered cable connection.
- Added reviewed offline animations, pause-state storyboards, coaching cards, and optional technique-only activation sets for Smith Machine Bench Press and Low-Incline Dumbbell Press.
- Added chest and upper-chest engagement feedback with engagement-aware HOLD, coaching-review, and conservative progression rules.
- Added two additive arm accessories: Alternating Dumbbell Curl on Full Body A and Behind-the-Back Single-Arm Cable Curl on Full Body C, without replacing the existing program.
- Added a four-session lower-ab progression to Core + Recovery. Two completed Phase 1 sessions unlock a review-and-accept milestone before Phase 2 can begin; completed exposure is stored independently from calendar time.
- Added five-minute pelvic-floor relaxation and hip-mobility blocks to Tuesday and Saturday, framed as breathing and mobility rather than medical treatment.
- Added 13 approved, locally bundled exercise animations with still pause-state guides and offline caching for every new arm, lower-ab, and pelvic-mobility movement.
- Added schema-14 persistence, backup coverage, and Progress tracking for the lower-ab program milestone.
- Added tappable Workout Preview exercise rows that open a read-only detail page with the approved automatic animation, setup, coaching, target, and most recent recorded performance.
- Completed the active Foundation exercise-media audit: all 47 guided exercise names now resolve to 40 distinct reviewed movement animations, including 34 new Road to 12% animations and six previously approved originals.
- Added reviewed static media for the visible Library-only Stationary Bike Setup, completing media coverage beyond the active workout schedule.
- Added a durable exercise-media manifest covering exact-name mappings, accessibility, retained references, offline caching, and release validation.
- Added versioned Road to 12% backup files containing the real app version, build, data schema, authoritative schedule, complete structured history, active workout state, cardio and measurements, equipment, attachments, progression approvals, and provider metadata already stored with sessions.
- Added session-specific approved prescriptions for the next matching stable exercise ID, with separate base targets and actual sets plus followed, partially followed, overridden, and not-attempted outcomes.

- Added stable exercise identities and export-ready completed strength records with discrete actual sets, prescribed-versus-actual separation, observed timestamps, muscle/equipment context, and dormant Strava sync metadata.
- Added a documented secure Strava Strength Training integration plan; no OAuth connection or upload behavior is enabled yet.
- Added a Keep Going mode after cardio countdowns, with a live total-time counter and automatic actual-duration entry in the workout summary.
- Added separate actual-performance logging and previous-performance comparisons for every meaningful cardio block, including warm-ups and cooldowns that continue beyond their timer.
- Added seven- and thirty-day weight trends, thirty-day waist change, recent strength direction, and scale-fluctuation context.
- Added a readiness data-quality indicator covering A/B/C exposure, exercise baselines, workout ratings, cardio records, and measurement history.
- Added quick exercise-level feedback for reps in reserve, form quality, and discomfort.
- Added concrete next-session prescriptions with explicit user approval and in-workout approved-target guidance.

### Changed

- Advanced the maintenance build to `2026.08.30.3`, schema 18, and cache generation 68 for the explicitly approved one-session Strava pilot. All other deleted historical sessions remain blocked and no automatic or cardio posting is enabled.
- Advanced the maintenance build to `2026.08.30.2` and rotated the offline caches for the Strava compliance remediation.
- Changed Strava disconnect to require backend deletion confirmation after token revocation and an atomic D1 purge of OAuth, connection/profile/token, upload/activity/error, and provider timestamp data before local cleanup.
- Restricted Strava-derived data from coaching, readiness, analytics, AI/model input, and agent contexts; added explicit minimal retention and sanitized rate-limit behavior.
- Completed the deployed Strava compliance gate: live disconnect removed all D1 provider records, the post-disconnect backup retained workouts without provider metadata or activity links, expired OAuth state reached zero, and the deletion tombstone blocked simulated restoration from an older backup. No activity was uploaded.
- Configured the manual-only Strava Phase 2A pilot with a dedicated Cloudflare Worker, D1 database, exact GitHub Pages origin, encrypted provider credentials, verified callback URL, and production browser endpoint. No OAuth connection or live activity upload was performed automatically.
- Advanced the maintenance build to `2026.08.30.1` and rotated the offline caches so installed PWAs receive the reviewed Strava pilot configuration.
- Corrected the canonical Strava exercise mappings, added a typo-blocking supported-token allowlist, and made backup merge preserve confirmed/richer provider sync state instead of allowing an older import to downgrade it.
- Advanced the maintenance build to `2026.08.29.5`, rotated the offline caches, and added an end-to-end browser check for Progress-to-import navigation and native filechooser activation.
- Advanced the maintenance build to `2026.08.29.4`, rotated the offline caches, and changed Wyze selection to a direct native file-input tap target with no programmatic picker activation.
- Advanced the maintenance build to `2026.08.29.3`, rotated the offline caches, and reorganized the long Progress screen into accessible expandable sections while keeping headline metrics and body-measurement actions immediately visible.
- Advanced the maintenance build to `2026.08.29.2`, rotated the offline caches, and extended backup validation for all Wyze measurement aliases and source metadata.
- Advanced the maintenance build to `2026.08.29.1`, rotated the offline caches, derived displayed weight and waist from the newest valid canonical measurements, and changed the seven-day weight metric to a true rolling average.
- Clarified that weight and waist are primary body-composition signals; individual daily scale values and consumer-scale estimates do not alter training progression or trigger fat-loss warnings.
- Advanced the maintenance build to `2026.08.28.1`, rotated the offline shell/media caches, and added a program-revision boundary so an already-active Full Body C session is not changed by the hip-thrust expansion.
- Extended Core + Recovery to approximately 50–60 minutes and positioned kettlebell work after the easy warm-up and before the existing floor-core sequence. First exposure uses only the owned 30 lb bell; overhead and advanced ballistic movements remain deferred.
- Advanced the maintenance build to `2026.08.27.2` and rotated the offline shell/media caches for the kettlebell expansion.
- Corrected the former Smith Bulgarian Split Squat into a no-bench Smith Machine Single-Leg Squat: the athlete faces forward inside the cage, one foot works slightly ahead of the bar path, and the unsupported rear foot hovers behind. The stable exercise identity and legacy name alias remain compatible with completed history.
- Seated Cable Row now names the owned rotating close-grip double-D row handle explicitly. New additive attachment work is revision-gated so it cannot appear inside an older active session.
- Advanced the maintenance build to `2026.08.27.1` and rotated the offline shell/media caches for the approved single-leg-squat correction and cable attachments.
- Recommended strength targets now populate the real weight field rather than placeholder text, so completing an untouched set records the displayed weight. Progress offers an explicit evidence-based review for affected history, and Smith-machine selected volume includes the known 33 lb bar.
- Advanced the maintenance build to `2026.08.26.1` and rotated the offline shell/media caches for the approved chest-program update.
- Future Full Body A sessions now use Smith Machine Bench Press, and future Full Body B sessions use Low-Incline Dumbbell Press. Full Body C and all non-chest Foundation work remain unchanged.
- Existing active A/B sessions retain their original press definition; legacy Cable Chest Press and Incline Cable Press identities, media, definitions, and completed history remain intact.
- Advanced the maintenance build to `2026.08.23.1` and rotated the offline shell/media caches for the additive training expansion.
- Reworked the High-to-Low Cable Chop animation to show a front-facing athlete, one high cable travelling across the front of the torso, and a controlled finish beside the opposite knee.
- Advanced the maintenance build to `2026.08.21.2` and rotated the offline caches for the two corrected cable-exercise animations.
- Corrected the Cable Shoulder Press animation so the athlete faces away from the machine and both cables originate from the low pulleys mounted on the cage's two front uprights.
- Advanced the maintenance build to `2026.08.21.1` and rotated the offline caches for the corrected exercise media.
- Advanced the maintenance build to `2026.08.20.6` and rotated the offline caches for interactive exercise details from Workout Preview.
- Advanced the maintenance build to `2026.08.20.5`, rotated the offline caches, and expanded the home-gym dumbbell inventory to 10, 15, 20, and 25 lb pairs.
- Dumbbell progression recommendations now advance through owned fixed pairs only; existing active prescriptions and completed workout history remain unchanged.
- Advanced the maintenance build to `2026.08.20.4`, rotated the offline caches, and established a non-destructive August 20 adherence baseline while preserving earlier Calendar and workout history.
- Program Adherence now uses only resolved completed or missed workouts from the saved baseline forward; a scheduled workout no longer lowers the percentage before its outcome is known.
- Advanced the maintenance build to `2026.08.20.3` and rotated the offline caches for reliable iPhone PWA activation.
- Focused exercise animations now always begin in the playing state and retain a labelled Pause control.
- Mutable app-shell requests bypass Safari's HTTP cache, Service Worker registration is keyed to the app build, and HTML entry points use build queries so installed PWAs cannot silently reuse older JavaScript.
- Advanced the maintenance build to `2026.08.20.2` and rotated the offline caches for the streamlined exercise-animation experience.
- Focused workout and enlarged exercise views now start the approved animation automatically, while Reduce Motion users continue to receive the still storyboard first.
- Exercise screens now show one primary demonstration; older comparison illustrations and repeated source copy remain available through Image Sources & Licenses instead of appearing beneath every workout.
- Advanced the maintenance build to `2026.08.20.1` and rotated the offline caches for the Attachment Locker photo-picker correction.
- Still storyboards remain available as the Pause state and as the motion-free default for users who enable Reduce Motion; enlarged views retain accessible dialog behavior.
- Only exact, non-conflicting reviewed references remain available and credited alongside the new app-created animations; mismatched free-barbell and cable-setup references are excluded.
- Exercise media now uses a separate versioned cache that warms posters before GIFs without blocking a new shell installation, retains the previous media cache on partial failure, and cleans it up only after a complete warm-up.
- Lat Pulldown and Seated Cable Row now use one active pulley and one cable in both their saved setup data and reviewed animation metadata.
- Advanced the maintenance build to `2026.08.15.4`, rotated the offline shell cache to `road12-v13-2-46-shell`, and introduced `road12-v13-2-46-media` for the complete exercise-media set.
- Backup import now validates file identity, format, schema compatibility, history, scheduling, measurements, and persistent-state shapes before replacing any live device state; compatible legacy backups and name-keyed exercise approvals remain readable.
- Approved progression guidance now becomes the visible prescription only for a newly started matching workout, while manual set overrides, existing active sessions, unrelated exercises, completed history, and Foundation A/B/C definitions remain unchanged.

- Active extended-cardio timing now reconciles from persisted wall-clock time after switching iPhone apps or restoring the PWA.
- Progression now holds after missed rep targets and reserves deload guidance for excessive difficulty, form breakdown, or discomfort.

### Added

- A four-phase training-journey foundation with multi-signal Phase 1 readiness explanations, exercise-specific PROGRESS/BUILD/HOLD/DELOAD guidance, planned-versus-actual cardio logs, and append-only measurement history.
- Approved offline two-position animations for Dumbbell Lateral Raise, Dumbbell Floor Press, and Dumbbell Romanian Deadlift, with equipment-specific coaching metadata.
- An eight-minute easy iFIT rowing technique block to Tuesday's existing Cardio + Mobility workout.
- Two-set dumbbell accessories to all three strength days using the available 10 and 15 lb dumbbells, without replacing existing exercises.
- Approved offline animations for Dead Bug and Side Plank from Knees, matching the existing Bird Dog visual style.
- An approved offline Bird Dog animation with a dedicated guided exercise screen and alternating opposite-arm/opposite-leg directions.
- Independent Dumbbells and Kettlebells controls under My Equipment, with dumbbells enabled and kettlebells disabled for the current equipment profile.
- An offline adaptive-coaching foundation with a private on-device training profile, explainable recommendations, explicit acceptance, session-length volume caps, cardio targets, conservative progression guardrails, and backup compatibility.
- A coach-forward Home command center with an accessible weekly status strip, focused workout card, existing adherence/recovery/session metrics, compact next-workout context, and latest check-in summary.
- Home coach recommendations now offer a confirmed “Leave missed & continue plan” action while preserving the Missed Calendar record.
- Offline timer-completion chime with vibration and an accessible completion announcement.
- Previous completed weight guidance on every strength exercise, including Smith working weight and per-stack context.
- Professional project documentation under `/docs`.
- Project context and contributor standards for future development sessions.
- Deterministic recovery scheduling tests covering sequence order, immutable planned dates, completed sessions, and protected rest days.
- Automated regression coverage for workout resume and intentional next-exercise scrolling.
- Automated small-iPhone layout coverage for the Progress Save Check-In control.
- Automated Service Worker smoke coverage for install, update cleanup, cached relaunch, and network fallback.
- Calendar-driven recovery for completing a missed workout through the existing workout engine.
- Recovery history metadata showing the original planned date and actual completion date.
- Workout Recovery rescheduling choices for today, tomorrow, or a user-selected date.
- Offline treadmill posture artwork with a full-screen enlargement and accessible description.
- Offline two-position Hip Hinge artwork showing the standing start and correct hinge posture.
- Offline two-position Incline Cable Press artwork using a cage-style Smith machine with low pulleys on both front posts.
- Offline two-position Cable Hammer Curl artwork using a rope on the low inner front-left pulley of the red Smith cage.
- Offline Arm Circles artwork showing the standing posture and circular arm path.
- Offline two-position Bodyweight Squat artwork showing a tall start and controlled parallel-depth squat.
- Offline two-position Lat Pulldown artwork showing the complete red Smith cage, one high front-post pulley, a center-connected cable, and a safe upper-chest finish.
- Offline two-position illustrations for Hip Flexor Mobility, supported standing Hamstring Mobility, and Chest and Shoulder wall slides.

### Changed

- Advanced the maintenance build to `2026.08.13.3` and replaced the unused whole-workout adaptive plan with a locked, data-collection-first Foundation progression architecture; Full Body A/B/C remains unchanged.
- Advanced the maintenance build to `2026.08.13.2` and rotated the offline shell cache for the approved dumbbell exercise animations.
- Advanced the maintenance build to `2026.08.13.1` and reconciled existing device equipment profiles so the confirmed dumbbells and iFIT rower are enabled and their added exercises appear in previews.
- Advanced the maintenance build to `2026.08.12.1` and rotated the offline shell cache for the additive rower and dumbbell workout update.
- Advanced the maintenance build to `2026.08.05.3` and rotated the offline shell cache for the completed Core + Recovery animation set.
- Advanced the maintenance build to `2026.08.05.2` and rotated the offline shell cache for the Bird Dog visual guide.
- Split the Core Activation Circuit into Dead Bug, Bird Dog, and Side Plank from Knees while preserving its eight-minute total duration.
- Advanced the maintenance build to `2026.08.05.1` and rotated the offline shell cache for guided cardio and recovery preview launches.
- Workout previews now list the actual equipment-safe guided sequence that will launch rather than a separate summary list.
- Advanced the maintenance build to `2026.08.04.10` and rotated the offline shell cache for the equipment-profile update.
- Goblet Squat now explicitly uses one dumbbell and returns to the equipment-safe workout rotation.
- Advanced the maintenance build to `2026.08.04.9` and rotated the offline shell cache for the Home next-workout correction.
- Advanced the maintenance build to `2026.08.04.8` and rotated the offline shell cache for adaptive coaching.
- The muscle recovery map now derives trained groups from saved exercise muscles and falls back to current exercise definitions for compatible older history.
- Smith-machine weight entry now clearly requests total plate weight across both sides and reports the per-side load plus the M1 Pro's 33 lb Smith bar in the working-weight total.
- Bumper plates are now enabled for existing and new installations, reflecting the available 10–45 lb plate range for Smith-machine loading.
- Isolated pure recovery scheduling rules in a testable browser module without changing stored data.
- Calendar cells now announce both workout status and workout type to assistive technology.
- Calendar and recovery dialogs now focus their heading, isolate background controls, support Escape, and return focus to their invoking control.
- Advanced the maintenance build to `2026.07.30.2` and rotated the offline shell cache to deliver the completed High Priority fixes to installed PWAs.
- Missed-workout recovery now defers changes to today’s schedule until the recovered workout is complete and the user confirms a choice.
- Advanced the maintenance build to `2026.07.30.4` and rotated the offline shell cache for the recovered-workout flow.
- Past incomplete Calendar workouts now open complete details with Start Workout, Reschedule, and Close actions.
- Consolidated recovery actions into the existing Workout Details modal, removing the obsolete Close-only/intermediate recovery path.
- Mutable PWA shell files now refresh from the network when available while retaining cached offline fallback.
- Service Worker metadata imports are build-keyed to prevent stale iOS Home Screen updates.
- Rescheduling now avoids completed dates and protected rest days, shifting later incomplete workouts only when the selected date is occupied.
- Advanced the maintenance build to `2026.07.30.7` and rotated the offline shell cache for the corrected Workout Details flow.
- Advanced the maintenance build to `2026.07.30.8` and rotated the offline shell cache for reliable installed-PWA updates.
- Advanced the maintenance build to `2026.07.30.9` and rotated the offline shell cache for the local-date Calendar repair.
- Advanced the maintenance build to `2026.07.30.10` and rotated the offline shell cache for the treadmill visual guide.
- Advanced the maintenance build to `2026.07.30.11` and rotated the offline shell cache for the Hip Hinge visual guide.
- Advanced the maintenance build to `2026.07.30.12` and rotated the offline shell cache for the Incline Cable Press visual guide.
- Advanced the maintenance build to `2026.07.30.13` and rotated the offline shell cache for the corrected Incline Cable Press equipment artwork.
- Advanced the maintenance build to `2026.07.30.14` and rotated the offline shell cache after moving the left Incline Cable Press pulley to the inner front-left upright.
- Advanced the maintenance build to `2026.07.30.15` and rotated the offline shell cache for the Cable Hammer Curl visual guide.
- Advanced the maintenance build to `2026.07.30.16` and rotated the offline shell cache for the corrected Cable Hammer Curl orientation.
- Advanced the maintenance build to `2026.08.03.1` and rotated the offline shell cache for the current-month Calendar and same-day workout-launch fixes.
- Advanced the maintenance build to `2026.08.03.2` and rotated the offline shell cache for the Arm Circles visual guide.
- Advanced the maintenance build to `2026.08.03.3` and rotated the offline shell cache for the Bodyweight Squat visual guide.
- Advanced the maintenance build to `2026.08.03.4` and rotated the offline shell cache for corrected Full Body A workout ordering.
- Advanced the maintenance build to `2026.08.03.5` and rotated the offline shell cache for the Lat Pulldown visual guide.
- Advanced the maintenance build to `2026.08.03.6` and rotated the offline shell cache for the approved full-cage Lat Pulldown artwork.
- Advanced the maintenance build to `2026.08.03.7` and rotated the offline shell cache for the updated equipment availability.
- Advanced the maintenance build to `2026.08.03.8` and rotated the offline shell cache for the clarified Smith-machine weight calculator.
- Advanced the maintenance build to `2026.08.04.1` and rotated the offline shell cache for workout quality-of-life improvements.
- Advanced the maintenance build to `2026.08.04.2` and rotated the offline shell cache for the Progress navigation-state fix.
- Advanced the maintenance build to `2026.08.04.3` and rotated the offline shell cache for the three approved mobility guides.
- Advanced the maintenance build to `2026.08.04.4` and rotated the offline shell cache for background-safe workout timers.
- Advanced the maintenance build to `2026.08.04.5` and rotated the offline shell cache for future-workout launch selection and dismissible coach recommendations.
- Advanced the maintenance build to `2026.08.04.6` and rotated the offline shell cache after preserving the selected early workout through the step-zero launch screen.
- Advanced the maintenance build to `2026.08.04.7` and rotated the offline shell cache for the Concept B visual refresh.
- Refreshed Home with the Training Command Center design while retaining the existing workout, preview, history, coach, scheduling, and bottom-navigation actions.
- Replaced the ambiguous mobility directions with one equipment-specific movement per exercise that matches its illustration.
- Replaced developer-facing missing-media copy with concise coached-instruction guidance.

### Fixed

- Fixed Strava OAuth callbacks returning to the GitHub Pages account root instead of the Road to 12% application. The Worker now keeps exact-origin CORS validation separate from the full `/road-to-12/` success, cancellation, and failure return URL.
- Fixed the Body Measurements importer failing before render because formatting backticks around `.xlsx` prematurely ended its HTML template. The route now renders without console errors, and the real native file input opens a filechooser when activated.
- Fixed installed iPhone PWAs continuing to show the prior Play-first animation screen after a new build was published.
- Fixed Attachment Locker photo controls forcing the iPhone camera; the native image picker can now offer Photo Library, Take Photo, and Files.
- Fixed active guided exercises falling back to missing-media or approximate legacy imagery because their exact display name had no reviewed animation mapping.
- Fixed exercise GIFs beginning motion without an explicit Play/Pause control or a still reduced-motion default.
- Fixed the new dumbbell accessory being filtered from an already-scheduled Friday preview when an older saved equipment preference still marked Dumbbells unavailable.
- Core + Recovery, Cardio + Mobility, and Zone 2 previews now start their implemented guided workouts instead of showing an obsolete preview-only message.
- Home now advances to the next incomplete scheduled workout after today's workout is complete, including older saved sessions whose schedule status was not updated.

- Fixed Start This Workout Early launching today’s workout instead of the selected future workout, including the second handoff through the pre-workout landing screen.
- Fixed workout timers pausing while the iPhone PWA is suspended behind another app; elapsed wall-clock time is now reconciled when Road to 12% returns to the foreground.
- Fixed Home repeating a just-completed workout instead of displaying the next incomplete scheduled session.
- Fixed the muscle recovery map remaining green after a completed workout whose exercise snapshots lacked muscle metadata.
- Fixed the Progress bottom-navigation tab not turning red when selected.
- Added a consistent visible keyboard focus indicator across interactive controls.
- Fixed installed PWAs remaining on an older shell after a newer build was deployed.
- Fixed UTC date conversion causing yesterday's missed workout to be absent from Calendar.
- Corrected the Incline Cable Press illustration so both low pulleys are on the front posts and the Smith cage matches the red equipment.
- Corrected the left Incline Cable Press carriage placement from the outer rear-left upright to the inner front-left upright beside the bench.
- Corrected the Cable Hammer Curl illustration so both positions face the same single front pulley post.
- Fixed Calendar opening on a previously viewed month after launching the app on a new month.
- Added the missing Start Workout action for today's incomplete Calendar workout while preserving normal, non-recovery completion behavior.
- Moved Easy Treadmill Cooldown and Post-Workout Stretch to the end of Full Body A instead of between the Smith and cable blocks.

### Removed

## [13.2.0] - 2026-09-04 (Build 2026.09.04.1)

### Added

- Added the owned compact red GMWD Independent Converging Chest Press Machine to My Equipment and future Full Body B sessions, with three 10–12-rep sets, 2–3 RIR guidance, engagement-aware setup coaching, reviewed offline motion guidance using the correct machine and established Road to 12% trainer, and rep-before-load double progression.
- Added explicit `Weight per side` logging for the GMWD press. Completed sets preserve per-side plate weight and derive total external load as exactly twice that value without assuming machine-arm weight; backup and Strava projections retain the same semantics.

### Changed

- Moved Low-Incline Dumbbell Press to future Full Body C sessions so Foundation chest training is Smith bench on A, GMWD converging press on B, and low-incline dumbbell press on C, while active and completed older revisions remain unchanged.
- Rotated the PWA shell and exercise-media caches so installed apps receive the corrected GMWD poster and looping animation.

## [13.2.0] - 2026-07-30

Current production build: `2026.07.30.1`.

### Added

- Monthly workout Calendar with tappable days.
- Independent workout status and workout type indicators.
- Tappable Calendar legend with plain-language explanations.
- Flexible missed-workout recovery and rescheduling flows.
- Coach recommendations for missed sessions.
- Training streak, program adherence, recovery score, and total-session metrics.
- Separate immutable planned dates and movable scheduled dates.

### Changed

- Bottom navigation now uses Home, Calendar, Progress, Exercises, and Profile.
- Dashboard messaging reflects rescheduled workouts and shifted sessions.
- Service Worker shell cache advanced to `road12-v13-2-shell`.

### Fixed

- Workout scroll position is preserved when returning to an active workout.
- Automatic scrolling occurs only when intentionally advancing exercises.
- Save Check-In stays within the Progress content container on small iPhones.
- Safe-area spacing and page-level overflow behavior were tightened.

### Removed

- Unintended viewport-anchor scrolling after marking a set complete.

Future versions should be inserted above `13.2.0`, beneath `Unreleased`.

[Unreleased]: https://github.com/harrison0550/road-to-12/compare/v13.2.0...HEAD
[13.2.0]: https://github.com/harrison0550/road-to-12/releases/tag/v13.2.0
