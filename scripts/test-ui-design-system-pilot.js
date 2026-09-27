const assert=require("assert");
const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const metadata=fs.readFileSync(path.join(root,"app-meta.js"),"utf8");
[
  "--color-app-bg","--color-surface","--color-surface-elevated","--color-blue-primary",
  "--color-blue-secondary","--color-gold","--color-success","--color-warning","--color-error",
  "--color-text-primary","--color-text-secondary","--color-text-muted","--color-border",
  "--color-focus","--color-disabled","--radius-sm","--space-1","--font-xs","--shadow-card"
].forEach(token=>assert(css.includes(token),`missing design token ${token}`));
[
  ".ui-button-primary",".ui-button-secondary",".ui-button-destructive",".ui-section-header",
  ".ui-panel",".ui-stat-card",".success-card",".warning-card",".programming-panel",
  ".pro-tip-panel",".muscle-target-panel",".ui-badge",".ui-modal"
].forEach(selector=>assert(css.includes(selector),`missing reusable component ${selector}`));
[
  "pilot-active-workout","pilot-exercise-detail","pilot-summary","command-workout-card",
  "Muscles Worked","Key Form Cues","Programming","Pro Tips","Purpose","Intensity / Zone",
  "Target Areas","How to Perform","Duration"
].forEach(marker=>assert(app.includes(marker),`missing pilot marker ${marker}`));
assert(app.includes('class="checklist-rows"'),"form cues must use semantic checklist rows");
assert(app.includes('aria-hidden="true">✓'),"form cues must include visible check icons");
assert(app.includes('category==="strength"?strengthDetails:category==="cardio"?cardioDetails:mobilityDetails'),"exercise details must select panels by category");
assert(css.includes(".pilot-active-workout .exercise-detail-system .ui-panel"),"active workout details must reduce nested-card weight");
assert(css.includes(".shell>nav button.active:after"),"selected navigation must have a subtle indicator");
[
  "Phase 2.1 — shared states and dialogs","Phase 2.2 — Calendar","Phase 2.3 — Progress",
  "Phase 2.4 — Exercises","Phase 2.5 — Profile, settings, backup and export",
  "Phase 2.6 — Extra Activity","Phase 2.7 — Strava preview and posting states"
].forEach(group=>assert(css.includes(group),`missing full-app rollout group ${group}`));
assert(css.includes(".card{border-color:var(--color-border)"),"full-app cards must use the approved surface tokens");
assert(css.includes(".primary{min-height:52px"),"full-app primary actions must use the approved prominent treatment");
assert(css.includes("@media(prefers-reduced-motion:reduce)"),"pilot must preserve reduced-motion support");
assert(css.includes("@media(max-width:370px)"),"pilot must include narrow-phone layout rules");
assert(metadata.includes('build: "2026.09.27.3"'),"pilot must rotate the PWA build marker");
assert(metadata.includes('serviceWorkerCache: "road12-v13-3-86-shell"'),"pilot must rotate the offline cache");
assert(!app.includes("schemaVersion:22"),"visual pilot must not add a storage schema");
console.log("UI design-system pilot regression tests passed.");
