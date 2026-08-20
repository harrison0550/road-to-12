const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = { self: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, "exercise-library.js"), "utf8"),
  context,
  { filename: "exercise-library.js" },
);

const library = context.self.ROAD12_EXERCISE_LIBRARY;
assert(library?.entries, "the reviewed exercise library must initialize");

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert(start >= 0, `app.js must define ${name}()`);
  const parameterStart = source.indexOf("(", start);
  let parameterDepth = 0;
  let parameterMode = "code";
  let parameterEscaped = false;
  let parameterEnd = -1;
  for (let index = parameterStart; index < source.length; index += 1) {
    const char = source[index];
    if (parameterMode !== "code") {
      if (parameterEscaped) parameterEscaped = false;
      else if (char === "\\") parameterEscaped = true;
      else if (
        (parameterMode === "single" && char === "'") ||
        (parameterMode === "double" && char === '"') ||
        (parameterMode === "template" && char === "`")
      ) parameterMode = "code";
      continue;
    }
    if (char === "'") parameterMode = "single";
    else if (char === '"') parameterMode = "double";
    else if (char === "`") parameterMode = "template";
    else if (char === "(") parameterDepth += 1;
    else if (char === ")") {
      parameterDepth -= 1;
      if (parameterDepth === 0) {
        parameterEnd = index;
        break;
      }
    }
  }
  const openingBrace = source.indexOf("{", parameterEnd);
  assert(openingBrace >= 0, `${name}() must have a function body`);

  let depth = 0;
  let mode = "code";
  let escaped = false;
  for (let index = openingBrace; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (mode === "line-comment") {
      if (char === "\n") mode = "code";
      continue;
    }
    if (mode === "block-comment") {
      if (char === "*" && next === "/") {
        mode = "code";
        index += 1;
      }
      continue;
    }
    if (mode !== "code") {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (
        (mode === "single" && char === "'") ||
        (mode === "double" && char === '"') ||
        (mode === "template" && char === "`")
      ) {
        mode = "code";
      }
      continue;
    }
    if (char === "/" && next === "/") {
      mode = "line-comment";
      index += 1;
    } else if (char === "/" && next === "*") {
      mode = "block-comment";
      index += 1;
    } else if (char === "'") {
      mode = "single";
    } else if (char === '"') {
      mode = "double";
    } else if (char === "`") {
      mode = "template";
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`Unable to extract ${name}() from app.js`);
}

function generateLiveFoundationWorkouts() {
  const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const workoutFunctionNames = [
    "hasRequirements",
    "missingEquipment",
    "resolveExercise",
    "setupGroup",
    "deepCopy",
    "cloneExerciseByName",
    "cardioMobilityWorkout",
    "coreRecoveryWorkout",
    "zone2CardioWorkout",
    "dumbbellAccessoryForDay",
    "fullBodyBWorkout",
    "fullBodyCWorkout",
    "strengthWorkoutForDay",
    "workoutForDay",
  ];
  const workoutContext = { window: {} };
  vm.createContext(workoutContext);
  vm.runInContext(
    fs.readFileSync(path.join(root, "data.js"), "utf8"),
    workoutContext,
    { filename: "data.js" },
  );
  workoutContext.window.ROAD12_ADAPTIVE = {
    applyRecommendation(exercises) {
      return exercises.map((exercise) => Object.assign({}, exercise));
    },
  };
  const harness = `
    const data=window.WORKOUT_DATA;
    const state={equipment:{ritfitM1:true,bench:true,treadmill:true,rower:true,kickrCore:true,bumperPlates:true,dumbbells:true,kettlebells:false,olympicBarbell:false}};
    const equipmentLabels={};
    ${workoutFunctionNames.map((name) => extractFunction(appSource, name)).join("\n")}
    this.__foundationWorkouts=[0,1,2,3,4,5].map(day=>workoutForDay(day));
  `;
  vm.runInContext(harness, workoutContext, { filename: "foundation-workout-harness.js" });
  return Array.from(workoutContext.__foundationWorkouts, (workout) => Array.from(workout));
}

