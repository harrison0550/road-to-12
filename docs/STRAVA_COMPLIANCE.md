# Strava Compliance Gate

Date checked: August 30, 2026

Status: **PASS WITH REQUIRED DEPLOYMENT VALIDATION — no live activity upload is permitted until the Worker and installed PWA deletion flow are verified against the connected pilot account.**

This is an engineering compliance review, not legal advice. Passing automated tests does not by itself establish compliance.

## Official sources reviewed

- [Strava API Agreement](https://www.strava.com/legal/api) — effective June 1, 2026.
- [Strava API Policy](https://www.strava.com/legal/api_policy/) — effective June 1, 2026.
- [Strava API Brand Guidelines](https://developers.strava.com/guidelines/) — last revised September 29, 2025.
- [Strava Authentication](https://developers.strava.com/docs/authentication/) — no revision date displayed; checked August 30, 2026.
- [Strava Uploads](https://developers.strava.com/docs/uploads/) — no revision date displayed; checked August 30, 2026.
- [Strava Rate Limits](https://developers.strava.com/docs/rate-limits/) — no revision date displayed; checked August 30, 2026.

## Approved pilot boundary

- Personal, single-athlete pilot.
- GitHub Pages PWA with a separate Cloudflare Worker and D1 database.
- OAuth scope: `activity:write` only.
- Explicit manual posting of completed Full Body A/B/C sessions only.
- No automatic sync, activity reading, feed replication, background queue, or cardio posting.
- Browser requests use a per-installation P-256 signing key, bounded timestamps, and one-time nonces.
- OAuth uses a one-time, installation-bound state that expires after ten minutes and is deleted when consumed. Every Worker request purges expired or abandoned state.
- Provider access and refresh tokens are stored only by the Worker and encrypted with AES-256-GCM.
- The structured-strength payload uses `POST https://www.strava.com/api/v3/uploads`, `sport_type=WeightTraining`, `data_type=json`, and a deterministic `external_id`.

Recommended registered application description:

> Personal home-gym strength workout tracker that lets the authorized athlete manually upload completed strength workouts to Strava.

## Data sent to Strava

Only the reviewed public activity title and structured strength file are eligible to be sent. The file contains start time, UTC offset, elapsed time, mapped exercises, completed working-set repetitions, normalized kilograms, and timed-set duration when applicable.

The payload excludes body-fat goals, body measurements, RIR, discomfort, form feedback, coaching notes, private workout notes, progression decisions, and unrelated health data. Warm-up and activation sets are excluded.

## Canonical data classification

`strava-data-boundary.js` is the canonical browser classification. Its categories are intentionally explicit:

### Delete on disconnect

- athlete ID and display name;
- granted scopes, connection state, and provider connection timestamps;
- access/refresh tokens and token expiration;
- OAuth state and related provider metadata;
- upload ID, activity ID, upload state, provider timestamps, sanitized provider errors, and `View on Strava` links.

### Safe local Road to 12% data

- workout/session IDs and names;
- exercise, set, repetition, and locally recorded weight data;
- local workout timestamps, progression, and coaching data;
- the locally generated upload external ID;
- a deletion tombstone containing only local session IDs and the deletion time.

### Temporary and expiring

- OAuth state: ten-minute maximum, one-time use, deleted on callback, with expired rows purged on every Worker request;
- request nonces: short-lived replay protection, consumed once and removed when expired;
- rate-limit response metadata: request-local only and not persisted.

## Retention and deletion

While connected, the Worker retains the minimum connection credentials and upload state required to carry out the user-requested manual upload and reconcile its asynchronous result. Sanitized operational error state exists only with that upload record. Road to 12% does not cache or read Strava activities.

Disconnect is failure-safe and ordered:

1. Revoke the provider token. A provider `401` is treated as already unavailable so off-app revocation does not block deletion.
2. Atomically delete the installation's OAuth state, upload/activity/error records, athlete/profile fields, scopes, encrypted tokens, and connection timestamps from D1.
3. Return an explicit backend deletion confirmation.
4. Only after that confirmation, remove all `externalSync.strava` metadata and activity links from local workout history.
5. Preserve every Road to 12% workout and write a local deletion tombstone so an older backup cannot restore deleted provider data.

If revocation or the D1 transaction fails, the Worker does not claim deletion and the browser does not perform local cleanup. The user can retry. The installation public-key identity may remain because it is Road to 12% security state and is not Strava-derived.

The in-app completion message is:

> Strava disconnected. Strava authorization and stored Strava data have been deleted. Your Road to 12% workout history was not affected.

Support and deletion assistance are available through the repository's GitHub issue form linked from the in-app Strava & Privacy view. Users are warned not to include health data or credentials in a support request.

## Consent and privacy

Before OAuth begins, Road to 12% presents an accessible disclosure and requires explicit acknowledgement. It explains:

- `activity:write` is the only requested scope;
- connection does not enable automatic, cardio, or background sync;
- what is sent, stored, and excluded;
- credentials remain encrypted in the Worker and out of backups;
- how to withdraw consent and delete Strava-derived data;
- that local Road to 12% workout history remains after deletion;
- how to request support or deletion help;
- that Strava may monitor or collect API usage information;
- that Road to 12% is not sponsored or endorsed by Strava.

The same disclosure remains available from Profile through **Strava & Privacy**.

## AI and analytics boundary

Strava-derived data is prohibited from adaptive coaching, readiness, analytics, profiling, advertising, AI/model input, agent context, training, development, and evaluation. Before coaching receives workout history, `strava-data-boundary.js` strips the provider record. Only the user's original Road to 12% workout data may influence progression.

Road to 12% does not sell, license, syndicate, disclose, or proxy Strava data to another party or product.

## Branding

- Road to 12% uses plain-text Strava references and no Strava logo as its app icon.
- The UI does not imitate Strava or claim sponsorship or endorsement.
- Confirmed activity links use the text `View on Strava`.
- If the generic connection control is replaced with Strava's official button, use the unmodified official asset and current brand rules.

## Rate limits and polling

- Polling begins only after an explicit post or when the user deliberately opens a still-processing eligible session.
- Polling waits at least 1.5 seconds, is bounded, and stops on success, failure, offline state, or timeout.
- The Worker refuses to contact Strava more than once per second for one upload.
- There is no scheduled or background polling.
- HTTP `429` is converted to a sanitized `STRAVA_RATE_LIMITED` response. `Retry-After` may be returned to the browser, while provider rate-limit headers remain internal and are not persisted.

## Compliance checklist

| Area | Status | Finding |
| --- | --- | --- |
| A. API purpose | PASS WITH RECOMMENDATION | Personal manual strength posting is appropriately narrow. Update the registered app description to the recommended wording above. |
| B. Authentication and consent | PASS | One-time OAuth, explicit acknowledgement, and only `activity:write` are implemented. |
| C. User consent/data disclosure | PASS | Collection, exclusion, withdrawal, deletion, confirmation, support, monitoring, and non-endorsement disclosures are accessible before and after connection. |
| D. Data deletion | PASS IN AUTOMATED TESTS; LIVE VALIDATION REQUIRED | The backend-confirmed transaction and local anti-resurrection cleanup pass fault-injection tests. Verify the deployed Worker/D1 and installed PWA before upload. |
| E. Data access | PASS | Signed installation-bound requests expose only that installation's connection/upload state. |
| F. Token and secret security | PASS WITH RECOMMENDATION | Tokens remain encrypted server-side and credentials remain Cloudflare secrets. Reconfirm secret-name inventory and logging after deployment without exposing values. |
| G. Data minimization | PASS | Only the validated public title and required strength fields can enter the upload payload. |
| H. Branding | PASS WITH RECOMMENDATION | Plain text is non-endorsing and confirmed links say `View on Strava`. |
| I. Rate limits/polling | PASS | Polling is manual, bounded, no faster than documented guidance, and `429` is handled without persisting provider headers. |
| J. Activity upload | PASS | The current contract supports JSON `WeightTraining` uploads with structured sets, kilograms, `external_id`, and asynchronous status polling. |
| K. Data storage/API restrictions | PASS IN IMPLEMENTATION; LIVE VALIDATION REQUIRED | Minimal connected-state retention and complete disconnect deletion are implemented; deployment must be verified. |
| L. AI/model use | PASS WITH REQUIRED GUARDRAIL | Provider records are stripped before coaching and remain prohibited from every AI/model/agent context. |
| M. Third-party/commercial access | PASS FOR SINGLE-ATHLETE PILOT | This remains a one-athlete pilot. Any broader access requires a new review. |
| N. Support/contact | PASS | The in-app privacy view links to a support/deletion request path and warns against sharing sensitive data. |
| O. Terms monitoring | PASS | Sources, check dates, restrictions, deployment gate, and recheck triggers are recorded here. |

## Remaining gate before first live upload

1. Deploy only the remediated Worker and PWA build.
2. Confirm the deployed secret names and non-secret routing variables without displaying secret values.
3. With the currently connected pilot account, invoke **Disconnect Strava**.
4. Verify the UI reports confirmed deletion and preserves Road to 12% workout history.
5. Verify D1 has no connection, athlete, token, OAuth-state, upload, activity, error, or provider timestamp records for that installation.
6. Import or inspect an older backup and confirm the deletion tombstone prevents provider metadata from returning.
7. Reconnect through the new disclosure only if needed for the later manual-upload pilot.
8. Rerun this checklist and change the gate to PASS. Do not upload an activity as part of this validation.

## Multi-user requirements

Before allowing another athlete, confirm the registered capacity/tier and any subscription or review requirement in the live Strava API settings; add account-level identity binding rather than relying only on a device installation; publish a complete privacy policy and support process; handle off-app revocation/deletion; document subprocessors; and re-audit access, deletion, retention, branding, and rate-limit behavior.

## Mandatory recheck triggers

Recheck the current official documents and update this gate before changing requested scopes; adding read access, automatic synchronization, another user, public availability, more stored provider data, branding, AI/analytics use, the upload format/API version, or following a material Strava policy change.
