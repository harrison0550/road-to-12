# Known Bugs

Use this file as the durable defect tracker. Do not delete resolved records; update their status and add regression coverage.

## Active

No confirmed production behavior defects are currently documented.

### RISK-001 — Public redistribution permission is not recorded for RitFit crops

- Status: Open release checkpoint
- Severity: Medium
- Area: Exercise Media / Distribution
- Report: The repository contains user-supplied RitFit poster crops with attribution and a personal-app use note, but no recorded grant of public redistribution permission.
- Required before public redistribution: Record explicit permission, replace the crops with app-original exact references or link-only citations, or keep the affected source assets private.
- Tracking document: `docs/EXERCISE_MEDIA_AUDIT.md`

## Resolved

### BUG-001 — Workout page scroll jumps

- Status: Resolved in v13.2.0
- Severity: High
- Area: Workout
- Report: Returning to a workout caused the page to jump upward unexpectedly.
- Resolution: Removed unintended viewport-anchor correction and restore the saved position only when resuming the same exercise. Intentional next-exercise navigation starts at the top.
- Regression test: `scripts/test-workout-scroll.js`

### BUG-002 — Save Check-In exceeds screen width

- Status: Resolved in v13.2.0
- Severity: High
- Area: Progress
- Report: The Save Check-In button could extend beyond the content width on smaller iPhones.
- Resolution: The button now spans the full grid container with safe, constrained input sizing.
- Regression test: `scripts/test-responsive-layout.js`

### BUG-003 — Past workout opens Close-only details

- Status: Resolved in v13.2.0 maintenance build 2026.07.30.7
- Severity: High
- Area: Calendar / Workout Recovery
- Report: A past incomplete workout could open the legacy Workout Details modal without Start Workout or Reschedule actions.
- Resolution: The existing Calendar Workout Details renderer now includes recovery metadata and actions directly; the separate recovery-details modal path was removed.
- Regression test: `scripts/test-recovered-workout-flow.js`

### BUG-004 — Installed PWA does not promptly receive a new build

- Status: Resolved in v13.2.0 maintenance build 2026.07.30.8
- Severity: High
- Area: Service Worker / Release
- Report: The live site served the corrected build, but an installed iPhone Home Screen app could remain on an older cached shell.
- Resolution: Mutable shell requests now refresh network-first, Service Worker metadata imports are build-keyed, new registrations bypass the HTTP cache, and controller changes trigger one safe reload.
- Regression test: `scripts/test-offline-pwa.js`

### BUG-005 — Yesterday's missed workout is absent from Calendar

- Status: Resolved in v13.2.0 maintenance build 2026.07.30.9
- Severity: High
- Area: Calendar / Data Migration
- Report: On the evening of July 30 in a western UTC offset, Calendar began on July 31 and did not show July 29 as missed.
- Resolution: Schedule activation now uses local calendar identity. An additive, idempotent migration backfills yesterday when the saved activation boundary is missing, today, or in the future, while preserving existing sessions and earlier history.
- Regression test: `scripts/test-scheduling.js`

### BUG-006 — Calendar opens on a previously viewed month

- Status: Resolved in v13.2.0 maintenance build 2026.08.03.1
- Severity: High
- Area: Calendar / Launch State
- Report: Launching the app on August 3 could leave Calendar displaying July because the last browsed month was persisted.
- Resolution: Every fresh application launch initializes the Calendar viewport from the device's current local month while preserving previous/next navigation during the running session.
- Regression test: `scripts/test-calendar-current-workout.js`

### BUG-007 — Today's Calendar workout has no Start action

- Status: Resolved in v13.2.0 maintenance build 2026.08.03.1
- Severity: High
- Area: Calendar / Workout Launch
- Report: Tapping today's scheduled workout displayed details with only a Close button.
- Resolution: Today's incomplete session now exposes Start Workout and launches or resumes the existing Workout Engine without being classified as a recovered workout.
- Regression test: `scripts/test-calendar-current-workout.js`

### BUG-008 — Full Body A cooldowns appear mid-workout

- Status: Resolved in v13.2.0 maintenance build 2026.08.03.4
- Severity: High
- Area: Workout Engine / Exercise Ordering
- Report: Easy Treadmill Cooldown and Post-Workout Stretch appeared after the Smith block but before the cable exercises in Full Body A.
- Resolution: Cooldown exercises now use the final ordering group for every strength workout instead of only Full Body B and C.
- Regression test: `scripts/test-workout-order.js`

