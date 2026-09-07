const assert=require("assert");
const fs=require("fs");
const path=require("path");

const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");

assert.match(app,/data-readiness-link aria-label="View training readiness details"/,
  "the compact Home readiness card must expose a stable accessible navigation affordance");
assert.match(app,/role="link" tabindex="0" data-readiness-link/,
  "the entire card must support pointer and keyboard navigation");
assert.match(app,/card\.addEventListener\("click",activate\)/,
  "the Home readiness card must respond to taps/clicks");
assert.match(app,/card\.addEventListener\("keydown",activate\)/,
  "the Home readiness card must respond to keyboard activation");
assert.match(app,/\['Enter',' '\]\.includes\(event\.key\)/,
  "Enter and Space must activate the card");

const openTarget=app.slice(app.indexOf("function openProgressSection"),app.indexOf("function bindHomeReadinessNavigation"));
assert.match(openTarget,/pendingProgressTarget=id/);
assert.match(openTarget,/progressExpandedSections\.add\(id\)/,
  "deep-linking must expand the existing Progress disclosure");
assert.match(openTarget,/setTab\("progress"\)/,
  "deep-linking must use the existing tab router");
assert.match(app,/nav\.forEach\(b=>b\.classList\.toggle\("active",b\.dataset\.tab===state\.tab\)\)/,
  "the existing render lifecycle must mark Progress active after the route change");

const scrollTarget=app.slice(app.indexOf("function scrollToPendingProgressTarget"),app.indexOf("function exerciseProgressionRecommendations"));
assert.match(scrollTarget,/requestAnimationFrame\(\(\)=>/,
  "scrolling must wait for the Progress render lifecycle");
assert.match(scrollTarget,/querySelector\(`\[data-progress-section="\$\{id\}"\]`\)/,
  "scrolling must resolve the stable disclosure target");
assert.match(scrollTarget,/scrollIntoView\(\{behavior:reduceMotion\?"auto":"smooth",block:"start"\}\)/,
  "deep-linking must smooth-scroll while respecting reduced-motion preferences");
assert.match(css,/progress-disclosure\[data-progress-section="readiness"\]\{scroll-margin-top:16px\}/,
  "the target must retain title visibility when scrolled into view");

const router=app.slice(app.indexOf("/* Direct tab routing. No wrapper recursion. */"),app.indexOf("/* =========================================================",app.indexOf("/* Direct tab routing. No wrapper recursion. */")));
assert.match(router,/else if\(tab==="progress"\)/,
  "manual Progress navigation must retain its existing route");
assert.doesNotMatch(router,/pendingProgressTarget/,
  "manual Progress navigation must not request a deep-link scroll");

assert.strictEqual((app.match(/progressDisclosure\("readiness","Training readiness"/g)||[]).length,1,
  "Training readiness details must have one existing Progress target");
assert.strictEqual((app.match(/phaseReadinessMarkup\(adaptiveRecommendation,true\)/g)||[]).length,1,
  "Home must retain one compact readiness card");
assert.strictEqual((app.match(/function currentAdaptiveRecommendation\(/g)||[]).length,1,
  "navigation must not duplicate readiness calculations");

console.log("Home readiness navigation tests passed: accessible card routing, stable Progress target, render-safe scrolling, and unchanged manual navigation.");
