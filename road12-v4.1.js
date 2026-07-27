
const APP_VERSION="3.1.1";
const PROFILE={name:"James",weight:221,bodyFat:31,height:"6'1\"",age:46,waist:43,targetLow:190,targetHigh:200};
const WORKOUTS={
A:[
{name:"Cable Chest Press",scheme:"3 × 10",sets:3,reps:10,rest:75,img:"assets/gym_front.jpeg",label:"Dual D-handles • pulley positions 7 and 7",markers:true,setup:[["Pulley L","7"],["Pulley R","7"],["Attachment","Dual D-handles"],["Bench","Standing or upright"]],cues:["Start lighter than expected and leave about three reps in reserve.","Keep ribs down and shoulders away from your ears.","Press forward and slightly inward.","Return slowly without letting elbows drift too far behind your torso."]},
{name:"Lat Pulldown",scheme:"3 × 10",sets:3,reps:10,rest:75,img:"assets/gym_front.jpeg",label:"Lat bar • top fixed cable point",setup:[["Pulley","Top fixed point"],["Attachment","Lat bar"],["Bench","Upright"],["Grip","Outside shoulders"]],cues:["Sit tall with a small backward lean.","Pull elbows toward your ribs.","Bring the bar toward the upper chest.","Avoid swinging or yanking."]},
{name:"Seated Cable Row",scheme:"3 × 10",sets:3,reps:10,rest:75,img:"assets/gym_front.jpeg",label:"Straight bar • pulley position 1",setup:[["Pulley","1"],["Attachment","Straight bar"],["Bench","Flat / seated"],["Torso","Tall"]],cues:["Reach forward without rounding the lower back.","Drive elbows behind you.","Pause at the ribs.","Control the return."]},
{name:"Goblet Squat",scheme:"3 × 8",sets:3,reps:8,rest:75,img:"assets/bench_flat.jpeg",label:"10–15 lb dumbbell • flat bench behind as depth target",setup:[["Weight","10–15 lb dumbbell"],["Bench","Flat"],["Feet","Shoulder width"],["Depth","Light bench touch"]],cues:["Hold one dumbbell at chest level.","Sit down and back until you lightly touch the bench.","Keep the whole foot planted.","Stand without bouncing."]},
{name:"Rope Face Pull",scheme:"2 × 12",sets:2,reps:12,rest:60,img:"assets/rope.png",label:"Rope attachment • pulley position 13",setup:[["Pulley","13"],["Attachment","Rope"],["Bench","None"],["Load","Very light"]],cues:["Pull toward eyebrow level.","Separate the rope ends at the finish.","Keep ribs down and neck relaxed.","Stop before the shoulders shrug."]},
{name:"Cable Glute Kickback",scheme:"2 × 12 each",sets:2,reps:12,rest:45,img:"assets/ankle.png",label:"Ankle strap • pulley position 1",setup:[["Pulley","1"],["Attachment","Ankle strap"],["Support","Hold upright"],["Range","No back arch"]],cues:["Keep hips square.","Drive the heel backward.","Pause and squeeze the glute.","Reduce range if the lower back moves."]},
{name:"Treadmill Zone 2",scheme:"15 minutes",sets:1,reps:15,rest:0,img:"assets/gym_wide.jpeg",label:"Conversational walking pace",setup:[["Mode","Manual"],["Incline","0–3%"],["Effort","Easy–moderate"],["Duration","15 min"]],cues:["You should be able to speak in complete sentences.","Start slower than you think.","Do not chase calories.","Finish feeling like you could continue."]}
],
B:[
{name:"Incline Cable Press",scheme:"3 × 10",sets:3,reps:10,rest:75,img:"assets/bench_incline.jpeg",label:"Bench about 30° • pulleys 5 and 5 • dual D-handles",setup:[["Pulley L","5"],["Pulley R","5"],["Attachment","Dual D-handles"],["Bench","30° incline"]],cues:["Center the bench between the towers.","Keep shoulder blades lightly set.","Press up and inward.","Stop before the shoulders roll forward."]},
{name:"Single-Arm Cable Row",scheme:"3 × 10 each",sets:3,reps:10,rest:60,img:"assets/gym_front.jpeg",label:"One D-handle • pulley position 5",setup:[["Pulley","5"],["Attachment","Single D-handle"],["Bench","None"],["Stance","Split stance"]],cues:["Keep hips square.","Pull elbow toward your back pocket.","Do not rotate the torso.","Control the reach forward."]},
{name:"Smith Romanian Deadlift",scheme:"3 × 8",sets:3,reps:8,rest:90,img:"assets/smith_hook.jpeg",label:"Smith bar • safety stops below knee level • very light load",setup:[["Bar","Smith bar"],["Safety","Below knee"],["Feet","Hip width"],["Load","Bar only first time"]],cues:["Push hips backward while keeping the bar close.","Keep knees softly bent.","Stop when hamstrings are stretched and back remains neutral.","Stand by squeezing glutes, not leaning backward."]},
{name:"Dumbbell Shoulder Press",scheme:"2 × 10",sets:2,reps:10,rest:60,img:"assets/bench_upright.jpeg",label:"Upright bench • 10 lb dumbbells",setup:[["Bench","Upright"],["Weight","10 lb each"],["Grip","Neutral or palms forward"],["Feet","Firmly planted"]],cues:["Keep ribs down.","Press without shrugging.","Lower to a comfortable depth.","Stop with two to three reps remaining."]},
{name:"Rope Triceps Pushdown",scheme:"2 × 12",sets:2,reps:12,rest:45,img:"assets/rope.png",label:"Rope • pulley position 15",setup:[["Pulley","15"],["Attachment","Rope"],["Elbows","Pinned to sides"],["Load","Light"]],cues:["Keep upper arms still.","Separate rope ends at the bottom.","Do not lean body weight into the cable.","Control the return."]},
{name:"Cable Hip Abduction",scheme:"2 × 12 each",sets:2,reps:12,rest:45,img:"assets/ankle.png",label:"Ankle strap • pulley position 1",setup:[["Pulley","1"],["Attachment","Ankle strap"],["Support","Hold upright"],["Direction","Leg moves outward"]],cues:["Stand tall.","Keep toes mostly forward.","Use a small controlled range.","Avoid leaning away from the machine."]},
{name:"Treadmill Zone 2",scheme:"20 minutes",sets:1,reps:20,rest:0,img:"assets/gym_wide.jpeg",label:"Conversational walking pace",setup:[["Mode","Manual"],["Incline","0–4%"],["Effort","Easy–moderate"],["Duration","20 min"]],cues:["Keep breathing controlled.","Use incline before speed if needed.","Stay at a pace you can sustain.","Finish with energy left."]}
]};
const EQUIPMENT=[
["RitFit M1 Pro","Smith machine, dual stacks and cable system","assets/gym_front.jpeg"],["Adjustable Bench","Flat, incline and upright positions","assets/bench_incline.jpeg"],["Dual D-handles","Independent pressing, rows and fly movements","assets/attachments.jpeg"],["Lat Bar","Pulldowns and straight-arm work","assets/attachments.jpeg"],["Straight Bar","Rows, curls and pushdowns","assets/attachments.jpeg"],["Triceps Rope","Face pulls, pushdowns, curls and crunches","assets/rope.png"],["Ankle Straps","Kickbacks, abduction and adduction","assets/ankle.png"],["Cardio Equipment","Treadmill, Wahoo bike and rower","assets/gym_wide.jpeg"]
];

