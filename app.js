
const data=window.WORKOUT_DATA;
const state=JSON.parse(localStorage.getItem("road12v5")||"{}");
Object.assign(state,{tab:state.tab||"home",step:state.step||0,logs:state.logs||{},sessions:state.sessions||0,weight:state.weight||221,waist:state.waist||43,history:state.history||[],selectedDay:Number.isInteger(state.selectedDay)?state.selectedDay:0,coachMode:state.coachMode!==false});
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
function activeWorkout(){
  return data.map(resolveExercise).filter(ex=>!ex.unavailable);
}
function substitutionCount(){
  return activeWorkout().filter(ex=>ex.originalExercise).length;
}

function setTab(t){state.tab=t;save();render()}
nav.forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
document.querySelector("#reset").onclick=()=>{if(confirm("Reset Road to 12% workout data?")){localStorage.removeItem("road12v5");location.reload()}};
function render(){clearInterval(timerId);document.body.classList.toggle("workout-mode",state.tab==="workout");nav.forEach(b=>b.classList.toggle("active",b.dataset.tab===state.tab));({home:home,workout:workout,library:library,equipment:equipment,progress:progress}[state.tab]||home)()}
function home(){
 const day=weekPlan[state.selectedDay];
 app.innerHTML=`<section class="hero"><img src="${window.HERO_IMAGE}"><div class="shade"></div><div class="hero-copy"><span class="pill">WEEK 1 • FOUNDATION</span><h2>${day.title}</h2><p>${day.detail}</p><button class="primary" id="start">${day.action==="workout"?"Start today's guided workout":"Open selected day"}</button></div></section>
 <section class="card week-card"><h2>Training schedule</h2><p class="muted">Tap any day to view its plan.</p><div class="week-strip">${weekPlan.map((d,i)=>`<button class="day-button ${i===state.selectedDay?"selected":""}" data-day="${i}"><span class="day-icon">${d.icon}</span><strong>${d.short}</strong><small>${i===state.selectedDay?"Selected":""}</small></button>`).join("")}</div><div class="selected-plan"><div class="large-icon">${day.icon}</div><div><h3>${day.title}</h3><p class="muted">${day.detail}</p></div></div></section>
 <section class="card equipment-ready-card">
   <div><span class="ready-icon">✓</span><div><strong>Tonight’s workout is equipment-ready</strong><p class="muted">${state.equipment.bumperPlates?"Bumper plates are enabled.":"Bumper plates are off. Plate-dependent barbell work is excluded."} ${substitutionCount()} automatic substitution${substitutionCount()===1?"":"s"} active.</p></div></div>
   <button class="secondary" id="editEquipment">My equipment</button>
 </section>
 <section class="stats"><div><small>WEIGHT</small><strong>${state.weight} lb</strong></div><div><small>WAIST</small><strong>${state.waist} in</strong></div><div><small>SESSIONS</small><strong>${state.sessions}</strong></div></section>`;
 document.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{state.selectedDay=+b.dataset.day;save();home()});
 document.querySelector("#editEquipment").onclick=()=>setTab("equipment");
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
 const m=ex.m1,rightText=m.pinRight?`Right pulley: position ${m.pinRight}`:"Use one pulley only";
 return `<div class="setup-coach"><div class="setup-stage-nav"><button class="active" data-setup-stage="pin">1. Pin position</button><button data-setup-stage="attachment">2. Attachment</button><button data-setup-stage="body">3. Body setup</button><button data-setup-stage="movement">4. Movement</button></div>
 <section class="setup-stage-panel active" data-setup-panel="pin"><div class="pin-guide">${pinRailMarkup(m.pinLeft)}<div class="pin-copy"><h3>Set position ${m.pinLeft}</h3><p>${m.pinNote}</p><span class="pin-chip">Left: ${m.pinLeft}</span><span class="pin-chip">${rightText}</span><p class="muted">Pull the pop pin, slide the carriage until the selected hole aligns, release it, and tug the carriage to confirm it is locked.</p></div></div><div class="m1-photo-card"><img src="assets/ritfit-m1-pin-rail.jpeg" alt="James' actual RitFit M1 numbered pulley rail"><div class="m1-photo-caption">Your actual M1 rail: position 1 is at the bottom and position 13 is at the top. Odd numbers are printed; even positions are the holes between them.</div></div></section>
 <section class="setup-stage-panel" data-setup-panel="attachment"><div class="attachment-board"><div class="attachment-card"><div class="attachment-icon">🔗</div><div><h4>${m.attachment}</h4><p>Open the carabiner, install the attachment, and confirm the gate closes completely.</p></div></div><div class="attachment-card"><div class="attachment-icon">✓</div><div><h4>Cable safety check</h4><p>Confirm the cable is seated in the pulley and the working area is clear.</p></div></div><div class="attachment-card"><div class="attachment-icon">⚖️</div><div><h4>Select a light starting weight</h4><p>Use the first set to confirm the resistance and movement path.</p></div></div></div></section>
 <section class="setup-stage-panel" data-setup-panel="body"><div class="body-setup-board"><div class="position-card"><div class="position-icon">🪑</div><div><h4>${m.bench}</h4><p>Place or remove the bench before handling the cables.</p></div></div><div class="position-card"><div class="position-icon">↔️</div><div><h4>${m.facing}</h4><p>${m.stance}</p></div></div><div class="position-card"><div class="position-icon">🎯</div><div><h4>Starting posture</h4><p>${m.start}</p></div></div></div><div class="m1-stage ${m1PinClass(m.pinLeft)}"><div class="rack-left"></div><div class="rack-right"></div><div class="rack-top"></div><i class="pulley-dot left"></i><i class="pulley-dot right"></i><i class="cable-line left"></i><i class="cable-line right"></i><div class="human-demo"><i class="head"></i><i class="torso"></i><i class="pelvis"></i><i class="arm left"></i><i class="arm right"></i><i class="leg left"></i><i class="leg right"></i></div><i class="footprint one"></i><i class="footprint two"></i></div></section>
 <section class="setup-stage-panel" data-setup-panel="movement"><div class="performance-board"><div class="performance-step"><div class="performance-index">1</div><div><h4>Start position</h4><p>${m.start}</p></div></div><div class="performance-step"><div class="performance-index">2</div><div><h4>Working motion</h4><p>${m.finish}</p></div></div><div class="performance-step"><div class="performance-index">3</div><div><h4>Best viewing angle</h4><p>${m.view}</p></div></div></div><div class="m1-stage ${m1PinClass(m.pinLeft)} is-playing" data-animation-root><div class="rack-left"></div><div class="rack-right"></div><div class="rack-top"></div><i class="pulley-dot left"></i><i class="pulley-dot right"></i><i class="cable-line left motion-part"></i><i class="cable-line right motion-part"></i><div class="human-demo"><i class="head"></i><i class="torso"></i><i class="pelvis"></i><i class="arm left motion-part"></i><i class="arm right motion-part"></i><i class="leg left"></i><i class="leg right"></i></div><i class="footprint one"></i><i class="footprint two"></i></div><div class="animation-controls"><button class="active" data-animation-play>Pause animation</button><button data-animation-restart>Restart animation</button></div><div class="setup-complete"><strong>Setup complete.</strong> Confirm both pins are locked, attachment gates are closed, and the selected weight is appropriate.</div></section></div>`;
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
 const workoutData=activeWorkout();
 if(state.step===0)return briefing();
 if(state.step>workoutData.length)return summary();
 const ex=workoutData[state.step-1]; exercise(ex,workoutData);
}
function briefing(){
 const workoutData=activeWorkout();
 const swaps=workoutData.filter(ex=>ex.originalExercise);
 const swapMarkup=swaps.map(ex=>`<div class="swap-row"><div><small>REPLACED</small><strong>${ex.originalExercise}</strong></div><span>→</span><div><small>TONIGHT</small><strong>${ex.name}</strong></div></div>`).join("");
 app.innerHTML=`<section class="card"><div class="phase"><span class="pill">EQUIPMENT-SAFE SESSION</span><strong>50–60 min</strong></div><h2>Full Body A</h2><p class="muted">Tonight’s session uses only equipment currently marked available. Bumper plates and free-barbell loading are disabled.</p><div class="brief-grid"><div><small>PRIMARY</small><strong>Chest, back, quads, shoulders</strong></div><div><small>AVAILABLE</small><strong>RitFit M1, bench, treadmill</strong></div><div><small>PLATES</small><strong>${state.equipment.bumperPlates?"Available":"Not installed"}</strong></div><div><small>INTENSITY</small><strong>Leave 2–3 reps in reserve</strong></div></div></section>
 ${swaps.length?`<section class="card substitution-summary"><h3>Automatic substitutions</h3>${swapMarkup}<p class="muted">Use the empty Smith bar tonight. No bumper plates are needed.</p></section>`:""}
 <section class="card muscles"><h3>Today's muscle-group summary</h3><p>Push: chest, shoulders and triceps. Pull: lats, mid-back and biceps. Lower body: quads, glutes and hamstrings. Your core stabilizes every movement.</p></section><button class="primary" id="go">Begin warm-up</button>`;
 document.querySelector("#go").onclick=next
}

