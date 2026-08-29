# Exercise Media Audit

## Status

- Audit date: August 28, 2026
- Release target: version 13.2.0, build `2026.08.29.2`
- Active guided exercise names mapped: 62 of 62
- Review-gated lower-ab Phase 2 names mapped: 3 of 3
- Visible Library-only setup entries mapped: 1 of 1
- Distinct reviewed movement animations: 60
- New Road to 12% animations in the August 23 expansion: 13
- Previously approved Road to 12% animations retained: 6
- Offline cache targets: `road12-v13-2-62-shell` and `road12-v13-2-62-media`

This audit covers the exercise names that can appear in the current Foundation A/B/C, Cardio + Mobility, Core + Recovery, and Zone 2 guided flows; the three explicitly approved movements gated behind the lower-ab Phase 2 review; and the Stationary Bike Setup entry visible only in the Exercise Library. It does not approve media for unimplemented Build, Upper / Lower, or Hypertrophy / Definition workouts.

## Media contract

Each active guided exercise resolves by its exact display name through `ROAD12_EXERCISE_LIBRARY` in `exercise-library.js`. A movement-animation entry includes:

- A local, still WebP motion poster used when paused or Reduce Motion is enabled.
- A local animated GIF that always starts automatically in focused exercise views.
- Movement-specific alternative text.
- A media type and review date.
- A retained reviewed, licensed, or official reference when it is an exact, non-conflicting match.

The written setup, execution, cues, and safety guidance remain authoritative. App-created movement artwork supplements those instructions; it must not be presented as licensed footage or as a substitute for the written coaching.

Several exact workout names intentionally share one accurate animation. Easy treadmill warm-ups, cooldowns, and recovery walks use the same easy-walk asset, while their written prescriptions remain distinct. The current 62 active names therefore map to 55 distinct animations. The three gated Phase 2 movements plus retained legacy and alias mappings bring the reviewed registry to 60 distinct animations across 76 exact-name mappings.

## August 28 Smith hip-thrust expansion

The audit adds the approved Smith Machine Hip Thrust animation and pause-state poster. The flat bench is entirely outside the front opening, both feet and knees face into the cage, the padded Smith bar remains attached to its vertical rails across the hip crease, and the hands remain visibly connected to the forearms in both reviewed positions. Written setup requires a controlled glute-driven lockout without lower-back overextension.

## August 27 kettlebell expansion

The audit adds exact-name animation and pause-state poster pairs for Kettlebell Around the World, Kettlebell Swing, and Kettlebell Suitcase Carry. Each guide shows the owned 30 lb bell, the established red-shirt trainer, a clear black background, and the first-exposure technique used in Thursday Core + Recovery. The written coaching remains authoritative: swings stop at chest height and remain hip-driven; around-the-world handoffs stay below the navel with a still torso; suitcase carries maintain level hips without side bending.

## August 27 equipment and single-leg update

The former Smith Bulgarian Split Squat guide is replaced by the approved Smith Machine Single-Leg Squat: the athlete faces forward inside the complete red Smith cage, uses no bench, plants one working foot slightly ahead of the bar path, and keeps the unsupported rear foot hovering. The old display name remains an alias of the same stable exercise ID so completed history remains compatible. Full Body B also adds an approved V-Bar Triceps Pushdown using one high front-post pulley and the V-bar's centered cable eye. Seated Cable Row now names the owned rotating close-grip double-D handle explicitly.

## August 26 chest-program update

The audit adds exact-name animation and pause-state poster pairs for Smith Machine Bench Press and Low-Incline Dumbbell Press. These replace Cable Chest Press in future Full Body A sessions and Incline Cable Press in future Full Body B sessions without deleting the older definitions, stable identities, completed history, or reviewed media. Full Body C is unchanged. Both new guides use the approved Road to 12% red-shirt trainer, owned bench/dumbbell context, and the complete red RitFit Smith cage where applicable.

## August 23 training expansion

The audit adds exact-name animation and pause-state poster pairs for Alternating Dumbbell Curl, Behind-the-Back Single-Arm Cable Curl, Reverse Crunch, Lying Leg Raise, Forearm Plank with Posterior Pelvic Tilt, Hanging Knee Raise, Decline Bench Reverse Crunch, Hanging Garhammer Raise, Supine Diaphragmatic Breathing, Wide-Knee Child's Pose Breathing, Supported Deep Squat Breathing, Happy Baby Pelvic Floor Stretch, and 90/90 Hip Switch. All files are locally bundled and included in the versioned media cache.