### BUG-009 — Home repeats the completed workout

- Status: Resolved in v13.2.0 maintenance build 2026.08.04.1; legacy-state hardening added in build 2026.08.04.9
- Severity: Medium
- Area: Home / Scheduling
- Report: After completing Full Body A, the Next Workout card still displayed Full Body A.
- Resolution: Home now selects the next incomplete scheduled session and previews future sessions without rewriting schedule state. Selection verifies both schedule status and linked workout history so stale saved schedule state cannot repeat a completed workout.
- Regression tests: `scripts/test-workout-qol.js`, `scripts/test-home-workout-selection.js`

### BUG-010 — Muscle recovery map remains green after training

- Status: Resolved in v13.2.0 maintenance build 2026.08.04.1
- Severity: Medium
- Area: Progress / Workout History
- Report: The recovery map showed every muscle as Ready immediately after a completed strength workout.
- Resolution: New history snapshots include muscle metadata, and older snapshots resolve muscles from their saved exercise names without modifying history.
- Regression test: `scripts/test-workout-qol.js`

### BUG-011 — Progress tab does not show its selected state

- Status: Resolved in v13.2.0 maintenance build 2026.08.04.2
- Severity: Low
- Area: Bottom Navigation / Progress
- Report: Tapping Progress opened the screen but left the bottom tab gray instead of red.
- Resolution: Progress now renders through the shared navigation path that applies the active class while continuing to clear a previously opened history detail.
- Regression test: `scripts/test-workout-qol.js`

### BUG-012 — Workout timer pauses while another iPhone app is active

- Status: Resolved in v13.2.0 maintenance build 2026.08.04.4
- Severity: Medium
- Area: Workout Engine / Timer
- Report: Switching from the installed PWA to another app suspended JavaScript callbacks, so a walking or rest timer resumed from the value shown when Road to 12% entered the background.
- Resolution: Active timers now store an absolute finish timestamp, derive remaining time from the device clock, and synchronize on visibility, focus, and page restoration. If the timer expires while suspended, completion is announced once when the PWA resumes.
- Platform limitation: iOS may not permit a Home Screen PWA to play audio while it remains suspended; the existing sound and vibration occur when the app returns if the timer expired in the background.
- Regression test: `scripts/test-background-timer.js`

### BUG-013 — Starting a future preview launches today’s workout

- Status: Resolved in v13.2.0 maintenance build 2026.08.04.6
- Severity: High
- Area: Home / Workout Engine
- Report: Confirming Start This Workout Early from tomorrow’s preview discarded the selected weekday and called the session launcher with its default arguments, restarting today’s workout.
- Resolution: Home now resolves the earliest incomplete schedule entry for the previewed weekday and passes both its plan day and schedule record into the existing Workout Engine. The pre-workout landing screen preserves that selected session at step zero instead of falling back to the current weekday or creating today’s session over it. Today detection now uses the current weekday instead of treating Monday as the only possible today.
- Regression test: `scripts/test-home-workout-selection.js`

### BUG-015 — Confirmed dumbbell exercise is absent from workout preview

- Status: Resolved
- Severity: Medium
- Affected build: `2026.08.12.1`
- Resolved build: `2026.08.13.1`
- Symptom: Friday's preview displays the former 11-step workout without Dumbbell Romanian Deadlift.
- Cause: An older saved equipment preference could keep Dumbbells disabled after the additive workout update, causing the normal equipment resolver to filter the new exercise.
- Regression coverage: `scripts/test-equipment-profile.js` and `scripts/test-weekly-equipment-mix.js` verify the additive v7 equipment reconciliation and the Friday accessory.

### BUG-016 — Active guided exercise has no exact movement animation

- Status: Resolved in v13.2.0 maintenance build 2026.08.15.4
- Severity: Medium
- Area: Workout Engine / Exercise Education
- Report: Several active Foundation strength, cardio, mobility, and recovery names could resolve only to written guidance, an approximate legacy image, or no movement media.
- Resolution: The active program was inventoried by exact guided name. All 47 names now resolve through the canonical exercise library to 40 distinct reviewed, locally bundled animations with still posters; shared aliases reuse only an accurate matching movement.
- Regression test: `scripts/test-exercise-animation-coverage.js`

