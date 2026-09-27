# Phase 2 UI rollout plan

Status: approved for production in build `2026.09.26.6`.

Phase 2 extends the approved semantic tokens and reusable components without changing navigation, storage, workout behavior, or the schema.

## Rollout sequence

1. **Shared states and dialogs**
   - Apply the modal, focus, button, alert, loading, empty, error, and success patterns first.
   - Verify focus trapping, focus return, Escape handling, reduced motion, and 320–430 px layouts.
2. **Calendar**
   - Restyle month controls, day states, workout details, recovery choices, and Extra Activity markers.
   - Preserve date selection, scheduling, recovery, and completed-session behavior.
3. **Progress**
   - Standardize disclosure sections, stat cards, charts, readiness, measurements, history, and import review states.
   - Keep calculations, history, and readiness rules unchanged.
4. **Exercises**
   - Apply the category-aware detail system to library rows, filters, media, and detail views.
   - Preserve local media and offline guide behavior.
5. **Profile, backup, export, and settings**
   - Group equipment, preferences, Strava connection, backup, restore, export, and destructive actions with clear hierarchy.
   - Preserve all stored keys and import/export formats.
6. **Extra Activity**
   - Standardize capture, review, validation, confidence, history, and saved states.
   - Preserve duplicate detection and schedule isolation.
7. **Strava preview and posting**
   - Restyle preview, eligibility, connection, upload, queued, success, duplicate, and provider-error states.
   - Preserve the privacy boundary, payload mapping, idempotency, and Worker contract.

## Verification gates

- Capture mobile previews for every tab and every shared state.
- Run the complete regression suite, exercise-library validation, foundation validation, and offline PWA tests after each rollout group.
- Confirm no horizontal overflow, duplicate readiness UI, remote runtime assets, schema increment, or backup-format change.
- Deploy the client only after visual approval. Redeploy the Worker only if its code or configuration changes.
