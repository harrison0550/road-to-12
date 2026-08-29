const assert=require("assert");
const fs=require("fs");
const path=require("path");
const wyze=require("../wyze-xlsx-import.js");
const body=require("../body-measurements.js");
const root=path.resolve(__dirname,"..");

const headers=[
  "Number","Date and Time","Weight(lb)","Weight(kg)","BMI","Body Fat","Muscle Mass",
  "Muscle Mass %","Body Water","Lean Body Mass","Bone Mass","Protein","Visceral Fat","BMR",
  "Metabolic Age","Skeletal Muscle Rate %","Fat Content","Subcutaneous Fat"
];
const complete=[
  8,"2026.08.29 11:32 AM","221.3lb","100.4kg",29.3,"31.9%","141.3lb","63.8%","49.8%",
  "150.7lb","9.3lb","14.0%",11,1846,46,"38.9%","70.5lb","22.8%"
];
const parsed=wyze.parseRows([
  ["Body Composition Data"],
  [],
  headers,
  complete,
  [9,"2026.08.30 7:00 AM","220.9lb","100.2kg","- -","- -","- -","- -","- -","- -","- -","- -","- -","- -","- -","- -","- -",""]
]);

assert.equal(parsed.length,2,"weight-only readings must remain valid");
const first=parsed[0].record;
assert.equal(first.source,"wyze-import");
assert.equal(first.sourceRecordNumber,"8");
assert.equal(first.sourceTimestamp,"2026.08.29 11:32 AM");
assert.equal(first.weight,221.3);
assert.equal(first.weightLb,221.3);
assert.equal(first.weightKg,100.4);
assert.equal(first.bmi,29.3);
assert.equal(first.BMI,29.3);
assert.equal(first.bodyFatPercent,31.9);
assert.equal(first.muscleMassLb,141.3);
assert.equal(first.muscleMassPercent,63.8);
assert.equal(first.bodyWaterPercent,49.8);
assert.equal(first.leanBodyMassLb,150.7);
assert.equal(first.boneMassLb,9.3);
assert.equal(first.proteinPercent,14);
assert.equal(first.visceralFat,11);
assert.equal(first.bmrKcal,1846);
assert.equal(first.metabolicAge,46);
assert.equal(first.skeletalMusclePercent,38.9);
assert.equal(first.fatMassLb,70.5);
assert.equal(first.subcutaneousFatPercent,22.8);
const localDate=new Date(first.timestamp);
assert.deepStrictEqual(
  [localDate.getFullYear(),localDate.getMonth()+1,localDate.getDate(),localDate.getHours(),localDate.getMinutes()],
  [2026,8,29,11,32],
  "Wyze wall-clock time must be interpreted in the user's local timezone"
);
const weightOnly=parsed[1].record;
assert.equal(weightOnly.weight,220.9);
assert.equal(weightOnly.bodyFatPercent,null,"missing composition must never become zero");
assert.equal(weightOnly.leanBodyMassLb,null);
assert.equal(wyze.parseNumeric("- -"),null);
assert.equal(wyze.parseNumeric("221.3lb"),221.3);
assert.equal(wyze.parseNumeric("31.9%"),31.9);

const sixRows=[
  [1,"2026.08.20 8:00 AM","222lb"],
  [2,"2026.08.20 8:05 AM","222lb"],
  [3,"2026.08.21 8:00 AM","221lb"],
  [4,"2026.08.22 8:00 AM","220lb"],
  [5,"2026.08.23 8:00 AM","219lb"],
  [6,"2026.08.23 8:06 AM","219lb"]
];
const simpleHeaders=["Number","Date and Time","Weight(lb)"];
const review=wyze.analyze(wyze.parseRows([["Body Composition Data"],simpleHeaders,...sixRows]),[]);
assert.equal(review.foundCount,6);
assert.equal(review.uniqueCount,4);
assert.equal(review.duplicateCount,2);

