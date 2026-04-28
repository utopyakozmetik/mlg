let posts=[];
let current=0;
const globalAudio=document.getElementById("globalAudio");

document.addEventListener("DOMContentLoaded",()=>{
document.querySelectorAll(".lang").forEach(l=>l.onclick=init);
});

async function init(){

document.getElementById("intro").style.display="none";

posts=await fetch("posts.json").then(r=>r.json());
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

if(p.images){
el.appendChild(createSlider(p.images,false));
}

el.onclick=()=>open(i);

t.appendChild(el);
});
}

/* SLIDER */
function createSlider(media,isModal){

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
m.appendChild(createSlider(p.images,true));
}

if(p.audio){
globalAudio.src=p.audio;
globalAudio.play();
}

s.innerHTML=`
<h2>${p.title||""}</h2>
<p>${p.description||""}</p>
`;

document.getElementById("modal").classList.remove("hidden");
}

/* INDEX */
function buildArchive(){

const a=document.getElementById("left-archive");
a.innerHTML="";

posts.forEach((p,i)=>{
const el=document.createElement("div");
el.className="archive-item";
el.innerText=p.title;
el.onclick=()=>document.querySelectorAll(".post")[i].scrollIntoView({behavior:"smooth"});
a.appendChild(el);
});
}

/* PLAYER */
function setupPlayer(){

const tracks=[
{src:"assets/music/track1.mp3",name:"Track 1"},
{src:"assets/music/track2.mp3",name:"Track 2"}
];

let i=0;

const playBtn=document.getElementById("playPause");
const trackName=document.getElementById("trackName");
const bar=document.getElementById("progressBar");

function load(){
globalAudio.src=tracks[i].src;
trackName.innerText=tracks[i].name;
globalAudio.play();
playBtn.innerText="⏸";
}

playBtn.onclick=()=>{
if(globalAudio.paused) globalAudio.play();
else globalAudio.pause();
};

document.getElementById("prevTrack").onclick=()=>{i--;if(i<0)i=tracks.length-1;load();}
document.getElementById("nextTrack").onclick=()=>{i++;if(i>=tracks.length)i=0;load();}

globalAudio.ontimeupdate=()=>{
if(globalAudio.duration){
bar.style.width=(globalAudio.currentTime/globalAudio.duration)*100+"%";
}
};

load();
}