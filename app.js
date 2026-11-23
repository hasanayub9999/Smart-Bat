const sessions = [
  {name:"Evening net practice",date:"Today · 5:42 PM",swings:24,peak:8.6,duration:.74},
  {name:"Front-foot drive drills",date:"Yesterday · 4:15 PM",swings:18,peak:8.1,duration:.79},
  {name:"Weekend practice",date:"Nov 20 · 10:30 AM",swings:32,peak:9.0,duration:.71},
  {name:"Technique session",date:"Nov 18 · 5:05 PM",swings:15,peak:7.8,duration:.82}
];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
let charts = [];
function seeded(n){return Array.from({length:n},(_,i)=>i)}
function renderSessions(){
  $("#recentSessions").innerHTML=sessions.slice(0,3).map((s,i)=>`<div class="session-row"><div class="session-icon">${["↗","⌁","◷"][i]}</div><div class="session-info"><strong>${s.name}</strong><small>${s.date}</small></div><div class="session-number">${s.swings}<small>swings</small></div></div>`).join("");
  $("#sessionTable").innerHTML=sessions.map(s=>`<tr><td>${s.name}</td><td>${s.date}</td><td>${s.swings}</td><td>${s.peak.toFixed(1)} rad/s</td><td>${s.duration.toFixed(2)} sec</td><td><span class="table-status">● DEMO</span></td></tr>`).join("");
  $("#totalSwings").textContent=sessions.reduce((a,s)=>a+s.swings,0);
}
function chartBase(){return {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:"#202d23",titleColor:"#eef5ed",bodyColor:"#c3f36b",borderColor:"#42533d",borderWidth:1,displayColors:false}},scales:{x:{grid:{display:false},ticks:{color:"#819084",font:{family:"DM Mono",size:9},maxTicksLimit:7},border:{display:false}},y:{grid:{color:"#29372e"},ticks:{color:"#819084",font:{family:"DM Mono",size:9}},border:{display:false}}}}}
function lineChart(id,labels,datasets,unit=""){
 const ctx=document.getElementById(id); if(!ctx)return;
 const options=chartBase(); options.plugins.tooltip.callbacks={label:c=>`${c.dataset.label}: ${c.parsed.y.toFixed(2)} ${unit}`};
 charts.push(new Chart(ctx,{type:"line",data:{labels,datasets:datasets.map(d=>({ ...d, borderWidth:2,pointRadius:0,tension:.35,fill:false }))},options}));
}
function initCharts(){
 const lime=css("--lime"),teal=css("--teal"),purple=css("--purple");
 const t=seeded(41).map(i=>(i*.025).toFixed(2));
 const speed=t.map((_,i)=>{const x=i/40;return +(0.15+8.4*Math.exp(-Math.pow((x-.57)/.17,2))+Math.sin(i*.7)*.12).toFixed(2)});
 lineChart("speedChart",t,[{label:"Angular velocity",data:speed,borderColor:lime}],"rad/s");
 lineChart("consistencyChart",seeded(12).map(i=>`#${i+1}`),[{label:"Peak speed",data:[6.9,7.3,7.1,7.8,7.5,8.0,7.6,8.2,7.9,8.4,8.1,8.6],borderColor:lime}],"rad/s");
 const x=t.map((_,i)=>+(Math.sin(i*.21)*1.5+Math.cos(i*.08)*.5).toFixed(2));
 const y=t.map((_,i)=>+(Math.cos(i*.16)*2.2+Math.sin(i*.31)*.3).toFixed(2));
 const z=t.map((_,i)=>+(Math.sin(i*.18+1)*3.5*Math.exp(-Math.pow((i-24)/13,2))).toFixed(2));
 lineChart("axisChart",t,[{label:"X axis",data:x,borderColor:lime},{label:"Y axis",data:y,borderColor:teal},{label:"Z axis",data:z,borderColor:purple}],"rad/s");
 const ax=t.map((_,i)=>+(Math.sin(i*.3)*.5+Math.exp(-Math.pow((i-23)/5,2))*3).toFixed(2));
 const ay=t.map((_,i)=>+(Math.cos(i*.22)*.7+Math.exp(-Math.pow((i-25)/7,2))*2).toFixed(2));
 const az=t.map((_,i)=>+(9.81+Math.sin(i*.2)*.5+Math.exp(-Math.pow((i-24)/5,2))*1.5).toFixed(2));
 lineChart("accelChart",t,[{label:"X axis",data:ax,borderColor:lime},{label:"Y axis",data:ay,borderColor:teal},{label:"Z axis",data:az,borderColor:purple}],"m/s²");
}
function showView(view){
 $$(".view").forEach(v=>v.classList.toggle("active",v.id===view));
 $$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
 $("#crumb").textContent=({overview:"Overview",sessions:"Sessions",analysis:"Swing analysis",device:"Device setup"})[view]||"Overview";
 $("#sidebar").classList.remove("open");
}
$$(".nav-link").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
$$("[data-goto]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.goto)));
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#dismissNotice").addEventListener("click",()=>$(".notice").remove());
const sessionDialog=$("#sessionDialog");
function openSession(){sessionDialog.showModal()}
$("#newSessionBtn").addEventListener("click",openSession);$("#newSessionBtn2").addEventListener("click",openSession);
$("#createSession").addEventListener("click",e=>{
 e.preventDefault();const name=$("#sessionName").value.trim();if(!name){$("#sessionName").focus();return}
 const now=new Date();sessions.unshift({name,date:"Just now · "+now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),swings:0,peak:0,duration:0});
 renderSessions();sessionDialog.close();$("#sessionName").value="";showView("sessions");
});
$("#deviceInfo").addEventListener("click",()=>$("#infoDialog").showModal());
["#closeInfo","#closeInfo2"].forEach(id=>$(id).addEventListener("click",()=>$("#infoDialog").close()));
$("#exportBtn").addEventListener("click",()=>{
 const rows=[["session","date","swings","peak_angular_velocity_rad_s","average_duration_s"],...sessions.map(s=>[s.name,s.date,s.swings,s.peak,s.duration])];
 const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="smartbat-demo-sessions.csv";a.click();URL.revokeObjectURL(a.href);
});
renderSessions();initCharts();