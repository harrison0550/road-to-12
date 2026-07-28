# Road to 12% — Version 11.3

Upload all files in this folder to the same GitHub repository folder.

Version 11.3 adds:
- Complete guided workout flow
- Session briefing and muscle-group summary
- Warm-up, dynamic mobility, strength work, cooldown and stretching
- Looping animated movement demonstrations
- Step-by-step instructions and coaching cues
- RitFit M1 pulley, attachment and bench setup
- Set logging and rest/countdown timers
- Exercise library
- Workout-completion summary and saved progress

Existing Version 4.1 device data uses a different storage key, so it remains separate.

## Version 11.3 fixes
- Restored tappable seven-day training schedule on Home
- Added selected-day plan preview and routing
- Corrected iPhone text autosizing and responsive typography
- Prevented oversized headings, stat wrapping and cramped briefing cards
- Bumped service-worker cache so GitHub Pages loads the new CSS/JS


## Version 11.3 changes
- Removed the universal stick-figure animation
- Added exercise-specific animated media:
  - treadmill belt, console, walking stride and posture guide
  - RitFit M1 rack, pulley height, cable path and movement direction
  - squat, hip-hinge and shoulder-mobility movement patterns
- Added Demo / Setup / Steps tabs for every movement
- Reduced workout media height to a landscape format
- Added compact workout header and navigation
- Fixed Road to 12% title collision with the Reset button
- Added dynamic-viewport and Safari-safe spacing
- Added sticky Back / Complete controls above the navigation bar
- Preserved the tappable weekly training schedule from Version 5.1

These are lightweight in-app animations and do not require external GIF or video hosting.
The next media upgrade can replace any animation with an MP4 file without changing the workout flow.


## Version 11.3 changes
- Added Safari-specific animation reliability fixes
- Replaced the treadmill egg-shaped CSS body with a refined SVG human figure
- Added separate head, neck, torso, pelvis, upper/lower arms, thighs, shins and shoes
- Added joint-based walking movement with more natural arm and leg motion
- Added visible Play/Pause and Restart animation controls
- Prevented reduced-motion settings from freezing demonstrations completely
- Moved all media labels and descriptions outside the drawing area
- Removed sticky workout controls that covered the timer in Safari
- Added Start/Stop timer controls
- Added extra Safari-safe bottom spacing and dynamic viewport handling
- Preserved all Version 5.2 schedule, logging, setup and guided-workout features

## Version 11.3
- Interactive RitFit M1 setup coach using James' actual numbered rail photo
- Exact pin positions for each cable exercise
- Four stages: Pin Position, Attachment, Body Setup, Movement
- Position 1 is bottom; position 13 is top
- Chest Press 5/5; Row 1/1; Lat Pulldown 13/13; Shoulder Press 1/1; Pushdown 13; Curl 1
- Attachment, bench, facing direction, stance, starting posture and finish cues
- Preserves schedule, Safari fixes, timers, logging and progress


## Version 11.3
- Deploys the realistic Cable Chest Press instructional asset
- Deploys the complete RitFit M1, cable, barbell and bumper-plate visual library
- Adds full-screen zoom for detailed study on iPhone
- Replaces the Cable Chest Press cartoon demo with the realistic guide
- Keeps the exact M1 pin-position and setup coach beneath the visual
- Adds a redesigned Library dashboard with tappable exercise tiles
- Adds bumper-plate exercise references including squat, bench press, deadlift, overhead press, rows, hip thrust and split squat
- Adds video-ready player slots for future MP4 form demonstrations
- Preserves the weekly plan, timers, logging, progress and Safari layout fixes


## Version 11.3
- Shows only the current exercise asset inside guided workouts
- Moves the complete exercise poster to the Library tab only
- Adds separate Demo, Video, Setup and Steps tabs
- Removes fake play buttons from static images
- Adds dedicated cropped assets for chest press, row, pulldown, shoulder press, pushdown, curl, squat patterns, treadmill, rower, bike and stretching
- Adds trusted external video/form resources from Concept2, ACE, OriGym and Life Fitness
- Adds Rower Technique and Stationary Bike Setup to the Library
- Keeps exact RitFit M1 setup guidance in the Setup tab
- Preserves timers, logging, schedule, progress and Safari fixes


## Version 11.3
- Replaces the previous Full Body A images with the new consistent high-quality asset pack
- Adds dedicated current-exercise panels for:
  - Lat Pulldown
  - Seated Cable Row
  - Cable Chest Press
  - Cable Shoulder Press
  - Rope Triceps Pushdown
  - Cable Curl
  - Goblet Squat