function loadState(){
 let current=localStorage.getItem("road12v3");
 if(current)return JSON.parse(current);
 let old=localStorage.getItem("road12v2");
 if(old){
   const migrated=JSON.parse(old);
   localStorage.setItem("road12v3",JSON.stringify(migrated));
   return migrated;
 }
 return {};
}
let s=loadState();
s.tab??="home";s.workoutKey??="A";s.exercise??=0;s.logs??={};s.sessions??=[];s.checkins??=[];s.timerEnd??=null;s.notes??={};s.rpe??={};s.programDay??=1;s.startDate??=new Date().toISOString();s.readiness??={sleep:2,energy:2,soreness:2};s.cardio??=[];
const app=document.getElementById("app");const save=()=>localStorage.setItem("road12v3",JSON.stringify(s));
function elem(tag,cls,html){const n=document.createElement(tag);if(cls)n.className=cls;if(html!==undefined)n.innerHTML=html;return n}
function toast(msg){const t=elem("div","toast",msg);document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
function syncNav(){document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.tab===s.tab))}
function render(){syncNav();({home,workout,library,equipment,progress}[s.tab]||home)()}
function todayPlan(){const d=(new Date().getDay()+6)%7;return ["A","cardio","B","recovery","A","cardio","recovery"][d]}
function latestWeight(){return Number(s.checkins.at(-1)?.weight||PROFILE.weight)}

