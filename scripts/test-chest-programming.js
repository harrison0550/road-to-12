const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "app.css"), "utf8");
const identities = require(path.join(root, "exercise-identity.js"));

assert.strictEqual(identities.resolve("Smith Machine Bench Press").id, "road12.press.smith-bench");
assert.strictEqual(identities.resolve("GMWD Converging Chest Press").id, "road12.press.gmwd-converging-chest-press");
assert.strictEqual(identities.resolve("Low-Incline Dumbbell Press").id, "road12.press.dumbbell-low-incline");
assert.strictEqual(identities.resolve("Cable Chest Press").id, "road12.press.cable-chest", "legacy Cable Chest Press identity must remain stable");
assert.strictEqual(identities.resolve("Incline Cable Press").id, "road12.press.incline-cable", "legacy Incline Cable Press identity must remain stable");

assert.match(app, /function fullBodyAWorkout\(\)[\s\S]*?if\(ex\.name==="Cable Chest Press"\)return smithMachineBenchPressExercise\(\)/, "future Full Body A sessions must use Smith Machine Bench Press");
assert.match(app, /function fullBodyBWorkout\(useLegacyChest=false,includeVBar=true,useGmwdChest=true\)[\s\S]*?gmwdConvergingChestPressExercise\(\)/, "future Full Body B sessions must use GMWD Converging Chest Press");
assert.match(app, /function fullBodyCWorkout\(includeHipThrust=true,includeLowInclinePress=true,useConcentrationCurl=true\)[\s\S]*?lowInclineDumbbellPressExercise\(\)/, "future Full Body C sessions must use Low-Incline Dumbbell Press");
assert.match(app, /preservePreChestDefinition=activeSession&&!state\.currentSession\.programRevision/, "an active pre-chest workout must keep its original chest definitions");
assert.match(app, /compatibleRevisions=\[LEGACY_FOUNDATION_PROGRAM_REVISION,PREVIOUS_FOUNDATION_PROGRAM_REVISION,GMWD_FOUNDATION_PROGRAM_REVISION,FOUNDATION_PROGRAM_REVISION\]/, "active workout revision compatibility must remain explicit");
assert.match(app, /programRevision:FOUNDATION_PROGRAM_REVISION/, "new sessions must capture the current Foundation-program revision boundary");
assert.match(app, /function legacyInclineCablePressExercise\(\)/, "the previous incline cable definition must remain available for legacy history and reference");
assert.match(app, /const legacy=\[legacyInclineCablePressExercise\(\)\]/, "the legacy incline cable definition must remain accessible in the Exercise Library");

assert.match(app, /Smith Machine Bench Press"[\s\S]*?sets:3,reps:10,rest:90[\s\S]*?firstExposureRirRange:\[3,4\]/, "Smith bench must use the conservative first-exposure prescription");
assert.match(app, /Low-Incline Dumbbell Press"[\s\S]*?sets:3,reps:10,rest:90[\s\S]*?progressionRirRange:\[2,3\]/, "low-incline dumbbell press must use the intended working prescription");
assert.match(app, /GMWD Converging Chest Press"[\s\S]*?sets:3,reps:"10–12",rest:90[\s\S]*?mode:"perSide",label:"Weight per side"[\s\S]*?minimumProgressionExposures:3/, "GMWD press must use per-side entry and conservative double progression");
assert.match(app, /label:"Total plate weight across both sides"[\s\S]*?Do not include the 33 lb Smith bar/, "Smith bench entry must record plates separately from the known bar weight");
assert.match(app, /label:"Combined dumbbell weight"[\s\S]*?two 20 lb dumbbells = 40 lb total/, "dumbbell press entry must use combined dumbbell weight");

assert.match(app, /function chestSetupMarkup[\s\S]*?TECHNIQUE FIRST[\s\S]*?<ol>/, "chest movements need a visible ordered setup card");
assert.match(app, /function chestActivationMarkup[\s\S]*?OPTIONAL ACTIVATION[\s\S]*?1 set × 12–15 reps[\s\S]*?3 sec lowering[\s\S]*?2 sec pressing/, "the optional activation set must show the prescribed tempo");
assert.match(app, /Not counted toward working volume, progression, history, or personal records/, "activation work must be explicitly excluded from progression history");
assert.match(app, /feedback:deepCopy\(state\.exerciseFeedback\[ex\.name\]\|\|null\)/, "muscle engagement feedback must be copied into completed exercise history");
assert.doesNotMatch(app.match(/function completedExerciseSnapshots[\s\S]*?\n\}/)?.[0] || "", /chestActivation/, "activation completion must not enter working-set history snapshots");
assert.match(app, /muscleEngagement:engagement\?\{target:ex\.engagementTarget,rating:engagement\}:null/, "engagement history must retain the target and rating");

assert.match(css, /\.chest-setup-card,\.chest-activation-card/);
assert.match(css, /@media\(max-width:360px\)\{\.activation-tempo\{grid-template-columns:1fr\}\}/, "activation instructions must not overflow small iPhones");

console.log("Chest programming tests passed: future A/B substitutions, coaching, activation, feedback, and legacy history contracts are present.");