// This is the complete set of distinct exercise names used by the active
// Monday-through-Saturday Foundation workouts. Aliases are intentional where
// one reviewed motion guide safely serves the same movement at a different
// intensity or point in the workout.
const activeFoundationExercises = [
  "Treadmill Walk",
  "Arm Circles",
  "Bodyweight Squat",
  "Cable Chest Press",
  "Seated Cable Row",
  "Goblet Squat",
  "Lat Pulldown",
  "Cable Shoulder Press",
  "Rope Triceps Pushdown",
  "Cable Curl",
  "Easy Treadmill Cooldown",
  "Post-Workout Stretch",
  "Dumbbell Lateral Raise",
  "Easy Treadmill Warm-Up",
  "Incline Treadmill Walk",
  "iFIT Rowing Technique",
  "Hip Flexor Mobility",
  "Hamstring Mobility",
  "Chest and Shoulder Mobility",
  "Easy Cardio Cooldown",
  "Hip Hinge",
  "Smith Machine RDL",
  "Smith Bulgarian Split Squat",
  "Smith Machine Calf Raise",
  "Incline Cable Press",
  "Single Arm Cable Row",
  "Cable Lateral Raise",
  "Cable Crunch",
  "Cable Hammer Curl",
  "Dumbbell Floor Press",
  "Easy Recovery Walk",
  "Dead Bug",
  "Bird Dog",
  "Side Plank from Knees",
  "Hip and Glute Mobility",
  "Thoracic and Shoulder Mobility",
  "Slow Breathing Cooldown",
  "Smith Machine Squat",
  "Rear Delt Cable Fly",
  "Cable Face Pull",
  "Cable Straight Arm Pushdown",
  "High to Low Cable Chop",
  "Dumbbell Romanian Deadlift",
  "Treadmill HIIT Intervals",
  "Zone 2 Warm-Up",
  "Zone 2 Cardio",
  "Zone 2 Cooldown",
];

assert.strictEqual(
  new Set(activeFoundationExercises).size,
  47,
  "the active Foundation media audit must cover 47 distinct exercise names",
);

const liveFoundationWorkouts = generateLiveFoundationWorkouts();
const liveExerciseNames = new Set(
  liveFoundationWorkouts.flatMap((workout) => workout.map((exercise) => exercise.name)),
);
assert.deepStrictEqual(
  [...liveExerciseNames].sort(),
  [...activeFoundationExercises].sort(),
  "the audited names and the actual workoutForDay(0..5) output must match in both directions",
);

const libraryDataContext = { window: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, "data.js"), "utf8"),
  libraryDataContext,
  { filename: "data.js" },
);
const visibleLibraryDefinitions = [
  ...libraryDataContext.window.WORKOUT_DATA,
  ...(libraryDataContext.window.EXTRA_LIBRARY_DATA || []),
  ...liveFoundationWorkouts.flat(),
].filter((exercise, index, definitions) =>
  definitions.findIndex((candidate) => candidate.name === exercise.name) === index,
);
const visibleLibraryNames = new Set(
  visibleLibraryDefinitions
    .filter((exercise) =>
      exercise.type === "strength" ||
      exercise.type === "cardio" ||
      exercise.type === "warmup" ||
      exercise.type === "mobility" ||
      exercise.type === "cooldown" ||
      /Treadmill|Rowing|Zone 2|Mobility|Stretch|Breathing|Dead Bug|Bird Dog|Side Plank/.test(exercise.name),
    )
    .map((exercise) => exercise.name),
);
assert.deepStrictEqual(
  [...visibleLibraryNames].filter((name) => !liveExerciseNames.has(name)).sort(),
  ["Rower Technique", "Stationary Bike Setup"],
  "the visible Library should add only its rowing template and stationary-bike setup to active workouts",
);
for (const name of visibleLibraryNames) {
  assert(library.entries[name], `visible Exercise Library item ${name} must resolve to reviewed media`);
}
const bikeSetup = library.entries["Stationary Bike Setup"];
assert.strictEqual(bikeSetup.mediaType, "still");
assert.strictEqual(bikeSetup.sourceType, "app-original");
assert.match(bikeSetup.sourceExercise, /KICKR CORE stationary bike setup/i);
assert.match(bikeSetup.mediaAlt, /slight knee bend/i);
assert.match(bikeSetup.media, /assets\/phase3\/kickr-core-bike-setup\.jpg$/);
assert.strictEqual(bikeSetup.reviewedOn, library.reviewedOn);
assert(fs.existsSync(path.join(root, bikeSetup.media)), "the reviewed bike setup image must exist locally");
assert.strictEqual(library.entries["Rower Technique"].mediaType, "animation");

