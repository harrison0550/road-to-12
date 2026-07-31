# Project Context

Read this file at the beginning of every Codex or engineering session. It is the concise handoff for the current production state. Consult the linked canonical documents before making changes.

## Current production

- Product: Road to 12%
- Version: 13.2.0
- Build: 2026.07.30.1
- Last updated: July 30, 2026
- Service Worker cache: `road12-v13-2-shell`
- Runtime: static, client-only, offline-first PWA
- Primary storage key: `road12v5`

## Current architecture

- `index.html` is the application shell.
- `app.js` owns screen rendering, workout flow, scheduling, recovery, and progress behavior.
- `scheduling.js` owns pure recovery and date-shifting rules without DOM or storage access.
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

See `KNOWN_BUGS.md` before diagnosing or fixing defects.

## Active sprint goals

1. Add BUG-002 small-iPhone layout regression coverage.
2. Add PWA installation, update, and offline smoke tests.
3. Audit Calendar and recovery dialogs for VoiceOver and focus behavior.
4. Improve calendar navigation and filtering without altering schedule truth.
5. Preserve v13.2 behavior while gradually creating clearer module boundaries.

See `CODEX_TASKS.md` for priority and acceptance detail.

## Recent design decisions

- The five primary destinations are Home, Calendar, Progress, Exercises, and Profile.
- Calendar status and workout type are independent and never color-only.
- The Calendar is a projection of scheduling state, not its own data source.
- `plannedDate` is immutable; only `scheduledDate` moves.
- Rest days remain protected when workouts shift.
- Recovery recommendations explain impact and require an explicit user action.
- Traditional streak emphasis was replaced with adherence, recovery, and total-session context.
- Workout scroll is restored only when resuming; intentional next-exercise navigation may scroll to the top.
- Primary buttons are full-width inside their content container.

## Important implementation constraints

- Preserve existing workout history and `road12v5` compatibility.
- Migrations must be additive, ordered, and idempotent.
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
