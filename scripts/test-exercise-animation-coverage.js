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
    "currentLowerAbsPhase",
    "lowerAbsProgramExercises",
    "pelvicFloorRelaxationBlock",
    "kettlebellFoundationBlock",
    "cardioMobilityWorkout",
    "coreRecoveryWorkout",
    "zone2CardioWorkout",
    "smithMachineBenchPressExercise",
    "gmwdConvergingChestPressExercise",
    "lowInclineDumbbellPressExercise",
    "fullBodyAWorkout",
    "dumbbellAccessoryForDay",
    "armAccessoryForDay",
    "fullBodyBWorkout",
    "smithMachineHipThrustExercise",
    "behindBackCableCurlExercise",
    "seatedConcentrationCurlExercise",
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
    const state={history:[],lowerAbsProgram:{phase2AcceptedAt:null,completedSessionIds:[]},equipment:{ritfitM1:true,bench:true,treadmill:true,rower:true,kickrCore:true,bumperPlates:true,dumbbells:true,kettlebells:true,kettlebellWeights:[30],gmwdConvergingChestPress:true,olympicBarbell:false}};
    const equipmentLabels={};
    const LEGACY_FOUNDATION_PROGRAM_REVISION="foundation-kettlebell-2026-08-27";
    const PREVIOUS_FOUNDATION_PROGRAM_REVISION="foundation-smith-hip-thrust-2026-08-28";
    const GMWD_FOUNDATION_PROGRAM_REVISION="foundation-gmwd-chest-press-2026-09-04";
    const FOUNDATION_PROGRAM_REVISION="foundation-concentration-curl-2026-09-04";
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
  "Smith Machine Bench Press",
  "Seated Cable Row",
  "Goblet Squat",
  "Lat Pulldown",
  "Cable Shoulder Press",
  "Rope Triceps Pushdown",
  "Cable Curl",
  "Easy Treadmill Cooldown",
  "Post-Workout Stretch",
  "Dumbbell Lateral Raise",
  "Alternating Dumbbell Curl",
  "Easy Treadmill Warm-Up",
  "Incline Treadmill Walk",
  "iFIT Rowing Technique",
  "Hip Flexor Mobility",
  "Hamstring Mobility",
  "Chest and Shoulder Mobility",
  "Easy Cardio Cooldown",
  "Hip Hinge",
  "Smith Machine RDL",
  "Smith Machine Single-Leg Squat",
  "Smith Machine Calf Raise",
  "GMWD Converging Chest Press",
  "Low-Incline Dumbbell Press",
  "Single Arm Cable Row",
  "Cable Lateral Raise",
  "Cable Crunch",
  "Cable Hammer Curl",
  "V-Bar Triceps Pushdown",
  "Dumbbell Floor Press",
  "Easy Recovery Walk",
  "Kettlebell Around the World",
  "Kettlebell Swing",
  "Kettlebell Suitcase Carry",
  "Dead Bug",
  "Bird Dog",
  "Side Plank from Knees",
  "Hip and Glute Mobility",
  "Thoracic and Shoulder Mobility",
  "Slow Breathing Cooldown",
  "Reverse Crunch",
  "Lying Leg Raise",
  "Forearm Plank with Posterior Pelvic Tilt",
  "Supine Diaphragmatic Breathing",
  "Wide-Knee Child's Pose Breathing",
  "Supported Deep Squat Breathing",
  "Happy Baby Pelvic Floor Stretch",
  "90/90 Hip Switch",
  "Smith Machine Squat",
  "Smith Machine Hip Thrust",
  "Rear Delt Cable Fly",
  "Cable Face Pull",
  "Cable Straight Arm Pushdown",
  "High to Low Cable Chop",
  "Dumbbell Romanian Deadlift",
  "Seated Concentration Curl",
  "Treadmill HIIT Intervals",
  "Zone 2 Warm-Up",
  "Zone 2 Cardio",
  "Zone 2 Cooldown",
];

