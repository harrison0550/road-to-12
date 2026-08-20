# Exercise Media Audit

## Status

- Audit date: August 15, 2026
- Release target: version 13.2.0, build `2026.08.15.4`
- Active guided exercise names mapped: 47 of 47
- Visible Library-only setup entries mapped: 1 of 1
- Distinct reviewed movement animations: 40
- New Road to 12% animations in this audit: 34
- Previously approved Road to 12% animations retained: 6
- Offline cache targets: `road12-v13-2-46-shell` and `road12-v13-2-46-media`

This audit covers the exercise names that can appear in the current Foundation A/B/C, Cardio + Mobility, Core + Recovery, and Zone 2 guided flows, plus the Stationary Bike Setup entry visible only in the Exercise Library. The setup entry uses a reviewed static equipment guide because it teaches fit and position rather than a repeated movement. This audit does not approve or create media for unimplemented Build, Upper / Lower, or Hypertrophy / Definition workouts.

## Media contract

Each active guided exercise resolves by its exact display name through `ROAD12_EXERCISE_LIBRARY` in `exercise-library.js`. A movement-animation entry includes:

- A local, still WebP motion poster shown first.
- A local animated GIF that starts automatically in focused exercise views unless the operating system requests reduced motion.
- Movement-specific alternative text.
- A media type and review date.
- A retained reviewed, licensed, or official reference when it is an exact, non-conflicting match.

The written setup, execution, cues, and safety guidance remain authoritative. App-created movement artwork supplements those instructions; it must not be presented as licensed footage or as a substitute for the written coaching.

Several exact workout names intentionally share one accurate animation. For example, easy treadmill warm-ups, cooldowns, and recovery walks use the same easy-walk movement asset, while their written prescriptions remain distinct. This is why 47 active names map to 40 distinct animations.

An older reference is deliberately omitted when it contradicts the active prescription. The prior Cable Shoulder Press crop did not clearly preserve the two-handle, cables-outside-the-arms path; the Cable Lateral Raise crop demonstrated a different two-handle variation; the licensed Smith split-squat GIF did not show the rear-foot-elevated Bulgarian variation; and the older squat, Romanian-deadlift, and calf-raise diagrams showed free-barbell setups instead of the prescribed Smith rails. Their reviewed Road to 12% animations and written instructions remain the active guides.

## Active Foundation coverage

The following 47 exact names were checked against the current equipment-safe guided sequences.

### Full Body A

1. Treadmill Walk
2. Arm Circles
3. Bodyweight Squat
4. Cable Chest Press
5. Seated Cable Row
6. Goblet Squat
7. Lat Pulldown
8. Cable Shoulder Press
9. Rope Triceps Pushdown
10. Cable Curl
11. Dumbbell Lateral Raise
12. Easy Treadmill Cooldown
13. Post-Workout Stretch

### Cardio + Mobility

14. Easy Treadmill Warm-Up
15. Incline Treadmill Walk
16. iFIT Rowing Technique
17. Hip Flexor Mobility
18. Hamstring Mobility
19. Chest and Shoulder Mobility
20. Easy Cardio Cooldown

### Full Body B additions

21. Hip Hinge
22. Smith Machine RDL
23. Smith Bulgarian Split Squat
24. Smith Machine Calf Raise
25. Incline Cable Press
26. Single Arm Cable Row
27. Cable Lateral Raise
28. Cable Crunch
29. Cable Hammer Curl
30. Dumbbell Floor Press

Full Body B also reuses Treadmill Walk, Lat Pulldown, and Easy Treadmill Cooldown from the earlier list.

### Core + Recovery

31. Easy Recovery Walk
32. Dead Bug
33. Bird Dog
34. Side Plank from Knees
35. Hip and Glute Mobility
36. Thoracic and Shoulder Mobility
37. Slow Breathing Cooldown

### Full Body C additions

38. Smith Machine Squat
39. Rear Delt Cable Fly
40. Cable Face Pull
41. Cable Straight Arm Pushdown
42. High to Low Cable Chop
43. Dumbbell Romanian Deadlift
44. Treadmill HIIT Intervals

