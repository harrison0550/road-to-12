(function (root) {
  const license = Object.freeze({
    shortName: "CC-BY-SA 4.0",
    fullName: "Creative Commons Attribution-ShareAlike 4.0",
    url: "https://creativecommons.org/licenses/by-sa/4.0/"
  });

  const entries = {
    "Rope Triceps Pushdown": {
      sourceExercise: "Tricep Pushdown on Cable",
      sourceExerciseId: 805,
      sourceUrl: "https://wger.de/en/exercise/805/view",
      author: "cshep442",
      media: "assets/exercise-library/wger/triceps-pushdown.webp",
      mediaAlt: "Start and finish positions for a cable rope triceps pushdown",
      primaryMuscles: ["Triceps"],
      secondaryMuscles: [],
      equipment: ["Cable machine", "Rope attachment"],
      commonMistakes: [
        "Letting the elbows drift forward",
        "Using the shoulders or torso to move the rope",
        "Snapping the elbows into lockout"
      ],
      license
    },
    "Smith Bulgarian Split Squat": {
      sourceExercise: "Smith Machine Split Squat",
      sourceExerciseId: 1593,
      sourceUrl: "https://wger.de/en/exercise/1593/view",
      originalSourceUrl: "https://www.docteur-fitness.com/split-squat-a-la-smith-machine",
      author: "workout@rooven.anonaddy.me",
      media: "assets/exercise-library/wger/smith-split-squat.gif",
      mediaAlt: "Looping Smith machine split squat demonstration",
      primaryMuscles: ["Quadriceps", "Hamstrings"],
      secondaryMuscles: ["Glutes", "Core"],
      equipment: ["Smith machine"],
      commonMistakes: [
        "Using a stance that is too short to keep the front heel planted",
        "Letting the front knee collapse inward",
        "Pushing off the rear foot instead of driving through the front foot"
      ],
      license
    },
    "Cable Straight Arm Pushdown": {
      sourceExercise: "Straight-Arm Pulldown (Cable)",
      sourceExerciseId: 1726,
      sourceUrl: "https://wger.de/en/exercise/1726/view",
      author: "barry",
      media: "assets/exercise-library/wger/straight-arm-pulldown.png",
      mediaAlt: "Start and finish positions for a straight-arm cable pulldown",
      primaryMuscles: ["Lats"],
      secondaryMuscles: ["Triceps", "Core"],
      equipment: ["Cable machine", "Straight bar"],
      commonMistakes: [
        "Turning the movement into a triceps pushdown",
        "Rounding the shoulders or lower back",
        "Using momentum instead of a controlled shoulder arc"
      ],
      license
    },
    "Smith Machine Squat": {
      sourceExercise: "Smith machine squat",
      sourceExerciseId: 1747,
      sourceUrl: "https://wger.de/en/exercise/1747/view",
      author: "Tierrasverdes",
      media: "assets/exercise-library/wger/smith-machine-squat.jpg",
      mediaAlt: "Standing and bottom positions for a Smith machine squat",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Hamstrings", "Core"],
      equipment: ["Smith machine"],
      commonMistakes: [
        "Standing so close that the heels lift",
        "Letting the knees collapse inward",
        "Descending below the depth you can control"
      ],
      license
    },
    "Hip Flexor Mobility": {
      sourceExercise: "Hip Flexor Stretch",
      sourceExerciseId: 1867,
      sourceUrl: "https://wger.de/en/exercise/1867/view",
      author: "Davidgj32",
      media: "assets/exercise-library/wger/hip-flexor-stretch.webp",
      mediaAlt: "Half-kneeling hip flexor stretch with an upright torso",
      primaryMuscles: ["Hip flexors"],
      secondaryMuscles: ["Quadriceps"],
      equipment: ["Exercise mat"],
      commonMistakes: [
        "Arching the lower back instead of tucking the pelvis",
        "Leaning forward without moving the hips",
        "Forcing a painful range"
      ],
      license
    }
  };

  root.ROAD12_EXERCISE_LIBRARY = Object.freeze({
    provider: "wger Workout Manager",
    providerUrl: "https://wger.de/",
    reviewedOn: "2026-07-29",
    entries: Object.freeze(entries)
  });
})(typeof self !== "undefined" ? self : window);
