# Body Measurements

## Purpose

Road to 12% stores body-composition observations as append-only, timestamped records. Weight and waist are the primary progress signals. Consumer-scale estimates such as body-fat percentage, muscle mass, water, visceral fat, BMR, metabolic age, and BMI are supporting trend data and must not be treated as clinical measurements.

## Canonical record

`bodyMeasurements` is an array in the existing `road12v5` state. Each record has a stable `id`, one supported `source`, an ISO-8601 `timestamp`, and nullable numeric values for:

- `weight`, `weightLb`, `weightKg`, `bodyFatPercent`, `fatMass`, `fatMassLb`, `leanBodyMass`, `leanBodyMassLb`, `muscleMass`, `muscleMassLb`, `muscleMassPercent`
- `skeletalMuscleMass`, `skeletalMusclePercent`, `bodyWaterPercent`
- `subcutaneousFatPercent`, `visceralFat`, `proteinPercent`
- `BMR`, `bmrKcal`, `metabolicAge`, `BMI`, `bmi`, `boneMassLb`, `waist`

The supported sources are `manual`, `wyze-import`, and `apple-health`. `body-measurements.js` owns validation, source adapters, newest-value selection, rolling averages, and trend calculations. Every source must pass through this interface before writing state.

## Compatibility and migration

Schema 16 adds `bodyMeasurements` without deleting or rewriting `weight`, `waist`, or `measurementHistory`. Existing measurement history is copied into canonical manual records once. New manual entries append both a canonical record and a legacy-compatible summary. Current displayed weight and waist come from the newest valid canonical value for each field, falling back to the legacy summaries.

Backups include both representations. Older backups without `bodyMeasurements` remain valid and are upgraded by the normal schema migration. Workout history and progression records are not part of this migration.

## Trend and coaching policy

The Progress screen uses a seven-day rolling average for weight and longer-window direction for weight and waist. A single-day scale fluctuation must never change an exercise prescription, phase readiness score, or produce a fat-loss warning. Readiness may count measurement coverage as evidence quality, but measurement values do not directly score training readiness.

## Wyze XLSX import

`wyze-xlsx-import.js` parses user-selected Wyze Scale `.xlsx` exports locally with the vendored SheetJS CE reader. It discovers the header row by its names, preserves the original `Date and Time` text as `sourceTimestamp`, interprets that wall-clock value in the user's local timezone, strips pounds/kilograms/percent units, and keeps blanks or `- -` as `null`. Weight-only rows are valid.

The adapter maps both stable legacy names and source-specific aliases, preserves `sourceRecordNumber`, and creates a deterministic identity from source, timestamp, and weight. A review screen labels every parsed row as Import, Update, or Duplicate before state changes. Within one export, same-weight readings within ten minutes collapse to the richest reading, then the newest when richness ties. Re-importing an exact reading is a no-op; a richer exact reading enriches the stored record without replacing its existing non-null data. Manual records and workout history are never touched.

The current weight comes from the newest valid weight. Body fat and lean mass each come from the newest record that actually contains that field, with their own measurement dates. A newer weight-only record remains composition-null and never borrows old values.

This is strictly an import adapter for user-authorized exported data. Do not call an undocumented Wyze API and do not reverse-engineer Wyze Bluetooth.

## Apple Health / HealthKit plan

An installed web app cannot directly provide the intended automatic HealthKit integration. A future iOS companion or wrapper should provide a small native bridge that:

1. Requests explicit read authorization only for supported Apple Health body measurements.
2. Reads authorized samples incrementally using a persisted HealthKit anchor.
3. Converts Apple Health units to the Road to 12% canonical units.
4. Sends records through the `apple-health` adapter with the original sample timestamp and a stable source identifier.
5. Deduplicates repeat deliveries and writes through the existing Road to 12% data layer.
6. Keeps workout operation offline and functional when HealthKit is unavailable or authorization is denied.

The native bridge must not store HealthKit credentials in the PWA, and Apple Health data must not be exported or synchronized elsewhere without separate, explicit consent.
