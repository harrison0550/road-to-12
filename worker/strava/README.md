# Road to 12% Strava Phase 2A Worker

This Cloudflare Worker is the only trusted boundary for the manual Strava proof of concept. The static PWA never receives the Strava client secret, access token, or refresh token.

## Resources

- Cloudflare Worker `road12-strava-phase2a`, deployed at `https://road12-strava-phase2a.homegym-sync.workers.dev`.
- D1 database `road12-strava`, bound as `DB` and initialized with `schema.sql`.
- Worker secrets: `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, and `TOKEN_ENCRYPTION_KEY`.
- Worker variables: `PWA_ORIGIN`, `PWA_RETURN_URL`, and `OAUTH_REDIRECT_URI`.

`TOKEN_ENCRYPTION_KEY` must be a base64url-encoded 32-byte random key. Never commit its value. `OAUTH_REDIRECT_URI` is the public Worker callback URL ending in `/api/strava/callback`; its domain must be allowed by the Strava application. `PWA_ORIGIN` is the exact GitHub Pages origin, without a pathname or trailing slash, and is used only for CORS validation. `PWA_RETURN_URL` is the full Road to 12% application URL and includes `/road-to-12/`.

## Setup outline

1. Create the D1 database and replace only the database ID placeholder in `wrangler.toml`.
2. Apply `schema.sql` to the remote D1 database.
3. Add the three secrets with Cloudflare's secret controls.
4. Add `PWA_ORIGIN`, `PWA_RETURN_URL`, and `OAUTH_REDIRECT_URI` as Worker variables.
5. Register the callback domain in the Strava application.
6. Deploy the Worker.
7. Put the deployed HTTPS Worker URL in the PWA's `strava-config.js`, run all validation, rotate the PWA build/cache, and deploy the PWA separately.

The Phase 2A pilot resources were provisioned on August 30, 2026. Secret values remain only in Cloudflare and are not represented by this repository. The first OAuth connection and live upload still require explicit user action.

## Routes

- `POST /api/install/register`
- `GET /api/strava/status`
- `POST /api/strava/connect`
- `GET /api/strava/callback`
- `POST /api/strava/upload`
- `GET /api/strava/upload/:externalId/status`
- `POST /api/strava/disconnect`

Except for the OAuth callback, privileged requests use a timestamped, nonce-bound P-256 installation signature. The callback uses a one-time, installation-bound, ten-minute OAuth state.

The Worker stores connection credentials and upload state only while required for the connected, manual-only pilot. OAuth state is single-use and deleted on callback; every Worker request purges expired state. Request nonces are single-use and short-lived. Rate-limit headers are request-local and are not persisted.

`POST /api/strava/disconnect` revokes the provider token and then uses one D1 batch to delete OAuth state, the entire connection/profile/token row, and every upload/activity/error row for the installation. It returns `deletionConfirmed: true` only after that batch succeeds. A provider `401` is treated as already revoked. Any other revoke or database failure returns an error and does not claim deletion.

## Disable or remove

First disconnect Strava in the PWA and verify the confirmed-deletion message. Confirm that D1 has no OAuth, connection, upload, activity, error, or provider timestamp records for the installation. Then remove the Worker URL from `strava-config.js` and deploy that PWA build. Finally remove the Worker, its secrets, and the D1 database in Cloudflare. The PWA preserves local workout history but removes Strava metadata and activity links; its deletion tombstone prevents an older backup from restoring them.
