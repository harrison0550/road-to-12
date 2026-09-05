# Product Roadmap

The roadmap communicates direction rather than a guaranteed schedule. Completed work belongs in `CHANGELOG.md`; implementation-ready work belongs in `CODEX_TASKS.md`.

## Current release — v13.2

- [x] Flexible missed-workout recovery
- [x] Monthly workout calendar
- [x] Status and workout-type legend
- [x] Planned and scheduled date separation
- [x] Coach recovery recommendations
- [x] Adherence and recovery metrics
- [x] Workout scroll restoration fix
- [x] Small-iPhone progress layout fix

## Next release — v13.3

- [x] Establish the four-phase training journey and locked multi-signal Foundation readiness model
- [x] Add exercise-specific PROGRESS / BUILD / HOLD / DELOAD guidance
- [x] Add exercise feedback and approval-based next-session prescriptions
- [x] Add planned-versus-actual cardio performance logging and append-only measurement history
- [x] Expand cardio to per-block performance, body-composition trends, and readiness evidence quality
- [x] Add resumable Keep Going timing with automatic cardio-duration capture
- [x] Make approved exercise prescriptions actionable in the next matching session with outcome tracking
- [x] Add validated, versioned backup/restore for authoritative offline state
- [ ] Validate and mature the readiness algorithm before enabling Phase 2 review
- [x] Add the iFIT rower and available 10/15/20/25 lb dumbbells to the weekly program without replacing existing exercises
- [x] Add targeted biceps accessories, a review-gated four-session lower-ab progression, and pelvic-floor relaxation/mobility without replacing Foundation A/B/C
- [x] Establish distinct Foundation chest presses: Smith Machine Bench Press on A, GMWD Converging Chest Press on B, and Low-Incline Dumbbell Press on C, with engagement-aware progression and legacy-history preservation
- [x] Replace the Full Body C behind-the-back cable curl with a revision-safe Seated Concentration Curl and supplied offline guide/sequence assets
- [x] Add Smith Machine Hip Thrust to Full Body C with the owned bar pad, complete strength tracking, and approved offline movement guidance
- [x] Refresh Home with the Concept B Training Command Center design
- [x] Add automated scheduling regression tests
- [ ] Add calendar filtering and faster month navigation
- [ ] Improve calendar history reconciliation
- [x] Audit VoiceOver labels and focus management
- [x] Add PWA installation and offline smoke tests
- [x] Complete yesterday’s missed workout through the existing workout engine
- [ ] Consolidate legacy documentation and release artifacts

## Future releases

### v13.4

- [x] Deterministic adaptive training profile and explainable recommendation foundation
- [x] Complete movement-animation coverage for all 63 active Foundation guided exercise names and all three review-gated lower-ab Phase 2 movements, with automatic focused playback and offline caching
- [ ] Expanded equipment setup guides
- [ ] Explainable AI training recommendations
- [ ] Exercise search and filtering
- [x] Progressive-overload recommendation foundation
- [ ] Phase 2 Build workout definitions and milestone acceptance experience
- [ ] Cardio trend-based progression using repeated performance patterns
- [ ] Review and approve Phase 2 Build exercise media only after its workout definitions and milestone plan are accepted

### Later

- [x] Local-only Strava Phase 1 with validated mappings, explicit Full Body A/B/C eligibility, deterministic structured-strength payloads, preview mode, and protective sync metadata
- [x] Build the undeployed secure Strava Phase 2A Cloudflare OAuth/backend boundary, manual-only structured upload, polling, reconciliation, disconnect, and duplicate-safe activity-ID persistence
- [x] Provision and review the Phase 2A Cloudflare Worker, D1 database, Strava application, secrets, exact-origin CORS, callback, and browser configuration
- [ ] Run one explicitly approved live Full Body A/B/C pilot upload and complete duplicate, reconciliation, disconnect/reconnect, and refresh validation
- [ ] Consider Phase 2B automatic strength sync only after the manual pilot is proven and separately approved
- [ ] Strava cardio source arbitration that avoids duplicating iFIT activities
- [x] Canonical manual/Wyze-export/Apple Health body-measurement adapter contract
- [ ] Native iOS HealthKit bridge with explicit authorization, anchored reads, unit conversion, and duplicate protection
- [x] User-reviewed, duplicate-safe Wyze XLSX export import through the documented adapter; no undocumented API or Bluetooth reverse engineering
- [ ] Wearable and heart-rate integrations
- [ ] Nutrition and protein tracking
- [ ] Readiness and sleep trends
- [ ] Secure optional synchronization across devices
- [ ] Coach-generated weekly reviews
- [ ] Create Phase 3 and Phase 4 exercise media after those training structures are approved

## Ideas

- [ ] Calendar agenda view
- [ ] Workout templates and substitutions
- [ ] Deload-week planning
- [ ] Exportable progress reports
- [ ] Accessibility themes and larger workout controls
- [x] Data portability using an open backup format
- [ ] Optional reminders and training notifications
