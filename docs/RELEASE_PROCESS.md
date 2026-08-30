# Release Process

## Version numbering

Road to 12% uses `MAJOR.MINOR.PATCH` release numbers:

- **Major**: incompatible data, architecture, or product changes.
- **Minor**: backward-compatible features and substantial improvements.
- **Patch**: backward-compatible defect or documentation corrections.

Build identifiers use `YYYY.MM.DD.N`, where `N` increments for multiple builds on the same date.

## Prepare the release

1. Confirm the target scope in `ROADMAP.md` and `CODEX_TASKS.md`.
2. Ensure active bugs are recorded in `KNOWN_BUGS.md`.
3. Work from a focused branch using the conventions in `CONTRIBUTING.md`.
4. Preserve unrelated changes and existing local data compatibility.
5. Complete implementation and tests before changing release metadata.

## Update release records

1. Move relevant entries from `CHANGELOG.md` → `Unreleased` into a new version section.
2. Add the release date and build identifier.
3. Record Added, Changed, Fixed, and Removed items; keep empty headings only under `Unreleased`.
4. Update `app-meta.js`:
   - `version`
   - `build`
   - `lastUpdated`
   - `serviceWorkerCache`
5. Update the build query on the `app-meta.js` import in `sw.js` to the same build identifier.
6. Update `PROJECT_CONTEXT.md`.
7. Update completed roadmap and sprint items.
8. Update the About screen only through its metadata source; do not hard-code a second version value.
9. When guided exercise names or media change, update `EXERCISE_MEDIA_AUDIT.md` and verify every exact active name before rotating the cache.

## Automated checks

Run from the repository root:

```powershell
node scripts/validate-foundation.js
node scripts/validate-exercise-library.js
node scripts/test-exercise-animation-coverage.js
node scripts/test-exercise-imagery.js
node scripts/test-offline-pwa.js
git diff --check
```

All checks must pass without ignored errors.

## Testing checklist

### Functional

- [ ] Home loads with existing data.
- [ ] A workout can start, save progress, resume, and finish.
- [ ] Completed history remains readable.
- [ ] Calendar opens every day and displays correct independent indicators.
- [ ] Recovery actions preserve `plannedDate`, order, and rest days.
- [ ] Progress check-ins save correctly.
- [ ] Backup export and import work with representative data.
- [ ] Exercises and Profile remain reachable.
- [ ] Every active guided exercise opens with its still motion poster.
- [ ] Focused exercise animations start automatically, Pause/Play works, and enlarged media, Close, and Escape do not lose workout state.
- [ ] Pause animation returns focused exercise media to its still storyboard and Play resumes it.
- [ ] Only the approved primary demonstration appears on exercise screens; retained official or reviewed references remain credited in Image Sources & Licenses.

### Responsive and accessibility

- [ ] Verify 320 × 568.
- [ ] Verify 375 × 667.
- [ ] Verify 390 × 844.
- [ ] Verify 430 × 932.
- [ ] No page-level horizontal overflow.
- [ ] Top and bottom safe areas are respected in standalone mode.
- [ ] Primary buttons remain inside content containers.
- [ ] Touch targets are at least 44px.
- [ ] Status is not communicated by color alone.
- [ ] Keyboard focus and VoiceOver labels are meaningful.
- [ ] Reduced-motion behavior remains usable.
- [ ] Exercise media controls remain inside their card and at least 44px tall at 320px.
- [ ] Movement, equipment orientation, and safety-relevant posture are understandable from the alternative text and written guide without animation.

### PWA and offline

- [ ] Manifest loads without errors.
- [ ] Service Worker installs on a clean origin.
- [ ] The core shell installs and activates even when an exercise-media request fails.
- [ ] The background media warm-up caches posters and references before GIFs, limits concurrent requests, and reports failures without blocking the shell.
- [ ] A failed media warm-up retains the previous media cache; a zero-failure warm-up removes superseded media caches.
- [ ] Still posters, animated GIFs, and retained local exercise references play or open after connectivity is removed.
- [ ] App relaunches offline after one online visit.
- [ ] Existing installation receives the new cache after update.
- [ ] Startup time shows no material regression.

### Data compatibility

- [ ] Test a clean install.
- [ ] Test representative production `localStorage`.
- [ ] Confirm migrations are additive and idempotent.
- [ ] Confirm malformed storage is preserved rather than overwritten.
- [ ] Confirm completed history is not rewritten.

## Commit and review

- Review `git diff` for accidental generated files or unrelated edits.
- Verify that production entry points referenced by `index.html` are correct.
- Use focused Conventional Commit messages.
- Request review for storage, Service Worker, scheduling, or accessibility changes.

## Git tagging

After the release commit is approved and merged:

```powershell
git tag -a v13.2.0 -m "Road to 12% v13.2.0"
git push origin v13.2.0
```

Replace the example version with the actual release. Never move or reuse a published release tag.

## Release notes

Release notes should include:

- Short user-facing summary
- Added or improved capabilities
- Important fixes
- Data or migration considerations
- Known limitations
- Validation performed
- Upgrade or cache-refresh instructions, if necessary

Publish release notes from the matching `CHANGELOG.md` section and keep technical implementation detail secondary.

## Optional Strava Worker deployment

The Strava Worker is a separate security-sensitive deployment. A normal GitHub Pages release must not create, configure, or deploy it implicitly. Before enabling its public URL in `strava-config.js`:

- Apply the reviewed D1 schema.
- Add Strava credentials and the token-encryption key through Cloudflare secrets, never repository files.
- Set the exact PWA origin and OAuth callback URL.
- Confirm the callback domain in the Strava application.
- Run the Worker security, route, idempotency, polling, privacy, and disconnect tests.
- Verify that the public PWA bundle contains no provider token or client secret.
- Verify the deployed disconnect path with an authorized pilot account: revoke access, confirm atomic deletion of OAuth/connection/upload/activity/error data in D1, confirm local activity links and provider metadata are removed, preserve Road to 12% workouts, and prove an older backup cannot restore deleted data.
- Confirm the pre-OAuth disclosure, support/deletion path, data-retention rules, AI exclusion, and sanitized `429` behavior against `STRAVA_COMPLIANCE.md`.
- Run one deliberate manual pilot only after the compliance gate passes, and stop before considering any automatic behavior.

Document Worker and PWA deployment separately, including removal instructions. Rotating the static PWA build/cache remains required when its public Worker URL or browser client changes.

## Post-release

1. Confirm the deployed app reports the expected version and build.
2. Verify the installed PWA updates successfully.
3. Move remaining tasks to the appropriate roadmap release.
4. Add newly discovered defects to `KNOWN_BUGS.md`.
5. Update `PROJECT_CONTEXT.md` for the next session.