An older reference is deliberately omitted when it contradicts the active prescription. The prior Cable Shoulder Press crop did not clearly preserve the two-handle, cables-outside-the-arms path; the Cable Lateral Raise crop demonstrated a different two-handle variation; the licensed Smith split-squat GIF did not show the rear-foot-elevated Bulgarian variation; and the older squat, Romanian-deadlift, and calf-raise diagrams showed free-barbell setups instead of the prescribed Smith rails. Their reviewed Road to 12% animations and written instructions remain the active guides.

## Active Foundation coverage

The following 57 exact names were checked against the current equipment-safe guided sequences.

### Full Body A

1. Treadmill Walk
2. Arm Circles
3. Bodyweight Squat
4. Smith Machine Bench Press
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
23. Smith Machine Single-Leg Squat
24. Smith Machine Calf Raise
25. Low-Incline Dumbbell Press
26. Single Arm Cable Row
27. Cable Lateral Raise
28. Cable Crunch
29. Cable Hammer Curl
30. Dumbbell Floor Press
31. V-Bar Triceps Pushdown

Full Body B also reuses Treadmill Walk, Lat Pulldown, and Easy Treadmill Cooldown from the earlier list.

### Core + Recovery

32. Easy Recovery Walk
33. Kettlebell Around the World
34. Kettlebell Swing
35. Kettlebell Suitcase Carry
36. Dead Bug
37. Bird Dog
38. Side Plank from Knees
39. Hip and Glute Mobility
40. Thoracic and Shoulder Mobility
41. Slow Breathing Cooldown

### Full Body C additions

42. Smith Machine Squat
43. Rear Delt Cable Fly
44. Cable Face Pull
45. Cable Straight Arm Pushdown
46. High to Low Cable Chop
47. Dumbbell Romanian Deadlift
48. Treadmill HIIT Intervals
49. Smith Machine Hip Thrust

Full Body C also reuses Treadmill Walk, Hip Hinge, Cable Shoulder Press, Rope Triceps Pushdown, and Easy Treadmill Cooldown.

### Zone 2 Cardio

50. Zone 2 Warm-Up
51. Zone 2 Cardio
52. Zone 2 Cooldown

### August 23 active additions

53. Alternating Dumbbell Curl
54. Behind-the-Back Single-Arm Cable Curl
55. Reverse Crunch
56. Lying Leg Raise
57. Forearm Plank with Posterior Pelvic Tilt
58. Supine Diaphragmatic Breathing
59. Wide-Knee Child's Pose Breathing
60. Supported Deep Squat Breathing
61. Happy Baby Pelvic Floor Stretch
62. 90/90 Hip Switch

### Review-gated lower-ab Phase 2

These movements are locally ready but do not enter the workout until two Phase 1 sessions are completed and the user explicitly accepts the transition.

63. Hanging Knee Raise
64. Decline Bench Reverse Crunch
65. Hanging Garhammer Raise

## Visible Library-only setup coverage

- Stationary Bike Setup — reviewed static KICKR CORE fit and position guide; animation is intentionally not required for this equipment-setup entry.

## Interaction and accessibility review

- Exercise Library grids use motion posters without surprise movement; focused exercise views start the approved animation automatically.
- **Play animation** and **Pause animation** are explicit, labelled controls with a minimum 44px touch target; focused views begin in the playing state.
- The control exposes its state semantically and does not rely on color.
- Opening a larger media view uses a labelled modal, manages focus, supports Escape dismissal, and returns focus to the invoking control.
- Meaningful alternative text describes the demonstrated movement, equipment orientation, and safety-relevant posture.
- `prefers-reduced-motion` continues to remove nonessential decorative CSS motion. Reviewed instructional GIFs start automatically and provide an explicit Pause control that returns to the still storyboard.
- Focused exercise screens contain one primary reviewed demonstration. Retained legacy references remain attributed in Image Sources & Licenses and are not rendered as repetitive secondary cards.
- Retained official or reviewed reference imagery remains identifiable and credited separately from app-created animation.

## Offline and performance review

The Service Worker keeps its small versioned shell cache separate from its versioned exercise-media cache. Shell installation and activation do not wait on the 60 GIF downloads, so one unavailable media file cannot strand an iPhone on the previous app build. After the new worker is active, the app requests a bounded background warm-up that caches still posters and exact retained references before GIFs, with no more than four media requests in flight. A media file opened before warm-up completes is cached on demand.

Older media caches remain available as an offline fallback during an update and are removed only after the new media cache warms without failures. After one successful online warm-up, still posters, animated GIFs, and retained local references remain available offline. Focused exercise screens use the cached GIF immediately; library grids use the lighter still posters.

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

- All 62 active guided names and all three review-gated lower-ab Phase 2 names resolve to reviewed animation metadata.
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
