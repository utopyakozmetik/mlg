
let posts=[];
let current=0;

const audio=document.getElementById("globalAudio");

/* INTRO */
document.querySelectorAll(".lang").forEach(l=>{
l.onclick=init;
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

/* FEED */
function render(){

const t=document.getElementById("timeline");
t.innerHTML="";

posts.forEach((p,i)=>{

const el=document.createElement("div");
el.className="post";

if(p.images){
el.appendChild(slider(p.images,false));
}

el.onclick=()=>openPost(i);

t.appendChild(el);
});
}

/* SLIDER (SAFE) */
function slider(arr,modal){

const wrap=document.createElement("div");
wrap.className="slider";

let i=0;

const slides=arr.map(s=>{
const img=document.createElement("img");
img.src=s;
img.className="slide";
wrap.appendChild(img);
return img;
});

function show(){
slides.forEach(x=>x.classList.remove("active"));
slides[i].classList.add("active");
}

const prev=document.createElement("button");
const next=document.createElement("button");

prev.className="nav-btn prev";
next.className="nav-btn next";

prev.innerText="←";
next.innerText="→";

prev.onclick=e=>{
e.stopPropagation();
i=(i-1+slides.length)%slides.length;
show();
};

next.onclick=e=>{
e.stopPropagation();
i=(i+1)%slides.length;
show();
};

wrap.appendChild(prev);
wrap.appendChild(next);

show();
return wrap;
}

/* MODAL OPEN */
function openPost(i){

current=i;

const p=posts[i];

const m=document.getElementById("modal-media");
const s=document.getElementById("modal-side");

m.innerHTML="";
s.innerHTML="";

if(p.images){
m.appendChild(slider(p.images,true));
}

if(p.audio){
audio.src=p.audio;
audio.play().catch(()=>{});
}

s.innerHTML=`
<h2>${p.title||""}</h2>
<p>${p.description||""}</p>
`;

document.getElementById("modal").classList.remove("hidden");
}

/* ARCHIVE FIX */
function archive(){

const a=document.getElementById("left-archive");
a.innerHTML="";

const h=document.createElement("div");
h.innerText="Nisan '26";
h.style.opacity="0.6";
h.style.marginBottom="10px";
a.appendChild(h);

posts.forEach((p,i)=>{

const el=document.createElement("div");
el.innerText=p.title;
el.onclick=()=>document.querySelectorAll(".post")[i]
.scrollIntoView({behavior:"smooth"});
a.appendChild(el);
});
}

/* MODAL CONTROLS */
function setupModal(){

document.getElementById("closeModal").onclick=()=>{
document.getElementById("modal").classList.add("hidden");
audio.pause();
};

document.getElementById("prevPost").onclick=()=>{
current=(current-1+posts.length)%posts.length;
openPost(current);
};

document.getElementById("nextPost").onclick=()=>{
current=(current+1)%posts.length;
openPost(current);
};
}

/* PLAYER */
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
btn.innerText="⏸";
}

btn.onclick=()=>{
if(audio.paused){
audio.play();
btn.innerText="⏸";
}else{
audio.pause();
btn.innerText="▶";
}
};

document.getElementById("prevTrack").onclick=()=>{
i--; if(i<0)i=tracks.length-1; load();
};

document.getElementById("nextTrack").onclick=()=>{
i++; if(i>=tracks.length)i=0; load();
};

audio.ontimeupdate=()=>{
if(audio.duration){
bar.style.width=(audio.currentTime/audio.duration)*100+"%";
}
};

load();
}