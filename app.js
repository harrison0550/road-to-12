
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
 "Dynamic Warm-Up":"assets/phase3/dynamic-warm-up.jpg",
 "Hip & Glute Mobility":"assets/phase3/hip-glute-mobility.jpg",
 "Thoracic & Shoulder Mobility":"assets/phase3/thoracic-shoulder-mobility.jpg",
 "Core Activation":"assets/phase3/core-activation.jpg",
 "Cool Down & Recovery":"assets/phase3/cool-down-recovery.jpg",
 "Cooldown":"assets/phase3/cool-down-recovery.jpg"
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


const data=window.WORKOUT_DATA;
const state=JSON.parse(localStorage.getItem("road12v5")||"{}");
Object.assign(state,{tab:state.tab||"home",step:state.step||0,logs:state.logs||{},sessions:state.sessions||0,weight:state.weight||221,waist:state.waist||43,history:state.history||[],selectedDay:Number.isInteger(state.selectedDay)?state.selectedDay:0,coachMode:state.coachMode!==false});
state.attachmentPhotos=state.attachmentPhotos||{};
state.currentSession=state.currentSession||null;
state.historyView=state.historyView||null;
state.preferredName=state.preferredName||"Andy";
state.previewDay=Number.isInteger(state.previewDay)?state.previewDay:null;
state.equipment=Object.assign({
  ritfitM1:true,
  bench:true,
  treadmill:true,
  rower:true,
  kickrCore:true,
  bumperPlates:false,
  dumbbells:false,
  olympicBarbell:false
},state.equipment||{});
const weekPlan=[
 {short:"MON",icon:"🏋️",title:"Full Body A",detail:"Guided strength • chest, back, quads and shoulders",action:"workout",time:"50–60 min",focus:"Full-body strength",items:["Treadmill warm-up","Mobility","Smith Machine Squat","Cable Shoulder Press","Cable Curl","Cable Chest Press","Seated Cable Row","Lat Pulldown","Rope Triceps Pushdown","Treadmill cooldown"],setup:"Low pulleys → mid pulleys → high pulleys"},
 {short:"TUE",icon:"🚶",title:"Cardio + Mobility",detail:"Incline treadmill and mobility recovery",action:"cardio",time:"30–40 min",focus:"Recovery and aerobic base",items:["5-minute easy treadmill warm-up","20–25 minute incline walk at conversational pace","Hip flexor stretch","Hamstring stretch","Chest and shoulder mobility","Easy cooldown"],setup:"Treadmill only; no M1 adjustments"},
 {short:"WED",icon:"💪",title:"Full Body B",detail:"Alternate guided full-body strength session",action:"upcoming",time:"50–60 min",focus:"Back, legs, chest and arms",items:["Treadmill warm-up","Smith Romanian Deadlift","Low Cable Row","Cable Lateral Raise","Cable Fly","Lat Pulldown","Rope Hammer Curl","Triceps Pushdown","Cooldown"],setup:"Smith station → low pulleys → mid pulleys → high pulleys"},
 {short:"THU",icon:"🧘",title:"Core + Recovery",detail:"Core training, stretching and easy movement",action:"recovery",time:"25–35 min",focus:"Core control and mobility",items:["Easy walk or row","Dead bug","Bird dog","Side plank from knees","Hip mobility","Upper-back mobility","Slow breathing cooldown"],setup:"Floor space; optional treadmill or rower"},
 {short:"FRI",icon:"🏋️",title:"Full Body C",detail:"Third weekly guided full-body strength session",action:"upcoming",time:"50–60 min",focus:"Legs, pushing, pulling and arms",items:["Treadmill warm-up","Smith Squat","Cable Curl","Cable Shoulder Press","Cable Chest Press","Seated Cable Row","Straight-arm Pulldown","Rope Triceps Pushdown","Cooldown"],setup:"Smith station → low pulleys → mid pulleys → high pulleys"},
 {short:"SAT",icon:"❤️",title:"Zone 2 Cardio",detail:"Longer easy bike, rower or treadmill session",action:"cardio",time:"35–50 min",focus:"Fat-loss supporting aerobic work",items:["5-minute easy warm-up","25–40 minutes at a pace where you can speak in sentences","5-minute cooldown","Light stretching"],setup:"Choose treadmill, rower or KICKR CORE"},
 {short:"SUN",icon:"📏",title:"Recovery + Check-in",detail:"Rest, measurements and weekly review",action:"progress",time:"10–20 min",focus:"Recovery and progress review",items:["Morning body weight","Waist measurement","Optional progress photos","Review completed workouts","Plan the coming week","Full rest or gentle walk"],setup:"No gym setup required"}
];
const app=document.querySelector("#app"), nav=[...document.querySelectorAll("nav button")];
let timerId=null, remaining=0;
const save=()=>localStorage.setItem("road12v5",JSON.stringify(state));
const equipmentLabels={
  ritfitM1:"RitFit M1 Pro",
  bench:"Adjustable bench",
  treadmill:"iFIT treadmill",
  rower:"iFIT rower",
  kickrCore:"Wahoo KICKR CORE",
  bumperPlates:"Olympic bumper plates",
  dumbbells:"Dumbbells / kettlebells",
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
function activeWorkout(){
  return data.map(resolveExercise).filter(ex=>!ex.unavailable).map((ex,index)=>({ex,index}))
    .sort((a,b)=>setupGroup(a.ex)-setupGroup(b.ex)||a.index-b.index).map(x=>x.ex);
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
        weightEntry:{mode:"legacy",label:"Saved weight",help:"Recovered from Version 11.3.1 local workout data."}
      }));
      item.recoveredFromV74=true;
      changed=true;
    }
    return item;
  });
  if(changed)save();
}
function startNewSession(){
  state.logs={};
  state.currentSession={
    id:`session-${Date.now()}`,
    name:"Full Body A",
    startedAt:new Date().toISOString(),
    dateKey:localDateKey(),
    equipment:deepCopy(state.equipment)
  };
  state.step=0;
  state.setupReady=false;
  save();
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
function sessionExerciseSnapshot(){
  return activeWorkout().filter(ex=>ex.type==="strength").map(ex=>({
    name:ex.name,
    originalExercise:ex.originalExercise||null,
    attachmentCard:ex.attachmentCard||null,
    weightEntry:ex.weightEntry||{mode:"total",label:"Weight used"},
    sets:deepCopy(state.logs[ex.name]||[])
  }));
}
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
document.querySelector("#reset").onclick=()=>{if(confirm("Reset Road to 12% workout data?")){localStorage.removeItem("road12v5");location.reload()}};
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
 document.querySelector('#phase1LibraryButton')?.remove();clearInterval(timerId);document.body.classList.toggle("workout-mode",state.tab==="workout");nav.forEach(b=>b.classList.toggle("active",b.dataset.tab===state.tab));({home:home,workout:workout,library:library,equipment:equipment,progress:progress}[state.tab]||home)()}
function home(){
 const day=weekPlan[state.selectedDay];
 const done=todayCompleted();
 const completed=completedTodaySession();
 if(done){
   const totals=sessionTotals(completed);
   app.innerHTML=`<section class="celebration-hero"><div class="celebration-burst">🏆</div><span class="pill">TODAY COMPLETE</span><h2>You crushed it, ${state.preferredName}!</h2><p>Workout #${state.sessions||state.history.length} on the Road to 12% is officially complete.</p><div class="celebration-stats"><div><small>WORKOUT</small><strong>${completed.name}</strong></div><div><small>TIME</small><strong>${formatDuration(completed.durationMs)}</strong></div><div><small>SETS SAVED</small><strong>${totals.completedSets}</strong></div></div><button class="primary" id="viewCompleted">View today’s completed workout</button><button class="secondary repeat-button" id="repeatWorkout">Repeat workout intentionally</button><small class="recovery-message">Hydrate, eat well, and recover. See you for the next session.</small></section>
   <section class="card week-card"><h2>Training schedule</h2><div class="week-strip">${weekPlan.map((d,i)=>`<button class="day-button ${i===state.selectedDay?"selected":""} ${i===0?"completed-day":""}" data-day="${i}"><span class="day-icon">${i===0?"✅":d.icon}</span><strong>${d.short}</strong><small>${i===0?"Complete":i===state.selectedDay?"Selected":""}</small></button>`).join("")}</div><div class="selected-plan"><div class="large-icon">✅</div><div><h3>Today is logged</h3><p class="muted">Your weights, reps and completed sets are stored in Workout History.</p></div></div></section>
   <section class="stats"><div><small>WEIGHT</small><strong>${state.weight} lb</strong></div><div><small>WAIST</small><strong>${state.waist} in</strong></div><div><small>SESSIONS</small><strong>${state.sessions}</strong></div></section>`;
   document.querySelector("#viewCompleted").onclick=()=>{state.historyView=completed.id;setTab("progress")};
   document.querySelector("#repeatWorkout").onclick=()=>{if(confirm("Start another Full Body A workout today? Your completed session will remain saved.")){startNewSession();setTab("workout")}};
   document.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDay=+b.dataset.day;state.previewDay=state.selectedDay;save();showDayPlan(state.selectedDay)});
   return;
 }
 app.innerHTML=`<section class="hero"><img src="${window.HERO_IMAGE}"><div class="shade"></div><div class="hero-copy"><span class="pill">WEEK 1 • FOUNDATION</span><h2>${day.title}</h2><p>${day.detail}</p><button class="primary" id="start">${day.action==="workout"?"Start today's guided workout":"Open selected day"}</button></div></section>
 <section class="card week-card"><h2>Training schedule</h2><p class="muted">Tap any day to view its plan.</p><div class="week-strip">${weekPlan.map((d,i)=>`<button class="day-button ${i===state.selectedDay?"selected":""}" data-day="${i}"><span class="day-icon">${d.icon}</span><strong>${d.short}</strong><small>${i===state.selectedDay?"Selected":""}</small></button>`).join("")}</div><div class="selected-plan"><div class="large-icon">${day.icon}</div><div><h3>${day.title}</h3><p class="muted">${day.detail}</p></div></div></section>
 <section class="card equipment-ready-card"><div><span class="ready-icon">✓</span><div><strong>Workout is equipment-ready</strong><p class="muted">${state.equipment.bumperPlates?"Bumper plates are enabled.":"Bumper plates are off. Plate-dependent barbell work is excluded."} ${substitutionCount()} automatic substitution${substitutionCount()===1?"":"s"} active.</p></div></div><button class="secondary" id="editEquipment">My equipment</button></section>
 <section class="stats"><div><small>WEIGHT</small><strong>${state.weight} lb</strong></div><div><small>WAIST</small><strong>${state.waist} in</strong></div><div><small>SESSIONS</small><strong>${state.sessions}</strong></div></section>`;
 document.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDay=+b.dataset.day;state.previewDay=state.selectedDay;save();showDayPlan(state.selectedDay)});
 document.querySelector("#editEquipment").onclick=()=>setTab("equipment");
 document.querySelector("#start").onclick=()=>{
   const action=weekPlan[state.selectedDay].action;
   if(action==="workout"){startNewSession();setTab("workout")}
   else if(action==="progress")setTab("progress");
   else showDayPlan();
 };
}

