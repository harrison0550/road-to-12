
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
        weightEntry:{mode:"legacy",label:"Saved weight",help:"Recovered from Version 9.0 local workout data."}
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
   button.innerHTML="<strong>VISUAL LIBRARIES</strong><span>Phase 1 and Phase 2 anatomical exercise guides</span>";
   button.onclick=openVisualLibraries;
   document.body.appendChild(button);
 }
}
function render(){
 const brand=document.querySelector("#gymBrand");
 if(brand)brand.textContent=`${state.preferredName.toUpperCase()}'S HOME GYM`;
 ensurePhase1Button();clearInterval(timerId);document.body.classList.toggle("workout-mode",state.tab==="workout");nav.forEach(b=>b.classList.toggle("active",b.dataset.tab===state.tab));({home:home,workout:workout,library:library,equipment:equipment,progress:progress}[state.tab]||home)()}
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
     if(button.dataset.phase==="2"){
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
 app.innerHTML=`<section class="card"><div class="phase"><span class="pill">VERSION 9.0</span><strong>Real-workout redesign</strong></div><h2>Profile</h2><label>What should the app call you?<input id="preferredName" value="${state.preferredName}" autocomplete="given-name"></label><button class="secondary profile-save" id="saveProfile">Save name</button></section><section class="card"><h2>My Equipment</h2><p class="muted">Workouts use only equipment switched on.</p><div class="equipment-toggle-list">${items.map(([key,icon,title,note])=>`<label class="equipment-toggle"><span class="equipment-symbol">${icon}</span><span class="equipment-copy"><strong>${title}</strong><small>${note}</small></span><input type="checkbox" data-equipment="${key}" ${state.equipment[key]?"checked":""}><span class="toggle-ui"></span></label>`).join("")}</div></section>
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
 app.innerHTML=`<section class="card session-detail-header"><button class="secondary" id="historyBack">Back to history</button><div class="check small-check">✓</div><span class="pill">COMPLETED WORKOUT</span><h2>${session.name}</h2><p class="muted">${session.date} • ${formatDuration(session.durationMs)}</p><div class="brief-grid"><div><small>SETS</small><strong>${totals.completedSets}</strong></div><div><small>REPS</small><strong>${totals.totalReps}</strong></div><div><small>SELECTED VOLUME</small><strong>${Math.round(totals.selectedVolume).toLocaleString()} lb</strong></div><div><small>STATUS</small><strong>Saved</strong></div></div>${session.recoveredFromV74?`<div class="recovery-note">This session was recovered from Version 9.0. Any values still held in the old workout log are shown below.</div>`:""}</section>
 <section class="card"><h2>Exercises completed</h2><div class="history-exercise-list">${(session.exercises||[]).length?(session.exercises||[]).map(ex=>`<details class="history-exercise" open><summary><span><strong>${ex.name}</strong>${ex.originalExercise?`<small>Substituted for ${ex.originalExercise}</small>`:""}</span><span>${(ex.sets||[]).filter(s=>s?.done).length} sets</span></summary><div class="history-set-head"><span>SET</span><span>${ex.weightEntry?.mode==="dual"?"LB / STACK":"WEIGHT"}</span><span>REPS</span><span>STATUS</span></div>${(ex.sets||[]).map((s,i)=>`<div class="history-set-row"><strong>${i+1}</strong><span>${s?.weight!==undefined&&s?.weight!==""?`${s.weight} lb`:"—"}${ex.weightEntry?.mode==="dual"&&s?.weight?`<small>${Number(s.weight)*2} lb combined selected</small>`:""}</span><span>${s?.reps||"—"}</span><span>${s?.done?"✓ Complete":"Not marked"}</span></div>`).join("")||'<p class="muted">No set details were stored.</p>'}<div class="history-weight-note"><strong>${ex.weightEntry?.label||"Weight used"}</strong><p>${ex.weightEntry?.help||""}</p></div></details>`).join(""):'<p class="muted">The older session record did not contain exercise details.</p>'}</div></section>
 <button class="secondary" id="repeatHistory">Repeat this workout</button>`;
 document.querySelector("#historyBack").onclick=()=>{state.historyView=null;save();progress()};
 document.querySelector("#repeatHistory").onclick=()=>{if(confirm("Start a new Full Body A workout? This saved session will not be changed.")){state.historyView=null;startNewSession();setTab("workout")}};
}
migrateHistory();
render();
