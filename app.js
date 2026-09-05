
const PHASE3_ASSET_MAP={
 "Treadmill Walking":"assets/phase3/treadmill-walking.jpg",
 "Treadmill Walk":"assets/phase3/treadmill-walking.jpg",
 "Incline Treadmill Walk":"assets/phase3/treadmill-incline-walk.jpg",
 "Treadmill Incline Walk":"assets/phase3/treadmill-incline-walk.jpg",
 "Treadmill HIIT":"assets/phase3/treadmill-hiit-intervals.jpg",
 "Treadmill HIIT Intervals":"assets/phase3/treadmill-hiit-intervals.jpg",
 "Rower Technique":"assets/phase3/rower-technique.jpg",
 "Rowing":"assets/phase3/rower-technique.jpg",
 "Bike Setup":"assets/phase3/kickr-core-bike-setup.jpg",
 "KICKR CORE Setup":"assets/phase3/kickr-core-bike-setup.jpg",
 "Endurance Ride":"assets/phase3/kickr-core-endurance-ride.jpg",
 "KICKR CORE Endurance Ride":"assets/phase3/kickr-core-endurance-ride.jpg",
 "Bike HIIT":"assets/phase3/kickr-core-hiit-ride.jpg",
 "KICKR CORE HIIT Ride":"assets/phase3/kickr-core-hiit-ride.jpg",
 "Dynamic Warm-Up":"assets/placeholders/dynamic-warm-up.svg",
 "Hip & Glute Mobility":"assets/placeholders/hip-glute-mobility.svg",
 "Thoracic & Shoulder Mobility":"assets/placeholders/thoracic-shoulder-mobility.svg",
 "Core Activation":"assets/placeholders/core-activation.svg",
 "Cool Down & Recovery":"assets/placeholders/cooldown-recovery.svg",
 "Cooldown":"assets/placeholders/cooldown-recovery.svg"
};


const PHASE2_ASSET_MAP={
 "Incline Cable Press":"assets/phase2/incline-cable-press.jpg",
 "Single Arm Cable Row":"assets/phase2/single-arm-cable-row.jpg",
 "Rear Delt Cable Fly":"assets/phase2/rear-delt-cable-fly.jpg",
 "Cable Lateral Raise":"assets/phase2/cable-lateral-raise.jpg",
 "Cable Hammer Curl":"assets/phase2/cable-hammer-curl.jpg",
 "Rope Hammer Curl":"assets/phase2/cable-hammer-curl.jpg",
 "High to Low Cable Chop":"assets/phase2/high-to-low-cable-chop.jpg",
 "Cable Face Pull":"assets/phase2/cable-face-pull.jpg",
 "Smith Machine RDL":"assets/phase2/smith-machine-rdl.jpg",
 "Smith Romanian Deadlift":"assets/phase2/smith-machine-rdl.jpg",
 "Bulgarian Split Squat":"assets/phase2/smith-bulgarian-split-squat.jpg",
 "Smith Bulgarian Split Squat":"assets/phase2/smith-bulgarian-split-squat.jpg",
 "Smith Machine Single-Leg Squat":"assets/exercise-library/generated/smith-bulgarian-split-squat-motion-guide.webp",
 "Smith Machine Calf Raise":"assets/phase2/smith-machine-calf-raise.jpg",
 "Smith Machine Hip Thrust":"assets/exercise-library/generated/smith-machine-hip-thrust-motion-guide.webp",
 "Cable Crunch":"assets/phase2/cable-crunch.jpg",
 "Cable Straight Arm Pushdown":"assets/phase2/cable-straight-arm-pushdown.jpg"
};

const APP_META=window.ROAD12_META||{
 version:"Unknown",
 build:"Unknown",
 lastUpdated:"Unknown",
 gitCommit:null,
 serviceWorkerCache:"Unknown"
};
const SAFE_EXERCISE_ASSET_OVERRIDES={
 "Arm Circles":"assets/placeholders/dynamic-warm-up.svg",
 "Dynamic Warm-Up":"assets/placeholders/dynamic-warm-up.svg",
 "Bodyweight Squat":"assets/placeholders/bodyweight-squat.svg",
 "Goblet Squat":"assets/placeholders/bodyweight-squat.svg",
 "Hip Hinge":"assets/placeholders/hip-hinge.svg",
 "Hip Flexor Mobility":"assets/exercise-library/original/hip-flexor-mobility.webp",
 "Hamstring Mobility":"assets/exercise-library/original/hamstring-mobility.webp",
 "Hip and Glute Mobility":"assets/placeholders/hip-glute-mobility.svg",
 "Hip & Glute Mobility":"assets/placeholders/hip-glute-mobility.svg",
 "Core Activation Circuit":"assets/placeholders/core-activation.svg",
 "Core Activation":"assets/placeholders/core-activation.svg",
 "Chest and Shoulder Mobility":"assets/exercise-library/original/chest-shoulder-mobility.webp",
 "Thoracic and Shoulder Mobility":"assets/exercise-library/original/chest-shoulder-mobility.webp",
 "Thoracic & Shoulder Mobility":"assets/placeholders/thoracic-shoulder-mobility.svg",
 "Post-Workout Stretch":"assets/placeholders/cooldown-recovery.svg",
 "Cool Down & Recovery":"assets/placeholders/cooldown-recovery.svg",
 "Cooldown":"assets/placeholders/cooldown-recovery.svg"
};
const LICENSED_EXERCISE_LIBRARY=window.ROAD12_EXERCISE_LIBRARY||{entries:{}};
function exerciseLibraryEntry(ex){
 return LICENSED_EXERCISE_LIBRARY.entries?.[ex?.name]||null;
}
function exerciseAsset(ex){
 const entry=exerciseLibraryEntry(ex);
 return entryDisplayAsset(entry);
}
function entryDisplayAsset(entry){return entry?.mediaType==="animation"&&entry.motionPoster?entry.motionPoster:entry?.media||null}
function listMarkup(items,emptyText){
 return items?.length?`<ul>${items.map(item=>`<li>${item}</li>`).join("")}</ul>`:`<p class="muted">${emptyText}</p>`;
}
function mediaStatus(entry){
 if(entry.mediaType==="animation")return "MOVEMENT ANIMATION";
 if(entry.mediaType==="movement-sequence")return "MOVEMENT GUIDE";
 if(entry.sourceType==="official-manual")return "OFFICIAL RITFIT GUIDE";
 if(entry.sourceType==="app-original")return "POSTURE ILLUSTRATION";
 return "REVIEWED LICENSED MEDIA";
}
function mediaChip(entry){
 if(entry.sourceType==="official-manual")return "RITFIT";
 if(entry.sourceType==="app-original")return "ROAD TO 12%";
 return entry.license?.shortName||"REVIEWED";
}
function libraryMediaLabel(entry){
 if(!entry)return "No reviewed image";
 if(entry.mediaType==="animation")return "App-created animation";
 if(entry.mediaType==="movement-sequence")return "App-created movement guide";
 if(entry.sourceType==="official-manual")return "Official RitFit guide";
 if(entry.sourceType==="app-original")return "App-created guide";
 return "Reviewed licensed guide";
}
function mediaCredit(entry){
 if(!entry)return "";
 if(entry.sourceType==="app-original"){
   return `${entry.rightsNote}`;
 }
 if(entry.sourceType==="official-manual"){
   return `Source: ${entry.sourceDocument}, exercise “${entry.sourceExercise},” by <a href="${entry.providerUrl}" target="_blank" rel="noopener">${entry.provider}</a>. Used as the machine-specific reference in Andy’s personal app.`;
 }
 return `Source: <a href="${entry.sourceUrl}" target="_blank" rel="noopener">${entry.sourceExercise}</a> by ${entry.author}, via <a href="${entry.providerUrl}" target="_blank" rel="noopener">${entry.provider}</a>. <a href="${entry.license.url}" target="_blank" rel="noopener">${entry.license.fullName}</a>.`;
}
function licensedMediaMarkup(ex){
 const entry=exerciseLibraryEntry(ex);
 if(!entry){
   return `<section class="exercise-media-card media-unavailable">
     <span class="media-status">COACHED INSTRUCTIONS</span>
     <h3>Follow the guided movement steps</h3>
     <p>Use the setup, execution, and coaching cues below. A visual will appear here only after it has been reviewed for this exact exercise.</p>
   </section>`;
 }
 const isAnimation=entry.mediaType==="animation"&&entry.motionPoster;
 const motionPlaying=isAnimation;
 const displayAsset=motionPlaying?entry.media:(isAnimation?entry.motionPoster:entry.media);
 return `<section class="exercise-media-card" data-motion-container>
   <div class="exercise-media-heading">
     <div><span class="media-status">${mediaStatus(entry)}</span><h3>Demonstration</h3></div>
     <span class="license-chip">${mediaChip(entry)}</span>
   </div>
   <button type="button" class="exercise-asset-button ${entry.sourceType==="app-original"?"original-asset-button":"licensed-asset-button"}" id="openAsset">
     <span class="motion-media-viewport"><img class="exercise-asset-image" width="600" height="600" src="${displayAsset}" alt="${entry.mediaAlt}" data-motion-image data-poster-src="${isAnimation?entry.motionPoster:displayAsset}" data-animation-src="${isAnimation?entry.media:""}"></span>
     <span>Tap to enlarge</span>
    </button>
   ${entry.movementSequence?`<figure class="movement-sequence-guide"><img src="${entry.movementSequence}" alt="${entry.movementSequenceAlt||entry.mediaAlt}"><figcaption>Movement sequence</figcaption></figure>`:""}
   ${isAnimation?`<div class="motion-controls"><button type="button" class="secondary" data-motion-toggle aria-pressed="true">Pause animation</button><small>Animation plays automatically. Pause it at any time.</small></div>`:""}
 </section>`;
}

document.addEventListener("click",event=>{
 const button=event.target.closest("[data-motion-toggle]");
 if(!button)return;
 const container=button.closest("[data-motion-container]");
 const image=container?.querySelector("[data-motion-image]");
 if(!image)return;
 const playing=button.getAttribute("aria-pressed")==="true";
 image.src=playing?image.dataset.posterSrc:image.dataset.animationSrc;
 button.setAttribute("aria-pressed",String(!playing));
 button.textContent=playing?"Play animation":"Pause animation";
 container.classList.toggle("is-motion-playing",!playing);
});
function exerciseTeachingMarkup(ex){
 const entry=exerciseLibraryEntry(ex);
 const primary=entry?.primaryMuscles?.length?entry.primaryMuscles:(ex.muscles||"").split(",").map(x=>x.trim()).filter(Boolean);
 const secondary=entry?.secondaryMuscles||[];
 const equipment=entry?.equipment||ex.setup?.slice(0,2)||[];
 const mistakes=entry?.commonMistakes||[
   "Using momentum instead of a controlled range",
   "Changing the prescribed grip or body orientation",
   "Continuing after sharp pain or loss of control"
 ];
 return `<section class="teaching-grid">
   <div class="teaching-card"><small>PRIMARY MUSCLES</small>${listMarkup(primary,"See the movement description.")}</div>
   <div class="teaching-card"><small>SECONDARY MUSCLES</small>${listMarkup(secondary,"Supporting muscles vary by setup.")}</div>
   <div class="teaching-card"><small>EQUIPMENT</small>${listMarkup(equipment,"No equipment required.")}</div>
 </section>
 ${licensedMediaMarkup(ex)}
 <section class="movement-instructions professional-instructions">
   <div class="instruction-block"><small>SETUP</small>${listMarkup(ex.setup,"Follow the setup shown above.")}</div>
   <div class="instruction-block"><small>EXECUTION</small><ol class="steps">${ex.steps.map(step=>`<li>${step}</li>`).join("")}</ol></div>
   <div class="instruction-block cue"><small>COACHING CUES</small>${listMarkup(ex.cues,"Move slowly and stay in a pain-free range.")}</div>
   <div class="instruction-block mistakes"><small>COMMON MISTAKES</small>${listMarkup(mistakes,"")}</div>
 </section>`;
}


const data=window.WORKOUT_DATA;
const gobletSquatTemplate=data.find(exercise=>exercise.name==="Goblet Squat");
if(gobletSquatTemplate){
  gobletSquatTemplate.setup=["Equipment: one dumbbell","Hold one end of the dumbbell vertically at chest"];
  gobletSquatTemplate.weightRecommendation="Begin with the lightest dumbbell until depth and balance are controlled.";
}
const smithSquatTemplate=window.SUBSTITUTION_DATA?.["smith-machine-squat"];
if(smithSquatTemplate){
  smithSquatTemplate.setup=smithSquatTemplate.setup.map(item=>
    item.includes("no bumper plates required")
      ?"Load the Smith bar with matched bumper plates only after completing controlled warm-up reps"
      :item
  );
  smithSquatTemplate.why="Trains the legs with a stable Smith path and supports progressive loading with the available bumper plates.";
  smithSquatTemplate.weightRecommendation="Begin with the empty Smith bar, then add matched plates conservatively while every rep remains smooth and controlled.";
  smithSquatTemplate.equipmentNote="Uses the RitFit M1 Smith bar with optional matched 10–45 lb bumper plates.";
  smithSquatTemplate.weightEntry={
    mode:"total",
    label:"Total plate weight across both sides",
    help:"Add together the plates on both sides. Do not include the 33 lb Smith bar; the calculator adds it for you."
  };
}
/* Versioned storage boundary. Migrations must remain ordered and idempotent. */
const ROAD12_STORAGE_KEY="road12v5";
const ROAD12_SCHEMA_VERSION=18;
const ADHERENCE_RESET_DATE="2026-08-20";
const ROAD12_MIGRATIONS=[
  {
    version:1,
    up(value){
      if(!Object.prototype.hasOwnProperty.call(value,"schemaVersion")){
        value.schemaVersion=1;
      }
      return value;
    }
  },
  {
    version:2,
    up(value){
      value.workoutSessions=Array.isArray(value.workoutSessions)?value.workoutSessions:[];
      value.calendarMonth=value.calendarMonth||null;
      value.scheduleActivatedDate=value.scheduleActivatedDate||localDateKey();
      value.schemaVersion=2;
      return value;
    }
  },
  {
    version:3,
    up(value){
      value.workoutSessions=Array.isArray(value.workoutSessions)?value.workoutSessions:[];
      value.scheduleActivatedDate=window.ROAD12_SCHEDULING.scheduleActivationDate(
        value.scheduleActivatedDate,
        localDateKey()
      );
      value.schemaVersion=3;
      return value;
    }
  },
  {
    version:4,
    up(value){
      value.equipment=Object.assign({},value.equipment||{}, {bumperPlates:true});
      value.schemaVersion=4;
      return value;
    }
  },
  {
    version:5,
    up(value){
      value.trainingProfile=window.ROAD12_ADAPTIVE.normalizeProfile(value.trainingProfile||{});
      value.adaptiveRecommendation=value.adaptiveRecommendation||null;
      value.acceptedAdaptivePlan=value.acceptedAdaptivePlan||null;
      value.schemaVersion=5;
      return value;
    }
  },
  {
    version:6,
    up(value){
      value.equipment=Object.assign({},value.equipment||{}, {dumbbells:true,kettlebells:false});
      value.schemaVersion=6;
      return value;
    }
  },
  {
    version:7,
    up(value){
      /* Reconcile the confirmed equipment profile so the additive v13.2
         exercises are not filtered from already-scheduled previews. */
      value.equipment=Object.assign({},value.equipment||{}, {dumbbells:true,rower:true,kettlebells:false});
      value.schemaVersion=7;
      return value;
    }
  },
  {
    version:8,
    up(value){
      value.trainingPhase=value.trainingPhase||{id:"foundation",number:1,startedAt:localDateKey(),status:"active",advancementLocked:true};
      value.measurementHistory=Array.isArray(value.measurementHistory)?value.measurementHistory:[];
      if(!value.measurementHistory.length&&(value.weight||value.waist))value.measurementHistory.push({id:`measurement-${Date.now()}`,date:localDateKey(),recordedAt:new Date().toISOString(),weight:value.weight||null,waist:value.waist||null,source:"migration"});
      value.cardioHistory=Array.isArray(value.cardioHistory)?value.cardioHistory:[];
      value.acceptedAdaptivePlan=null;
      value.adaptiveRecommendation=null;
      value.schemaVersion=8;
      return value;
    }
  },
  {
    version:9,
    up(value){
      value.exerciseFeedback=value.exerciseFeedback&&typeof value.exerciseFeedback==="object"?value.exerciseFeedback:{};
      value.approvedProgressions=value.approvedProgressions&&typeof value.approvedProgressions==="object"?value.approvedProgressions:{};
      value.schemaVersion=9;
      return value;
    }
  },
  {
    version:10,
    up(value){
      value.cardioTimers=value.cardioTimers&&typeof value.cardioTimers==="object"?value.cardioTimers:{};
      value.schemaVersion=10;
      return value;
    }
  },
  {
    version:11,
    up(value){
      /* Additive only: old workout history remains untouched and readable. */
      value.exerciseTimings=value.exerciseTimings&&typeof value.exerciseTimings==="object"?value.exerciseTimings:{};
      value.schemaVersion=11;
      return value;
    }
  },
  {
    version:12,
    up(value){
      /* Preserve early development history while beginning trustworthy
         adherence scoring from the requested clean baseline. */
      value.adherenceBaselineDate=value.adherenceBaselineDate||ADHERENCE_RESET_DATE;
      value.schemaVersion=12;
      return value;
    }
  },
  {
    version:13,
    up(value){
      /* Record the confirmed fixed dumbbell pairs without changing completed
         history or automatically increasing an active prescription. */
      value.equipment=Object.assign({},value.equipment||{}, {dumbbells:true,dumbbellPairWeights:[10,15,20,25]});
      value.schemaVersion=13;
      return value;
    }
  },
  {
    version:14,
    up(value){
      /* Add the approved four-week lower-ab track without rewriting prior
         Core + Recovery sessions or advancing phases by calendar time alone. */
      value.lowerAbsProgram=Object.assign({
        version:1,
        startedOn:localDateKey(),
        phase:1,
        status:"active",
        completedSessionIds:[],
        phase2ReadyAt:null,
        phase2AcceptedAt:null,
        completedAt:null
      },value.lowerAbsProgram||{});
      value.lowerAbsProgram.completedSessionIds=Array.isArray(value.lowerAbsProgram.completedSessionIds)
        ?value.lowerAbsProgram.completedSessionIds
        :[];
      value.schemaVersion=14;
      return value;
    }
  },
  {
    version:15,
    up(value){
      /* Record the newly confirmed 30 lb kettlebell additively. Existing
         workout history and active set results remain untouched. */
      value.equipment=Object.assign({},value.equipment||{}, {kettlebells:true,kettlebellWeights:[30]});
      value.schemaVersion=15;
      return value;
    }
  },
  {
    version:16,
    up(value){
      /* Add canonical body-composition records beside the legacy weight,
         waist and measurementHistory fields. Never rewrite old check-ins. */
      value.bodyMeasurements=Array.isArray(value.bodyMeasurements)?value.bodyMeasurements:[];
      const legacyMeasurements=(Array.isArray(value.measurementHistory)?value.measurementHistory:[])
        .map((item,index)=>window.ROAD12_BODY_MEASUREMENTS.fromLegacy(item,index))
        .filter(Boolean);
      const measurementIdentity=item=>`${item.timestamp}|${item.weight??""}|${item.waist??""}`;
      const knownMeasurements=new Set(value.bodyMeasurements.map(measurementIdentity));
      legacyMeasurements.forEach(item=>{
        const identity=measurementIdentity(item);
        if(!knownMeasurements.has(identity))value.bodyMeasurements.push(item);
        knownMeasurements.add(identity);
      });
      value.schemaVersion=16;
      return value;
    }
  },
  {
    version:17,
    up(value){
      value.stravaDeletion=window.ROAD12_STRAVA_DATA.normalizeMarker(value.stravaDeletion);
      value.schemaVersion=17;
      return window.ROAD12_STRAVA_DATA.enforce(value,value.stravaDeletion);
    }
  },
  {
    version:18,
    up(value){
      const approval=value.stravaPilotApproval;
      value.stravaPilotApproval=approval&&approval.sessionId?{sessionId:String(approval.sessionId),approvedAt:approval.approvedAt||null,consumedAt:approval.consumedAt||null}:null;
      value.schemaVersion=18;
      return value;
    }
  }
];
const road12Storage=(()=>{
  let writable=true;
  function migrate(value){
    const version=Number.isInteger(value.schemaVersion)?value.schemaVersion:0;
    return ROAD12_MIGRATIONS
      .filter(migration=>migration.version>version&&migration.version<=ROAD12_SCHEMA_VERSION)
      .reduce((current,migration)=>migration.up(current),value);
  }
  function load(){
    const raw=localStorage.getItem(ROAD12_STORAGE_KEY);
    if(raw===null)return migrate({});
    try{
      const parsed=JSON.parse(raw);
      if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))throw new Error("Stored value is not an object.");
      return migrate(parsed);
    }catch(error){
      writable=false;
      console.warn("Road to 12% could not read saved data; the original road12v5 value was preserved.",error);
      return migrate({});
    }
  }
  function write(value){
    if(!writable)return false;
    localStorage.setItem(ROAD12_STORAGE_KEY,JSON.stringify(value));
    return true;
  }
  function remove(){
    localStorage.removeItem(ROAD12_STORAGE_KEY);
    writable=true;
  }
  return {load,write,remove,migrate};
})();
const state=window.ROAD12_STRAVA_DATA.enforce(road12Storage.load());
let pendingWyzeImport=null;
let wyzeImportNotice="";
let stravaConnectionNotice="";
const progressExpandedSections=new Set();
Object.assign(state,{tab:state.tab||"home",step:state.step||0,logs:state.logs||{},sessions:state.sessions||0,weight:state.weight||221,waist:state.waist||43,history:state.history||[],selectedDay:Number.isInteger(state.selectedDay)?state.selectedDay:0,coachMode:state.coachMode!==false});
state.attachmentPhotos=state.attachmentPhotos||{};
state.currentSession=state.currentSession||null;
state.exerciseTimings=state.exerciseTimings&&typeof state.exerciseTimings==="object"?state.exerciseTimings:{};
state.historyView=state.historyView||null;
state.preferredName=state.preferredName||"Andy";
state.previewDay=Number.isInteger(state.previewDay)?state.previewDay:null;
state.workoutSessions=Array.isArray(state.workoutSessions)?state.workoutSessions:[];
state.calendarMonth=state.calendarMonth||null;
state.scheduleActivatedDate=state.scheduleActivatedDate||localDateKey();
state.adherenceBaselineDate=state.adherenceBaselineDate||ADHERENCE_RESET_DATE;
state.workoutScroll=Number.isFinite(state.workoutScroll)?state.workoutScroll:0;
state.trainingProfile=window.ROAD12_ADAPTIVE.normalizeProfile(state.trainingProfile||{});
state.adaptiveRecommendation=state.adaptiveRecommendation||null;
state.acceptedAdaptivePlan=state.acceptedAdaptivePlan||null;
state.trainingPhase=state.trainingPhase||{id:"foundation",number:1,startedAt:localDateKey(),status:"active",advancementLocked:true};
state.measurementHistory=Array.isArray(state.measurementHistory)?state.measurementHistory:[];
state.bodyMeasurements=Array.isArray(state.bodyMeasurements)?state.bodyMeasurements:[];
{
  const currentMeasurements=window.ROAD12_BODY_MEASUREMENTS.current(state.bodyMeasurements,{weight:state.weight,waist:state.waist});
  if(currentMeasurements.weight!==null)state.weight=currentMeasurements.weight;
  if(currentMeasurements.waist!==null)state.waist=currentMeasurements.waist;
}
state.cardioHistory=Array.isArray(state.cardioHistory)?state.cardioHistory:[];
state.cardioTimers=state.cardioTimers&&typeof state.cardioTimers==="object"?state.cardioTimers:{};
state.exerciseFeedback=state.exerciseFeedback&&typeof state.exerciseFeedback==="object"?state.exerciseFeedback:{};
state.approvedProgressions=state.approvedProgressions&&typeof state.approvedProgressions==="object"?state.approvedProgressions:{};
state.lowerAbsProgram=Object.assign({version:1,startedOn:localDateKey(),phase:1,status:"active",completedSessionIds:[],phase2ReadyAt:null,phase2AcceptedAt:null,completedAt:null},state.lowerAbsProgram||{});
state.lowerAbsProgram.completedSessionIds=Array.isArray(state.lowerAbsProgram.completedSessionIds)?state.lowerAbsProgram.completedSessionIds:[];
state.equipment=Object.assign({
  ritfitM1:true,
  bench:true,
  treadmill:true,
  rower:true,
  kickrCore:true,
  bumperPlates:true,
  dumbbells:true,
  dumbbellPairWeights:[10,15,20,25],
  kettlebells:true,
  kettlebellWeights:[30],
  gmwdConvergingChestPress:true,
  olympicBarbell:false
},state.equipment||{});
const weekPlan=[
 {short:"MON",icon:"🏋️",title:"Full Body A",detail:"Guided strength • chest, back, quads and shoulders",action:"workout",time:"55–65 min",focus:"Full-body strength",items:["Treadmill warm-up","Mobility","Smith Machine Squat","Cable Shoulder Press","Cable Curl","Smith Machine Bench Press","Seated Cable Row","Lat Pulldown","Rope Triceps Pushdown","Dumbbell Lateral Raise","Treadmill cooldown"],setup:"Smith and cable stations → 10 lb dumbbells"},
 {short:"TUE",icon:"🚶",title:"Cardio + Mobility",detail:"Incline treadmill, rowing technique and mobility recovery",action:"cardio",time:"45–50 min",focus:"Recovery, rowing skill and aerobic base",items:["5-minute easy treadmill warm-up","20–25 minute incline walk at conversational pace","8-minute easy iFIT rowing technique","Hip flexor stretch","Hamstring stretch","Chest and shoulder mobility","Easy cooldown"],setup:"Treadmill → iFIT rower → floor/wall mobility"},
 {short:"WED",icon:"💪",title:"Full Body B",detail:"Alternate guided full-body strength session",action:"upcoming",time:"60–70 min",focus:"Back, legs, chest and arms",items:["Treadmill warm-up","Hip hinge mobility","Smith Machine RDL","Smith Machine Single-Leg Squat","Smith Machine Calf Raise","GMWD Converging Chest Press","Single Arm Cable Row","Lat Pulldown","V-Bar Triceps Pushdown","Cable Lateral Raise","Cable Crunch","Cable Hammer Curl","Dumbbell Floor Press","Cooldown"],setup:"Smith station → GMWD chest press → cable stations"},
 {short:"THU",icon:"🧘",title:"Core + Recovery",detail:"Kettlebell technique, core training, stretching and easy movement",action:"recovery",time:"35–45 min",focus:"Kettlebell skill, core control and mobility",items:["Easy walk or row","Kettlebell Around the World","Kettlebell Swing","Kettlebell Suitcase Carry","Dead bug","Bird dog","Side plank from knees","Hip mobility","Upper-back mobility","Slow breathing cooldown"],setup:"30 lb kettlebell → floor space; optional treadmill or rower"},
 {short:"FRI",icon:"🏋️",title:"Full Body C",detail:"Third weekly guided full-body strength session",action:"upcoming",time:"70–80 min",focus:"Legs, glutes, pushing, pulling and arms",items:["Treadmill warm-up","Hip hinge mobility","Smith Machine Squat","Smith Machine Hip Thrust","Low-Incline Dumbbell Press","Cable Shoulder Press","Rear Delt Cable Fly","Cable Face Pull","Cable Straight Arm Pushdown","Rope Triceps Pushdown","High to Low Cable Chop","Dumbbell Romanian Deadlift","Treadmill HIIT Intervals","Cooldown"],setup:"Smith station and outside bench → low-incline dumbbell press → cable stations → treadmill"},
 {short:"SAT",icon:"❤️",title:"Zone 2 Cardio",detail:"Longer easy bike, rower or treadmill session",action:"cardio",time:"35–50 min",focus:"Fat-loss supporting aerobic work",items:["5-minute easy warm-up","25–40 minutes at a pace where you can speak in sentences","5-minute cooldown","Light stretching"],setup:"Choose treadmill, rower or KICKR CORE"},
 {short:"SUN",icon:"📏",title:"Recovery + Check-in",detail:"Rest, measurements and weekly review",action:"progress",time:"10–20 min",focus:"Recovery and progress review",items:["Morning body weight","Waist measurement","Optional progress photos","Review completed workouts","Plan the coming week","Full rest or gentle walk"],setup:"No gym setup required"}
];
const LEGACY_FOUNDATION_PROGRAM_REVISION="foundation-kettlebell-2026-08-27";
const PREVIOUS_FOUNDATION_PROGRAM_REVISION="foundation-smith-hip-thrust-2026-08-28";
const GMWD_FOUNDATION_PROGRAM_REVISION="foundation-gmwd-chest-press-2026-09-04";
const FOUNDATION_PROGRAM_REVISION="foundation-concentration-curl-2026-09-04";
Object.assign(weekPlan[0],{
  detail:"Guided strength - chest, back, quads, shoulders and arms",
  time:"60\u201370 min",
  items:[...weekPlan[0].items,"Alternating Dumbbell Curl"],
  setup:"Smith and cable stations \u2192 10 lb dumbbells"
});
Object.assign(weekPlan[1],{
  detail:"Incline treadmill, rowing technique, mobility and pelvic-floor relaxation",
  time:"50\u201355 min",
  items:[...weekPlan[1].items.slice(0,-1),"5-minute pelvic-floor relaxation",weekPlan[1].items.at(-1)]
});
Object.assign(weekPlan[3],{
  detail:"Kettlebell technique, phased lower-ab work, core training and mobility",
  time:"50\u201360 min",
  items:[...weekPlan[3].items.slice(0,7),"Lower Abs Progression",...weekPlan[3].items.slice(7)],
  setup:"30 lb kettlebell → floor space, bench and M1 pull-up bar; optional treadmill"
});
Object.assign(weekPlan[4],{
  detail:"Third weekly guided full-body strength session with added glute and biceps work",
  time:"65\u201375 min",
  items:[...weekPlan[4].items.slice(0,9),"Seated Concentration Curl",...weekPlan[4].items.slice(9)]
});
Object.assign(weekPlan[5],{
  detail:"Longer easy bike, rower or treadmill session plus pelvic-floor relaxation",
  time:"40\u201355 min",
  items:[...weekPlan[5].items.slice(0,-1),"5-minute pelvic-floor relaxation",weekPlan[5].items.at(-1)],
  setup:"Choose treadmill, rower or KICKR CORE \u2192 floor space"
});

const app=document.querySelector("#app"), nav=[...document.querySelectorAll("nav button")];
let timerId=null, remaining=0, timerEndsAt=null, timerAudioContext=null, activeTimerExercise=null;
const save=()=>road12Storage.write(state);
const equipmentLabels={
  ritfitM1:"RitFit M1 Pro",
  bench:"Adjustable bench",
  treadmill:"iFIT treadmill",
  rower:"iFIT rower",
  kickrCore:"Wahoo KICKR CORE",
  bumperPlates:"Olympic bumper plates",
  dumbbells:"Dumbbells",
  kettlebells:"Kettlebells",
  gmwdConvergingChestPress:"GMWD converging chest press",
  olympicBarbell:"Free Olympic barbell"
};
function hasRequirements(ex){
  return (ex.requires||["bodyweight"]).every(key=>key==="bodyweight"||state.equipment[key]);
}
function missingEquipment(ex){
  return (ex.requires||[]).filter(key=>!state.equipment[key]).map(key=>equipmentLabels[key]||key);
}
function resolveExercise(ex){
  if(hasRequirements(ex))return ex;
  const replacement=ex.substituteId && window.SUBSTITUTION_DATA?.[ex.substituteId];
  if(replacement && hasRequirements(replacement)){
    return Object.assign({},replacement,{
      originalExercise:ex.name,
      substitutionReason:`${ex.name} needs ${missingEquipment(ex).join(", ")}.`
    });
  }
  return Object.assign({},ex,{unavailable:true});
}
function setupGroup(ex){
  if(ex.type==="warmup"||ex.type==="mobility")return 0;
  if(ex.name.includes("Smith"))return 1;
  if(!ex.m1)return 2;
  const pin=Number(ex.m1.pinLeft)||7;
  if(pin<=4)return 3;
  if(pin<=9)return 4;
  return 5;
}
function setupBlockLabel(ex){
  return ({0:"Warm-up / mobility",1:"Smith station",2:"No pulley adjustment",3:"Low pulley block",4:"Mid pulley block",5:"High pulley block"})[setupGroup(ex)]||"Workout block";
}
function setupPlanSummary(workoutData=activeWorkout()){
  const blocks=[];
  workoutData.forEach(ex=>{
    const label=setupBlockLabel(ex);
    const pin=ex.m1?`Pin ${ex.m1.pinLeft}${ex.m1.pinRight?` / ${ex.m1.pinRight}`:""}`:"";
    const key=`${label}|${pin}`;
    let block=blocks.find(b=>b.key===key);
    if(!block){block={key,label,pin,count:0};blocks.push(block)}
    block.count++;
  });
  return blocks;
}
function substitutionCount(){
  return activeWorkout().filter(ex=>ex.originalExercise).length;
}

