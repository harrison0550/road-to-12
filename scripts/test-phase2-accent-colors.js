const assert=require("assert");
const fs=require("fs");
const path=require("path");

const root=path.resolve(__dirname,"..");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8").replace(/\s+/g,"");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");

assert.match(app,/class="preview-exercise-button"[\s\S]*?<span>\$\{i\+1\}<\/span><strong>\$\{item\}<\/strong><b[^>]*>›<\/b>/,"workout preview rows must retain their numbered and chevron markup");
assert.match(css,/\.preview-exercise-listlispan\{background:rgba\(77,156,255,\.13\);color:var\(--color-blue-primary\)\}/,"preview step numbers must use the primary-blue design token");
assert.match(css,/\.preview-exercise-listlib\{color:var\(--color-blue-primary\)/,"preview chevrons must use the primary-blue design token");
assert.match(css,/\.preview-exercise-listli\{border-color:var\(--color-border\);background:#0b1420\}/,"preview rows must use the Phase 2 border and navy surface");
assert.match(css,/\.preview-exercise-list\.preview-exercise-button:focus-visible\{outline-color:var\(--color-focus\);outline-offset:-3px\}/,"preview row focus must use the approved focus token");

assert.match(css,/\.shell>navbutton\.active\{[^}]*color:var\(--color-blue-primary\)/,"selected navigation must remain primary blue");
assert.match(css,/\.shell>navbutton\.activeb,\.shell>navbutton\.activespan\{color:var\(--color-blue-primary\)\}/,"selected navigation icon and label must remain primary blue");

assert.match(css,/--color-error:#ff6572/,"the semantic error token must remain red");
assert.match(css,/\.ui-button-destructive\{[^}]*var\(--color-error\)/,"destructive buttons must retain the semantic error token");
assert.match(css,/\.ui-error-state\{border-color:var\(--color-error\)\}/,"error states must retain the semantic error token");
assert.match(css,/\.strava-sync-result\.failed\{border-color:var\(--color-error\);background:#271018\}/,"failed Strava states must retain semantic error styling");

console.log("Phase 2 accent regression tests passed: preview and navigation accents are blue; error and destructive states remain red.");