function showDayPlan(dayIndex=state.selectedDay){
 const day=weekPlan[dayIndex],isToday=dayIndex===0;
 app.innerHTML=`<section class="card day-preview-card"><button class="secondary" id="previewBack">Back to schedule</button><div class="preview-title"><span class="large-icon">${day.icon}</span><div><span class="pill">${day.short} PREVIEW</span><h2>${day.title}</h2><p class="muted">${day.detail}</p></div></div><div class="brief-grid"><div><small>TIME</small><strong>${day.time}</strong></div><div><small>FOCUS</small><strong>${day.focus}</strong></div><div><small>STATUS</small><strong>${isToday&&todayCompleted()?"Completed":isToday?"Today":"Preview"}</strong></div><div><small>SETUP FLOW</small><strong>${day.setup}</strong></div></div></section>
 <section class="card"><h2>Workout preview</h2><p class="muted">Previewing does not start or change your active workout.</p><ol class="preview-exercise-list">${day.items.map((item,i)=>`<li><span>${i+1}</span><strong>${item}</strong></li>`).join("")}</ol></section>
 ${day.action==="workout"||day.action==="upcoming"?`<section class="card setup-efficiency-card"><h3>M1 setup efficiency</h3><p>The sequence is grouped so you finish one pulley zone before moving to the next.</p><div class="setup-flow">${day.setup.split(" → ").map(x=>`<span>${x}</span>`).join("")}</div></section>`:""}
 <button class="primary" id="previewAction">${isToday?"Start today’s workout":"Start this workout early"}</button>`;
 document.querySelector("#previewBack").onclick=()=>{state.previewDay=null;save();home()};
 document.querySelector("#previewAction").onclick=()=>{
   if(day.action==="progress")return setTab("progress");
   if(day.action==="workout"||day.action==="upcoming"){
     if(!isToday&&!confirm(`Start ${day.title} early?`))return;
     startNewSession();setTab("workout");return;
   }
   alert(`${day.title} is available as a preview. Its guided timer flow will be added as the program expands.`);
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

function workout(){
 if(!state.currentSession && state.step===0){
   state.currentSession={id:`session-${Date.now()}`,name:"Full Body A",startedAt:new Date().toISOString(),dateKey:localDateKey(),equipment:deepCopy(state.equipment)};
   save();
 }
 const workoutData=activeWorkout();
 if(state.step===0)return briefing();
 if(state.step>workoutData.length)return summary();
 const ex=workoutData[state.step-1]; exercise(ex,workoutData);
}
function briefing(){
 const workoutData=activeWorkout(),swaps=workoutData.filter(ex=>ex.originalExercise),blocks=setupPlanSummary(workoutData);
 const swapMarkup=swaps.map(ex=>`<div class="swap-row"><div><small>REPLACED</small><strong>${ex.originalExercise}</strong></div><span>→</span><div><small>TODAY</small><strong>${ex.name}</strong></div></div>`).join("");
 app.innerHTML=`<section class="card"><div class="phase"><span class="pill">SETUP-EFFICIENT SESSION</span><strong>50–60 min</strong></div><h2>Full Body A</h2><p class="muted">Exercises are grouped by M1 setup zone to reduce repeated pulley adjustments.</p><div class="brief-grid"><div><small>PRIMARY</small><strong>Full body</strong></div><div><small>PLATES</small><strong>${state.equipment.bumperPlates?"Available":"Not installed"}</strong></div><div><small>INTENSITY</small><strong>Leave 2–3 reps in reserve</strong></div><div><small>SETUP BLOCKS</small><strong>${blocks.length}</strong></div></div></section>
 <section class="card"><h3>Today’s setup route</h3><div class="setup-route">${blocks.map((b,i)=>`<div><span>${i+1}</span><strong>${b.label}</strong><small>${b.pin||"No M1 pin"} • ${b.count} exercise${b.count===1?"":"s"}</small></div>`).join("")}</div><p class="muted">Finish each block before moving the pulley carriages again.</p></section>
 ${swaps.length?`<section class="card substitution-summary"><h3>Automatic substitutions</h3>${swapMarkup}</section>`:""}
 <section class="card muscles"><h3>Today’s muscle groups</h3><p>Chest, shoulders, triceps, back, biceps, quads, glutes, hamstrings and core.</p></section><button class="primary" id="go">Begin warm-up</button>`;
 document.querySelector("#go").onclick=next
}

function restCoachText(n){if(n<=10)return"Get ready and set your posture.";if(n<=20)return"Review the next setup and take two slow breaths.";if(n<=40)return"Drink water if needed and relax your grip.";return"Recover and prepare for the next set."}
function exercise(ex,workoutData=activeWorkout()){
 const pct=Math.round(state.step/workoutData.length*100),strength=ex.type==="strength";
 if(strength&&!state.logs[ex.name])state.logs[ex.name]=Array(ex.sets).fill(null);
 const currentBlock=setupBlockLabel(ex),previous=workoutData[state.step-2],blockChanged=!previous||setupBlockLabel(previous)!==currentBlock;
 app.innerHTML=`<section class="card workout-card"><div class="phase"><span class="tag">${ex.type}</span><strong>${state.step}/${workoutData.length}</strong></div><div class="progress workout-progress"><i style="width:${pct}%"></i></div>
 ${blockChanged?`<div class="setup-block-banner"><small>NOW ENTERING</small><strong>${currentBlock}</strong>${ex.m1?`<span>Keep this pulley zone until the block is complete.</span>`:""}</div>`:""}
 <h2>${ex.name}</h2><p class="muted workout-subtitle">${ex.muscles}</p>
 ${ex.originalExercise?`<div class="substitution-alert"><strong>Equipment substitution</strong><p>${ex.originalExercise} was replaced with ${ex.name} because required equipment is unavailable.</p></div>`:""}
 <div class="why-card"><h3>Why this exercise?</h3><p>${ex.why}</p></div>
 ${attachmentPhotoMarkup(ex)}
 ${ex.m1?m1SetupCoach(ex):`<div class="simple-setup-flow"><section class="setup-section"><div class="section-number">1</div><div><small>SETUP</small><h3>Get ready</h3>${ex.setup.map(x=>`<p>${x}</p>`).join("")}</div></section></div>`}
 <section class="exercise-visual-section">
   <div class="section-heading"><span>${ex.m1?5:2}</span><div><small>VISUAL GUIDE</small><h3>Use this movement reference</h3></div></div>
   ${ex.correctedGuide?correctedDemoMarkup(ex):`<button class="exercise-asset-button" id="openAsset"><img class="exercise-asset-image" src="${ex.demoImage}" alt="${ex.name} visual guide"><span>Tap to enlarge</span></button>`}
 </section>
 <section class="movement-instructions"><div class="section-heading"><span>${ex.m1?6:3}</span><div><small>PERFORM THE MOVEMENT</small><h3>Step by step</h3></div></div><ol class="steps">${ex.steps.map(s=>`<li>${s}</li>`).join("")}</ol><div class="cue"><strong>Key cues</strong><p>${ex.cues.join(" • ")}</p></div></section>
 ${quickSettings(ex)}
 ${strength?`<div class="weight-coach-card"><h3>Beginner weight recommendation</h3><p>${ex.weightRecommendation}</p></div>`:""}</section>
 ${strength?sets(ex):timed(ex)}
 <div class="workout-actions"><button class="secondary" id="back">Back</button><button class="primary" id="next">${state.step===workoutData.length?"Finish session":"Complete & continue"}</button></div>`;
 document.querySelector("#back").onclick=()=>{state.step=Math.max(0,state.step-1);save();workout()};
 document.querySelector("#next").onclick=next;
 const assetButton=document.querySelector("#openAsset");
 if(assetButton)assetButton.onclick=()=>openExerciseAsset(ex);
 if(strength)bindSets(ex);else bindTimer(ex);
}


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
 const overlay=document.createElement("div");
 overlay.className="asset-overlay";
 overlay.innerHTML=`<div class="asset-overlay-panel"><button class="asset-close">Close</button><h2>${ex.name}</h2><img src="${ex.demoImage}" alt="${ex.name} visual guide"><p>Use this visual together with the setup and movement instructions.</p></div>`;
 document.body.appendChild(overlay);
 const close=()=>overlay.remove();
 overlay.querySelector(".asset-close").onclick=close;
 overlay.onclick=e=>{if(e.target===overlay)close()};
}

function sets(ex){
 const entry=ex.weightEntry||{mode:"total",label:"Weight used",help:"Enter the weight used for this set."};
 return `<section class="card timer-card"><h3>${ex.sets} sets × ${ex.reps} reps</h3>
 <div class="weight-entry-explainer"><span>${entry.mode==="dual"?"↔️":entry.mode==="single"?"1️⃣":"🏋️"}</span><div><strong>${entry.label}</strong><p>${entry.help}</p>${entry.mode==="dual"?`<small>Example: left 20 lb + right 20 lb → enter <b>20</b>; combined selected stack weight is 40 lb.</small>`:""}</div></div>
 <div class="set-table-head"><span>SET</span><span>${entry.mode==="dual"?"LB / STACK":"WEIGHT LB"}</span><span>REPS</span><span>DONE</span></div>
 ${state.logs[ex.name].map((v,i)=>`<div class="set-row"><strong>${i+1}</strong><input data-w="${i}" inputmode="decimal" placeholder="${entry.mode==="dual"?"per stack":"lb"}" value="${v?.weight||""}"><input data-r="${i}" inputmode="numeric" value="${v?.reps||ex.reps}"><button data-d="${i}" class="${v?.done?"done":""}">${v?.done?"✓":"○"}</button>${entry.mode==="dual"&&v?.weight?`<small class="combined-weight">Combined selected: ${Number(v.weight)*2} lb</small>`:""}</div>`).join("")}
 <div class="timer" id="timer">Rest ${String(Math.floor(ex.rest/60)).padStart(2,"0")}:${String(ex.rest%60).padStart(2,"0")}</div><div class="rest-coach-message" id="restCoach">Recover and prepare for your next set.</div><div class="timer-controls"><button class="secondary" id="rest">Start rest timer</button><button class="secondary" id="stopTimer">Stop timer</button></div></section>`}
function timed(ex){return `<section class="card timer-card"><h3>${ex.duration}</h3><div class="timer" id="timer">${ex.duration.includes(":")?ex.duration:"Ready"}</div>${ex.duration.includes(":")?'<div class="timer-controls"><button class="primary" id="rest">Start timer</button><button class="secondary" id="stopTimer">Stop timer</button></div>':""}</section>`}
function bindSets(ex){
 document.querySelectorAll("[data-w],[data-r]").forEach(input=>input.onchange=()=>{
   const i=Number(input.dataset.w??input.dataset.r);
   const existing=state.logs[ex.name][i]||{};
   state.logs[ex.name][i]=Object.assign({},existing,{
     weight:document.querySelector(`[data-w="${i}"]`)?.value||"",
     reps:document.querySelector(`[data-r="${i}"]`)?.value||ex.reps
   });
   save();
 });
 document.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{
   const i=+b.dataset.d;
   const w=document.querySelector(`[data-w="${i}"]`).value;
   const r=document.querySelector(`[data-r="${i}"]`).value;
   state.logs[ex.name][i]={weight:w,reps:r,done:!state.logs[ex.name][i]?.done};
   save();exercise(ex);
 });
 document.querySelector("#rest").onclick=()=>startTimer(ex.rest);
 const stop=document.querySelector("#stopTimer");if(stop)stop.onclick=stopTimer
}
function bindTimer(ex){let b=document.querySelector("#rest");if(b)b.onclick=()=>{let [m,s]=ex.duration.split(":").map(Number);startTimer(m*60+s)};const stop=document.querySelector("#stopTimer");if(stop)stop.onclick=stopTimer}
function stopTimer(){clearInterval(timerId);timerId=null;}
function startTimer(sec){remaining=sec;const el=document.querySelector("#timer");clearInterval(timerId);tick();timerId=setInterval(()=>{remaining--;tick();if(remaining<=0){clearInterval(timerId);navigator.vibrate?.([200,100,200])}},1000);function tick(){el.textContent=`${String(Math.floor(remaining/60)).padStart(2,"0")}:${String(remaining%60).padStart(2,"0")}`;const c=document.querySelector("#restCoach");if(c)c.textContent=restCoachText(remaining)}}
function next(){state.step++;save();workout()}
function summary(){
 let session;
 if(state.currentSession?.completedId){
   session=state.history.find(h=>h.id===state.currentSession.completedId);
 }else{
   const endedAt=new Date();
   const startedAt=state.currentSession?.startedAt?new Date(state.currentSession.startedAt):endedAt;
   session={
     id:state.currentSession?.id||`session-${Date.now()}`,
     date:endedAt.toLocaleDateString(),
     dateKey:localDateKey(endedAt),
     completedAt:endedAt.toISOString(),
     startedAt:startedAt.toISOString(),
     durationMs:Math.max(0,endedAt-startedAt),
     name:"Full Body A",
     exercises:sessionExerciseSnapshot(),
     equipment:deepCopy(state.equipment)
   };
   state.sessions++;
   state.history.push(session);
   state.currentSession={completedId:session.id};
   state.step=0;
   save();
 }
 const totals=sessionTotals(session);
 app.innerHTML=`<section class="card complete upgraded-complete"><div class="check">✓</div><span class="pill">ROAD TO 12% • SESSION ${state.sessions}</span><h2>You crushed it!</h2><p class="muted">Full Body A is permanently saved. Your completed sets, reps and selected weights are now available in Workout History.</p><div class="brief-grid"><div><small>TIME</small><strong>${formatDuration(session.durationMs)}</strong></div><div><small>SETS SAVED</small><strong>${totals.completedSets}</strong></div><div><small>REPS</small><strong>${totals.totalReps}</strong></div><div><small>NEXT</small><strong>Recover + hydrate</strong></div></div></section><button class="primary" id="viewSession">View completed workout</button><button class="secondary" id="home">Return to celebration home</button>`;
 document.querySelector("#viewSession").onclick=()=>{state.historyView=session.id;setTab("progress")};
 document.querySelector("#home").onclick=()=>setTab("home")
}
function library(){
 const extras=window.EXTRA_LIBRARY_DATA||[];
 const all=[...data,...extras];
 app.innerHTML=`<section class="card">
   <h2>Exercise Library</h2>
   <p class="muted">Select an exercise to review its attachment, setup and movement instructions.</p>

   <div class="library-master">
     <img src="assets/exercise-asset-pack-v7-2.png" alt="Version 7.2 quality-controlled exercise asset pack">
     <div class="library-master-copy">
       <span class="asset-badge">Master reference</span>
       <h3>Version 7.2 exercise asset pack</h3>
       <p>The complete pack stays in Library. Guided workouts show only the current exercise panel.</p>
       <div class="guide-actions"><button class="primary-guide" data-open-asset="assets/exercise-asset-pack-v7-2.png">Open master library</button></div>
     </div>
   </div>

   <h3 class="library-section-title">Today's guided exercises</h3>
   <div class="exercise-library-grid">
     ${data.map((x,i)=>`<button class="exercise-library-tile" data-workout-i="${i}"><span class="tag">${x.type}</span><strong>${x.name}</strong><small>Dedicated exercise asset</small></button>`).join("")}
   </div>

   <h3 class="library-section-title">Other equipment</h3>
   <div class="exercise-library-grid">
     ${extras.map((x,i)=>`<button class="exercise-library-tile" data-extra-i="${i}"><span class="tag">${x.type}</span><strong>${x.name}</strong><small>Setup, attachment and movement guide</small></button>`).join("")}
   </div>
 </section>`;
 bindAssetViewer();
 document.querySelectorAll("[data-workout-i]").forEach(x=>x.onclick=()=>{state.step=+x.dataset.workoutI+1;setTab("workout")});
 document.querySelectorAll("[data-extra-i]").forEach(x=>x.onclick=()=>showLibraryExercise(extras[+x.dataset.extraI]));
}