function localDateKey(d=new Date()){
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function todayCompleted(){
  return state.history.some(h=>(h.dateKey||"")===localDateKey());
}
function completedTodaySession(){
  return [...state.history].reverse().find(h=>(h.dateKey||"")===localDateKey());
}
function deepCopy(v){return JSON.parse(JSON.stringify(v));}
function migrateHistory(){
  let changed=false;
  state.history=state.history.map((h,i)=>{
    const item=Object.assign({},h);
    if(!item.id){item.id=`legacy-${Date.now()}-${i}`;changed=true}
    if(!item.dateKey){
      const parsed=new Date(item.date);
      item.dateKey=isNaN(parsed)?localDateKey():localDateKey(parsed);
      changed=true;
    }
    if(!item.completedAt){item.completedAt=new Date().toISOString();changed=true}
    if(!item.exercises){
      item.exercises=Object.entries(state.logs||{}).map(([name,sets])=>({
        name,
        sets:deepCopy(sets||[]),
        weightEntry:{mode:"legacy",label:"Saved weight",help:"Recovered from Version 11.3.2 local workout data."}
      }));
      item.recoveredFromV74=true;
      changed=true;
    }
    return item;
  });
  if(changed)save();
}
function attachmentFor(ex){
  return ex.attachmentCard||null;
}
function attachmentPhotoMarkup(ex){
  const a=attachmentFor(ex);
  if(!a)return "";
  const photo=state.attachmentPhotos[a.key];
  return `<section class="attachment-use-card">
    <div class="attachment-use-heading"><span class="use-this-badge">USE THIS ONE</span><strong>${a.name}</strong><small>Quantity: ${a.qty}</small></div>
    ${photo?`<img class="actual-attachment-photo" src="${photo}" alt="Your actual ${a.name}">`:`<div class="attachment-photo-placeholder"><span>📸</span><strong>Your actual attachment photo goes here</strong><small>Add it under Equipment → Attachment Locker.</small></div>`}
    <p>${a.qty===2?"Use one matching handle on each cable.":"Connect this attachment exactly as shown in Setup."}</p>
  </section>`;
}
function correctedDemoMarkup(ex){
  if(ex.correctedGuide==="shoulder-press"){
    return `<section class="corrected-demo">
      <div class="correction-banner"><strong>Corrected continuous setup</strong><span>Two D-handles only—no bar</span></div>
      <div class="sequence-grid">
        <div class="sequence-step"><span>1</span><strong>SETUP</strong><div class="pose-icon">🏋️‍♂️ ↩️</div><p>Bench between the low cables. Sit facing away. Hold one D-handle in each hand.</p></div>
        <div class="sequence-step"><span>2</span><strong>START</strong><div class="pose-icon">🙌</div><p>Handles at shoulder height. Cables remain outside your arms and away from your back.</p></div>
        <div class="sequence-step"><span>3</span><strong>PRESS</strong><div class="pose-icon">⬆️</div><p>Press both handles overhead in a slight arc without changing grip or body direction.</p></div>
        <div class="sequence-step"><span>4</span><strong>RETURN</strong><div class="pose-icon">⬇️</div><p>Lower to the identical starting position. Face away for every repetition.</p></div>
      </div>
      <div class="never-do"><strong>Do not use the straight bar.</strong> A bar can force the cable into your back and cannot follow the correct independent cable path.</div>
    </section>`;
  }
  if(ex.correctedGuide==="cable-curl"){
    return `<section class="corrected-demo">
      <div class="correction-banner"><strong>Corrected continuous setup</strong><span>Face the machine + palms up throughout</span></div>
      <div class="sequence-grid">
        <div class="sequence-step"><span>1</span><strong>SETUP</strong><div class="pose-icon">👤➡️🏋️</div><p>Face the RitFit M1. Attach the short straight bar to one low cable.</p></div>
        <div class="sequence-step"><span>2</span><strong>GRIP</strong><div class="pose-icon">🤲</div><p>Take an underhand, palms-up grip before the first repetition.</p></div>
        <div class="sequence-step"><span>3</span><strong>CURL</strong><div class="pose-icon">💪</div><p>Keep elbows pinned and curl while facing the machine with the same grip.</p></div>
        <div class="sequence-step"><span>4</span><strong>RETURN</strong><div class="pose-icon">↘️</div><p>Lower under control. Remain palms-up and facing the machine.</p></div>
      </div>
      <div class="never-do"><strong>Never turn around or change from overhand to underhand.</strong> The entire set uses one continuous orientation and grip.</div>
    </section>`;
  }
  return mediaMarkup(ex);
}
function formatDuration(ms){
  if(!ms||ms<0)return "Duration not captured";
  const mins=Math.max(1,Math.round(ms/60000));
  return `${mins} min`;
}
function exerciseMuscleMetadata(ex){
  const groups=String(ex.muscles||"").split(/,|\band\b|\+/i).map(value=>value.trim()).filter(Boolean);
  return {primaryMuscleGroup:groups[0]||"",secondaryMuscleGroups:groups.slice(1)};
}
function exerciseTiming(ex){
  const identity=window.ROAD12_EXERCISES.resolve(ex.name);
  return state.exerciseTimings[identity.id]||{};
}
function sessionExerciseSnapshot(){
  return activeWorkout().filter(ex=>ex.type==="strength").map((ex,exerciseOrder)=>{
    const identity=window.ROAD12_EXERCISES.resolve(ex.name),muscles=exerciseMuscleMetadata(ex),timing=exerciseTiming(ex);
    const basePrescription=window.ROAD12_PRESCRIPTIONS.basePrescription(ex);
    const progressionPrescription=window.ROAD12_PRESCRIPTIONS.forExercise(state.currentSession,ex,name=>window.ROAD12_EXERCISES.resolve(name));
    const effectivePrescription=window.ROAD12_PRESCRIPTIONS.effective(state.currentSession,ex,name=>window.ROAD12_EXERCISES.resolve(name));
    const actualSets=(state.logs[ex.name]||[]).map((set,setIndex)=>Object.assign({},deepCopy(set||{}),{
      setNumber:setIndex+1,
      repetitions:Number(set?.reps)||0,
      weight:set?.weight!==""&&set?.weight!==null&&set?.weight!==undefined&&Number.isFinite(Number(set.weight))?Number(set.weight):null,
      weightPerSide:ex.weightEntry?.mode==="perSide"&&Number.isFinite(Number(set?.weightPerSide??set?.weight))?Number(set?.weightPerSide??set?.weight):null,
      totalExternalLoadLb:ex.weightEntry?.mode==="perSide"&&Number.isFinite(Number(set?.totalExternalLoadLb??Number(set?.weightPerSide??set?.weight)*2))?Number(set?.totalExternalLoadLb??Number(set?.weightPerSide??set?.weight)*2):null,
      weightUnit:"lb",
      setType:set?.setType||"working",
      startedAt:set?.startedAt||null,
      completedAt:set?.completedAt||null,
      durationSeconds:Number.isFinite(set?.durationSeconds)?set.durationSeconds:null,
      restDurationSeconds:Number.isFinite(set?.restDurationSeconds)?set.restDurationSeconds:null,
      completed:!!set?.done,
      skipped:!set?.done,
      status:set?.done?"completed":"skipped"
    }));
    return {
      exerciseId:identity.id,
      name:ex.name,
      displayName:ex.name,
      category:ex.type,
      muscles:ex.muscles||"",
      primaryMuscleGroup:muscles.primaryMuscleGroup,
      secondaryMuscleGroups:muscles.secondaryMuscleGroups,
      equipmentUsed:deepCopy(ex.requires||[]),
      exerciseOrder:exerciseOrder+1,
      startedAt:timing.startedAt||null,
      endedAt:timing.endedAt||null,
      durationMs:timing.startedAt&&timing.endedAt?Math.max(0,new Date(timing.endedAt)-new Date(timing.startedAt)):null,
      basePrescription,
      prescription:effectivePrescription,
      progressionPrescription,
      prescriptionOutcome:progressionPrescription?window.ROAD12_PRESCRIPTIONS.outcome(effectivePrescription,actualSets):null,
      externalMappings:deepCopy(identity.externalMappings),
      originalExercise:ex.originalExercise||null,
      attachmentCard:ex.attachmentCard||null,
      weightEntry:ex.weightEntry||{mode:"total",label:"Weight used"},
      sets:actualSets,
      feedback:deepCopy(state.exerciseFeedback[ex.name]||null)
    };
  });
}
function durationMinutes(ex){const match=String(ex?.duration||"").match(/^(\d+):/);return match?Number(match[1]):null;}
function isMeaningfulCardioBlock(ex){return durationMinutes(ex)!==null&&(ex.type==="cardio"||/walk|treadmill|row|bike|cardio|warm.?up|cooldown/i.test(ex.name));}
function cardioBlocksForWorkout(workout){return workout.filter(isMeaningfulCardioBlock).map((ex,index)=>({id:`${index}-${ex.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,name:ex.name,plannedDurationMinutes:durationMinutes(ex),modality:/row/i.test(ex.name)?"Rowing":/bike/i.test(ex.name)?"Cycling":/run|treadmill|walk/i.test(ex.name)?"Treadmill":"Cardio"}));}
function previousCardioBlock(name,sessionId){return state.cardioHistory.slice().reverse().find(item=>item.name===name&&item.sessionId!==sessionId&&Number(item.actualDurationMinutes)>0)||null;}
function cardioComparison(previous){return previous?`Previous: ${previous.actualDurationMinutes} min${previous.distance?` • ${previous.distance} distance`:""}${previous.averageHeartRate?` • ${previous.averageHeartRate} bpm`:""}`:"No previous performance recorded.";}
function currentBodyMeasurements(){return window.ROAD12_BODY_MEASUREMENTS.current(state.bodyMeasurements,{weight:state.weight,waist:state.waist});}
function measurementTrend(days,field){return window.ROAD12_BODY_MEASUREMENTS.trend(state.bodyMeasurements,field,days);}
function measurementRollingAverage(days,field){return window.ROAD12_BODY_MEASUREMENTS.rollingAverage(state.bodyMeasurements,field,days);}
function strengthTrend(){const sessions=state.history.filter(item=>/Full Body [ABC]/.test(item.name||"")).slice(-6);if(sessions.length<2)return null;const first=sessionTotals(sessions[0]).selectedVolume,last=sessionTotals(sessions.at(-1)).selectedVolume;return first?Math.round((last-first)/first*100):null;}
function sessionTotals(session){
  const exercises=session.exercises||[];
  let completedSets=0,totalReps=0,selectedVolume=0;
  exercises.forEach(ex=>(ex.sets||[]).forEach(s=>{
    if(s?.done)completedSets++;
    const reps=Number(s?.reps)||0;
    totalReps+=s?.done?reps:0;
    if(s?.done)selectedVolume+=window.ROAD12_PRESCRIPTIONS.selectedLoad(ex,s,SMITH_BAR_WEIGHT_LB)*reps;
  }));
  return {completedSets,totalReps,selectedVolume};
}

function setTab(t){state.tab=t;save();render()}
nav.forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
document.querySelector("#reset").onclick=()=>{if(confirm("Reset Road to 12% workout data?")){road12Storage.remove();location.reload()}};
function ensurePhase1Button(){
 let button=document.querySelector("#phase1LibraryButton");
 if(!button){
   button=document.createElement("button");
   button.id="phase1LibraryButton";
   button.className="phase1-library-button";
   button.innerHTML="<strong>VISUAL LIBRARIES</strong><span>Phase 1, Phase 2 and Phase 3 training guides</span>";
   button.onclick=openVisualLibraries;
   document.body.appendChild(button);
 }
}
function render(){
 const brand=document.querySelector("#gymBrand");
 if(brand)brand.textContent=`${state.preferredName.toUpperCase()}'S HOME GYM`;
 document.querySelector('#phase1LibraryButton')?.remove();clearInterval(timerId);document.body.classList.toggle("workout-mode",state.tab==="workout");document.body.classList.toggle("home-mode",state.tab==="home");nav.forEach(b=>b.classList.toggle("active",b.dataset.tab===state.tab));({home:home,calendar:calendar,workout:workout,library:library,equipment:equipment,progress:progress}[state.tab]||home)()}

function previewScheduleForDay(sessions,dayIndex,today){
 return sessions
   .filter(item=>item.planDay===dayIndex&&item.scheduledDate>=today&&!['completed','restDay'].includes(item.status))
   .sort((a,b)=>a.scheduledDate.localeCompare(b.scheduledDate))[0]||null;
}
let previewReturnScroll=0;
function previewPerformanceMarkup(ex){
 const strength=ex.type==="strength";
 const previousWeight=strength?lastCompletedWeight(ex):null;
 const previousCardio=!strength?previousCardioBlock(ex.name,null):null;
 const lastPerformance=strength
   ?previousWeight?`${previousWeight.label} · ${previousWeight.date}`:"No previous completed weight yet"
   :previousCardio?`${previousCardio.actualDurationMinutes} min${previousCardio.distance?` · ${previousCardio.distance}`:""}`:"No previous performance logged yet";
 return `<section class="card preview-performance-card" aria-labelledby="previewPerformanceTitle"><h3 id="previewPerformanceTitle">Workout details</h3>${quickSettings(ex)}<div class="preview-last-performance"><small>${strength?"LAST WEIGHT USED":"LAST PERFORMANCE"}</small><strong>${lastPerformance}</strong></div>${strength?`<div class="weight-coach-card"><h3>Weight recommendation</h3><p>${ex.weightRecommendation||"Choose a load that keeps every prescribed repetition controlled."}</p></div>`:""}</section>`;
}
function showPreviewExerciseDetails(ex,dayIndex){
 app.innerHTML=`<section class="card workout-card professional-exercise-detail preview-exercise-detail"><button class="secondary" data-preview-detail-back>Back to workout preview</button><span class="pill">EXERCISE GUIDE</span><h2>${ex.name}</h2><p class="muted workout-subtitle">${ex.muscles}</p><div class="why-card"><h3>Why this exercise?</h3><p>${ex.why||"Builds strength, control and confidence."}</p></div>${attachmentPhotoMarkup(ex)}${ex.m1?m1SetupCoach(ex):""}${exerciseTeachingMarkup(ex)}</section>${previewPerformanceMarkup(ex)}<button class="secondary preview-detail-bottom-back" data-preview-detail-back>Back to workout preview</button>`;
 const back=()=>{showDayPlan(dayIndex);requestAnimationFrame(()=>window.scrollTo({top:previewReturnScroll,behavior:"auto"}))};
 document.querySelectorAll("[data-preview-detail-back]").forEach(button=>button.onclick=back);
 document.querySelector("#openAsset")?.addEventListener("click",()=>openExerciseAsset(ex));
 window.scrollTo({top:0,behavior:"auto"});
}
function showDayPlan(dayIndex=state.selectedDay){
 const day=weekPlan[dayIndex],isToday=dayIndex===currentPlanIndex();
 const previewExercises=day.action==="progress"?[]:workoutForDay(dayIndex);
 const previewItems=day.action==="progress"?day.items:previewExercises.map(exercise=>exercise.name);
 app.innerHTML=`<section class="card day-preview-card"><button class="secondary" id="previewBack">Back to schedule</button><div class="preview-title"><span class="large-icon">${day.icon}</span><div><span class="pill">${day.short} PREVIEW</span><h2>${day.title}</h2><p class="muted">${day.detail}</p></div></div><div class="brief-grid"><div><small>TIME</small><strong>${day.time}</strong></div><div><small>FOCUS</small><strong>${day.focus}</strong></div><div><small>STATUS</small><strong>${isToday&&todayCompleted()?"Completed":isToday?"Today":"Preview"}</strong></div><div><small>SETUP FLOW</small><strong>${day.setup}</strong></div></div></section>
 <section class="card"><h2>Workout preview</h2><p class="muted">Tap an exercise to review its animation, setup and previous performance. Previewing does not start or change your active workout.</p><ol class="preview-exercise-list">${previewItems.map((item,i)=>previewExercises[i]?`<li><button type="button" class="preview-exercise-button" data-preview-exercise="${i}" aria-label="View ${item} exercise details"><span>${i+1}</span><strong>${item}</strong><b aria-hidden="true">›</b></button></li>`:`<li class="preview-static-item"><span>${i+1}</span><strong>${item}</strong></li>`).join("")}</ol></section>
 ${day.action==="workout"||day.action==="upcoming"?`<section class="card setup-efficiency-card"><h3>M1 setup efficiency</h3><p>The sequence is grouped so you finish one pulley zone before moving to the next.</p><div class="setup-flow">${day.setup.split(" → ").map(x=>`<span>${x}</span>`).join("")}</div></section>`:""}
 <button class="primary" id="previewAction">${isToday?"Start today’s workout":"Start this workout early"}</button>`;
 document.querySelector("#previewBack").onclick=()=>{state.previewDay=null;save();home()};
 document.querySelectorAll("[data-preview-exercise]").forEach(button=>button.onclick=()=>{previewReturnScroll=window.scrollY;showPreviewExerciseDetails(previewExercises[Number(button.dataset.previewExercise)],dayIndex)});
 document.querySelector("#previewAction").onclick=()=>{
   if(day.action==="progress")return setTab("progress");
   if(!isToday&&!confirm(`Start ${day.title} early?`))return;
   const selectedSchedule=previewScheduleForDay(state.workoutSessions,dayIndex,localDateKey());
   startNewSession(dayIndex,selectedSchedule);setTab("workout");
 };
}


function mediaType(ex){
  const n=ex.name.toLowerCase();
  if(n.includes("treadmill")) return "treadmill";
  if(n.includes("arm circle")) return "circles";
  if(n.includes("squat")) return "squat";
  if(n.includes("hinge")) return "hinge";
  if(n.includes("stretch")) return "stretch";
  if(n.includes("lat pulldown") || n.includes("pushdown")) return "cable-high";
  if(n.includes("row") || n.includes("curl")) return "cable-low";
  if(n.includes("cable") || n.includes("chest press")) return "cable-mid";
  return "mobility";
}

function humanSvg(){
  return `<svg class="svg-human body-bob motion-part" viewBox="0 0 180 300" aria-label="Animated walking figure" role="img">
    <g>
      <circle class="skin" cx="92" cy="30" r="22"></circle>
      <rect class="skin" x="85" y="49" width="14" height="16" rx="7"></rect>

      <path class="shirt torso" d="M67 64 Q91 51 116 66 L121 140 Q94 155 64 139 Z"></path>
      <path class="shorts" d="M65 137 Q92 148 121 139 L117 174 L91 176 L65 172 Z"></path>

      <g class="upper-arm arm-back motion-part">
        <rect class="skin" x="64" y="72" width="15" height="67" rx="8"></rect>
        <g class="lower-arm forearm-back motion-part">
          <rect class="skin" x="64" y="126" width="14" height="57" rx="7"></rect>
          <circle class="joint" cx="71" cy="130" r="7"></circle>
        </g>
      </g>

      <g class="upper-arm arm-front motion-part">
        <rect class="skin" x="108" y="72" width="15" height="67" rx="8"></rect>
        <g class="lower-arm forearm-front motion-part">
          <rect class="skin" x="109" y="126" width="14" height="57" rx="7"></rect>
          <circle class="joint" cx="116" cy="130" r="7"></circle>
        </g>
      </g>

      <g class="thigh leg-back motion-part">
        <rect class="shorts" x="71" y="163" width="21" height="75" rx="10"></rect>
        <g class="shin shin-back motion-part">
          <rect class="skin" x="73" y="224" width="17" height="64" rx="8"></rect>
          <path class="shoe" d="M67 281 h39 q10 0 12 8 h-54 q0-6 3-8z"></path>
          <circle class="joint" cx="82" cy="226" r="8"></circle>
        </g>
      </g>

      <g class="thigh leg-front motion-part">
        <rect class="shorts" x="95" y="163" width="21" height="75" rx="10"></rect>
        <g class="shin shin-front motion-part">
          <rect class="skin" x="97" y="224" width="17" height="64" rx="8"></rect>
          <path class="shoe" d="M91 281 h39 q10 0 12 8 h-54 q0-6 3-8z"></path>
          <circle class="joint" cx="106" cy="226" r="8"></circle>
        </g>
      </g>
    </g>
  </svg>`;
}


function pinRailMarkup(pin){return `<div class="pin-rail">${Array.from({length:13},(_,i)=>13-i).map(n=>`<div class="pin-hole ${n===pin?"selected":""}"><span class="pin-number">${n%2===1?n:""}</span></div>`).join("")}</div>`}
function m1PinClass(pin){if(pin>=10)return"pin-13";if(pin<=2)return"pin-1";return"pin-5"}
function m1SetupCoach(ex){
 const m=ex.m1,rightText=m.pinRight?`Right: ${m.pinRight}`:"One pulley only";
 return `<div class="simple-setup-flow">
   <section class="setup-section pin-only-section"><div class="section-number">1</div><div><small>SET THE M1</small><h3>Pin position</h3></div><div class="pin-guide simplified">${pinRailMarkup(m.pinLeft)}<div class="pin-copy"><h3>Position ${m.pinLeft}</h3><div class="pin-values"><span>Left: ${m.pinLeft}</span><span>${rightText}</span></div><p>Pull the pop pin, slide to the selected hole, release it, and tug the carriage to verify it locked.</p></div></div></section>
   <section class="setup-section"><div class="section-number">2</div><div><small>ATTACHMENT</small><h3>${m.attachment}</h3><p>Confirm every carabiner gate is fully closed.</p></div></section>
   <section class="setup-section"><div class="section-number">3</div><div><small>BODY POSITION</small><h3>${m.facing}</h3><p><strong>Bench:</strong> ${m.bench}</p><p><strong>Stance:</strong> ${m.stance}</p><p><strong>Start:</strong> ${m.start}</p></div></section>
   <section class="setup-section"><div class="section-number">4</div><div><small>MOVEMENT</small><h3>${m.finish}</h3><p><strong>Best view:</strong> ${m.view}</p></div></section>
 </div>`;
}
function bindSetupCoach(){document.querySelectorAll("[data-setup-stage]").forEach(btn=>{btn.onclick=()=>{const target=btn.dataset.setupStage;document.querySelectorAll("[data-setup-stage]").forEach(x=>x.classList.toggle("active",x===btn));document.querySelectorAll("[data-setup-panel]").forEach(p=>p.classList.toggle("active",p.dataset.setupPanel===target));bindAnimationControls()}})}

function focusedDemoMarkup(ex){
  return `<div class="verified-asset">
    <div class="verified-asset-frame">
      <img src="${ex.demoImage}" alt="${ex.name} start, movement and finish demonstration">
      <div class="verified-asset-copy">
        <span class="quality-badge">✓ Quality-controlled asset</span>
        <h3>${ex.name}</h3>
        <p>The same trainer, equipment orientation and camera logic are maintained through the start, working and finish positions.</p>
        <div class="guide-actions">
          <button class="primary-guide" data-open-asset="${ex.demoImage}">Open full-screen demo</button>
        </div>
      </div>
    </div>
  </div>`;
}

function youtubeEmbedUrl(query){
  const encoded=encodeURIComponent(query||"beginner exercise proper form");
  return `https://www.youtube-nocookie.com/embed?listType=search&list=${encoded}&playsinline=1&rel=0&modestbranding=1`;
}

function videoMarkup(ex){
  if(!ex.youtubeQuery){
    return `<div class="video-info-card"><h3>Embedded video pending</h3><p>A beginner-appropriate embedded form video has not yet been assigned. Use Demo, Setup and Steps for this movement.</p></div>`;
  }
  return `<div class="embed-video-shell">
    <div class="youtube-frame">
      <iframe
        src="${youtubeEmbedUrl(ex.youtubeQuery)}"
        title="${ex.name} embedded form videos"
        loading="lazy"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
      </iframe>
    </div>
    <div class="video-info-card">
      <span class="quality-badge">Embedded YouTube</span>
      <h3>${ex.name} form videos</h3>
      <p>The player searches for beginner-focused proper-form demonstrations and plays inside Road to 12%. Select a video in the player before starting your set.</p>
      <a class="video-fallback-link" href="${ex.youtubeSearchUrl||"#"}" target="_blank" rel="noopener noreferrer">Open YouTube results only if embedding fails</a>
    </div>
    <div class="beginner-warning"><strong>Beginner safety:</strong> compare the video with the Setup and Steps tabs. Stop if you feel sharp pain, joint pain, numbness or loss of control.</div>
  </div>`;
}

function bindVideoLinks(){}
function bindAssetViewer(){
  document.querySelectorAll("[data-open-asset]").forEach(btn=>{
    btn.onclick=()=>openAsset(btn.dataset.openAsset);
  });
  document.querySelectorAll("[data-open-library]").forEach(btn=>{
    btn.onclick=()=>openAsset("assets/ritfit-exercise-library.png");
  });
}

function openAsset(src){
  let viewer=document.querySelector("#assetViewer");
  if(!viewer){
    viewer=document.createElement("div");
    viewer.id="assetViewer";
    viewer.className="fullscreen-asset";
    viewer.innerHTML=`<button id="closeAsset">Close</button><img alt="Exercise demonstration asset">`;
    document.body.appendChild(viewer);
  }
  viewer.querySelector("img").src=src;
  viewer.classList.add("open");
  viewer.querySelector("#closeAsset").onclick=()=>viewer.classList.remove("open");
}
function mediaMarkup(ex){return focusedDemoMarkup(ex);}
function bindAnimationControls(){
  const root=document.querySelector("[data-animation-root]");
  const play=document.querySelector("[data-animation-play]");
  const restart=document.querySelector("[data-animation-restart]");
  if(!root||!play)return;

  play.onclick=()=>{
    const paused=root.classList.toggle("is-paused");
    root.classList.toggle("is-playing",!paused);
    play.textContent=paused?"Play animation":"Pause animation";
    play.classList.toggle("active",!paused);
  };

  if(restart){
    restart.onclick=()=>{
      const clone=root.cloneNode(true);
      root.replaceWith(clone);
      bindAnimationControls();
    };
  }
}

function quickSettings(ex){
  const priorExposure=ex.engagementTarget&&state.history.some(session=>(session.exercises||[]).some(item=>item.name===ex.name));
  const rirRange=priorExposure?ex.progressionRirRange:(ex.firstExposureRirRange||ex.progressionRirRange);
  const values = ex.type==="strength"
    ? [
        ["Target",`${ex.sets} × ${ex.reps}${ex.repUnit==="seconds"?" sec":""}`],
        ["Rest",`${ex.rest} sec`],
        ["Focus",ex.engagementTarget?`${ex.engagementTarget} · ${rirRange?.join("–")} RIR`:"Controlled form"]
      ]
    : [
        ["Duration",ex.duration],
        ["Intensity",ex.name.includes("Treadmill")?"Easy pace":"Gentle"],
        ["Goal",ex.type==="warmup"?"Warm up":"Mobility"]
      ];
  return `<div class="quick-settings">${values.map(v=>`<div class="quick-setting"><small>${v[0]}</small><strong>${v[1]}</strong></div>`).join("")}</div>`;
}

function bindGuideTabs(){
  document.querySelectorAll("[data-guide-tab]").forEach(btn=>{
    btn.onclick=()=>{
      const target=btn.dataset.guideTab;
      document.querySelectorAll("[data-guide-tab]").forEach(x=>x.classList.toggle("active",x===btn));
      document.querySelectorAll("[data-guide-panel]").forEach(panel=>panel.classList.toggle("hidden",panel.dataset.guidePanel!==target));
    };
  });
}


function restCoachText(n){if(n<=10)return"Get ready and set your posture.";if(n<=20)return"Review the next setup and take two slow breaths.";if(n<=40)return"Drink water if needed and relax your grip.";return"Recover and prepare for the next set."}


function openVisualLibraries(){
 const overlay=document.createElement("div");
 overlay.className="asset-overlay phase1-library-overlay";
 overlay.innerHTML=`<div class="asset-overlay-panel phase1-library-panel">
   <button class="asset-close">Close</button>
   <h2>Road to 12% Visual Libraries</h2>
   <p>Choose a phase to review the complete anatomical exercise and equipment guides.</p>
   <div class="visual-library-tabs">
     <button class="visual-library-tab active" data-phase="1">Phase 1</button>
     <button class="visual-library-tab" data-phase="2">Phase 2</button>
     <button class="visual-library-tab" data-phase="3">Phase 3</button>
   </div>
   <div class="visual-library-summary" id="visualLibrarySummary">Full Body A, M1 attachment reference, M1 setup and Smith machine setup.</div>
   <img id="visualLibraryImage" src="assets/phase1/phase1-complete-library.jpg" alt="Road to 12 percent Phase 1 visual library">
 </div>`;
 document.body.appendChild(overlay);
 const image=overlay.querySelector("#visualLibraryImage");
 const summary=overlay.querySelector("#visualLibrarySummary");
 overlay.querySelectorAll(".visual-library-tab").forEach(button=>{
   button.onclick=()=>{
     overlay.querySelectorAll(".visual-library-tab").forEach(x=>x.classList.remove("active"));
     button.classList.add("active");
     if(button.dataset.phase==="3"){
       image.src="assets/phase3/phase3-complete-library.jpg";
       image.alt="Road to 12 percent Phase 3 visual library";
       summary.textContent="Treadmill, rower, KICKR CORE, warm-up, mobility, core activation and recovery guides.";
     }else if(button.dataset.phase==="2"){
       image.src="assets/phase2/phase2-complete-library.jpg";
       image.alt="Road to 12 percent Phase 2 visual library";
       summary.textContent="Full Body B and Full Body C expansion exercises using the same red-and-white anatomical design system.";
     }else{
       image.src="assets/phase1/phase1-complete-library.jpg";
       image.alt="Road to 12 percent Phase 1 visual library";
       summary.textContent="Full Body A, M1 attachment reference, M1 setup and Smith machine setup.";
     }
   };
 });
 const close=()=>overlay.remove();
 overlay.querySelector(".asset-close").onclick=close;
 overlay.onclick=e=>{if(e.target===overlay)close()};
}

function openExerciseAsset(ex){
 const entry=exerciseLibraryEntry(ex);
 if(!entry)return;
 const poster=entry.mediaType==="animation"&&entry.motionPoster?entry.motionPoster:entry.media;
 const motionPlaying=entry.mediaType==="animation";
 const displayAsset=motionPlaying?entry.media:poster;
 const previousFocus=document.activeElement;
 const background=document.querySelector(".shell");
 const backgroundWasInert=background?.hasAttribute("inert")||false;
 const overlay=document.createElement("div");
 overlay.className="asset-overlay";
 overlay.setAttribute("role","dialog");
 overlay.setAttribute("aria-modal","true");
 overlay.setAttribute("aria-labelledby","exerciseAssetTitle");
 overlay.innerHTML=`<div class="asset-overlay-panel" data-motion-container><button class="asset-close" type="button">Close</button><h2 id="exerciseAssetTitle">${ex.name}</h2><div class="motion-media-viewport asset-motion-viewport"><img width="600" height="600" data-motion-image data-poster-src="${poster}" data-animation-src="${entry.mediaType==="animation"?entry.media:""}" src="${displayAsset}" alt="${entry.mediaAlt}"></div>${entry.mediaType==="animation"?`<div class="motion-controls"><button type="button" class="secondary" data-motion-toggle aria-pressed="true">Pause animation</button></div>`:""}<p>Use this visual together with the setup and movement instructions.</p></div>`;
 document.body.appendChild(overlay);
 document.body.classList.add("modal-open");
 if(background&&!backgroundWasInert)background.setAttribute("inert","");
 const close=()=>{document.removeEventListener("keydown",onKeydown);overlay.remove();document.body.classList.remove("modal-open");if(background&&!backgroundWasInert)background.removeAttribute("inert");previousFocus?.focus?.()};
 const onKeydown=event=>{
   if(event.key==="Escape"){event.preventDefault();close();return}
   if(event.key!=="Tab")return;
   const focusable=[...overlay.querySelectorAll("button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])")].filter(node=>!node.disabled);
   if(!focusable.length)return;
   const first=focusable[0],last=focusable[focusable.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 };
 document.addEventListener("keydown",onKeydown);
 overlay.querySelector(".asset-close").onclick=close;
 overlay.onclick=e=>{if(e.target===overlay)close()};
 overlay.querySelector(".asset-close").focus();
}

function chestSetupMarkup(ex){
  if(!ex.chestSetup)return "";
  return `<section class="chest-setup-card" aria-labelledby="chestSetupTitle">
    <span class="pill">TECHNIQUE FIRST</span>
    <h3 id="chestSetupTitle">${ex.chestSetup.title}</h3>
    <ol>${ex.chestSetup.instructions.map(item=>`<li>${item}</li>`).join("")}</ol>
    <blockquote>${ex.chestSetup.cue}</blockquote>
  </section>`;
}

function chestActivationMarkup(ex){
  if(!ex.chestActivation)return "";
  const exerciseId=window.ROAD12_EXERCISES.resolve(ex.name).id;
  const completed=!!state.currentSession?.chestActivation?.[exerciseId]?.completed;
  return `<section class="chest-activation-card">
    <span class="pill">OPTIONAL ACTIVATION</span>
    <h3>Chest Activation Set</h3>
    <p><strong>1 set × 12–15 reps · very light resistance</strong></p>
    <div class="activation-tempo"><span>3 sec lowering</span><span>Brief stretch</span><span>2 sec pressing</span><span>Chest squeeze</span></div>
    <p>This set is for learning the movement, not fatigue. Use a light weight and focus entirely on feeling the chest contract.</p>
    <small>Not counted toward working volume, progression, history, or personal records.</small>
    <button type="button" class="secondary" id="chestActivationDone" aria-pressed="${completed}">${completed?"Activation complete ✓":"Mark activation complete"}</button>
  </section>`;
}

function bindChestActivation(ex){
  const button=document.querySelector("#chestActivationDone");
  if(!button||!state.currentSession)return;
  const exerciseId=window.ROAD12_EXERCISES.resolve(ex.name).id;
  button.onclick=()=>{
    state.currentSession.chestActivation=state.currentSession.chestActivation||{};
    const completed=button.getAttribute("aria-pressed")!=="true";
    if(completed)state.currentSession.chestActivation[exerciseId]={completed:true,completedAt:new Date().toISOString()};
    else delete state.currentSession.chestActivation[exerciseId];
    save();
    button.setAttribute("aria-pressed",String(completed));
    button.textContent=completed?"Activation complete ✓":"Mark activation complete";
  };
}

function lastCompletedWeight(ex){
 const match=state.history.slice().reverse().map(session=>({
   session,
   exercise:(session.exercises||[]).find(item=>item.name===ex.name)
 })).find(item=>item.exercise&&(item.exercise.sets||[]).some(set=>(set?.done||set?.completed)&&window.ROAD12_PRESCRIPTIONS.hasRecordedWeight(item.exercise,set)));
 if(!match)return null;
 const completedSets=match.exercise.sets.filter(set=>(set?.done||set?.completed)&&window.ROAD12_PRESCRIPTIONS.hasRecordedWeight(match.exercise,set));
 const weight=Number(completedSets[completedSets.length-1].weight);
 if(!Number.isFinite(weight))return null;
 const mode=match.exercise.weightEntry?.mode||ex.weightEntry?.mode;
 const isSmith=ex.name.includes("Smith")&&mode==="total";
 const label=isSmith
   ?`${weight} lb plates total (${weight+SMITH_BAR_WEIGHT_LB} lb working weight)`
   :mode==="dual"?`${weight} lb per stack`:mode==="perSide"?`${weight} lb per side (${weight*2} lb total external load)`:`${weight} lb`;
 return {label,date:v1131DateLabel(match.session)};
}

function sets(ex){
 const entry=ex.weightEntry||{mode:"total",label:"Weight used",help:"Enter the weight used for this set."};
 const isSmithAddedWeight=ex.name.includes("Smith")&&entry.mode==="total";
 const isBodyweight=entry.mode==="bodyweight";
 const repLabel=ex.repUnit==="seconds"?"SECONDS":"REPS";
 const targetUnit=ex.repUnit==="seconds"?" sec":" reps";
 const displayedLabel=isSmithAddedWeight?"Total Plates — Both Sides":entry.label;
 const previous=lastCompletedWeight(ex);
 const feedback=state.exerciseFeedback[ex.name]||{rir:"",form:"",discomfort:false,muscleEngagement:null};
 const engagementRating=feedback.muscleEngagement?.rating||"";
 const captured=window.ROAD12_PRESCRIPTIONS.forExercise(state.currentSession,ex,name=>window.ROAD12_EXERCISES.resolve(name));
 const target=window.ROAD12_PRESCRIPTIONS.effective(state.currentSession,ex,name=>window.ROAD12_EXERCISES.resolve(name));
 return `<section class="card timer-card"><h3>${target.sets} sets × ${target.reps}${targetUnit}</h3>
 ${captured?`<div class="approved-prescription"><small>PRESCRIBED FOR THIS SESSION · ${captured.action}</small><strong>${captured.prescription.summary||`${target.sets} sets × ${target.reps} reps${target.weight!=null?` at ${target.weight} ${target.weightUnit}`:""}`}</strong><span>Record what you actually perform below. You can override any target.</span></div>`:""}<div class="weight-entry-explainer"><span>${entry.mode==="dual"?"↔️":entry.mode==="single"?"1️⃣":"🏋️"}</span><div><strong>${displayedLabel}</strong><p>${entry.help}</p>${previous?`<small class="previous-weight">Last completed: <b>${previous.label}</b> on ${previous.date}</small>`:'<small class="previous-weight">No previous completed weight yet.</small>'}${entry.mode==="dual"?`<small>Example: left 20 lb + right 20 lb → enter <b>20</b>; combined selected stack weight is 40 lb.</small>`:entry.mode==="perSide"?`<small>Example: 25 lb on the left + 25 lb on the right → enter <b>25</b>; total external load is 50 lb.</small>`:""}</div></div>
 <div class="set-table-head"><span>SET</span><span>${isBodyweight?"LOAD":entry.mode==="dual"?"LB / STACK":entry.mode==="perSide"?"LB / SIDE":isSmithAddedWeight?"PLATES TOTAL":"WEIGHT LB"}</span><span>${repLabel}</span><span>DONE</span></div>
 ${state.logs[ex.name].map((v,i)=>{const weightValue=isBodyweight?"":window.ROAD12_PRESCRIPTIONS.inputWeight(v?.weight,target.weight);return `<div class="set-row"><strong>${i+1}</strong>${isBodyweight?`<span class="bodyweight-load">Bodyweight</span>`:`<input data-w="${i}" inputmode="decimal" placeholder="${entry.mode==="dual"?"per stack":entry.mode==="perSide"?"per side":isSmithAddedWeight?"both sides":"lb"}" aria-label="${displayedLabel}, set ${i+1}" value="${weightValue}">`}<input data-r="${i}" inputmode="numeric" aria-label="${repLabel.toLowerCase()}, set ${i+1}" value="${v?.reps||window.ROAD12_PRESCRIPTIONS.minimumReps(target.reps)}"><button data-d="${i}" class="${v?.done?"done":""}" aria-label="${v?.done?"Mark set incomplete":"Mark set complete"}">${v?.done?"✓":"○"}</button>${["dual","perSide"].includes(entry.mode)&&weightValue!==""?`<small class="combined-weight">${entry.mode==="perSide"?"Total external load":"Combined selected"}: ${Number(weightValue)*2} lb</small>`:""}</div>`;}).join("")}
 <div class="exercise-feedback"><div><small>QUICK EXERCISE FEEDBACK</small><strong>Help tune the next session</strong></div><label>Reps left in reserve<select id="exerciseRir"><option value="">Choose</option>${[0,1,2,3,4].map(value=>`<option value="${value}" ${String(feedback.rir)===String(value)?"selected":""}>${value===4?"4+":value}</option>`).join("")}</select></label><label>Form quality<select id="exerciseForm"><option value="">Choose</option><option ${feedback.form==="Clean"?"selected":""}>Clean</option><option ${feedback.form==="Breaking down"?"selected":""}>Breaking down</option></select></label>${ex.engagementTarget?`<label>${ex.engagementTarget==="upper chest"?"Upper chest":"Chest"} engagement<select id="exerciseEngagement"><option value="">Choose</option>${["Strong","Moderate","Low","None",...(ex.minimumProgressionExposures?["Mostly front delts/triceps"]:[])].map(value=>`<option ${engagementRating===value?"selected":""}>${value}</option>`).join("")}</select></label>`:""}<label class="feedback-check"><input id="exerciseDiscomfort" type="checkbox" ${feedback.discomfort?"checked":""}><span>Pain or discomfort was present</span></label><p>If pain is sharp, worsening, or unusual, stop the movement. This feedback can recommend a deload but does not diagnose an injury.</p></div>
 <div class="timer" id="timer" role="status" aria-live="polite">Rest ${String(Math.floor(ex.rest/60)).padStart(2,"0")}:${String(ex.rest%60).padStart(2,"0")}</div><div class="rest-coach-message" id="restCoach">Recover and prepare for your next set.</div><div class="timer-controls"><button class="secondary" id="rest">Start rest timer</button><button class="secondary" id="stopTimer">Stop timer</button></div></section>`}
function captureExerciseFeedback(ex){
 const rir=document.querySelector("#exerciseRir")?.value||"";
 const form=document.querySelector("#exerciseForm")?.value||"";
  const discomfort=!!document.querySelector("#exerciseDiscomfort")?.checked;
 const engagement=document.querySelector("#exerciseEngagement")?.value||"";
 if(!rir&&!form&&!discomfort&&!engagement)return;
 state.exerciseFeedback[ex.name]={rir:rir===""?null:Number(rir),form,discomfort,muscleEngagement:engagement?{target:ex.engagementTarget,rating:engagement}:null,recordedAt:new Date().toISOString()};
 save();
}
function timed(ex){const cardio=isMeaningfulCardioBlock(ex),runtime=state.cardioTimers[ex.name];return `<section class="card timer-card"><h3>${ex.duration}</h3>${cardio?'<p class="cardio-timer-note">The countdown is your target. When it finishes, tap <strong>Keep going</strong> to continue tracking total cardio time.</p>':""}<div class="timer" id="timer" role="status" aria-live="polite">${ex.duration.includes(":")?ex.duration:"Ready"}</div>${cardio?'<div class="cardio-total" id="cardioTotal" aria-live="polite">Total cardio: 00:00</div>':""}${ex.duration.includes(":")?`<div class="timer-controls"><button class="primary" id="rest">${runtime?.status?"Restart target":"Start timer"}</button>${cardio?'<button class="primary keep-going" id="keepGoing" hidden>Keep going</button>':""}<button class="secondary" id="stopTimer">Stop timer</button></div>`:""}</section>`}
function loadEntryFields(ex,weight){
 const numeric=weight!==""&&weight!==null&&weight!==undefined&&Number.isFinite(Number(weight))?Number(weight):null;
 return ex.weightEntry?.mode==="perSide"
   ?{weight,weightPerSide:numeric,totalExternalLoadLb:numeric===null?null:numeric*2}
   :{weight};
}
function bindSets(ex){
 document.querySelectorAll("[data-w],[data-r]").forEach(input=>input.onchange=()=>{
   const i=Number(input.dataset.w??input.dataset.r);
   const existing=state.logs[ex.name][i]||{};
   state.logs[ex.name][i]=Object.assign({},existing,loadEntryFields(ex,document.querySelector(`[data-w="${i}"]`)?.value||(ex.weightEntry?.mode==="bodyweight"?0:"")),{
     startedAt:existing.startedAt||new Date().toISOString(),
     reps:document.querySelector(`[data-r="${i}"]`)?.value||ex.reps
   });
   save();
 });
 document.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{
   const i=+b.dataset.d;
   const w=document.querySelector(`[data-w="${i}"]`)?.value||(ex.weightEntry?.mode==="bodyweight"?0:"");
   const r=document.querySelector(`[data-r="${i}"]`).value;
   const done=!state.logs[ex.name][i]?.done;
   const existing=state.logs[ex.name][i]||{},now=new Date().toISOString();
   state.logs[ex.name][i]=Object.assign({},existing,loadEntryFields(ex,w),{reps:r,done,startedAt:existing.startedAt||now,completedAt:done?now:null});
   save();
   b.classList.toggle("done",done);
   b.textContent=done?"✓":"○";
   b.setAttribute("aria-label",done?"Mark set incomplete":"Mark set complete");
   if(done)startTimer(ex.rest);
 });
 document.querySelector("#rest").onclick=()=>startTimer(ex.rest);
 ["#exerciseRir","#exerciseForm","#exerciseEngagement","#exerciseDiscomfort"].forEach(selector=>{const input=document.querySelector(selector);if(input)input.onchange=()=>captureExerciseFeedback(ex);});
 const stop=document.querySelector("#stopTimer");if(stop)stop.onclick=stopTimer
}
function bindTimer(ex){
 const b=document.querySelector("#rest"),stop=document.querySelector("#stopTimer"),keep=document.querySelector("#keepGoing"),runtime=state.cardioTimers[ex.name];
 if(b)b.onclick=()=>{let [m,s]=ex.duration.split(":").map(Number);isMeaningfulCardioBlock(ex)?startCardioTarget(ex,m*60+s):startTimer(m*60+s)};
 if(stop)stop.onclick=()=>stopTimer(ex);
 if(keep)keep.onclick=()=>continueCardio(ex);
 if(isMeaningfulCardioBlock(ex)&&runtime){activeTimerExercise=ex.name;if(runtime.status==="target"&&runtime.targetEndsAt){timerEndsAt=runtime.targetEndsAt;syncTimer();if(timerEndsAt!==null)timerId=setInterval(syncTimer,1000);}else if(runtime.status==="targetComplete")showCardioTargetComplete(ex);else if(runtime.status==="extended"){syncCardioExtension(ex);timerId=setInterval(()=>syncCardioExtension(ex),1000);}else if(runtime.status==="stopped")showCardioStopped(runtime);}
}
function clockText(seconds){const total=Math.max(0,Math.floor(Number(seconds)||0)),hours=Math.floor(total/3600),minutes=Math.floor(total%3600/60),secs=total%60;return `${hours?`${String(hours).padStart(2,"0")}:`:""}${String(minutes).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;}
function currentCardioSeconds(runtime,now=Date.now()){if(!runtime)return 0;if(runtime.status==="target")return Math.min(runtime.targetSeconds,Math.max(0,Math.floor((now-runtime.targetStartedAt)/1000)));if(runtime.status==="extended")return runtime.targetSeconds+Math.max(0,Math.floor((now-runtime.extensionStartedAt)/1000));return Number(runtime.actualSeconds)||0;}
function updateCardioTotal(runtime){const el=document.querySelector("#cardioTotal");if(el)el.textContent=`Total cardio: ${clockText(currentCardioSeconds(runtime))}`;}
function startCardioTarget(ex,seconds){clearInterval(timerId);const now=Date.now();state.cardioTimers[ex.name]={name:ex.name,targetSeconds:seconds,targetStartedAt:now,targetEndsAt:now+seconds*1000,status:"target",actualSeconds:0};activeTimerExercise=ex.name;save();startTimer(seconds,ex.name);updateCardioTotal(state.cardioTimers[ex.name]);}
function showCardioTargetComplete(ex){const runtime=state.cardioTimers[ex.name];const el=document.querySelector("#timer");if(el)el.textContent="Target complete";updateCardioTotal(runtime);const keep=document.querySelector("#keepGoing");if(keep)keep.hidden=false;const start=document.querySelector("#rest");if(start)start.hidden=true;}
function continueCardio(ex){const runtime=state.cardioTimers[ex.name];if(!runtime)return;runtime.status="extended";runtime.extensionStartedAt=Date.now();runtime.actualSeconds=runtime.targetSeconds;save();const keep=document.querySelector("#keepGoing");if(keep)keep.hidden=true;const el=document.querySelector("#timer");if(el)el.textContent="Keep going";clearInterval(timerId);syncCardioExtension(ex);timerId=setInterval(()=>syncCardioExtension(ex),1000);}
function syncCardioExtension(ex){const runtime=state.cardioTimers[ex.name];if(!runtime||runtime.status!=="extended")return;runtime.actualSeconds=currentCardioSeconds(runtime);updateCardioTotal(runtime);const el=document.querySelector("#timer");if(el)el.textContent=`Total ${clockText(runtime.actualSeconds)}`;}
function showCardioStopped(runtime){const seconds=currentCardioSeconds(runtime),el=document.querySelector("#timer");if(el)el.textContent=`Logged ${clockText(seconds)}`;updateCardioTotal(runtime);const keep=document.querySelector("#keepGoing");if(keep)keep.hidden=true;}
function finalizeCardio(ex){const runtime=ex&&state.cardioTimers[ex.name];if(!runtime)return;runtime.actualSeconds=currentCardioSeconds(runtime);runtime.status="stopped";runtime.stoppedAt=Date.now();save();}
function stopTimer(ex=null){if(ex&&isMeaningfulCardioBlock(ex)){finalizeCardio(ex);showCardioStopped(state.cardioTimers[ex.name]);}clearInterval(timerId);timerId=null;timerEndsAt=null;remaining=0;activeTimerExercise=null;}
function prepareTimerAudio(){
 const AudioContextClass=window.AudioContext||window.webkitAudioContext;
 if(!AudioContextClass)return null;
 timerAudioContext=timerAudioContext||new AudioContextClass();
 if(timerAudioContext.state==="suspended"){
   const resumeResult=timerAudioContext.resume();
   resumeResult?.catch?.(()=>{});
 }
 return timerAudioContext;
}
function playTimerCompleteSound(){
 const context=prepareTimerAudio();
 if(!context)return;
 const now=context.currentTime;
 [0,0.18].forEach((offset,index)=>{
   const oscillator=context.createOscillator();
   const gain=context.createGain();
   oscillator.type="sine";
   oscillator.frequency.setValueAtTime(index?880:660,now+offset);
   gain.gain.setValueAtTime(0.0001,now+offset);
   gain.gain.exponentialRampToValueAtTime(0.22,now+offset+0.02);
   gain.gain.exponentialRampToValueAtTime(0.0001,now+offset+0.16);
   oscillator.connect(gain).connect(context.destination);
   oscillator.start(now+offset);
   oscillator.stop(now+offset+0.17);
 });
}
function timerRemainingSeconds(endsAt,now=Date.now()){
 return Math.max(0,Math.ceil((endsAt-now)/1000));
}
function completeTimer(){
 if(timerEndsAt===null)return;
 clearInterval(timerId);timerId=null;timerEndsAt=null;remaining=0;
 playTimerCompleteSound();navigator.vibrate?.([200,100,200]);
 if(activeTimerExercise&&state.cardioTimers[activeTimerExercise]?.status==="target"){
   const runtime=state.cardioTimers[activeTimerExercise];runtime.status="targetComplete";runtime.actualSeconds=runtime.targetSeconds;save();const ex=activeWorkout().find(item=>item.name===activeTimerExercise);if(ex)showCardioTargetComplete(ex);return;
 }
 const el=document.querySelector("#timer");if(el)el.textContent="Timer complete";
 const c=document.querySelector("#restCoach");if(c)c.textContent="Rest complete. Begin when ready.";
}
function syncTimer(){
 if(timerEndsAt===null)return;
 remaining=timerRemainingSeconds(timerEndsAt);
 if(remaining<=0){completeTimer();return;}
 const el=document.querySelector("#timer");
 if(el)el.textContent=`${String(Math.floor(remaining/60)).padStart(2,"0")}:${String(remaining%60).padStart(2,"0")}`;
 const c=document.querySelector("#restCoach");if(c)c.textContent=restCoachText(remaining);
}
function startTimer(sec,cardioName=null){
 activeTimerExercise=cardioName;
 remaining=Math.max(0,Number(sec)||0);timerEndsAt=Date.now()+(remaining*1000);
 prepareTimerAudio();clearInterval(timerId);syncTimer();
 if(timerEndsAt!==null)timerId=setInterval(syncTimer,1000);
}
function syncActiveTimer(){syncTimer();if(activeTimerExercise){const ex=activeWorkout().find(item=>item.name===activeTimerExercise);if(ex&&state.cardioTimers[activeTimerExercise]?.status==="extended")syncCardioExtension(ex);}}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")syncActiveTimer()});
window.addEventListener("pageshow",syncActiveTimer);
window.addEventListener("focus",syncActiveTimer);
function next(){
 const current=activeWorkout()[state.step-1];if(current&&isMeaningfulCardioBlock(current)){finalizeCardio(current);clearInterval(timerId);timerId=null;timerEndsAt=null;remaining=0;activeTimerExercise=null;}
 if(current){const id=window.ROAD12_EXERCISES.resolve(current.name).id,timing=state.exerciseTimings[id];if(timing&&!timing.endedAt)timing.endedAt=new Date().toISOString();}
 window.ROAD12_WORKOUT_NAVIGATION.advanceExercise(
   state
 );
 save();
 workout();
 window.ROAD12_WORKOUT_NAVIGATION.scrollToNextExercise(
   options=>window.scrollTo(options)
 );
}
function formatHistoryDateKey(key,fallback="Not recorded"){
  if(!key)return fallback;
  return parseDateKey(key).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
}

function showLibraryExercise(ex){
 app.innerHTML=`<section class="card workout-card professional-exercise-detail"><button class="secondary" id="libraryBack">Back to Library</button><span class="pill">EXERCISE GUIDE</span><h2>${ex.name}</h2><p class="muted workout-subtitle">${ex.muscles}</p><div class="why-card"><h3>Why this exercise?</h3><p>${ex.why||"Builds strength and movement control."}</p></div>${attachmentPhotoMarkup(ex)}${ex.m1?m1SetupCoach(ex):""}${exerciseTeachingMarkup(ex)}</section>`;
 document.querySelector("#libraryBack").onclick=library;
 document.querySelector("#openAsset")?.addEventListener("click",()=>openExerciseAsset(ex));
}
function imageLicenses(){
 const sourceRows=[];
 Object.entries(LICENSED_EXERCISE_LIBRARY.entries||{}).forEach(([usedFor,entry])=>{
   if(entry.sourceType!=="app-original")sourceRows.push([usedFor,entry]);
   if(entry.reference?.sourceType&&entry.reference.sourceType!=="app-original")sourceRows.push([usedFor,entry.reference]);
 });
 const namedEntries=[...new Map(sourceRows.map(row=>[row[1].media,row])).values()];
 app.innerHTML=`<section class="card"><button class="secondary" id="licensesBack">Back to Equipment</button><span class="pill">ABOUT</span><h2>Image Sources & Licenses</h2><p>Road to 12% movement animations and still storyboards are the primary in-app demonstrations. The sources below are retained setup or form references used to review equipment geometry and coaching accuracy.</p></section>
 <section class="license-list">${namedEntries.map(([usedFor,entry])=>`<article class="card license-entry"><img src="${entry.media}" alt="${entry.mediaAlt}"><div><h3>${entry.sourceExercise}</h3><p><strong>Used for:</strong> ${usedFor}</p><p><strong>Source:</strong> ${entry.sourceType==="official-manual"?entry.sourceDocument:entry.provider}</p><p><strong>Author:</strong> ${entry.author}</p>${entry.sourceType==="official-manual"?`<p><strong>Use:</strong> ${entry.rightsNote}</p><p><a href="${entry.providerUrl}" target="_blank" rel="noopener">RitFit website</a></p>`:`<p><strong>License:</strong> <a href="${entry.license.url}" target="_blank" rel="noopener">${entry.license.fullName}</a></p><p><a href="${entry.sourceUrl}" target="_blank" rel="noopener">wger record</a>${entry.originalSourceUrl?` · <a href="${entry.originalSourceUrl}" target="_blank" rel="noopener">original source</a>`:""}</p>`}</div></article>`).join("")}</section>`;
 document.querySelector("#licensesBack").onclick=equipment;
}
function escapeAdaptiveText(value){
 return String(value||"").replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[character]);
}
function currentAdaptiveRecommendation(){
 return window.ROAD12_ADAPTIVE.phaseReadiness({history:state.history.map(window.ROAD12_STRAVA_DATA.stripSession),ratings:state.workoutRatings,sessions:state.workoutSessions,today:localDateKey(),adherenceBaselineDate:state.adherenceBaselineDate,measurements:state.bodyMeasurements,cardio:state.cardioHistory});
}
function phaseReadinessMarkup(readiness,compact=false){
 const quality=readiness.dataQualityItems||[];
 return `<section class="card phase-readiness-card ${compact?"compact":""}" aria-labelledby="phaseReadinessTitle"><div class="phase-readiness-heading"><div><span class="pill">FOUNDATION • PHASE 1</span><h2 id="phaseReadinessTitle">${readiness.score}% ready for Build</h2></div><strong>${readiness.locked?"Collecting data":"Review available"}</strong></div><div class="phase-readiness-track" role="progressbar" aria-label="Foundation phase readiness" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${readiness.score}"><span style="width:${readiness.score}%"></span></div><p>You're progressing toward the next training phase. Foundation A/B/C stays active while Road to 12% gathers enough quality evidence.</p>${compact?"":`<div class="readiness-quality"><div><small>READINESS DATA QUALITY</small><strong>${readiness.dataQuality}% • ${readiness.dataQualityLabel}</strong></div><div class="data-quality-grid">${quality.map(item=>`<div class="${item.ready?"ready":"collecting"}"><span>${item.ready?"✓":"…"}</span><p><strong>${item.label}</strong><small>${item.value}</small></p></div>`).join("")}</div></div><div class="readiness-reasons">${readiness.reasons.map(reason=>`<div class="${reason.status}"><span aria-hidden="true">${reason.status==="positive"?"✓":reason.status==="hold"?"!":"…"}</span><p><strong>${reason.label}</strong><small>${reason.detail}</small></p></div>`).join("")}</div><div class="phase-lock-note"><strong>Phase advancement is locked.</strong><span>No workout schedule will change until the readiness policy is mature and you explicitly accept a reviewed Phase 2 plan.</span></div>`}</section>`;
}
function exerciseProgressionRecommendations(){
 const definitions=[0,2,4].flatMap(day=>strengthWorkoutForDay(day)).filter(ex=>ex.type==="strength");
 const coachingHistory=state.history.map(window.ROAD12_STRAVA_DATA.stripSession);
 return [...new Map(definitions.map(ex=>[ex.name,ex])).values()].map(ex=>({exercise:ex,recommendation:window.ROAD12_ADAPTIVE.exerciseRecommendation(coachingHistory,state.workoutRatings,ex)}));
}
function approvedProgressionFor(exercise){
 return window.ROAD12_PRESCRIPTIONS.findApproval(state.approvedProgressions,exercise,name=>window.ROAD12_EXERCISES.resolve(name));
}
function stravaProfileMarkup(message="Checking secure connection…",status="checking"){
 const configured=!!window.ROAD12_STRAVA_CLIENT?.configured();
 return `<section class="card strava-connection-card" id="stravaConnectionCard" aria-labelledby="stravaConnectionTitle">
   <span class="pill">STRAVA • MANUAL ONLY</span><h2 id="stravaConnectionTitle">Strength Training connection</h2>
   <p class="strava-connection-status ${status}" role="status">${escapeAdaptiveText(configured?message:"Not configured on this build")}</p>
   <p class="muted">Road to 12% requests permission only to upload strength activities you explicitly approve. Automatic sync, activity reading, and cardio posting are off.</p>
   <button class="text-action" id="stravaPrivacy" type="button">Strava &amp; Privacy</button>
   <div class="strava-connection-actions"></div>
 </section>`;
}
function stravaPrivacyMarkup(){
 return `<span class="pill">STRAVA &amp; PRIVACY</span><h2>What connecting means</h2>
   <p>Road to 12% requests <strong>activity:write</strong> permission so you can manually upload a reviewed Full Body A/B/C strength workout.</p>
   <h3>Information stored while connected</h3><ul><li>Your Strava account identifier and name for connection status.</li><li>Encrypted authorization credentials on the secure Worker, never in the PWA backup.</li><li>Upload and activity identifiers needed to finish and display an approved post.</li></ul>
   <h3>Disconnect and deletion</h3><p>Disconnect Strava revokes authorization and deletes stored Strava-derived credentials, identity, upload, activity, status, timestamp, and error metadata. Your Road to 12% workouts, sets, reps, weights, and progress remain local and are not deleted.</p>
   <p>Disconnect is the self-service deletion method. For help, use the <a href="https://github.com/harrison0550/road-to-12/issues/new?title=Road%20to%2012%25%20support" target="_blank" rel="noopener">Road to 12% support page</a>; do not include private health or credential information in a public issue.</p>
   <p class="muted">Strava may monitor or collect API usage information as described in its <a href="https://www.strava.com/legal/api_policy" target="_blank" rel="noopener">API Policy</a> and <a href="https://www.strava.com/legal/privacy" target="_blank" rel="noopener">Privacy Policy</a>. Road to 12% is not made, sponsored, or endorsed by Strava.</p>`;
}
function openStravaPrivacy(){
 const dialog=v42Dialog(`${stravaPrivacyMarkup()}<button class="secondary" id="closeStravaPrivacy" type="button">Close</button>`,`Strava and privacy`,{showClose:false});
 dialog.querySelector("#closeStravaPrivacy").onclick=closeV42Dialog;
}
function beginStravaConnect(statusNode,button){
 const dialog=v42Dialog(`${stravaPrivacyMarkup()}<label class="adaptive-check"><input id="stravaConsent" type="checkbox"><span>I understand what is stored and how Disconnect Strava deletes it.</span></label><button class="primary" id="continueStrava" type="button" disabled>Continue to Strava</button><button class="secondary" id="cancelStrava" type="button">Cancel</button>`,`Connect Strava`,{showClose:false});
 const consent=dialog.querySelector("#stravaConsent"),continueButton=dialog.querySelector("#continueStrava");
 consent.onchange=()=>{continueButton.disabled=!consent.checked;};
 dialog.querySelector("#cancelStrava").onclick=()=>{closeV42Dialog();button.disabled=false;};
 continueButton.onclick=async()=>{continueButton.disabled=true;try{const connection=await window.ROAD12_STRAVA_CLIENT.connect();location.assign(connection.authorizeUrl);}catch(error){closeV42Dialog();statusNode.textContent=error.message;button.disabled=false;}};
}
function applyConfirmedStravaDeletion(result){
 if(!result?.deleted||!result?.deletionConfirmed||!result?.deletedAt)throw new Error("The Worker did not confirm Strava data deletion.");
 const cleaned=window.ROAD12_STRAVA_DATA.clearAfterConfirmedDisconnect(state,result.deletedAt);
 if(!road12Storage.write(cleaned))throw new Error("Strava data was deleted from the Worker, but this device could not save the local cleanup. Free storage and retry before creating a backup.");
 Object.keys(state).forEach(key=>delete state[key]);
 Object.assign(state,cleaned);
}
async function refreshStravaProfileCard(){
 const card=document.querySelector("#stravaConnectionCard");
 if(!card)return;
 const statusNode=card.querySelector(".strava-connection-status"),actions=card.querySelector(".strava-connection-actions");
 const client=window.ROAD12_STRAVA_CLIENT;
 if(!client?.configured()){
   statusNode.textContent="Not configured on this build";
   actions.innerHTML='<button class="secondary" type="button" disabled>Connect Strava unavailable</button>';
   return;
 }
 if(!navigator.onLine){
   statusNode.textContent="Connection unavailable while offline";
   actions.innerHTML='<button class="secondary" type="button" disabled>Connect Strava unavailable offline</button>';
   return;
 }
 try{
   const result=await client.status();
   if(!document.querySelector("#stravaConnectionCard"))return;
   statusNode.textContent=result.connected?`Connected to Strava${result.athleteName?` as ${result.athleteName}`:""}`:(stravaConnectionNotice||(result.requiresReauth?"Reconnect Strava":"Not Connected"));
   statusNode.className=`strava-connection-status ${result.connected?"connected":"not-connected"}`;
   actions.innerHTML=result.connected?'<button class="secondary" id="disconnectStrava" type="button">Disconnect Strava</button>':'<button class="primary" id="connectStrava" type="button">Connect Strava</button>';
   document.querySelector("#connectStrava")?.addEventListener("click",async event=>{
     event.currentTarget.disabled=true;
     beginStravaConnect(statusNode,event.currentTarget);
   });
   document.querySelector("#disconnectStrava")?.addEventListener("click",async event=>{
     if(!confirm("Disconnect Strava and permanently delete stored Strava authorization, identity, upload, and activity metadata? Your Road to 12% workout history will remain."))return;
     event.currentTarget.disabled=true;
     try{
       const result=await client.disconnect();
       applyConfirmedStravaDeletion(result);
       stravaConnectionNotice="Strava disconnected. Strava authorization and stored Strava data have been deleted. Your Road to 12% workout history was not affected.";
       await refreshStravaProfileCard();
     }catch(error){statusNode.textContent=`Deletion was not confirmed. ${error.message||"Try again."}`;event.currentTarget.disabled=false;}
   });
 }catch(error){
   statusNode.textContent=error.message||"Strava connection status is unavailable.";
   actions.innerHTML='<button class="secondary" type="button" id="retryStravaStatus">Try again</button>';
   document.querySelector("#retryStravaStatus")?.addEventListener("click",refreshStravaProfileCard);
 }
}
function equipment(){
 const profile=state.trainingProfile;
 const items=[
  ["ritfitM1","🏋️","RitFit M1 Pro","Required for cable and Smith-machine exercises."],
  ["bench","🪑","Adjustable bench","Used for seated rows, pulldowns and supported movements."],
  ["treadmill","🏃","iFIT treadmill","Used for warm-ups, cooldowns and cardio."],
  ["rower","🚣","iFIT rower","Available for technique and cardio sessions."],
  ["kickrCore","🚴","Wahoo KICKR CORE","Available for cycling sessions."],
 ["bumperPlates","⚫","Olympic bumper plates","Available in weights from 10–45 lb for Smith-machine loading."],
  ["gmwdConvergingChestPress","🏋️","GMWD converging chest press","Plate-loaded independent arms provide the Full Body B chest press."],
 ["dumbbells","🔩","Dumbbells","Available fixed pairs: 10, 15, 20 and 25 lb."],
  ["kettlebells","⚫","Kettlebell — 30 lb","Owned fixed-weight bell for swings, carries and controlled core work."],
  ["olympicBarbell","🏋️‍♂️","Free Olympic barbell","This refers to free-barbell work, not the M1 Smith bar."]
 ];
 const attachments=[
  ["dHandles","Two D-handles","Used for chest press and shoulder press."],
  ["straightBar","Short straight curl bar","Used for the corrected cable curl."],
  ["rope","Triceps rope","Used for rope pushdowns."],
  ["latBar","Lat pulldown bar","Used for lat pulldowns."],
  ["rowHandle","Rotating close-grip double-D row handle","Used for seated cable rows."],
  ["vBar","Angled V-bar pressdown attachment","Used for V-bar triceps pushdowns."],
  ["smithBarPad","Smith barbell pad","Used to cushion the Smith bar during hip thrusts."]
 ];
 app.innerHTML=`<section class="card"><h2>Profile</h2><label>What should the app call you?<input id="preferredName" value="${state.preferredName}" autocomplete="given-name"></label><button class="secondary profile-save" id="saveProfile">Save name</button></section>
 ${stravaProfileMarkup()}
 <section class="card adaptive-profile-card" aria-labelledby="trainingProfileTitle"><span class="pill">TRAINING PROFILE</span><h2 id="trainingProfileTitle">Foundation context</h2><p class="muted">These details provide context for future progression. They remain on this device and never change the current phase automatically.</p>
   <div class="adaptive-profile-grid">
     <label>Age<input id="profileAge" type="number" inputmode="numeric" min="18" max="100" value="${profile.age||""}"></label>
     <label>Height (inches)<input id="profileHeight" type="number" inputmode="decimal" min="48" max="84" value="${profile.heightIn||""}"></label>
     <label>Target weight (lb)<input id="profileTargetWeight" type="number" inputmode="decimal" min="90" max="500" value="${profile.targetWeight||""}"></label>
     <label>Typical session<select id="profileSessionMinutes">${[30,45,60,75,90].map(value=>`<option value="${value}" ${profile.sessionMinutes===value?"selected":""}>${value} minutes</option>`).join("")}</select></label>
     <label>Primary goal<select id="profileGoal"><option value="fatLoss" ${profile.goal==="fatLoss"?"selected":""}>Fat loss while preserving muscle</option><option value="recomposition" ${profile.goal==="recomposition"?"selected":""}>Body recomposition</option><option value="strength" ${profile.goal==="strength"?"selected":""}>Strength</option><option value="general" ${profile.goal==="general"?"selected":""}>General fitness</option></select></label>
     <label>Training experience<select id="profileExperience"><option value="beginner" ${profile.experience==="beginner"?"selected":""}>Beginner</option><option value="intermediate" ${profile.experience==="intermediate"?"selected":""}>Intermediate</option><option value="advanced" ${profile.experience==="advanced"?"selected":""}>Advanced</option></select></label>
     <label>Available training days<select id="profileTrainingDays">${[2,3,4,5,6,7].map(value=>`<option value="${value}" ${profile.trainingDays===value?"selected":""}>${value} days per week</option>`).join("")}</select></label>
   </div>
   <label>Injuries, limitations, or movements to avoid<textarea id="profileLimitations" maxlength="500" placeholder="Leave blank if none">${escapeAdaptiveText(profile.limitations)}</textarea></label>
   <label class="adaptive-check"><input id="profileHealthClearance" type="checkbox" ${profile.healthClearance?"checked":""}><span>I have a health concern that should keep progression conservative.</span></label>
   <p class="adaptive-safety-note">This coaching system is not medical advice. Stop for chest pain, faintness, or sharp pain and seek appropriate professional guidance.</p>
   <button class="primary" id="saveTrainingProfile">Save training profile</button>
 </section>
 <section class="card"><h2>My Equipment</h2><p class="muted">Workouts use only equipment switched on.</p><div class="equipment-toggle-list">${items.map(([key,icon,title,note])=>`<label class="equipment-toggle"><span class="equipment-symbol">${icon}</span><span class="equipment-copy"><strong>${title}</strong><small>${note}</small></span><input type="checkbox" data-equipment="${key}" ${state.equipment[key]?"checked":""}><span class="toggle-ui"></span></label>`).join("")}</div></section>
 <section class="card"><h2>Attachment Locker</h2><p class="muted">Add a close-up photo of each attachment from your actual gym. The correct photo will appear during every exercise with a bright “USE THIS ONE” label.</p><div class="attachment-locker">${attachments.map(([key,title,note])=>`<div class="locker-item">${state.attachmentPhotos[key]?`<img src="${state.attachmentPhotos[key]}" alt="${title}">`:`<div class="locker-placeholder">📷</div>`}<div class="locker-copy"><strong>${title}</strong><small>${note}</small><label class="photo-button">Choose photo<input type="file" accept="image/*" data-photo="${key}"></label>${state.attachmentPhotos[key]?`<button class="clear-photo" data-clear-photo="${key}">Remove</button>`:""}</div></div>`).join("")}</div></section>
 <section class="card equipment-impact"><h3>Current workout impact</h3><div class="impact-row"><span>Available exercises</span><strong>${activeWorkout().length}</strong></div><div class="impact-row"><span>Automatic substitutions</span><strong>${substitutionCount()}</strong></div><div class="impact-row"><span>Bumper-plate exercises</span><strong>${state.equipment.bumperPlates?"Enabled":"Disabled"}</strong></div><button class="primary" id="equipmentWorkout">Start equipment-safe workout</button></section>
 <section class="card about-card"><span class="pill">ABOUT</span><h2>Road to 12%</h2><div class="about-grid"><div><small>VERSION</small><strong>${APP_META.version}</strong></div><div><small>BUILD</small><strong>${APP_META.build}</strong></div><div><small>LAST UPDATED</small><strong>${APP_META.lastUpdated}</strong></div><div><small>GIT COMMIT</small><strong>${APP_META.gitCommit||"Not embedded"}</strong></div><div><small>SERVICE WORKER</small><strong>${APP_META.serviceWorkerCache}</strong></div></div><button class="secondary about-license-button" id="imageLicenses">Image Sources & Licenses</button></section>`;
 document.querySelector("#saveProfile").onclick=()=>{state.preferredName=document.querySelector("#preferredName").value.trim()||"Andy";save();equipment()};
 document.querySelector("#saveTrainingProfile").onclick=()=>{
   state.trainingProfile=window.ROAD12_ADAPTIVE.normalizeProfile({age:document.querySelector("#profileAge").value,heightIn:document.querySelector("#profileHeight").value,targetWeight:document.querySelector("#profileTargetWeight").value,goal:document.querySelector("#profileGoal").value,experience:document.querySelector("#profileExperience").value,trainingDays:document.querySelector("#profileTrainingDays").value,sessionMinutes:document.querySelector("#profileSessionMinutes").value,limitations:document.querySelector("#profileLimitations").value,healthClearance:document.querySelector("#profileHealthClearance").checked});
   save();equipment();
 };
 document.querySelectorAll("[data-equipment]").forEach(input=>input.onchange=()=>{state.equipment[input.dataset.equipment]=input.checked;state.step=0;save();equipment()});
 document.querySelectorAll("[data-photo]").forEach(input=>input.onchange=e=>saveAttachmentPhoto(input.dataset.photo,e.target.files?.[0]));
 document.querySelectorAll("[data-clear-photo]").forEach(btn=>btn.onclick=()=>{delete state.attachmentPhotos[btn.dataset.clearPhoto];save();equipment()});
 document.querySelector("#equipmentWorkout").onclick=()=>{startNewSession();setTab("workout")};
 document.querySelector("#imageLicenses").onclick=imageLicenses;
 document.querySelector("#stravaPrivacy").onclick=openStravaPrivacy;
 refreshStravaProfileCard();
}
function saveAttachmentPhoto(key,file){
 if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{
   const img=new Image();
   img.onload=()=>{
     const max=900,scale=Math.min(1,max/Math.max(img.width,img.height));
     const canvas=document.createElement("canvas");
     canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
     canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
     state.attachmentPhotos[key]=canvas.toDataURL("image/jpeg",.76);
     try{save();equipment()}catch(err){alert("That photo is too large to store. Try a closer photo or screenshot.");}
   };
   img.src=reader.result;
 };
 reader.readAsDataURL(file);
}
function stravaPreviewSetText(set){
 const work=set.repetitions!==null?`${set.repetitions} rep${set.repetitions===1?"":"s"}`:`${set.durationSeconds} sec`;
 return set.externalLoadLb===null?work:`${work} @ ${set.externalLoadLb} lb`;
}
function openStravaPreview(session){
 const preview=window.ROAD12_STRAVA_PAYLOAD.buildStravaStrengthPayload(stravaPayloadSession(session));
 const transportPreview={name:preview.name,sport_type:preview.sportType,external_id:preview.externalId,data_type:preview.dataType,file:preview.file};
 const exerciseRows=preview.exercises.filter(exercise=>exercise.sets.length).map(exercise=>`<article class="strava-preview-exercise">
   <div><h3>${escapeAdaptiveText(exercise.displayName)}</h3><span class="${exercise.mappingStatus}">${exercise.mappingStatus==="mapped"?escapeAdaptiveText(exercise.stravaExerciseType):"Unmapped — will require fallback"}</span></div>
   <ol>${exercise.sets.map(set=>`<li>${escapeAdaptiveText(stravaPreviewSetText(set))}</li>`).join("")}</ol>
 </article>`).join("")||'<p class="muted">No complete working-set details are available.</p>';
 const warningRows=preview.warnings.length?`<section class="strava-preview-warnings" aria-labelledby="stravaWarningsTitle"><h3 id="stravaWarningsTitle">Warnings</h3><ul>${preview.warnings.map(item=>`<li><strong>${escapeAdaptiveText(item.code.replaceAll("_"," "))}</strong><span>${escapeAdaptiveText(item.exerciseName?`${item.exerciseName}: ${item.detail}`:item.detail)}</span></li>`).join("")}</ul></section>`:"";
 v42Dialog(`<div class="strava-preview">
   <span class="pill">LOCAL PREVIEW</span>
   <h2>${escapeAdaptiveText(preview.name)}</h2>
   <p class="strava-preview-eligibility"><strong>Eligible:</strong> ${preview.eligible?"Yes":"No"} • <strong>Payload ready:</strong> ${preview.ready?"Yes":"No"}</p>
   <div class="brief-grid"><div><small>SETS</small><strong>${preview.summary.completedSets}</strong></div><div><small>REPS</small><strong>${preview.summary.totalReps}</strong></div><div><small>SELECTED VOLUME</small><strong>${Math.round(preview.summary.selectedVolumeLb).toLocaleString()} lb</strong></div><div><small>ELAPSED</small><strong>${preview.summary.elapsedDurationSeconds?formatDuration(preview.summary.elapsedDurationSeconds*1000):"Unavailable"}</strong></div></div>
   <div class="strava-preview-counts"><span>Structured exercises mapped: <strong>${preview.summary.mappedExercises}</strong></span><span>Unmapped exercises: <strong>${preview.summary.unmappedExercises}</strong></span><span>Completed working sets: <strong>${preview.summary.completedSets}</strong></span></div>
   <section class="strava-preview-exercises" aria-label="Structured exercise preview">${exerciseRows}</section>
   ${warningRows}
   <details class="strava-payload-details"><summary>Structured payload</summary><pre>${escapeAdaptiveText(JSON.stringify(transportPreview,null,2))}</pre></details>
   <p class="strava-preview-only"><strong>Preview only — nothing has been sent to Strava.</strong></p>
 </div>`,`Strava post preview`);
}
function stravaSessionSync(session){
 return session.externalSync?.strava||{status:"NOT_SYNCED",externalId:`road12-${session.id}`,uploadId:null,activityId:null,uploadedAt:null,lastAttemptAt:null,lastError:null};
}
function stravaPayloadSession(session){
 const copy=JSON.parse(JSON.stringify(session));
 copy.externalSync=copy.externalSync||{};
 copy.externalSync.strava=copy.externalSync.strava||stravaSessionSync(session);
 return copy;
}
function firstStravaPilotCandidateId(){return window.ROAD12_STRAVA_DATA.manualPilotCandidate(state,window.ROAD12_STRAVA_PAYLOAD.isSessionStravaEligible);}
function stravaHistoricalPostBlocked(session){
 const id=String(session.id||""),blocked=(state.stravaDeletion?.blockedSessionIds||[]).includes(id);
 if(!blocked)return false;
 const approval=state.stravaPilotApproval;
 if(approval?.sessionId!==id)return true;
 if(session.externalSync?.strava?.status==="SYNCED"&&session.externalSync.strava.activityId)return false;
 return !(firstStravaPilotCandidateId()===id&&!approval.consumedAt);
}
function consumeStravaPilotApproval(session,record){
 if(record?.status!=="SYNCED"||state.stravaPilotApproval?.sessionId!==String(session.id||"")||state.stravaPilotApproval.consumedAt)return;
 state.stravaPilotApproval.consumedAt=new Date().toISOString();
 state.stravaDeletion=window.ROAD12_STRAVA_DATA.normalizeMarker(state.stravaDeletion);
 state.stravaDeletion.pilotConsumedSessionIds=[...new Set([...(state.stravaDeletion.pilotConsumedSessionIds||[]),String(session.id)])];
}
function saveStravaBackendState(session,result){
 session.externalSync=session.externalSync||{};
 session.externalSync.strava=window.ROAD12_STRAVA_SYNC.reconcile(stravaSessionSync(session),result);
 consumeStravaPilotApproval(session,session.externalSync.strava);
 save();
 return session.externalSync.strava;
}
function stravaActivityUrl(activityId){return `https://www.strava.com/activities/${encodeURIComponent(activityId)}`;}
function stravaSessionStatusMarkup(record,connected){
 if(record.status==="SYNCED"&&record.activityId)return `<div class="strava-sync-result synced"><strong>Posted to Strava</strong><a href="${stravaActivityUrl(record.activityId)}" target="_blank" rel="noopener">View on Strava</a><button class="secondary" id="verifyStravaDuplicate" type="button">Verify duplicate protection</button></div>`;
 if(record.status==="SYNCING"||record.status==="QUEUED")return '<div class="strava-sync-result processing" role="status"><strong>Processing on Strava…</strong><span>The activity ID will appear after Strava finishes.</span></div>';
 if(record.status==="FAILED")return `<div class="strava-sync-result failed" role="alert"><strong>Strava upload failed</strong><span>${escapeAdaptiveText(record.lastError||"The activity could not be processed.")}</span>${connected?'<button class="secondary" id="retryStravaPost" type="button">Try Again</button>':""}</div>`;
 if(connected&&navigator.onLine)return '<button class="primary" id="postToStrava" type="button">Post to Strava</button>';
 if(!navigator.onLine)return '<button class="secondary" type="button" disabled>Post unavailable while offline</button>';
 return '<p class="muted">Connect Strava in Profile to post this workout.</p>';
}
async function reconcileStravaSession(session){
 const record=stravaSessionSync(session);
 if(!window.ROAD12_STRAVA_CLIENT?.configured()||!navigator.onLine||!record.externalId)return record;
 if(record.status==="SYNCED"&&record.activityId)return record;
 try{return saveStravaBackendState(session,await window.ROAD12_STRAVA_CLIENT.uploadStatus(record.externalId));}
 catch(error){
   if(error.status===404)return record;
   if(error.result?.state)return saveStravaBackendState(session,error.result);
   return record;
 }
}
async function pollStravaUpload(session,remainingPolls=40){
 if(remainingPolls<=0||!navigator.onLine)return;
 try{
   const result=await window.ROAD12_STRAVA_CLIENT.uploadStatus(stravaSessionSync(session).externalId);
   const record=saveStravaBackendState(session,result);
   if(state.historyView===session.id)await renderStravaSessionActions(session,false);
   if(record.status==="SYNCING")setTimeout(()=>pollStravaUpload(session,remainingPolls-1),1500);
 }catch(error){
   if(error.result?.state){saveStravaBackendState(session,error.result);if(state.historyView===session.id)await renderStravaSessionActions(session,false);}
 }
}
function confirmStravaUpload(session){
 const preview=window.ROAD12_STRAVA_PAYLOAD.buildStravaStrengthPayload(stravaPayloadSession(session));
 const dialog=v42Dialog(`<span class="pill">REAL STRAVA ACTIVITY</span><h2>Post ${escapeAdaptiveText(preview.name)}?</h2>
   <p><strong>This will create a real activity on Strava.</strong></p>
   <div class="strava-preview-counts"><span>Exercises mapped <strong>${preview.summary.mappedExercises}</strong></span><span>Completed sets <strong>${preview.summary.completedSets}</strong></span><span>Warnings <strong>${preview.warnings.length}</strong></span></div>
   ${preview.warnings.length?`<div class="strava-preview-warnings"><strong>Review warnings</strong><ul>${preview.warnings.map(item=>`<li>${escapeAdaptiveText(item.code.replaceAll("_"," "))}</li>`).join("")}</ul></div>`:""}
   <button class="primary" id="confirmPostToStrava" type="button" ${preview.ready?"":"disabled"}>Post to Strava</button><button class="secondary" id="cancelPostToStrava" type="button">Cancel</button>`,`Post workout to Strava`,{showClose:false});
 dialog.querySelector("#cancelPostToStrava").onclick=closeV42Dialog;
 dialog.querySelector("#confirmPostToStrava")?.addEventListener("click",async event=>{
   event.currentTarget.disabled=true;
   closeV42Dialog();
   const current=stravaSessionSync(session);
   session.externalSync=session.externalSync||{};
   session.externalSync.strava=window.ROAD12_STRAVA_SYNC.transition(current,"QUEUED",{lastAttemptAt:new Date().toISOString(),lastError:null});
   save();await renderStravaSessionActions(session,false);
   try{
     const result=await window.ROAD12_STRAVA_CLIENT.upload({name:preview.name,sportType:preview.sportType,externalId:preview.externalId,dataType:preview.dataType,file:preview.file});
     let queued=stravaSessionSync(session);
     if(queued.status==="QUEUED")queued=window.ROAD12_STRAVA_SYNC.transition(queued,"SYNCING",{uploadId:result.uploadId||queued.uploadId,lastAttemptAt:new Date().toISOString()});
     session.externalSync.strava=window.ROAD12_STRAVA_SYNC.reconcile(queued,result);
     consumeStravaPilotApproval(session,session.externalSync.strava);
     save();await renderStravaSessionActions(session,false);
     if(session.externalSync.strava.status==="SYNCING")setTimeout(()=>pollStravaUpload(session),1500);
   }catch(error){
     let queued=stravaSessionSync(session);
     if(queued.status==="QUEUED")queued=window.ROAD12_STRAVA_SYNC.transition(queued,"SYNCING");
     session.externalSync.strava=window.ROAD12_STRAVA_SYNC.transition(queued,"FAILED",{lastError:error.message||"Strava upload failed.",lastAttemptAt:new Date().toISOString()});
     save();await renderStravaSessionActions(session,false);
   }
 });
}
async function renderStravaSessionActions(session,reconcile=true){
 const container=document.querySelector("#stravaSessionActions");
 if(!container)return;
 if(stravaHistoricalPostBlocked(session)){
   const candidate=String(firstStravaPilotCandidateId()||"")===String(session.id||"");
   container.innerHTML=candidate?'<p class="muted">This workout\'s prior Strava metadata was deleted. Only this newest eligible session may be re-approved for the one-session manual pilot.</p><button class="secondary" id="approveStravaPilot" type="button">Use for first Strava pilot</button>':'<p class="muted">Strava data for this historical workout was deleted when the connection was removed. Historical reposting is disabled.</p>';
   container.querySelector("#approveStravaPilot")?.addEventListener("click",()=>{
     if(!confirm("Use this one completed workout for the approved first Strava pilot? No other historical workout will be enabled."))return;
     state.stravaPilotApproval={sessionId:String(session.id),approvedAt:new Date().toISOString(),consumedAt:null};
     save();renderStravaSessionActions(session,false);
   });
   return;
 }
 const client=window.ROAD12_STRAVA_CLIENT;
 if(!client?.configured()){
   container.innerHTML='<p class="muted">Manual Strava posting is not configured on this build. Local preview remains available.</p>';
   return;
 }
 let connection={connected:false};
 if(navigator.onLine){try{connection=await client.status();}catch{} }
 const record=reconcile?await reconcileStravaSession(session):stravaSessionSync(session);
 if(!document.querySelector("#stravaSessionActions"))return;
 container.innerHTML=stravaSessionStatusMarkup(record,connection.connected);
 container.querySelector("#postToStrava")?.addEventListener("click",()=>confirmStravaUpload(session));
 container.querySelector("#retryStravaPost")?.addEventListener("click",()=>confirmStravaUpload(session));
 container.querySelector("#verifyStravaDuplicate")?.addEventListener("click",async event=>{
   event.currentTarget.disabled=true;
   const preview=window.ROAD12_STRAVA_PAYLOAD.buildStravaStrengthPayload(stravaPayloadSession(session));
   try{
     const result=await client.upload({name:preview.name,sportType:preview.sportType,externalId:preview.externalId,dataType:preview.dataType,file:preview.file});
     const passed=result?.state==="SYNCED"&&String(result.activityId||"")===String(record.activityId||"");
     stravaConnectionNotice=passed?"Duplicate protection confirmed: the existing Strava activity was reused and no second upload was submitted.":"Duplicate protection could not be confirmed.";
     const note=document.createElement("p");note.className=`strava-connection-status ${passed?"connected":"not-connected"}`;note.setAttribute("role",passed?"status":"alert");note.textContent=stravaConnectionNotice;container.appendChild(note);
   }catch(error){event.currentTarget.disabled=false;const note=document.createElement("p");note.className="strava-connection-status not-connected";note.setAttribute("role","alert");note.textContent=error.message||"Duplicate protection could not be confirmed.";container.appendChild(note);}
 });
 if(record.status==="SYNCING"&&navigator.onLine)setTimeout(()=>pollStravaUpload(session),1500);
}
function sessionDetail(session){
 const totals=sessionTotals(session);
 const cardioBlocks=Array.isArray(session.cardioBlocks)?session.cardioBlocks:(session.cardio?[Object.assign({name:"Cardio"},session.cardio)]:[]);
 app.innerHTML=`<section class="card session-detail-header"><button class="secondary" id="historyBack">Back to history</button><div class="check small-check">✓</div><span class="pill">${session.recoveryIndicator?"RECOVERED WORKOUT":"COMPLETED WORKOUT"}</span><h2>${session.name}</h2><p class="muted">${session.date} • ${formatDuration(session.durationMs)}</p><div class="brief-grid"><div><small>SETS</small><strong>${totals.completedSets}</strong></div><div><small>REPS</small><strong>${totals.totalReps}</strong></div><div><small>SELECTED VOLUME</small><strong>${Math.round(totals.selectedVolume).toLocaleString()} lb</strong></div><div><small>STATUS</small><strong>Saved</strong></div></div>${cardioBlocks.map(block=>`<div class="recovery-note"><strong>${block.name}</strong><br>Target: ${block.plannedDurationMinutes} min • Completed: ${block.actualDurationMinutes} min${block.actualDurationMinutes>block.plannedDurationMinutes?` (+${Number((block.actualDurationMinutes-block.plannedDurationMinutes).toFixed(1))} min)`:""}${block.distance?`<br>Distance: ${block.distance}`:""}${block.averageHeartRate?` • Avg HR: ${block.averageHeartRate} bpm`:""}${block.averagePace?`<br>Avg pace: ${block.averagePace}`:""}${block.inclineResistance?` • Incline/resistance: ${block.inclineResistance}`:""}</div>`).join("")}${session.recoveryIndicator?`<div class="recovery-note"><strong>Recovery workout</strong><br>Originally planned: ${formatHistoryDateKey(session.plannedDate||session.originalScheduledDate)}<br>Completed: ${formatHistoryDateKey(session.completedDate||session.actualCompletionDate||session.dateKey)}</div>`:""}${session.recoveredFromV74?`<div class="recovery-note">This session was recovered from Version 11.3.2. Any values still held in the old workout log are shown below.</div>`:""}${window.ROAD12_STRAVA_PAYLOAD.isSessionStravaEligible(session)?'<button class="primary strava-preview-button" id="previewStravaPost">Preview Strava Post</button><div class="strava-session-actions" id="stravaSessionActions" aria-live="polite"><p class="muted">Checking Strava status…</p></div>':""}</section>
 <section class="card"><h2>Exercises completed</h2><div class="history-exercise-list">${(session.exercises||[]).length?(session.exercises||[]).map(ex=>`<details class="history-exercise" open><summary><span><strong>${ex.name}</strong>${ex.originalExercise?`<small>Substituted for ${ex.originalExercise}</small>`:""}</span><span>${(ex.sets||[]).filter(s=>s?.done).length} sets</span></summary><div class="history-set-head"><span>SET</span><span>${ex.weightEntry?.mode==="dual"?"LB / STACK":ex.weightEntry?.mode==="perSide"?"LB / SIDE":"WEIGHT"}</span><span>REPS</span><span>STATUS</span></div>${(ex.sets||[]).map((s,i)=>`<div class="history-set-row"><strong>${i+1}</strong><span>${s?.weight!==undefined&&s?.weight!==""?`${s.weight} lb`:"—"}${ex.weightEntry?.mode==="dual"&&s?.weight?`<small>${Number(s.weight)*2} lb combined selected</small>`:ex.weightEntry?.mode==="perSide"&&s?.weight?`<small>${Number(s.totalExternalLoadLb??Number(s.weight)*2)} lb total external load</small>`:""}</span><span>${s?.reps||"—"}</span><span>${s?.done?"✓ Complete":"Not marked"}</span></div>`).join("")||'<p class="muted">No set details were stored.</p>'}<div class="history-weight-note"><strong>${ex.weightEntry?.label||"Weight used"}</strong><p>${ex.weightEntry?.help||""}</p></div></details>`).join(""):'<p class="muted">The older session record did not contain exercise details.</p>'}</div></section>
 <button class="secondary" id="repeatHistory">Repeat this workout</button>`;
 document.querySelector("#historyBack").onclick=()=>{state.historyView=null;save();progress()};
 document.querySelector("#previewStravaPost")?.addEventListener("click",()=>openStravaPreview(session));
 if(window.ROAD12_STRAVA_PAYLOAD.isSessionStravaEligible(session))renderStravaSessionActions(session);
 document.querySelector("#repeatHistory").onclick=()=>{if(confirm("Start a new Full Body A workout? This saved session will not be changed.")){state.historyView=null;startNewSession();setTab("workout")}};
}

/* =========================================================
   ROAD TO 12% — VERSION 11.3.2 PRODUCT EXPERIENCE
   ========================================================= */
state.dailyCheckins=state.dailyCheckins||{};
state.workoutRatings=state.workoutRatings||{};
state.achievements=state.achievements||{};
state.setupReady=state.setupReady||false;
state.libraryCategory=state.libraryCategory||"strength";

const V11_LIBRARY_CATEGORIES=[
 {key:"strength",icon:"🏋️",title:"Strength Exercises",description:"Cable, Smith machine and resistance-training guides."},
 {key:"cardio",icon:"❤️",title:"Cardio",description:"Treadmill, rower and KICKR CORE technique and workouts."},
 {key:"mobility",icon:"🧘",title:"Warm-Up & Mobility",description:"Dynamic preparation, mobility, core activation and cooldown."},
 {key:"setup",icon:"🛠️",title:"Equipment Setup",description:"M1 attachments, pulley positions, Smith safety and bike setup."},
 {key:"recovery",icon:"🌙",title:"Recovery",description:"Check-ins, muscle recovery and post-workout guidance."}
];

function greeting(){
 const h=new Date().getHours();
 return h<12?"Good morning":h<18?"Good afternoon":"Good evening";
}
function tomorrowPlan(){
 const today=new Date().getDay();
 const mondayIndex=(today+6)%7;
 return weekPlan[(mondayIndex+1)%7];
}
function todayCheckin(){
 const key=localDateKey();
 state.dailyCheckins[key]=state.dailyCheckins[key]||{sleep:"",water:false,nutrition:false,recovery:"Good"};
 return state.dailyCheckins[key];
}
function allSessionExercises(){
 return state.history.flatMap(h=>(h.exercises||[]).map(ex=>({session:h,exercise:ex})));
}
function personalRecords(){
 const map={};
 allSessionExercises().forEach(({session,exercise})=>{
   const done=(exercise.sets||[]).filter(s=>s?.done);
   if(!done.length)return;
   const best=Math.max(...done.map(s=>Number(s.weight)||0));
   const volume=done.reduce((sum,s)=>sum+window.ROAD12_PRESCRIPTIONS.selectedLoad(exercise,s,SMITH_BAR_WEIGHT_LB)*(Number(s.reps)||0),0);
   const rec=map[exercise.name]||{name:exercise.name,bestWeight:0,bestVolume:0,lastWeight:0,date:""};
   rec.bestWeight=Math.max(rec.bestWeight,best);
   rec.bestVolume=Math.max(rec.bestVolume,volume);
   rec.lastWeight=best;
   rec.date=session.date;
   map[exercise.name]=rec;
 });
 return Object.values(map).sort((a,b)=>b.bestVolume-a.bestVolume);
}
function totalLifetimeVolume(){
 return state.history.reduce((sum,h)=>sum+sessionTotals(h).selectedVolume,0);
}
function earnedAchievements(){
 const count=state.history.length, volume=totalLifetimeVolume(), achievements=[];
 if(count>=1)achievements.push(["First Workout","Completed your first Road to 12% session."]);
 if(count>=5)achievements.push(["Five Sessions","Five workouts permanently logged."]);
 if(count>=10)achievements.push(["Ten Sessions","Consistency is becoming a habit."]);
 if(volume>=10000)achievements.push(["10,000 lb Club","Logged more than 10,000 lb of selected training volume."]);
 if(volume>=100000)achievements.push(["100,000 lb Club","Logged more than 100,000 lb of selected training volume."]);
 if(personalRecords().some(r=>r.bestWeight>0))achievements.push(["First Personal Record","Established a strength baseline."]);
 return achievements;
}
function recentMuscles(){
 const last=state.history.slice(-3);
 const historyMuscles=name=>{
   for(const dayIndex of [0,2,4]){
     const exercise=workoutForDay(dayIndex).find(item=>item.name===name);
     if(exercise?.muscles)return exercise.muscles;
   }
   return "";
 };
 const text=last.flatMap(h=>(h.exercises||[]).map(x=>x.muscles||historyMuscles(x.name))).join(" ").toLowerCase();
 const groups=[
  ["Chest","chest"],["Shoulders","shoulder"],["Back","back"],["Biceps","biceps"],
  ["Triceps","triceps"],["Quads","quad"],["Glutes","glute"],["Hamstrings","hamstring"],["Core","core"]
 ];
 return groups.map(([label,key])=>({label,trained:text.includes(key)}));
}
function exercisePreviewAsset(name){
 const all=[...data,...(window.EXTRA_LIBRARY_DATA||[])];
 const ex=all.find(x=>x.name===name||name.toLowerCase().includes(x.name.toLowerCase())||x.name.toLowerCase().includes(name.toLowerCase()));
 return ex?.demoImage||"";
}

function briefing(){
 const workoutData=activeWorkout(),blocks=setupPlanSummary(workoutData);
 const setupCards=blocks.map((b,i)=>{
   const first=workoutData.find(ex=>setupBlockLabel(ex)===b.label);
   return `<div class="setup-check-card"><span>${i+1}</span><div><strong>${b.label}</strong><small>${b.pin||"No pulley pin"} • ${b.count} movement${b.count===1?"":"s"}</small>${first?.m1?`<p>${first.m1.attachment} • ${first.m1.bench}</p>`:""}</div><button class="setup-check">✓</button></div>`;
 }).join("");
 app.innerHTML=`<section class="card gym-mode-intro"><span class="pill">GYM MODE</span><h2>Today’s setup</h2><p>Prepare each station now so your workout flows without surprises.</p><div class="setup-estimate"><strong>Estimated setup</strong><span>2–4 minutes</span></div></section>
 <section class="card"><div class="setup-route-v11">${setupCards}</div></section>
 <section class="card"><h3>Training target</h3><div class="brief-grid"><div><small>TIME</small><strong>50–60 min</strong></div><div><small>EFFORT</small><strong>2–3 reps in reserve</strong></div><div><small>BLOCKS</small><strong>${blocks.length}</strong></div><div><small>MODE</small><strong>Distraction free</strong></div></div></section>
 <button class="primary" id="go">${state.setupReady?"Continue workout":"Setup complete — begin"}</button>`;
 document.querySelectorAll(".setup-check").forEach(b=>b.onclick=()=>b.closest(".setup-check-card").classList.toggle("checked"));
 document.querySelector("#go").onclick=()=>{state.setupReady=true;save();next()};
}

function blockProgressMarkup(workoutData,ex){
 const groups=[...new Set(workoutData.map(setupBlockLabel))];
 const current=groups.indexOf(setupBlockLabel(ex));
 return `<div class="block-progress">${groups.map((g,i)=>`<div class="${i<current?"complete":i===current?"active":""}"><span>${i<current?"✓":i+1}</span><small>${g.replace(" block","")}</small></div>`).join("")}</div>`;
}
const SMITH_BAR_WEIGHT_LB=33;
function smithPlateCalculator(ex){
 if(!ex.name.toLowerCase().includes("smith"))return "";
 return `<section class="plate-calculator"><div><small>SMART PLATE CALCULATOR</small><h3>Smith working weight</h3></div><label>Total plate weight across both sides<input id="plateTotal" type="number" inputmode="decimal" min="0" step="0.5" placeholder="0"><small>Enter the combined weight of every plate loaded. Do not include the Smith bar.</small></label><div class="plate-result" id="plateResult">Smith bar only: ${SMITH_BAR_WEIGHT_LB} lb</div></section>`;
}
function calculatePlates(total){
 const added=Math.max(0,Number(total)||0);
 if(!added)return `Smith bar only: ${SMITH_BAR_WEIGHT_LB} lb`;
 const perSide=added/2;
 const workingWeight=SMITH_BAR_WEIGHT_LB+added;
 return `Load ${perSide} lb per side • ${added} lb plates + ${SMITH_BAR_WEIGHT_LB} lb bar = ${workingWeight} lb working weight`;
}

function summary(){
 let session;
 if(state.currentSession?.completedId){
   session=state.history.find(h=>h.id===state.currentSession.completedId);
 }else{
   const endedAt=new Date(),startedAt=state.currentSession?.startedAt?new Date(state.currentSession.startedAt):endedAt;
   session={id:state.currentSession?.id||`session-${Date.now()}`,scheduleId:state.currentSession?.scheduleId||null,planDay:Number.isInteger(state.currentSession?.planDay)?state.currentSession.planDay:currentPlanIndex(),date:endedAt.toLocaleDateString(),dateKey:localDateKey(endedAt),completedAt:endedAt.toISOString(),completedDate:localDateKey(endedAt),actualCompletionDate:localDateKey(endedAt),startedAt:startedAt.toISOString(),durationMs:Math.max(0,endedAt-startedAt),name:state.currentSession?.name||weekPlan[currentPlanIndex()].title,exercises:sessionExerciseSnapshot(),equipment:deepCopy(state.equipment)};
   session.endedAt=session.completedAt;
   session.utcOffsetSeconds=-startedAt.getTimezoneOffset()*60;
   session.elapsedDurationMs=session.durationMs;
   session.activeDurationMs=null;
   session.restDurationMs=null;
   session.workoutType=session.exercises.length?"strength":"cardio";
   session.completionStatus="completed";
   session.trainingPhase=deepCopy(state.currentSession?.trainingPhase||state.trainingPhase);
   session.actualPerformance=sessionTotals(session);
   session.externalSync={strava:{status:"NOT_SYNCED",activityId:null,uploadId:null,uploadedAt:null,lastAttemptAt:null,lastError:null,externalId:`road12-${session.id}`}};
   if(state.currentSession?.recoveredWorkout){
     session.recoveryIndicator=true;
     session.plannedDate=state.currentSession.plannedDate;
     session.originalScheduledDate=state.currentSession.originalScheduledDate;
     session.recoveryDecision="pending";
   }
   const scheduled=state.workoutSessions.find(item=>item.id===session.scheduleId);
   if(scheduled){
     scheduled.status="completed";
     scheduled.completedDate=session.completedDate;
     scheduled.actualCompletionDate=session.actualCompletionDate;
   }
   recordLowerAbsCompletion(session);
   state.approvedProgressions=window.ROAD12_PRESCRIPTIONS.completeApprovals(state.approvedProgressions,state.currentSession?.sessionPrescriptions,session.exercises,session.id,session.completedAt);
   state.sessions++;state.history.push(session);state.currentSession={completedId:session.id};state.step=0;state.setupReady=false;save();
 }
 const totals=sessionTotals(session),rating=state.workoutRatings[session.id]||"";
 const completedWorkout=workoutForDay(Number.isInteger(session.planDay)?session.planDay:currentPlanIndex());
 const cardioBlocks=cardioBlocksForWorkout(completedWorkout);
 const savedCardioBlocks=Array.isArray(session.cardioBlocks)?session.cardioBlocks:[];
 app.innerHTML=`<section class="card complete upgraded-complete"><div class="check">✓</div><span class="pill">SESSION ${state.sessions} COMPLETE</span><h2>You crushed it!</h2><p>${formatDuration(session.durationMs)} • ${totals.completedSets} sets • ${totals.totalReps} reps</p></section>
 <section class="card workout-rating"><h3>How did it feel?</h3><p>This rating is one signal alongside completed sets, reps, weight and recovery.</p><div class="rating-grid">${["Easy","Good","Too Hard"].map((x,i)=>`<button data-rating="${x}" class="${rating===x?"selected":""}"><span>${["😀","🙂","😫"][i]}</span>${x}</button>`).join("")}</div><label>Workout notes<textarea id="workoutNote" placeholder="Energy, discomfort, equipment changes or wins...">${session.note||""}</textarea></label></section>
 ${cardioBlocks.length?`<section class="card cardio-log-card"><span class="pill">CARDIO PERFORMANCE</span><h3>Record each cardio block</h3><p>Your measured timer total is filled in automatically. You can still correct it or add metrics imported from iFIT or Strava.</p><div class="cardio-block-list">${cardioBlocks.map((block,index)=>{const runtime=state.cardioTimers[block.name],timedMinutes=runtime?Number((currentCardioSeconds(runtime)/60).toFixed(1)):null,saved=Object.assign({},savedCardioBlocks.find(item=>item.name===block.name)||{},timedMinutes?{actualDurationMinutes:timedMinutes}:{}),previous=previousCardioBlock(block.name,session.id);return `<fieldset class="cardio-block" data-cardio-block="${index}"><legend><strong>${block.name}</strong><small>Target: ${block.plannedDurationMinutes} min • ${block.modality}</small></legend><p class="cardio-previous">${cardioComparison(previous)}</p><div class="cardio-log-grid"><label>Actual time (min)<input data-cardio="actualDurationMinutes" type="number" inputmode="decimal" min="0" step="0.1" value="${saved.actualDurationMinutes??block.plannedDurationMinutes}"></label><label>Distance<input data-cardio="distance" type="number" inputmode="decimal" min="0" step="0.01" value="${saved.distance??""}"></label><label>Average heart rate<input data-cardio="averageHeartRate" type="number" inputmode="numeric" min="0" value="${saved.averageHeartRate??""}"></label><label>Average pace<input data-cardio="averagePace" placeholder="e.g. 18:30 / mi" value="${escapeAdaptiveText(saved.averagePace||"")}"></label><label>Incline / resistance<input data-cardio="inclineResistance" placeholder="e.g. 3% or level 5" value="${escapeAdaptiveText(saved.inclineResistance||"")}"></label><label>Effort<select data-cardio="effort">${["Easy","Good","Too Hard"].map(value=>`<option ${saved.effort===value?"selected":""}>${value}</option>`).join("")}</select></label></div></fieldset>`;}).join("")}</div></section>`:""}
 ${session.recoveryIndicator&&session.recoveryDecision==="pending"?`<section class="card recovery-completion-choice" aria-labelledby="recoveryCompletionTitle">
   <span class="pill">RECOVERED WORKOUT</span>
   <h2 id="recoveryCompletionTitle">You completed a workout that was originally scheduled for yesterday.</h2>
   <p>What would you like to do with today’s scheduled workout?</p>
   <div class="choice-list">
     <button class="choice-button recommended-choice" data-recovery-decision="replace"><strong>Replace today’s workout with the one I just completed</strong><small>Recommended — move today’s workout forward while preserving the program order.</small></button>
     <button class="choice-button" data-recovery-decision="keep"><strong>Keep today’s workout</strong><small>Today’s workout remains available as scheduled.</small></button>
     <button class="choice-button" data-recovery-decision="later"><strong>Decide later</strong><small>Make no scheduling changes now.</small></button>
   </div>
 </section>`:""}
 <button class="primary" id="saveFinish">Save feedback and view workout</button><button class="secondary" id="home">Return home</button>`;
 const captureCompletionInputs=()=>{session.note=document.querySelector("#workoutNote")?.value.trim()||session.note||"";session.cardioBlocks=cardioBlocks.map((block,index)=>{const field=document.querySelector(`[data-cardio-block="${index}"]`),value=key=>field?.querySelector(`[data-cardio="${key}"]`)?.value;return Object.assign({},block,{actualDurationMinutes:Number(value("actualDurationMinutes"))||0,distance:Number(value("distance"))||null,averageHeartRate:Number(value("averageHeartRate"))||null,averagePace:value("averagePace")?.trim()||"",inclineResistance:value("inclineResistance")?.trim()||"",effort:value("effort")||"Good"});});const main=session.cardioBlocks.slice().sort((a,b)=>b.plannedDurationMinutes-a.plannedDurationMinutes)[0];if(main)session.cardio=Object.assign({},main,{paceIncline:[main.averagePace,main.inclineResistance].filter(Boolean).join(" • ")});};
 document.querySelectorAll("[data-rating]").forEach(b=>b.onclick=()=>{captureCompletionInputs();state.workoutRatings[session.id]=b.dataset.rating;session.difficultyRating=b.dataset.rating;save();summary()});
 document.querySelectorAll("[data-recovery-decision]").forEach(button=>button.onclick=()=>{
   const decision=button.dataset.recoveryDecision;
   window.ROAD12_SCHEDULING.completeRecoveredWorkout(
     state.workoutSessions,
     session.scheduleId,
     session.completedDate,
     decision
   );
   session.recoveryDecision=decision;
   save();
   summary();
 });
 const saveCompletionFeedback=()=>{captureCompletionInputs();if(cardioBlocks.length){state.cardioHistory=state.cardioHistory.filter(item=>item.sessionId!==session.id);session.cardioBlocks.forEach(block=>state.cardioHistory.push(Object.assign({sessionId:session.id,date:session.dateKey},block)));}save();};
 document.querySelector("#saveFinish").onclick=()=>{saveCompletionFeedback();state.historyView=session.id;setTab("progress")};
 document.querySelector("#home").onclick=()=>{saveCompletionFeedback();setTab("home")};
}

function library(){
 const extras=window.EXTRA_LIBRARY_DATA||[];
 const scheduled=[0,1,2,3,4,5].flatMap(day=>workoutForDay(day));
 const legacy=[legacyInclineCablePressExercise()];
 const all=[...new Map([...data,...extras,...scheduled,...legacy].map(ex=>[ex.name,ex])).values()];
 const category=state.libraryCategory;
 let content="";
 const mediaTiles=items=>`<div class="exercise-library-grid">${items.map(x=>{const entry=exerciseLibraryEntry(x),asset=entryDisplayAsset(entry);return `<button class="exercise-library-tile professional-library-tile" data-lib-name="${x.name}">${asset?`<img src="${asset}" alt="${entry.mediaAlt}" loading="lazy">`:`<div class="library-no-media">Written guide</div>`}<span class="tag">${libraryMediaLabel(entry)}</span><strong>${x.name}</strong><small>${x.muscles||"Guided movement"}</small></button>`}).join("")}</div>`;
 if(category==="strength"){
   const strength=all.filter(x=>x.type==="strength");
    content=mediaTiles(strength);
 }else if(category==="cardio"){
   const cardio=all.filter(ex=>ex.type==="cardio"||ex.type==="warmup"||/Treadmill|Rowing|Zone 2/.test(ex.name));
   content=mediaTiles(cardio);
 }else if(category==="mobility"){
   const mobility=all.filter(ex=>ex.type==="mobility"||ex.type==="cooldown"||/Mobility|Stretch|Breathing|Dead Bug|Bird Dog|Side Plank/.test(ex.name));
   content=mediaTiles(mobility);
 }else if(category==="setup"){
   const cards=["M1 Attachment Reference","M1 Setup Guide","Smith Machine Setup","KICKR CORE Bike Setup"];
   content=`<div class="text-guide-grid">${cards.map(name=>`<article><span class="tag">Setup guide</span><strong>${name}</strong><small>Use the exact setup, pin and attachment instructions shown during each workout.</small></article>`).join("")}</div>`;
 }else{
   content=`<div class="recovery-library"><h3>Recovery dashboard</h3><p>Use the Progress tab to review trained muscles, workout feedback and recovery readiness.</p><button class="primary" id="openRecovery">Open Progress</button></div>`;
 }
 app.innerHTML=`<section class="card"><span class="pill">VISUAL GUIDES</span><h2>Library</h2><p>Organized by purpose—not by development phase.</p><div class="library-category-grid">${V11_LIBRARY_CATEGORIES.map(c=>`<button data-category="${c.key}" class="${c.key===category?"active":""}"><span>${c.icon}</span><strong>${c.title}</strong><small>${c.description}</small></button>`).join("")}</div></section><section class="card">${content}</section>`;
 document.querySelectorAll("[data-category]").forEach(b=>b.onclick=()=>{state.libraryCategory=b.dataset.category;save();library()});
 document.querySelectorAll("[data-lib-name]").forEach(b=>{b.onclick=()=>{const ex=all.find(x=>x.name===b.dataset.libName);showLibraryExercise(ex)}});
 document.querySelectorAll("[data-guide-image]").forEach(b=>b.onclick=()=>openStandaloneGuide(b.dataset.guideTitle,b.dataset.guideImage));
 document.querySelector("#openRecovery")?.addEventListener("click",()=>setTab("progress"));
}
function openStandaloneGuide(title,image){
 const overlay=document.createElement("div");overlay.className="asset-overlay";
 overlay.innerHTML=`<div class="asset-overlay-panel"><button class="asset-close">Close</button><h2>${title}</h2><img src="${image}" alt="${title}"></div>`;
 document.body.appendChild(overlay);const close=()=>overlay.remove();overlay.querySelector(".asset-close").onclick=close;overlay.onclick=e=>{if(e.target===overlay)close()};
}



/* =========================================================
   ROAD TO 12% — VERSION 11.3.2 SIMPLIFIED EXPERIENCE
   ========================================================= */

/* Restore the motivating Home experience while retaining
   Version 11 intelligence inside Library and Progress. */

/* Remove Gym Mode and the pre-workout checklist.
   Starting a workout now opens the first guided movement immediately. */
function workout(){
 if(!state.currentSession && state.step===0){
   state.currentSession={
     id:`session-${Date.now()}`,
     name:"Full Body A",
     startedAt:new Date().toISOString(),
     dateKey:localDateKey(),
     equipment:deepCopy(state.equipment)
   };
   save();
 }

 const workoutData=activeWorkout();

 if(state.step===0){
   state.step=1;
   save();
 }

 if(state.step>workoutData.length)return summary();

 const ex=workoutData[state.step-1];
 exercise(ex,workoutData);
}

/* Restore the simpler step-by-step exercise experience.
   Advanced features remain available where useful, without a checklist-heavy shell. */





/* =========================================================
   ROAD TO 12% — VERSION 11.3.2 STABILITY REPAIR
   ========================================================= */

const V1131_ANATOMICAL_ASSETS={
 "Treadmill Walk":"assets/phase3/treadmill-walking.jpg",
 "Easy Treadmill Cooldown":"assets/phase3/treadmill-walking.jpg",
 "Arm Circles":"assets/placeholders/dynamic-warm-up.svg",
 "Bodyweight Squat":"assets/placeholders/bodyweight-squat.svg",
 "Hip Hinge":"assets/placeholders/hip-hinge.svg",
 "Post-Workout Stretch":"assets/placeholders/cooldown-recovery.svg",
 "Goblet Squat":"assets/placeholders/bodyweight-squat.svg",
 "Cable Chest Press":"assets/phase1/cable-chest-press.jpg",
 "Seated Cable Row":"assets/phase1/seated-cable-row.jpg",
 "Lat Pulldown":"assets/phase1/lat-pulldown.jpg",
 "Cable Shoulder Press":"assets/phase1/cable-shoulder-press.jpg",
 "Rope Triceps Pushdown":"assets/phase1/rope-triceps-pushdown.jpg",
 "Cable Curl":"assets/phase1/cable-curl.jpg",
 "Smith Machine Squat":"assets/phase1/smith-machine-squat.jpg",
 "Incline Cable Press":"assets/phase2/incline-cable-press.jpg",
 "Single Arm Cable Row":"assets/phase2/single-arm-cable-row.jpg",
 "Rear Delt Cable Fly":"assets/phase2/rear-delt-cable-fly.jpg",
 "Cable Lateral Raise":"assets/phase2/cable-lateral-raise.jpg",
 "Cable Hammer Curl":"assets/phase2/cable-hammer-curl.jpg",
 "Rope Hammer Curl":"assets/phase2/cable-hammer-curl.jpg",
 "High to Low Cable Chop":"assets/phase2/high-to-low-cable-chop.jpg",
 "Cable Face Pull":"assets/phase2/cable-face-pull.jpg",
 "Smith Machine RDL":"assets/phase2/smith-machine-rdl.jpg",
 "Smith Romanian Deadlift":"assets/phase2/smith-machine-rdl.jpg",
 "Bulgarian Split Squat":"assets/phase2/smith-bulgarian-split-squat.jpg",
 "Smith Bulgarian Split Squat":"assets/phase2/smith-bulgarian-split-squat.jpg",
 "Smith Machine Calf Raise":"assets/phase2/smith-machine-calf-raise.jpg",
 "Cable Crunch":"assets/phase2/cable-crunch.jpg",
 "Cable Straight Arm Pushdown":"assets/phase2/cable-straight-arm-pushdown.jpg",
 "Rower Technique":"assets/phase3/rower-technique.jpg",
 "Stationary Bike Setup":"assets/phase3/kickr-core-bike-setup.jpg",
 "KICKR CORE Setup":"assets/phase3/kickr-core-bike-setup.jpg",
 "KICKR CORE Endurance Ride":"assets/phase3/kickr-core-endurance-ride.jpg",
 "KICKR CORE HIIT Ride":"assets/phase3/kickr-core-hiit-ride.jpg"
};

function applyV1131Assets(){
 [...data,...(window.EXTRA_LIBRARY_DATA||[])].forEach(ex=>{
   if(V1131_ANATOMICAL_ASSETS[ex.name])ex.demoImage=V1131_ANATOMICAL_ASSETS[ex.name];
 });
}
applyV1131Assets();

function v1131SessionIdentity(session){
 return session.id||[
   session.dateKey||session.date||"",
   session.name||"",
   session.completedAt||session.startedAt||""
 ].join("|");
}
function v1131NormalizeHistory(history){
 const map=new Map();
 (Array.isArray(history)?history:[]).forEach(session=>{
   if(!session||typeof session!=="object")return;
   const key=v1131SessionIdentity(session);
   if(!map.has(key))map.set(key,session);
 });
 return [...map.values()].sort((a,b)=>{
   const da=new Date(a.completedAt||a.startedAt||a.date||0).getTime()||0;
   const db=new Date(b.completedAt||b.startedAt||b.date||0).getTime()||0;
   return da-db;
 });
}
function recoverV1131History(){
 const candidates=[...(state.history||[])];
 for(let i=0;i<localStorage.length;i++){
   const key=localStorage.key(i);
   if(!key||!key.toLowerCase().includes("road12"))continue;
   try{
     const parsed=JSON.parse(localStorage.getItem(key));
     if(Array.isArray(parsed?.history))candidates.push(...parsed.history);
     if(Array.isArray(parsed?.workoutHistory))candidates.push(...parsed.workoutHistory);
     if(Array.isArray(parsed?.sessionsHistory))candidates.push(...parsed.sessionsHistory);
   }catch(_){}
 }
 state.history=v1131NormalizeHistory(candidates);
 state.sessions=Math.max(Number(state.sessions)||0,state.history.length);
}
function latestV1131Session(){
 return (state.history||[]).slice().sort((a,b)=>{
   const da=new Date(a.completedAt||a.startedAt||a.date||0).getTime()||0;
   const db=new Date(b.completedAt||b.startedAt||b.date||0).getTime()||0;
   return db-da;
 })[0]||null;
}
function v1131DateLabel(session){
 const d=new Date(session.completedAt||session.startedAt||session.date);
 return Number.isNaN(d.getTime())
   ?(session.date||"Saved workout")
   :d.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"});
}
function hasActualWorkoutProgress(){
 const anySet=Object.values(state.logs||{}).some(sets=>
   Array.isArray(sets)&&sets.some(s=>s&&(
     s.done||
     Number(s.weight)>0||
     Number(s.reps)>0
   ))
 );
 return anySet;
}
function repairFalseActiveWorkout(){
 const key="road12-v11-3-1-false-session-repair";
 if(localStorage.getItem(key))return;
 if(state.currentSession&&Number(state.step)<=1&&!hasActualWorkoutProgress()){
   state.currentSession=null;
   state.step=0;
   state.setupReady=false;
 }
 localStorage.setItem(key,"1");
}
function exportV1131Backup(){
 const payload=window.ROAD12_BACKUP.create(APP_META,state,ROAD12_SCHEMA_VERSION);
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob);
 const a=document.createElement("a");
 a.href=url;
 a.download=`road-to-12-backup-${localDateKey()}.json`;
 document.body.appendChild(a);
 a.click();
 a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function importV1131Backup(file){
 const reader=new FileReader();
 reader.onload=()=>{
   try{
     const payload=JSON.parse(reader.result);
     const validated=window.ROAD12_BACKUP.validate(payload,ROAD12_SCHEMA_VERSION);
     const restored=road12Storage.migrate(window.ROAD12_BACKUP.merge(state,validated.state));
     if(restored.trainingProfile)restored.trainingProfile=window.ROAD12_ADAPTIVE.normalizeProfile(restored.trainingProfile);
     Object.keys(state).forEach(key=>delete state[key]);
     Object.assign(state,restored);
     save();
     alert(`Backup imported from ${payload.appVersion||payload.version||"an earlier version"}. ${state.history.length} workout${state.history.length===1?"":"s"} available.`);
     state.historyView=null;
     progress();
   }catch(error){
     alert(`Could not import backup: ${error.message}`);
   }
 };
 reader.readAsText(file);
}

function home(){
  syncSelectedDayToCalendar();
  ensureWorkoutSchedule();
  const todayKey=localDateKey();
  const latest=latestV1131Session();
  const historyCount=state.history.length;
  const preparedSession=selectedWorkoutSessionForToday(state.currentSession,todayKey);
  const preparedSchedule=preparedSession?.scheduleId?state.workoutSessions.find(item=>item.id===preparedSession.scheduleId):null;
  const selectedSession=isCompletedScheduleSession(preparedSchedule,state.history)?null:preparedSession;
  const selectedWorkout=selectedSession?workoutForDay(selectedSession.planDay):activeWorkout();
  const active=!!selectedSession&&state.step>0&&state.step<=selectedWorkout.length&&hasActualWorkoutProgress();
  const nextSession=nextHomeWorkoutSession(state.workoutSessions,state.history,todayKey);
  const linkedSession=selectedSession?.scheduleId?state.workoutSessions.find(item=>item.id===selectedSession.scheduleId):null;
  const primarySession=linkedSession||nextSession;
  const nextDayIndex=selectedSession
    ?selectedSession.planDay
    :Number.isInteger(primarySession?.planDay)?primarySession.planDay:state.selectedDay;
  const nextPlan=weekPlan[nextDayIndex];
  const nextIsFuture=!!primarySession&&primarySession.scheduledDate>todayKey;
  const nextDateLabel=primarySession
    ?parseDateKey(primarySession.scheduledDate).toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"})
    :"Upcoming";
  const metrics=v42Metrics();
  const adaptiveRecommendation=currentAdaptiveRecommendation();
  const weekStart=parseDateKey(todayKey);weekStart.setDate(weekStart.getDate()-currentPlanIndex());
  const weekDays=weekPlan.map((day,index)=>{
    const date=new Date(weekStart);date.setDate(weekStart.getDate()+index);
    const key=localDateKey(date),entries=sessionsForDate(key);
    const session=entries.find(item=>item.status!=="restDay")||entries[0];
    const status=session?.status||"scheduled";
    const statusInfo=V42_STATUS[status]||V42_STATUS.scheduled;
    const isToday=key===todayKey;
    return `<button class="command-day ${isToday?"today":""} status-${status}" data-day="${index}" aria-label="${day.short}, ${isToday?"Today, ":""}${statusInfo.label}"><strong>${day.short.slice(0,1)}</strong><small>${isToday?"Today":day.short[0]+day.short.slice(1).toLowerCase()}</small><span aria-hidden="true">${statusInfo.icon}</span><em>${statusInfo.label}</em></button>`;
  }).join("");
  const followingSession=nextHomeWorkoutSession(state.workoutSessions,state.history,todayKey,primarySession?.id);
  const followingPlan=followingSession?weekPlan[followingSession.planDay]:null;
  const primaryLabel=active?"WORKOUT IN PROGRESS":nextIsFuture?`UP NEXT • ${nextDateLabel}`:"TODAY";
  const latestTotals=latest?sessionTotals(latest):null;
  const bodyMeasurements=currentBodyMeasurements();

 app.innerHTML=`<section class="card command-week" aria-labelledby="commandWeekTitle">
   <div class="command-section-heading"><div><small>THIS WEEK</small><h2 id="commandWeekTitle">Training command center</h2></div><button class="history-count-button" id="openHistory">${historyCount} saved</button></div>
   <div class="command-week-strip">${weekDays}</div>
 </section>
 <section class="card command-workout-card">
   <div class="command-workout-copy"><small>${primaryLabel}</small><h2>${nextPlan.title}</h2><p>${nextPlan.detail}</p><span class="command-duration">◷ ${nextPlan.time}</span></div>
   <div class="command-workout-mark" aria-hidden="true"><span>${nextPlan.icon}</span></div>
   ${nextIsFuture&&!active&&!selectedSession?'<button class="primary" id="previewNextWorkout">Preview workout</button>':`<button class="primary" id="startWorkout">${active?"Resume workout":nextIsFuture?"Start early":"Start workout"}</button>`}
   <button class="secondary command-preview" id="previewSelected">View workout details</button>
 </section>
 <section class="card home-command-metrics" aria-label="Training metrics">
   <div><span class="metric-ring adherence-ring" style="--metric-progress:${metrics.adherence}%"><strong>${metrics.adherence}%</strong></span><small>Adherence</small></div>
   <div><span class="metric-ring recovery-ring" style="--metric-progress:${metrics.recovery}%"><strong>${metrics.recovery}</strong></span><small>Recovery</small></div>
   <div><span class="session-metric-icon">▦</span><strong>${metrics.total}</strong><small>Sessions</small></div>
 </section>
 ${phaseReadinessMarkup(adaptiveRecommendation,true)}
 ${followingPlan?`<button class="card command-up-next" id="previewFollowingWorkout"><span class="up-next-icon">${followingPlan.icon}</span><span><small>UP NEXT • ${parseDateKey(followingSession.scheduledDate).toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}</small><strong>${followingPlan.title}</strong><em>${followingPlan.time}</em></span><b aria-hidden="true">›</b></button>`:""}
 ${latest?`<section class="card command-achievement"><span class="achievement-icon">✓</span><div><small>LATEST ACHIEVEMENT</small><strong>${latest.name||"Completed workout"}</strong><span>${v1131DateLabel(latest)} • ${latestTotals.completedSets} sets</span></div><button class="secondary" id="viewLatestAchievement">View</button></section>`:""}
 <section class="command-checkin" aria-label="Latest check-in"><div><small>WEIGHT</small><strong>${bodyMeasurements.weight??"—"} lb</strong></div><div><small>WAIST</small><strong>${bodyMeasurements.waist??"—"} in</strong></div></section>`;

 document.querySelector("#viewLatestAchievement")?.addEventListener("click",()=>{
   state.historyView=latest.id;
   state.tab="progress";
   save();
   render();
 });
 document.querySelector("#openHistory").onclick=()=>{
   state.historyView=null;
   state.tab="progress";
   save();
   render();
 };
 document.querySelector("#previewSelected")?.addEventListener("click",()=>showDayPlan(nextDayIndex));
 document.querySelector("#previewNextWorkout")?.addEventListener("click",()=>showDayPlan(nextDayIndex));
 document.querySelector("#previewFollowingWorkout")?.addEventListener("click",()=>showDayPlan(followingSession.planDay));
 document.querySelectorAll("[data-day]").forEach(button=>{
   button.onclick=()=>{
     state.selectedDay=Number(button.dataset.day);
     state.previewDay=state.selectedDay;
     save();
     showDayPlan(state.selectedDay);
   };
 });
 document.querySelector("#startWorkout")?.addEventListener("click",()=>{
   if(!selectedSession)startNewSession(nextDayIndex,primarySession?.scheduledDate===todayKey?primarySession:null);
   state.tab="workout";
   save();
   workout();
 });
}


function lowerAbsProgramMarkup(){
 const status=lowerAbsProgramStatus();
 const phase1=["Reverse Crunch","Lying Leg Raise","Forearm Plank with Posterior Pelvic Tilt"];
 const phase2=["Hanging Knee Raise","Decline Bench Reverse Crunch","Hanging Garhammer Raise"];
 const movements=status.phase===1?phase1:phase2;
 const completed=status.phase===1?status.phase1Count:status.phase2Count;
 const heading=status.complete?"Four-week lower-ab block complete":status.readyForPhase2?"Phase 2 is ready for review":`Phase ${status.phase} - Week ${status.week}`;
 return `<section class="card lower-abs-program-card" aria-labelledby="lowerAbsProgramTitle">
   <span class="pill">LOWER ABS PROGRESSION</span>
   <h2 id="lowerAbsProgramTitle">${heading}</h2>
   <p>${status.phase===1?"Foundation emphasizes controlled pelvic motion and a flat lower back.":"Intensity increases only after two completed Foundation exposures and your approval."}</p>
   <div class="phase-readiness-track" role="progressbar" aria-label="Four-week lower-ab program progress" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${Math.min(4,status.phase1Count+status.phase2Count)}"><span style="width:${Math.min(100,(status.phase1Count+status.phase2Count)/4*100)}%"></span></div>
   <div class="lower-abs-movement-list">${movements.map(name=>`<div><span aria-hidden="true">${status.complete?"✓":"•"}</span><strong>${name}</strong></div>`).join("")}</div>
   <p class="muted">${completed} of 2 Phase ${status.phase} Core + Recovery sessions completed.</p>
   ${status.readyForPhase2?`<button class="primary" id="acceptLowerAbsPhase2">Review complete - begin Phase 2 next Thursday</button><small>Nothing changes until you accept. Your prior Phase 1 history remains preserved.</small>`:""}
 </section>`;
}

function weightHistoryRepairMarkup(candidates){
 if(!candidates.length)return "";
 const setCount=candidates.reduce((sum,item)=>sum+item.setIndexes.length,0);
 return `<section class="card weight-history-repair-card" aria-labelledby="weightHistoryRepairTitle">
   <span class="pill">WORKOUT HISTORY REVIEW</span>
   <h2 id="weightHistoryRepairTitle">Restore missing recommended weights</h2>
   <p>${setCount} completed set${setCount===1?"":"s"} look${setCount===1?"s":""} blank even though Road to 12% had an approved weight displayed. Review the exact saved recommendations below before changing history.</p>
   <div class="weight-repair-list">${candidates.slice(0,8).map(item=>`<div><span><strong>${item.exerciseName}</strong><small>${formatHistoryDateKey(item.sessionDate)} · ${item.sessionName} · Set${item.setIndexes.length===1?"":"s"} ${item.setIndexes.map(index=>index+1).join(", ")}</small></span><b>${item.targetWeight} lb</b></div>`).join("")}</div>
   ${candidates.length>8?`<p class="muted">Plus ${candidates.length-8} more exercise record${candidates.length-8===1?"":"s"} with saved recommendation evidence.</p>`:""}
   <div class="weight-repair-actions"><button class="primary" id="restoreRecommendedWeights">Restore displayed weights</button><button class="secondary" id="keepRecordedWeights">Keep as recorded</button></div>
   <small>Only records with a captured approved prescription qualify. Road to 12% will not guess missing weights.</small>
 </section>`;
}

function bodyMeasurementSourceLabel(source){return source==="wyze-import"?"Wyze Scale":source==="apple-health"?"Apple Health":"Manual";}
function bodyMeasurementDate(record){return record?new Date(record.timestamp).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}):"Not measured";}
function progressDisclosure(id,title,subtitle,content){
 const open=progressExpandedSections.has(id)?" open":"";
 return `<details class="progress-disclosure" data-progress-section="${id}"${open}>
   <summary><span><small>${subtitle}</small><strong>${title}</strong></span><b aria-hidden="true"></b></summary>
   <div class="progress-disclosure-body">${content}</div>
 </details>`;
}
function bodyMeasurementsImport(){
 const current=currentBodyMeasurements();
 const latestBodyFat=window.ROAD12_BODY_MEASUREMENTS.newestRecord(state.bodyMeasurements,"bodyFatPercent");
 const latestLean=window.ROAD12_BODY_MEASUREMENTS.newestRecord(state.bodyMeasurements,"leanBodyMassLb");
 const review=pendingWyzeImport;
 app.innerHTML=`<section class="card body-measurements-import-card">
   <button class="secondary" id="bodyMeasurementsBack">Back to Progress</button>
   <span class="pill">BODY MEASUREMENTS</span>
   <h2>Import measurements</h2>
   <p class="muted">Imports are processed locally on this device. Nothing is saved until you review and confirm it.</p>
   <div class="body-measurement-current" aria-label="Current body measurements">
     <div><small>CURRENT WEIGHT</small><strong>${current.weight??"—"} lb</strong></div>
     <div><small>LATEST BODY FAT</small><strong>${latestBodyFat?`${latestBodyFat.bodyFatPercent}%`:"—"}</strong><span>${latestBodyFat?`Measured ${bodyMeasurementDate(latestBodyFat)}`:"Not measured"}</span></div>
     <div><small>LATEST LEAN MASS</small><strong>${latestLean?`${latestLean.leanBodyMassLb} lb`:"—"}</strong><span>${latestLean?`Measured ${bodyMeasurementDate(latestLean)}`:"Not measured"}</span></div>
   </div>
   ${wyzeImportNotice?`<p class="measurement-import-notice" role="status">${wyzeImportNotice}</p>`:""}
   <div class="measurement-import-actions">
     <div class="native-file-picker"><span aria-hidden="true">Import Wyze Scale Export</span><input id="wyzeMeasurementFile" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" aria-label="Import Wyze Scale XLSX export"></div>
     <button class="secondary" id="manualMeasurement">Manual Measurement</button>
   </div>
   <small class="measurement-privacy-note">Accepted format: Wyze Scale XLSX export. Road to 12% does not connect to an undocumented Wyze API or Bluetooth service.</small>
 </section>
 ${review?`<section class="card wyze-import-review" aria-labelledby="wyzeImportReviewTitle">
   <span class="pill">REVIEW BEFORE IMPORT</span>
   <h2 id="wyzeImportReviewTitle">${review.foundCount} Wyze reading${review.foundCount===1?"":"s"} found</h2>
   <div class="wyze-import-summary"><strong>${review.uniqueCount} unique measurement${review.uniqueCount===1?"":"s"} will be imported</strong><span>${review.duplicateCount} duplicate reading${review.duplicateCount===1?"":"s"} will be skipped</span></div>
   <div class="wyze-import-list">${review.rows.map(item=>`<article class="status-${item.status}"><div><time>${new Date(item.record.timestamp).toLocaleString(undefined,{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"})}</time><strong>${item.record.weight} lb</strong><span>${item.record.bodyFatPercent!==null?`${item.record.bodyFatPercent}% body fat`:"Body fat not recorded"}${item.record.leanBodyMassLb!==null?` • ${item.record.leanBodyMassLb} lb lean mass`:""}</span></div><b>${item.status==="import"?"Import":item.status==="update"?"Update":"Duplicate"}</b>${item.reason?`<small>${item.reason}</small>`:""}</article>`).join("")}</div>
   <button class="primary" id="confirmWyzeImport" ${review.uniqueCount?"":"disabled"}>Import Measurements</button>
   <button class="secondary" id="cancelWyzeImport">Cancel</button>
 </section>`:""}`;
 document.querySelector("#bodyMeasurementsBack").onclick=()=>{pendingWyzeImport=null;wyzeImportNotice="";progress();};
 document.querySelector("#manualMeasurement").onclick=()=>{pendingWyzeImport=null;wyzeImportNotice="";progress();setTimeout(()=>document.querySelector("#w")?.focus(),0);};
 const wyzeFileInput=document.querySelector("#wyzeMeasurementFile");
 wyzeFileInput.onchange=async event=>{
   const file=event.target.files?.[0];
   if(!file)return;
   try{
     const parsed=await window.ROAD12_WYZE_IMPORT.parseFile(file,window.XLSX);
     pendingWyzeImport=window.ROAD12_WYZE_IMPORT.analyze(parsed,state.bodyMeasurements);
     wyzeImportNotice="";
     bodyMeasurementsImport();
   }catch(error){
     pendingWyzeImport=null;
     alert(`Could not read this Wyze export: ${error.message}`);
   }
 };
 document.querySelector("#cancelWyzeImport")?.addEventListener("click",()=>{pendingWyzeImport=null;bodyMeasurementsImport();});
 document.querySelector("#confirmWyzeImport")?.addEventListener("click",()=>{
   const result=window.ROAD12_WYZE_IMPORT.applyReview(state.bodyMeasurements,pendingWyzeImport);
   state.bodyMeasurements=result.records;
   const latest=window.ROAD12_BODY_MEASUREMENTS.current(state.bodyMeasurements,{weight:state.weight,waist:state.waist});
   if(latest.weight!==null)state.weight=latest.weight;
   if(latest.waist!==null)state.waist=latest.waist;
   save();
   pendingWyzeImport=null;
   wyzeImportNotice=`Imported ${result.imported} new and updated ${result.updated} existing measurement${result.imported+result.updated===1?"":"s"}. ${result.skipped} duplicate${result.skipped===1?" was":"s were"} skipped.`;
   bodyMeasurementsImport();
 });
}

function progress(){
 if(state.historyView){
   const session=state.history.find(h=>h.id===state.historyView);
   if(session)return sessionDetail(session);
   state.historyView=null;
 }

 const records=personalRecords().slice(0,6);
 const muscles=recentMuscles();
 const achievements=earnedAchievements();
 const readiness=currentAdaptiveRecommendation();
 const progression=exerciseProgressionRecommendations();
 const measurements=state.bodyMeasurements.slice().sort((a,b)=>String(b.timestamp).localeCompare(String(a.timestamp))).slice(0,8);
 const currentMeasurements=currentBodyMeasurements();
 const latestBodyFat=window.ROAD12_BODY_MEASUREMENTS.newestRecord(state.bodyMeasurements,"bodyFatPercent");
 const latestLean=window.ROAD12_BODY_MEASUREMENTS.newestRecord(state.bodyMeasurements,"leanBodyMassLb");
 const weight7=measurementRollingAverage(7,"weight"),weightWeek=measurementTrend(7,"weight"),weight30=measurementTrend(30,"weight"),waist30=measurementTrend(30,"waist"),strength30=strengthTrend();
 const weightRepairCandidates=window.ROAD12_PRESCRIPTIONS.recommendedWeightRepairCandidates(state.history);
 const lowerAbsMarkup=lowerAbsProgramMarkup();
 const weightRepairMarkup=weightHistoryRepairMarkup(weightRepairCandidates);

 app.innerHTML=`<section class="card progress-overview-card">
   <span class="pill">PROGRESS CENTER</span>
   <h2>Your Road to 12%</h2>
   <div class="brief-grid">
     <div><small>SESSIONS</small><strong>${state.history.length}</strong></div>
     <div><small>LIFETIME VOLUME</small><strong>${Math.round(totalLifetimeVolume()).toLocaleString()} lb</strong></div>
     <div><small>WEIGHT</small><strong>${currentMeasurements.weight??"—"} lb</strong></div>
     <div><small>WAIST</small><strong>${currentMeasurements.waist??"—"} in</strong></div>
   </div>
   <div class="measurement-row">
     <label>Weight (lb)<input id="w" value="${currentMeasurements.weight??""}" inputmode="decimal"></label>
     <label>Waist (in)<input id="wa" value="${currentMeasurements.waist??""}" inputmode="decimal"></label>
     <button class="secondary" id="saveP">Save check-in</button>
   </div>
   <button class="secondary body-measurements-open" id="openBodyMeasurements">Body Measurements / Import</button>
   ${measurements.length?`<details class="compact-progress-details"><summary>Recent measurements</summary><div class="measurement-history">${measurements.map(item=>`<div><time>${formatHistoryDateKey(item.timestamp?.slice(0,10))}</time><strong>${item.weight??"—"} lb</strong><strong>${item.waist??"—"} in</strong></div>`).join("")}</div></details>`:""}
 </section>

 ${progressDisclosure("readiness","Training readiness","PHASE & DATA QUALITY",phaseReadinessMarkup(readiness))}
 ${lowerAbsMarkup?progressDisclosure("lower-abs","Lower-ab progression","FOUNDATION SUBPROGRAM",lowerAbsMarkup):""}
 ${weightRepairMarkup?progressDisclosure("weight-review","Weight history review","DATA QUALITY",weightRepairMarkup):""}

 ${progressDisclosure("body-trends","Body-composition trends","WEIGHT, WAIST & REFERENCE DATA",`<section class="card composition-trends"><span class="pill">BODY-COMPOSITION TRENDS</span><h2>Direction, not one weigh-in</h2><div class="trend-grid"><div><small>7-DAY WEIGHT AVERAGE</small><strong>${weight7?`${weight7.average} lb`:"Collecting"}</strong><span>${weight7?`${weight7.count} check-in${weight7.count===1?"":"s"} in the rolling window`:"Add a weight check-in"}</span></div><div><small>7-DAY CHANGE</small><strong>${weightWeek?`${weightWeek.change>0?"+":""}${weightWeek.change} lb`:"Collecting"}</strong><span>${weightWeek?`${weightWeek.count} check-ins`:"At least two check-ins needed"}</span></div><div><small>30-DAY WEIGHT</small><strong>${weight30?`${weight30.change>0?"+":""}${weight30.change} lb`:"Collecting"}</strong><span>${weight30?`${weight30.count} check-ins`:"At least two check-ins needed"}</span></div><div><small>30-DAY WAIST</small><strong>${waist30?`${waist30.change>0?"+":""}${waist30.change} in`:"Collecting"}</strong><span>${waist30?`${waist30.count} check-ins`:"At least two check-ins needed"}</span></div><div><small>RECENT STRENGTH</small><strong>${strength30===null?"Collecting":`${strength30>0?"+":""}${strength30}%`}</strong><span>Selected volume across recent A/B/C sessions</span></div></div><div class="body-reference-grid"><div><small>LATEST BODY FAT</small><strong>${latestBodyFat?`${latestBodyFat.bodyFatPercent}%`:"Collecting"}</strong><span>${latestBodyFat?`${bodyMeasurementSourceLabel(latestBodyFat.source)} • measured ${bodyMeasurementDate(latestBodyFat)}`:"No body-fat reading yet"}</span></div><div><small>LATEST LEAN BODY MASS</small><strong>${latestLean?`${latestLean.leanBodyMassLb} lb`:"Collecting"}</strong><span>${latestLean?`${bodyMeasurementSourceLabel(latestLean.source)} • measured ${bodyMeasurementDate(latestLean)}`:"No lean-mass reading yet"}</span></div></div><p class="trend-note">Weight and waist are the primary body-composition signals. Consumer-scale composition estimates are stored as supporting trend data. A newer weight-only reading remains body-fat null; the dated reference above comes from the newest reading that actually measured it. Daily scale changes never alter training progression or trigger a fat-loss warning.</p></section>`)}

 ${progressDisclosure("exercise-progression","Exercise progression","NEXT-SESSION GUIDANCE",`<section class="card"><span class="pill">EXERCISE PROGRESSION</span><h2>Next-session guidance</h2><p class="muted">Recommendations use exercise-specific completed sets, reps, weight and workout feedback. Nothing changes automatically.</p><div class="exercise-progression-list">${progression.map(item=>{const recommendation=item.recommendation,approved=approvedProgressionFor(item.exercise),key=encodeURIComponent(item.exercise.name);return `<div class="progression-${recommendation.action.toLowerCase()}"><span>${recommendation.action}</span><p><strong>${item.exercise.name}</strong><b>${recommendation.prescription.summary}</b><small>${recommendation.reason}</small>${recommendation.action!=="BUILD"?`<button class="${approved?.sourceSessionId===recommendation.sourceSessionId?"secondary":"primary"} progression-approval" data-approve-progression="${key}">${approved?.sourceSessionId===recommendation.sourceSessionId?"Approved for next session ✓":"Approve next-session target"}</button>`:""}</p></div>`;}).join("")}</div></section>`)}

 ${progressDisclosure("data-backup","Data & backup","EXPORT OR RESTORE",`<section class="card history-protection-card">
   <div class="section-title-row">
     <div><small>DATA PROTECTION</small><h2>Workout history backup</h2></div>
     <span class="history-total">${state.history.length} saved</span>
   </div>
   <p>Export a backup before changing repositories, domains or installed app locations.</p>
   <div class="backup-actions">
     <button class="secondary" id="exportHistory">Export backup</button>
     <label class="secondary import-label">Import backup<input id="importHistory" type="file" accept="application/json,.json"></label>
   </div>
 </section>`)}

 ${progressDisclosure("recovery-map","Muscle recovery","RECENT TRAINING LOAD",`<section class="card">
   <h2>Muscle recovery map</h2>
   <p class="muted">Red groups were trained recently. Green groups are ready or were not emphasized in the last three sessions.</p>
   <div class="muscle-map">${muscles.map(m=>`<div class="${m.trained?"recovering":"ready"}"><span></span><strong>${m.label}</strong><small>${m.trained?"Recovering":"Ready"}</small></div>`).join("")}</div>
 </section>`)}

 ${progressDisclosure("personal-records","Personal records","STRENGTH HIGHLIGHTS",`<section class="card">
   <h2>Personal records</h2>
   ${records.length?`<div class="pr-grid">${records.map(r=>`<div><small>${r.name}</small><strong>${r.bestWeight} lb</strong><span>Best volume ${Math.round(r.bestVolume).toLocaleString()} lb</span></div>`).join("")}</div>`:'<p class="muted">Complete strength workouts to establish your first records.</p>'}
 </section>`)}

 ${progressDisclosure("achievements","Achievements","MILESTONES",`<section class="card">
   <h2>Achievements</h2>
   <div class="achievement-grid">${achievements.length?achievements.map(([a,d])=>`<div><span>✓</span><strong>${a}</strong><small>${d}</small></div>`).join(""):'<p class="muted">Your first achievement unlocks after one completed workout.</p>'}</div>
 </section>`)}

 ${progressDisclosure("workout-history","Workout history",`${state.history.length} COMPLETED SESSION${state.history.length===1?"":"S"}`,`<section class="card">
   <h2>Workout history</h2>
   ${state.history.length?state.history.slice().reverse().map(h=>{
     const t=sessionTotals(h),rating=state.workoutRatings[h.id]||"";
     return `<button class="history-card" data-history="${h.id}">
       <span class="history-check">${h.recoveryIndicator?"↻":"✓"}</span>
       <span><strong>${h.name}${h.recoveryIndicator?" · Recovery":""}</strong><small>${h.recoveryIndicator?`Planned ${formatHistoryDateKey(h.plannedDate||h.originalScheduledDate)} • Completed ${formatHistoryDateKey(h.completedDate||h.actualCompletionDate||h.dateKey)}`:`${h.date}`} • ${h.durationMs?formatDuration(h.durationMs):"Duration not captured"} • ${t.completedSets} sets${rating?` • ${rating}`:""}</small></span>
       <span class="history-arrow">›</span>
     </button>`;
   }).join(""):'<p class="muted">No completed sessions yet.</p>'}
 </section>`)} `;

 document.querySelectorAll("[data-progress-section]").forEach(section=>section.addEventListener("toggle",()=>{
   const id=section.dataset.progressSection;
   if(section.open)progressExpandedSections.add(id);else progressExpandedSections.delete(id);
 }));
 document.querySelector("#saveP").onclick=()=>{
   const weight=Number(document.querySelector("#w").value)||null,waist=Number(document.querySelector("#wa").value)||null;
   const measurement=window.ROAD12_BODY_MEASUREMENTS.adapters.manual.adapt({weight,waist,timestamp:new Date().toISOString()});
   if(!measurement)return;
   state.bodyMeasurements.push(measurement);
   const legacyMeasurement=window.ROAD12_BODY_MEASUREMENTS.toLegacy(measurement);
   if(legacyMeasurement)state.measurementHistory.push(legacyMeasurement);
   if(measurement.weight!==null)state.weight=measurement.weight;
   if(measurement.waist!==null)state.waist=measurement.waist;
   save();
   progress();
 };
 document.querySelector("#openBodyMeasurements").onclick=()=>{pendingWyzeImport=null;wyzeImportNotice="";bodyMeasurementsImport();};
 document.querySelector("#acceptLowerAbsPhase2")?.addEventListener("click",()=>{
   state.lowerAbsProgram.phase=2;
   state.lowerAbsProgram.phase2AcceptedAt=new Date().toISOString();
   save();
   progress();
 });
 const resolveWeightHistory=decision=>{
   const setCount=weightRepairCandidates.reduce((sum,item)=>sum+item.setIndexes.length,0);
   const restoring=decision==="restore";
   const prompt=restoring
     ?`Restore the exact displayed recommendation for ${setCount} completed set${setCount===1?"":"s"}? Lifetime volume and previous-weight guidance will update immediately.`
     :`Keep ${setCount} completed set${setCount===1?"":"s"} at their currently recorded weight? They will not be offered for repair again.`;
   if(!confirm(prompt))return;
   const result=window.ROAD12_PRESCRIPTIONS.resolveRecommendedWeightHistory(state.history,decision,new Date().toISOString());
   state.history=result.history;
   save();
   progress();
 };
 document.querySelector("#restoreRecommendedWeights")?.addEventListener("click",()=>resolveWeightHistory("restore"));
 document.querySelector("#keepRecordedWeights")?.addEventListener("click",()=>resolveWeightHistory("keep"));
 document.querySelector("#exportHistory").onclick=exportV1131Backup;
 document.querySelector("#importHistory").onchange=e=>{
   const file=e.target.files?.[0];
   if(file)importV1131Backup(file);
 };
 document.querySelectorAll("[data-history]").forEach(button=>{
   button.onclick=()=>{
     state.historyView=button.dataset.history;
     save();
     progress();
   };
 });
 document.querySelectorAll("[data-approve-progression]").forEach(button=>button.onclick=()=>{
   const name=decodeURIComponent(button.dataset.approveProgression);
   const item=progression.find(candidate=>candidate.exercise.name===name);
   if(!item)return;
   const exerciseId=window.ROAD12_PRESCRIPTIONS.exerciseIdentity(item.exercise,value=>window.ROAD12_EXERCISES.resolve(value));
   state.approvedProgressions[exerciseId]={exerciseId,exerciseName:name,approvedAt:new Date().toISOString(),status:"approved",prescription:deepCopy(item.recommendation.prescription),action:item.recommendation.action,sourceSessionId:item.recommendation.sourceSessionId};
   save();
   progress();
 });
}

function exercise(ex,workoutData=activeWorkout()){
 const pct=Math.round(state.step/workoutData.length*100);
 const strength=ex.type==="strength";
 const prescribed=strength?window.ROAD12_PRESCRIPTIONS.effective(state.currentSession,ex,name=>window.ROAD12_EXERCISES.resolve(name)):null;
 if(strength&&!state.logs[ex.name])state.logs[ex.name]=Array(prescribed.sets).fill(null);
 const exerciseId=window.ROAD12_EXERCISES.resolve(ex.name).id;
 if(!state.exerciseTimings[exerciseId]){state.exerciseTimings[exerciseId]={startedAt:new Date().toISOString(),endedAt:null};save();}

 const currentBlock=setupBlockLabel(ex);
 const previous=workoutData[state.step-2];
 const blockChanged=!previous||setupBlockLabel(previous)!==currentBlock;

 app.innerHTML=`<section class="card workout-card v111-workout-card">
   <div class="phase"><span class="tag">${ex.type}</span><strong>${state.step}/${workoutData.length}</strong></div>
   <div class="progress workout-progress"><i style="width:${pct}%"></i></div>
   ${blockChanged?`<div class="setup-block-banner compact-block-banner">
     <small>SETUP FOR THIS SECTION</small><strong>${currentBlock}</strong>
     ${ex.m1?`<span>Complete the exercises in this pulley zone before adjusting it again.</span>`:""}
   </div>`:""}
   <h2>${ex.name}</h2>
   <p class="muted workout-subtitle">${ex.muscles}</p>
   <div class="why-card"><h3>Why this exercise?</h3><p>${ex.why||"Builds strength, control and confidence."}</p></div>
   ${attachmentPhotoMarkup(ex)}
   ${ex.m1?m1SetupCoach(ex):`<div class="simple-setup-flow"><section class="setup-section"><div class="section-number">1</div><div><small>SETUP</small><h3>Get ready</h3>${ex.setup.map(x=>`<p>${x}</p>`).join("")}</div></section></div>`}
   ${chestSetupMarkup(ex)}
   ${chestActivationMarkup(ex)}
   ${exerciseTeachingMarkup(ex)}
   ${smithPlateCalculator(ex)}
   ${quickSettings(ex)}
   ${state.currentSession?.adaptivePlan?`<div class="adaptive-workout-note"><small>ADAPTIVE PLAN APPLIED</small><strong>${strength?`${ex.sets} working set${ex.sets===1?"":"s"}`:`${ex.adaptiveDurationMinutes?`${ex.adaptiveDurationMinutes} minute target`:"Recovery work preserved"}`}</strong><span>${ex.adaptiveProgression==="smallIncrease"?"Use only the smallest available increase when every prescribed rep is controlled.":"Hold the current load and prioritize controlled completion."}</span></div>`:""}
   ${strength?`<div class="weight-coach-card"><h3>Weight recommendation</h3><p>${ex.weightRecommendation}</p></div>`:""}
 </section>
 ${strength?sets(ex):timed(ex)}
 <div class="workout-actions"><button class="secondary" id="back">Back</button><button class="primary" id="next">${state.step===workoutData.length?"Finish session":"Complete & continue"}</button></div>`;

 document.querySelector("#back").onclick=()=>{
   state.step=Math.max(1,state.step-1);
   save();
   workout();
 };
 document.querySelector("#next").onclick=()=>{if(strength)captureExerciseFeedback(ex);next();};
  document.querySelector("#openAsset")?.addEventListener("click",()=>openExerciseAsset(ex));
 const plate=document.querySelector("#plateTotal");
 if(plate)plate.oninput=()=>document.querySelector("#plateResult").textContent=calculatePlates(plate.value);
 if(strength){bindSets(ex);bindChestActivation(ex)}else bindTimer(ex);
}

/* Direct tab routing. No wrapper recursion. */
setTab=function(tab){
 state.tab=tab;
 save();
 if(tab==="workout"){
   workoutLanding();
 }else if(tab==="progress"){
   state.historyView=null;
   render();
 }else{
   render();
 }
};


/* =========================================================
   ROAD TO 12% — VERSION 11.3.2 CALENDAR-DRIVEN WORKOUTS
   ========================================================= */

function currentPlanIndex(date=new Date()){
  /* JavaScript: Sunday=0. App schedule: Monday=0. */
  return (date.getDay()+6)%7;
}

function syncSelectedDayToCalendar(){
  const todayKey=localDateKey();
  if(state.lastCalendarSync!==todayKey){
    state.selectedDay=currentPlanIndex();
    state.previewDay=state.selectedDay;
    state.lastCalendarSync=todayKey;

    /* A session created on a prior date must not make today's workout
       appear resumable. Genuine prior work remains in history/log storage. */
    if(state.currentSession && state.currentSession.dateKey!==todayKey){
     state.currentSession=null;
     state.step=0;
     state.logs={};
     state.exerciseTimings={};
      state.setupReady=false;
    }
    save();
  }
}

function cloneExerciseByName(name,overrides={}){
  const source=[...data,...(window.EXTRA_LIBRARY_DATA||[])].find(ex=>ex.name===name);
  if(!source)throw new Error(`Missing exercise template: ${name}`);
  return Object.assign({},deepCopy(source),overrides);
}

function currentLowerAbsPhase(){
  return state.lowerAbsProgram.phase2AcceptedAt?2:1;
}

function lowerAbsProgramStatus(){
  const completedIds=new Set(state.lowerAbsProgram.completedSessionIds||[]);
  const sessions=state.history.filter(session=>completedIds.has(session.id)&&session.lowerAbsProgram);
  const phase1Count=sessions.filter(session=>session.lowerAbsProgram.phase===1).length;
  const phase2Count=sessions.filter(session=>session.lowerAbsProgram.phase===2).length;
  return {
    phase:currentLowerAbsPhase(),
    phase1Count,
    phase2Count,
    readyForPhase2:phase1Count>=2&&!state.lowerAbsProgram.phase2AcceptedAt,
    complete:phase2Count>=2,
    week:currentLowerAbsPhase()===1?Math.min(2,phase1Count+1):Math.min(4,phase2Count+3)
  };
}

function recordLowerAbsCompletion(session){
  if(session.planDay!==3)return;
  const program=state.lowerAbsProgram;
  if(!program.completedSessionIds.includes(session.id))program.completedSessionIds.push(session.id);
  const statusBefore=lowerAbsProgramStatus();
  session.lowerAbsProgram={phase:currentLowerAbsPhase(),week:statusBefore.week,programVersion:program.version};
  const projectedPhase1=statusBefore.phase1Count+(session.lowerAbsProgram.phase===1?1:0);
  const projectedPhase2=statusBefore.phase2Count+(session.lowerAbsProgram.phase===2?1:0);
  if(projectedPhase1>=2&&!program.phase2ReadyAt)program.phase2ReadyAt=session.completedAt;
  if(projectedPhase2>=2){
    program.status="completed";
    program.completedAt=program.completedAt||session.completedAt;
  }
}

function lowerAbsProgramExercises(){
  const bodyweight={
    type:"strength",
    rest:45,
    requires:["bodyweight"],
    substituteId:null,
    weightEntry:{mode:"bodyweight",label:"Bodyweight",help:"No external weight is needed. Record the repetitions or hold time you actually complete."}
  };
  if(currentLowerAbsPhase()===2)return [
    Object.assign(cloneExerciseByName("Bodyweight Squat"),bodyweight,{
      name:"Hanging Knee Raise",sets:3,reps:"10-12",muscles:"Lower abdominals, deep core and grip",
      setup:["Use the M1 front pull-up bar","Take a shoulder-width overhand grip","Begin in a still active hang"],
      steps:["Brace and stop any swinging.","Lift both knees toward the chest.","Curl the pelvis upward at the top rather than stopping at hip height.","Lower slowly to a still hang before repeating."],
      cues:["Keep the shoulders active.","Move without swinging.","Stop before grip or trunk control fails."],
      why:"Progresses the lower-ab pattern from the floor to a controlled hanging position.",
      weightRecommendation:"Use bodyweight and shorten the range before using momentum.",
      requires:["ritfitM1"],demoImage:"assets/exercise-library/generated/hanging-knee-raise-motion-guide.webp"
    }),
    Object.assign(cloneExerciseByName("Bodyweight Squat"),bodyweight,{
      name:"Decline Bench Reverse Crunch",sets:3,reps:12,muscles:"Lower abdominals and deep core",
      setup:["Set the adjustable bench to a slight decline","Lie with your head toward the higher end","Hold the bench lightly for stability"],
      steps:["Begin with hips and knees bent about 90 degrees.","Press the lower back into the bench.","Curl the pelvis and knees toward the ribs without swinging.","Lower slowly until the hips are supported again."],
      cues:["Use a small pelvic curl.","Keep the upper back supported.","Do not turn the movement into a leg swing."],
      why:"Increases the resistance of the reverse-crunch pattern without adding external weight.",
      weightRecommendation:"Use only a slight decline and control every lowering phase for 2-3 seconds.",
      requires:["bench"],demoImage:"assets/exercise-library/generated/decline-bench-reverse-crunch-motion-guide.webp"
    }),
    Object.assign(cloneExerciseByName("Bodyweight Squat"),bodyweight,{
      name:"Hanging Garhammer Raise",sets:3,reps:15,muscles:"Lower abdominals, deep core and grip",
      setup:["Use the M1 front pull-up bar","Begin with hips and knees already bent to 90 degrees","Keep the shoulders active and body still"],
      steps:["Hold the 90-degree starting position without swinging.","Keep the knees bent and curl the pelvis upward.","Draw the knees closer to the chest using the abdominals.","Lower only to the 90-degree start and pause before repeating."],
      cues:["Start at 90 degrees, not with straight legs.","Curl the tailbone toward the ribs.","Reduce repetitions before momentum appears."],
      why:"Uses a shortened hanging range to emphasize the pelvic curl and reduce hip-flexor dominance.",
      weightRecommendation:"Use bodyweight only. Stop the set if the 90-degree start cannot be held without swinging.",
      requires:["ritfitM1"],demoImage:"assets/exercise-library/generated/hanging-garhammer-raise-motion-guide.webp"
    })
  ];
  return [
    Object.assign(cloneExerciseByName("Bodyweight Squat"),bodyweight,{
      name:"Reverse Crunch",sets:3,reps:"12-15",muscles:"Lower abdominals and deep core",
      setup:["Lie on your back on a mat","Bend hips and knees to about 90 degrees","Place arms beside you with palms down"],
      steps:["Press your lower back gently into the floor.","Curl your pelvis toward your ribs and lift the hips only a few inches.","Pause without swinging the legs.","Lower slowly until the hips touch the mat."],
      cues:["Lead with the pelvis, not the feet.","Keep the movement small and controlled.","Exhale as the hips lift."],
      why:"Builds the pelvic-curl pattern needed for stronger lower-ab training.",
      weightRecommendation:"Use bodyweight and a 2-3 second lowering phase.",
      demoImage:"assets/exercise-library/generated/reverse-crunch-motion-guide.webp"
    }),
    Object.assign(cloneExerciseByName("Bodyweight Squat"),bodyweight,{
      name:"Lying Leg Raise",sets:3,reps:"10-12",muscles:"Lower abdominals, deep core and hip flexors",
      setup:["Lie on your back with both legs together","Place arms beside you with palms down","Press the lower back flat before moving"],
      steps:["Begin with both legs raised above the hips.","Lower both legs together for 2-3 seconds.","Stop before the lower back begins to arch.","Return under control without using momentum."],
      cues:["Shorten the range if the back lifts.","Keep the legs together.","Move slowly through the negative."],
      why:"Develops controlled lower-ab tension through a gradually increasing lever.",
      weightRecommendation:"Use bodyweight and prioritize a flat lower back over a lower leg position.",
      demoImage:"assets/exercise-library/generated/lying-leg-raise-motion-guide.webp"
    }),
    Object.assign(cloneExerciseByName("Bodyweight Squat"),bodyweight,{
      name:"Forearm Plank with Posterior Pelvic Tilt",sets:3,reps:"30-45",repUnit:"seconds",muscles:"Deep core, lower abdominals and glutes",
      setup:["Place forearms on a mat with elbows below shoulders","Extend both legs into a straight plank","Set feet about hip width"],
      steps:["Begin in a straight forearm plank.","Squeeze the glutes and gently tuck the tailbone toward the ribs.","Hold the tucked position while breathing normally.","End the set before the hips sag or pike."],
      cues:["Tuck; do not lift the hips.","Keep the ribs down.","Breathe throughout the hold."],
      why:"Teaches the posterior pelvic tilt that keeps lower-ab work out of the lower back.",
      weightRecommendation:"Use bodyweight and begin with 30 controlled seconds per set.",
      demoImage:"assets/exercise-library/generated/forearm-plank-posterior-pelvic-tilt-motion-guide.webp"
    })
  ];
}

function pelvicFloorRelaxationBlock(){
  const shared={type:"mobility",duration:"1:00",rest:0,requires:["bodyweight"],substituteId:null};
  return [
    Object.assign(cloneExerciseByName("Post-Workout Stretch"),shared,{
      name:"Supine Diaphragmatic Breathing",muscles:"Diaphragm, lower ribs and pelvic-floor relaxation",
      setup:["Lie on your back with knees bent and feet flat","Place one hand on the upper chest and one on the lower ribs or belly"],
      steps:["Relax the jaw and shoulders.","Inhale gently into the lower ribs and belly.","Let the pelvic area soften rather than bracing.","Exhale slowly without forcing the breath."],
      cues:["Keep the upper chest quiet.","Never strain or hold your breath."],
      why:"Coordinates relaxed diaphragmatic breathing with pelvic-floor lengthening.",demoImage:"assets/exercise-library/generated/supine-diaphragmatic-breathing-motion-guide.webp"
    }),
    Object.assign(cloneExerciseByName("Post-Workout Stretch"),shared,{
      name:"Wide-Knee Child's Pose Breathing",muscles:"Pelvic floor, hips, lower back and breathing muscles",
      setup:["Kneel on a mat with knees comfortably wide","Bring the big toes near each other","Reach the arms forward and let the hips move toward the heels"],
      steps:["Settle into a pain-free Child's Pose.","Breathe into the back and side ribs.","Let the hips grow heavy toward the heels on each exhale.","Remain relaxed rather than pushing deeper."],
      cues:["Support the forehead if needed.","Do not force the knees or hips."],
      why:"Uses supported hip opening and breathing to reduce unnecessary pelvic tension.",demoImage:"assets/exercise-library/generated/wide-knee-childs-pose-breathing-motion-guide.webp"
    }),
    Object.assign(cloneExerciseByName("Bodyweight Squat"),shared,{
      name:"Supported Deep Squat Breathing",muscles:"Pelvic floor, hips, adductors and ankles",
      setup:["Face the M1 cage and hold the front uprights lightly","Take a comfortable wide stance with toes turned slightly out","Keep both heels planted"],
      steps:["Use the cage for balance as you settle into a comfortable squat.","Keep the knees tracking with the toes.","Breathe into the lower ribs and belly.","Let the hips relax only as far as comfortable."],
      cues:["This is a supported hold, not a loaded squat.","Do not bounce or force depth."],
      why:"Combines supported hip mobility with relaxed breathing.",requires:["ritfitM1"],demoImage:"assets/exercise-library/generated/supported-deep-squat-breathing-motion-guide.webp"
    }),
    Object.assign(cloneExerciseByName("Post-Workout Stretch"),shared,{
      name:"Happy Baby Pelvic Floor Stretch",muscles:"Pelvic floor, inner thighs, hips and lower back",
      setup:["Lie on your back on a mat","Bring the knees wide toward the sides of the ribs","Hold the outside of the feet or lower shins gently"],
      steps:["Keep the head, shoulders and sacrum relaxed on the mat.","Stack the ankles roughly above the knees.","Allow the knees to settle slightly wider on the exhale.","Hold without rocking or pulling forcefully."],
      cues:["Keep the sacrum grounded.","Use the shins instead of the feet if that is more comfortable."],
      why:"Provides a gentle pelvic-floor and inner-hip relaxation position.",demoImage:"assets/exercise-library/generated/happy-baby-pelvic-floor-stretch-motion-guide.webp"
    }),
    Object.assign(cloneExerciseByName("Post-Workout Stretch"),shared,{
      name:"90/90 Hip Switch",muscles:"Hip rotators, glutes and pelvic mobility",
      setup:["Sit on a mat with hands lightly behind you","Bend both knees and place the feet wider than the hips","Keep the chest tall"],
      steps:["Lower both knees together toward one side.","Move only through a comfortable hip range.","Rotate both knees through the center.","Lower them toward the opposite side and continue slowly."],
      cues:["Do not force the knees to the floor.","Keep the movement controlled and pain free."],
      why:"Builds gentle hip rotation that supports comfortable pelvic movement.",demoImage:"assets/exercise-library/generated/ninety-ninety-hip-switch-motion-guide.webp"
    })
  ];
}

function cardioMobilityWorkout(){
  return [
    cloneExerciseByName("Treadmill Walk",{
      name:"Easy Treadmill Warm-Up",
      duration:"5:00",
      muscles:"Full-body temperature and heart-rate warm-up",
      setup:["Speed: 2.5–3.0 mph","Incline: 0–2%","Use the rails only when needed"],
      steps:[
        "Begin at an easy walking pace.",
        "Stand tall with relaxed shoulders.",
        "Let your arms swing naturally.",
        "Finish feeling warmer, not tired."
      ],
      cues:["Keep your eyes forward.","Use a smooth, comfortable stride."],
      why:"Gradually prepares your joints, muscles and cardiovascular system.",
      demoImage:"assets/phase3/treadmill-walking.jpg"
    }),
    cloneExerciseByName("Treadmill Walk",{
      name:"Incline Treadmill Walk",
      duration:"22:00",
      muscles:"Glutes, hamstrings, calves and aerobic base",
      setup:["Speed: 3.0–3.6 mph","Incline: 5–10%","Choose an incline that still allows conversation"],
      steps:[
        "Increase the incline gradually over the first two minutes.",
        "Lean slightly from the ankles without bending at the waist.",
        "Drive through each full step and avoid holding the rails.",
        "Maintain a conversational pace for the working interval."
      ],
      cues:["Shorten your stride slightly on steeper inclines.","Reduce incline before holding the rails."],
      why:"Builds aerobic fitness and supports recovery without another heavy lifting session.",
      demoImage:"assets/phase3/treadmill-incline-walk.jpg"
    }),
    cloneExerciseByName("Rower Technique",{
      name:"iFIT Rowing Technique",
      duration:"8:00",
      muscles:"Legs, back, arms and aerobic coordination",
      setup:["Secure both feet in the straps","Set resistance conservatively","Sit tall with the handle held lightly"],
      steps:[
        "Drive first with the legs while keeping the arms long.",
        "Finish the stroke by opening the hips slightly and drawing the handle toward the lower ribs.",
        "Return the arms first, hinge forward, then bend the knees.",
        "Keep every stroke smooth and easy rather than chasing speed."
      ],
      cues:["Legs, hips, arms on the drive.","Arms, hips, legs on the return.","Relax your grip and shoulders."],
      why:"Adds low-fatigue practice on the iFIT rower while building full-body aerobic coordination.",
      requires:["rower"],
      demoImage:"assets/phase3/rower-technique.jpg"
    }),
    cloneExerciseByName("Post-Workout Stretch",{
      name:"Hip Flexor Mobility",
      duration:"2:00",
      muscles:"Hip flexors and front of the thighs",
      setup:["Place the rear knee on a mat and step the opposite foot forward","Keep the front foot flat and hold 30 seconds per side, twice"],
      steps:[
        "Begin tall in the half-kneeling position shown.",
        "Gently tuck your pelvis by bringing your belt buckle toward your ribs.",
        "Keeping your torso upright, shift your hips forward a few inches until you feel a gentle stretch in the front of the rear hip.",
        "Repeat on the opposite side."
      ],
      cues:["Squeeze the rear-side glute.","Stay tall and do not arch your lower back.","Use a small, pain-free shift rather than a deep lunge."],
      why:"Restores hip motion after incline walking.",
      demoImage:"assets/exercise-library/original/hip-flexor-mobility.webp"
    }),
    cloneExerciseByName("Post-Workout Stretch",{
      name:"Hamstring Mobility",
      duration:"2:00",
      muscles:"Hamstrings and calves",
      setup:["Stand facing a low bench or stable platform","Place one heel on the support with that knee nearly straight","Hold 30 seconds per side, twice"],
      steps:[
        "Begin tall with the supported toes pointing upward.",
        "Keep your back long and soften the standing knee.",
        "Push your hips backward and hinge your whole torso forward until you feel a gentle stretch behind the supported thigh.",
        "Repeat on the opposite side."
      ],
      cues:["Lead with your chest instead of rounding toward your knee.","Keep the supported foot relaxed and pointed straight up.","Do not bounce; stop before the stretch becomes painful."],
      why:"Reduces lower-body tightness after treadmill work.",
      demoImage:"assets/exercise-library/original/hamstring-mobility.webp"
    }),
    cloneExerciseByName("Arm Circles",{
      name:"Chest and Shoulder Mobility",
      duration:"3:00",
      muscles:"Chest, shoulders and upper back",
      setup:["Stand with your back, head and forearms against a clear wall","Set your elbows near shoulder height in a comfortable W shape"],
      steps:[
        "Gently draw your ribs down and keep your lower back neutral.",
        "Slide both forearms upward along the wall toward a wide Y shape.",
        "Stop before your shoulders shrug or your back arches.",
        "Return slowly to the W position and repeat for the full interval."
      ],
      cues:["Keep your ribs down.","Let the shoulder blades rotate as the arms rise.","Use only the range you can control without pain."],
      why:"Maintains upper-body mobility between strength sessions.",
      demoImage:"assets/exercise-library/original/chest-shoulder-mobility.webp"
    }),
    ...pelvicFloorRelaxationBlock(),
    cloneExerciseByName("Easy Treadmill Cooldown",{
      name:"Easy Cardio Cooldown",
      duration:"5:00",
      muscles:"Gradual heart-rate recovery",
      demoImage:"assets/phase3/treadmill-walking.jpg"
    })
  ];
}

function kettlebellFoundationBlock(){
  const shared={
    type:"strength",
    requires:["kettlebells"],
    substituteId:null,
    attachmentCard:null,
    weightEntry:{mode:"total",label:"Kettlebell weight",help:"Enter 30 lb for the owned kettlebell. Record a lower value only if different equipment is used."}
  };
  return [
    Object.assign(cloneExerciseByName("Hip Hinge"),shared,{
      name:"Kettlebell Around the World",sets:2,reps:"5/dir",rest:45,
      muscles:"Deep core, obliques, shoulders, grip and hip stability",
      setup:["Use the owned 30 lb kettlebell in a clear standing area","Stand tall with feet about hip width and knees soft","Hold the bell at one hip with the free hand ready to receive"],
      steps:["Brace gently and keep the ribs stacked over the hips.","Pass the kettlebell behind the waist from one hand to the other.","Bring it around the opposite side and transfer it again in front.","Complete five slow circles, then reverse direction."],
      cues:["Keep the bell below the navel.","Keep the torso still—do not twist or lean.","Make every handoff secure before releasing."],
      why:"Introduces controlled kettlebell handling while training the trunk to resist rotation.",
      weightRecommendation:"Use the 30 lb bell only while every handoff is secure. Stop or skip the movement if the bell pulls you out of position.",
      demoImage:"assets/exercise-library/generated/kettlebell-around-the-world-motion-guide.webp"
    }),
    Object.assign(cloneExerciseByName("Hip Hinge"),shared,{
      name:"Kettlebell Swing",sets:3,reps:10,rest:60,
      muscles:"Glutes, hamstrings, core, grip and cardiovascular power",
      setup:["Place the owned 30 lb kettlebell about one foot in front of you","Stand with feet just wider than hip width","Hinge back with a long spine and grip the handle with both hands"],
      steps:["Hike the kettlebell high between the thighs with the arms long.","Drive the feet into the floor and snap the hips forward.","Let the bell float to about chest height without lifting with the shoulders.","Allow it to fall, hinge again, and guide it between the thighs.","After the final rep, park the bell under control in front of you."],
      cues:["Hinge—do not squat the bell.","Power comes from the hips; the arms stay long.","Stop at chest height and keep the ribs stacked."],
      why:"Adds a short technique-focused power and conditioning dose without replacing the existing core work.",
      weightRecommendation:"Use the 30 lb bell for crisp sets of ten only. End the set immediately if the back rounds or the arms begin lifting the bell.",
      demoImage:"assets/exercise-library/generated/kettlebell-swing-motion-guide.webp"
    }),
    Object.assign(cloneExerciseByName("Hip Hinge"),shared,{
      name:"Kettlebell Suitcase Carry",sets:2,reps:"30 sec/side",rest:45,
      muscles:"Obliques, deep core, grip, shoulders and walking stability",
      setup:["Use the owned 30 lb kettlebell in one hand","Stand tall with the bell beside the thigh","Clear a short walking path and keep the free arm relaxed"],
      steps:["Walk slowly while keeping the ribs stacked and hips level.","Keep the loaded shoulder down and the kettlebell close to the leg.","Turn under control without swinging the bell.","Complete 30 seconds, switch hands, and repeat on the other side."],
      cues:["Do not lean toward or away from the bell.","Keep the wrist straight and shoulder packed.","Take quiet, controlled steps."],
      why:"Adds practical grip and anti-side-bending core work with a low skill barrier.",
      weightRecommendation:"Use the 30 lb bell. Shorten the interval before posture changes.",
      demoImage:"assets/exercise-library/generated/kettlebell-suitcase-carry-motion-guide.webp"
    })
  ];
}

function coreRecoveryWorkout(){
  return [
    cloneExerciseByName("Treadmill Walk",{
      name:"Easy Recovery Walk",
      duration:"8:00",
      muscles:"Light full-body movement",
      setup:["Speed: comfortable","Incline: 0–2%"],
      why:"Promotes circulation without adding significant fatigue.",
      demoImage:"assets/phase3/treadmill-walking.jpg"
    }),
    ...kettlebellFoundationBlock(),
    cloneExerciseByName("Bodyweight Squat",{
      name:"Dead Bug",
      duration:"3:00",
      muscles:"Deep core and trunk stability",
      setup:["Lie on your back with hips and knees bent to 90 degrees","Reach both arms toward the ceiling","Gently press your lower back toward the floor"],
      steps:["Brace your abdomen without holding your breath.","Slowly lower one arm and the opposite heel toward the floor.","Stop before your lower back lifts, then return to the start.","Alternate sides for 8 controlled repetitions per side."],
      cues:["Keep your ribs down.","Move only as far as you can control.","Exhale as the arm and leg extend."],
      why:"Builds core control without loading recovering joints.",
      demoImage:"assets/exercise-library/original/dead-bug-animation.gif"
    }),
    cloneExerciseByName("Bodyweight Squat",{
      name:"Bird Dog",
      duration:"3:00",
      muscles:"Deep core, glutes, shoulders and trunk stability",
      setup:["Begin on hands and knees on a comfortable mat","Place hands under shoulders and knees under hips","Keep your spine neutral and look down between your hands"],
      steps:["Brace your abdomen while keeping your hips level.","Reach your left arm forward as your right leg extends straight behind you.","Pause without arching or rotating, then return both to the floor.","Repeat with your right arm and left leg, alternating for 8 controlled repetitions per side."],
      cues:["Reach long instead of lifting high.","Keep both hip bones facing the floor.","Move slowly and keep breathing."],
      why:"Trains the core to resist rotation while the opposite arm and leg move.",
      demoImage:"assets/exercise-library/original/bird-dog-animation.gif"
    }),
    cloneExerciseByName("Bodyweight Squat",{
      name:"Side Plank from Knees",
      duration:"2:00",
      muscles:"Obliques, glutes and shoulder stability",
      setup:["Lie on one side with knees bent","Place your elbow directly below your shoulder","Stack your hips and keep your knees together"],
      steps:["Brace your abdomen and press your forearm into the floor.","Lift your hips until your shoulders, hips and knees form a straight line.","Hold for 20–30 seconds while breathing normally.","Lower with control and repeat on the opposite side."],
      cues:["Keep your shoulder away from your ear.","Do not roll the top hip backward.","Shorten the hold before form breaks down."],
      why:"Builds side-core endurance with less load than a full side plank.",
      demoImage:"assets/exercise-library/original/side-plank-from-knees-animation.gif"
    }),
    ...lowerAbsProgramExercises(),
    cloneExerciseByName("Post-Workout Stretch",{
      name:"Hip and Glute Mobility",
      duration:"6:00",
      muscles:"Hips, glutes and lower back",
      setup:["Sit near the front edge of a stable bench","Place both feet flat with knees near 90 degrees","Keep your spine tall before crossing the leg"],
      steps:[
        "Place one ankle gently across the opposite thigh just above the knee.",
        "Flex the raised foot and keep the shin supported without pressing on the knee.",
        "Hinge forward from the hips with a long spine until you feel a gentle glute stretch.",
        "Return tall, switch sides and repeat without forcing the range."
      ],
      cues:["Keep the raised foot flexed.","Lead with the chest instead of rounding.","Stop if the knee or hip feels pinched."],
      why:"Restores comfortable hip rotation and gently stretches the glutes between strength sessions.",
      demoImage:"assets/exercise-library/generated/hip-glute-mobility-motion-guide.webp"
    }),
    cloneExerciseByName("Arm Circles",{
      name:"Thoracic and Shoulder Mobility",
      duration:"5:00",
      muscles:"Upper back and shoulders",
      setup:["Stand with your back and head against a clear wall","Set elbows near shoulder height in a comfortable W position","Keep feet slightly forward and knees soft"],
      steps:[
        "Gently draw your ribs down and keep your lower back neutral.",
        "Slide both forearms upward along the wall toward a wide Y position.",
        "Stop before your shoulders shrug or your back arches.",
        "Return slowly to the W position and repeat."
      ],
      cues:["Keep your ribs down.","Let the shoulder blades rotate as the arms rise.","Use only a pain-free range."],
      why:"Maintains upper-back and shoulder mobility without adding training fatigue.",
      demoImage:"assets/exercise-library/generated/chest-shoulder-mobility-motion-guide.webp"
    }),
    cloneExerciseByName("Post-Workout Stretch",{
      name:"Slow Breathing Cooldown",
      duration:"4:00",
      muscles:"Recovery and relaxation",
      setup:["Lie down or sit comfortably","Breathe slowly through the nose"],
      steps:[
        "Inhale gently for four seconds.",
        "Exhale slowly for six seconds.",
        "Relax your shoulders and jaw.",
        "Continue until breathing feels calm."
      ],
      cues:["Never strain or hold your breath.","Let the exhale remain easy."],
      why:"Helps transition from training into recovery.",
      demoImage:"assets/placeholders/cooldown-recovery.svg"
    })
  ];
}

function zone2CardioWorkout(){
  return [
    cloneExerciseByName("Treadmill Walk",{
      name:"Zone 2 Warm-Up",
      duration:"5:00",
      muscles:"Aerobic preparation",
      demoImage:"assets/phase3/treadmill-walking.jpg"
    }),
    cloneExerciseByName("Rower Technique",{
      name:"Zone 2 Cardio",
      duration:"30:00",
      muscles:"Aerobic endurance and full-body conditioning",
      setup:[
        "Choose treadmill, rower or KICKR CORE",
        "Use a pace where you can speak in complete sentences",
        "Keep effort steady rather than hard"
      ],
      steps:[
        "Build gradually into a comfortable steady pace.",
        "Maintain controlled breathing.",
        "Keep the effort consistent for the full interval.",
        "Reduce intensity if conversation becomes difficult."
      ],
      cues:["Stay relaxed.","This is not an interval or sprint session."],
      why:"Builds aerobic capacity while supporting fat loss and recovery.",
      demoImage:"assets/phase3/kickr-core-endurance-ride.jpg"
    }),
    ...pelvicFloorRelaxationBlock(),
    cloneExerciseByName("Easy Treadmill Cooldown",{
      name:"Zone 2 Cooldown",
      duration:"5:00",
      demoImage:"assets/placeholders/cooldown-recovery.svg"
    })
  ];
}

function smithMachineBenchPressExercise(){
  return cloneExerciseByName("Cable Chest Press",{
    name:"Smith Machine Bench Press",type:"strength",sets:3,reps:10,rest:90,
    muscles:"Chest, triceps and front shoulders",
    setup:["Center the Gator bench flat inside the Smith station","Align the bar path with the lower-to-middle chest","Set both safety stops just below the controlled bottom position","Plant both feet firmly on the floor"],
    steps:["Pin the shoulder blades back and down and keep the chest slightly elevated.","Unrack with wrists stacked over the forearms.","Lower the bar under control toward the lower-to-middle chest with elbows 45–60 degrees from the torso.","Press upward while thinking about bringing the upper arms toward each other.","Finish without shrugging or rolling the shoulders forward, then re-rack securely."],
    cues:["Bring the upper arms toward each other with the chest.","Keep the shoulder blades pinned.","Stop with the prescribed clean reps still available."],
    why:"Uses the stable Smith path and flat bench to establish reliable chest pressing mechanics before adding intensity.",
    weightRecommendation:"First exposure: begin with the empty 33 lb Smith bar and target 3–4 reps in reserve. Add matched plates only after a clean session with good chest engagement.",
    requires:["ritfitM1","bench","bumperPlates"],substituteId:null,attachmentCard:null,m1:null,
    demoImage:null,correctedGuide:null,videoResource:null,youtubeQuery:null,
    weightEntry:{mode:"total",label:"Total plate weight across both sides",help:"Enter the combined plate weight from both sides. Do not include the 33 lb Smith bar; the app adds it separately."},
    engagementTarget:"chest",firstExposureRirRange:[3,4],progressionRirRange:[2,3],chestActivation:true,
    chestSetup:{title:"Chest Setup",instructions:["Position the flat bench so the Smith bar lowers toward the lower-to-middle chest.","Plant both feet firmly on the floor.","Pull the shoulder blades back and down and keep them pinned to the bench.","Keep the chest slightly elevated.","Grip the bar so the forearms are approximately vertical at the bottom.","Keep the elbows approximately 45–60 degrees away from the torso.","Lower the bar under control toward the lower-to-middle chest.","Press upward while thinking about bringing the upper arms toward each other using the chest.","Do not shrug the shoulders forward at the top.","Stop the set with the prescribed number of clean reps remaining."],cue:"Don’t just push the bar away. Think about bringing your upper arms toward each other with your chest."}
  });
}

function lowInclineDumbbellPressExercise(){
  return cloneExerciseByName("Cable Chest Press",{
    name:"Low-Incline Dumbbell Press",type:"strength",sets:3,reps:10,rest:90,
    muscles:"Upper chest, triceps and front shoulders",
    setup:["Set the Gator bench to a low 15–30 degree incline","Use one matching dumbbell in each hand","Plant both feet firmly and keep the shoulder blades back and down"],
    steps:["Begin with the dumbbells slightly outside the upper chest.","Keep the forearms vertical and elbows 45–60 degrees from the torso.","Press the dumbbells upward and slightly inward.","Finish above the upper chest without touching or clanging the weights.","Lower under control without letting the shoulders roll forward."],
    cues:["Press up and slightly inward.","Squeeze the upper arms toward each other.","Keep the bench low enough to emphasize the chest."],
    why:"Uses a low incline and independent dumbbells to improve upper-chest engagement without turning the movement into a shoulder press.",
    weightRecommendation:"Begin conservatively with an owned matching pair and target 2–3 reps in reserve while chest engagement remains the priority.",
    requires:["dumbbells","bench"],substituteId:null,attachmentCard:null,m1:null,
    demoImage:null,correctedGuide:null,videoResource:null,youtubeQuery:null,
    weightEntry:{mode:"total",paired:true,label:"Combined dumbbell weight",help:"Enter the combined weight of both dumbbells. Example: two 20 lb dumbbells = 40 lb total."},
    engagementTarget:"upper chest",progressionRirRange:[2,3],chestActivation:true,
    chestSetup:{title:"Upper Chest Setup",instructions:["Set the bench to approximately 15–30 degrees.","Plant both feet firmly.","Pull the shoulder blades back and down.","Keep the chest elevated without excessively arching the lower back.","Lower the dumbbells slightly outside the upper chest.","Keep the elbows approximately 45–60 degrees from the torso.","Press the dumbbells upward and slightly inward.","Finish with the dumbbells above the upper chest.","Do not aggressively touch or clang the dumbbells together.","Keep the shoulders from rolling forward at the top."],cue:"Press up and slightly inward while squeezing the upper arms toward each other."}
  });
}

function gmwdConvergingChestPressExercise(){
  return cloneExerciseByName("Cable Chest Press",{
    name:"GMWD Converging Chest Press",type:"strength",sets:3,reps:"10–12",rest:90,
    muscles:"Chest, triceps and anterior delts",
    setup:["Lie back with the shoulder blades gently retracted and kept against the pad","Adjust the seat or body position so the handles begin around mid-chest level","Load the same plate weight on both independent arms","Keep the elbows slightly below shoulder level"],
    steps:["Brace against the pad and begin with the chest engaged.","Press both independent arms forward and inward along the converging path.","Stop just short of an aggressive elbow lockout and briefly squeeze the chest.","Lower for 2–3 seconds while keeping the shoulder blades against the pad.","Repeat with clean, controlled motion and equal effort from both arms."],
    cues:["Press forward and inward.","Keep the elbows slightly below the shoulders.","Use a 2–3 second lowering phase.","Prioritize pec engagement over load."],
    why:"Adds an independent-arm, plate-loaded press to Full Body B so the chest can work through a stable converging path without repeating the Smith or dumbbell press used on the other strength days.",
    weightRecommendation:"For the first three exposures, choose a conservative plate load and prioritize clean reps and pec engagement. If the front delts or triceps dominate, retain the load and adjust the seat, handle height and shoulder-blade position before progressing.",
    requires:["gmwdConvergingChestPress","bumperPlates"],substituteId:null,attachmentCard:null,m1:null,
    demoImage:null,correctedGuide:null,videoResource:null,youtubeQuery:null,
    weightEntry:{mode:"perSide",label:"Weight per side",help:"Enter the plate weight loaded on ONE side. The app doubles it to calculate total external load. No machine-arm weight is assumed."},
    engagementTarget:"chest",progressionRirRange:[2,3],minimumProgressionExposures:3,chestActivation:true,
    chestSetup:{title:"Chest Setup",instructions:["Lie back with the shoulder blades gently retracted and kept against the pad.","Adjust the seat or body position so the handles begin around mid-chest level.","Keep the elbows slightly below shoulder level.","Press the independent arms forward and inward along the converging path.","Avoid aggressive lockout.","Control the lowering phase for 2–3 seconds.","Briefly squeeze the chest at the end of the press.","Prioritize chest engagement over load."],cue:"Press forward and inward with the pecs while the shoulder blades stay gently pinned to the pad."}
  });
}

/* Retained for legacy history, progression references, and future library access.
   This definition is intentionally not scheduled by the current Foundation plan. */
function legacyInclineCablePressExercise(){
  return cloneExerciseByName("Cable Chest Press",{
    name:"Incline Cable Press",sets:3,reps:10,rest:90,muscles:"Upper chest, front shoulders and triceps",
    setup:["Set both pulleys to a low position","Use two D-handles","Set the bench to a low incline and center it between the cables","Sit facing away from the M1"],
    steps:["Bring one handle beside each side of your upper chest.","Brace against the inclined bench.","Press upward and slightly inward.","Stop before locking the elbows.","Lower slowly to the starting position."],
    cues:["Keep shoulders down against the bench.","Use equal weight on both stacks.","Do not overarch your lower back."],
    requires:["ritfitM1","bench"],demoImage:"assets/phase2/incline-cable-press.jpg"
  });
}

function fullBodyAWorkout(){
  return data.map(ex=>{
    if(ex.name==="Cable Chest Press")return smithMachineBenchPressExercise();
    if(ex.name==="Seated Cable Row")return cloneExerciseByName("Seated Cable Row",{
      setup:ex.setup.map(item=>item.includes("close-grip row handle")?"Attachment: rotating close-grip double-D row handle":item),
      m1:Object.assign({},ex.m1,{attachment:"Rotating close-grip double-D row handle on one low cable"}),
      attachmentCard:{key:"rowHandle",name:"Rotating close-grip double-D row handle",qty:1}
    });
    return ex;
  });
}

function dumbbellAccessoryForDay(dayIndex){
  const shared={
    type:"strength",sets:2,rest:60,requires:["dumbbells"],substituteId:null,
    weightEntry:{mode:"total",paired:true,label:"Combined dumbbell weight",help:"Enter the combined weight of both dumbbells. Available pairs are 10, 15, 20 and 25 lb per hand."}
  };
  if(dayIndex===0)return Object.assign(cloneExerciseByName("Arm Circles"),shared,{
    name:"Dumbbell Lateral Raise",reps:12,muscles:"Side shoulders and upper-body stability",
    setup:["Use both 10 lb dumbbells","Stand tall with weights beside your thighs","Keep a soft bend in the elbows"],
    steps:["Brace your trunk and keep your shoulders down.","Raise both dumbbells out to the sides to a controlled height.","Stop at or below shoulder level without shrugging.","Lower slowly to your thighs."],
    cues:["Lead with the elbows.","Do not swing.","Use a lower range if 10 lb challenges control."],
    why:"Adds a small amount of direct shoulder work using the available dumbbells.",
    weightRecommendation:"Use the two 10 lb dumbbells. Stop the set before shrugging or swinging begins.",
    demoImage:"assets/exercise-library/original/dumbbell-lateral-raise-animation.gif"
  });
  if(dayIndex===2)return Object.assign(cloneExerciseByName("Cable Chest Press"),shared,{
    name:"Dumbbell Floor Press",reps:12,muscles:"Chest, front shoulders and triceps",
    setup:["Use the 10 or 15 lb dumbbells","Lie on your back with knees bent and feet flat","Hold one dumbbell in each hand with elbows resting lightly on the floor"],
    steps:["Brace your ribs and keep wrists stacked above elbows.","Press both dumbbells upward until the arms are nearly straight.","Pause without letting the weights collide.","Lower slowly until the upper arms touch the floor."],
    cues:["Keep shoulders down.","Do not bounce the elbows.","Use 10 lb first; move to 15 lb only with full control."],
    why:"Adds stable free-weight pressing without requiring another machine setup.",
    weightRecommendation:"Begin with two 10 lb dumbbells. Use two 15 lb dumbbells only if every repetition remains smooth.",
    demoImage:"assets/exercise-library/original/dumbbell-floor-press-animation.gif"
  });
  if(dayIndex===4)return Object.assign(cloneExerciseByName("Hip Hinge"),shared,{
    name:"Dumbbell Romanian Deadlift",reps:12,muscles:"Hamstrings, glutes, upper back and grip",
    setup:["Use both 15 lb dumbbells","Stand with feet hip width and weights in front of the thighs","Keep knees soft and spine long"],
    steps:["Brace your trunk and push your hips backward.","Lower the dumbbells close to your legs until the hamstrings feel loaded.","Stop before your back rounds.","Drive the hips forward and stand tall without leaning back."],
    cues:["This is a hinge, not a squat.","Keep the dumbbells close.","Move slowly through the lowering phase."],
    why:"Adds a controlled free-weight hinge using the available 15 lb dumbbells.",
    weightRecommendation:"Use both 15 lb dumbbells for 30 lb combined. Reduce range before sacrificing position.",
    demoImage:"assets/exercise-library/original/dumbbell-romanian-deadlift-animation.gif"
  });
  return null;
}

function armAccessoryForDay(dayIndex){
  if(dayIndex!==0)return null;
  return Object.assign(cloneExerciseByName("Cable Curl"),{
    name:"Alternating Dumbbell Curl",
    type:"strength",
    sets:2,
    reps:"10-12",
    rest:60,
    muscles:"Biceps, brachialis and forearms",
    setup:["Begin with the owned 10 lb dumbbell pair","Stand tall with one dumbbell in each hand","Keep the elbows beside the ribs and shoulders relaxed"],
    steps:["Curl one dumbbell toward the shoulder while the other arm stays long.","Rotate the working palm naturally toward the shoulder.","Keep the elbow pinned and torso still.","Lower under control, then repeat on the other side."],
    cues:["Alternate arms without rushing.","Do not swing or lean back.","Keep the wrists straight."],
    why:"Adds free-weight biceps work while preserving the existing cable-curl stimulus.",
    weightRecommendation:"Begin with the two 10 lb dumbbells. Progress only through the owned 15, 20 and 25 lb pairs when every repetition stays controlled.",
    requires:["dumbbells"],
    substituteId:null,
    attachmentCard:null,
    m1:null,
    weightEntry:{mode:"total",paired:true,label:"Combined dumbbell weight",help:"Enter the combined weight of both dumbbells. Available pairs are 10, 15, 20 and 25 lb per hand."},
    demoImage:"assets/exercise-library/generated/alternating-dumbbell-curl-motion-guide.webp"
  });
}

function fullBodyBWorkout(useLegacyChest=false,includeVBar=true,useGmwdChest=true){
  const smithWeightEntry={
    mode:"total",
    label:"Total plate weight across both sides",
    help:"Add together the plates on both sides. Do not include the 33 lb Smith bar; the calculator adds it for you."
  };
  return [
    cloneExerciseByName("Treadmill Walk"),
    cloneExerciseByName("Hip Hinge"),
    cloneExerciseByName("Goblet Squat",{
      name:"Smith Machine RDL",sets:3,reps:10,
      muscles:"Hamstrings, glutes, upper back and core",
      setup:["Set the Smith bar around mid-thigh height","Set safety stops below the lowest controlled position","Stand with feet hip width and the bar close to your thighs"],
      steps:["Unlock the bar and stand tall with soft knees.","Brace your core and push your hips backward.","Lower the bar close to your legs until your hamstrings are loaded.","Drive your hips forward to stand without leaning back.","Re-rack the bar securely after the set."],
      cues:["Move from the hips, not the waist.","Keep the bar close.","Stop before your back rounds."],
      rest:90,
      why:"Adds the week’s primary loaded hinge to train the hamstrings and glutes without repeating Monday’s squat emphasis.",
      weightRecommendation:"Begin with the empty Smith bar and add weight only when every rep stays controlled.",
      requires:["ritfitM1"],substituteId:null,
      demoImage:"assets/phase2/smith-machine-rdl.jpg",weightEntry:smithWeightEntry
    }),
    cloneExerciseByName("Goblet Squat",{
      name:"Smith Machine Single-Leg Squat",sets:2,reps:10,
      muscles:"Quads, glutes, hamstrings and core",
      setup:["Stand inside the Smith cage facing forward","Set the bar across the upper back at a comfortable unrack height","Plant one working foot slightly in front of the bar path","Bend the non-working leg so its foot hovers behind you","Set the safety stops for a controlled single-leg depth"],
      steps:["Unrack with the working foot fully planted and the other foot lifted behind you.","Lower under control on the planted leg while the rear foot remains unsupported.","Keep the working knee tracking with the toes and the heel flat.","Drive through the planted foot to stand without pushing from the rear leg.","Re-rack securely, then repeat on the other side."],
      cues:["Face forward for the entire set.","No bench and no rear-foot support.","Keep the free foot hovering.","Use a short, stable range first."],
      rest:90,
      why:"Provides supported unilateral leg work without requiring a bench or assistance from the non-working leg.",
      weightRecommendation:"Practice the balance and depth with the empty Smith bar before adding plates.",
      requires:["ritfitM1"],substituteId:null,
      demoImage:"assets/exercise-library/generated/smith-bulgarian-split-squat-motion-guide.webp",weightEntry:smithWeightEntry
    }),
    cloneExerciseByName("Goblet Squat",{
      name:"Smith Machine Calf Raise",sets:2,reps:15,
      muscles:"Calves and ankle stability",
      setup:["Set the Smith bar around shoulder height","Stand with the balls of both feet planted securely","Keep knees soft and torso tall"],
      steps:["Unrack the bar and brace your trunk.","Rise onto the balls of your feet.","Pause briefly at the top.","Lower your heels slowly through a comfortable range.","Re-rack securely after the set."],
      cues:["Move straight up and down.","Do not bounce.","Keep pressure even across both feet."],
      rest:60,
      why:"Adds direct calf training that is not emphasized in Full Body A.",
      weightRecommendation:"Use the empty Smith bar until balance and range are consistent.",
      requires:["ritfitM1"],substituteId:null,
      demoImage:"assets/phase2/smith-machine-calf-raise.jpg",weightEntry:smithWeightEntry
    }),
    useLegacyChest?legacyInclineCablePressExercise():useGmwdChest?gmwdConvergingChestPressExercise():lowInclineDumbbellPressExercise(),
    cloneExerciseByName("Seated Cable Row",{
      name:"Single Arm Cable Row",sets:3,reps:10,
      muscles:"Lats, mid-back, rear shoulder, biceps and core",
      setup:["Set one pulley to the lowest position","Attach one D-handle","Use a staggered or half-kneeling stance facing the M1"],
      steps:["Begin with the working arm long and shoulder down.","Brace your torso against rotation.","Pull the handle toward the lower ribs.","Pause without leaning backward.","Return slowly, then complete the opposite side."],
      cues:["Keep hips and shoulders square.","Lead with the elbow.","Use the same weight on both sides."],
      m1:{pinLeft:1,pinRight:null,attachment:"One D-handle",bench:"No bench required",facing:"Face the M1",stance:"Staggered or half-kneeling stance",start:"Working arm long with torso square",finish:"Handle beside the lower ribs",view:"Front-side view",pinNote:"Use one pulley at position 1."},
      why:"Adds unilateral horizontal pulling to expose and reduce side-to-side strength differences.",
      requires:["ritfitM1"],attachmentCard:{key:"dHandles",name:"One D-handle",qty:1},
      weightEntry:{mode:"single",label:"Weight selected on the active stack",help:"Enter the selector setting on the single stack used for this exercise."},
      demoImage:"assets/phase2/single-arm-cable-row.jpg"
    }),
    cloneExerciseByName("Lat Pulldown"),
    ...(includeVBar?[cloneExerciseByName("Rope Triceps Pushdown",{
      name:"V-Bar Triceps Pushdown",sets:2,reps:12,
      muscles:"Triceps and elbow stability",
      setup:["Set one front-post pulley to the highest position","Attach the angled V-bar by its centered cable eye","Stand facing the M1 with a stable tall stance"],
      steps:["Grip the textured handles with palms facing inward.","Pin both elbows beside your ribs with the forearms bent.","Press the V-bar down until the arms are nearly straight.","Pause without shrugging, then return slowly while the elbows stay fixed."],
      cues:["Keep the elbows pinned.","Use the centered cable connection.","Do not swing or lean over the bar."],
      m1:{pinLeft:13,pinRight:null,attachment:"Angled V-bar on one high cable",bench:"No bench",facing:"Face the M1",stance:"Tall stable stance with ribs stacked",start:"V-bar near the lower chest with elbows beside the ribs",finish:"Handles beside the upper thighs with arms nearly straight",view:"Front-side view",pinNote:"Use one front-post pulley at position 13."},
      why:"Adds direct triceps work to Full Body B using the newly available angled V-bar without removing any existing movement.",
      weightRecommendation:"Begin with a light selector setting that keeps the upper arms still for every repetition.",
      requires:["ritfitM1"],attachmentCard:{key:"vBar",name:"Angled V-bar pressdown attachment",qty:1},
      weightEntry:{mode:"single",label:"Weight selected on the active stack",help:"Enter the selector setting on the one high cable stack used for this exercise."},
      demoImage:"assets/exercise-library/generated/v-bar-triceps-pushdown-motion-guide.webp"
    })]:[]),
    cloneExerciseByName("Cable Shoulder Press",{
      name:"Cable Lateral Raise",sets:2,reps:12,
      muscles:"Side shoulders and upper-body stability",
      setup:["Set one pulley to the lowest position","Attach one D-handle","Stand side-on to the M1 with the working arm away from the stack"],
      steps:["Begin with the handle in front of the opposite hip.","Keep a soft bend in the elbow.","Raise the arm out to the side to about shoulder height.","Pause without shrugging.","Lower slowly and repeat on the other side."],
      cues:["Lead with the elbow.","Keep the shoulder away from the ear.","Use a light weight."],
      m1:{pinLeft:1,pinRight:null,attachment:"One D-handle",bench:"No bench",facing:"Stand side-on to the M1",stance:"Tall stance with ribs stacked",start:"Handle near the opposite hip",finish:"Arm raised to about shoulder height",view:"Front view",pinNote:"Use one pulley at position 1."},
      why:"Complements Monday’s vertical press with direct side-shoulder work and less triceps fatigue.",
      requires:["ritfitM1"],attachmentCard:{key:"dHandles",name:"One D-handle",qty:1},
      weightEntry:{mode:"single",label:"Weight selected on the active stack",help:"Enter the selector setting on the single stack used for this exercise."},
      correctedGuide:null,demoImage:"assets/phase2/cable-lateral-raise.jpg"
    }),
    cloneExerciseByName("Rope Triceps Pushdown",{
      name:"Cable Crunch",sets:2,reps:12,
      muscles:"Abdominals and deep core",
      setup:["Set one pulley to the highest position","Attach the rope","Kneel facing the M1 with the rope beside your head"],
      steps:["Brace before beginning the repetition.","Curl your ribs toward your pelvis.","Keep your hips mostly still.","Pause when the abdominals are shortened.","Return slowly without letting the stack pull you upright."],
      cues:["Move through the trunk, not the arms.","Do not sit back toward your heels.","Use a controlled range."],
      m1:{pinLeft:13,pinRight:null,attachment:"Rope on one high cable",bench:"No bench",facing:"Kneel facing the M1",stance:"Kneeling with hips stable",start:"Rope beside the head and torso tall",finish:"Ribs curled toward the pelvis",view:"Side view",pinNote:"Use one pulley at position 13."},
      why:"Adds direct trunk flexion and bracing work that supports every major lift.",
      weightRecommendation:"Use a light load that allows the abdominals—not the arms—to control every repetition.",
      demoImage:"assets/phase2/cable-crunch.jpg"
    }),
    cloneExerciseByName("Cable Curl",{
      name:"Cable Hammer Curl",sets:2,reps:12,
      muscles:"Biceps, brachialis and forearms",
      setup:["Set one pulley to the lowest position","Attach the rope","Face the M1 and hold the rope with palms facing each other"],
      steps:["Stand tall with elbows beside your ribs.","Curl the rope toward the shoulders without changing grip.","Pause while keeping wrists neutral.","Lower slowly until the arms are nearly straight."],
      cues:["Keep a neutral grip throughout.","Do not swing.","Keep elbows pinned."],
      m1:{pinLeft:1,pinRight:null,attachment:"Rope on one low cable",bench:"No bench",facing:"Face the M1",stance:"Tall stance with elbows close",start:"Neutral grip with arms nearly straight",finish:"Rope ends near the shoulders",view:"Front-side view",pinNote:"Use one pulley at position 1."},
      why:"Uses a neutral grip to complement Monday’s underhand cable curl and add forearm work.",
      attachmentCard:{key:"rope",name:"Triceps rope",qty:1},
      correctedGuide:null,demoImage:"assets/phase2/cable-hammer-curl.jpg"
    }),
    cloneExerciseByName("Easy Treadmill Cooldown")
  ];
}

function smithMachineHipThrustExercise(){
  return cloneExerciseByName("Goblet Squat",{
    name:"Smith Machine Hip Thrust",type:"strength",sets:3,reps:10,rest:90,
    muscles:"Glutes, hamstrings and core",
    setup:["Place the flat bench completely outside the front opening of the Smith cage","Position your shoulder blades across the bench with your legs extending into the cage","Wrap the Smith barbell pad securely around the center of the bar","Plant both feet inside the cage about hip width apart","Center the padded bar across the hip crease and set the safety stops just below your controlled bottom position"],
    steps:["Brace your abdomen and hold the padded bar lightly near each hip.","Lower the hips under control while keeping both feet planted.","Drive through the heels and squeeze the glutes to raise the hips.","Finish when the shoulders, hips and knees form one straight line without arching the lower back.","Lower smoothly, then re-rack the Smith bar securely after the set."],
    cues:["Bench outside; feet face into the cage.","Keep the pad centered over the hip crease.","Drive with the glutes, not the lower back.","Keep the chin gently tucked and ribs down."],
    why:"Adds direct hip-extension strength for the glutes while the Smith rails and padded bar provide a stable, repeatable loading path.",
    weightRecommendation:"First exposure: use the padded empty 33 lb Smith bar for three controlled sets of ten. Add matched plates only after the setup, lockout and re-rack all feel secure.",
    requires:["ritfitM1","bench","bumperPlates"],substituteId:null,m1:null,
    attachmentCard:{key:"smithBarPad",name:"Smith barbell pad",qty:1},
    weightEntry:{mode:"total",label:"Total plate weight across both sides",help:"Enter the combined plate weight from both sides. Do not include the 33 lb Smith bar; the app adds it separately."},
    correctedGuide:null,demoImage:"assets/exercise-library/generated/smith-machine-hip-thrust-motion-guide.webp"
  });
}

function behindBackCableCurlExercise(){
  return cloneExerciseByName("Cable Curl",{
    name:"Behind-the-Back Single-Arm Cable Curl",sets:2,reps:"12-15",
    muscles:"Biceps, brachialis and forearms",
    setup:["Set one front-post pulley to the lowest position","Attach one D-handle","Stand outside the cage with your back to the active post","Take one small step forward into a staggered stance"],
    steps:["Hold the handle in the working hand with the palm facing forward.","Let the upper arm trail slightly behind the torso while maintaining cable tension.","Keep the elbow fixed behind the body and curl the handle toward the shoulder.","Pause briefly, then lower slowly before switching arms."],
    cues:["Face away from the machine.","Keep the elbow behind the torso.","Use a light load and no body swing."],
    m1:{pinLeft:1,pinRight:null,attachment:"One D-handle",bench:"No bench",facing:"Face away from the active front post",stance:"Staggered stance one small step forward",start:"Working arm nearly straight just behind the hip",finish:"Curl the handle toward the shoulder while the elbow stays behind the torso",view:"Strict side view",pinNote:"Use one front-post pulley at position 1."},
    why:"Adds a lengthened-position biceps movement without replacing Friday's existing pulling or arm work.",
    weightRecommendation:"Start with the lightest practical selector setting and keep the shoulder and torso completely still.",
    requires:["ritfitM1"],attachmentCard:{key:"dHandles",name:"One D-handle",qty:1},
    weightEntry:{mode:"single",label:"Weight selected on the active stack",help:"Enter the selector setting on the one low cable stack used for this exercise."},
    correctedGuide:null,demoImage:"assets/exercise-library/generated/behind-the-back-single-arm-cable-curl-motion-guide.webp"
  });
}

function seatedConcentrationCurlExercise(){
  return cloneExerciseByName("Cable Curl",{
    name:"Seated Concentration Curl",type:"strength",sets:2,reps:"10-15",rest:60,
    unilateral:true,muscles:"Biceps, brachialis and forearm flexors",
    setup:["Sit near the front of a stable bench with both feet planted","Hold one dumbbell in the working hand","Brace the working elbow against the inside of the same-side thigh","Keep the wrist neutral and the upper arm fixed"],
    steps:["Begin with the arm nearly straight without locking the elbow.","Curl the single dumbbell toward the shoulder while the upper arm stays still.","Pause and squeeze the biceps without twisting the wrist.","Lower for two to three seconds, then complete the other arm."],
    cues:["One dumbbell; complete the prescribed reps per arm.","Keep the elbow braced against the inner thigh.","No torso swing.","Control the lowering phase and focus on the squeeze."],
    why:"Preserves Friday's direct biceps volume with a strict single-dumbbell movement that limits torso momentum.",
    weightRecommendation:"Use one owned dumbbell that allows 10 to 15 clean reps per arm with 2 to 3 reps in reserve.",
    targetRirRange:[2,3],progressionModel:"double-progression",requires:["dumbbells","bench"],substituteId:null,attachmentCard:null,m1:null,
    weightEntry:{mode:"total",paired:false,label:"One dumbbell weight",help:"Enter the weight of the single dumbbell used. Complete the listed repetitions per arm; do not combine both arms."},
    correctedGuide:null,demoImage:"assets/exercise-library/generated/seated-concentration-curl-guide.png"
  });
}

function fullBodyCWorkout(includeHipThrust=true,includeLowInclinePress=true,useConcentrationCurl=true){
  const hipThrust=includeHipThrust?[smithMachineHipThrustExercise()]:[];
  return [
    cloneExerciseByName("Treadmill Walk"),
    cloneExerciseByName("Hip Hinge"),
    Object.assign(deepCopy(window.SUBSTITUTION_DATA["smith-machine-squat"]),{
      sets:3,
      reps:8,
      why:"Keeps one primary squat in the week’s third strength session while using the stable Smith setup and safety stops.",
      weightRecommendation:"Start with the empty Smith bar and add plates only when all eight reps remain smooth and controlled."
    }),
    ...hipThrust,
    ...(includeLowInclinePress?[lowInclineDumbbellPressExercise()]:[]),
    cloneExerciseByName("Cable Shoulder Press"),
    cloneExerciseByName("Cable Shoulder Press",{
      name:"Rear Delt Cable Fly",sets:2,reps:12,
      muscles:"Rear shoulders, upper back and shoulder stabilizers",
      setup:["Set both pulleys around shoulder height","Attach two D-handles","Stand centered and face the M1","Take the opposite handle in each hand"],
      steps:["Begin with arms reaching forward and slightly crossed.","Keep a soft bend in both elbows.","Open the arms until they align with your torso.","Pause while squeezing the upper back.","Return slowly without letting the stacks slam."],
      cues:["Lead with the elbows.","Keep shoulders down.","Use a light, controlled load."],
      m1:{pinLeft:7,pinRight:7,attachment:"Two single D-handles",bench:"No bench",facing:"Face the M1",stance:"Tall centered stance",start:"Arms forward and slightly crossed",finish:"Arms open in line with the torso",view:"Front view",pinNote:"Set both pulleys around position 7."},
      why:"Trains the rear shoulders and upper back to balance the week’s pressing volume.",
      weightRecommendation:"Use the same light setting on both stacks and stop before the shoulders shrug.",
      requires:["ritfitM1"],attachmentCard:{key:"dHandles",name:"Two D-handles",qty:2},
      weightEntry:{mode:"dual",label:"Weight selected on each stack",help:"Enter the selector setting on ONE stack. Keep both stacks equal."},
      correctedGuide:null,demoImage:"assets/phase2/rear-delt-cable-fly.jpg"
    }),
    cloneExerciseByName("Rope Triceps Pushdown",{
      name:"Cable Face Pull",sets:2,reps:12,
      muscles:"Upper back, rear shoulders and external rotators",
      setup:["Set one pulley to the highest position","Attach the rope","Stand facing the M1 with a stable stance"],
      steps:["Begin with arms extended and thumbs pointing toward each other.","Pull the rope toward eye level.","Separate the rope ends as the elbows travel outward.","Pause with shoulder blades gently squeezed.","Return under control."],
      cues:["Pull toward the face, not the chest.","Do not lean backward.","Keep shoulders away from ears."],
      m1:{pinLeft:13,pinRight:null,attachment:"Rope on one high cable",bench:"No bench",facing:"Face the M1",stance:"Stable tall stance",start:"Arms extended at eye level",finish:"Rope beside the face with elbows open",view:"Front-side view",pinNote:"Use one pulley at position 13."},
      why:"Adds shoulder-health pulling and upper-posterior-chain work after the primary press.",
      weightRecommendation:"Choose a light setting that allows rotation and a clean pause without leaning.",
      demoImage:"assets/phase2/cable-face-pull.jpg"
    }),
    cloneExerciseByName("Lat Pulldown",{
      name:"Cable Straight Arm Pushdown",sets:3,reps:12,
      muscles:"Lats, upper back, triceps and core",
      setup:["Set one pulley to the highest position","Attach the short straight bar","Stand facing the M1 with arms extended"],
      steps:["Brace your ribs over your hips.","Keep a small fixed bend in the elbows.","Sweep the bar down toward the thighs.","Pause while tightening the lats.","Return slowly until the arms are overhead."],
      cues:["Keep the arms nearly straight.","Do not turn it into a triceps pushdown.","Avoid arching the lower back."],
      m1:{pinLeft:13,pinRight:null,attachment:"Short straight bar on one high cable",bench:"No bench",facing:"Face the M1",stance:"Tall stance with soft knees",start:"Arms extended overhead",finish:"Bar near the thighs",view:"Side view",pinNote:"Use one pulley at position 13."},
      why:"Provides Friday’s primary vertical pull without repeating the standard pulldown used in Full Body A and B.",
      weightRecommendation:"Use a moderate setting that lets the lats control the entire return.",
      requires:["ritfitM1"],attachmentCard:{key:"straightBar",name:"Short straight bar",qty:1},
      weightEntry:{mode:"single",label:"Weight selected on the active stack",help:"Enter the selector setting on the single high stack."},
      demoImage:"assets/phase2/cable-straight-arm-pushdown.jpg"
    }),
    cloneExerciseByName("Rope Triceps Pushdown"),
    useConcentrationCurl?seatedConcentrationCurlExercise():behindBackCableCurlExercise(),
    cloneExerciseByName("Rope Triceps Pushdown",{
      name:"High to Low Cable Chop",sets:2,reps:10,
      muscles:"Obliques, abdominals, shoulders and hips",
      setup:["Set one pulley near the highest position","Attach one D-handle","Stand side-on to the M1 with feet wider than hips"],
      steps:["Hold the handle with both hands near the high shoulder.","Brace before starting the movement.","Pull diagonally across the body toward the opposite hip.","Rotate through the upper back while keeping the knees stable.","Return slowly and complete the other side."],
      cues:["Move as one controlled unit.","Do not let the stack pull you back.","Use the same range on both sides."],
      m1:{pinLeft:12,pinRight:null,attachment:"One D-handle",bench:"No bench",facing:"Stand side-on to the M1",stance:"Wide stable stance",start:"Hands beside the high shoulder",finish:"Hands beside the opposite hip",view:"Front-side view",pinNote:"Use one pulley near position 12."},
      why:"Adds rotational core training to complement Wednesday’s straight-ahead cable crunch.",
      weightRecommendation:"Use a light setting that allows the trunk to control both directions.",
      requires:["ritfitM1"],attachmentCard:{key:"dHandles",name:"One D-handle",qty:1},
      weightEntry:{mode:"single",label:"Weight selected on the active stack",help:"Enter the selector setting on the single stack used for this exercise."},
      demoImage:"assets/phase2/high-to-low-cable-chop.jpg"
    }),
    cloneExerciseByName("Treadmill Walk",{
      name:"Treadmill HIIT Intervals",type:"cardio",duration:"12:00",
      muscles:"Cardiovascular conditioning, legs and work capacity",
      setup:["Begin with the belt at an easy walking pace","Alternate one minute brisk with one minute easy","Use speed or incline—not both—to raise effort"],
      steps:["Walk easily for the first minute.","Increase to a brisk controlled effort for one minute.","Return to an easy pace for one minute.","Repeat the brisk and easy pattern, then reduce speed before stopping."],
      cues:["Stay below an all-out sprint.","Use the rails only for balance.","Reduce intensity if form changes."],
      why:"Finishes the third strength day with a short conditioning dose without extending the lifting volume.",
      demoImage:"assets/phase3/treadmill-hiit-intervals.jpg"
    }),
    cloneExerciseByName("Easy Treadmill Cooldown")
  ];
}

function strengthWorkoutForDay(dayIndex){
  const activeSession=!!state.currentSession&&!state.currentSession.completedId&&state.currentSession.planDay===dayIndex;
  const preservePreChestDefinition=activeSession&&!state.currentSession.programRevision;
  const compatibleRevisions=[LEGACY_FOUNDATION_PROGRAM_REVISION,PREVIOUS_FOUNDATION_PROGRAM_REVISION,GMWD_FOUNDATION_PROGRAM_REVISION,FOUNDATION_PROGRAM_REVISION];
  const includeCurrentAttachments=!activeSession||compatibleRevisions.includes(state.currentSession.programRevision);
  const includeHipThrust=!activeSession||[PREVIOUS_FOUNDATION_PROGRAM_REVISION,GMWD_FOUNDATION_PROGRAM_REVISION,FOUNDATION_PROGRAM_REVISION].includes(state.currentSession.programRevision);
  const useGmwdChest=!activeSession||[GMWD_FOUNDATION_PROGRAM_REVISION,FOUNDATION_PROGRAM_REVISION].includes(state.currentSession.programRevision);
  const useConcentrationCurl=!activeSession||state.currentSession.programRevision===FOUNDATION_PROGRAM_REVISION;
  const baseWorkout=dayIndex===0?(preservePreChestDefinition?data:fullBodyAWorkout()):dayIndex===2?fullBodyBWorkout(preservePreChestDefinition,includeCurrentAttachments,useGmwdChest):dayIndex===4?fullBodyCWorkout(includeHipThrust,useGmwdChest,useConcentrationCurl):data;
  const dumbbellAccessory=dumbbellAccessoryForDay(dayIndex);
  const armAccessory=armAccessoryForDay(dayIndex);
  const workoutData=[...baseWorkout,...[dumbbellAccessory,armAccessory].filter(Boolean)];
  const group=ex=>{
    if(ex.type==="cooldown")return 7;
    if(dayIndex===4&&ex.name==="Treadmill HIIT Intervals")return 6;
    return setupGroup(ex);
  };
  return workoutData.map(resolveExercise).filter(ex=>!ex.unavailable).map((ex,index)=>({ex,index}))
    .sort((a,b)=>group(a.ex)-group(b.ex)||a.index-b.index).map(x=>x.ex);
}

function workoutForDay(dayIndex=currentPlanIndex()){
  let workoutData;
  if(dayIndex===1)workoutData=cardioMobilityWorkout();
  else if(dayIndex===3)workoutData=coreRecoveryWorkout();
  else if(dayIndex===5)workoutData=zone2CardioWorkout();
  else if(dayIndex===6)workoutData=[];
  else workoutData=strengthWorkoutForDay(dayIndex);
  return window.ROAD12_ADAPTIVE.applyRecommendation(workoutData);
}

function activeWorkout(){
  const sessionDay=Number.isInteger(state.currentSession?.planDay)
    ?state.currentSession.planDay
    :currentPlanIndex();
  return workoutForDay(sessionDay);
}

function startNewSession(dayIndex=currentPlanIndex(),selectedSchedule=null){
 ensureWorkoutSchedule();
 const todayKey=localDateKey();
 const todaySchedule=selectedSchedule||state.workoutSessions
   .filter(item=>item.scheduledDate===todayKey&&item.status!=="restDay")
   .sort((a,b)=>(a.status==="rescheduled"?-1:1)-(b.status==="rescheduled"?-1:1))[0];
 const isRecovered=!!selectedSchedule&&selectedSchedule.scheduledDate<todayKey;
 const sessionDay=Number.isInteger(todaySchedule?.planDay)?todaySchedule.planDay:dayIndex;
 const plan=weekPlan[sessionDay];
 const sessionPrescriptions=window.ROAD12_PRESCRIPTIONS.capture(workoutForDay(sessionDay).filter(ex=>ex.type==="strength"),state.approvedProgressions,name=>window.ROAD12_EXERCISES.resolve(name));
 if(todaySchedule&&!isRecovered&&todaySchedule.status!=="rescheduled")todaySchedule.status="inProgress";
 state.logs={};
 state.exerciseFeedback={};
 state.cardioTimers={};
 state.exerciseTimings={};
 state.currentSession={
   id:`session-${Date.now()}`,
   name:selectedSchedule?.name||plan.title,
   planDay:sessionDay,
   startedAt:new Date().toISOString(),
   dateKey:todayKey,
   scheduleId:todaySchedule?.id||null,
   recoveredWorkout:isRecovered,
   plannedDate:isRecovered?selectedSchedule.plannedDate:null,
   originalScheduledDate:isRecovered?selectedSchedule.scheduledDate:null,
   trainingPhase:deepCopy(state.trainingPhase),
   programRevision:FOUNDATION_PROGRAM_REVISION,
   equipment:deepCopy(state.equipment),
   sessionPrescriptions
 };
  state.step=0;
  state.setupReady=false;
  save();
}

function selectedWorkoutSessionForToday(currentSession,today){
 return currentSession
   &&currentSession.dateKey===today
   &&!currentSession.completedId
   &&Number.isInteger(currentSession.planDay)
   ?currentSession
   :null;
}
function completedScheduleIds(history=[]){
 return new Set(history.map(item=>item.scheduleId).filter(Boolean));
}
function isCompletedScheduleSession(session,history=[]){
 return !!session&&(session.status==="completed"||completedScheduleIds(history).has(session.id));
}
function nextHomeWorkoutSession(sessions,history,today,excludeId=null){
 return sessions
   .filter(item=>item.id!==excludeId
     &&item.scheduledDate>=today
     &&item.status!=="restDay"
     &&!isCompletedScheduleSession(item,history))
   .sort((a,b)=>a.scheduledDate.localeCompare(b.scheduledDate)||(a.plannedDate||a.scheduledDate).localeCompare(b.plannedDate||b.scheduledDate))[0]||null;
}
function workoutLanding(){
 syncSelectedDayToCalendar();
 const todayKey=localDateKey();
 const selectedSession=selectedWorkoutSessionForToday(state.currentSession,todayKey);
 const resumableSession=!!selectedSession
   &&state.step>0
   &&state.step<=activeWorkout().length
   &&hasActualWorkoutProgress();
 const dayIndex=selectedSession
   ?selectedSession.planDay
   :currentPlanIndex();
 const plan=weekPlan[dayIndex];
 const workoutData=workoutForDay(dayIndex);
 const hasActive=resumableSession;
 const linkedSchedule=selectedSession?.scheduleId?state.workoutSessions.find(item=>item.id===selectedSession.scheduleId):null;
 const isStartingEarly=!!linkedSchedule&&linkedSchedule.scheduledDate>todayKey;

  if(plan.action==="progress"){
    app.innerHTML=`<section class="card workout-launch-card">
      <span class="pill">RECOVERY DAY</span>
      <h2>${plan.title}</h2>
      <p>${plan.detail}</p>
      <button class="primary" id="openSundayProgress">Open Progress</button>
    </section>`;
    document.querySelector("#openSundayProgress").onclick=()=>setTab("progress");
    return;
  }

  app.innerHTML=`<section class="card workout-launch-card">
    <span class="pill">${hasActive?"WORKOUT IN PROGRESS":isStartingEarly?"STARTING EARLY":"TODAY’S WORKOUT"}</span>
    <h2>${hasActive?`Resume ${plan.title}`:plan.title}</h2>
    <p>${hasActive
      ?`You are on step ${state.step} of ${activeWorkout().length}.`
      :`${plan.detail}. Start when you are ready and move through it one step at a time.`}</p>
    <div class="launch-summary">
      <div><small>STEPS</small><strong>${workoutData.length}</strong></div>
      <div><small>ESTIMATED TIME</small><strong>${plan.time}</strong></div>
      <div><small>FOCUS</small><strong>${plan.focus}</strong></div>
    </div>
    <button class="primary" id="launchWorkout">${hasActive?"Resume workout":"Start workout"}</button>
    ${hasActive?`<button class="secondary" id="restartWorkout">Restart today’s workout</button>`:""}
  </section>`;

  document.querySelector("#launchWorkout").onclick=()=>{
    if(!selectedSession)startNewSession(dayIndex);
    state.tab="workout";
    save();
    workout();
  };

  document.querySelector("#restartWorkout")?.addEventListener("click",()=>{
    if(confirm(`Restart ${plan.title} from the beginning?`)){
      startNewSession(dayIndex);
      state.tab="workout";
      save();
      workout();
    }
  });
}

/* =========================================================
   VERSION 13.2 / V4.2 — FLEXIBLE WORKOUT RECOVERY
   plannedDate is immutable after creation; only scheduledDate moves.
   ========================================================= */
const V42_STATUS={
 completed:{icon:"🟢",label:"Completed",description:"Workout finished and saved."},
 scheduled:{icon:"🔵",label:"Scheduled",description:"Workout is planned for this date."},
 inProgress:{icon:"🟡",label:"In Progress",description:"Workout has started but is not finished."},
 rescheduled:{icon:"🟠",label:"Rescheduled",description:"Workout moved from its original planned date."},
 missed:{icon:"⚫",label:"Missed",description:"Workout was not completed on its scheduled date."},
 restDay:{icon:"🟣",label:"Rest Day",description:"Protected recovery day; shifting workouts will not remove it."}
};
const V42_TYPES={
 strength:{icon:"💪",label:"Strength",description:"Resistance training for strength and muscle."},
 cardio:{icon:"❤️",label:"Cardio",description:"Steady aerobic training for heart health and endurance."},
 mobility:{icon:"🧘",label:"Mobility",description:"Mobility and movement-quality work."},
 conditioning:{icon:"🏃",label:"Conditioning",description:"Higher-intensity work-capacity training."},
 recovery:{icon:"😴",label:"Recovery",description:"Low-intensity recovery and check-in work."},
 rest:{icon:"—",label:"No Workout",description:"A full rest day with no scheduled workout."}
};
const V42_REASONS={travel:"Travel",busy:"Busy",recovery:"Recovery",illness:"Illness",other:"Other"};

function parseDateKey(key){
 const [year,month,day]=key.split("-").map(Number);
 return new Date(year,month-1,day,12);
}
function dateKeyFromParts(year,month,day){
 return `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}
function addCalendarDays(key,amount){
 const date=parseDateKey(key);
 date.setDate(date.getDate()+amount);
 return localDateKey(date);
}
function planIndexForDate(date){
 return (date.getDay()+6)%7;
}
function workoutTypeForPlan(index){
 if([0,2,4].includes(index))return "strength";
 if([1,5].includes(index))return "cardio";
 if(index===3)return "mobility";
 if(index===6)return "recovery";
 return "recovery";
}
function ensureWorkoutSchedule(){
 const today=parseDateKey(localDateKey());
 const start=parseDateKey(state.scheduleActivatedDate);
 const end=new Date(today);end.setDate(end.getDate()+240);
 const known=new Set(state.workoutSessions.map(item=>item.id));
 for(let date=new Date(start);date<=end;date.setDate(date.getDate()+1)){
   const key=localDateKey(date);
   const planDay=planIndexForDate(date);
   const id=`planned-${key}`;
   if(known.has(id))continue;
   const type=workoutTypeForPlan(planDay);
   state.workoutSessions.push({
     id,
     plannedDate:key,
     scheduledDate:key,
     planDay,
     name:weekPlan[planDay].title,
     workoutType:type,
     status:planDay===6?"restDay":key<localDateKey()?"missed":"scheduled"
   });
 }
 state.history.forEach(historyItem=>{
   const key=historyItem.dateKey||(historyItem.completedAt?localDateKey(new Date(historyItem.completedAt)):null);
   if(!key||known.has(`planned-${key}`))return;
   const planDay=planIndexForDate(parseDateKey(key));
   state.workoutSessions.push({
     id:`planned-${key}`,plannedDate:key,scheduledDate:key,planDay,
     name:historyItem.name||weekPlan[planDay].title,
     workoutType:workoutTypeForPlan(planDay),status:"completed"
   });
   known.add(`planned-${key}`);
 });
 state.history.forEach(historyItem=>{
   if(!historyItem.scheduleId)return;
   const scheduled=state.workoutSessions.find(item=>item.id===historyItem.scheduleId);
   if(!scheduled)return;
   scheduled.status="completed";
   scheduled.completedDate=historyItem.completedDate||historyItem.actualCompletionDate||historyItem.dateKey||(historyItem.completedAt?localDateKey(new Date(historyItem.completedAt)):null);
   scheduled.actualCompletionDate=scheduled.completedDate;
 });
 const completedKeys=new Set(state.history
   .filter(item=>!item.scheduleId)
   .map(item=>item.dateKey||(item.completedAt?localDateKey(new Date(item.completedAt)):null))
   .filter(Boolean));
 state.workoutSessions.forEach(item=>{
   if(completedKeys.has(item.scheduledDate)&&item.status!=="rescheduled")item.status="completed";
   if(item.planDay===6)item.status="restDay";
 });
}
function sessionsForDate(key){
 ensureWorkoutSchedule();
 return state.workoutSessions
   .filter(item=>item.scheduledDate===key)
   .sort((a,b)=>a.plannedDate.localeCompare(b.plannedDate));
}
let v42DialogReturnFocus=null;
function closeV42Dialog(){
 const overlay=document.querySelector("#v42Dialog");
 if(!overlay||overlay.classList.contains("hidden"))return;
 overlay.classList.add("hidden");
 document.querySelector(".shell")?.removeAttribute("inert");
 if(v42DialogReturnFocus?.isConnected)v42DialogReturnFocus.focus();
 v42DialogReturnFocus=null;
}
function v42Dialog(content,label="Dialog",options={}){
 let overlay=document.querySelector("#v42Dialog");
 if(!overlay){
   overlay=document.createElement("div");
   overlay.id="v42Dialog";
   overlay.className="v42-dialog hidden";
   overlay.setAttribute("role","dialog");
   overlay.setAttribute("aria-modal","true");
   document.body.appendChild(overlay);
 }
 if(overlay.classList.contains("hidden"))v42DialogReturnFocus=document.activeElement;
 const labelledContent=content.replace(
   /<h2(?=[ >])/,
   '<h2 id="v42DialogTitle" tabindex="-1"'
 );
 if(labelledContent.includes('id="v42DialogTitle"')){
   overlay.setAttribute("aria-labelledby","v42DialogTitle");
   overlay.removeAttribute("aria-label");
 }else{
   overlay.setAttribute("aria-label",label);
   overlay.removeAttribute("aria-labelledby");
 }
 overlay.innerHTML=`<div class="v42-dialog-card">${labelledContent}${options.showClose===false?"":'<button class="secondary v42-close" type="button">Close</button>'}</div>`;
 overlay.classList.remove("hidden");
 document.querySelector(".shell")?.setAttribute("inert","");
 const closeButton=overlay.querySelector(".v42-close");
 if(closeButton)closeButton.onclick=closeV42Dialog;
 overlay.onclick=event=>{if(event.target===overlay)closeV42Dialog()};
 overlay.onkeydown=event=>{
   if(event.key==="Escape"){
     event.preventDefault();
     closeV42Dialog();
   }
 };
 requestAnimationFrame(()=>overlay.querySelector("#v42DialogTitle")?.focus());
 return overlay;
}
function explainCalendarItem(kind,key){
 const item=(kind==="status"?V42_STATUS:V42_TYPES)[key];
 v42Dialog(`<span class="legend-dialog-icon">${item.icon}</span><h2>${item.label}</h2><p>${item.description}</p>`,item.label);
}
function calendar(){
 ensureWorkoutSchedule();
 const base=state.calendarMonth?parseDateKey(`${state.calendarMonth}-01`):new Date();
 const year=base.getFullYear(),month=base.getMonth();
 const first=new Date(year,month,1),lastDay=new Date(year,month+1,0).getDate();
 const leading=first.getDay();
 const monthKey=`${year}-${String(month+1).padStart(2,"0")}`;
 state.calendarMonth=monthKey;
 const cells=Array.from({length:leading},()=>`<span class="calendar-empty"></span>`);
 for(let day=1;day<=lastDay;day++){
   const key=dateKeyFromParts(year,month+1,day);
   const entries=sessionsForDate(key);
   const primary=entries.find(item=>item.status!=="restDay")||entries[0];
   const count=entries.filter(item=>item.status!=="restDay").length;
   cells.push(`<button class="calendar-day ${primary?`status-${primary.status}`:""} ${key===localDateKey()?"today":""}" data-calendar-day="${key}" aria-label="${parseDateKey(key).toLocaleDateString(undefined,{month:"long",day:"numeric"})}, ${primary?`${V42_STATUS[primary.status].label}, ${V42_TYPES[primary.workoutType].label}`:"No workout"}">
     <strong>${day}</strong>
     <span title="${primary?V42_STATUS[primary.status].label:"No workout"}">${primary?V42_STATUS[primary.status].icon:""}</span>
     <span title="${primary?V42_TYPES[primary.workoutType].label:"No workout"}">${primary?V42_TYPES[primary.workoutType].icon:""}</span>
     ${count>1?`<small>+${count-1}</small>`:""}
   </button>`);
 }
 app.innerHTML=`<section class="card calendar-card">
   <span class="pill">WORKOUT CALENDAR</span>
   <div class="calendar-heading"><button class="calendar-arrow" id="previousMonth" aria-label="Previous month">‹</button><h2>${first.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h2><button class="calendar-arrow" id="nextMonth" aria-label="Next month">›</button></div>
   <div class="calendar-weekdays">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day=>`<span>${day}</span>`).join("")}</div>
   <div class="calendar-grid">${cells.join("")}</div>
 </section>
 <section class="card calendar-legend" aria-label="Calendar legend">
   <h2>Legend</h2>
   <h3>Workout Status</h3>
   <div class="legend-grid">${Object.entries(V42_STATUS).map(([key,item])=>`<button data-legend-kind="status" data-legend-key="${key}"><span>${item.icon}</span>${item.label}</button>`).join("")}</div>
   <h3>Workout Types</h3>
   <div class="legend-grid">${Object.entries(V42_TYPES).filter(([key])=>key!=="rest").map(([key,item])=>`<button data-legend-kind="type" data-legend-key="${key}"><span>${item.icon}</span>${item.label}</button>`).join("")}</div>
 </section>`;
 document.querySelector("#previousMonth").onclick=()=>{base.setMonth(month-1);state.calendarMonth=localDateKey(base).slice(0,7);save();calendar()};
 document.querySelector("#nextMonth").onclick=()=>{base.setMonth(month+1);state.calendarMonth=localDateKey(base).slice(0,7);save();calendar()};
 document.querySelectorAll("[data-calendar-day]").forEach(button=>button.onclick=()=>openCalendarDay(button.dataset.calendarDay));
 document.querySelectorAll("[data-legend-kind]").forEach(button=>button.onclick=()=>explainCalendarItem(button.dataset.legendKind,button.dataset.legendKey));
 save();
}
function openCalendarDay(key){
 const entries=sessionsForDate(key);
 const todayKey=localDateKey();
 const isIncomplete=item=>!["completed","restDay"].includes(item.status);
 const isPastIncomplete=item=>item.scheduledDate<todayKey&&isIncomplete(item);
 const isStartable=item=>item.scheduledDate<=todayKey&&isIncomplete(item);
 const dateLabel=parseDateKey(key).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
 v42Dialog(`<span class="pill">${dateLabel}</span><h2>Workout Details</h2>
   <div class="calendar-detail-list">${entries.map(item=>`<article>
     <div class="calendar-detail-title"><span>${V42_TYPES[item.workoutType].icon}</span><div><strong>${item.name}</strong><small>${V42_STATUS[item.status].icon} ${V42_STATUS[item.status].label}</small></div></div>
     ${isStartable(item)?`<div class="recovery-workout-facts">
       <div><small>WORKOUT TYPE</small><strong>${V42_TYPES[item.workoutType].icon} ${V42_TYPES[item.workoutType].label}</strong></div>
       <div><small>SCHEDULED DATE</small><strong>${parseDateKey(item.scheduledDate).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</strong></div>
     </div>`:""}
     ${item.plannedDate!==item.scheduledDate?`<p>Originally planned for ${parseDateKey(item.plannedDate).toLocaleDateString()}.</p>`:""}
     ${item.reason?`<p>Reason: ${V42_REASONS[item.reason]}</p>`:""}
     ${isStartable(item)?`<div class="recovery-actions"><button class="primary" data-start-calendar-workout="${item.id}">Start Workout</button>${isPastIncomplete(item)?`<button class="secondary" data-reschedule-recovery="${item.id}">Reschedule</button>`:""}</div>`:""}
   </article>`).join("")}</div>`,dateLabel);
 document.querySelectorAll("[data-start-calendar-workout]").forEach(button=>button.onclick=()=>{
   const session=state.workoutSessions.find(item=>item.id===button.dataset.startCalendarWorkout);
   if(!session)return;
   const alreadyActive=state.currentSession?.scheduleId===session.id&&state.currentSession.dateKey===todayKey;
   if(!alreadyActive)startNewSession(session.planDay,session);
   closeV42Dialog();
   state.tab="workout";
   save();
   workout();
 });
 document.querySelectorAll("[data-reschedule-recovery]").forEach(button=>button.onclick=()=>openWorkoutReschedule(button.dataset.rescheduleRecovery));
}
function applyWorkoutReschedule(session,targetDate){
 const moved=window.ROAD12_SCHEDULING.rescheduleWorkout(
   state.workoutSessions,
   session.id,
   targetDate,
   localDateKey()
 );
 if(!moved){
   alert("Choose an available training date. Completed workouts and protected rest days cannot be moved.");
   return;
 }
 save();
 closeV42Dialog();
 calendar();
}
function openWorkoutReschedule(id){
 const session=state.workoutSessions.find(item=>item.id===id);
 if(!session)return;
 const today=localDateKey(),tomorrow=addCalendarDays(today,1);
 const dialog=v42Dialog(`<span class="pill">RESCHEDULE</span><h2>Move ${session.name}</h2>
   <p>Choose when to place this workout. Later sessions shift forward only when needed.</p>
   <div class="choice-list">
     <button class="choice-button" data-reschedule-date="${today}"><strong>Move to Today</strong><small>${parseDateKey(today).toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"})}</small></button>
     <button class="choice-button" data-reschedule-date="${tomorrow}"><strong>Move to Tomorrow</strong><small>${parseDateKey(tomorrow).toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"})}</small></button>
     <button class="choice-button" id="chooseRescheduleDate"><strong>Choose Date…</strong><small>Select another available training date.</small></button>
   </div>`,`${session.name} reschedule`);
 dialog.querySelectorAll("[data-reschedule-date]").forEach(button=>button.onclick=()=>applyWorkoutReschedule(session,button.dataset.rescheduleDate));
 dialog.querySelector("#chooseRescheduleDate").onclick=()=>openWorkoutDatePicker(session.id);
}
function openWorkoutDatePicker(id){
 const session=state.workoutSessions.find(item=>item.id===id);
 if(!session)return;
 const minimum=localDateKey();
 const dialog=v42Dialog(`<span class="pill">CHOOSE DATE</span><h2>Move ${session.name}</h2>
   <label class="field-label">New scheduled date<input id="recoveryScheduledDate" type="date" min="${minimum}" value="${addCalendarDays(minimum,1)}"></label>
   <button class="primary" id="confirmRecoveryDate">Reschedule Workout</button>`,`${session.name} date`);
 dialog.querySelector("#confirmRecoveryDate").onclick=()=>applyWorkoutReschedule(session,dialog.querySelector("#recoveryScheduledDate").value);
}
function v42Metrics(){
 ensureWorkoutSchedule();
 const relevant=state.workoutSessions.filter(item=>{const plannedDate=item.plannedDate||item.scheduledDate;return item.status!=="restDay"&&["completed","missed"].includes(item.status)&&plannedDate<=localDateKey()&&plannedDate>=state.adherenceBaselineDate;});
 const adherence=window.ROAD12_SCHEDULING.programAdherence(state.workoutSessions,localDateKey(),state.adherenceBaselineDate);
 const recent=state.workoutSessions.filter(item=>item.status!=="restDay"&&item.scheduledDate<=localDateKey()&&item.scheduledDate>=addCalendarDays(localDateKey(),-7));
 const recovery=Math.max(0,Math.min(100,100-recent.filter(item=>item.status==="missed").length*15));
 let streak=0;
 for(const item of relevant.slice().sort((a,b)=>b.scheduledDate.localeCompare(a.scheduledDate))){
   if(item.status==="completed")streak++;
   else if(item.status==="missed")break;
 }
 return {streak,adherence,recovery,total:state.history.length};
}
function coachRecommendationMarkup(){
 ensureWorkoutSchedule();
 const missed=state.workoutSessions.filter(item=>item.status==="missed"&&!item.coachDismissedAt).sort((a,b)=>b.scheduledDate.localeCompare(a.scheduledDate))[0];
 if(!missed)return "";
 const today=sessionsForDate(localDateKey()).find(item=>item.status!=="restDay");
 return `<section class="card coach-recommendation"><span class="pill">COACH RECOMMENDATION</span><h2>Get back on sequence</h2><p>You missed <strong>${missed.name}</strong>${missed.reason?` due to ${V42_REASONS[missed.reason].toLowerCase()}`:""}.</p><div class="recommendation-box"><small>RECOMMENDED</small><strong>Complete ${missed.name} today.</strong><span>${today?.name||"Today’s workout"} will move to the next training day.</span></div><div class="impact-line"><span>Estimated impact</span><strong>Minimal</strong></div><button class="primary" data-coach-recover="${missed.id}">Review recovery options</button><button class="secondary" data-coach-leave-missed="${missed.id}">Leave missed & continue plan</button><p class="muted">This keeps the workout marked Missed in Calendar and continues with your current schedule.</p></section>`;
}
function confirmLeaveMissedWorkout(id){
 const session=state.workoutSessions.find(item=>item.id===id&&item.status==="missed");
 if(!session)return;
 const dialog=v42Dialog(`<span class="pill">CONTINUE PLAN</span><h2>Leave ${session.name} missed?</h2><p>This workout will stay visible in Calendar as Missed. Your next scheduled workout will not move, and you can still open the missed workout from Calendar later.</p><button class="primary" id="confirmLeaveMissed">Leave missed & continue</button>`,`${session.name} missed workout choice`);
 dialog.querySelector("#confirmLeaveMissed").onclick=()=>{
   session.coachDismissedAt=new Date().toISOString();
   session.coachDisposition="leaveMissed";
   save();closeV42Dialog();home();
 };
}
const v42BaseHome=home;
home=function(){
 v42BaseHome();
 const recommendation=coachRecommendationMarkup();
 const todayRescheduled=sessionsForDate(localDateKey()).find(item=>item.status==="rescheduled");
 if(todayRescheduled){
   const moved=state.workoutSessions.find(item=>item.plannedDate===localDateKey()&&item.id!==todayRescheduled.id);
   const rescheduledMarkup=`<section class="card today-rescheduled"><span class="pill">SCHEDULE UPDATE</span><h2>${todayRescheduled.name}</h2><p>Rescheduled from ${parseDateKey(todayRescheduled.plannedDate).toLocaleDateString(undefined,{weekday:"long"})}.</p>${moved?`<small>Today’s ${moved.name.toLowerCase()} moved to ${parseDateKey(moved.scheduledDate).toLocaleDateString(undefined,{weekday:"long"})}.</small>`:""}</section>`;
   const commandWeek=app.querySelector(".command-week");
   if(commandWeek)commandWeek.insertAdjacentHTML("afterend",rescheduledMarkup);
   else app.insertAdjacentHTML("afterbegin",rescheduledMarkup);
 }
 if(recommendation){
   const metrics=app.querySelector(".home-command-metrics");
   if(metrics)metrics.insertAdjacentHTML("beforebegin",recommendation);
   else app.insertAdjacentHTML("beforeend",recommendation);
 }
 document.querySelectorAll("[data-coach-recover]").forEach(button=>button.onclick=()=>{
   const session=state.workoutSessions.find(item=>item.id===button.dataset.coachRecover);
   if(session)openCalendarDay(session.scheduledDate);
 });
 document.querySelectorAll("[data-coach-leave-missed]").forEach(button=>button.onclick=()=>confirmLeaveMissedWorkout(button.dataset.coachLeaveMissed));
};
const v42BaseProgress=progress;
progress=function(){
 v42BaseProgress();
 if(state.historyView)return;
 const metrics=v42Metrics();
 app.insertAdjacentHTML("afterbegin",`<section class="card training-metrics"><span class="pill">TRAINING PROGRESS</span><h2>Consistency & recovery</h2><div class="metric-grid">
   <div><small>TRAINING STREAK</small><strong>${metrics.streak}</strong><span>sessions</span></div>
   <div><small>PROGRAM ADHERENCE</small><strong>${metrics.adherence}%</strong><span>completed</span></div>
   <div><small>RECOVERY SCORE</small><strong>${metrics.recovery}</strong><span>out of 100</span></div>
   <div><small>TOTAL SESSIONS</small><strong>${metrics.total}</strong><span>saved</span></div>
 </div></section>`);
};
const v42BaseExercise=exercise;
exercise=function(ex,workoutData=activeWorkout()){
 v42BaseExercise(ex,workoutData);
 window.ROAD12_WORKOUT_NAVIGATION.restoreWorkoutScroll(
   state,
   options=>window.scrollTo(options),
   callback=>requestAnimationFrame(callback)
 );
};
const v42BaseSetTab=setTab;
setTab=function(tab){
 if(state.tab==="workout"&&tab!=="workout"){
   window.ROAD12_WORKOUT_NAVIGATION.captureWorkoutScroll(state,window.scrollY);
   save();
 }
 v42BaseSetTab(tab);
};

migrateHistory();
recoverV1131History();
repairFalseActiveWorkout();
syncSelectedDayToCalendar();
save();

/* =========================================================
   ROAD TO 12% — VERSION 11.3.2 LAUNCH AND NAVIGATION REPAIR
   ========================================================= */
(function repairV112LaunchState(){
 const migrationKey="road12-v11-2-launch-repaired";
 /* A fresh launch always opens Calendar on the device's current month.
    In-session previous/next navigation remains intact until the app reloads. */
 state.calendarMonth=localDateKey().slice(0,7);
 if(!localStorage.getItem(migrationKey)){
   state.tab="home";
   state.setupReady=false;
   state.previewDay=null;
   localStorage.setItem(migrationKey,"1");
   save();
 }else{
   /* Every fresh app launch should begin at Home.
      An active workout remains saved and can be resumed from Workout. */
   state.tab="home";
   save();
 }
})();

(function handleStravaOauthReturn(){
 const params=new URLSearchParams(location.search);
 if(!params.has("strava"))return;
 state.tab="equipment";
 save();
 history.replaceState(null,"",`${location.pathname}${location.hash||""}`);
})();

if("serviceWorker" in navigator){
 window.addEventListener("load",async()=>{
   try{
     const hadController=!!navigator.serviceWorker.controller;
     let refreshing=false;
     navigator.serviceWorker.addEventListener("controllerchange",()=>{
       if(hadController&&!refreshing){
         refreshing=true;
         location.reload();
       }
     });
     const registration=await navigator.serviceWorker.register(`./sw.js?build=${APP_META.build}`,{scope:"./",updateViaCache:"none"});
     await registration.update();
     const readyRegistration=await navigator.serviceWorker.ready;
     (readyRegistration.active||registration.active)?.postMessage({type:"CACHE_EXERCISE_MEDIA"});
   }catch(error){
     console.warn("Road to 12% service worker was not available.",error);
   }
 });
}

render();
