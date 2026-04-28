let posts=[];
let current=0;

const globalAudio=document.getElementById("globalAudio");

document.addEventListener("DOMContentLoaded",()=>{
document.querySelectorAll(".lang").forEach(l=>l.onclick=init);
});

async function init(){

document.getElementById("intro").style.display="none";

try{
const res = await fetch("posts.json");
posts = await res.json();
}catch(e){
console.error("JSON ERROR:", e);
}

posts.sort((a,b)=>new Date(b.date)-new Date(a.date));

render();
buildArchive();
setupModal();
setupPlayer();
}

/* RENDER */
function render(){
const t=document.getElementById("timeline");
t.innerHTML="";

posts.forEach((p,i)=>{
const el=document.createElement("div");
el.className="post";

if(p.images){
el.appendChild(createSlider(p.images));
}

el.onclick=()=>open(i);

t.appendChild(el);
});
}

/* SLIDER */
function createSlider(media){

const wrap=document.createElement("div");
wrap.className="slider";

let i=0;

const slides=media.map(src=>{
const el=document.createElement(src.endsWith(".mp4")?"video":"img");
el.src=src; // PATH FIXED (relative)
el.className="slide";

if(el.tagName==="VIDEO"){
el.autoplay=true;
el.loop=true;
el.controls=true;
}

wrap.appendChild(el);
return el;
});

function show(){
slides.forEach(s=>s.classList.remove("active"));
slides[i].classList.add("active");
}

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
m.appendChild(createSlider(p.images));
}

if(p.audio){
const a=document.createElement("audio");
a.src=p.audio;
a.controls=true;
m.appendChild(a);
}

s.innerHTML=`<h2>${p.title}</h2><p>${p.description}</p>`;

document.getElementById("modal").classList.remove("hidden");
}

function setupModal(){

document.getElementById("closeModal").onclick=()=>{
document.getElementById("modal").classList.add("hidden");
};

document.getElementById("prevPost").onclick=()=>{
current=(current-1+posts.length)%posts.length;
open(current);
};

document.getElementById("nextPost").onclick=()=>{
current=(current+1)%posts.length;
open(current);
};
}

/* ARCHIVE */
function buildArchive(){
const a=document.getElementById("left-archive");
a.innerHTML="";

posts.forEach((p,i)=>{
const el=document.createElement("div");
el.textContent=p.title;
el.onclick=()=>document.querySelectorAll(".post")[i].scrollIntoView({behavior:"smooth"});
a.appendChild(el);
});
}

/* PLAYER (FIXED & SMOOTH) */
function setupPlayer(){

const tracks=[
{src:"assets/music/track1.mp3", name:"Track 1"},
{src:"assets/music/track2.mp3", name:"Track 2"}
];

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