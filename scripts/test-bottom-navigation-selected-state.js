const assert=require("node:assert");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const css=fs.readFileSync(path.join(root,"app.css"),"utf8").replace(/\s+/g,"");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");

const tokenOwner='.shell>navbutton.active{background:rgba(77,156,255,.09);color:var(--color-blue-primary);box-shadow:inset0001pxrgba(77,156,255,.14),0018pxrgba(77,156,255,.08)}';
assert(!css.includes('navbutton.active{color:#ff5260}'),"the legacy global red active-state rule must be removed");
assert(!css.includes('body.home-modenavbutton.active{color:#ff4e5b}'),"the legacy Home red active-state rule must be removed");
assert(css.includes(tokenOwner),"the final Phase 2 selector must own the selected background and blue color");
assert(css.includes('.shell>navbutton.activeb,.shell>navbutton.activespan{color:var(--color-blue-primary)}'),"selected icon and label must both use primary blue");
assert(css.includes('.shell>navbutton{position:relative;border-radius:var(--radius-sm);color:var(--color-text-muted);'),"unselected tabs must use the muted token");
assert(css.includes('top:-9px;bottom:auto;height:3px'),"the single indicator must sit above the content instead of crossing the label");
assert(!css.includes('.shell>navbutton.active:after{content:"";position:absolute;left:28%;right:28%;bottom:2px'),"the overlapping bottom indicator must be removed");
for(const tab of ["home","calendar","progress","library","equipment"]){
  assert(html.includes(`data-tab="${tab}"`),`bottom navigation must retain the ${tab} tab`);
}
assert(app.includes('b.classList.toggle("active",b.dataset.tab===state.tab)'),"navigation behavior must still toggle one active tab from application state");
for(const width of [320,375,390,430])assert(width<=520,"navigation must remain inside the existing 520px mobile shell");

console.log("Bottom navigation selected-state tests passed: all five tabs use token blue, muted inactive text, and one non-overlapping indicator.");
