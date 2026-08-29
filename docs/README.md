# Road to 12% Documentation

Road to 12% is an offline-first personal training Progressive Web App (PWA). It combines guided workouts, equipment-specific exercise education, flexible scheduling, recovery workflows, progress measurements, and local workout history in an iPhone-friendly interface.

This folder is the canonical source for product direction, architecture, design standards, release procedures, and active work. Read `PROJECT_CONTEXT.md` first, followed by the documents relevant to the task.

## Technology stack

- Semantic HTML5 in `index.html`
- Modern browser JavaScript in `app.js`, `data.js`, and `exercise-library.js`
- Locally vendored SheetJS CE for offline, user-selected Wyze `.xlsx` parsing
- CSS with responsive layouts, safe-area support, and reduced-motion handling
- Browser `localStorage` for device-local application state
- Service Worker and Cache Storage for offline operation
- Web App Manifest for Home Screen installation
- Node.js validation scripts in `scripts/`
- Git for source control and release history

The production app intentionally has no framework, package manager, bundler, server, or cloud database dependency.

## Run locally

The application must be served over HTTP so its Service Worker and PWA behavior work correctly. From the repository root, run either:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

or any equivalent static web server, then open:

```text
http://127.0.0.1:4173/
```

Opening `index.html` directly from the filesystem is not a supported development workflow.

## Validation and build process

There is no compilation step. The checked-in static files are the production build.

Before a release:

```powershell
node scripts/validate-foundation.js
node scripts/validate-exercise-library.js
node scripts/test-exercise-animation-coverage.js
node scripts/test-exercise-imagery.js
node scripts/test-offline-pwa.js
node scripts/test-wyze-xlsx-import.js
node scripts/test-progress-disclosures.js
git diff --check
```

Also complete the manual and mobile testing checklist in `RELEASE_PROCESS.md`. A release changes the version metadata, rotates the Service Worker cache name, updates this documentation, and tags the verified commit.

## Folder structure

```text
/
├── assets/                  Exercise media and PWA assets
├── docs/                    Product and engineering documentation
├── scripts/                 Repository validation utilities
├── app-meta.js              Version, build, and cache metadata
├── app.css                  Current production styles
├── app.js                   Current application and UI logic
├── body-measurements.js     Measurement adapters, summaries, and trends
├── wyze-xlsx-import.js      Review-first Wyze XLSX parser and deduplication
├── backup-restore.js        Versioned data portability and validation
├── vendor/                  Audited third-party runtime and license files
├── data.js                  Workout definitions
├── exercise-library.js      Exercise education metadata
├── index.html               Application shell and entry point
├── manifest.webmanifest     PWA manifest
├── sw.js                    Offline Service Worker
├── CONTRIBUTING.md          Coding and Git standards
└── README.md                Repository-level overview and history
```

Older versioned JavaScript and CSS files are retained as historical artifacts. New production work should target the entry points referenced by `index.html`.

## Documentation map

- `PROJECT_CONTEXT.md` — current state and handoff memory
- `VISION.md` — long-term product direction
- `ROADMAP.md` — release sequence and future ideas
- `ARCHITECTURE.md` — system boundaries and data flow
- `BODY_MEASUREMENTS.md` — canonical measurement schema, source adapters, and HealthKit bridge boundary
- `OPEN_SOURCE_NOTICES.md` — bundled third-party software and license locations
- `UI_GUIDELINES.md` — visual and interaction standards
- `EXERCISE_MEDIA_AUDIT.md` — exact active-program and visible-library media coverage, accessibility, provenance, and offline validation
- `CODEX_TASKS.md` — prioritized sprint backlog
- `CHANGELOG.md` — user-visible release history
- `KNOWN_BUGS.md` — active and resolved defect records
- `RELEASE_PROCESS.md` — release and verification procedure