for (const name of activeFoundationExercises) {
  const entry = library.entries[name];
  assert(entry, `${name} must resolve by its exact guided-workout name`);
  assert.strictEqual(
    entry.mediaType,
    "animation",
    `${name} must resolve to reviewed motion guidance`,
  );
  assert.strictEqual(
    entry.sourceType,
    "app-original",
    `${name} animation must be identified as app-created media`,
  );
  assert.match(entry.media, /\.gif$/i, `${name} motion asset must be a GIF`);
  assert.match(
    entry.motionPoster,
    /-motion-guide\.webp$/i,
    `${name} must provide a non-moving storyboard poster`,
  );
  assert.strictEqual(
    entry.reviewedOn,
    library.reviewedOn,
    `${name} must carry the current media review date`,
  );
  assert(
    typeof entry.mediaAlt === "string" && entry.mediaAlt.length >= 45,
    `${name} must provide movement-specific alternative text`,
  );
  assert(
    entry.rightsNote.includes("Written setup and movement cues remain the authoritative coaching guide"),
    `${name} must preserve the written-coaching authority note`,
  );
}

const liveExercises = liveFoundationWorkouts.flat();
const latPulldowns = liveExercises.filter((exercise) => exercise.name === "Lat Pulldown");
assert.strictEqual(latPulldowns.length, 2, "Full Body A and B must each contain Lat Pulldown");
for (const exercise of latPulldowns) {
  assert.strictEqual(exercise.m1?.pinLeft, 13);
  assert.strictEqual(exercise.m1?.pinRight, null);
  assert.match(exercise.m1?.attachment || "", /lat bar centered on one high cable/i);
  assert.match(exercise.m1?.pinNote || "", /one front-post pulley/i);
  assert.strictEqual(exercise.weightEntry?.mode, "single");
  assert.match(exercise.weightEntry?.label || "", /active stack/i);
  assert.match(exercise.weightEntry?.help || "", /one high cable stack/i);
}
const latEntry = library.entries["Lat Pulldown"];
assert.match(latEntry.sourceExercise, /single-cable/i);
assert.match(latEntry.mediaAlt, /centered single-cable lat bar/i);
assert(latEntry.equipment.some((item) => /one high front-post pulley/i.test(item)));
assert(latEntry.equipment.some((item) => /one cable connected to the center/i.test(item)));

const seatedRows = liveExercises.filter((exercise) => exercise.name === "Seated Cable Row");
assert.strictEqual(seatedRows.length, 1, "Full Body A must contain one Seated Cable Row");
const seatedRow = seatedRows[0];
assert.strictEqual(seatedRow.m1?.pinLeft, 1);
assert.strictEqual(seatedRow.m1?.pinRight, null);
assert.match(seatedRow.m1?.attachment || "", /one close-grip row handle on one low cable/i);
assert.match(seatedRow.m1?.start || "", /both arms/i);
assert.strictEqual(seatedRow.weightEntry?.mode, "single");
assert.match(seatedRow.weightEntry?.label || "", /active stack/i);
assert.match(seatedRow.weightEntry?.help || "", /one low cable stack/i);
const seatedRowEntry = library.entries["Seated Cable Row"];
assert.match(seatedRowEntry.mediaAlt, /both hands/i);
assert.match(seatedRowEntry.mediaAlt, /one close-grip handle/i);
assert.match(seatedRowEntry.mediaAlt, /one low cable/i);
assert(seatedRowEntry.equipment.some((item) => /one low front-post pulley/i.test(item)));
assert(seatedRowEntry.equipment.some((item) => /close-grip row handle/i.test(item)));

assert.strictEqual(
  new Set(activeFoundationExercises.map((name) => library.entries[name].media)).size,
  40,
  "the audit should resolve the 47 active names to 40 distinct reviewed animations",
);

console.log(
  "Foundation animation coverage passed: live workoutForDay(0..5) output matches all 47 audited names, resolves to 40 reviewed animations, and preserves the single-cable Lat Pulldown and Seated Cable Row setups.",
);
