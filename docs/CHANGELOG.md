# Changelog

All notable changes to Road to 12% are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses Semantic Versioning for public release numbers.

## [Unreleased]

### Added

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

### Changed

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
- Replaced developer-facing missing-media copy with concise coached-instruction guidance.

### Fixed

- Added a consistent visible keyboard focus indicator across interactive controls.
- Fixed installed PWAs remaining on an older shell after a newer build was deployed.
- Fixed UTC date conversion causing yesterday's missed workout to be absent from Calendar.
- Corrected the Incline Cable Press illustration so both low pulleys are on the front posts and the Smith cage matches the red equipment.
- Corrected the left Incline Cable Press carriage placement from the outer rear-left upright to the inner front-left upright beside the bench.

### Removed

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