Full Body C also reuses Treadmill Walk, Hip Hinge, Cable Shoulder Press, Rope Triceps Pushdown, and Easy Treadmill Cooldown.

### Zone 2 Cardio

45. Zone 2 Warm-Up
46. Zone 2 Cardio
47. Zone 2 Cooldown

## Visible Library-only setup coverage

- Stationary Bike Setup — reviewed static KICKR CORE fit and position guide; animation is intentionally not required for this equipment-setup entry.

## Interaction and accessibility review

- Motion posters load without animation or surprise movement.
- **Play animation** and **Pause animation** are explicit, labelled controls with a minimum 44px touch target; focused views begin in the playing state unless Reduce Motion is enabled.
- The control exposes its state semantically and does not rely on color.
- Opening a larger media view uses a labelled modal, manages focus, supports Escape dismissal, and returns focus to the invoking control.
- Meaningful alternative text describes the demonstrated movement, equipment orientation, and safety-relevant posture.
- `prefers-reduced-motion` removes nonessential CSS motion and makes the still poster the initial exercise visual until the user explicitly chooses Play.
- Focused exercise screens contain one primary reviewed demonstration. Retained legacy references remain attributed in Image Sources & Licenses and are not rendered as repetitive secondary cards.
- Retained official or reviewed reference imagery remains identifiable and credited separately from app-created animation.

## Offline and performance review

The Service Worker keeps its small versioned shell cache separate from its versioned exercise-media cache. Shell installation and activation do not wait on the 40 GIF downloads, so one unavailable media file cannot strand an iPhone on the previous app build. After the new worker is active, the app requests a bounded background warm-up that caches still posters and exact retained references before GIFs, with no more than four media requests in flight. A media file opened before warm-up completes is cached on demand.

Older media caches remain available as an offline fallback during an update and are removed only after the new media cache warms without failures. After one successful online warm-up, still posters, animated GIFs, and retained local references remain available offline. Focused exercise screens use the cached GIF immediately; library grids and Reduce Motion users use the lighter still posters.

Every release that changes an animation, poster, mapping, or retained reference must rotate the Service Worker cache and update the build-keyed `app-meta.js` import in `sw.js`.

## Automated validation

Run the media checks from the repository root:

```powershell
node scripts/validate-exercise-library.js
node scripts/test-exercise-animation-coverage.js
node scripts/test-exercise-imagery.js
node scripts/test-offline-pwa.js
```

The validators should confirm:

- All 47 active guided names resolve to reviewed animation metadata.
- Every visible Library-only exercise or setup name resolves to reviewed media; movement entries require animation, while setup-only entries may use an accurate still guide.
- Every animation has a still poster, meaningful alternative text, and a valid multi-frame GIF.
- Retained reference metadata remains valid and inexact legacy references remain excluded.
- All local posters, animations, and references exist in the media manifest.
- Core installation remains independent of media availability; background warming is poster-first, bounded, retryable, and preserves the previous media cache until complete.
- Focused exercise views are animation-first, library grids remain still, and explicit Play/Pause behavior plus accessible media dialogs remain covered.

Manual release review must also sample every generated storyboard for exercise accuracy, cable path and pulley placement, start/finish posture, equipment identity, text-free framing, and small-iPhone legibility. Automated existence checks cannot establish biomechanical accuracy.

## Distribution-rights checkpoint

The repository currently contains RitFit poster crops that were supplied for this personal training app. Source attribution and a private-use note are not proof of permission to redistribute those files from a public repository or public deployment. This audit does not make a legal conclusion about their use. Before the next public release, record explicit redistribution permission, replace the bundled crops with app-original exact references or link-only citations, or make the relevant source assets private. Do not describe this risk as cleared until one of those actions is documented.

## Future scope

- Re-audit this manifest when the approved Foundation exercise list changes.
- Create Phase 2 Build media only after the Build workout definitions and milestone acceptance flow are reviewed and approved.
- Do not generate speculative Phase 3 or Phase 4 assets before their exercise prescriptions exist.
- Continue preferring exact official or appropriately licensed references where available, while preserving an offline app-created guide when it has been reviewed and approved.
- Consider content-hashed or shared immutable media caching so future shell rotations do not redownload unchanged GIFs.
