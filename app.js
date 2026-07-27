
const PROFILE={name:"James",weight:221,bodyFat:31,height:"6'1\"",age:46,waist:43,targetLow:190,targetHigh:200};
const EXERCISES=[
{name:"Cable Chest Press",scheme:"3 × 10",sets:3,reps:10,rest:75,img:"assets/gym_front.jpeg",label:"Dual D-handles • pulley positions 7 and 7",markers:true,setup:[["Pulley L","7"],["Pulley R","7"],["Attachment","Dual D-handles"],["Bench","Upright or standing"]],cues:["Start lighter than expected and leave about three reps in reserve.","Keep ribs down and shoulders away from your ears.","Press forward and slightly inward.","Return slowly without letting elbows drift too far behind your torso."]},
{name:"Lat Pulldown",scheme:"3 × 10",sets:3,reps:10,rest:75,img:"assets/gym_front.jpeg",label:"Lat bar • top fixed cable point",setup:[["Pulley","Top fixed point"],["Attachment","Lat bar"],["Bench","Upright"],["Grip","Outside shoulders"]],cues:["Sit tall with a small backward lean.","Pull elbows toward your ribs.","Bring the bar toward the upper chest.","Avoid swinging or yanking."]},
{name:"Seated Cable Row",scheme:"3 × 10",sets:3,reps:10,rest:75,img:"assets/gym_front.jpeg",label:"Straight bar • pulley position 1",setup:[["Pulley","1"],["Attachment","Straight bar"],["Bench","Flat / seated"],["Torso","Tall"]],cues:["Reach forward without rounding the lower back.","Drive elbows behind you.","Pause at the ribs.","Control the return."]},
{name:"Goblet Squat",scheme:"3 × 8",sets:3,reps:8,rest:75,img:"assets/bench_flat.jpeg",label:"10–15 lb dumbbell • flat bench behind as a depth target",setup:[["Weight","10–15 lb dumbbell"],["Bench","Flat"],["Feet","Shoulder width"],["Depth","Light bench touch"]],cues:["Hold one dumbbell at chest level.","Sit down and back until you lightly touch the bench.","Keep the whole foot planted.","Stand without bouncing."]},
{name:"Rope Face Pull",scheme:"2 × 12",sets:2,reps:12,rest:60,img:"assets/rope.png",label:"Rope attachment • pulley position 13",setup:[["Pulley","13"],["Attachment","Rope"],["Bench","None"],["Load","Very light"]],cues:["Pull toward eyebrow level.","Separate the rope ends at the finish.","Keep ribs down and neck relaxed.","Stop before the shoulders shrug."]},
{name:"Cable Glute Kickback",scheme:"2 × 12 each",sets:2,reps:12,rest:45,img:"assets/ankle.png",label:"Ankle strap • pulley position 1",setup:[["Pulley","1"],["Attachment","Ankle strap"],["Support","Hold upright"],["Range","No back arch"]],cues:["Keep hips square.","Drive the heel backward.","Pause and squeeze the glute.","Reduce range if the lower back moves."]},
{name:"Treadmill Zone 2",scheme:"15 minutes",sets:1,reps:15,rest:0,img:"assets/gym_wide.jpeg",label:"Conversational walking pace",setup:[["Mode","Manual"],["Incline","0–3%"],["Effort","Easy–moderate"],["Duration","15 min"]],cues:["You should be able to speak in complete sentences.","Start slower than you think.","Do not chase calories.","Finish feeling like you could continue."]}
];
const EQUIPMENT=[
["RitFit M1 Pro","Smith machine, dual stacks and cable system","assets/gym_front.jpeg"],
["Adjustable Bench","Flat, incline and upright positions","assets/bench_incline.jpeg"],
["Dual D-handles","Independent pressing, rows and fly movements","assets/attachments.jpeg"],
["Lat Bar","Pulldowns and straight-arm work","assets/attachments.jpeg"],
["Straight Bar","Rows, curls and pushdowns","assets/attachments.jpeg"],
["Triceps Rope","Face pulls, pushdowns, curls and crunches","assets/rope.png"],
["Ankle Straps","Kickbacks, abduction and adduction","assets/ankle.png"],
["Cardio Equipment","Treadmill, Wahoo bike and rower","assets/gym_wide.jpeg"]
];
let s=JSON.parse(localStorage.getItem("road12v1")||"{}");
s.tab??="home";s.exercise??=0;s.logs??={};s.sessions??=[];s.checkins??=[];s.timerEnd??=null;s.programDay??=1;
const app=document.getElementById("app");
const save=()=>localStorage.setItem("road12v1",JSON.stringify(s));
function elem(tag,cls,html){const n=document.createElement(tag);if(cls)n.className=cls;if(html!==undefined)n.innerHTML=html;return n}
function syncNav(){document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.tab===s.tab))}
function render(){syncNav();({home,workout,library,equipment,progress}[s.tab]||home)()}
function home(){
 const last=s.checkins.at(-1); const w=last?.weight||PROFILE.weight; const waist=last?.waist||PROFILE.waist;
 const done=Object.values(s.logs).flat().filter(Boolean).length,total=EXERCISES.reduce((n,e)=>n+e.sets,0),pct=Math.round(done/total*100);
 app.innerHTML=`<section class="hero"><img src="assets/gym_wide.jpeg"><div class="hero-copy"><span class="pill">WEEK 1 • DAY ${s.programDay}</span><h2>Full Body A</h2><p>7 exercises • approximately 45 minutes</p><button class="btn primary wide" id="start">Start workout</button></div></section>
 <section class="grid3"><div class="stat"><span>WEIGHT</span><strong>${w} lb</strong></div><div class="stat"><span>WAIST</span><strong>${wa} in</strong></div><div class="stat"><span>COMPLETE</span><strong>${pct}%</strong></div></section>
 <section class="card"><span class="eyebrow">TODAY'S PLAN</span><h2>Foundation Session</h2><p class="muted">Technique first. Stop every strength set with roughly three good reps left.</p><div id="plan"></div></section>
 <section class="card notice">First-week rule: conservative loads, controlled movement, and no grinding repetitions. Stop for sharp pain, dizziness, chest pain, or unusual shortness of breath.</section>`;
 document.getElementById("start").onclick=()=>{s.tab="workout";save();render()};
 const p=document.getElementById("plan");EXERCISES.forEach((x,i)=>{const r=elem("div","exercise-row",`<span class="num">${i+1}</span><div><strong>${x.name}</strong><small>${x.scheme}</small></div><span>›</span>`);r.onclick=()=>{s.exercise=i;s.tab="workout";save();render()};p.appendChild(r)})
}
let ticker;
function workout(){
 clearInterval(ticker);
 const x=EXERCISES[s.exercise]; s.logs[x.name]??=Array(x.sets).fill(false);
 app.innerHTML=`<section class="card workout-top"><div><span class="eyebrow">FULL BODY A</span><h2>${x.name}</h2><p class="muted">${x.scheme}</p></div><div class="progress-circle" id="circle"><span>${s.exercise+1}/${EXERCISES.length}</span></div></section>
 <section class="card"><div class="guide-img"><img src="${x.img}"><div class="overlay-label">${x.label}</div>${x.markers?'<span class="marker m-left">7</span><span class="marker m-right">7</span><span class="marker m-bench">B</span>':""}</div><div class="setup-grid" id="setup"></div><button class="btn secondary wide" id="cuesBtn">Show form cues</button><div class="cues hidden" id="cues"><ul>${x.cues.map(c=>`<li>${c}</li>`).join("")}</ul></div></section>
 <section class="card"><div class="section-head"><div><span class="eyebrow">LOG SETS</span><h3>${x.scheme}</h3></div><span class="chip">RIR 3</span></div><div id="sets"></div></section>
 ${x.rest?`<section class="card timerbox"><div><span class="eyebrow">REST TIMER</span><div class="timer" id="timer">00:${String(x.rest).padStart(2,"0")}</div></div><button class="btn secondary" id="timerBtn">Start ${x.rest}s</button></section>`:""}
 <div class="actions"><button class="btn secondary" id="back">Back</button><button class="btn primary" id="next">${s.exercise===EXERCISES.length-1?"Finish workout":"Next exercise"}</button></div>`;
 document.getElementById("circle").style.background=`conic-gradient(var(--red) ${((s.exercise+1)/EXERCISES.length)*100}%,#28303a 0)`;
 const sg=document.getElementById("setup");x.setup.forEach(([a,b])=>sg.appendChild(elem("div","setup",`<span>${a}</span><strong>${b}</strong>`)));
 document.getElementById("cuesBtn").onclick=()=>{document.getElementById("cues").classList.toggle("hidden")};
 const sets=document.getElementById("sets");
 s.logs[x.name].forEach((done,i)=>{const old=s[`${x.name}-${i}`]||{};const r=elem("div","set-row",`<strong>${i+1}</strong><input inputmode="decimal" placeholder="Weight" value="${old.weight||""}"><input inputmode="numeric" value="${old.reps||x.reps}"><button class="done ${done?"on":""}">${done?"✓":"○"}</button>`);const ins=r.querySelectorAll("input");ins[0].onchange=ins[1].onchange=()=>{s[`${x.name}-${i}`]={weight:ins[0].value,reps:ins[1].value};save()};r.querySelector("button").onclick=()=>{s.logs[x.name][i]=!s.logs[x.name][i];save();workout()};sets.appendChild(r)});
 if(x.rest){document.getElementById("timerBtn").onclick=()=>startTimer(x.rest);resumeTimer()}
 document.getElementById("back").disabled=s.exercise===0;document.getElementById("back").onclick=()=>{if(s.exercise){s.exercise--;save();workout()}};
 document.getElementById("next").onclick=()=>{if(s.exercise<EXERCISES.length-1){s.exercise++;save();workout()}else finishSession()}
}
function startTimer(seconds){s.timerEnd=Date.now()+seconds*1000;save();resumeTimer()}
function resumeTimer(){if(!s.timerEnd)return;ticker=setInterval(()=>{const rem=Math.max(0,Math.ceil((s.timerEnd-Date.now())/1000));const t=document.getElementById("timer");if(t)t.textContent=`${String(Math.floor(rem/60)).padStart(2,"0")}:${String(rem%60).padStart(2,"0")}`;if(rem<=0){clearInterval(ticker);s.timerEnd=null;save();navigator.vibrate?.([180,90,180])}},250)}
function finishSession(){s.sessions.push({date:new Date().toLocaleString(),name:"Full Body A",day:s.programDay});s.programDay+=1;s.exercise=0;s.tab="home";s.timerEnd=null;s.logs={};save();alert("Workout complete. Your session has been saved.");render()}
function library(){app.innerHTML=`<section class="card"><span class="eyebrow">EXERCISE LIBRARY</span><h2>Your M1 movements</h2><p class="muted">Tap an exercise to open the exact setup guide.</p></section><section class="card" id="lib"></section>`;const lib=document.getElementById("lib");EXERCISES.forEach((x,i)=>{const r=elem("div","exercise-row",`<span class="num">${i+1}</span><div><strong>${x.name}</strong><small>${x.label}</small></div><span>›</span>`);r.onclick=()=>{s.exercise=i;s.tab="workout";save();render()};lib.appendChild(r)})}
function equipment(){app.innerHTML=`<section class="card"><span class="eyebrow">AVAILABLE EQUIPMENT</span><h2>James' Home Gym</h2><p class="muted">The program only uses equipment you own.</p></section><section class="equip-grid" id="eq"></section>`;const q=document.getElementById("eq");EQUIPMENT.forEach(([n,d,img])=>q.appendChild(elem("article","equip",`<img src="${img}"><div><h3>${n}</h3><p>${d}</p></div>`)))}
function progress(){
 const last=s.checkins.at(-1); const current=Number(last?.weight||PROFILE.weight); const lost=Math.max(0,PROFILE.weight-current); const goalPct=Math.min(100,Math.round(lost/(PROFILE.weight-PROFILE.targetHigh)*100));
 app.innerHTML=`<section class="card"><span class="eyebrow">PROFILE</span><h2>${PROFILE.name}' Road to 12%</h2><p class="muted">${PROFILE.height} • age ${PROFILE.age} • target 190–200 lb</p><div class="bar"><span style="width:${goalPct}%"></span></div><p class="muted">${lost.toFixed(1)} lb lost from starting weight</p></section>
 <section class="card"><label>Body weight (lb)<input id="weight" inputmode="decimal" placeholder="${PROFILE.weight}"></label><label>Body fat (%)<input id="bf" inputmode="decimal" placeholder="${PROFILE.bodyFat}"></label><label>Waist at navel (in)<input id="waist" inputmode="decimal" placeholder="${PROFILE.waist}"></label><button class="btn primary wide" id="saveCheck">Save check-in</button></section>
 <section class="card"><span class="eyebrow">CHECK-IN HISTORY</span><div id="history"></div></section><section class="card"><span class="eyebrow">WORKOUT HISTORY</span><div id="sessions"></div></section>`;
 document.getElementById("saveCheck").onclick=()=>{const weight=document.getElementById("weight").value,bf=document.getElementById("bf").value,waist=document.getElementById("waist").value;if(!weight&&!bf&&!waist)return alert("Enter at least one measurement.");s.checkins.push({date:new Date().toLocaleDateString(),weight,bf,waist});save();progress()};
 const h=document.getElementById("history");if(!s.checkins.length)h.innerHTML='<div class="empty">No check-ins yet.</div>';else s.checkins.slice().reverse().forEach(c=>h.appendChild(elem("div","history",`<div><strong>${c.date}</strong><div class="muted">${c.waist?c.waist+" in waist":""}</div></div><div><strong>${c.weight?c.weight+" lb":"—"}</strong><div class="muted">${c.bf?c.bf+"% fat":""}</div></div>`)));
 const ss=document.getElementById("sessions");if(!s.sessions.length)ss.innerHTML='<div class="empty">No completed sessions yet.</div>';else s.sessions.slice().reverse().forEach(c=>ss.appendChild(elem("div","history",`<div><strong>${c.name}</strong><div class="muted">${c.date}</div></div><span>✓</span>`)))
}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{s.tab=b.dataset.tab;save();render()});
document.getElementById("reset").onclick=()=>{if(confirm("Reset all app data on this device?")){localStorage.removeItem("road12v1");location.reload()}};
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