function schedulePlan(index){
 return [
   {type:"strength",label:"Full Body A",icon:"💪",action:"A"},
   {type:"cardio",label:"Cardio",icon:"🚶",action:"cardio"},
   {type:"strength",label:"Full Body B",icon:"💪",action:"B"},
   {type:"recovery",label:"Recovery",icon:"🧘",action:"recovery"},
   {type:"strength",label:"Full Body A",icon:"💪",action:"A"},
   {type:"cardio",label:"Cardio",icon:"🚴",action:"cardio"},
   {type:"recovery",label:"Recovery",icon:"🧘",action:"recovery"}
 ][index];
}
function launchScheduleAction(action){
 if(action==="A"||action==="B"){startWorkout(action);return}
 if(action==="cardio"){openCardioModal();return}
 openRecoveryModal();
}
function todayMission(){
 const plan=schedulePlan((new Date().getDay()+6)%7);
 const detail=plan.action==="A"?"Foundational full-body session":
              plan.action==="B"?"Second full-body session":
              plan.action==="cardio"?"Easy Zone 2 cardio":
              "Easy walk and mobility";
 return `<div class="mission-card"><span class="eyebrow">TODAY'S MISSION</span><strong>${plan.icon} ${plan.label}</strong><p>${detail}. Tap today's day card below to open it.</p></div>`;
}

