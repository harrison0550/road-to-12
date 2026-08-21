
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
 "Smith Machine Calf Raise":"assets/phase2/smith-machine-calf-raise.jpg",
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
const ROAD12_SCHEMA_VERSION=13;
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
  return {load,write,remove};
})();
const state=road12Storage.load();
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
state.cardioHistory=Array.isArray(state.cardioHistory)?state.cardioHistory:[];
state.cardioTimers=state.cardioTimers&&typeof state.cardioTimers==="object"?state.cardioTimers:{};
state.exerciseFeedback=state.exerciseFeedback&&typeof state.exerciseFeedback==="object"?state.exerciseFeedback:{};
state.approvedProgressions=state.approvedProgressions&&typeof state.approvedProgressions==="object"?state.approvedProgressions:{};
state.equipment=Object.assign({
  ritfitM1:true,
  bench:true,
  treadmill:true,
  rower:true,
  kickrCore:true,
  bumperPlates:true,
  dumbbells:true,
  dumbbellPairWeights:[10,15,20,25],
  kettlebells:false,
  olympicBarbell:false
},state.equipment||{});
const weekPlan=[
 {short:"MON",icon:"🏋️",title:"Full Body A",detail:"Guided strength • chest, back, quads and shoulders",action:"workout",time:"55–65 min",focus:"Full-body strength",items:["Treadmill warm-up","Mobility","Smith Machine Squat","Cable Shoulder Press","Cable Curl","Cable Chest Press","Seated Cable Row","Lat Pulldown","Rope Triceps Pushdown","Dumbbell Lateral Raise","Treadmill cooldown"],setup:"Smith and cable stations → 10 lb dumbbells"},
 {short:"TUE",icon:"🚶",title:"Cardio + Mobility",detail:"Incline treadmill, rowing technique and mobility recovery",action:"cardio",time:"45–50 min",focus:"Recovery, rowing skill and aerobic base",items:["5-minute easy treadmill warm-up","20–25 minute incline walk at conversational pace","8-minute easy iFIT rowing technique","Hip flexor stretch","Hamstring stretch","Chest and shoulder mobility","Easy cooldown"],setup:"Treadmill → iFIT rower → floor/wall mobility"},
 {short:"WED",icon:"💪",title:"Full Body B",detail:"Alternate guided full-body strength session",action:"upcoming",time:"55–65 min",focus:"Back, legs, chest and arms",items:["Treadmill warm-up","Hip hinge mobility","Smith Machine RDL","Smith Bulgarian Split Squat","Smith Machine Calf Raise","Incline Cable Press","Single Arm Cable Row","Lat Pulldown","Cable Lateral Raise","Cable Crunch","Cable Hammer Curl","Dumbbell Floor Press","Cooldown"],setup:"Smith and cable stations → 10–15 lb dumbbells"},
 {short:"THU",icon:"🧘",title:"Core + Recovery",detail:"Core training, stretching and easy movement",action:"recovery",time:"25–35 min",focus:"Core control and mobility",items:["Easy walk or row","Dead bug","Bird dog","Side plank from knees","Hip mobility","Upper-back mobility","Slow breathing cooldown"],setup:"Floor space; optional treadmill or rower"},
 {short:"FRI",icon:"🏋️",title:"Full Body C",detail:"Third weekly guided full-body strength session",action:"upcoming",time:"55–65 min",focus:"Legs, pushing, pulling and arms",items:["Treadmill warm-up","Hip hinge mobility","Smith Machine Squat","Cable Shoulder Press","Rear Delt Cable Fly","Cable Face Pull","Cable Straight Arm Pushdown","Rope Triceps Pushdown","High to Low Cable Chop","Dumbbell Romanian Deadlift","Treadmill HIIT Intervals","Cooldown"],setup:"Smith and cable stations → 15 lb dumbbells → treadmill"},
 {short:"SAT",icon:"❤️",title:"Zone 2 Cardio",detail:"Longer easy bike, rower or treadmill session",action:"cardio",time:"35–50 min",focus:"Fat-loss supporting aerobic work",items:["5-minute easy warm-up","25–40 minutes at a pace where you can speak in sentences","5-minute cooldown","Light stretching"],setup:"Choose treadmill, rower or KICKR CORE"},
 {short:"SUN",icon:"📏",title:"Recovery + Check-in",detail:"Rest, measurements and weekly review",action:"progress",time:"10–20 min",focus:"Recovery and progress review",items:["Morning body weight","Waist measurement","Optional progress photos","Review completed workouts","Plan the coming week","Full rest or gentle walk"],setup:"No gym setup required"}
];
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
      weight:Number(set?.weight)||0,
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
function measurementTrend(days,field){const cutoff=Date.now()-days*86400000,items=state.measurementHistory.filter(item=>Number(item[field])>0&&new Date(item.recordedAt||item.date).getTime()>=cutoff).sort((a,b)=>new Date(a.recordedAt||a.date)-new Date(b.recordedAt||b.date));if(items.length<2)return null;return {change:Number((Number(items.at(-1)[field])-Number(items[0][field])).toFixed(1)),count:items.length};}
function strengthTrend(){const sessions=state.history.filter(item=>/Full Body [ABC]/.test(item.name||"")).slice(-6);if(sessions.length<2)return null;const first=sessionTotals(sessions[0]).selectedVolume,last=sessionTotals(sessions.at(-1)).selectedVolume;return first?Math.round((last-first)/first*100):null;}
function sessionTotals(session){
  const exercises=session.exercises||[];
  let completedSets=0,totalReps=0,selectedVolume=0;
  exercises.forEach(ex=>(ex.sets||[]).forEach(s=>{
    if(s?.done)completedSets++;
    const reps=Number(s?.reps)||0, weight=Number(s?.weight)||0;
    totalReps+=s?.done?reps:0;
    if(s?.done)selectedVolume+=weight*reps*(ex.weightEntry?.mode==="dual"?2:1);
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
  const values = ex.type==="strength"
    ? [
        ["Target",`${ex.sets} × ${ex.reps}`],
        ["Rest",`${ex.rest} sec`],
        ["Focus","Controlled form"]
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

function lastCompletedWeight(ex){
 const match=state.history.slice().reverse().map(session=>({
   session,
   exercise:(session.exercises||[]).find(item=>item.name===ex.name)
 })).find(item=>item.exercise&&(item.exercise.sets||[]).some(set=>set?.done&&set.weight!==""&&set.weight!==undefined));
 if(!match)return null;
 const completedSets=match.exercise.sets.filter(set=>set?.done&&set.weight!==""&&set.weight!==undefined);
 const weight=Number(completedSets[completedSets.length-1].weight);
 if(!Number.isFinite(weight))return null;
 const mode=match.exercise.weightEntry?.mode||ex.weightEntry?.mode;
 const isSmith=ex.name.includes("Smith")&&mode==="total";
 const label=isSmith
   ?`${weight} lb plates total (${weight+SMITH_BAR_WEIGHT_LB} lb working weight)`
   :mode==="dual"?`${weight} lb per stack`:`${weight} lb`;
 return {label,date:v1131DateLabel(match.session)};
}

function sets(ex){
 const entry=ex.weightEntry||{mode:"total",label:"Weight used",help:"Enter the weight used for this set."};
 const isSmithAddedWeight=ex.name.includes("Smith")&&entry.mode==="total";
 const displayedLabel=isSmithAddedWeight?"Total Plates — Both Sides":entry.label;
 const previous=lastCompletedWeight(ex);
 const feedback=state.exerciseFeedback[ex.name]||{rir:"",form:"",discomfort:false};
 const captured=window.ROAD12_PRESCRIPTIONS.forExercise(state.currentSession,ex,name=>window.ROAD12_EXERCISES.resolve(name));
 const target=window.ROAD12_PRESCRIPTIONS.effective(state.currentSession,ex,name=>window.ROAD12_EXERCISES.resolve(name));
 return `<section class="card timer-card"><h3>${target.sets} sets × ${target.reps} reps</h3>
 ${captured?`<div class="approved-prescription"><small>PRESCRIBED FOR THIS SESSION · ${captured.action}</small><strong>${captured.prescription.summary||`${target.sets} sets × ${target.reps} reps${target.weight!=null?` at ${target.weight} ${target.weightUnit}`:""}`}</strong><span>Record what you actually perform below. You can override any target.</span></div>`:""}<div class="weight-entry-explainer"><span>${entry.mode==="dual"?"↔️":entry.mode==="single"?"1️⃣":"🏋️"}</span><div><strong>${displayedLabel}</strong><p>${entry.help}</p>${previous?`<small class="previous-weight">Last completed: <b>${previous.label}</b> on ${previous.date}</small>`:'<small class="previous-weight">No previous completed weight yet.</small>'}${entry.mode==="dual"?`<small>Example: left 20 lb + right 20 lb → enter <b>20</b>; combined selected stack weight is 40 lb.</small>`:""}</div></div>
 <div class="set-table-head"><span>SET</span><span>${entry.mode==="dual"?"LB / STACK":isSmithAddedWeight?"PLATES TOTAL":"WEIGHT LB"}</span><span>REPS</span><span>DONE</span></div>
 ${state.logs[ex.name].map((v,i)=>`<div class="set-row"><strong>${i+1}</strong><input data-w="${i}" inputmode="decimal" placeholder="${target.weight!=null?target.weight:entry.mode==="dual"?"per stack":isSmithAddedWeight?"both sides":"lb"}" aria-label="${displayedLabel}, set ${i+1}" value="${v?.weight||""}"><input data-r="${i}" inputmode="numeric" value="${v?.reps||window.ROAD12_PRESCRIPTIONS.minimumReps(target.reps)}"><button data-d="${i}" class="${v?.done?"done":""}" aria-label="${v?.done?"Mark set incomplete":"Mark set complete"}">${v?.done?"✓":"○"}</button>${entry.mode==="dual"&&v?.weight?`<small class="combined-weight">Combined selected: ${Number(v.weight)*2} lb</small>`:""}</div>`).join("")}
 <div class="exercise-feedback"><div><small>QUICK EXERCISE FEEDBACK</small><strong>Help tune the next session</strong></div><label>Reps left in reserve<select id="exerciseRir"><option value="">Choose</option>${[0,1,2,3,4].map(value=>`<option value="${value}" ${String(feedback.rir)===String(value)?"selected":""}>${value===4?"4+":value}</option>`).join("")}</select></label><label>Form quality<select id="exerciseForm"><option value="">Choose</option><option ${feedback.form==="Clean"?"selected":""}>Clean</option><option ${feedback.form==="Breaking down"?"selected":""}>Breaking down</option></select></label><label class="feedback-check"><input id="exerciseDiscomfort" type="checkbox" ${feedback.discomfort?"checked":""}><span>Pain or discomfort was present</span></label><p>If pain is sharp, worsening, or unusual, stop the movement. This feedback can recommend a deload but does not diagnose an injury.</p></div>
 <div class="timer" id="timer" role="status" aria-live="polite">Rest ${String(Math.floor(ex.rest/60)).padStart(2,"0")}:${String(ex.rest%60).padStart(2,"0")}</div><div class="rest-coach-message" id="restCoach">Recover and prepare for your next set.</div><div class="timer-controls"><button class="secondary" id="rest">Start rest timer</button><button class="secondary" id="stopTimer">Stop timer</button></div></section>`}
function captureExerciseFeedback(ex){
 const rir=document.querySelector("#exerciseRir")?.value||"";
 const form=document.querySelector("#exerciseForm")?.value||"";
 const discomfort=!!document.querySelector("#exerciseDiscomfort")?.checked;
 if(!rir&&!form&&!discomfort)return;
 state.exerciseFeedback[ex.name]={rir:rir===""?null:Number(rir),form,discomfort,recordedAt:new Date().toISOString()};
 save();
}
function timed(ex){const cardio=isMeaningfulCardioBlock(ex),runtime=state.cardioTimers[ex.name];return `<section class="card timer-card"><h3>${ex.duration}</h3>${cardio?'<p class="cardio-timer-note">The countdown is your target. When it finishes, tap <strong>Keep going</strong> to continue tracking total cardio time.</p>':""}<div class="timer" id="timer" role="status" aria-live="polite">${ex.duration.includes(":")?ex.duration:"Ready"}</div>${cardio?'<div class="cardio-total" id="cardioTotal" aria-live="polite">Total cardio: 00:00</div>':""}${ex.duration.includes(":")?`<div class="timer-controls"><button class="primary" id="rest">${runtime?.status?"Restart target":"Start timer"}</button>${cardio?'<button class="primary keep-going" id="keepGoing" hidden>Keep going</button>':""}<button class="secondary" id="stopTimer">Stop timer</button></div>`:""}</section>`}
function bindSets(ex){
 document.querySelectorAll("[data-w],[data-r]").forEach(input=>input.onchange=()=>{
   const i=Number(input.dataset.w??input.dataset.r);
   const existing=state.logs[ex.name][i]||{};
   state.logs[ex.name][i]=Object.assign({},existing,{
     startedAt:existing.startedAt||new Date().toISOString(),
     weight:document.querySelector(`[data-w="${i}"]`)?.value||"",
     reps:document.querySelector(`[data-r="${i}"]`)?.value||ex.reps
   });
   save();
 });
 document.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{
   const i=+b.dataset.d;
   const w=document.querySelector(`[data-w="${i}"]`).value;
   const r=document.querySelector(`[data-r="${i}"]`).value;
   const done=!state.logs[ex.name][i]?.done;
   const existing=state.logs[ex.name][i]||{},now=new Date().toISOString();
   state.logs[ex.name][i]=Object.assign({},existing,{weight:w,reps:r,done,startedAt:existing.startedAt||now,completedAt:done?now:null});
   save();
   b.classList.toggle("done",done);
   b.textContent=done?"✓":"○";
   b.setAttribute("aria-label",done?"Mark set incomplete":"Mark set complete");
   if(done)startTimer(ex.rest);
 });
 document.querySelector("#rest").onclick=()=>startTimer(ex.rest);
 ["#exerciseRir","#exerciseForm","#exerciseDiscomfort"].forEach(selector=>{const input=document.querySelector(selector);if(input)input.onchange=()=>captureExerciseFeedback(ex);});
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
 return window.ROAD12_ADAPTIVE.phaseReadiness({history:state.history,ratings:state.workoutRatings,sessions:state.workoutSessions,today:localDateKey(),adherenceBaselineDate:state.adherenceBaselineDate,measurements:state.measurementHistory,cardio:state.cardioHistory});
}
function phaseReadinessMarkup(readiness,compact=false){
 const quality=readiness.dataQualityItems||[];
 return `<section class="card phase-readiness-card ${compact?"compact":""}" aria-labelledby="phaseReadinessTitle"><div class="phase-readiness-heading"><div><span class="pill">FOUNDATION • PHASE 1</span><h2 id="phaseReadinessTitle">${readiness.score}% ready for Build</h2></div><strong>${readiness.locked?"Collecting data":"Review available"}</strong></div><div class="phase-readiness-track" role="progressbar" aria-label="Foundation phase readiness" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${readiness.score}"><span style="width:${readiness.score}%"></span></div><p>You're progressing toward the next training phase. Foundation A/B/C stays active while Road to 12% gathers enough quality evidence.</p>${compact?"":`<div class="readiness-quality"><div><small>READINESS DATA QUALITY</small><strong>${readiness.dataQuality}% • ${readiness.dataQualityLabel}</strong></div><div class="data-quality-grid">${quality.map(item=>`<div class="${item.ready?"ready":"collecting"}"><span>${item.ready?"✓":"…"}</span><p><strong>${item.label}</strong><small>${item.value}</small></p></div>`).join("")}</div></div><div class="readiness-reasons">${readiness.reasons.map(reason=>`<div class="${reason.status}"><span aria-hidden="true">${reason.status==="positive"?"✓":reason.status==="hold"?"!":"…"}</span><p><strong>${reason.label}</strong><small>${reason.detail}</small></p></div>`).join("")}</div><div class="phase-lock-note"><strong>Phase advancement is locked.</strong><span>No workout schedule will change until the readiness policy is mature and you explicitly accept a reviewed Phase 2 plan.</span></div>`}</section>`;
}
function exerciseProgressionRecommendations(){
 const definitions=[0,2,4].flatMap(day=>strengthWorkoutForDay(day)).filter(ex=>ex.type==="strength");
 return [...new Map(definitions.map(ex=>[ex.name,ex])).values()].map(ex=>({exercise:ex,recommendation:window.ROAD12_ADAPTIVE.exerciseRecommendation(state.history,state.workoutRatings,ex)}));
}
function approvedProgressionFor(exercise){
 return window.ROAD12_PRESCRIPTIONS.findApproval(state.approvedProgressions,exercise,name=>window.ROAD12_EXERCISES.resolve(name));
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
  ["dumbbells","🔩","Dumbbells","Available fixed pairs: 10, 15, 20 and 25 lb."],
  ["kettlebells","⚫","Kettlebells","Separate from dumbbells. Keep off when no kettlebells are available."],
  ["olympicBarbell","🏋️‍♂️","Free Olympic barbell","This refers to free-barbell work, not the M1 Smith bar."]
 ];
 const attachments=[
  ["dHandles","Two D-handles","Used for chest press and shoulder press."],
  ["straightBar","Short straight curl bar","Used for the corrected cable curl."],
  ["rope","Triceps rope","Used for rope pushdowns."],
  ["latBar","Lat pulldown bar","Used for lat pulldowns."],
  ["rowHandle","Close-grip row handle","Used for seated cable rows."]
 ];
 app.innerHTML=`<section class="card"><h2>Profile</h2><label>What should the app call you?<input id="preferredName" value="${state.preferredName}" autocomplete="given-name"></label><button class="secondary profile-save" id="saveProfile">Save name</button></section>
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
function sessionDetail(session){
 const totals=sessionTotals(session);
 const cardioBlocks=Array.isArray(session.cardioBlocks)?session.cardioBlocks:(session.cardio?[Object.assign({name:"Cardio"},session.cardio)]:[]);
 app.innerHTML=`<section class="card session-detail-header"><button class="secondary" id="historyBack">Back to history</button><div class="check small-check">✓</div><span class="pill">${session.recoveryIndicator?"RECOVERED WORKOUT":"COMPLETED WORKOUT"}</span><h2>${session.name}</h2><p class="muted">${session.date} • ${formatDuration(session.durationMs)}</p><div class="brief-grid"><div><small>SETS</small><strong>${totals.completedSets}</strong></div><div><small>REPS</small><strong>${totals.totalReps}</strong></div><div><small>SELECTED VOLUME</small><strong>${Math.round(totals.selectedVolume).toLocaleString()} lb</strong></div><div><small>STATUS</small><strong>Saved</strong></div></div>${cardioBlocks.map(block=>`<div class="recovery-note"><strong>${block.name}</strong><br>Target: ${block.plannedDurationMinutes} min • Completed: ${block.actualDurationMinutes} min${block.actualDurationMinutes>block.plannedDurationMinutes?` (+${Number((block.actualDurationMinutes-block.plannedDurationMinutes).toFixed(1))} min)`:""}${block.distance?`<br>Distance: ${block.distance}`:""}${block.averageHeartRate?` • Avg HR: ${block.averageHeartRate} bpm`:""}${block.averagePace?`<br>Avg pace: ${block.averagePace}`:""}${block.inclineResistance?` • Incline/resistance: ${block.inclineResistance}`:""}</div>`).join("")}${session.recoveryIndicator?`<div class="recovery-note"><strong>Recovery workout</strong><br>Originally planned: ${formatHistoryDateKey(session.plannedDate||session.originalScheduledDate)}<br>Completed: ${formatHistoryDateKey(session.completedDate||session.actualCompletionDate||session.dateKey)}</div>`:""}${session.recoveredFromV74?`<div class="recovery-note">This session was recovered from Version 11.3.2. Any values still held in the old workout log are shown below.</div>`:""}</section>
 <section class="card"><h2>Exercises completed</h2><div class="history-exercise-list">${(session.exercises||[]).length?(session.exercises||[]).map(ex=>`<details class="history-exercise" open><summary><span><strong>${ex.name}</strong>${ex.originalExercise?`<small>Substituted for ${ex.originalExercise}</small>`:""}</span><span>${(ex.sets||[]).filter(s=>s?.done).length} sets</span></summary><div class="history-set-head"><span>SET</span><span>${ex.weightEntry?.mode==="dual"?"LB / STACK":"WEIGHT"}</span><span>REPS</span><span>STATUS</span></div>${(ex.sets||[]).map((s,i)=>`<div class="history-set-row"><strong>${i+1}</strong><span>${s?.weight!==undefined&&s?.weight!==""?`${s.weight} lb`:"—"}${ex.weightEntry?.mode==="dual"&&s?.weight?`<small>${Number(s.weight)*2} lb combined selected</small>`:""}</span><span>${s?.reps||"—"}</span><span>${s?.done?"✓ Complete":"Not marked"}</span></div>`).join("")||'<p class="muted">No set details were stored.</p>'}<div class="history-weight-note"><strong>${ex.weightEntry?.label||"Weight used"}</strong><p>${ex.weightEntry?.help||""}</p></div></details>`).join(""):'<p class="muted">The older session record did not contain exercise details.</p>'}</div></section>
 <button class="secondary" id="repeatHistory">Repeat this workout</button>`;
 document.querySelector("#historyBack").onclick=()=>{state.historyView=null;save();progress()};
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
   const volume=done.reduce((sum,s)=>sum+(Number(s.weight)||0)*(Number(s.reps)||0)*(exercise.weightEntry?.mode==="dual"?2:1),0);
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
 const all=[...new Map([...data,...extras,...scheduled].map(ex=>[ex.name,ex])).values()];
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
     const restored=window.ROAD12_BACKUP.merge(state,validated.state);
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
 <section class="command-checkin" aria-label="Latest check-in"><div><small>WEIGHT</small><strong>${state.weight} lb</strong></div><div><small>WAIST</small><strong>${state.waist} in</strong></div></section>`;

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
 const measurements=state.measurementHistory.slice().sort((a,b)=>String(b.recordedAt).localeCompare(String(a.recordedAt))).slice(0,8);
 const weight7=measurementTrend(7,"weight"),weight30=measurementTrend(30,"weight"),waist30=measurementTrend(30,"waist"),strength30=strengthTrend();

 app.innerHTML=`${phaseReadinessMarkup(readiness)}<section class="card">
   <span class="pill">PROGRESS CENTER</span>
   <h2>Your Road to 12%</h2>
   <div class="brief-grid">
     <div><small>SESSIONS</small><strong>${state.history.length}</strong></div>
     <div><small>LIFETIME VOLUME</small><strong>${Math.round(totalLifetimeVolume()).toLocaleString()} lb</strong></div>
     <div><small>WEIGHT</small><strong>${state.weight} lb</strong></div>
     <div><small>WAIST</small><strong>${state.waist} in</strong></div>
   </div>
   <div class="measurement-row">
     <label>Weight (lb)<input id="w" value="${state.weight}" inputmode="decimal"></label>
     <label>Waist (in)<input id="wa" value="${state.waist}" inputmode="decimal"></label>
     <button class="secondary" id="saveP">Save check-in</button>
   </div>
   ${measurements.length?`<div class="measurement-history"><h3>Measurement history</h3>${measurements.map(item=>`<div><time>${formatHistoryDateKey(item.date)}</time><strong>${item.weight??"—"} lb</strong><strong>${item.waist??"—"} in</strong></div>`).join("")}</div>`:""}
 </section>

 <section class="card composition-trends"><span class="pill">BODY-COMPOSITION TRENDS</span><h2>Direction, not one weigh-in</h2><div class="trend-grid"><div><small>7-DAY WEIGHT</small><strong>${weight7?`${weight7.change>0?"+":""}${weight7.change} lb`:"Collecting"}</strong><span>${weight7?`${weight7.count} check-ins`:"At least two check-ins needed"}</span></div><div><small>30-DAY WEIGHT</small><strong>${weight30?`${weight30.change>0?"+":""}${weight30.change} lb`:"Collecting"}</strong><span>${weight30?`${weight30.count} check-ins`:"At least two check-ins needed"}</span></div><div><small>30-DAY WAIST</small><strong>${waist30?`${waist30.change>0?"+":""}${waist30.change} in`:"Collecting"}</strong><span>${waist30?`${waist30.count} check-ins`:"At least two check-ins needed"}</span></div><div><small>RECENT STRENGTH</small><strong>${strength30===null?"Collecting":`${strength30>0?"+":""}${strength30}%`}</strong><span>Selected volume across recent A/B/C sessions</span></div></div><p class="trend-note">Daily scale weight can move temporarily because of hydration, sodium, glycogen, digestion, and creatine. Readiness uses repeated history—not a single weigh-in.</p></section>

 <section class="card"><span class="pill">EXERCISE PROGRESSION</span><h2>Next-session guidance</h2><p class="muted">Recommendations use exercise-specific completed sets, reps, weight and workout feedback. Nothing changes automatically.</p><div class="exercise-progression-list">${progression.map(item=>{const recommendation=item.recommendation,approved=approvedProgressionFor(item.exercise),key=encodeURIComponent(item.exercise.name);return `<div class="progression-${recommendation.action.toLowerCase()}"><span>${recommendation.action}</span><p><strong>${item.exercise.name}</strong><b>${recommendation.prescription.summary}</b><small>${recommendation.reason}</small>${recommendation.action!=="BUILD"?`<button class="${approved?.sourceSessionId===recommendation.sourceSessionId?"secondary":"primary"} progression-approval" data-approve-progression="${key}">${approved?.sourceSessionId===recommendation.sourceSessionId?"Approved for next session ✓":"Approve next-session target"}</button>`:""}</p></div>`;}).join("")}</div></section>

 <section class="card history-protection-card">
   <div class="section-title-row">
     <div><small>DATA PROTECTION</small><h2>Workout history backup</h2></div>
     <span class="history-total">${state.history.length} saved</span>
   </div>
   <p>Export a backup before changing repositories, domains or installed app locations.</p>
   <div class="backup-actions">
     <button class="secondary" id="exportHistory">Export backup</button>
     <label class="secondary import-label">Import backup<input id="importHistory" type="file" accept="application/json,.json"></label>
   </div>
 </section>

 <section class="card">
   <h2>Muscle recovery map</h2>
   <p class="muted">Red groups were trained recently. Green groups are ready or were not emphasized in the last three sessions.</p>
   <div class="muscle-map">${muscles.map(m=>`<div class="${m.trained?"recovering":"ready"}"><span></span><strong>${m.label}</strong><small>${m.trained?"Recovering":"Ready"}</small></div>`).join("")}</div>
 </section>

 <section class="card">
   <h2>Personal records</h2>
   ${records.length?`<div class="pr-grid">${records.map(r=>`<div><small>${r.name}</small><strong>${r.bestWeight} lb</strong><span>Best volume ${Math.round(r.bestVolume).toLocaleString()} lb</span></div>`).join("")}</div>`:'<p class="muted">Complete strength workouts to establish your first records.</p>'}
 </section>

 <section class="card">
   <h2>Achievements</h2>
   <div class="achievement-grid">${achievements.length?achievements.map(([a,d])=>`<div><span>✓</span><strong>${a}</strong><small>${d}</small></div>`).join(""):'<p class="muted">Your first achievement unlocks after one completed workout.</p>'}</div>
 </section>

 <section class="card">
   <h2>Workout history</h2>
   ${state.history.length?state.history.slice().reverse().map(h=>{
     const t=sessionTotals(h),rating=state.workoutRatings[h.id]||"";
     return `<button class="history-card" data-history="${h.id}">
       <span class="history-check">${h.recoveryIndicator?"↻":"✓"}</span>
       <span><strong>${h.name}${h.recoveryIndicator?" · Recovery":""}</strong><small>${h.recoveryIndicator?`Planned ${formatHistoryDateKey(h.plannedDate||h.originalScheduledDate)} • Completed ${formatHistoryDateKey(h.completedDate||h.actualCompletionDate||h.dateKey)}`:`${h.date}`} • ${h.durationMs?formatDuration(h.durationMs):"Duration not captured"} • ${t.completedSets} sets${rating?` • ${rating}`:""}</small></span>
       <span class="history-arrow">›</span>
     </button>`;
   }).join(""):'<p class="muted">No completed sessions yet.</p>'}
 </section>`;

 document.querySelector("#saveP").onclick=()=>{
   const weight=Number(document.querySelector("#w").value)||null,waist=Number(document.querySelector("#wa").value)||null;
   if(weight!==null)state.weight=weight;
   if(waist!==null)state.waist=waist;
   state.measurementHistory.push({id:`measurement-${Date.now()}`,date:localDateKey(),recordedAt:new Date().toISOString(),weight,waist,source:"checkIn"});
   save();
   progress();
 };
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
 if(strength)bindSets(ex);else bindTimer(ex);
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
    cloneExerciseByName("Easy Treadmill Cooldown",{
      name:"Easy Cardio Cooldown",
      duration:"5:00",
      muscles:"Gradual heart-rate recovery",
      demoImage:"assets/phase3/treadmill-walking.jpg"
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
    cloneExerciseByName("Easy Treadmill Cooldown",{
      name:"Zone 2 Cooldown",
      duration:"5:00",
      demoImage:"assets/placeholders/cooldown-recovery.svg"
    })
  ];
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

function fullBodyBWorkout(){
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
      name:"Smith Bulgarian Split Squat",sets:2,reps:10,
      muscles:"Quads, glutes, hamstrings and core",
      setup:["Place the bench behind you","Set the Smith bar around upper-chest height","Place one foot forward and rest the other foot on the bench","Set the safety stops for a comfortable bottom position"],
      steps:["Unrack the bar with your front foot fully planted.","Lower straight down under control.","Keep the front knee tracking with the toes.","Drive through the front foot to stand.","Complete both sides before resting."],
      cues:["Use a short, stable range first.","Keep most of the load on the front leg.","Hold the rack while positioning if needed."],
      rest:90,
      why:"Provides unilateral squat work to balance the bilateral Smith squat used in Full Body A.",
      weightRecommendation:"Practice body position with the empty Smith bar before adding plates.",
      requires:["ritfitM1","bench"],substituteId:null,
      demoImage:"assets/phase2/smith-bulgarian-split-squat.jpg",weightEntry:smithWeightEntry
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
    cloneExerciseByName("Cable Chest Press",{
      name:"Incline Cable Press",sets:3,reps:10,
      muscles:"Upper chest, front shoulders and triceps",
      setup:["Set both pulleys to a low position","Use two D-handles","Set the bench to a low incline and center it between the cables","Sit facing away from the M1"],
      steps:["Bring one handle beside each side of your upper chest.","Brace against the inclined bench.","Press upward and slightly inward.","Stop before locking the elbows.","Lower slowly to the starting position."],
      cues:["Keep shoulders down against the bench.","Use equal weight on both stacks.","Do not overarch your lower back."],
      m1:{pinLeft:2,pinRight:2,attachment:"Two single D-handles",bench:"Bench at a low incline between the cables",facing:"Face away from the M1",stance:"Sit with feet planted",start:"Handles beside the upper chest",finish:"Press upward and slightly inward",view:"45° side view",pinNote:"Set both adjustable pulleys to position 2."},
      why:"Changes Monday’s horizontal press to an incline angle for balanced chest development.",
      requires:["ritfitM1","bench"],
      demoImage:"assets/phase2/incline-cable-press.jpg"
    }),
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

function fullBodyCWorkout(){
  return [
    cloneExerciseByName("Treadmill Walk"),
    cloneExerciseByName("Hip Hinge"),
    Object.assign(deepCopy(window.SUBSTITUTION_DATA["smith-machine-squat"]),{
      sets:3,
      reps:8,
      why:"Keeps one primary squat in the week’s third strength session while using the stable Smith setup and safety stops.",
      weightRecommendation:"Start with the empty Smith bar and add plates only when all eight reps remain smooth and controlled."
    }),
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
  const baseWorkout=dayIndex===2?fullBodyBWorkout():dayIndex===4?fullBodyCWorkout():data;
  const dumbbellAccessory=dumbbellAccessoryForDay(dayIndex);
  const workoutData=dumbbellAccessory?[...baseWorkout,dumbbellAccessory]:baseWorkout;
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