function showLibraryExercise(ex){
 app.innerHTML=`<section class="card workout-card"><button class="secondary" id="libraryBack">Back to Library</button><h2>${ex.name}</h2><p class="muted workout-subtitle">${ex.muscles}</p><div class="why-card"><h3>Why this exercise?</h3><p>${ex.why||"Builds strength and movement control."}</p></div>${attachmentPhotoMarkup(ex)}${ex.m1?m1SetupCoach(ex):`<div class="setup-grid">${ex.setup.map(x=>`<div><strong>${x}</strong></div>`).join("")}</div>`}<section class="movement-instructions"><ol class="steps">${ex.steps.map(s=>`<li>${s}</li>`).join("")}</ol><div class="cue"><strong>Key cues</strong><p>${ex.cues.join(" • ")}</p></div></section></section>`;
 document.querySelector("#libraryBack").onclick=library;
}
function equipment(){
 const items=[
  ["ritfitM1","🏋️","RitFit M1 Pro","Required for cable and Smith-machine exercises."],
  ["bench","🪑","Adjustable bench","Used for seated rows, pulldowns and supported movements."],
  ["treadmill","🏃","iFIT treadmill","Used for warm-ups, cooldowns and cardio."],
  ["rower","🚣","iFIT rower","Available for technique and cardio sessions."],
  ["kickrCore","🚴","Wahoo KICKR CORE","Available for cycling sessions."],
  ["bumperPlates","⚫","Olympic bumper plates","Keep off until the plates arrive and are ready to use."],
  ["dumbbells","🔩","Dumbbells / kettlebells","Keep off unless you have usable free weights."],
  ["olympicBarbell","🏋️‍♂️","Free Olympic barbell","This refers to free-barbell work, not the M1 Smith bar."]
 ];
 const attachments=[
  ["dHandles","Two D-handles","Used for chest press and shoulder press."],
  ["straightBar","Short straight curl bar","Used for the corrected cable curl."],
  ["rope","Triceps rope","Used for rope pushdowns."],
  ["latBar","Lat pulldown bar","Used for lat pulldowns."],
  ["rowHandle","Close-grip row handle","Used for seated cable rows."]
 ];
 app.innerHTML=`<section class="card"><div class="phase"><span class="pill">VERSION 11.3.1</span><strong>Real-workout redesign</strong></div><h2>Profile</h2><label>What should the app call you?<input id="preferredName" value="${state.preferredName}" autocomplete="given-name"></label><button class="secondary profile-save" id="saveProfile">Save name</button></section><section class="card"><h2>My Equipment</h2><p class="muted">Workouts use only equipment switched on.</p><div class="equipment-toggle-list">${items.map(([key,icon,title,note])=>`<label class="equipment-toggle"><span class="equipment-symbol">${icon}</span><span class="equipment-copy"><strong>${title}</strong><small>${note}</small></span><input type="checkbox" data-equipment="${key}" ${state.equipment[key]?"checked":""}><span class="toggle-ui"></span></label>`).join("")}</div></section>
 <section class="card"><h2>Attachment Locker</h2><p class="muted">Add a close-up photo of each attachment from your actual gym. The correct photo will appear during every exercise with a bright “USE THIS ONE” label.</p><div class="attachment-locker">${attachments.map(([key,title,note])=>`<div class="locker-item">${state.attachmentPhotos[key]?`<img src="${state.attachmentPhotos[key]}" alt="${title}">`:`<div class="locker-placeholder">📷</div>`}<div class="locker-copy"><strong>${title}</strong><small>${note}</small><label class="photo-button">Choose photo<input type="file" accept="image/*" capture="environment" data-photo="${key}"></label>${state.attachmentPhotos[key]?`<button class="clear-photo" data-clear-photo="${key}">Remove</button>`:""}</div></div>`).join("")}</div></section>
 <section class="card equipment-impact"><h3>Current workout impact</h3><div class="impact-row"><span>Available exercises</span><strong>${activeWorkout().length}</strong></div><div class="impact-row"><span>Automatic substitutions</span><strong>${substitutionCount()}</strong></div><div class="impact-row"><span>Bumper-plate exercises</span><strong>${state.equipment.bumperPlates?"Enabled":"Disabled"}</strong></div><button class="primary" id="equipmentWorkout">Start equipment-safe workout</button></section>`;
 document.querySelector("#saveProfile").onclick=()=>{state.preferredName=document.querySelector("#preferredName").value.trim()||"Andy";save();equipment()};
 document.querySelectorAll("[data-equipment]").forEach(input=>input.onchange=()=>{state.equipment[input.dataset.equipment]=input.checked;state.step=0;save();equipment()});
 document.querySelectorAll("[data-photo]").forEach(input=>input.onchange=e=>saveAttachmentPhoto(input.dataset.photo,e.target.files?.[0]));
 document.querySelectorAll("[data-clear-photo]").forEach(btn=>btn.onclick=()=>{delete state.attachmentPhotos[btn.dataset.clearPhoto];save();equipment()});
 document.querySelector("#equipmentWorkout").onclick=()=>{startNewSession();setTab("workout")};
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
function progress(){
 if(state.historyView){
   const session=state.history.find(h=>h.id===state.historyView);
   if(session)return sessionDetail(session);
   state.historyView=null;
 }
 app.innerHTML=`<section class="card"><h2>Progress check-in</h2><label>Weight (lb)<input id="w" value="${state.weight}"></label><br><label>Waist (in)<input id="wa" value="${state.waist}"></label><br><button class="primary" id="saveP">Save check-in</button></section>
 <section class="card"><h2>Workout history</h2><p class="muted">Tap a workout to reopen every saved exercise, set, weight and rep.</p>${state.history.length?state.history.slice().reverse().map(h=>{const t=sessionTotals(h);return `<button class="history-card" data-history="${h.id}"><span class="history-check">✓</span><span><strong>${h.name}</strong><small>${h.date} • ${formatDuration(h.durationMs)} • ${t.completedSets} sets saved${h.recoveredFromV74?" • Recovered from 7.4":""}</small></span><span class="history-arrow">›</span></button>`}).join(""):'<p class="muted">No completed sessions yet.</p>'}</section>`;
 document.querySelector("#saveP").onclick=()=>{state.weight=document.querySelector("#w").value;state.waist=document.querySelector("#wa").value;save();progress()};
 document.querySelectorAll("[data-history]").forEach(btn=>btn.onclick=()=>{state.historyView=btn.dataset.history;save();progress()});
}
function sessionDetail(session){
 const totals=sessionTotals(session);
 app.innerHTML=`<section class="card session-detail-header"><button class="secondary" id="historyBack">Back to history</button><div class="check small-check">✓</div><span class="pill">COMPLETED WORKOUT</span><h2>${session.name}</h2><p class="muted">${session.date} • ${formatDuration(session.durationMs)}</p><div class="brief-grid"><div><small>SETS</small><strong>${totals.completedSets}</strong></div><div><small>REPS</small><strong>${totals.totalReps}</strong></div><div><small>SELECTED VOLUME</small><strong>${Math.round(totals.selectedVolume).toLocaleString()} lb</strong></div><div><small>STATUS</small><strong>Saved</strong></div></div>${session.recoveredFromV74?`<div class="recovery-note">This session was recovered from Version 11.3.1. Any values still held in the old workout log are shown below.</div>`:""}</section>
 <section class="card"><h2>Exercises completed</h2><div class="history-exercise-list">${(session.exercises||[]).length?(session.exercises||[]).map(ex=>`<details class="history-exercise" open><summary><span><strong>${ex.name}</strong>${ex.originalExercise?`<small>Substituted for ${ex.originalExercise}</small>`:""}</span><span>${(ex.sets||[]).filter(s=>s?.done).length} sets</span></summary><div class="history-set-head"><span>SET</span><span>${ex.weightEntry?.mode==="dual"?"LB / STACK":"WEIGHT"}</span><span>REPS</span><span>STATUS</span></div>${(ex.sets||[]).map((s,i)=>`<div class="history-set-row"><strong>${i+1}</strong><span>${s?.weight!==undefined&&s?.weight!==""?`${s.weight} lb`:"—"}${ex.weightEntry?.mode==="dual"&&s?.weight?`<small>${Number(s.weight)*2} lb combined selected</small>`:""}</span><span>${s?.reps||"—"}</span><span>${s?.done?"✓ Complete":"Not marked"}</span></div>`).join("")||'<p class="muted">No set details were stored.</p>'}<div class="history-weight-note"><strong>${ex.weightEntry?.label||"Weight used"}</strong><p>${ex.weightEntry?.help||""}</p></div></details>`).join(""):'<p class="muted">The older session record did not contain exercise details.</p>'}</div></section>
 <button class="secondary" id="repeatHistory">Repeat this workout</button>`;
 document.querySelector("#historyBack").onclick=()=>{state.historyView=null;save();progress()};
 document.querySelector("#repeatHistory").onclick=()=>{if(confirm("Start a new Full Body A workout? This saved session will not be changed.")){state.historyView=null;startNewSession();setTab("workout")}};
}

/* =========================================================
   ROAD TO 12% — VERSION 11.3.1 PRODUCT EXPERIENCE
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
 const text=last.flatMap(h=>(h.exercises||[]).map(x=>x.muscles||"")).join(" ").toLowerCase();
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
function home(){
 const done=todayCompleted(), completed=completedTodaySession(), check=todayCheckin(), tomorrow=tomorrowPlan();
 const totals=completed?sessionTotals(completed):null;
 app.innerHTML=`<section class="v11-dashboard-head"><span class="pill">VERSION 11.3.1</span><h2>${greeting()}, ${state.preferredName}</h2><p>${done?"Training complete. Now make recovery count.":"Your personalized home-gym plan is ready."}</p></section>
 ${done?`<section class="card v11-status-card complete-status"><div class="dashboard-icon">🏆</div><div><small>TODAY’S STATUS</small><h3>Workout complete</h3><p>${completed.name} • ${formatDuration(completed.durationMs)} • ${totals.completedSets} sets saved</p></div><button class="secondary" id="viewToday">View</button></section>`:
 `<section class="card v11-status-card"><div class="dashboard-icon">▶</div><div><small>TODAY’S WORKOUT</small><h3>${weekPlan[state.selectedDay].title}</h3><p>${weekPlan[state.selectedDay].time} • ${weekPlan[state.selectedDay].focus}</p></div><button class="primary compact-primary" id="startToday">Start</button></section>`}
 <section class="card dashboard-section"><div class="section-title-row"><div><small>DAILY READINESS</small><h3>Recovery check-in</h3></div><span class="readiness-score">${[check.water,check.nutrition,!!check.sleep].filter(Boolean).length}/3</span></div>
 <div class="checkin-grid">
  <label><span>Sleep</span><select id="sleepCheck"><option value="">Select</option><option ${check.sleep==="Great"?"selected":""}>Great</option><option ${check.sleep==="Good"?"selected":""}>Good</option><option ${check.sleep==="Poor"?"selected":""}>Poor</option></select></label>
  <button class="checkin-toggle ${check.water?"checked":""}" id="waterCheck"><span>${check.water?"✓":"○"}</span> Water</button>
  <button class="checkin-toggle ${check.nutrition?"checked":""}" id="nutritionCheck"><span>${check.nutrition?"✓":"○"}</span> Nutrition</button>
 </div></section>
 <section class="card tomorrow-card"><div class="section-title-row"><div><small>NEXT UP</small><h3>${tomorrow.title}</h3></div><span>${tomorrow.time}</span></div><p>${tomorrow.detail}</p><div class="focus-chips">${tomorrow.focus.split(",").map(x=>`<span>${x}</span>`).join("")}</div><button class="secondary" id="previewTomorrow">Preview tomorrow</button></section>
 <section class="card week-card"><h3>This week</h3><div class="week-strip">${weekPlan.map((d,i)=>`<button class="day-button ${i===state.selectedDay?"selected":""} ${i===0&&done?"completed-day":""}" data-day="${i}"><span class="day-icon">${i===0&&done?"✅":d.icon}</span><strong>${d.short}</strong></button>`).join("")}</div></section>
 <section class="stats"><div><small>WEIGHT</small><strong>${state.weight} lb</strong></div><div><small>WAIST</small><strong>${state.waist} in</strong></div><div><small>SESSIONS</small><strong>${state.sessions}</strong></div></section>`;
 document.querySelector("#viewToday")?.addEventListener("click",()=>{state.historyView=completed.id;setTab("progress")});
 document.querySelector("#startToday")?.addEventListener("click",()=>{startNewSession();setTab("workout")});
 document.querySelector("#previewTomorrow").onclick=()=>showDayPlan((state.selectedDay+1)%7);
 document.querySelector("#sleepCheck").onchange=e=>{check.sleep=e.target.value;save();home()};
 document.querySelector("#waterCheck").onclick=()=>{check.water=!check.water;save();home()};
 document.querySelector("#nutritionCheck").onclick=()=>{check.nutrition=!check.nutrition;save();home()};
 document.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDay=+b.dataset.day;save();showDayPlan(state.selectedDay)});
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
function smithPlateCalculator(ex){
 if(!ex.name.toLowerCase().includes("smith"))return "";
 return `<section class="plate-calculator"><div><small>SMART PLATE CALCULATOR</small><h3>Added weight per side</h3></div><label>Total added weight<input id="plateTotal" type="number" inputmode="decimal" placeholder="0"></label><div class="plate-result" id="plateResult">Enter the total plate weight.</div></section>`;
}
function calculatePlates(total){
 let side=Math.max(0,Number(total)||0)/2;
 const plates=[45,35,25,10,5,2.5], result=[];
 plates.forEach(p=>{const n=Math.floor((side+.001)/p);if(n){result.push(`${n} × ${p}`);side-=n*p}});
 return result.length?`Each side: ${result.join(" + ")} lb`:"Empty Smith bar";
}
function exercise(ex,workoutData=activeWorkout()){
 if(ex&&PHASE2_ASSET_MAP[ex.name])ex.demoImage=PHASE2_ASSET_MAP[ex.name];
 if(ex&&PHASE3_ASSET_MAP[ex.name])ex.demoImage=PHASE3_ASSET_MAP[ex.name];
 const pct=Math.round(state.step/workoutData.length*100),strength=ex.type==="strength";
 if(strength&&!state.logs[ex.name])state.logs[ex.name]=Array(ex.sets).fill(null);
 const currentBlock=setupBlockLabel(ex),previous=workoutData[state.step-2],blockChanged=!previous||setupBlockLabel(previous)!==currentBlock;
 app.innerHTML=`<section class="card workout-card gym-mode-card"><div class="phase"><span class="tag">${ex.type}</span><strong>${state.step}/${workoutData.length}</strong></div>
 ${blockProgressMarkup(workoutData,ex)}
 ${blockChanged?`<div class="setup-block-banner"><small>NOW ENTERING</small><strong>${currentBlock}</strong><span>${ex.m1?"Keep this pulley setup until this block ends.":"Complete this section before moving on."}</span></div>`:""}
 <h2>${ex.name}</h2><p class="muted workout-subtitle">${ex.muscles}</p>
 <div class="why-card"><h3>Why this exercise?</h3><p>${ex.why||"Builds strength, control and confidence."}</p></div>
 ${attachmentPhotoMarkup(ex)}
 ${ex.m1?m1SetupCoach(ex):`<div class="simple-setup-flow"><section class="setup-section"><div class="section-number">1</div><div><small>SETUP</small><h3>Get ready</h3>${ex.setup.map(x=>`<p>${x}</p>`).join("")}</div></section></div>`}
 <section class="exercise-visual-section"><div class="section-heading"><span>▶</span><div><small>VISUAL GUIDE</small><h3>Start, move and finish</h3></div></div><button class="exercise-asset-button" id="openAsset"><img class="exercise-asset-image" src="${ex.demoImage}" alt="${ex.name} visual guide"><span>Tap to enlarge</span></button></section>
 <section class="movement-instructions"><div class="section-heading"><span>✓</span><div><small>COACHING</small><h3>Step by step</h3></div></div><ol class="steps">${ex.steps.map(s=>`<li>${s}</li>`).join("")}</ol><div class="cue"><strong>Key cues</strong><p>${ex.cues.join(" • ")}</p></div></section>
 ${smithPlateCalculator(ex)}
 ${quickSettings(ex)}
 ${strength?`<div class="weight-coach-card"><h3>Load guidance</h3><p>${ex.weightRecommendation}</p></div>`:""}</section>
 ${strength?sets(ex):timed(ex)}
 <div class="workout-actions"><button class="secondary" id="back">Back</button><button class="primary" id="next">${state.step===workoutData.length?"Finish session":"Complete & continue"}</button></div>`;
 document.querySelector("#back").onclick=()=>{state.step=Math.max(0,state.step-1);save();workout()};
 document.querySelector("#next").onclick=next;
 document.querySelector("#openAsset").onclick=()=>openExerciseAsset(ex);
 const plate=document.querySelector("#plateTotal");
 if(plate)plate.oninput=()=>document.querySelector("#plateResult").textContent=calculatePlates(plate.value);
 if(strength)bindSets(ex);else bindTimer(ex);
}

function summary(){
 let session;
 if(state.currentSession?.completedId){
   session=state.history.find(h=>h.id===state.currentSession.completedId);
 }else{
   const endedAt=new Date(),startedAt=state.currentSession?.startedAt?new Date(state.currentSession.startedAt):endedAt;
   session={id:state.currentSession?.id||`session-${Date.now()}`,date:endedAt.toLocaleDateString(),dateKey:localDateKey(endedAt),completedAt:endedAt.toISOString(),startedAt:startedAt.toISOString(),durationMs:Math.max(0,endedAt-startedAt),name:"Full Body A",exercises:sessionExerciseSnapshot(),equipment:deepCopy(state.equipment)};
   state.sessions++;state.history.push(session);state.currentSession={completedId:session.id};state.step=0;state.setupReady=false;save();
 }
 const totals=sessionTotals(session),rating=state.workoutRatings[session.id]||"";
 app.innerHTML=`<section class="card complete upgraded-complete"><div class="check">✓</div><span class="pill">SESSION ${state.sessions} COMPLETE</span><h2>You crushed it!</h2><p>${formatDuration(session.durationMs)} • ${totals.completedSets} sets • ${totals.totalReps} reps</p></section>
 <section class="card workout-rating"><h3>How did it feel?</h3><p>Your answer helps guide future load increases.</p><div class="rating-grid">${["Easy","Good","Tough","Exhausting"].map((x,i)=>`<button data-rating="${x}" class="${rating===x?"selected":""}"><span>${["😀","🙂","😐","😫"][i]}</span>${x}</button>`).join("")}</div><label>Workout notes<textarea id="workoutNote" placeholder="Energy, discomfort, equipment changes or wins...">${session.note||""}</textarea></label></section>
 <button class="primary" id="saveFinish">Save feedback and view workout</button><button class="secondary" id="home">Return home</button>`;
 document.querySelectorAll("[data-rating]").forEach(b=>b.onclick=()=>{state.workoutRatings[session.id]=b.dataset.rating;save();summary()});
 document.querySelector("#saveFinish").onclick=()=>{session.note=document.querySelector("#workoutNote").value.trim();save();state.historyView=session.id;setTab("progress")};
 document.querySelector("#home").onclick=()=>{session.note=document.querySelector("#workoutNote").value.trim();save();setTab("home")};
}

function library(){
 const extras=window.EXTRA_LIBRARY_DATA||[],all=[...data,...extras];
 const category=state.libraryCategory;
 let content="";
 if(category==="strength"){
   const strength=all.filter(x=>x.type==="strength");
   content=`<div class="exercise-library-grid">${strength.map((x,i)=>`<button class="exercise-library-tile" data-lib-name="${x.name}"><img src="${x.demoImage}" alt=""><span class="tag">${x.type}</span><strong>${x.name}</strong><small>${x.muscles||"Strength"}</small></button>`).join("")}</div>`;
 }else if(category==="cardio"){
   const cards=[
    ["Treadmill Walking","assets/phase3/treadmill-walking.jpg"],["Treadmill Incline Walk","assets/phase3/treadmill-incline-walk.jpg"],["Treadmill HIIT Intervals","assets/phase3/treadmill-hiit-intervals.jpg"],["Rower Technique","assets/phase3/rower-technique.jpg"],["KICKR CORE Endurance Ride","assets/phase3/kickr-core-endurance-ride.jpg"],["KICKR CORE HIIT Ride","assets/phase3/kickr-core-hiit-ride.jpg"]
   ];
   content=`<div class="visual-guide-grid">${cards.map(([n,img])=>`<button data-guide-image="${img}" data-guide-title="${n}"><img src="${img}"><strong>${n}</strong></button>`).join("")}</div>`;
 }else if(category==="mobility"){
   const cards=[["Dynamic Warm-Up","assets/phase3/dynamic-warm-up.jpg"],["Hip & Glute Mobility","assets/phase3/hip-glute-mobility.jpg"],["Thoracic & Shoulder Mobility","assets/phase3/thoracic-shoulder-mobility.jpg"],["Core Activation","assets/phase3/core-activation.jpg"],["Cool Down & Recovery","assets/phase3/cool-down-recovery.jpg"]];
   content=`<div class="visual-guide-grid">${cards.map(([n,img])=>`<button data-guide-image="${img}" data-guide-title="${n}"><img src="${img}"><strong>${n}</strong></button>`).join("")}</div>`;
 }else if(category==="setup"){
   const cards=[["M1 Attachment Reference","assets/phase1/m1-attachment-reference.jpg"],["M1 Setup Guide","assets/phase1/m1-setup-guide.jpg"],["Smith Machine Setup","assets/phase1/smith-machine-setup-guide.jpg"],["KICKR CORE Bike Setup","assets/phase3/kickr-core-bike-setup.jpg"]];
   content=`<div class="visual-guide-grid">${cards.map(([n,img])=>`<button data-guide-image="${img}" data-guide-title="${n}"><img src="${img}"><strong>${n}</strong></button>`).join("")}</div>`;
 }else{
   content=`<div class="recovery-library"><img src="assets/phase3/cool-down-recovery.jpg"><h3>Recovery dashboard</h3><p>Use the Progress tab to review trained muscles, workout feedback and recovery readiness.</p><button class="primary" id="openRecovery">Open Progress</button></div>`;
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

function progress(){
 if(state.historyView){const session=state.history.find(h=>h.id===state.historyView);if(session)return sessionDetail(session);state.historyView=null}
 const records=personalRecords().slice(0,6),muscles=recentMuscles(),achievements=earnedAchievements();
 app.innerHTML=`<section class="card"><span class="pill">PROGRESS CENTER</span><h2>Your Road to 12%</h2><div class="brief-grid"><div><small>SESSIONS</small><strong>${state.history.length}</strong></div><div><small>LIFETIME VOLUME</small><strong>${Math.round(totalLifetimeVolume()).toLocaleString()} lb</strong></div><div><small>WEIGHT</small><strong>${state.weight} lb</strong></div><div><small>WAIST</small><strong>${state.waist} in</strong></div></div><div class="measurement-row"><input id="w" value="${state.weight}" inputmode="decimal"><input id="wa" value="${state.waist}" inputmode="decimal"><button class="secondary" id="saveP">Save check-in</button></div></section>
 <section class="card"><h2>Muscle recovery map</h2><p class="muted">Red muscles were trained recently. Green groups are ready or were not emphasized in the last three sessions.</p><div class="muscle-map">${muscles.map(m=>`<div class="${m.trained?"recovering":"ready"}"><span></span><strong>${m.label}</strong><small>${m.trained?"Recovering":"Ready"}</small></div>`).join("")}</div></section>
 <section class="card"><h2>Personal records</h2>${records.length?`<div class="pr-grid">${records.map(r=>`<div><small>${r.name}</small><strong>${r.bestWeight} lb</strong><span>Best volume ${Math.round(r.bestVolume).toLocaleString()} lb</span></div>`).join("")}</div>`:'<p class="muted">Complete strength workouts to establish your first records.</p>'}</section>
 <section class="card"><h2>Achievements</h2><div class="achievement-grid">${achievements.length?achievements.map(([a,d])=>`<div><span>✓</span><strong>${a}</strong><small>${d}</small></div>`).join(""):'<p class="muted">Your first achievement unlocks after one completed workout.</p>'}</div></section>
 <section class="card"><h2>Workout history</h2>${state.history.length?state.history.slice().reverse().map(h=>{const t=sessionTotals(h),rating=state.workoutRatings[h.id]||"";return `<button class="history-card" data-history="${h.id}"><span class="history-check">✓</span><span><strong>${h.name}</strong><small>${h.date} • ${formatDuration(h.durationMs)} • ${t.completedSets} sets${rating?` • ${rating}`:""}</small></span><span class="history-arrow">›</span></button>`}).join(""):'<p class="muted">No completed sessions yet.</p>'}</section>`;
 document.querySelector("#saveP").onclick=()=>{state.weight=document.querySelector("#w").value;state.waist=document.querySelector("#wa").value;save();progress()};
 document.querySelectorAll("[data-history]").forEach(btn=>btn.onclick=()=>{state.historyView=btn.dataset.history;save();progress()});
}


/* =========================================================
   ROAD TO 12% — VERSION 11.3.1 SIMPLIFIED EXPERIENCE
   ========================================================= */

/* Restore the motivating Home experience while retaining
   Version 11 intelligence inside Library and Progress. */
function home(){
 const day=weekPlan[state.selectedDay];
 const done=todayCompleted();
 const completed=completedTodaySession();

 if(done){
   const totals=sessionTotals(completed);
   const tomorrow=weekPlan[(state.selectedDay+1)%weekPlan.length];
   app.innerHTML=`<section class="celebration-hero v111-celebration">
     <div class="celebration-burst">🏆</div>
     <span class="pill">TODAY COMPLETE</span>
     <h2>You crushed it, ${state.preferredName}!</h2>
     <p>Workout #${state.sessions||state.history.length} on the Road to 12% is officially complete.</p>
     <div class="celebration-stats">
       <div><small>WORKOUT</small><strong>${completed.name}</strong></div>
       <div><small>TIME</small><strong>${formatDuration(completed.durationMs)}</strong></div>
       <div><small>SETS SAVED</small><strong>${totals.completedSets}</strong></div>
     </div>
     <button class="primary" id="viewCompleted">View today’s completed workout</button>
     <small class="recovery-message">Hydrate, eat well, and recover. See you tomorrow.</small>
   </section>

   <section class="card tomorrow-simple">
     <div class="section-title-row">
       <div><small>NEXT UP</small><h2>${tomorrow.title}</h2></div>
       <span class="tomorrow-time">${tomorrow.time}</span>
     </div>
     <p>${tomorrow.detail}</p>
     <div class="focus-chips">${tomorrow.focus.split(",").map(x=>`<span>${x}</span>`).join("")}</div>
     <button class="secondary" id="previewTomorrow">Preview tomorrow</button>
   </section>

   <section class="card week-card">
     <h2>Training schedule</h2>
     <p class="muted">Tap any day to preview its plan.</p>
     <div class="week-strip">${weekPlan.map((d,i)=>`<button class="day-button ${i===state.selectedDay?"selected":""} ${i===0?"completed-day":""}" data-day="${i}">
       <span class="day-icon">${i===0?"✅":d.icon}</span>
       <strong>${d.short}</strong>
       <small>${i===0?"Complete":i===state.selectedDay?"Selected":""}</small>
     </button>`).join("")}</div>
   </section>

   <section class="stats">
     <div><small>WEIGHT</small><strong>${state.weight} lb</strong></div>
     <div><small>WAIST</small><strong>${state.waist} in</strong></div>
     <div><small>SESSIONS</small><strong>${state.sessions}</strong></div>
   </section>`;

   document.querySelector("#viewCompleted").onclick=()=>{state.historyView=completed.id;setTab("progress")};
   document.querySelector("#previewTomorrow").onclick=()=>showDayPlan((state.selectedDay+1)%weekPlan.length);
   document.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{
     state.selectedDay=+b.dataset.day;
     state.previewDay=state.selectedDay;
     save();
     showDayPlan(state.selectedDay);
   });
   return;
 }

 app.innerHTML=`<section class="hero v111-hero">
   <img src="${window.HERO_IMAGE}">
   <div class="shade"></div>
   <div class="hero-copy">
     <span class="pill">WEEK 1 • FOUNDATION</span>
     <h2>${day.title}</h2>
     <p>${day.detail}</p>
     <button class="primary" id="start">${day.action==="workout"?"Start today’s guided workout":"Open selected day"}</button>
   </div>
 </section>

 <section class="card week-card">
   <h2>Training schedule</h2>
   <p class="muted">Tap any day to view its workout, time, focus and exercises.</p>
   <div class="week-strip">${weekPlan.map((d,i)=>`<button class="day-button ${i===state.selectedDay?"selected":""}" data-day="${i}">
     <span class="day-icon">${d.icon}</span>
     <strong>${d.short}</strong>
     <small>${i===state.selectedDay?"Selected":""}</small>
   </button>`).join("")}</div>
   <div class="selected-plan">
     <div class="large-icon">${day.icon}</div>
     <div><h3>${day.title}</h3><p class="muted">${day.detail}</p></div>
   </div>
 </section>

 <section class="stats">
   <div><small>WEIGHT</small><strong>${state.weight} lb</strong></div>
   <div><small>WAIST</small><strong>${state.waist} in</strong></div>
   <div><small>SESSIONS</small><strong>${state.sessions}</strong></div>
 </section>`;

 document.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{
   state.selectedDay=+b.dataset.day;
   state.previewDay=state.selectedDay;
   save();
   showDayPlan(state.selectedDay);
 });

 document.querySelector("#start").onclick=()=>{
   const action=weekPlan[state.selectedDay].action;
   if(action==="workout"){
     startNewSession();
     state.tab="workout";
     save();
     workout();
   }else if(action==="progress"){
     setTab("progress");
   }else{
     showDayPlan();
   }
 };
}

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
function exercise(ex,workoutData=activeWorkout()){
 if(ex&&PHASE2_ASSET_MAP[ex.name])ex.demoImage=PHASE2_ASSET_MAP[ex.name];
 if(ex&&PHASE3_ASSET_MAP[ex.name])ex.demoImage=PHASE3_ASSET_MAP[ex.name];

 const pct=Math.round(state.step/workoutData.length*100);
 const strength=ex.type==="strength";

 if(strength&&!state.logs[ex.name]){
   state.logs[ex.name]=Array(ex.sets).fill(null);
 }

 const currentBlock=setupBlockLabel(ex);
 const previous=workoutData[state.step-2];
 const blockChanged=!previous||setupBlockLabel(previous)!==currentBlock;

 app.innerHTML=`<section class="card workout-card v111-workout-card">
   <div class="phase">
     <span class="tag">${ex.type}</span>
     <strong>${state.step}/${workoutData.length}</strong>
   </div>
   <div class="progress workout-progress"><i style="width:${pct}%"></i></div>

   ${blockChanged?`<div class="setup-block-banner compact-block-banner">
     <small>SETUP FOR THIS SECTION</small>
     <strong>${currentBlock}</strong>
     ${ex.m1?`<span>Complete the exercises in this pulley zone before adjusting it again.</span>`:""}
   </div>`:""}

   <h2>${ex.name}</h2>
   <p class="muted workout-subtitle">${ex.muscles}</p>

   <div class="why-card">
     <h3>Why this exercise?</h3>
     <p>${ex.why||"Builds strength, control and confidence."}</p>
   </div>

   ${attachmentPhotoMarkup(ex)}

   ${ex.m1
     ?m1SetupCoach(ex)
     :`<div class="simple-setup-flow"><section class="setup-section">
        <div class="section-number">1</div>
        <div><small>SETUP</small><h3>Get ready</h3>${ex.setup.map(x=>`<p>${x}</p>`).join("")}</div>
      </section></div>`}

   <section class="exercise-visual-section">
     <div class="section-heading">
       <span>▶</span>
       <div><small>VISUAL GUIDE</small><h3>Start, move and finish</h3></div>
     </div>
     <button class="exercise-asset-button" id="openAsset">
       <img class="exercise-asset-image" src="${ex.demoImage}" alt="${ex.name} visual guide">
       <span>Tap to enlarge</span>
     </button>
   </section>

   <section class="movement-instructions">
     <div class="section-heading">
       <span>✓</span>
       <div><small>PERFORM THE MOVEMENT</small><h3>Step by step</h3></div>
     </div>
     <ol class="steps">${ex.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
     <div class="cue"><strong>Key cues</strong><p>${ex.cues.join(" • ")}</p></div>
   </section>

   ${smithPlateCalculator(ex)}
   ${quickSettings(ex)}

   ${strength?`<div class="weight-coach-card">
     <h3>Weight recommendation</h3>
     <p>${ex.weightRecommendation}</p>
   </div>`:""}
 </section>

 ${strength?sets(ex):timed(ex)}

 <div class="workout-actions">
   <button class="secondary" id="back">Back</button>
   <button class="primary" id="next">${state.step===workoutData.length?"Finish session":"Complete & continue"}</button>
 </div>`;

 document.querySelector("#back").onclick=()=>{
   state.step=Math.max(1,state.step-1);
   save();
   workout();
 };
 document.querySelector("#next").onclick=next;
 document.querySelector("#openAsset").onclick=()=>openExerciseAsset(ex);

 const plate=document.querySelector("#plateTotal");
 if(plate){
   plate.oninput=()=>document.querySelector("#plateResult").textContent=calculatePlates(plate.value);
 }

 if(strength)bindSets(ex);
 else bindTimer(ex);
}