### BUG-017 — Exercise animation starts without user control

- Status: Resolved in v13.2.0 maintenance build 2026.08.15.4
- Severity: Medium
- Area: Exercise Education / Accessibility
- Report: Animated GIF demonstrations could begin moving as soon as they rendered, without a consistent pause control or motion-free default for reduced-motion users.
- Resolution: Exercise media now renders its still motion poster first and switches to the animated GIF only after an explicit Play action. The same control pauses back to the poster, exposes its state semantically, and is available in the enlarged focus-managed dialog.
- Regression tests: `scripts/test-exercise-imagery.js` and `scripts/test-exercise-animation-coverage.js`

### BUG-018 — Exercise-media download can block a Service Worker update

- Status: Resolved before release in v13.2.0 maintenance build 2026.08.15.4
- Severity: High
- Area: Service Worker / Offline Media
- Report: Atomically installing the complete exercise-media bundle would allow one unavailable file or interrupted 26 MB download to prevent a new app shell from activating.
- Resolution: Core shell installation is independent. A bounded background job warms a separate poster-first media cache, retains the previous media cache after partial failure, and removes old media only after a zero-failure warm-up.
- Regression test: `scripts/test-offline-pwa.js`

### BUG-019 — Attachment Locker forces the camera

- Status: Resolved in v13.2.0 maintenance build 2026.08.20.1
- Severity: Medium
- Area: Profile / Attachment Locker
- Report: Tapping Choose Photo on iPhone opened only the camera and did not allow selecting an existing Photo Library image.
- Resolution: Removed the camera-only `capture="environment"` hint while retaining `accept="image/*"`, allowing iOS to present its native image-source choices.
- Regression test: `scripts/test-equipment-profile.js`

### BUG-020 — Exercise media is repetitive and requires an extra Play action

- Status: Resolved in v13.2.0 maintenance build 2026.08.20.2
- Severity: Medium
- Area: Workout / Exercise Guides
- Report: Focused exercise screens show the still storyboard first, require a separate Play action, and can repeat an older comparison illustration below the approved animation.
- Cause: The first media audit intentionally used poster-first playback and rendered retained references inline on every exercise screen.
- Resolution: Focused views now start the reviewed animation automatically, retain an accessible Pause control and Reduce Motion fallback, and move retained-reference presentation to the centralized Image Sources & Licenses screen.
- Regression test: `scripts/test-exercise-imagery.js`

### BUG-021 — Installed PWA remains on Play-first animation screen

- Status: Resolved in v13.2.0 maintenance build 2026.08.20.3
- Severity: High
- Area: PWA Updates / Exercise Guides
- Report: The published source contained automatic animation playback, but an installed iPhone PWA continued showing the previous Play animation control.
- Cause: Safari could reuse unversioned JavaScript from its HTTP cache during a service-worker transition; an operating-system Reduce Motion preference could also return the new view to Play-first mode.
- Resolution: App-shell entry points and Service Worker registration are keyed by build, mutable shell network requests bypass the HTTP cache, and focused instructional animations always begin in the playing state with Pause available.
- Regression tests: `scripts/test-offline-pwa.js`, `scripts/test-exercise-imagery.js`, and `scripts/validate-foundation.js`

## Bug template

```markdown
### BUG-014 — Cardio and recovery previews do not launch

- Status: Resolved in v13.2.0 maintenance build 2026.08.05.1
- Severity: High
- Area: Workout Preview / Workout Engine
- Report: Core + Recovery displayed a Start Early button but only showed an alert saying its guided timer flow would be added later, even though the guided workout already existed.
- Resolution: Every non-check-in preview now lists the actual equipment-safe workout and launches it through the existing Workout Engine. Sunday check-in continues to open Progress.
- Regression test: `scripts/test-guided-preview-launch.js`

### BUG-000 — Short description

- Status: Reported | Confirmed | In progress | Resolved
- Severity: Critical | High | Medium | Low
- Area:
- First observed:
- Environment:
- Reproduction:
  1.
- Expected:
- Actual:
- Workaround:
- Resolution:
- Regression test:
```