function home(){
 const last=s.checkins.at(-1),w=last?.weight||PROFILE.weight,waist=last?.waist||PROFILE.waist; const plan=todayPlan(); const label=plan==="A"?"Full Body A":plan==="B"?"Full Body B":plan==="cardio"?"Treadmill Zone 2":"Recovery Day";
 app.innerHTML=`<section class="hero"><img src="assets/gym_wide.jpeg"><div class="hero-copy"><span class="pill">WEEK 1 • DAY ${s.programDay}</span><h2>${label}</h2><p>${plan==="recovery"?"Easy walk and mobility":"Guided session using your equipment"}</p><button class="btn primary wide" id="start">${plan==="recovery"?"Open recovery plan":"Start today's workout"}</button></div></section>
 <section class="grid3"><div class="stat"><span>WEIGHT</span><strong>${w} lb</strong></div><div class="stat"><span>WAIST</span><strong>${waist} in</strong></div><div class="stat"><span>SESSIONS</span><strong>${s.sessions.length}</strong></div></section>
 <section class="card"><div class="section-head"><div><span class="eyebrow">READINESS CHECK</span><h2>How do you feel?</h2></div><span class="version-badge">V3.1.1</span></div>
 ${readinessBlock("sleep","Sleep")}${readinessBlock("energy","Energy")}${readinessBlock("soreness","Soreness")}
 <div class="suggest" id="readinessAdvice">${readinessAdvice()}</div></section>
 <section class="card"><span class="eyebrow">QUICK START</span><div class="quick-grid">
 <button class="quick" data-quick="A"><strong>Full Body A</strong><small>Foundational cable work, squat pattern and treadmill.</small></button>
 <button class="quick" data-quick="B"><strong>Full Body B</strong><small>Incline press, row, Smith hinge and treadmill.</small></button>
 <button class="quick" data-quick="cardio"><strong>Cardio Log</strong><small>Record treadmill, bike or rowing sessions.</small></button>
 <button class="quick" data-quick="progress"><strong>Check-in</strong><small>Save weight, waist and body-fat estimate.</small></button>
 </div></section>
 <section class="card"><span class="eyebrow">THIS WEEK</span><h2>Training schedule</h2>${todayMission()}<div class="schedule">
 ${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>{const p=schedulePlan(i);return `<button class="day ${p.type} ${i===((new Date().getDay()+6)%7)?"today":""}" data-schedule="${p.action}" aria-label="${d}: ${p.label}"><b>${d}</b><span>${p.icon}</span><small class="day-label">${p.label.replace("Full Body ","")}</small></button>`}).join("")}</div>
 <div class="schedule-key"><span class="key-item"><span class="key-icon">💪</span>Strength</span><span class="key-item"><span class="key-icon">🚶</span>Cardio</span><span class="key-item"><span class="key-icon">🧘</span>Recovery</span><span class="key-item">Red outline = Today</span></div>
 <div class="schedule-help">Tap any day to open that workout or recovery plan.</div></section>`;
 document.getElementById("start").onclick=()=>{if(plan==="B")startWorkout("B");else if(plan==="cardio")openCardioModal();else if(plan==="recovery")openRecoveryModal();else startWorkout("A")};
 document.querySelectorAll(".ready-btn").forEach(b=>b.onclick=()=>{s.readiness[b.dataset.type]=Number(b.dataset.value);save();home()});
 document.querySelectorAll("[data-quick]").forEach(b=>b.onclick=()=>{const q=b.dataset.quick;if(q==="A"||q==="B")startWorkout(q);else if(q==="cardio")openCardioModal();else{s.tab="progress";save();render()}});
 document.querySelectorAll("[data-schedule]").forEach(b=>b.onclick=()=>launchScheduleAction(b.dataset.schedule));
}
function readinessBlock(type,label){return `<div style="margin-top:12px"><div class="section-head"><strong>${label}</strong><span class="muted">${["","Low","Okay","Good"][s.readiness[type]]}</span></div><div class="readiness">${[1,2,3].map(v=>`<button class="ready-btn ${s.readiness[type]===v?"active":""}" data-type="${type}" data-value="${v}">${v}</button>`).join("")}</div></div>`}
function readinessAdvice(){const score=s.readiness.sleep+s.readiness.energy+(4-s.readiness.soreness);if(score<=4)return "Keep today's session easy. Reduce loads and skip any movement that feels wrong.";if(score<=6)return "Normal session, but keep two to three repetitions in reserve.";return "Readiness looks good. Progress only when technique stays clean."}
function startWorkout(key){s.workoutKey=key;s.exercise=0;s.tab="workout";save();render()}
let ticker;
function currentWorkout(){return WORKOUTS[s.workoutKey]}
function priorSuggestion(x){
 const prev=s.sessions.slice().reverse().find(v=>v.details?.[x.name]); if(!prev)return "First exposure: choose a conservative load.";
 const p=prev.details[x.name]; const weights=p?.map(z=>Number(z.weight)).filter(Boolean)||[]; const rpe=prev.rpe?.[x.name];
 if(!weights.length)return "Repeat the previous setup and record the weight.";
 const max=Math.max(...weights);
 if(rpe && rpe<=6)return `Last time: ${max} lb at RPE ${rpe}. Consider the smallest available increase.`;
 if(rpe && rpe>=9)return `Last time: ${max} lb at RPE ${rpe}. Reduce slightly or repeat with cleaner reps.`;
 return `Last time: up to ${max} lb. Repeat unless every set was controlled and comfortable.`;
}
function workout(){
 clearInterval(ticker);const list=currentWorkout(),x=list[s.exercise],key=`${s.workoutKey}:${x.name}`;s.logs[key]??=Array(x.sets).fill(false);
 app.innerHTML=`<section class="card workout-top"><div><span class="eyebrow">FULL BODY ${s.workoutKey}</span><h2>${x.name}</h2><p class="muted">${x.scheme}</p></div><div class="progress-circle" id="circle"><span>${s.exercise+1}/${list.length}</span></div></section>
 <section class="card"><div class="guide-img"><img src="${x.img}"><div class="overlay-label">${x.label}</div>${x.markers?'<span class="marker m-left">7</span><span class="marker m-right">7</span><span class="marker m-bench">B</span>':""}</div><div class="setup-grid" id="setup"></div><div class="suggest">${priorSuggestion(x)}</div><button class="btn secondary wide" id="cuesBtn" style="margin-top:10px">Show form cues</button><div class="cues hidden" id="cues"><ul>${x.cues.map(c=>`<li>${c}</li>`).join("")}</ul></div></section>
 <section class="card"><div class="section-head"><div><span class="eyebrow">LOG SETS</span><h3>${x.scheme}</h3></div><span class="chip">RIR 2–3</span></div><div id="sets"></div>
 <div style="margin-top:14px"><span class="eyebrow">SET DIFFICULTY • RPE</span><div class="rpe-grid">${[5,6,7,8,9].map(v=>`<button class="rpe-btn ${s.rpe[key]===v?"active":""}" data-rpe="${v}">${v}</button>`).join("")}</div></div>
 <label style="margin-top:14px">Exercise note<textarea id="note" rows="2" placeholder="Felt easy, bench position, discomfort, etc.">${s.notes[key]||""}</textarea></label></section>
 ${x.rest?`<section class="card timerbox"><div><span class="eyebrow">REST TIMER</span><div class="timer" id="timer">00:${String(x.rest).padStart(2,"0")}</div></div><button class="btn secondary" id="timerBtn">Start ${x.rest}s</button></section>`:""}
 <div class="actions"><button class="btn secondary" id="back">Back</button><button class="btn primary" id="next">${s.exercise===list.length-1?"Finish workout":"Next exercise"}</button></div>`;
 document.getElementById("circle").style.background=`conic-gradient(var(--red) ${((s.exercise+1)/list.length)*100}%,#28303a 0)`;
 const sg=document.getElementById("setup");x.setup.forEach(([a,b])=>sg.appendChild(elem("div","setup",`<span>${a}</span><strong>${b}</strong>`)));
 document.getElementById("cuesBtn").onclick=()=>document.getElementById("cues").classList.toggle("hidden");
 const sets=document.getElementById("sets");s.logs[key].forEach((done,i)=>{const old=s[`${key}-${i}`]||{};const r=elem("div","set-row",`<strong>${i+1}</strong><input inputmode="decimal" placeholder="Weight" value="${old.weight||""}"><input inputmode="numeric" value="${old.reps||x.reps}"><button class="done ${done?"on":""}">${done?"✓":"○"}</button>`);const ins=r.querySelectorAll("input");ins[0].onchange=ins[1].onchange=()=>{s[`${key}-${i}`]={weight:ins[0].value,reps:ins[1].value};save()};r.querySelector("button").onclick=()=>{s.logs[key][i]=!s.logs[key][i];save();if(s.logs[key][i]&&x.rest)startTimer(x.rest);workout()};sets.appendChild(r)});
 document.querySelectorAll("[data-rpe]").forEach(b=>b.onclick=()=>{s.rpe[key]=Number(b.dataset.rpe);save();workout()});
 document.getElementById("note").onchange=e=>{s.notes[key]=e.target.value;save()};
 if(x.rest){document.getElementById("timerBtn").onclick=()=>startTimer(x.rest);resumeTimer()}
 document.getElementById("back").disabled=s.exercise===0;document.getElementById("back").onclick=()=>{if(s.exercise){s.exercise--;save();workout()}};
 document.getElementById("next").onclick=()=>{if(s.exercise<list.length-1){s.exercise++;save();workout()}else finishSession()}
}
function startTimer(seconds){s.timerEnd=Date.now()+seconds*1000;save();resumeTimer()}
function resumeTimer(){if(!s.timerEnd)return;ticker=setInterval(()=>{const rem=Math.max(0,Math.ceil((s.timerEnd-Date.now())/1000));const t=document.getElementById("timer");if(t)t.textContent=`${String(Math.floor(rem/60)).padStart(2,"0")}:${String(rem%60).padStart(2,"0")}`;if(rem<=0){clearInterval(ticker);s.timerEnd=null;save();navigator.vibrate?.([180,90,180]);toast("Rest complete")}},250)}
function finishSession(){
 const list=currentWorkout(),details={},rpe={};list.forEach(x=>{const key=`${s.workoutKey}:${x.name}`;details[x.name]=Array.from({length:x.sets},(_,i)=>s[`${key}-${i}`]||{});if(s.rpe[key])rpe[x.name]=s.rpe[key]});
 s.sessions.push({date:new Date().toLocaleString(),iso:new Date().toISOString(),name:`Full Body ${s.workoutKey}`,details,rpe,notes:{...s.notes}});
 s.programDay+=1;s.exercise=0;s.tab="home";s.timerEnd=null;s.logs={};s.notes={};s.rpe={};save();showSummary()
}
function showSummary(){const modal=document.getElementById("modal");modal.classList.remove("hidden");modal.innerHTML=`<div class="modal-card"><span class="eyebrow">SESSION COMPLETE</span><h2>Workout saved</h2><div class="summary-grid"><div class="setup"><span>Workout</span><strong>${s.sessions.at(-1).name}</strong></div><div class="setup"><span>Total sessions</span><strong>${s.sessions.length}</strong></div></div><p class="muted">Version 3.0 will use your weights and RPE to make the next progression suggestion.</p><button class="btn primary wide" id="closeModal">Done</button></div>`;document.getElementById("closeModal").onclick=()=>{modal.classList.add("hidden");render()}}
function openCardioModal(){const modal=document.getElementById("modal");modal.classList.remove("hidden");modal.innerHTML=`<div class="modal-card"><span class="eyebrow">CARDIO LOG</span><h2>Record a session</h2><label>Equipment<select id="cardioType"><option>Treadmill</option><option>Bike</option><option>Rower</option></select></label><label>Minutes<input id="cardioMinutes" inputmode="numeric" value="20"></label><label>Distance (optional)<input id="cardioDistance" inputmode="decimal" placeholder="Miles or meters"></label><label>Average heart rate (optional)<input id="cardioHr" inputmode="numeric"></label><div class="inline-actions"><button class="btn secondary" id="cancelCardio">Cancel</button><button class="btn primary" id="saveCardio">Save</button></div></div>`;
 document.getElementById("cancelCardio").onclick=()=>modal.classList.add("hidden");document.getElementById("saveCardio").onclick=()=>{s.cardio.push({date:new Date().toLocaleString(),type:document.getElementById("cardioType").value,minutes:document.getElementById("cardioMinutes").value,distance:document.getElementById("cardioDistance").value,hr:document.getElementById("cardioHr").value});save();modal.classList.add("hidden");toast("Cardio saved");render()}}