function workoutLanding(){
 const workoutData=activeWorkout();
 const hasActive=!!state.currentSession && state.step>0 && state.step<=workoutData.length;
 app.innerHTML=`<section class="card workout-launch-card">
   <span class="pill">${hasActive?"WORKOUT IN PROGRESS":"TODAY’S WORKOUT"}</span>
   <h2>${hasActive?"Resume Full Body A":"Full Body A"}</h2>
   <p>${hasActive?`You are on exercise ${state.step} of ${workoutData.length}.`:"Start the guided workout when you are ready. You will move through it one step at a time."}</p>
   <div class="launch-summary">
     <div><small>EXERCISES</small><strong>${workoutData.length}</strong></div>
     <div><small>ESTIMATED TIME</small><strong>50–60 min</strong></div>
     <div><small>FLOW</small><strong>Step by step</strong></div>
   </div>
   <button class="primary" id="launchWorkout">${hasActive?"Resume workout":"Start workout"}</button>
   ${hasActive?`<button class="secondary" id="restartWorkout">Restart workout</button>`:""}
 </section>`;
 document.querySelector("#launchWorkout").onclick=()=>{
   if(!hasActive)startNewSession();
   state.tab="workout";
   save();
   workout();
 };
 document.querySelector("#restartWorkout")?.addEventListener("click",()=>{
   if(confirm("Restart today’s workout from the beginning?")){
     startNewSession();
     state.tab="workout";
     save();
     workout();
   }
 });
}