assert.strictEqual(
  new Set(activeFoundationExercises).size,
  63,
  "the active Foundation media audit must cover 63 distinct exercise names",
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
  ["Cable Chest Press", "Rower Technique", "Stationary Bike Setup"],
  "the visible Library should retain the legacy Cable Chest Press alongside its rowing template and stationary-bike setup",
);
assert(library.entries["Incline Cable Press"], "the legacy Incline Cable Press media entry must remain available");
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
  if (name === "Seated Concentration Curl") {
    assert.strictEqual(entry.mediaType, "movement-sequence");
    assert.match(entry.media, /seated-concentration-curl-guide\.png$/i);
    assert.match(entry.movementSequence, /seated-concentration-curl-sequence\.png$/i);
    assert(fs.existsSync(path.join(root, entry.media)), `${name} guide image must exist locally`);
    assert(fs.existsSync(path.join(root, entry.movementSequence)), `${name} movement sequence must exist locally`);
    continue;
  }
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
const smithBench = liveFoundationWorkouts[0].find((exercise) => exercise.name === "Smith Machine Bench Press");
assert(smithBench, "Full Body A must schedule Smith Machine Bench Press");
assert.strictEqual(smithBench.sets, 3);
assert.strictEqual(smithBench.reps, 10);
assert.strictEqual(smithBench.rest, 90);
assert.strictEqual(smithBench.weightEntry?.mode, "total");
assert.match(smithBench.weightEntry?.help || "", /Do not include the 33 lb Smith bar/i);
assert.strictEqual(smithBench.engagementTarget, "chest");
assert.deepStrictEqual(Array.from(smithBench.firstExposureRirRange), [3, 4]);
const gmwdPress = liveFoundationWorkouts[2].find((exercise) => exercise.name === "GMWD Converging Chest Press");
assert(gmwdPress, "Full Body B must schedule GMWD Converging Chest Press");
assert.strictEqual(gmwdPress.sets, 3);
assert.strictEqual(gmwdPress.reps, "10–12");
assert.strictEqual(gmwdPress.rest, 90);
assert.strictEqual(gmwdPress.weightEntry?.mode, "perSide");
assert.strictEqual(gmwdPress.weightEntry?.label, "Weight per side");
assert.strictEqual(gmwdPress.engagementTarget, "chest");
assert.deepStrictEqual(Array.from(gmwdPress.progressionRirRange), [2, 3]);
assert.strictEqual(gmwdPress.minimumProgressionExposures, 3);
const lowInclinePress = liveFoundationWorkouts[4].find((exercise) => exercise.name === "Low-Incline Dumbbell Press");
assert(lowInclinePress, "Full Body C must schedule Low-Incline Dumbbell Press");
assert.strictEqual(lowInclinePress.sets, 3);
assert.strictEqual(lowInclinePress.reps, 10);
assert.strictEqual(lowInclinePress.rest, 90);
assert.strictEqual(lowInclinePress.weightEntry?.mode, "total");
assert.strictEqual(lowInclinePress.weightEntry?.paired, true);
assert.strictEqual(lowInclinePress.engagementTarget, "upper chest");
assert.deepStrictEqual(Array.from(lowInclinePress.progressionRirRange), [2, 3]);
assert(!liveFoundationWorkouts[0].some((exercise) => ["GMWD Converging Chest Press", "Low-Incline Dumbbell Press"].includes(exercise.name)), "Full Body A must retain its Smith bench assignment");
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
assert.match(seatedRow.m1?.attachment || "", /rotating close-grip double-D row handle on one low cable/i);
assert.match(seatedRow.m1?.start || "", /both arms/i);
assert.strictEqual(seatedRow.weightEntry?.mode, "single");
assert.match(seatedRow.weightEntry?.label || "", /active stack/i);
assert.match(seatedRow.weightEntry?.help || "", /one low cable stack/i);
const seatedRowEntry = library.entries["Seated Cable Row"];
assert.match(seatedRowEntry.mediaAlt, /both hands/i);
assert.match(seatedRowEntry.mediaAlt, /rotating close-grip double-D handle/i);
assert.match(seatedRowEntry.mediaAlt, /one low cable/i);
assert(seatedRowEntry.equipment.some((item) => /one low front-post pulley/i.test(item)));
assert(seatedRowEntry.equipment.some((item) => /close-grip double-D row handle/i.test(item)));

const singleLegSquat=liveExercises.find((exercise)=>exercise.name==="Smith Machine Single-Leg Squat");
assert(singleLegSquat,"Full Body B must schedule the approved no-bench Smith single-leg squat");
assert.deepStrictEqual(Array.from(singleLegSquat.requires),["ritfitM1"]);
assert(singleLegSquat.setup.some((item)=>/facing forward/i.test(item)));
assert(singleLegSquat.setup.some((item)=>/hovers behind/i.test(item)));
assert(singleLegSquat.cues.some((item)=>/no bench/i.test(item)));
const singleLegEntry=library.entries["Smith Machine Single-Leg Squat"];
assert.match(singleLegEntry.mediaAlt,/foot hovers unsupported behind/i);
assert(!singleLegEntry.equipment.some((item)=>/bench/i.test(item)));

const vBarPushdown=liveExercises.find((exercise)=>exercise.name==="V-Bar Triceps Pushdown");
assert(vBarPushdown,"Full Body B must include the approved V-bar triceps addition");
assert.strictEqual(vBarPushdown.sets,2);
assert.strictEqual(vBarPushdown.m1?.pinLeft,13);
assert.strictEqual(vBarPushdown.m1?.pinRight,null);
assert.match(vBarPushdown.m1?.attachment||"",/angled V-bar on one high cable/i);
assert.strictEqual(vBarPushdown.attachmentCard?.key,"vBar");
const vBarEntry=library.entries["V-Bar Triceps Pushdown"];
assert.match(vBarEntry.mediaAlt,/angled V-bar/i);
assert(vBarEntry.equipment.some((item)=>/angled V-bar pressdown attachment/i.test(item)));

assert.strictEqual(
  new Set(activeFoundationExercises.map((name) => library.entries[name].media)).size,
  56,
  "the audit should resolve 62 animated active names to 55 distinct reviewed animations plus the concentration-curl movement guide",
);

for (const name of ["Hanging Knee Raise", "Decline Bench Reverse Crunch", "Hanging Garhammer Raise"]) {
  assert.strictEqual(library.entries[name]?.mediaType, "animation", `${name} must be ready before Phase 2 is accepted`);
}

console.log(
  "Foundation media coverage passed: live workoutForDay(0..5) output matches all 63 audited names, including the concentration-curl movement guide, and all three review-gated Phase 2 movements are ready.",
);
