(()=>{
"use strict";
const KEY="trademate-v02-data";
const blank={profile:{name:"",status:"Apprentice",trade:"",local:"",level:"",email:""},hours:[],jobs:[],benefits:[],credentials:[],documents:[]};
let data;try{data={...blank,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{data=structuredClone(blank)}
for(const k of Object.keys(blank)) if(k!=="profile"&&!Array.isArray(data[k]))data[k]=[];
data.profile={...blank.profile,...(data.profile||{})};
const $=id=>document.getElementById(id), esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=()=>{let d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const save=()=>{localStorage.setItem(KEY,JSON.stringify(data));render()};
const hrs=x=>{let a=new Date(`${x.date}T${x.start}`),b=new Date(`${x.date}T${x.end}`);if(b<=a)b.setDate(b.getDate()+1);return Math.max(0,(b-a)/36e5-(Number(x.break)||0)/60)};
function nav(tab){document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id==="panel-"+tab));document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.tab)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.go)));
$("jumpShift").onclick=()=>nav("hours");
function list(id,arr,fn,empty){$(id).innerHTML=arr.length?arr.slice().reverse().map((x,i)=>`<div class="item">${fn(x,arr.length-i-1)}</div>`).join(""):`<div class="empty">${empty}</div>`}
function render(){
 const now=new Date(), week=new Date(now);week.setHours(0,0,0,0);week.setDate(week.getDate()-((week.getDay()+6)%7));
 const w=data.hours.filter(x=>new Date(x.date+"T12:00:00")>=week), y=data.hours.filter(x=>x.date?.startsWith(String(now.getFullYear())));
 $("mHours").textContent=w.reduce((a,x)=>a+hrs(x),0).toFixed(1);$("mYear").textContent=y.reduce((a,x)=>a+hrs(x),0).toFixed(1);
 $("mJobs").textContent=data.jobs.length;$("mCerts").textContent=data.credentials.length;
 $("pTrade").textContent=data.profile.trade||"Not set";$("pStatus").textContent=data.profile.status||"Not set";$("pLocal").textContent=data.profile.local||"Not set";
 $("hello").textContent=data.profile.name?`Welcome, ${data.profile.name}.`:"Your working life, organized.";
 $("dateLine").textContent=now.toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"});
 list("hoursList",data.hours,x=>`<b>${esc(x.date)} · ${hrs(x).toFixed(2)} hours</b><div class="hint">${esc(x.start)}–${esc(x.end)} · ${esc(x.job)} · ${esc(x.contractor)}</div><div class="hint">${esc(x.site)} · ${esc(x.kind)}${x.note?" · "+esc(x.note):""}</div>`,`No shifts saved yet.`);
 list("jobsList",data.jobs,x=>`<b>${esc(x.name||"Project")} · ${esc(x.contractor)}</b><div class="hint">${esc(x.site)} · ${esc(x.role)} · ${esc(x.start||"Start date not set")} to ${esc(x.end||"Present")}</div>`,`No jobs saved yet.`);
 list("benefitsList",data.benefits,x=>`<b>${esc(x.type)} · ${esc(x.amount||"Amount not entered")}</b><div class="hint">${esc(x.fund)} · ${esc(x.date)} · ${esc(x.note)}</div>`,`No benefit records saved.`);
 list("credentialsList",data.credentials,x=>`<b>${esc(x.name)}</b><div class="hint">${esc(x.issuer)} · ${esc(x.number)} · ${x.expiry?"Expires "+esc(x.expiry):"No expiry entered"}</div>`,`No credentials saved.`);
 list("documentsList",data.documents,(x,i)=>`<b>${esc(x.name)}</b> <span class="tag">${esc(x.type)}</span><div class="hint">${esc(x.fileName||"No file attached")} · ${esc(x.note||"")}</div>`,`No documents saved.`);
 const recent=data.hours.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
 $("recent").innerHTML=recent.length?recent.map(x=>`<div class="item"><b>${esc(x.date)} · ${hrs(x).toFixed(1)} hrs</b><div class="hint">${esc(x.job)} · ${esc(x.contractor)}</div></div>`).join(""):"Your recorded shifts will appear here.";
 $("wName").value=data.profile.name;$("wStatus").value=data.profile.status;$("wTrade").value=data.profile.trade;$("wLocal").value=data.profile.local;$("wLevel").value=data.profile.level;$("wEmail").value=data.profile.email;
}
$("hDate").value=today();$("jStart").value=today();$("bDate").value=today();
$("saveHour").onclick=()=>{let x={date:$("hDate").value,job:$("hJob").value.trim(),contractor:$("hContractor").value.trim(),site:$("hSite").value.trim(),start:$("hStart").value,end:$("hEnd").value,break:Number($("hBreak").value)||0,kind:$("hKind").value,note:$("hNote").value.trim()};if(!x.date||!x.start||!x.end){alert("Enter a date, start time and end time.");return}if(x.break<0){alert("Break minutes cannot be negative.");return}data.hours.push(x);save();["hJob","hContractor","hSite","hStart","hEnd","hNote"].forEach(id=>$(id).value="");alert("Hours saved on this device.")};
$("saveJob").onclick=()=>{let x={contractor:$("jContractor").value.trim(),name:$("jName").value.trim(),site:$("jSite").value.trim(),role:$("jRole").value.trim(),start:$("jStart").value,end:$("jEnd").value};if(!x.contractor&&!x.name){alert("Enter a contractor or project name.");return}data.jobs.push(x);save();["jContractor","jName","jSite","jRole","jEnd"].forEach(id=>$(id).value="")};
$("saveBenefit").onclick=()=>{let x={type:$("bType").value,fund:$("bFund").value.trim(),date:$("bDate").value,amount:$("bAmount").value.trim(),note:$("bNote").value.trim()};if(!x.fund&&!x.amount){alert("Enter a fund name or amount / hours.");return}data.benefits.push(x);save();["bFund","bAmount","bNote"].forEach(id=>$(id).value="")};
$("saveCredential").onclick=()=>{let x={name:$("cName").value.trim(),issuer:$("cIssuer").value.trim(),number:$("cNumber").value.trim(),expiry:$("cExpiry").value};if(!x.name){alert("Enter a credential name.");return}data.credentials.push(x);save();["cName","cIssuer","cNumber","cExpiry"].forEach(id=>$(id).value="")};
$("saveProfile").onclick=()=>{data.profile={name:$("wName").value.trim(),status:$("wStatus").value,trade:$("wTrade").value.trim(),local:$("wLocal").value.trim(),level:$("wLevel").value.trim(),email:$("wEmail").value.trim()};save();alert("Profile saved on this device.")};
$("saveDocument").onclick=async()=>{let file=$("dFile").files[0],x={name:$("dName").value.trim(),type:$("dType").value,fileName:file?.name||"",note:$("dNote").value.trim()};if(!x.name){alert("Enter a document name.");return}if(file){if(file.size>8*1024*1024){alert("For this prototype, attachments must be 8 MB or smaller.");return}try{x.fileData=await fileToDataURL(file)}catch{alert("Could not read that file.");return}}data.documents.push(x);save();["dName","dNote","dFile"].forEach(id=>$(id).value="")};
function fileToDataURL(file){return new Promise((res,rej)=>{let r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
$("makeShare").onclick=()=>{let out={app:"TradeMate",exportType:"selected-share",createdAt:new Date().toISOString()};if($("shareProfile").checked)out.profile=data.profile;if($("shareHours").checked)out.hours=data.hours;if($("shareJobs").checked)out.jobs=data.jobs;if($("shareBenefits").checked)out.benefits=data.benefits;if($("shareCredentials").checked)out.credentials=data.credentials;if($("shareDocuments").checked)out.documents=data.documents.map(({fileData,...x})=>x);if(Object.keys(out).length===3){alert("Select at least one category to share.");return}download(out,"trademate-share-"+today()+".json")};
$("backupAll").onclick=()=>download({app:"TradeMate",exportType:"full-backup",createdAt:new Date().toISOString(),data},"trademate-backup-"+today()+".json");
function download(obj,name){let blob=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"}),a=document.createElement("a"),u=URL.createObjectURL(blob);a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
$("deleteAll").onclick=()=>{if(confirm("Permanently delete all TradeMate records saved in this browser? Export a backup first if needed.")){localStorage.removeItem(KEY);data=structuredClone(blank);save()}};
$("net").textContent=navigator.onLine?"● Private on this device":"● Offline · private on this device";
window.addEventListener("online",()=>$("net").textContent="● Private on this device");window.addEventListener("offline",()=>$("net").textContent="● Offline · private on this device");
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
})();