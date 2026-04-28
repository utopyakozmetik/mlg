let posts=[];
let current=0;

const globalAudio=document.getElementById("globalAudio");

document.addEventListener("DOMContentLoaded",()=>{
document.querySelectorAll(".lang").forEach(l=>l.onclick=init);
});

async function init(){

document.getElementById("intro").style.display="none";

const res = await fetch("posts.json");
posts = await res.json();

posts.sort((a,b)=>new Date(b.date)-new Date(a.date));

render();
buildArchive();
setupModal();
setupPlayer();
}

/* FEED */
function render(){
const t=document.getElementById("timeline");
t.innerHTML="";

posts.forEach((p,i)=>{
const el=document.createElement("div");
el.className="post";

if(p.title){
const title=document.createElement("div");
title.innerHTML=ransomText(p.title);
el.appendChild(title);
}

if(p.images){
el.appendChild(createSlider(p.images));
}

el.onclick=()=>open(i);

t.appendChild(el);
});
}

/* SLIDER */
function createSlider(media, isModal=false){

const wrap=document.createElement("div");
wrap.className="slider";

let i=0;

const slides=media.map(src=>{
const isVideo=src.endsWith(".mp4");
const el=document.createElement(isVideo?"video":"img");

el.src=src;
el.className="slide";

if(isVideo){
el.loop=true;
el.muted=true;
el.addEventListener("mouseenter",()=>el.play());
el.addEventListener("mouseleave",()=>el.pause());
}

wrap.appendChild(el);
return el;
});

function show(){
slides.forEach(s=>s.classList.remove("active"));
slides[i].classList.add("active");
}

if(!isModal){
const prev=document.createElement("button");
const next=document.createElement("button");

prev.className="nav-btn prev";
next.className="nav-btn next";

prev.innerHTML="←";
next.innerHTML="→";

prev.onclick=(e)=>{e.stopPropagation();i=(i-1+slides.length)%slides.length;show();}
next.onclick=(e)=>{e.stopPropagation();i=(i+1)%slides.length;show();}

wrap.appendChild(prev);
wrap.appendChild(next);
}

wrap.addEventListener("pointerdown",(e)=>{
wrap.startX=e.clientX;
});

wrap.addEventListener("pointerup",(e)=>{
let diff=e.clientX-wrap.startX;

if(Math.abs(diff)>50){
if(diff>0) i=(i-1+slides.length)%slides.length;
else i=(i+1)%slides.length;
show();
}
});

show();
return wrap;
}

/* MODAL */
function open(i){

current=i;

const p=posts[i];

const m=document.getElementById("modal-media");
const s=document.getElementById("modal-side");

m.innerHTML="";
s.innerHTML="";

if(p.images){
m.appendChild(createSlider(p.images,true));
}

if(p.audio){
globalAudio.src=p.audio;
globalAudio.play();
document.getElementById("trackName").innerText=getName(p.audio);
}

s.innerHTML=`
<h2>${ransomText(p.title||"")}</h2>
<p>${ransomText(p.description||"")}</p>
`;

document.getElementById("modal").classList.remove("hidden");
}

/* INDEX FULL */
function buildArchive(){

const a=document.getElementById("left-archive");
a.innerHTML="";

const groups={};

posts.forEach((p,i)=>{
const d=new Date(p.date);
const key=d.getFullYear()+" / "+d.toLocaleString("tr-TR",{month:"long"});

if(!groups[key]) groups[key]=[];
groups[key].push({title:p.title,index:i});
});

Object.keys(groups).forEach(k=>{
const group=document.createElement("div");
group.className="archive-group";

const title=document.createElement("div");
title.className="archive-title";
title.innerText=k;

group.appendChild(title);

groups[k].forEach(item=>{
const el=document.createElement("div");
el.className="archive-item";
el.innerText=item.title;
el.onclick=()=>document.querySelectorAll(".post")[item.index].scrollIntoView({behavior:"smooth"});
group.appendChild(el);
});

a.appendChild(group);
});
}

/* PLAYER AUTO PLAYLIST */
function setupPlayer(){

/* 🔥 SADECE BURAYI DOLDUR */
const files=[
"Gece Yuruyusu.mp3",
"Karanlik Ambient.mp3",
"Noise Study.mp3"
];

const base="assets/music/";

const tracks=files.map(f=>({
src:base+f,
name:f.replace(".mp3","")
}));

let i=0;
let playing=false;

const playBtn=document.getElementById("playPause");
const progressBar=document.getElementById("progressBar");
const trackName=document.getElementById("trackName");

function load(){
globalAudio.src=tracks[i].src;
trackName.innerText=tracks[i].name;
globalAudio.play();
playing=true;
playBtn.innerText="⏸";
}

playBtn.onclick=()=>{
if(playing){
globalAudio.pause();
playBtn.innerText="▶";
}else{
globalAudio.play();
playBtn.innerText="⏸";
}
playing=!playing;
};

document.getElementById("prevTrack").onclick=()=>{
i--; if(i<0)i=tracks.length-1; load();
};

document.getElementById("nextTrack").onclick=()=>{
i++; if(i>=tracks.length)i=0; load();
};

globalAudio.ontimeupdate=()=>{
const p=(globalAudio.currentTime/globalAudio.duration)*100;
progressBar.style.width=p+"%";
};

document.querySelector(".progress").onclick=(e)=>{
const rect=e.currentTarget.getBoundingClientRect();
const x=e.clientX-rect.left;
const ratio=x/rect.width;
globalAudio.currentTime=ratio*globalAudio.duration;
};

load();
}

/* RANSOM */
function ransomText(t){

const fonts=[
"Special Elite",
"Courier Prime",
"IM Fell English",
"Georgia",
"Arial Black"
];

return [...t].map(c=>{
if(c===" ") return " ";

const f=fonts[Math.random()*fonts.length|0];

return `<span style="
font-family:${f};
display:inline-block;
transform:rotate(${Math.random()*8-4}deg);
">${c}</span>`;
}).join("");
}

function getName(p){
return p.split("/").pop().replace(".mp3","");
}