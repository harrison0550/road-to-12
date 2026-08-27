(function (root) {
  const mediaReviewDate = "2026-08-26";
  const wgerLicense = Object.freeze({
    shortName: "CC-BY-SA 4.0",
    fullName: "Creative Commons Attribution-ShareAlike 4.0",
    url: "https://creativecommons.org/licenses/by-sa/4.0/"
  });

  const ritfit = ({
    sourceExercise,
    sourceDocument,
    media,
    mediaAlt,
    primaryMuscles,
    secondaryMuscles = [],
    equipment,
    commonMistakes
  }) => ({
    sourceType: "official-manual",
    provider: "RitFit",
    providerUrl: "https://www.ritfitsports.com/",
    sourceExercise,
    sourceDocument,
    author: "RitFit",
    media: `assets/exercise-library/ritfit/${media}`,
    mediaAlt,
    primaryMuscles,
    secondaryMuscles,
    equipment,
    commonMistakes,
    mediaType: "still",
    reviewedOn: mediaReviewDate,
    rightsNote: "Official equipment poster supplied by the user for this personal, private training app."
  });

  const road12Illustration = ({
    sourceExercise,
    media,
    mediaAlt,
    primaryMuscles,
    secondaryMuscles = [],
    equipment,
    commonMistakes
  }) => ({
    sourceType: "app-original",
    provider: "Road to 12%",
    sourceExercise,
    author: "Road to 12%",
    media: `assets/exercise-library/original/${media}`,
    mediaAlt,
    primaryMuscles,
    secondaryMuscles,
    equipment,
    commonMistakes,
    mediaType: "still",
    reviewedOn: mediaReviewDate,
    rightsNote: "App-created instructional illustration. Written setup and movement cues remain the authoritative coaching guide."
  });

  const entries = {
    "Dumbbell Lateral Raise": road12Illustration({
      sourceExercise: "Standing dumbbell lateral raise",
      media: "dumbbell-lateral-raise-animation.gif",
      mediaAlt: "Animated demonstration of a man raising two 10 pound dumbbells from beside his thighs to shoulder height with a controlled torso",
      primaryMuscles: ["Side shoulders"],
      secondaryMuscles: ["Upper back", "Core stabilizers"],
      equipment: ["Two 10 lb dumbbells"],
      commonMistakes: ["Shrugging the shoulders", "Swinging the torso", "Raising above shoulder height", "Locking the elbows"]
    }),
    "Dumbbell Floor Press": road12Illustration({
      sourceExercise: "Dumbbell floor press",
      media: "dumbbell-floor-press-animation.gif",
      mediaAlt: "Animated demonstration of a man pressing two 10 pound dumbbells from a controlled floor position to above the chest",
      primaryMuscles: ["Chest"],
      secondaryMuscles: ["Front shoulders", "Triceps"],
      equipment: ["Two 10 or 15 lb dumbbells", "Exercise mat or comfortable floor space"],
      commonMistakes: ["Bouncing the elbows from the floor", "Letting wrists bend backward", "Letting the dumbbells collide", "Flaring the elbows too wide"]
    }),
    "Dumbbell Romanian Deadlift": road12Illustration({
      sourceExercise: "Dumbbell Romanian deadlift",
      media: "dumbbell-romanian-deadlift-animation.gif",
      mediaAlt: "Animated demonstration of a man hinging from a tall start while keeping two 15 pound dumbbells close to his legs and his spine neutral",
      primaryMuscles: ["Hamstrings", "Glutes"],
      secondaryMuscles: ["Upper back", "Core", "Grip"],
      equipment: ["Two 15 lb dumbbells"],
      commonMistakes: ["Turning the hinge into a squat", "Rounding the back", "Letting the weights drift forward", "Leaning backward at the finish"]
    }),
    "Dead Bug": road12Illustration({
      sourceExercise: "Alternating dead bug",
      media: "dead-bug-animation.gif",
      mediaAlt: "Animated demonstration of a man lying on his back in tabletop position, extending one arm overhead with the opposite leg while keeping his trunk controlled, and returning to the start",
      primaryMuscles: ["Deep core"],
      secondaryMuscles: ["Hip flexors", "Shoulders"],
      equipment: ["Exercise mat or comfortable floor space"],
      commonMistakes: ["Allowing the lower back to lift", "Extending the same-side arm and leg", "Moving too quickly", "Holding the breath"]
    }),
    "Bird Dog": road12Illustration({
      sourceExercise: "Alternating bird dog",
      media: "bird-dog-animation.gif",
      mediaAlt: "Animated three-position demonstration of a man beginning on hands and knees, extending the left arm with the right leg while keeping the torso level, and returning under control",
      primaryMuscles: ["Deep core", "Glutes"],
      secondaryMuscles: ["Shoulders", "Upper back"],
      equipment: ["Exercise mat or comfortable floor space"],
      commonMistakes: ["Lifting the arm or leg too high", "Rotating the hips", "Arching the lower back", "Moving too quickly"]
    }),
    "Side Plank from Knees": road12Illustration({
      sourceExercise: "Modified side plank from knees",
      media: "side-plank-from-knees-animation.gif",
      mediaAlt: "Animated demonstration of a man lying on his side with knees bent, lifting his hips into a straight line from shoulders through knees, and lowering under control",
      primaryMuscles: ["Obliques", "Deep core"],
      secondaryMuscles: ["Glutes", "Shoulder stabilizers"],
      equipment: ["Exercise mat or comfortable floor space"],
      commonMistakes: ["Elbow drifting away from the shoulder", "Rolling the top hip backward", "Letting the hips sag", "Holding longer than controlled form allows"]
    }),
    "Arm Circles": road12Illustration({
      sourceExercise: "Standing bodyweight arm circles",
      media: "arm-circles-posture.webp",
      mediaAlt: "Front-view illustration of a tall standing arm-circle posture with both arms extended at shoulder height and red circular motion arrows around the hands",
      primaryMuscles: ["Shoulders"],
      secondaryMuscles: ["Upper back"],
      equipment: ["No equipment"],
      commonMistakes: ["Shrugging the shoulders", "Lowering the arms below shoulder height", "Moving too quickly or forcing the range"]
    }),
    "Bodyweight Squat": road12Illustration({
      sourceExercise: "Standing bodyweight squat",
      media: "bodyweight-squat-posture.webp",
      mediaAlt: "Side-by-side illustration of a tall bodyweight-squat start and a controlled parallel-depth squat with heels planted, knees tracking over the toes, and arms extended forward",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Hips", "Core", "Ankles"],
      equipment: ["No equipment"],
      commonMistakes: ["Letting the knees collapse inward", "Lifting the heels", "Rounding the back or forcing excessive depth"]
    }),
    "Cable Hammer Curl": road12Illustration({
      sourceExercise: "Rope cable hammer curl on a red cage-style Smith machine",
      media: "cable-hammer-curl-red-cage.webp",
      mediaAlt: "Start and finish positions for a neutral-grip rope hammer curl, with the athlete facing the same single front post and its low pulley on a red cage-style Smith machine",
      primaryMuscles: ["Biceps", "Brachialis"],
      secondaryMuscles: ["Forearms"],
      equipment: ["Red cage-style Smith machine", "One low inner front-left pulley", "Triceps rope"],
      commonMistakes: ["Swinging the torso", "Letting the elbows travel forward", "Changing from a neutral grip"]
    }),
    "Incline Cable Press": road12Illustration({
      sourceExercise: "Incline cable press in a cage-style Smith machine",
      media: "incline-cable-press-cage.webp",
      mediaAlt: "Start and finish positions for an incline cable press inside a red cage-style Smith machine, with cables running from low pulleys on both front posts",
      primaryMuscles: ["Upper chest"],
      secondaryMuscles: ["Front shoulders", "Triceps"],
      equipment: ["Red cage-style Smith machine", "Two low front-post pulleys", "Two D-handles", "Low-incline bench"],
      commonMistakes: ["Setting the pulleys too high", "Shrugging the shoulders", "Overarching the lower back"]
    }),
    "Lat Pulldown": road12Illustration({
      sourceExercise: "Single-cable seated lat pulldown on a red cage-style Smith machine",
      media: "lat-pulldown-red-cage.webp",
      mediaAlt: "Start and finish positions for a seated lat pulldown facing one red front post, with one high cable connected to the center of the wide bar",
      primaryMuscles: ["Lats", "Upper back"],
      secondaryMuscles: ["Biceps"],
      equipment: ["Red cage-style Smith machine", "One high front-post pulley", "One cable connected to the center of the wide lat bar", "Upright bench"],
      commonMistakes: ["Pulling the bar behind the neck", "Swinging the torso backward", "Shrugging the shoulders"]
    }),
    "Hip Hinge": road12Illustration({
      sourceExercise: "Bodyweight hip hinge posture",
      media: "hip-hinge-posture.webp",
      mediaAlt: "Side-by-side illustration of a standing start and a hip hinge with soft knees, hips pushed backward, and a long neutral spine",
      primaryMuscles: ["Hamstrings", "Glutes"],
      secondaryMuscles: ["Core", "Back extensors"],
      equipment: ["No equipment"],
      commonMistakes: ["Turning the hinge into a squat", "Rounding the back", "Shifting weight onto the toes"]
    }),
    "Treadmill Walk": road12Illustration({
      sourceExercise: "Treadmill walking posture",
      media: "treadmill-walk-posture.webp",
      mediaAlt: "Side-view illustration of an upright treadmill walk with relaxed shoulders, free arms, and the safety clip attached",
      primaryMuscles: ["Legs", "Cardiovascular system"],
      secondaryMuscles: ["Core", "Postural muscles"],
      equipment: ["Treadmill", "Safety clip"],
      commonMistakes: ["Leaning on the console", "Holding the rails continuously", "Taking overly long strides"]
    }),
    "Easy Treadmill Cooldown": road12Illustration({
      sourceExercise: "Easy treadmill cooldown posture",
      media: "treadmill-walk-posture.webp",
      mediaAlt: "Side-view illustration of an easy upright treadmill walk with the safety clip attached",
      primaryMuscles: ["Legs", "Cardiovascular system"],
      secondaryMuscles: ["Core", "Postural muscles"],
      equipment: ["Treadmill", "Safety clip"],
      commonMistakes: ["Stopping abruptly at a high speed", "Leaning on the console", "Stepping off before the belt stops"]
    }),
    "Cable Chest Press": ritfit({
      sourceExercise: "Chest Press",
      sourceDocument: "M1-C Workout Poster",
      media: "cable-chest-press.webp",
      mediaAlt: "RitFit chest press start and finish positions",
      primaryMuscles: ["Chest"],
      secondaryMuscles: ["Front shoulders", "Triceps"],
      equipment: ["RitFit M1", "Two D-handles"],
      commonMistakes: ["Shrugging the shoulders", "Arching the lower back", "Letting the elbows flare too high"]
    }),
    "Seated Cable Row": ritfit({
      sourceExercise: "Seated Row",
      sourceDocument: "BPC06 Workout Poster",
      media: "seated-cable-row.webp",
      mediaAlt: "RitFit seated cable row start and finish positions using a close-grip row handle",
      primaryMuscles: ["Mid-back", "Lats"],
      secondaryMuscles: ["Rear shoulders", "Biceps"],
      equipment: ["RitFit cable station", "One low front-post pulley", "Close-grip row handle", "Bench"],
      commonMistakes: ["Rounding the back", "Leaning far backward", "Pulling with shrugged shoulders"]
    }),
    "Cable Shoulder Press": ritfit({
      sourceExercise: "Seated Vertical Bench Press",
      sourceDocument: "BPC06 Workout Poster",
      media: "cable-shoulder-press.webp",
      mediaAlt: "RitFit seated cable shoulder press start and finish positions",
      primaryMuscles: ["Shoulders"],
      secondaryMuscles: ["Triceps", "Upper chest"],
      equipment: ["RitFit cable station", "Two D-handles", "Upright bench"],
      commonMistakes: ["Using a straight bar", "Allowing a cable to cross the back", "Overarching the lower back"]
    }),
    "Rope Triceps Pushdown": {
      sourceType: "licensed-community",
      provider: "wger Workout Manager",
      providerUrl: "https://wger.de/",
      sourceExercise: "Tricep Pushdown on Cable",
      sourceExerciseId: 805,
      sourceUrl: "https://wger.de/en/exercise/805/view",
      author: "cshep442",
      media: "assets/exercise-library/wger/triceps-pushdown.webp",
      mediaAlt: "Start and finish positions for a cable rope triceps pushdown",
      primaryMuscles: ["Triceps"],
      secondaryMuscles: [],
      equipment: ["RitFit cable station", "Rope attachment"],
      commonMistakes: ["Letting the elbows drift forward", "Moving the shoulders or torso", "Snapping into elbow lockout"],
      license: wgerLicense
    },
    "Cable Curl": ritfit({
      sourceExercise: "Curl",
      sourceDocument: "M1-C Workout Poster",
      media: "cable-curl.webp",
      mediaAlt: "RitFit cable curl start and finish positions",
      primaryMuscles: ["Biceps"],
      secondaryMuscles: ["Forearms"],
      equipment: ["RitFit M1", "Short straight bar"],
      commonMistakes: ["Changing grip during the set", "Swinging the torso", "Allowing the elbows to travel forward"]
    }),
    "Smith Machine Squat": ritfit({
      sourceExercise: "Barbell Squat",
      sourceDocument: "M1-C Workout Poster",
      media: "smith-machine-squat.webp",
      mediaAlt: "RitFit squat standing and bottom positions",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Hamstrings", "Core"],
      equipment: ["RitFit M1 Smith station"],
      commonMistakes: ["Letting the knees collapse inward", "Lifting the heels", "Descending below a controllable depth"]
    }),
    "Smith Machine RDL": ritfit({
      sourceExercise: "Romanian Deadlift",
      sourceDocument: "M1-C Workout Poster",
      media: "smith-machine-rdl.webp",
      mediaAlt: "RitFit Romanian deadlift start and finish positions",
      primaryMuscles: ["Hamstrings", "Glutes"],
      secondaryMuscles: ["Back extensors", "Core"],
      equipment: ["RitFit M1 Smith station"],
      commonMistakes: ["Turning the hinge into a squat", "Rounding the back", "Letting the bar drift away from the legs"]
    }),
    "Smith Bulgarian Split Squat": {
      sourceType: "licensed-community",
      provider: "wger Workout Manager",
      providerUrl: "https://wger.de/",
      sourceExercise: "Smith Machine Split Squat",
      sourceExerciseId: 1593,
      sourceUrl: "https://wger.de/en/exercise/1593/view",
      originalSourceUrl: "https://www.docteur-fitness.com/split-squat-a-la-smith-machine",
      author: "workout@rooven.anonaddy.me",
      media: "assets/exercise-library/wger/smith-split-squat.gif",
      mediaAlt: "Looping Smith machine split squat demonstration",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Hamstrings", "Core"],
      equipment: ["RitFit M1 Smith station", "Bench"],
      commonMistakes: ["Using a stance that is too short", "Letting the front knee cave inward", "Pushing primarily through the rear foot"],
      license: wgerLicense
    },
    "Smith Machine Calf Raise": ritfit({
      sourceExercise: "Barbell Calf Raise",
      sourceDocument: "M1-C Workout Poster",
      media: "smith-machine-calf-raise.webp",
      mediaAlt: "RitFit calf raise bottom and top positions",
      primaryMuscles: ["Calves"],
      secondaryMuscles: ["Foot and ankle stabilizers"],
      equipment: ["RitFit M1 Smith station"],
      commonMistakes: ["Bouncing through the repetitions", "Rolling the ankles outward", "Using a shortened range of motion"]
    }),
    "Single Arm Cable Row": ritfit({
      sourceExercise: "Single Arm Row",
      sourceDocument: "BPC06 Workout Poster",
      media: "single-arm-cable-row.webp",
      mediaAlt: "RitFit single-arm cable row start and finish positions",
      primaryMuscles: ["Lats", "Mid-back"],
      secondaryMuscles: ["Biceps", "Rear shoulders", "Core"],
      equipment: ["RitFit cable station", "One D-handle"],
      commonMistakes: ["Twisting the torso", "Shrugging the working shoulder", "Jerking the handle"]
    }),
    "Cable Lateral Raise": ritfit({
      sourceExercise: "Crossover Lateral Raise",
      sourceDocument: "BPC06 Workout Poster",
      media: "cable-lateral-raise.webp",
      mediaAlt: "RitFit cable lateral raise start and finish positions",
      primaryMuscles: ["Side shoulders"],
      secondaryMuscles: ["Upper traps"],
      equipment: ["RitFit cable station", "Two D-handles"],
      commonMistakes: ["Shrugging toward the ears", "Swinging the weights", "Raising the hands far above shoulder height"]
    }),
    "Cable Crunch": ritfit({
      sourceExercise: "Ab Crunch",
      sourceDocument: "M1-C Workout Poster",
      media: "cable-crunch.webp",
      mediaAlt: "RitFit kneeling cable crunch start and finish positions",
      primaryMuscles: ["Abdominals"],
      secondaryMuscles: ["Obliques"],
      equipment: ["RitFit M1", "Rope attachment"],
      commonMistakes: ["Hinging only at the hips", "Pulling with the arms", "Letting the weight pull the lower back into extension"]
    }),
    "Rear Delt Cable Fly": ritfit({
      sourceExercise: "Reverse Fly",
      sourceDocument: "BPC06 Workout Poster",
      media: "rear-delt-cable-fly.webp",
      mediaAlt: "RitFit reverse cable fly start and finish positions",
      primaryMuscles: ["Rear shoulders"],
      secondaryMuscles: ["Upper back"],
      equipment: ["RitFit cable station", "Two D-handles"],
      commonMistakes: ["Shrugging the shoulders", "Using momentum", "Turning the exercise into a row"]
    }),
    "Cable Face Pull": ritfit({
      sourceExercise: "Face Pull",
      sourceDocument: "BPC06 Workout Poster",
      media: "cable-face-pull.webp",
      mediaAlt: "RitFit face pull start and finish positions",
      primaryMuscles: ["Rear shoulders", "Upper back"],
      secondaryMuscles: ["Rotator cuff", "Biceps"],
      equipment: ["RitFit cable station", "Rope attachment"],
      commonMistakes: ["Pulling toward the chest instead of the face", "Flaring the ribs", "Shrugging the shoulders"]
    }),
    "Cable Straight Arm Pushdown": ritfit({
      sourceExercise: "Lat Pushdown",
      sourceDocument: "M1-C Workout Poster",
      media: "straight-arm-pulldown.webp",
      mediaAlt: "RitFit straight-arm lat pushdown start and finish positions",
      primaryMuscles: ["Lats"],
      secondaryMuscles: ["Triceps", "Core"],
      equipment: ["RitFit M1", "Straight bar"],
      commonMistakes: ["Turning it into a triceps pushdown", "Rounding the back", "Using body momentum"]
    }),
    "High to Low Cable Chop": ritfit({
      sourceExercise: "Wood Chop",
      sourceDocument: "M1-C Workout Poster",
      media: "high-to-low-cable-chop.webp",
      mediaAlt: "RitFit high-to-low cable wood chop start and finish positions",
      primaryMuscles: ["Obliques", "Abdominals"],
      secondaryMuscles: ["Shoulders", "Hips"],
      equipment: ["RitFit M1", "D-handle"],
      commonMistakes: ["Pulling only with the arms", "Twisting through the knees", "Moving too quickly to control the return"]
    }),
    "Hip Flexor Mobility": road12Illustration({
      sourceExercise: "Half-kneeling hip flexor mobility stretch",
      media: "hip-flexor-mobility.webp",
      mediaAlt: "Side-by-side illustration of a tall half-kneeling start and a small controlled forward hip shift with the rear knee supported on a mat",
      primaryMuscles: ["Hip flexors"],
      secondaryMuscles: ["Quadriceps"],
      equipment: ["Exercise mat"],
      commonMistakes: ["Arching the lower back", "Leaning the torso instead of shifting the hips", "Forcing a deep or painful lunge"]
    }),
    "Hamstring Mobility": road12Illustration({
      sourceExercise: "Supported standing hamstring mobility stretch",
      media: "hamstring-mobility.webp",
      mediaAlt: "Side-by-side illustration of a supported standing hamstring stretch, beginning tall with one heel on a low bench and finishing with a long-spine hip hinge",
      primaryMuscles: ["Hamstrings"],
      secondaryMuscles: ["Calves"],
      equipment: ["Low bench or stable platform"],
      commonMistakes: ["Rounding the back", "Bouncing into the stretch", "Locking the standing knee or forcing a painful range"]
    }),
    "Chest and Shoulder Mobility": road12Illustration({
      sourceExercise: "Standing wall slide from W to Y",
      media: "chest-shoulder-mobility.webp",
      mediaAlt: "Side-by-side illustration of a wall slide, beginning with the arms in a W shape and finishing in a wide overhead Y without shrugging or arching the back",
      primaryMuscles: ["Shoulders", "Upper back"],
      secondaryMuscles: ["Chest", "Serratus anterior"],
      equipment: ["Clear wall"],
      commonMistakes: ["Arching the lower back", "Shrugging the shoulders", "Forcing the hands or elbows against the wall"]
    }),
    "Stationary Bike Setup": {
      sourceType: "app-original",
      provider: "Road to 12%",
      providerUrl: "",
      sourceExercise: "KICKR CORE stationary bike setup",
      author: "Road to 12%",
      media: "assets/phase3/kickr-core-bike-setup.jpg",
      mediaAlt: "KICKR CORE bike setup guide showing a slight knee bend at the bottom of the pedal stroke, a gentle forward hip hinge, soft elbows, and the ball of the foot over the pedal spindle",
      mediaType: "still",
      reviewedOn: mediaReviewDate,
      primaryMuscles: ["Legs", "Cardiovascular system"],
      secondaryMuscles: ["Core", "Postural muscles"],
      equipment: ["KICKR CORE", "Bicycle", "Trainer"],
      commonMistakes: ["Setting the saddle too high or too low", "Locking the elbows", "Rounding the back", "Placing the foot too far forward or backward on the pedal"],
      rightsNote: "App-created equipment setup reference. Written setup and movement cues remain the authoritative coaching guide."
    }
  };

  const existingAnimations = {
    "Dumbbell Lateral Raise": "dumbbell-lateral-raise-motion-guide.webp",
    "Dumbbell Floor Press": "dumbbell-floor-press-motion-guide.webp",
    "Dumbbell Romanian Deadlift": "dumbbell-romanian-deadlift-motion-guide.webp",
    "Dead Bug": "dead-bug-motion-guide.webp",
    "Bird Dog": "bird-dog-motion-guide.webp",
    "Side Plank from Knees": "side-plank-from-knees-motion-guide.webp"
  };

  Object.entries(existingAnimations).forEach(([name, motionPoster]) => {
    Object.assign(entries[name], {
      mediaType: "animation",
      motionPoster: `assets/exercise-library/original/${motionPoster}`,
      reviewedOn: mediaReviewDate
    });
  });

  function generatedReference(media, mediaAlt, sourceExercise) {
    return Object.freeze({
      sourceType: "app-original",
      provider: "Road to 12%",
      author: "Road to 12%",
      sourceExercise,
      media,
      mediaAlt,
      mediaType: "still",
      reviewedOn: mediaReviewDate,
      rightsNote: "App-created setup reference. Written setup and movement cues remain the authoritative coaching guide."
    });
  }

  function registerAnimation(name, config) {
    const previous = entries[name] || {};
    let reference = config.reference || null;
    if (config.retainPreviousReference !== false && !reference && previous.media && previous.mediaType !== "animation" && !/\.gif(?:$|\?)/i.test(previous.media)) {
      reference = Object.freeze(Object.assign({}, previous, { mediaType: "still" }));
    }
    entries[name] = Object.assign({}, previous, {
      sourceType: "app-original",
      provider: "Road to 12%",
      providerUrl: "",
      sourceExercise: config.sourceExercise || previous.sourceExercise || name,
      author: "Road to 12%",
      media: `assets/exercise-library/generated/${config.slug}.gif`,
      motionPoster: `assets/exercise-library/generated/${config.slug}-motion-guide.webp`,
      mediaAlt: config.mediaAlt,
      mediaType: "animation",
      reviewedOn: config.reviewedOn || mediaReviewDate,
      primaryMuscles: config.primaryMuscles || previous.primaryMuscles || [],
      secondaryMuscles: config.secondaryMuscles || previous.secondaryMuscles || [],
      equipment: config.equipment || previous.equipment || [],
      commonMistakes: config.commonMistakes || previous.commonMistakes || [],
      reference,
      rightsNote: "App-created movement animation assembled from reviewed positions. Written setup and movement cues remain the authoritative coaching guide."
    });
  }

  const animationConfigs = {
    "Arm Circles": {
      slug: "arm-circles",
      mediaAlt: "Movement animation of the red-shirt trainer standing tall with both arms at shoulder height and making controlled forward and backward circles"
    },
    "Bodyweight Squat": {
      slug: "bodyweight-squat",
      mediaAlt: "Movement animation of the red-shirt trainer moving from a tall stance into a controlled squat with heels planted and knees tracking over the toes"
    },
    "Hip Hinge": {
      slug: "hip-hinge",
      mediaAlt: "Movement animation of the red-shirt trainer pushing the hips backward with soft knees and a long neutral spine before returning to stand"
    },
    "Goblet Squat": {
      slug: "goblet-squat",
      sourceExercise: "Goblet squat with one dumbbell",
      mediaAlt: "Movement animation of the red-shirt trainer holding one dumbbell vertically at the chest while squatting with heels planted and standing under control",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Hamstrings", "Core"],
      equipment: ["One 10 or 15 lb dumbbell"],
      commonMistakes: ["Letting the knees collapse inward", "Lifting the heels", "Holding the dumbbell away from the chest", "Forcing excessive depth"]
    },
    "Treadmill Walk": {
      slug: "treadmill-easy-walk",
      mediaAlt: "Movement animation of the red-shirt trainer walking upright on a level treadmill through a long stride and mid-stance while the safety clip remains attached"
    },
    "Easy Treadmill Cooldown": {
      slug: "treadmill-easy-walk",
      mediaAlt: "Movement animation of the red-shirt trainer walking at an easy upright pace on a level treadmill with relaxed shoulders and the safety clip attached"
    },
    "Incline Treadmill Walk": {
      slug: "treadmill-incline-walk",
      sourceExercise: "Incline treadmill walk",
      mediaAlt: "Movement animation of the red-shirt trainer walking uphill on an inclined treadmill through stride and mid-stance without holding the rails",
      primaryMuscles: ["Glutes", "Hamstrings", "Calves"],
      secondaryMuscles: ["Core", "Cardiovascular system"],
      equipment: ["Treadmill", "Safety clip"],
      commonMistakes: ["Holding the rails continuously", "Bending forward at the waist", "Taking overly long steps", "Choosing an incline that prevents conversation"]
    },
    "Treadmill HIIT Intervals": {
      slug: "treadmill-hiit-interval",
      sourceExercise: "Controlled treadmill running intervals",
      mediaAlt: "Movement animation of the red-shirt trainer running with a compact stride beneath the hips and reciprocal arm drive while the treadmill safety clip stays attached",
      primaryMuscles: ["Legs", "Cardiovascular system"],
      secondaryMuscles: ["Core", "Arms"],
      equipment: ["Treadmill", "Safety clip"],
      commonMistakes: ["Overstriding", "Holding the rails", "Sprinting beyond control", "Skipping the recovery pace"]
    },
    "iFIT Rowing Technique": {
      slug: "ifit-rowing-technique",
      sourceExercise: "Indoor rowing catch, drive, finish and recovery",
      mediaAlt: "Four-position movement animation of the red-shirt trainer progressing through the rowing catch, leg-led drive, controlled finish and arms-first recovery",
      primaryMuscles: ["Quadriceps", "Glutes", "Back"],
      secondaryMuscles: ["Hamstrings", "Arms", "Core", "Cardiovascular system"],
      equipment: ["iFIT rowing machine"],
      commonMistakes: ["Pulling with the arms before driving the legs", "Rounding the lower back", "Leaning too far backward", "Bending the knees before the handle clears them"],
      reference: generatedReference("assets/phase3/rower-technique.jpg", "Four-position Road to 12% rowing technique reference covering catch, drive, finish and recovery", "Indoor rowing technique")
    },
    "Hip Flexor Mobility": {
      slug: "hip-flexor-mobility",
      mediaAlt: "Movement animation of the red-shirt trainer moving from a tall half-kneeling position into a small forward hip shift while keeping the torso upright"
    },
    "Hamstring Mobility": {
      slug: "hamstring-mobility",
      mediaAlt: "Movement animation of the red-shirt trainer beginning tall with one heel on a bench and hinging forward with a long spine for a gentle hamstring stretch"
    },
    "Chest and Shoulder Mobility": {
      slug: "chest-shoulder-mobility",
      mediaAlt: "Movement animation of the red-shirt trainer sliding both arms along a wall from a controlled W position into a wide overhead Y without shrugging"
    },
    "Hip and Glute Mobility": {
      slug: "hip-glute-mobility",
      sourceExercise: "Seated figure-four hip and glute stretch",
      mediaAlt: "Three-position movement animation of the red-shirt trainer sitting tall, crossing one ankle over the opposite thigh and hinging forward with a neutral spine",
      primaryMuscles: ["Glutes", "Outer hips"],
      secondaryMuscles: ["Lower back"],
      equipment: ["Stable bench"],
      commonMistakes: ["Pressing forcefully on the raised knee", "Rounding the back", "Letting the raised foot relax inward", "Forcing a painful range"]
    },
    "Slow Breathing Cooldown": {
      slug: "slow-breathing-cooldown",
      sourceExercise: "Seated diaphragmatic breathing cooldown",
      mediaAlt: "Three-position movement animation of the red-shirt trainer seated comfortably with hands on the lower ribs through a gentle inhale and longer relaxed exhale",
      primaryMuscles: ["Diaphragm"],
      secondaryMuscles: ["Intercostals", "Postural muscles"],
      equipment: ["Exercise mat or comfortable seat"],
      commonMistakes: ["Shrugging during the inhale", "Forcing the breath", "Holding the breath", "Tensing the jaw or shoulders"]
    },
    "Post-Workout Stretch": {
      slug: "post-workout-stretch",
      sourceExercise: "Post-workout chest, lat, quadriceps and hip-flexor stretching",
      mediaAlt: "Four-position movement guide of the red-shirt trainer performing gentle doorway chest, supported lat, standing quadriceps and half-kneeling hip-flexor stretches",
      primaryMuscles: ["Chest", "Lats", "Quadriceps", "Hip flexors"],
      secondaryMuscles: ["Shoulders", "Glutes"],
      equipment: ["Doorway or wall", "Stable bench", "Exercise mat"],
      commonMistakes: ["Bouncing", "Forcing a painful range", "Arching the lower back", "Twisting a supported knee"]
    },
    "Zone 2 Cardio": {
      slug: "zone-2-cardio",
      sourceExercise: "KICKR CORE example for steady conversational-pace Zone 2 cardio",
      mediaAlt: "Movement animation of the red-shirt trainer maintaining a smooth steady cycling cadence on the KICKR CORE option; the written setup also offers treadmill and rower choices",
      primaryMuscles: ["Cardiovascular system", "Legs"],
      secondaryMuscles: ["Core", "Postural muscles"],
      equipment: ["Treadmill, iFIT rower or KICKR CORE"],
      commonMistakes: ["Letting effort rise above conversational pace", "Starting too hard", "Holding unnecessary tension", "Skipping gradual warm-up and cooldown"]
    },
    "Cable Chest Press": {
      slug: "cable-chest-press",
      mediaAlt: "Movement animation of the red-shirt trainer pressing two cable handles forward from chest height on the red RitFit cage while keeping the torso braced"
    },
    "Smith Machine Bench Press": {
      slug: "smith-machine-bench-press",
      sourceExercise: "Flat Smith machine bench press on the RitFit M1 Pro",
      mediaAlt: "Movement animation of the red-shirt trainer pressing the Smith bar from the lower-to-middle chest on a flat bench inside the complete red RitFit cage with feet planted and shoulder blades pinned",
      primaryMuscles: ["Chest"],
      secondaryMuscles: ["Triceps", "Front shoulders"],
      equipment: ["RitFit M1 Pro Smith station", "Gator flat bench", "Optional matched bumper plates"],
      commonMistakes: ["Placing the bench outside the correct bar path", "Flaring the elbows beyond a controlled angle", "Letting the shoulders roll forward", "Bouncing the bar or forcing depth"]
    },
    "Low-Incline Dumbbell Press": {
      slug: "low-incline-dumbbell-press",
      sourceExercise: "Low-incline dumbbell chest press",
      mediaAlt: "Movement animation of the red-shirt trainer pressing two matching dumbbells upward and slightly inward from outside the upper chest on a low-incline bench with feet planted",
      primaryMuscles: ["Upper chest"],
      secondaryMuscles: ["Triceps", "Front shoulders"],
      equipment: ["Gator adjustable bench at 15 to 30 degrees", "One matching dumbbell pair"],
      commonMistakes: ["Setting the bench too steep", "Letting the elbows flare excessively", "Clanging the dumbbells together", "Rolling the shoulders forward at the top"]
    },
    "Seated Cable Row": {
      slug: "seated-cable-row",
      mediaAlt: "Movement animation of the red-shirt trainer using both hands to row one close-grip handle on one low cable toward the lower ribs with a tall torso and controlled return"
    },
    "Lat Pulldown": {
      slug: "lat-pulldown",
      mediaAlt: "Movement animation of the red-shirt trainer seated facing the red cage, pulling a centered single-cable lat bar toward the upper chest and returning overhead"
    },

    "Cable Shoulder Press": {
      slug: "cable-shoulder-press",
      mediaAlt: "Movement animation of the red-shirt trainer seated facing away from the red cage and pressing two separate cable handles overhead with cables outside the arms",
      retainPreviousReference: false
    },
    "Rope Triceps Pushdown": {
      slug: "rope-triceps-pushdown",
      mediaAlt: "Movement animation of the red-shirt trainer pressing a rope attachment down from a high cable while the elbows stay pinned beside the ribs"
    },
    "Cable Curl": {
      slug: "cable-curl",
      mediaAlt: "Movement animation of the red-shirt trainer facing one low cable and curling a short straight bar with an underhand grip while the elbows remain still"
    },
    "Smith Machine RDL": {
      slug: "smith-machine-rdl",
      mediaAlt: "Movement animation of the red-shirt trainer hinging with the Smith bar close to the thighs and shins while keeping a neutral spine",
      retainPreviousReference: false
    },
    "Smith Bulgarian Split Squat": {
      slug: "smith-bulgarian-split-squat",
      mediaAlt: "Movement animation of the red-shirt trainer lowering and standing in a Smith split squat with the rear foot supported and front knee tracking over the toes",
      retainPreviousReference: false
    },
    "Smith Machine Calf Raise": {
      slug: "smith-machine-calf-raise",
      mediaAlt: "Movement animation of the red-shirt trainer raising and lowering both heels under the Smith bar through a controlled calf-raise range",
      retainPreviousReference: false
    },
    "Smith Machine Squat": {
      slug: "smith-machine-squat",
      mediaAlt: "Movement animation of the red-shirt trainer descending and standing under the Smith bar with heels planted and knees tracking over the toes",
      retainPreviousReference: false
    },
    "Incline Cable Press": {
      slug: "incline-cable-press",
      mediaAlt: "Movement animation of the red-shirt trainer pressing two handles upward from a low incline bench while both cables run from the red cage front-post pulleys"
    },
    "Single Arm Cable Row": {
      slug: "single-arm-cable-row",
      mediaAlt: "Movement animation of the red-shirt trainer rowing one cable handle toward the ribs without twisting the torso"
    },
    "Cable Lateral Raise": {
      slug: "cable-lateral-raise",
      mediaAlt: "Movement animation of the red-shirt trainer standing side-on and raising one low-cable D-handle from the opposite hip to shoulder height with a soft elbow and still torso",
      equipment: ["RitFit M1 cable station", "One low front-post pulley", "One D-handle"],
      retainPreviousReference: false
    },
    "Cable Crunch": {
      slug: "cable-crunch",
      mediaAlt: "Movement animation of the red-shirt trainer kneeling beneath a high rope cable and curling the ribs toward the pelvis without sitting the hips backward"
    },
    "Cable Hammer Curl": {
      slug: "cable-hammer-curl",
      mediaAlt: "Movement animation of the red-shirt trainer facing one red front post and curling a low rope attachment with a neutral grip and fixed elbows"
    },
    "Rear Delt Cable Fly": {
      slug: "rear-delt-cable-fly",
      mediaAlt: "Movement animation of the red-shirt trainer opening two cable handles into a reverse fly while keeping the shoulders down and elbows softly bent"
    },
    "Cable Face Pull": {
      slug: "cable-face-pull",
      mediaAlt: "Movement animation of the red-shirt trainer pulling a high rope cable toward the face with elbows opening outward and shoulders kept down"
    },
    "Cable Straight Arm Pushdown": {
      slug: "cable-straight-arm-pushdown",
      mediaAlt: "Movement animation of the red-shirt trainer sweeping a high cable bar from shoulder height toward the thighs with nearly straight arms"
    },
    "High to Low Cable Chop": {
      slug: "high-to-low-cable-chop",
      mediaAlt: "Movement animation of the red-shirt trainer guiding one high cable handle diagonally across the body while hips and torso rotate together under control"
    },
    "Alternating Dumbbell Curl": {
      slug: "alternating-dumbbell-curl",
      reviewedOn: "2026-08-26",
      sourceExercise: "Standing alternating dumbbell curl",
      mediaAlt: "Movement animation of the red-shirt trainer standing tall while curling one dumbbell toward the shoulder as the opposite arm remains controlled at the side",
      primaryMuscles: ["Biceps"],
      secondaryMuscles: ["Brachialis", "Forearms"],
      equipment: ["Owned matching dumbbell pair"],
      commonMistakes: ["Swinging the torso", "Letting the elbow travel forward", "Curling both arms when alternating", "Bending the wrist"]
    },
    "Behind-the-Back Single-Arm Cable Curl": {
      slug: "behind-the-back-single-arm-cable-curl",
      reviewedOn: "2026-08-26",
      sourceExercise: "Behind-the-back one-arm cable curl",
      mediaAlt: "Side-view movement animation of the red-shirt trainer facing away from the red cage and curling one D-handle from the low front-post pulley while the elbow remains behind the torso",
      primaryMuscles: ["Biceps"],
      secondaryMuscles: ["Brachialis", "Forearms"],
      equipment: ["RitFit M1 cable station", "One low front-post pulley", "One D-handle"],
      commonMistakes: ["Turning toward the machine", "Letting the elbow drift forward", "Using torso momentum", "Choosing too much resistance"]
    },
    "Reverse Crunch": {
      slug: "reverse-crunch", reviewedOn: "2026-08-26",
      mediaAlt: "Side-view movement animation of the red-shirt trainer curling the pelvis a few inches from the mat while keeping bent knees controlled and the upper back grounded",
      primaryMuscles: ["Lower abdominals", "Deep core"], secondaryMuscles: ["Hip flexors"], equipment: ["Exercise mat"],
      commonMistakes: ["Swinging the legs", "Lifting into a shoulder stand", "Using momentum", "Dropping the hips"]
    },
    "Lying Leg Raise": {
      slug: "lying-leg-raise", reviewedOn: "2026-08-26",
      mediaAlt: "Side-view movement animation of the red-shirt trainer lowering both straight legs together while keeping the lower back pressed into the mat",
      primaryMuscles: ["Lower abdominals", "Deep core"], secondaryMuscles: ["Hip flexors"], equipment: ["Exercise mat"],
      commonMistakes: ["Arching the lower back", "Lowering beyond a controlled range", "Dropping the legs quickly", "Separating the legs"]
    },
    "Forearm Plank with Posterior Pelvic Tilt": {
      slug: "forearm-plank-posterior-pelvic-tilt", reviewedOn: "2026-08-26",
      mediaAlt: "Side-view movement animation of the red-shirt trainer holding a forearm plank and gently tucking the tailbone without lifting or sagging the hips",
      primaryMuscles: ["Deep core", "Lower abdominals"], secondaryMuscles: ["Glutes", "Shoulders"], equipment: ["Exercise mat"],
      commonMistakes: ["Piking the hips", "Letting the hips sag", "Holding the breath", "Shrugging into the shoulders"]
    },
    "Hanging Knee Raise": {
      slug: "hanging-knee-raise", reviewedOn: "2026-08-26",
      mediaAlt: "Movement animation of the red-shirt trainer hanging from the red cage pull-up bar and drawing both knees toward the chest with a controlled pelvic curl",
      primaryMuscles: ["Lower abdominals", "Deep core"], secondaryMuscles: ["Hip flexors", "Grip"], equipment: ["RitFit M1 pull-up bar"],
      commonMistakes: ["Swinging", "Stopping without curling the pelvis", "Hanging passively from the shoulders", "Dropping the legs"]
    },
    "Decline Bench Reverse Crunch": {
      slug: "decline-bench-reverse-crunch", reviewedOn: "2026-08-26",
      mediaAlt: "Side-view movement animation of the red-shirt trainer performing a small controlled reverse crunch on a slightly declined adjustable bench",
      primaryMuscles: ["Lower abdominals", "Deep core"], secondaryMuscles: ["Hip flexors"], equipment: ["Adjustable bench at a slight decline"],
      commonMistakes: ["Using a steep decline too soon", "Swinging the legs", "Lifting into a shoulder stand", "Dropping the hips"]
    },
    "Hanging Garhammer Raise": {
      slug: "hanging-garhammer-raise", reviewedOn: "2026-08-26",
      mediaAlt: "Movement animation of the red-shirt trainer beginning with hips and knees at 90 degrees beneath the red cage pull-up bar and curling the pelvis to draw the knees toward the chest",
      primaryMuscles: ["Lower abdominals", "Deep core"], secondaryMuscles: ["Hip flexors", "Grip"], equipment: ["RitFit M1 pull-up bar"],
      commonMistakes: ["Starting with straight legs", "Swinging", "Changing the knee angle", "Dropping below the 90-degree start"]
    },
    "Supine Diaphragmatic Breathing": {
      slug: "supine-diaphragmatic-breathing", reviewedOn: "2026-08-26",
      mediaAlt: "Slow movement animation of the red-shirt trainer lying with knees bent while the lower ribs and belly gently expand and settle during relaxed diaphragmatic breathing",
      primaryMuscles: ["Diaphragm"], secondaryMuscles: ["Intercostals", "Pelvic floor"], equipment: ["Exercise mat"],
      commonMistakes: ["Forcing the breath", "Shrugging the shoulders", "Bracing the abdomen", "Holding the breath"]
    },
    "Wide-Knee Child's Pose Breathing": {
      slug: "wide-knee-childs-pose-breathing", reviewedOn: "2026-08-26",
      mediaAlt: "Slow movement animation of the red-shirt trainer relaxing in a wide-knee Child's Pose while breathing into the back and side ribs",
      primaryMuscles: ["Pelvic floor", "Hips"], secondaryMuscles: ["Lower back", "Breathing muscles"], equipment: ["Exercise mat"],
      commonMistakes: ["Forcing the hips toward the heels", "Holding the breath", "Tensing the shoulders", "Using a painful knee position"]
    },
    "Supported Deep Squat Breathing": {
      slug: "supported-deep-squat-breathing", reviewedOn: "2026-08-26",
      mediaAlt: "Slow movement animation of the red-shirt trainer holding the red cage uprights for balance in a comfortable deep squat with heels planted and relaxed breathing",
      primaryMuscles: ["Pelvic floor", "Hips"], secondaryMuscles: ["Adductors", "Ankles"], equipment: ["RitFit M1 cage for support"],
      commonMistakes: ["Forcing depth", "Lifting the heels", "Letting the knees collapse inward", "Bouncing"]
    },
    "Happy Baby Pelvic Floor Stretch": {
      slug: "happy-baby-pelvic-floor-stretch", reviewedOn: "2026-08-26",
      mediaAlt: "Slow movement animation of the red-shirt trainer lying on a mat with knees wide and gently holding the feet while the sacrum remains grounded",
      primaryMuscles: ["Pelvic floor", "Inner thighs"], secondaryMuscles: ["Hips", "Lower back"], equipment: ["Exercise mat"],
      commonMistakes: ["Pulling forcefully", "Lifting the sacrum", "Rocking aggressively", "Straining to hold the feet"]
    },
    "90/90 Hip Switch": {
      slug: "ninety-ninety-hip-switch", reviewedOn: "2026-08-26",
      mediaAlt: "Movement animation of the red-shirt trainer sitting tall and rotating both bent knees under control between mirrored 90/90 hip positions",
      primaryMuscles: ["Hip rotators", "Glutes"], secondaryMuscles: ["Pelvic stabilizers"], equipment: ["Exercise mat"],
      commonMistakes: ["Forcing the knees to the floor", "Moving too quickly", "Twisting through knee discomfort", "Collapsing the torso"]
    }
  };

  Object.entries(animationConfigs).forEach(([name, config]) => registerAnimation(name, config));

  function aliasAnimation(alias, canonical, sourceExercise = alias) {
    entries[alias] = Object.assign({}, entries[canonical], { sourceExercise });
  }

  aliasAnimation("Easy Treadmill Warm-Up", "Treadmill Walk", "Easy treadmill warm-up");
  aliasAnimation("Easy Cardio Cooldown", "Easy Treadmill Cooldown", "Easy treadmill cardio cooldown");
  aliasAnimation("Easy Recovery Walk", "Treadmill Walk", "Easy recovery treadmill walk");
  aliasAnimation("Zone 2 Warm-Up", "Treadmill Walk", "Zone 2 treadmill warm-up");
  aliasAnimation("Zone 2 Cooldown", "Easy Treadmill Cooldown", "Zone 2 treadmill cooldown");
  aliasAnimation("Thoracic and Shoulder Mobility", "Chest and Shoulder Mobility", "Thoracic and shoulder wall-slide mobility");
  aliasAnimation("Rower Technique", "iFIT Rowing Technique", "Indoor rowing technique");
  aliasAnimation("Treadmill Walking", "Treadmill Walk", "Treadmill walking");
  aliasAnimation("Treadmill Incline Walk", "Incline Treadmill Walk", "Incline treadmill walking");
  aliasAnimation("Treadmill HIIT", "Treadmill HIIT Intervals", "Treadmill interval running");
  aliasAnimation("Hip & Glute Mobility", "Hip and Glute Mobility", "Seated figure-four hip and glute stretch");
  aliasAnimation("Thoracic & Shoulder Mobility", "Chest and Shoulder Mobility", "Thoracic and shoulder wall-slide mobility");
  aliasAnimation("Cool Down & Recovery", "Post-Workout Stretch", "Post-workout stretching and recovery");
  aliasAnimation("Cooldown", "Post-Workout Stretch", "Post-workout stretching and recovery");

  Object.values(entries).forEach(entry => {
    if (!entry.mediaType) entry.mediaType = /\.gif(?:$|\?)/i.test(entry.media || "") ? "animation" : "still";
    if (!entry.reviewedOn) entry.reviewedOn = mediaReviewDate;
  });

  root.ROAD12_EXERCISE_LIBRARY = Object.freeze({
    provider: "Road to 12% animations with retained official and reviewed setup references",
    providerUrl: "https://www.ritfitsports.com/",
    reviewedOn: mediaReviewDate,
    entries: Object.freeze(entries)
  });
})(typeof self !== "undefined" ? self : window);
