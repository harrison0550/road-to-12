# Changelog

All notable changes to Road to 12% are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses Semantic Versioning for public release numbers.

## [Unreleased]

### Added

- Professional project documentation under `/docs`.
- Project context and contributor standards for future development sessions.

### Changed

### Fixed

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