function openRecoveryModal(){const modal=document.getElementById("modal");modal.classList.remove("hidden");modal.innerHTML=`<div class="modal-card"><span class="eyebrow">RECOVERY DAY</span><h2>Keep it easy</h2><div class="week-card"><span class="week-icon">1</span><div><strong>Easy walk</strong><div class="muted">20–30 minutes at a conversational pace.</div></div></div><div class="week-card"><span class="week-icon">2</span><div><strong>Mobility</strong><div class="muted">Five minutes of comfortable hips, shoulders and ankles.</div></div></div><div class="week-card"><span class="week-icon">3</span><div><strong>Sleep</strong><div class="muted">Prioritize a consistent bedtime before the next strength session.</div></div></div><button class="btn primary wide" id="closeRecovery" style="margin-top:12px">Done</button></div>`;document.getElementById("closeRecovery").onclick=()=>modal.classList.add("hidden")}
function library(){const all=[...WORKOUTS.A,...WORKOUTS.B];const unique=[...new Map(all.map(x=>[x.name,x])).values()];app.innerHTML=`<section class="card"><span class="eyebrow">EXERCISE LIBRARY</span><h2>Your M1 movements</h2><p class="muted">Tap an exercise to open its setup guide.</p></section><section class="card" id="lib"></section>`;const lib=document.getElementById("lib");unique.forEach((x,i)=>{const r=elem("div","exercise-row",`<span class="num">${i+1}</span><div><strong>${x.name}</strong><small>${x.label}</small></div><span>›</span>`);r.onclick=()=>{s.workoutKey=WORKOUTS.A.some(e=>e.name===x.name)?"A":"B";s.exercise=WORKOUTS[s.workoutKey].findIndex(e=>e.name===x.name);s.tab="workout";save();render()};lib.appendChild(r)})}
function equipment(){app.innerHTML=`<section class="card"><span class="eyebrow">AVAILABLE EQUIPMENT</span><h2>James' Home Gym</h2><p class="muted">The program only uses equipment you own.</p></section><section class="equip-grid" id="eq"></section>`;const q=document.getElementById("eq");EQUIPMENT.forEach(([n,d,img])=>q.appendChild(elem("article","equip",`<img src="${img}"><div><h3>${n}</h3><p>${d}</p></div>`)))}
function chartSvg(values){
 if(values.length<2)return `<div class="empty">Save at least two weight check-ins to display a trend chart.</div>`;
 const W=340,H=160,P=22,min=Math.min(...values),max=Math.max(...values),range=Math.max(1,max-min);
 const pts=values.map((v,i)=>[P+i*(W-2*P)/(values.length-1),H-P-(v-min)*(H-2*P)/range]);
 const path=pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
 return `<div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Weight trend"><line class="chart-axis" x1="${P}" y1="${H-P}" x2="${W-P}" y2="${H-P}"/><path class="chart-line" d="${path}"/>${pts.map((p,i)=>`<circle class="chart-dot" cx="${p[0]}" cy="${p[1]}" r="4"/><text class="chart-label" x="${p[0]}" y="${Math.max(12,p[1]-9)}" text-anchor="middle">${values[i]}</text>`).join("")}</svg></div>`;
}
function progress(){
 const last=s.checkins.at(-1),current=Number(last?.weight||PROFILE.weight),lost=PROFILE.weight-current,goalPct=Math.max(0,Math.min(100,Math.round(Math.max(0,lost)/(PROFILE.weight-PROFILE.targetHigh)*100)));
 const vals=[PROFILE.weight,...s.checkins.map(c=>Number(c.weight)).filter(Boolean)];
 app.innerHTML=`<section class="card"><div class="section-head"><div><span class="eyebrow">PROFILE</span><h2>${PROFILE.name}' Road to 12%</h2></div><span class="version-badge">V3.1.1</span></div><p class="muted">${PROFILE.height} • age ${PROFILE.age} • target 190–200 lb</p><div class="bar"><span style="width:${goalPct}%"></span></div><p class="muted">${lost>=0?lost.toFixed(1)+" lb lost":Math.abs(lost).toFixed(1)+" lb above starting weight"}</p></section>
 <section class="card"><span class="eyebrow">WEIGHT TREND</span>${chartSvg(vals)}</section>
 <section class="card"><div class="metric-row"><div class="metric"><span>STRENGTH</span><strong>${s.sessions.length}</strong></div><div class="metric"><span>CARDIO</span><strong>${s.cardio.length}</strong></div><div class="metric"><span>CHECK-INS</span><strong>${s.checkins.length}</strong></div></div></section>
 <section class="card"><label>Body weight (lb)<input id="weight" inputmode="decimal" placeholder="${PROFILE.weight}"></label><label>Body fat (%)<input id="bf" inputmode="decimal" placeholder="${PROFILE.bodyFat}"></label><label>Waist at navel (in)<input id="waist" inputmode="decimal" placeholder="${PROFILE.waist}"></label><button class="btn primary wide" id="saveCheck">Save check-in</button></section>
 <section class="card"><div class="tabs"><button class="tab-pill active" data-history="strength">Strength</button><button class="tab-pill" data-history="cardio">Cardio</button><button class="tab-pill" data-history="measurements">Measurements</button></div><div id="historyPane"></div></section>
 <section class="card"><span class="eyebrow">BACKUP & RESTORE</span><p class="muted">Export before clearing Safari data or changing phones.</p><div class="inline-actions"><button class="btn secondary" id="exportBtn">Export</button><label class="btn secondary" style="margin:0;text-align:center">Import<input class="backup-input" id="importInput" type="file" accept=".json,application/json"></label></div></section>`;
 document.getElementById("saveCheck").onclick=()=>{const weight=document.getElementById("weight").value,bf=document.getElementById("bf").value,waist=document.getElementById("waist").value;if(!weight&&!bf&&!waist)return alert("Enter at least one measurement.");s.checkins.push({date:new Date().toLocaleDateString(),iso:new Date().toISOString(),weight,bf,waist});save();progress()};
 function showPane(type){document.querySelectorAll("[data-history]").forEach(b=>b.classList.toggle("active",b.dataset.history===type));const pane=document.getElementById("historyPane");pane.innerHTML="";
   const data=type==="strength"?s.sessions:type==="cardio"?s.cardio:s.checkins;
   if(!data.length){pane.innerHTML='<div class="empty">Nothing recorded yet.</div>';return}
   data.slice().reverse().forEach(c=>{
     let html="";
     if(type==="strength"){
       html=`<div><strong>${c.name}</strong><div class="muted">${c.date}</div></div><span>✓</span>`;
     }else if(type==="cardio"){
       html=`<div><strong>${c.type} • ${c.minutes} min</strong><div class="muted">${c.date}${c.distance?" • "+c.distance:""}</div></div><span>▲</span>`;
     }else{
       html=`<div><strong>${c.date}</strong><div class="muted">${c.waist?c.waist+" in waist":""}</div></div><div><strong>${c.weight?c.weight+" lb":"—"}</strong><div class="muted">${c.bf?c.bf+"% fat":""}</div></div>`;
     }
     pane.appendChild(elem("div","history",html));
   });}
 document.querySelectorAll("[data-history]").forEach(b=>b.onclick=()=>showPane(b.dataset.history));showPane("strength");
 document.getElementById("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(s,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="road-to-12-v3.1-backup.json";a.click();URL.revokeObjectURL(a.href)};
 document.getElementById("importInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{try{const restored=JSON.parse(reader.result);if(!restored||typeof restored!=="object")throw new Error();if(confirm("Replace current app data with this backup?")){s=restored;save();toast("Backup restored");render()}}catch{alert("That file is not a valid Road to 12% backup.")}};reader.readAsText(f)}
}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{s.tab=b.dataset.tab;save();render()});
document.getElementById("reset").onclick=()=>{if(confirm("Reset all app data on this device?")){localStorage.removeItem("road12v3");localStorage.removeItem("road12v2");location.reload()}};
window.addEventListener("error",event=>{
  const target=document.getElementById("app");
  if(target && !target.innerHTML.trim()){
    target.innerHTML=`<section class="card notice"><strong>Road to 12% could not finish loading.</strong><br>Please refresh Safari. Error: ${event.message||"Unknown error"}</section>`;
  }
});
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