function speakCoach(text){if(!state.coachMode||!("speechSynthesis"in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.92;window.speechSynthesis.speak(u)}
function coachScript(ex){const setup=ex.m1?`Set the pulleys as shown in Setup. Attach ${ex.m1.attachment}. ${ex.m1.facing}.`:`Review setup and clear the area.`;return `${ex.name}. ${ex.why} ${setup} ${ex.steps[0]||""}`}
function bindCoachMode(ex){const t=document.querySelector("#coachToggle"),r=document.querySelector("#coachReplay");if(t){t.classList.toggle("active",state.coachMode);t.textContent=state.coachMode?"Coach voice on":"Coach voice off";t.onclick=()=>{state.coachMode=!state.coachMode;save();if(state.coachMode)speakCoach(coachScript(ex));else speechSynthesis?.cancel();exercise(ex)}}if(r)r.onclick=()=>speakCoach(coachScript(ex))}
function restCoachText(n){if(n<=10)return"Get ready and set your posture.";if(n<=20)return"Review the next setup and take two slow breaths.";if(n<=40)return"Drink water if needed and relax your grip.";return"Recover and prepare for the next set."}
function exercise(ex,workoutData=activeWorkout()){
 const pct=Math.round(state.step/workoutData.length*100), strength=ex.type==="strength";
 const key=ex.name; if(strength&&!state.logs[key])state.logs[key]=Array(ex.sets).fill(null);

 app.innerHTML=`<section class="card workout-card">
   <div class="phase"><span class="tag">${ex.type}</span><strong>${state.step}/${workoutData.length}</strong></div>
   <div class="progress workout-progress"><i style="width:${pct}%"></i></div>
   <h2>${ex.name}</h2>
   <p class="muted workout-subtitle">${ex.muscles}</p>${ex.originalExercise?`<div class="substitution-alert"><strong>Equipment substitution</strong><p>${ex.originalExercise} was replaced with ${ex.name} because the required equipment is not available.</p></div>`:""}<div class="why-card"><h3>Why this exercise?</h3><p>${ex.why}</p></div><div class="coach-mode-card"><div class="coach-mode-icon">🔊</div><div><h3>Coach Mode</h3><p>Hear the purpose, setup and first cue.</p><div class="coach-controls"><button id="coachToggle">Coach voice on</button><button id="coachReplay">Replay instructions</button></div></div></div>

   <div class="media-tabs">
     <button class="active" data-guide-tab="demo">Demo</button>
     <button data-guide-tab="video">Video</button>
     <button data-guide-tab="setup">Setup</button>
     <button data-guide-tab="steps">Steps</button>
   </div>

   <div class="guide-panel" data-guide-panel="demo">
     ${mediaMarkup(ex)}
     ${quickSettings(ex)}
   </div>

   <div class="guide-panel hidden" data-guide-panel="video">
     ${videoMarkup(ex)}
   </div>

   <div class="guide-panel hidden" data-guide-panel="setup">
     ${ex.m1 ? m1SetupCoach(ex) : `<div class="setup-grid">${ex.setup.map((x,i)=>`<div><small>${i===0?"SETUP":"CHECK"}</small><strong>${x}</strong></div>`).join("")}</div><div class="cue"><strong>Before you begin</strong><p>Confirm the equipment and working area are secure and clear.</p></div>`}
   </div>

   <div class="guide-panel hidden" data-guide-panel="steps">
     <ol class="steps">${ex.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
     <div class="cue"><strong>Coach cues</strong><p>${ex.cues.join(" • ")}</p></div>
   </div>
   ${strength?`<div class="weight-coach-card"><h3>Beginner weight recommendation</h3><p>${ex.weightRecommendation}</p></div>`:""}
 </section>

 ${strength?sets(ex):timed(ex)}

 <div class="workout-actions">
   <button class="secondary" id="back">Back</button>
   <button class="primary" id="next">${state.step===workoutData.length?"Finish session":"Complete & continue"}</button>
 </div>`;

 bindGuideTabs();
 bindSetupCoach();
 bindAssetViewer();
 bindVideoLinks();
 bindCoachMode(ex);
 bindAnimationControls();
 document.querySelector("#back").onclick=()=>{state.step=Math.max(0,state.step-1);save();workout()};
 document.querySelector("#next").onclick=next;
 if(strength)bindSets(ex); else bindTimer(ex);
}
function sets(ex){return `<section class="card timer-card"><h3>${ex.sets} sets × ${ex.reps} reps</h3><p class="muted">Enter weight and reps, then tap the circle to complete each set.</p>${state.logs[ex.name].map((v,i)=>`<div class="set-row"><strong>${i+1}</strong><input data-w="${i}" inputmode="decimal" placeholder="lb" value="${v?.weight||""}"><input data-r="${i}" inputmode="numeric" value="${v?.reps||ex.reps}"><button data-d="${i}" class="${v?.done?"done":""}">${v?.done?"✓":"○"}</button></div>`).join("")}<div class="timer" id="timer">Rest ${String(Math.floor(ex.rest/60)).padStart(2,"0")}:${String(ex.rest%60).padStart(2,"0")}</div><div class="rest-coach-message" id="restCoach">Recover and prepare for your next set.</div><div class="timer-controls"><button class="secondary" id="rest">Start rest timer</button><button class="secondary" id="stopTimer">Stop timer</button></div></section>`}
function timed(ex){return `<section class="card timer-card"><h3>${ex.duration}</h3><div class="timer" id="timer">${ex.duration.includes(":")?ex.duration:"Ready"}</div>${ex.duration.includes(":")?'<div class="timer-controls"><button class="primary" id="rest">Start timer</button><button class="secondary" id="stopTimer">Stop timer</button></div>':""}</section>`}
function bindSets(ex){document.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{let i=+b.dataset.d,w=document.querySelector(`[data-w="${i}"]`).value,r=document.querySelector(`[data-r="${i}"]`).value;state.logs[ex.name][i]={weight:w,reps:r,done:!state.logs[ex.name][i]?.done};save();exercise(ex)});document.querySelector("#rest").onclick=()=>startTimer(ex.rest);const stop=document.querySelector("#stopTimer");if(stop)stop.onclick=stopTimer}
function bindTimer(ex){let b=document.querySelector("#rest");if(b)b.onclick=()=>{let [m,s]=ex.duration.split(":").map(Number);startTimer(m*60+s)};const stop=document.querySelector("#stopTimer");if(stop)stop.onclick=stopTimer}
function stopTimer(){clearInterval(timerId);timerId=null;}
function startTimer(sec){remaining=sec;const el=document.querySelector("#timer");clearInterval(timerId);tick();timerId=setInterval(()=>{remaining--;tick();if(remaining<=0){clearInterval(timerId);navigator.vibrate?.([200,100,200])}},1000);function tick(){el.textContent=`${String(Math.floor(remaining/60)).padStart(2,"0")}:${String(remaining%60).padStart(2,"0")}`;const c=document.querySelector("#restCoach");if(c)c.textContent=restCoachText(remaining)}}
function next(){state.step++;save();workout()}
function summary(){state.sessions++;state.history.push({date:new Date().toLocaleDateString(),name:"Full Body A"});state.step=0;save();app.innerHTML=`<section class="card complete"><div class="check">✓</div><h2>Full Body A complete</h2><p class="muted">You completed the equipment-safe guided workout using only equipment marked available.</p><div class="brief-grid"><div><small>STRENGTH SETS</small><strong>${activeWorkout().filter(x=>x.type==="strength").reduce((n,x)=>n+(x.sets||0),0)}</strong></div><div><small>MUSCLE GROUPS</small><strong>Full body</strong></div><div><small>SESSION</small><strong>#${state.sessions}</strong></div><div><small>NEXT</small><strong>Recovery + hydration</strong></div></div></section><button class="primary" id="home">Return home</button>`;document.querySelector("#home").onclick=()=>setTab("home")}
function library(){
 const extras=window.EXTRA_LIBRARY_DATA||[];
 const all=[...data,...extras];
 app.innerHTML=`<section class="card">
   <h2>Exercise Library</h2>
   <p class="muted">Select an exercise to open its dedicated Demo, Video, Setup and Steps tabs.</p>

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
     ${extras.map((x,i)=>`<button class="exercise-library-tile" data-extra-i="${i}"><span class="tag">${x.type}</span><strong>${x.name}</strong><small>Demo and trusted video resource</small></button>`).join("")}
   </div>
 </section>`;
 bindAssetViewer();
 document.querySelectorAll("[data-workout-i]").forEach(x=>x.onclick=()=>{state.step=+x.dataset.workoutI+1;setTab("workout")});
 document.querySelectorAll("[data-extra-i]").forEach(x=>x.onclick=()=>showLibraryExercise(extras[+x.dataset.extraI]));
}

function showLibraryExercise(ex){
 app.innerHTML=`<section class="card workout-card">
   <button class="secondary" id="libraryBack">Back to Library</button>
   <h2>${ex.name}</h2>
   <p class="muted workout-subtitle">${ex.muscles}</p>
   <div class="media-tabs">
     <button class="active" data-guide-tab="demo">Demo</button>
     <button data-guide-tab="video">Video</button>
     <button data-guide-tab="setup">Setup</button>
     <button data-guide-tab="steps">Steps</button>
   </div>
   <div class="guide-panel" data-guide-panel="demo">${focusedDemoMarkup(ex)}</div>
   <div class="guide-panel hidden" data-guide-panel="video">${videoMarkup(ex)}</div>
   <div class="guide-panel hidden" data-guide-panel="setup"><div class="setup-grid">${ex.setup.map((x,i)=>`<div><small>${i===0?"SETUP":"CHECK"}</small><strong>${x}</strong></div>`).join("")}</div></div>
   <div class="guide-panel hidden" data-guide-panel="steps"><ol class="steps">${ex.steps.map(s=>`<li>${s}</li>`).join("")}</ol><div class="cue"><strong>Coach cues</strong><p>${ex.cues.join(" • ")}</p></div></div>
 </section>`;
 document.querySelector("#libraryBack").onclick=library;
 bindGuideTabs();bindAssetViewer();bindVideoLinks();
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
 app.innerHTML=`<section class="card"><div class="phase"><span class="pill">VERSION 7.4</span><strong>Equipment-aware</strong></div><h2>My Equipment</h2><p class="muted">The workout automatically removes or replaces exercises that require equipment switched off below.</p><div class="equipment-toggle-list">${items.map(([key,icon,title,note])=>`<label class="equipment-toggle"><span class="equipment-symbol">${icon}</span><span class="equipment-copy"><strong>${title}</strong><small>${note}</small></span><input type="checkbox" data-equipment="${key}" ${state.equipment[key]?"checked":""}><span class="toggle-ui"></span></label>`).join("")}</div></section>
 <section class="card equipment-impact"><h3>Tonight’s workout</h3><div class="impact-row"><span>Available exercises</span><strong>${activeWorkout().length}</strong></div><div class="impact-row"><span>Automatic substitutions</span><strong>${substitutionCount()}</strong></div><div class="impact-row"><span>Bumper-plate exercises</span><strong>${state.equipment.bumperPlates?"Enabled":"Disabled"}</strong></div><p class="muted">Current substitution: Goblet Squat → Smith Machine Squat using the empty Smith bar.</p><button class="primary" id="equipmentWorkout">Start equipment-safe workout</button></section>`;
 document.querySelectorAll("[data-equipment]").forEach(input=>input.onchange=()=>{
   state.equipment[input.dataset.equipment]=input.checked;
   state.step=0;
   save();
   equipment();
 });
 document.querySelector("#equipmentWorkout").onclick=()=>{state.step=0;setTab("workout")};
}
function progress(){app.innerHTML=`<section class="card"><h2>Progress check-in</h2><label>Weight (lb)<input id="w" value="${state.weight}"></label><br><label>Waist (in)<input id="wa" value="${state.waist}"></label><br><button class="primary" id="saveP">Save check-in</button></section><section class="card"><h3>Workout history</h3>${state.history.length?state.history.slice().reverse().map(h=>`<div class="library-row"><strong>${h.name}</strong><small class="muted">${h.date}</small></div>`).join(""):'<p class="muted">No completed sessions yet.</p>'}</section>`;document.querySelector("#saveP").onclick=()=>{state.weight=document.querySelector("#w").value;state.waist=document.querySelector("#wa").value;save();progress()}}
render();
