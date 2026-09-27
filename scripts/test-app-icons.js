const assert=require("assert");
const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const read=file=>fs.readFileSync(path.join(root,file));
const manifest=JSON.parse(read("manifest.webmanifest").toString("utf8"));
const html=read("index.html").toString("utf8");
const sw=read("sw.js").toString("utf8");
const expected={
  "assets/icons/road12-app-icon-1024.png":[1024,1024],
  "assets/icons/apple-touch-icon-180.png":[180,180],
  "assets/icons/road12-app-icon-192.png":[192,192],
  "assets/icons/road12-app-icon-512.png":[512,512],
  "assets/icons/road12-maskable-512.png":[512,512],
  "assets/icons/favicon-32.png":[32,32],
  "assets/icons/favicon-16.png":[16,16]
};
function pngSize(buffer){assert.equal(buffer.toString("ascii",1,4),"PNG");return[buffer.readUInt32BE(16),buffer.readUInt32BE(20)];}
for(const [file,size] of Object.entries(expected))assert.deepStrictEqual(pngSize(read(file)),size,`${file} dimensions`);
assert(manifest.icons.some(icon=>icon.sizes==="192x192"&&icon.purpose==="any"));
assert(manifest.icons.some(icon=>icon.sizes==="512x512"&&icon.purpose==="any"));
assert(manifest.icons.some(icon=>icon.sizes==="512x512"&&icon.purpose==="maskable"));
assert.match(html,/rel="apple-touch-icon" sizes="180x180" href="assets\/icons\/apple-touch-icon-180\.png"/);
assert.match(html,/rel="icon" type="image\/png" sizes="32x32"/);
assert.match(html,/rel="icon" type="image\/png" sizes="16x16"/);
for(const file of Object.keys(expected).filter(file=>!file.endsWith("1024.png")))assert(sw.includes(`"./${file}"`),`${file} must be in the offline shell`);
assert.match(read("assets/icon.svg").toString("utf8"),/>12%<\/text>/);
console.log("App icon tests passed: master/export dimensions, Apple/PWA/favicon references, maskable purpose, and offline cache coverage are intact.");