const olderRich=wyze.parseRows([["Body Composition Data"],headers,
  [1,"2026.08.24 8:00 AM","218lb","- -",28,"30%","140lb","64%","50%","152lb","9lb","14%",10,1800,45,"39%","65lb","21%"],
  [2,"2026.08.24 8:05 AM","218lb"]
]);
const richReview=wyze.analyze(olderRich,[]);
assert.equal(richReview.rows.find(item=>item.status==="import").record.sourceRecordNumber,"1","the richer record wins even when it is older");

assert.equal(wyze.deterministicIdentity(first.timestamp,first.weight),wyze.deterministicIdentity(first.timestamp,first.weight));
const existingWeightOnly=body.adapt("wyze-import",{
  id:first.id,timestamp:first.timestamp,sourceTimestamp:first.sourceTimestamp,sourceRecordNumber:8,weight:221.3
});
const updateReview=wyze.analyze([parsed[0]],[existingWeightOnly]);
assert.equal(updateReview.uniqueCount,1);
assert.equal(updateReview.rows[0].status,"update");
const applied=wyze.applyReview([existingWeightOnly],updateReview);
assert.equal(applied.records.length,1,"a richer re-import must enrich instead of duplicate");
assert.equal(applied.records[0].bodyFatPercent,31.9);
assert.equal(applied.updated,1);
const protectedExisting={...existingWeightOnly,bodyFatPercent:30};
const protectedApplied=wyze.applyReview([protectedExisting],wyze.analyze([parsed[0]],[protectedExisting]));
assert.equal(protectedApplied.records[0].bodyFatPercent,30,"enrichment must not overwrite an existing non-null value");
const reimport=wyze.analyze([parsed[0]],applied.records);
assert.equal(reimport.rows[0].status,"duplicate");

const manual=body.adapt("manual",{id:"manual-waist",timestamp:"2026-08-29T10:00:00.000Z",waist:39});
const withManual=wyze.applyReview([manual],review).records;
assert(withManual.some(record=>record.id==="manual-waist"),"Wyze import must preserve manual measurements");
assert.equal(body.newestRecord([first,weightOnly],"weight").weight,220.9);
assert.equal(body.newestRecord([first,weightOnly],"bodyFatPercent").bodyFatPercent,31.9,"a newer weight-only reading must not borrow older composition values");

const fakeXlsx={
  read(){return {SheetNames:["Notes","Body"],Sheets:{Notes:{name:"notes"},Body:{name:"body"}}};},
  utils:{sheet_to_json(sheet){return sheet.name==="notes"?[["Not Wyze"]]:[["Body Composition Data"],[],headers,complete];}}
};
assert.equal(wyze.parseWorkbook(new ArrayBuffer(0),fakeXlsx).length,1,"the adapter must discover headers on any worksheet");

const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8");
assert.match(app,/Import Wyze Scale Export/);
assert.match(app,/Import Measurements/);
assert.match(index,/vendor\/xlsx\.mini\.min\.js[^<]+<\/script><script src="wyze-xlsx-import\.js/);
assert(sw.includes('"./vendor/xlsx.mini.min.js"'));
assert(sw.includes('"./wyze-xlsx-import.js"'));
assert(fs.readFileSync(path.join(root,"vendor","xlsx.mini.min.js"),"utf8").includes("0.20.3"));
assert(fs.existsSync(path.join(root,"vendor","SHEETJS-LICENSE.txt")));
assert.match(css,/@media\(max-width:520px\)\{\.body-measurement-current\{grid-template-columns:minmax\(0,1fr\)\}/,"measurement cards must collapse on narrow iPhones");
assert.match(css,/\.measurement-import-actions>\*\{width:100%;min-width:0\}/,"import controls must remain inside their content container");

console.log("Wyze XLSX tests passed: parsing, nullable values, local timestamps, review deduplication, enrichment, re-import safety, trends, and offline packaging are intact");
