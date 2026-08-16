# Strava Integration Direction

## Status

Planned. Road to 12% does not currently connect to Strava, request authorization, upload activities, or contain Strava credentials. The current release only prepares completed strength history for a future secure export.

## Product intent

Strength training is the primary integration target. Road to 12% should eventually create one Strava strength activity containing the actual completed exercises and discrete sets. Cardio synchronization is secondary because iFIT may already publish those activities; any future cardio sync must require an explicit source choice and duplicate protection.

## Verified Strava format

Strava's current Uploads API accepts structured JSON for `WeightTraining`, `HIIT`, `Workout`, and `Crossfit`. A workout includes start time, UTC offset, elapsed time, and a required sets collection. Each set can carry an exercise type, repetitions, kilograms, duration, and start time. Upload processing is asynchronous and supports an external ID for duplicate identification.

Authoritative references, verified August 15, 2026:

- [Strava Uploads documentation](https://developers.strava.com/docs/uploads/)
- [Strava API changelog](https://developers.strava.com/docs/changelog/)

Strava identifiers must be stored as strings because remote IDs can exceed JavaScript's safe integer range.

## Security boundary

The installed PWA is a public client and must never contain a Strava client secret, long-lived access token, or refresh token. The intended path is:

```text
Road to 12% PWA
  -> authenticated HTTPS request
Secure backend or serverless integration service
  -> OAuth token storage, JSON conversion, upload, and polling
Strava API
```

Offline workout completion remains authoritative. A failed or unavailable sync can never block saving a workout.

## Canonical local record

New completed strength sessions preserve:

- A stable Road to 12% exercise ID independent of the display name.
- Display name, exercise order, muscles, equipment, and provider mappings.
- Prescribed sets, reps, rest, and unit separately from actual performance.
- One record per actual set: set number, type, repetitions, weight, unit, completion status, and timestamps when observed.
- Session start/end and elapsed duration, with active/rest duration left `null` until they can be measured honestly.
- Workout difficulty, notes, training phase, recovery dates, and aggregate actual performance.
- Per-provider synchronization metadata.

Older history remains valid and is not rewritten. Consumers must tolerate legacy records that do not contain the newer fields.

## Synchronization lifecycle

Provider state is stored beneath the workout, beginning with:

`NOT_SYNCED -> QUEUED -> SYNCING -> SYNCED`

Failures use `FAILED` and retain a human-safe `lastError`. The Strava record reserves `externalId`, `uploadId`, `activityId`, `lastAttemptAt`, and `uploadedAt`. No activity is marked synced until Strava confirms the asynchronous upload.

## Duplicate policy

- Use the stable Road to 12% session external ID for strength-upload idempotency.
- Never create a second strength activity after an activity ID is recorded unless the user explicitly chooses a future repair workflow.
- Default cardio to no Road to 12% upload when iFIT is the recording source.
- A future UI must clearly show source, queued/failed/synced state, and retry behavior without implying that local data depends on Strava.

## Delivery phases

1. Complete: stable exercise identities and export-ready completed strength records.
2. Future: secure backend, OAuth authorization, encrypted token storage, and account disconnect/deletion.
3. Future: deterministic Road to 12% to Strava JSON conversion with pounds-to-kilograms conversion at the boundary.
4. Future: offline queue, upload polling, retries, duplicate handling, and user-visible status.
5. Future: opt-in cardio source arbitration with iFIT duplicate prevention.

Foundation A/B/C, adaptive progression, recovery scheduling, and offline use remain unchanged while this integration matures.