- Keeps the full asset pack in Library only
- Embeds YouTube search players directly inside each Video tab using YouTube's privacy-enhanced domain
- Adds inline iPhone playback, fullscreen support and a fallback YouTube-results link
- Keeps Setup and Steps alongside the video so beginners can cross-check posture and equipment setup
- Adds a beginner safety reminder beneath every embedded player
- Preserves the M1 setup coach, weekly plan, timers, logs, progress and Safari layout fixes

Note: YouTube controls which videos allow embedding. The fallback link is shown only for videos that publishers block from embedded playback.


## Version 11.3
- Corrected rope pushdown asset
- Why This Exercise cards
- Beginner weight guidance
- Optional spoken Coach Mode
- Rest coaching messages
- Expanded equipment dashboard


## Version 11.3 — Equipment-Aware Workout
- Adds a persistent My Equipment control panel.
- Bumper plates, dumbbells and free-barbell work are disabled by default.
- Replaces Goblet Squat with an empty-bar Smith Machine Squat when dumbbells are unavailable.
- Shows substitutions before the workout and on the affected exercise page.
- Keeps cable, treadmill, bench and Smith-machine exercises available.
- Lets newly arrived equipment be enabled later without reinstalling the app.
- Adds a one-tap Start Equipment-Safe Workout button.
- Preserves Version 7.3 Coach Mode, videos, setup guides, timers and logging.

### Tonight
Leave Olympic bumper plates, dumbbells and free Olympic barbell switched off. The app will guide an equipment-safe Full Body A session using the RitFit M1, bench and treadmill.


## Version 11.3 — First Workout Feedback Build

This release preserves the same `road12v5` localStorage key so data from Version 7.4 can migrate forward on the same installed site.

### Completed workout experience
- Home changes to a celebration screen after today’s workout is complete.
- Today receives a green completion check in the weekly tracker.
- The main action becomes “View today’s completed workout.”
- Repeating a completed workout requires a deliberate confirmation.

### Detailed workout history
- Completed sessions store date, start/end time, duration, equipment profile, exercises, substitutions, sets, weights, reps and completion state.
- Workout History cards are tappable.
- Every session opens into an interactive set-by-set detail screen.
- Version 7.4 history entries are migrated and attempt to recover detailed values from the still-saved workout log.

### Clear cable weight entry
- Dual-stack exercises say “LB / STACK.”
- Enter the selector setting on one stack; the app displays the combined selected stack weight.
- Single-stack exercises explicitly say to enter the active stack’s selector setting.
- Smith squats record added plate weight and accept 0 for the empty Smith bar.

### Corrected exercise guidance
- Cable Shoulder Press now states: two separate D-handles, face away throughout, and cables outside the arms.
- The misleading bar-based shoulder-press sequence is no longer shown in the guided workout.
- Cable Curl now states: face the machine throughout, short straight bar, and underhand grip from start to finish.
- Both corrected exercises use a four-stage continuous setup/start/movement/return guide.

### Your actual attachments
- Equipment now includes an Attachment Locker.
- The user can photograph each actual attachment from the phone.
- Photos are resized and stored locally in the app.
- During each matching exercise, the app displays the photo with a “USE THIS ONE” label.


## Version 11.3 — Real-Workout Redesign
- Defaults the preferred name to Andy and adds an editable Profile field.
- Makes every weekly schedule day tappable with a full workout preview.
- Reorders Full Body A by M1 setup zone to reduce repeated pulley changes.
- Shows the setup route before starting and a banner when entering each new setup block.
- Removes Voice Coach, replay instructions, embedded videos, video tabs, old animation panels and animation controls.
- Removes the redundant photo of the real M1 numbered rail.
- Keeps the simplified 1–13 pin-position graphic.
- Replaces exercise tabs with one continuous page: purpose, attachment, pin setting, body setup, movement, weight and logging.
- Preserves Version 7.5 workout history, completion state and attachment photos.


## Version 11.3 — Visual Asset Restoration
- Restores exercise image assets to the single-page workout flow.
- Places each visual after setup and before movement steps.
- Makes standard visuals tappable for a full-screen view.
- Keeps corrected custom visual guides for Cable Shoulder Press and Cable Curl.
- Keeps videos, voice coaching, tabs and old animations removed.
- Updates the header to use the saved preferred name, defaulting to ANDY'S HOME GYM.
- Preserves Version 7.6 local history, settings, equipment and attachment photos.


## Version 11.3 — Phase 1 Visual Library
- Adds a unified red, white and charcoal anatomical illustration system.
- Adds individual visual guides for Cable Chest Press, Cable Shoulder Press, Cable Curl,
  Seated Cable Row, Lat Pulldown, Rope Triceps Pushdown and Smith Machine Squat.
