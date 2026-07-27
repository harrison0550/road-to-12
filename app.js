
const data=window.WORKOUT_DATA;
const state=JSON.parse(localStorage.getItem("road12v5")||"{}");
Object.assign(state,{tab:state.tab||"home",step:state.step||0,logs:state.logs||{},sessions:state.sessions||0,weight:state.weight||221,waist:state.waist||43,history:state.history||[],selectedDay:Number.isInteger(state.selectedDay)?state.selectedDay:0});
const weekPlan=[
 {short:"MON",icon:"🏋️",title:"Full Body A",detail:"Guided strength • chest, back, quads and shoulders",action:"workout"},
 {short:"TUE",icon:"🚶",title:"Cardio + Mobility",detail:"Incline treadmill and mobility recovery",action:"cardio"},
 {short:"WED",icon:"💪",title:"Full Body B",detail:"Guided strength • alternate full-body session",action:"upcoming"},
 {short:"THU",icon:"🧘",title:"Core + Recovery",detail:"Core training, stretching and easy movement",action:"recovery"},
 {short:"FRI",icon:"🏋️",title:"Full Body C",detail:"Guided strength • third weekly full-body session",action:"upcoming"},
 {short:"SAT",icon:"❤️",title:"Zone 2 Cardio",detail:"Longer easy bike, rower or treadmill session",action:"cardio"},
 {short:"SUN",icon:"📏",title:"Recovery + Check-in",detail:"Rest, waist measurement, photos and weekly review",action:"progress"}
];
const app=document.querySelector("#app"), nav=[...document.querySelectorAll("nav button")];
let timerId=null, remaining=0;
const save=()=>localStorage.setItem("road12v5",JSON.stringify(state));
function setTab(t){state.tab=t;save();render()}
nav.forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
document.querySelector("#reset").onclick=()=>{if(confirm("Reset Version 5 workout data?")){localStorage.removeItem("road12v5");location.reload()}};
function render(){clearInterval(timerId);nav.forEach(b=>b.classList.toggle("active",b.dataset.tab===state.tab));({home:home,workout:workout,library:library,equipment:equipment,progress:progress}[state.tab]||home)()}
function home(){
 const day=weekPlan[state.selectedDay];
 app.innerHTML=`<section class="hero"><img src="${window.HERO_IMAGE}"><div class="shade"></div><div class="hero-copy"><span class="pill">WEEK 1 • FOUNDATION</span><h2>${day.title}</h2><p>${day.detail}</p><button class="primary" id="start">${day.action==="workout"?"Start today's guided workout":"Open selected day"}</button></div></section>
 <section class="card week-card"><h2>Training schedule</h2><p class="muted">Tap any day to view its plan.</p><div class="week-strip">${weekPlan.map((d,i)=>`<button class="day-button ${i===state.selectedDay?"selected":""}" data-day="${i}"><span class="day-icon">${d.icon}</span><strong>${d.short}</strong><small>${i===state.selectedDay?"Selected":""}</small></button>`).join("")}</div><div class="selected-plan"><div class="large-icon">${day.icon}</div><div><h3>${day.title}</h3><p class="muted">${day.detail}</p></div></div></section>
 <section class="stats"><div><small>WEIGHT</small><strong>${state.weight} lb</strong></div><div><small>WAIST</small><strong>${state.waist} in</strong></div><div><small>SESSIONS</small><strong>${state.sessions}</strong></div></section>`;
 document.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDay=+b.dataset.day;save();home()});
 document.querySelector("#start").onclick=()=>{
   const action=weekPlan[state.selectedDay].action;
   if(action==="workout"){state.step=0;setTab("workout")}
   else if(action==="progress")setTab("progress");
   else showDayPlan();
 };
}

