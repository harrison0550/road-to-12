const assert=require("assert");
const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");

assert.match(app,/<div class="native-file-picker"><span aria-hidden="true">Import Wyze Scale Export<\/span><input id="wyzeMeasurementFile"[^>]+aria-label="Import Wyze Scale XLSX export">/,"the visible Import surface must contain the real native file input");
assert.doesNotMatch(app,/chooseWyzeMeasurementFile|showPicker|wyzeFileInput\.click\(\)/,"the iPhone picker must not depend on programmatic activation");
assert.doesNotMatch(app,/<label class="primary import-label">Import Wyze Scale Export/,"the unreliable hidden-input label pattern must not return");
assert.doesNotMatch(app,/Wyze Scale `\.xlsx` export/,"display copy must not terminate the importer template literal at runtime");
assert.match(app,/Accepted format: Wyze Scale XLSX export\./,"the importer screen must contain render-safe format guidance");
assert.match(css,/\.native-file-picker>input\{position:absolute;z-index:1;inset:0;width:100%;height:100%/,"the native input must directly cover the full visible tap target");
assert.doesNotMatch(css,/\.native-file-picker>input\{[^}]*display:none/,"the Wyze input must remain a real iOS tap target");

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