- Adds M1 attachment, M1 pulley/bench/orientation and Smith machine setup reference panels.
- Replaces the matching realistic-human demonstration images with the new anatomical figures.
- Adds an in-app Phase 1 Visual Library button for reviewing the complete reference sheet.
- Preserves Version 7.7 workout history, settings, equipment profile and attachment photos.


## Version 11.3 — Phase 2 Visual Library
- Adds twelve new red-and-white anatomical exercise assets for the Full Body B and C expansion.
- Includes Incline Cable Press, Single-Arm Cable Row, Rear-Delt Cable Fly,
  Cable Lateral Raise, Cable Hammer Curl, High-to-Low Cable Chop,
  Cable Face Pull, Smith Machine Romanian Deadlift, Smith Bulgarian Split Squat,
  Smith Machine Calf Raise, Cable Crunch and Cable Straight-Arm Pushdown.
- Replaces the Phase 1-only library button with a two-tab Visual Libraries viewer.
- Makes Phase 2 asset paths automatically available when matching exercises are added to guided workouts.
- Preserves Version 8.0 local workout history, profile, equipment and uploaded attachment photos.


## Version 11.3 — Phase 3 Visual Library
- Adds treadmill walking, incline walking and HIIT interval guides.
- Adds complete rowing technique with catch, drive, finish and recovery.
- Adds KICKR CORE bike setup, endurance ride and HIIT ride guides.
- Adds dynamic warm-up, hip/glute mobility, thoracic/shoulder mobility,
  core activation, cooldown and recovery assets.
- Expands the in-app Visual Libraries viewer to Phase 1, Phase 2 and Phase 3.
- Automatically maps matching cardio, mobility and recovery entries to the new assets.
- Preserves Version 9.0 workout history, profile, equipment and attachment photos.


## Version 11.3 — Gym Mode and Progress Intelligence
- Removes the floating Visual Libraries banner from every screen.
- Rebuilds Home as a useful daily dashboard with readiness, recovery and tomorrow preview.
- Adds a distraction-free Gym Mode with pre-workout equipment setup cards.
- Adds workout block progress for warm-up, Smith and cable zones.
- Adds a Smith-machine plate calculator showing plates per side.
- Adds post-workout effort ratings and free-text workout notes.
- Reorganizes Library by Strength, Cardio, Warm-Up & Mobility, Equipment Setup and Recovery.
- Adds a muscle recovery map based on recently trained muscle groups.
- Adds personal records, lifetime selected volume and achievement tracking.
- Keeps all Phase 1–3 anatomical assets and automatically displays them in guided workouts.
- Preserves Version 10.0 workout history, profile, equipment and attachment photos.


## Version 11.3 — Simplified Home and Guided Workout
- Restores the motivating “You crushed it” completion card.
- Restores the tappable weekly training schedule.
- Adds a clean tomorrow-workout preview beneath the completion message.
- Removes Daily Readiness, hydration and nutrition controls from Home.
- Removes Gym Mode and the pre-workout setup checklist.
- Starts workouts directly with the first guided warm-up or exercise.
- Restores a simple step-by-step workout flow with setup, visual guide,
  instructions, logging and Continue.
- Keeps useful Version 11 features in their proper places:
  personal records, achievements, muscle recovery, notes, organized Library
  and the Smith-machine plate calculator.
- Preserves Version 11.0 local history, settings, equipment and attachments.


## Version 11.3 — Home Launch Repair
- Fixes the app reopening directly inside Exercise 1.
- Always opens on the motivating Home screen after launch.
- Preserves an unfinished workout without forcing it onto the screen.
- Adds a clean Start/Resume screen when the Workout tab is tapped.
- Restores the bottom navigation during guided workouts.
- Keeps the simple step-by-step workout flow from Version 11.1.
- Removes all remaining Gym Mode launch behavior.
- Preserves Version 11.1 history, logs, profile, equipment and attachment photos.


## Version 11.3 — History Recovery and Anatomical Asset Audit
- Keeps the latest “You crushed it” achievement on Home after the calendar date changes.
- Shows the latest completed workout date, duration, sets and direct history link.
- Keeps the weekly schedule and selected-workout preview on Home.
- Shows the saved workout-history count on Home and Progress.
- Searches same-origin Road to 12% local-storage records and merges recoverable history.
- Adds JSON Export Backup and Import Backup controls in Progress.
- Hides the prominent Reset control from Home.
- Audits every current workout and library exercise for anatomical assets.
- Replaces old treadmill, stretching, squat, hip-hinge, rower, bike and Goblet Squat
  realistic/demo images with Phase 1–3 anatomical guides.
- Adds a final render guard so mapped exercises cannot fall back to realistic images.
- Preserves Version 11.2 profile, equipment, attachment photos and active workout state.
