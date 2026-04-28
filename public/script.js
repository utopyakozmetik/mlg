let posts=[];
let current=0;

const audio=document.getElementById("globalAudio");

/* 🔊 CLICK SOUND */
const clickSound=new Audio("assets/sounds/click.mp3");

function playClick(){
clickSound.currentTime=0;
clickSound.play().catch(()=>{});
}

/* =========================
   INIT
========================= */
document.querySelectorAll(".lang").forEach(l=>{
l.onclick=()=>{
playClick();
init();
};
});

async function init(){

document.getElementById("intro").style.display="none";

posts=await fetch("posts.json").then(r=>r.json());
posts.sort((a,b)=>new Date(b.date)-new Date(a.date));

render();
archive();
player();
setupModal();
}

/* =========================
   FEED
========================= */
function render(){

const t=document.getElementById("timeline");
t.innerHTML="";

posts.forEach((p,i)=>{

const el=document.createElement("div");
el.className="post";

if(p.images){
el.appendChild(slider(p.images,false)); // feed
}

el.onclick=()=>{
playClick();
openPost(i);
};

t.appendChild(el);
});
}

/* =========================
   🔥 SLIDER (ISOLATED FIXED)
========================= */
function slider(arr,isModal=false){

const wrap=document.createElement("div");
wrap.className="slider";

let i=0;

const slides=arr.map(src=>{

let el;

const clean=src.split("?")[0].toLowerCase();

if(clean.endsWith(".mp4")){
el=document.createElement("video");
el.src=src;
el.loop=true;
el.muted=true;
el.playsInline=true;
}else{
el=document.createElement("img");
el.src=src;
}

el.className="slide";
wrap.appendChild(el);

return el;
});

function show(){

slides.forEach(s=>{
s.classList.remove("active");

if(s.tagName==="VIDEO"){
s.pause();
s.currentTime=0;
}
});

const active=slides[i];
active.classList.add("active");

if(active.tagName==="VIDEO"){
active.play().catch(()=>{});
}
}

/* NAV */
const prev=document.createElement("div");
const next=document.createElement("div");

prev.className="nav-btn prev";
next.className="nav-btn next";

prev.innerHTML=`<img src="assets/images/onceki.png">`;
next.innerHTML=`<img src="assets/images/sonraki.png">`;

prev.addEventListener("click",(e)=>{
e.stopPropagation();
playClick();
i=(i-1+slides.length)%slides.length;
show();
});

next.addEventListener("click",(e)=>{
e.stopPropagation();
playClick();
i=(i+1)%slides.length;
show();
});

/* 🔥 ISOLATION RULE */
wrap.appendChild(prev);
wrap.appendChild(next);

show();

/* cleanup hook (future-proof) */
wrap._destroy=()=>{
slides.forEach(s=>{
if(s.tagName==="VIDEO") s.pause();
});
};

return wrap;
}

/* =========================
   MODAL
========================= */
function openPost(i){

current=i;

const p=posts[i];

const m=document.getElementById("modal-media");
const s=document.getElementById("modal-side");

m.innerHTML="";
s.innerHTML="";

/* stop home audio */
audio.pause();
audio.currentTime=0;

/* media */
if(p.images){
m.appendChild(slider(p.images,true)); // modal
}

if(p.audio){
audio.src=p.audio;
audio.play().catch(()=>{});
}

/* text */
s.innerHTML=`
<h2>${ransomText(p.title||"")}</h2>
<p>${ransomText(p.description||"")}</p>
`;

document.getElementById("modal").classList.remove("hidden");
}

/* =========================
   ARCHIVE
========================= */
function archive(){

const a=document.getElementById("left-archive");
a.innerHTML="";

const h=document.createElement("div");
h.innerText="Nisan '26";
a.appendChild(h);

posts.forEach((p,i)=>{
const el=document.createElement("div");
el.innerText=p.title;

el.onclick=()=>{
playClick();
document.querySelectorAll(".post")[i]
.scrollIntoView({behavior:"smooth"});
};

a.appendChild(el);
});
}

/* =========================
   MODAL CONTROLS
========================= */
function setupModal(){

document.getElementById("closeModal").onclick=()=>{
playClick();
document.getElementById("modal").classList.add("hidden");
audio.pause();
};

document.getElementById("prevPost").onclick=()=>{
playClick();
current=(current-1+posts.length)%posts.length;
openPost(current);
};

document.getElementById("nextPost").onclick=()=>{
playClick();
current=(current+1)%posts.length;
openPost(current);
};
}

/* =========================
   PLAYER
========================= */
function player(){

const tracks=[
{
src:"assets/music/acrimony - burning lives.mp3",
name:"Acrimony - Burning Lives"
},
{
src:"assets/music/res facta - catastroph.mp3",
name:"Res Facta - Catastroph"
}
];

let i=0;

const btn=document.getElementById("playPause");
const name=document.getElementById("trackName");
const bar=document.getElementById("progressBar");

function load(){
audio.src=tracks[i].src;
name.innerText=tracks[i].name;
audio.play().catch(()=>{});
}

btn.onclick=()=>{
playClick();
if(audio.paused) audio.play();
else audio.pause();
};

document.getElementById("prevTrack").onclick=()=>{
playClick();
i--; if(i<0)i=tracks.length-1;
load();
};

document.getElementById("nextTrack").onclick=()=>{
playClick();
i++; if(i>=tracks.length)i=0;
load();
};

audio.ontimeupdate=()=>{
if(audio.duration){
bar.style.width=(audio.currentTime/audio.duration)*100+"%";
}
};

load();
}

/* =========================
   RANSOM
========================= */
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
transform:rotate(${Math.random()*20-10}deg);
">${c}</span>`;
}).join("");
}