/* =========================================================
   ROAD TO 12% — VERSION 11.3.1 STABILITY REPAIR
   ========================================================= */

const V1131_ANATOMICAL_ASSETS={
 "Treadmill Walk":"assets/phase3/treadmill-walking.jpg",
 "Easy Treadmill Cooldown":"assets/phase3/treadmill-walking.jpg",
 "Arm Circles":"assets/phase3/dynamic-warm-up.jpg",
 "Bodyweight Squat":"assets/phase3/dynamic-warm-up.jpg",
 "Hip Hinge":"assets/phase3/hip-glute-mobility.jpg",
 "Post-Workout Stretch":"assets/phase3/cool-down-recovery.jpg",
 "Goblet Squat":"assets/phase3/dynamic-warm-up.jpg",
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
 const payload={
   app:"Road to 12%",
   version:"11.3.1",
   exportedAt:new Date().toISOString(),
   state:{
     preferredName:state.preferredName,
     weight:state.weight,
     waist:state.waist,
     sessions:state.sessions,
     history:state.history,
     workoutRatings:state.workoutRatings||{},
     dailyCheckins:state.dailyCheckins||{},
     achievements:state.achievements||{},
     equipment:state.equipment,
     attachmentPhotos:state.attachmentPhotos||{}
   }
 };
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
     const incoming=payload.state||payload;
     if(!Array.isArray(incoming.history))throw new Error("No workout history found.");
     state.history=v1131NormalizeHistory([...(state.history||[]),...incoming.history]);
     state.sessions=Math.max(Number(state.sessions)||0,Number(incoming.sessions)||0,state.history.length);
     state.workoutRatings=Object.assign({},incoming.workoutRatings||{},state.workoutRatings||{});
     state.dailyCheckins=Object.assign({},incoming.dailyCheckins||{},state.dailyCheckins||{});
     state.achievements=Object.assign({},incoming.achievements||{},state.achievements||{});
     state.equipment=Object.assign({},state.equipment||{},incoming.equipment||{});
     state.attachmentPhotos=Object.assign({},state.attachmentPhotos||{},incoming.attachmentPhotos||{});
     if(incoming.weight)state.weight=incoming.weight;
     if(incoming.waist)state.waist=incoming.waist;
     if(incoming.preferredName)state.preferredName=incoming.preferredName;
     save();
     alert(`Backup imported. ${state.history.length} workout${state.history.length===1?"":"s"} available.`);
     state.historyView=null;
     progress();
   }catch(error){
     alert(`Could not import backup: ${error.message}`);
   }
 };
 reader.readAsText(file);
}

