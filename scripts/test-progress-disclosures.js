const assert=require("assert");
const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");

assert.match(app,/<button class="primary" id="chooseWyzeMeasurementFile" type="button">Import Wyze Scale Export<\/button>/,"Wyze import must use a real iPhone-safe button");
assert.match(app,/class="file-input-a11y" id="wyzeMeasurementFile"[^>]+aria-label="Choose Wyze Scale XLSX export"/);
assert.match(app,/chooseWyzeMeasurementFile[\s\S]*?showPicker[\s\S]*?wyzeFileInput\.click\(\)/,"file picker must use showPicker with a direct-click fallback");
assert.doesNotMatch(app,/<label class="primary import-label">Import Wyze Scale Export/,"the unreliable hidden-input label pattern must not return");
assert.match(css,/\.file-input-a11y\{position:absolute;width:1px!important;height:1px/);
assert.doesNotMatch(css,/\.file-input-a11y\{[^}]*display:none/,"the Wyze input must remain available to iOS and assistive technology");

[
  "readiness","lower-abs","weight-review","body-trends","exercise-progression","data-backup",
  "recovery-map","personal-records","achievements","workout-history"
].forEach(id=>assert(app.includes(`progressDisclosure("${id}"`),`${id} must render through the compact disclosure pattern`));
assert.match(app,/const progressExpandedSections=new Set\(\)/);
assert.match(app,/querySelectorAll\("\[data-progress-section\]"\)[\s\S]*?section\.open[\s\S]*?progressExpandedSections/);
assert.match(app,/<details class="compact-progress-details"><summary>Recent measurements<\/summary>/);
assert.match(css,/\.progress-disclosure>summary\{[^}]*min-height:68px/,"disclosure summaries must remain large touch targets");
assert.match(css,/\.progress-disclosure summary:focus-visible/,"disclosures must retain visible keyboard focus");
assert.match(css,/@media\(max-width:370px\)\{\.progress-disclosure>summary/,"the compact layout must include small-iPhone handling");

console.log("Progress disclosure tests passed: the Wyze picker is iPhone-safe and long Progress sections are accessible, compact, and state-preserving");