function showDayPlan(){
 const d=weekPlan[state.selectedDay];
 app.innerHTML=`<section class="card"><div class="phase"><span class="pill">${d.short} PLAN</span><strong>${d.icon}</strong></div><h2>${d.title}</h2><p class="muted">${d.detail}</p>${d.action==="cardio"?`<div class="selected-plan"><div class="large-icon">⏱️</div><div><h3>Recommended session</h3><p class="muted">5-minute warm-up, 25–40 minutes at conversational intensity, then a 5-minute cooldown.</p></div></div>`:`<div class="selected-plan"><div class="large-icon">✓</div><div><h3>Recovery focus</h3><p class="muted">Easy movement, hydration, mobility and no hard strength work.</p></div></div>`}</section><button class="primary" id="backHome">Back to schedule</button>`;
 document.querySelector("#backHome").onclick=()=>setTab("home");
}

function workout(){
 if(state.step===0)return briefing();
 if(state.step>data.length)return summary();
 const ex=data[state.step-1]; exercise(ex);
}
function briefing(){app.innerHTML=`<section class="card"><div class="phase"><span class="pill">SESSION BRIEFING</span><strong>55–65 min</strong></div><h2>Full Body A</h2><p class="muted">Foundation workout focused on controlled form, learning your starting weights and training the major muscle groups safely.</p><div class="brief-grid"><div><small>PRIMARY</small><strong>Chest, back, quads, shoulders</strong></div><div><small>SECONDARY</small><strong>Arms, glutes, core</strong></div><div><small>EQUIPMENT</small><strong>RitFit M1, bench, treadmill</strong></div><div><small>INTENSITY</small><strong>Leave 2–3 reps in reserve</strong></div></div></section><section class="card muscles"><h3>Today's muscle-group summary</h3><p>Push: chest, shoulders and triceps. Pull: lats, mid-back and biceps. Lower body: quads, glutes and hamstrings. Your core stabilizes every movement.</p></section><button class="primary" id="go">Begin warm-up</button>`;document.querySelector("#go").onclick=next}
function exercise(ex){
 const pct=Math.round(state.step/data.length*100), strength=ex.type==="strength";
 const key=ex.name; if(strength&&!state.logs[key])state.logs[key]=Array(ex.sets).fill(null);
 app.innerHTML=`<section class="card"><div class="phase"><span class="tag">${ex.type}</span><strong>${state.step}/${data.length}</strong></div><div class="progress"><i style="width:${pct}%"></i></div><h2>${ex.name}</h2><p class="muted">${ex.muscles}</p><div class="demo"><div class="person"><i class="head"></i><i class="torso"></i><i class="arm"></i><i class="arm left"></i><i class="leg"></i><i class="leg left"></i></div><span class="demo-label">Looping movement demonstration</span></div><div class="setup-grid">${ex.setup.map((x,i)=>`<div><small>${i===0?"SETUP":"CHECK"}</small><strong>${x}</strong></div>`).join("")}</div></section><section class="card"><h3>Step-by-step</h3><ol class="steps">${ex.steps.map(s=>`<li>${s}</li>`).join("")}</ol><div class="cue"><strong>Coach cues</strong><p>${ex.cues.join(" • ")}</p></div></section>${strength?sets(ex):timed(ex)}<div class="controls"><button class="secondary" id="back">Back</button><button class="primary" id="next">${state.step===data.length?"Finish session":"Complete & continue"}</button></div>`;
 document.querySelector("#back").onclick=()=>{state.step=Math.max(0,state.step-1);save();workout()};
 document.querySelector("#next").onclick=next;
 if(strength)bindSets(ex); else bindTimer(ex);
}
function sets(ex){return `<section class="card"><h3>${ex.sets} sets × ${ex.reps} reps</h3><p class="muted">Enter weight and reps, then tap the circle to complete each set.</p>${state.logs[ex.name].map((v,i)=>`<div class="set-row"><strong>${i+1}</strong><input data-w="${i}" inputmode="decimal" placeholder="lb" value="${v?.weight||""}"><input data-r="${i}" inputmode="numeric" value="${v?.reps||ex.reps}"><button data-d="${i}" class="${v?.done?"done":""}">${v?.done?"✓":"○"}</button></div>`).join("")}<div class="timer" id="timer">Rest ${String(Math.floor(ex.rest/60)).padStart(2,"0")}:${String(ex.rest%60).padStart(2,"0")}</div><button class="secondary" id="rest">Start rest timer</button></section>`}
function timed(ex){return `<section class="card"><h3>${ex.duration}</h3><div class="timer" id="timer">${ex.duration.includes(":")?ex.duration:"Ready"}</div>${ex.duration.includes(":")?'<button class="secondary" id="rest">Start timer</button>':""}</section>`}
function bindSets(ex){document.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{let i=+b.dataset.d,w=document.querySelector(`[data-w="${i}"]`).value,r=document.querySelector(`[data-r="${i}"]`).value;state.logs[ex.name][i]={weight:w,reps:r,done:!state.logs[ex.name][i]?.done};save();exercise(ex)});document.querySelector("#rest").onclick=()=>startTimer(ex.rest)}
function bindTimer(ex){let b=document.querySelector("#rest");if(b)b.onclick=()=>{let [m,s]=ex.duration.split(":").map(Number);startTimer(m*60+s)}}
function startTimer(sec){remaining=sec;const el=document.querySelector("#timer");clearInterval(timerId);tick();timerId=setInterval(()=>{remaining--;tick();if(remaining<=0){clearInterval(timerId);navigator.vibrate?.([200,100,200])}},1000);function tick(){el.textContent=`${String(Math.floor(remaining/60)).padStart(2,"0")}:${String(remaining%60).padStart(2,"0")}`}}
function next(){state.step++;save();workout()}
function summary(){state.sessions++;state.history.push({date:new Date().toLocaleDateString(),name:"Full Body A"});state.step=0;save();app.innerHTML=`<section class="card complete"><div class="check">✓</div><h2>Full Body A complete</h2><p class="muted">You completed the full guided flow: briefing, warm-up, mobility, seven strength exercises and cooldown.</p><div class="brief-grid"><div><small>STRENGTH SETS</small><strong>18</strong></div><div><small>MUSCLE GROUPS</small><strong>Full body</strong></div><div><small>SESSION</small><strong>#${state.sessions}</strong></div><div><small>NEXT</small><strong>Recovery + hydration</strong></div></div></section><button class="primary" id="home">Return home</button>`;document.querySelector("#home").onclick=()=>setTab("home")}
function library(){app.innerHTML=`<section class="card"><h2>Exercise library</h2><p class="muted">Tap any movement to open its animated guide and step-by-step coaching.</p>${data.map((x,i)=>`<div class="library-row" data-i="${i}"><span class="tag">${x.type}</span><h3>${x.name}</h3><small class="muted">${x.muscles}</small></div>`).join("")}</section>`;document.querySelectorAll("[data-i]").forEach(x=>x.onclick=()=>{state.step=+x.dataset.i+1;setTab("workout")})}
function equipment(){app.innerHTML=`<section class="card"><h2>Your equipment</h2><div class="library-row"><h3>RitFit M1 Pro</h3><p class="muted">Primary strength station. Every cable exercise includes pulley height, attachment and bench setup.</p></div><div class="library-row"><h3>Adjustable bench</h3><p class="muted">Used for rows, pulldowns and shoulder pressing.</p></div><div class="library-row"><h3>Treadmill</h3><p class="muted">Warm-up, cooldown and Zone 2 cardio.</p></div><div class="library-row"><h3>Bike and rower</h3><p class="muted">Available for future conditioning days and substitutions.</p></div></section>`}
function progress(){app.innerHTML=`<section class="card"><h2>Progress check-in</h2><label>Weight (lb)<input id="w" value="${state.weight}"></label><br><label>Waist (in)<input id="wa" value="${state.waist}"></label><br><button class="primary" id="saveP">Save check-in</button></section><section class="card"><h3>Workout history</h3>${state.history.length?state.history.slice().reverse().map(h=>`<div class="library-row"><strong>${h.name}</strong><small class="muted">${h.date}</small></div>`).join(""):'<p class="muted">No completed sessions yet.</p>'}</section>`;document.querySelector("#saveP").onclick=()=>{state.weight=document.querySelector("#w").value;state.waist=document.querySelector("#wa").value;save();progress()}}
render();