function home(){
 const selected=weekPlan[state.selectedDay];
 const latest=latestV1131Session();
 const historyCount=state.history.length;
 const workoutData=activeWorkout();
 const active=!!state.currentSession&&state.step>0&&state.step<=workoutData.length&&hasActualWorkoutProgress();

 let top;
 if(latest){
   const totals=sessionTotals(latest);
   top=`<section class="celebration-hero v113-achievement">
     <div class="celebration-burst">🏆</div>
     <span class="pill">LATEST ACHIEVEMENT</span>
     <h2>You crushed it, ${state.preferredName}!</h2>
     <p>${latest.name||"Workout"} was completed on ${v1131DateLabel(latest)}.</p>
     <div class="celebration-stats">
       <div><small>WORKOUT</small><strong>${latest.name||"Completed workout"}</strong></div>
       <div><small>TIME</small><strong>${latest.durationMs?formatDuration(latest.durationMs):"Duration not captured"}</strong></div>
       <div><small>SETS SAVED</small><strong>${totals.completedSets}</strong></div>
     </div>
     <button class="primary" id="viewLatestAchievement">View completed workout</button>
     <small class="recovery-message">${historyCount} workout${historyCount===1?"":"s"} listed in Progress.</small>
   </section>`;
 }else{
   top=`<section class="hero v111-hero">
     <img src="${window.HERO_IMAGE}">
     <div class="shade"></div>
     <div class="hero-copy">
       <span class="pill">WEEK 1 • FOUNDATION</span>
       <h2>${selected.title}</h2>
       <p>${selected.detail}</p>
       <button class="primary" id="startWorkout">${active?"Resume guided workout":"Start today’s guided workout"}</button>
     </div>
   </section>`;
 }

 app.innerHTML=`${top}
 ${latest?`<section class="card next-workout-card">
   <div class="section-title-row">
     <div><small>${active?"WORKOUT IN PROGRESS":"NEXT WORKOUT"}</small><h2>${selected.title}</h2></div>
     <span class="tomorrow-time">${selected.time}</span>
   </div>
   <p>${selected.detail}</p>
   <div class="focus-chips">${selected.focus.split(",").map(x=>`<span>${x}</span>`).join("")}</div>
   <button class="primary" id="startWorkout">${active?"Resume guided workout":"Start guided workout"}</button>
   <button class="secondary" id="previewSelected">Preview workout</button>
 </section>`:""}
 <section class="card week-card">
   <div class="section-title-row">
     <div><small>YOUR PLAN</small><h2>Training schedule</h2></div>
     <button class="history-count-button" id="openHistory">${historyCount} saved</button>
   </div>
   <p class="muted">Tap any day to view its workout, time, focus and exercises.</p>
   <div class="week-strip">${weekPlan.map((d,i)=>`<button class="day-button ${i===state.selectedDay?"selected":""}" data-day="${i}">
     <span class="day-icon">${d.icon}</span>
     <strong>${d.short}</strong>
     <small>${i===state.selectedDay?"Selected":""}</small>
   </button>`).join("")}</div>
   <div class="selected-plan">
     <div class="large-icon">${selected.icon}</div>
     <div><h3>${selected.title}</h3><p class="muted">${selected.detail}</p></div>
   </div>
 </section>
 <section class="stats">
   <div><small>WEIGHT</small><strong>${state.weight} lb</strong></div>
   <div><small>WAIST</small><strong>${state.waist} in</strong></div>
   <div><small>HISTORY</small><strong>${historyCount}</strong></div>
 </section>`;

 document.querySelector("#viewLatestAchievement")?.addEventListener("click",()=>{
   state.historyView=latest.id;
   state.tab="progress";
   save();
   progress();
 });
 document.querySelector("#openHistory").onclick=()=>{
   state.historyView=null;
   state.tab="progress";
   save();
   progress();
 };
 document.querySelector("#previewSelected")?.addEventListener("click",()=>showDayPlan(state.selectedDay));
 document.querySelectorAll("[data-day]").forEach(button=>{
   button.onclick=()=>{
     state.selectedDay=Number(button.dataset.day);
     state.previewDay=state.selectedDay;
     save();
     showDayPlan(state.selectedDay);
   };
 });
 document.querySelector("#startWorkout")?.addEventListener("click",()=>{
   if(!active)startNewSession();
   state.tab="workout";
   save();
   workout();
 });
}

