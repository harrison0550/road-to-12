const assert=require("assert");
const fs=require("fs");
const path=require("path");
const vm=require("vm");
const root=path.resolve(__dirname,"..");
const build=require(path.join(root,"build-upper-lower-program.js"));
const identities=require(path.join(root,"exercise-identity.js"));
const payloads=require(path.join(root,"strava-strength-payload.js"));
const coach=require(path.join(root,"adaptive-coaching.js"));
const backup=require(path.join(root,"backup-restore.js"));

const replacement="Dumbbell Reverse Lunge";
const legacy="Smith Machine Single-Leg Squat";
for(const templateId of ["build-lower-a","build-lower-b"]){
  const template=build.templateForId(templateId);
  const exercise=template.exercises.find(item=>item.name===replacement);
  assert(exercise,`${templateId} must use ${replacement}`);
  assert.equal(exercise.sets,2);
  assert.equal(exercise.reps,"8–12");
  assert.deepStrictEqual(exercise.targetRirRange,[2,3]);
  assert(!template.exercises.some(item=>item.name===legacy),`${templateId} retained the replaced Smith movement`);
}
assert.equal(build.strengthSetCount(build.templateForId("build-lower-a")),19,"Lower A set count changed");
assert.equal(build.strengthSetCount(build.templateForId("build-lower-b")),20,"Lower B set count changed");

const reverseIdentity=identities.resolve(replacement);
const smithIdentity=identities.resolve(legacy);
assert.equal(reverseIdentity.id,"road12.lunge.dumbbell-reverse");
assert.equal(reverseIdentity.externalMappings.strava.exerciseType,"DUMBBELL_REVERSE_LUNGE");
assert.equal(identities.isSupportedStravaExerciseType("DUMBBELL_REVERSE_LUNGE"),true);
assert.equal(smithIdentity.id,"road12.lunge.smith-bulgarian","historical Smith identity changed");
assert.notEqual(reverseIdentity.id,smithIdentity.id,"replacement must establish a new progression baseline");

const reverseDefinition={name:replacement,type:"strength",sets:2,reps:"8–12",progressionRirRange:[2,3],weightEntry:{mode:"total",paired:true}};
const oldSmithHistory=[{id:"smith-history",exercises:[{name:legacy,sets:[{done:true,reps:12,weight:90},{done:true,reps:12,weight:90}]}]}];
const fresh=coach.exerciseRecommendation(oldSmithHistory,{"smith-history":"Easy"},reverseDefinition);
assert.equal(fresh.action,"BUILD");
assert.equal(fresh.sourceSessionId,undefined,"Smith history was copied into the new movement baseline");
assert.equal(fresh.prescription.weight,null);
assert.deepStrictEqual(payloads.normalizeExternalLoadLb(reverseDefinition,{weight:40}),{loadLb:40,rule:"paired-dumbbells-combined"});

const historicalState={schemaVersion:20,history:[{id:"old-smith-session",name:"Lower A",exercises:[{exerciseId:smithIdentity.id,name:legacy,sets:[{setNumber:1,repetitions:10,weight:90,completed:true},{setNumber:2,repetitions:10,weight:90,completed:true}]}]}]};
const roundTrip=backup.validate(backup.create({version:"test",build:"test"},historicalState,20),21).state;
assert.deepStrictEqual(roundTrip.history,historicalState.history,"backup round trip rewrote historical Smith records");

const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
for(const guidance of [
  "Hold a matched dumbbell in each hand with both arms relaxed at your sides",
  "Stand tall with feet about hip-width apart",
  "Step one foot backward while keeping the front foot fully planted.",
  "Lower under control to a comfortable depth.",
  "Let the front knee track naturally over the toes.",
  "Push through the front foot to return to standing.",
  "Do not force depth if the knee feels uncomfortable.",
  "Optional support: hold one dumbbell in one hand and lightly hold the M1 upright with the other"
])assert(app.includes(guidance),`missing guidance: ${guidance}`);
assert.match(app,/name:"Dumbbell Reverse Lunge"[\s\S]*?unilateral:true[\s\S]*?mode:"total",paired:true,label:"Combined dumbbell weight"/);

const mediaPath="assets/exercise-library/generated/dumbbell-reverse-lunge-sequence.png";
const libraryContext={self:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"exercise-library.js"),"utf8"),libraryContext,{filename:"exercise-library.js"});
const libraryEntry=libraryContext.self.ROAD12_EXERCISE_LIBRARY.entries[replacement];
assert.equal(libraryEntry.media,mediaPath);
assert.equal(libraryEntry.mediaType,"movement-sequence");
assert.equal(libraryEntry.compositeMovementSequence,true);
assert(fs.existsSync(path.join(root,mediaPath)),`primary movement-sequence media is missing: ${mediaPath}`);
assert(fs.readFileSync(path.join(root,"sw.js"),"utf8").includes(`"./${mediaPath}"`),"movement-sequence media is not cached for workout flow");

console.log("Dumbbell Reverse Lunge Build, history, media, load semantics, and Strava regression tests passed.");
