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

### Changed

- Isolated pure recovery scheduling rules in a testable browser module without changing stored data.
- Calendar cells now announce both workout status and workout type to assistive technology.
- Calendar and recovery dialogs now focus their heading, isolate background controls, support Escape, and return focus to their invoking control.
- Advanced the maintenance build to `2026.07.30.2` and rotated the offline shell cache to deliver the completed High Priority fixes to installed PWAs.
- Missed-workout recovery now defers changes to today’s schedule until the recovered workout is complete and the user confirms a choice.
- Advanced the maintenance build to `2026.07.30.4` and rotated the offline shell cache for the recovered-workout flow.

### Fixed

- Added a consistent visible keyboard focus indicator across interactive controls.

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