function workoutLanding(){
 const workoutData=activeWorkout();
 const hasActive=!!state.currentSession&&state.step>0&&state.step<=workoutData.length&&hasActualWorkoutProgress();
 app.innerHTML=`<section class="card workout-launch-card">
   <span class="pill">${hasActive?"WORKOUT IN PROGRESS":"TODAY’S WORKOUT"}</span>
   <h2>${hasActive?"Resume Full Body A":"Full Body A"}</h2>
   <p>${hasActive?`You are on exercise ${state.step} of ${workoutData.length}.`:"Start the guided workout when you are ready. You will move through it one step at a time."}</p>
   <div class="launch-summary">
     <div><small>EXERCISES</small><strong>${workoutData.length}</strong></div>
     <div><small>ESTIMATED TIME</small><strong>50–60 min</strong></div>
     <div><small>FLOW</small><strong>Step by step</strong></div>
   </div>
   <button class="primary" id="launchWorkout">${hasActive?"Resume workout":"Start workout"}</button>
   ${hasActive?`<button class="secondary" id="restartWorkout">Restart workout</button>`:""}
 </section>`;

 document.querySelector("#launchWorkout").onclick=()=>{
   if(!hasActive)startNewSession();
   state.tab="workout";
   save();
   workout();
 };
 document.querySelector("#restartWorkout")?.addEventListener("click",()=>{
   if(confirm("Restart today’s workout from the beginning?")){
     startNewSession();
     state.tab="workout";
     save();
     workout();
   }
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

 app.innerHTML=`<section class="card">
   <span class="pill">PROGRESS CENTER</span>
   <h2>Your Road to 12%</h2>
   <div class="brief-grid">
     <div><small>SESSIONS</small><strong>${state.history.length}</strong></div>
     <div><small>LIFETIME VOLUME</small><strong>${Math.round(totalLifetimeVolume()).toLocaleString()} lb</strong></div>
     <div><small>WEIGHT</small><strong>${state.weight} lb</strong></div>
     <div><small>WAIST</small><strong>${state.waist} in</strong></div>
   </div>
   <div class="measurement-row">
     <input id="w" value="${state.weight}" inputmode="decimal">
     <input id="wa" value="${state.waist}" inputmode="decimal">
     <button class="secondary" id="saveP">Save check-in</button>
   </div>
 </section>

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
       <span class="history-check">✓</span>
       <span><strong>${h.name}</strong><small>${h.date} • ${h.durationMs?formatDuration(h.durationMs):"Duration not captured"} • ${t.completedSets} sets${rating?` • ${rating}`:""}</small></span>
       <span class="history-arrow">›</span>
     </button>`;
   }).join(""):'<p class="muted">No completed sessions yet.</p>'}
 </section>`;

 document.querySelector("#saveP").onclick=()=>{
   state.weight=document.querySelector("#w").value;
   state.waist=document.querySelector("#wa").value;
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
}

function exercise(ex,workoutData=activeWorkout()){
 if(V1131_ANATOMICAL_ASSETS[ex.name])ex.demoImage=V1131_ANATOMICAL_ASSETS[ex.name];
 if(ex&&PHASE2_ASSET_MAP[ex.name])ex.demoImage=PHASE2_ASSET_MAP[ex.name];
 if(ex&&PHASE3_ASSET_MAP[ex.name])ex.demoImage=PHASE3_ASSET_MAP[ex.name];
 if(V1131_ANATOMICAL_ASSETS[ex.name])ex.demoImage=V1131_ANATOMICAL_ASSETS[ex.name];

 const pct=Math.round(state.step/workoutData.length*100);
 const strength=ex.type==="strength";
 if(strength&&!state.logs[ex.name])state.logs[ex.name]=Array(ex.sets).fill(null);

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
   <section class="exercise-visual-section">
     <div class="section-heading"><span>▶</span><div><small>VISUAL GUIDE</small><h3>Start, move and finish</h3></div></div>
     <button class="exercise-asset-button" id="openAsset"><img class="exercise-asset-image" src="${ex.demoImage}" alt="${ex.name} visual guide"><span>Tap to enlarge</span></button>
   </section>
   <section class="movement-instructions">
     <div class="section-heading"><span>✓</span><div><small>PERFORM THE MOVEMENT</small><h3>Step by step</h3></div></div>
     <ol class="steps">${ex.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
     <div class="cue"><strong>Key cues</strong><p>${ex.cues.join(" • ")}</p></div>
   </section>
   ${smithPlateCalculator(ex)}
   ${quickSettings(ex)}
   ${strength?`<div class="weight-coach-card"><h3>Weight recommendation</h3><p>${ex.weightRecommendation}</p></div>`:""}
 </section>
 ${strength?sets(ex):timed(ex)}
 <div class="workout-actions"><button class="secondary" id="back">Back</button><button class="primary" id="next">${state.step===workoutData.length?"Finish session":"Complete & continue"}</button></div>`;

 document.querySelector("#back").onclick=()=>{
   state.step=Math.max(1,state.step-1);
   save();
   workout();
 };
 document.querySelector("#next").onclick=next;
 document.querySelector("#openAsset").onclick=()=>openExerciseAsset(ex);
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
   progress();
 }else{
   render();
 }
};

migrateHistory();
recoverV1131History();
repairFalseActiveWorkout();
save();

/* =========================================================
   ROAD TO 12% — VERSION 11.3.1 LAUNCH AND NAVIGATION REPAIR
   ========================================================= */
(function repairV112LaunchState(){
 const migrationKey="road12-v11-2-launch-repaired";
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

render();
