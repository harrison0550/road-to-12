# Known Bugs

Use this file as the durable defect tracker. Do not delete resolved records; update their status and add regression coverage.

## Active

No confirmed production defects are currently documented.

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

## Bug template

```markdown
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
