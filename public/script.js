
let posts=[];
let current=0;

/* AUDIO */
let activeMedia=null;
const globalAudio=document.getElementById("globalAudio");

/* STOP ALL AUDIO */
function stopAll(){
if(globalAudio) globalAudio.pause();
if(activeMedia){
activeMedia.pause();
activeMedia.currentTime=0;
activeMedia=null;
}
document.querySelectorAll("video").forEach(v=>v.pause());
}

/* POST AUDIO */
function playPostAudio(a){
stopAll();
activeMedia=a;
a.play().catch(()=>{});
}

/* VIDEO LOCK */
function bindVideo(v){
v.addEventListener("play",()=>{
stopAll();
activeMedia=v;
});
}

/* INTRO */
document.addEventListener("DOMContentLoaded",()=>{
document.querySelectorAll(".lang").forEach(l=>{
l.onclick=init;
});
});

/* INIT */
async function init(){

document.getElementById("intro").style.display="none";

/* LOAD POSTS */
posts=await fetch("posts.json").then(r=>r.json());
posts.sort((a,b)=>new Date(b.date)-new Date(a.date));

render();
setupModal();
setupPlayer();

initRansomPhysics("Kokular Ütopyasına Hoşgeldiniz");
}

/* FEED */
function render(){
const t=document.getElementById("timeline");

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

let i=0;

const slides=media.map(src=>{
let el;

if(src.endsWith(".mp4")){
el=document.createElement("video");
el.src=src;
el.autoplay=true;
el.loop=true;
el.controls=true;
bindVideo(el);
}else{
el=document.createElement("img");
el.src=src;
}

el.className="slide";
return el;
});

function show(){
slides.forEach(s=>s.classList.remove("active"));
slides[i].classList.add("active");
}

const prev=document.createElement("button");
const next=document.createElement("button");

prev.innerText="‹";
next.innerText="›";

prev.onclick=()=>{i=(i-1+slides.length)%slides.length;show();}
next.onclick=()=>{i=(i+1)%slides.length;show();}

slides.forEach(s=>wrap.appendChild(s));
wrap.appendChild(prev);
wrap.appendChild(next);

show();
return wrap;
}

/* GLOBAL PLAYER */
function setupPlayer(){

const tracks=[
{src:"assets/music/track1.mp3"},
{src:"assets/music/track2.mp3"},
{src:"assets/music/track3.mp3"}
];

let i=0;

function load(){
stopAll();
globalAudio.src=tracks[i].src;
globalAudio.play().catch(()=>{});
activeMedia=globalAudio;
}

document.getElementById("nextTrack").onclick=()=>{
i=(i+1)%tracks.length;
load();
};

document.getElementById("prevTrack").onclick=()=>{
i=(i-1+tracks.length)%tracks.length;
load();
};

globalAudio.addEventListener("play",stopAll);

load();
}

/* MODAL */
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
a.onplay=()=>playPostAudio(a);
m.appendChild(a);
}

s.innerHTML=`<h2>${p.title||""}</h2><p>${p.description||""}</p>`;

document.getElementById("modal").classList.remove("hidden");
}

/* =========================
   🔥 RANSOM v4 PHYSICS ENGINE
========================= */

const fonts=[
"Special Elite",
"Courier Prime",
"IM Fell English",
"Georgia",
"Times New Roman",
"Arial Black"
];

class Letter{
constructor(char,x,y){
this.char=char;
this.x=x;
this.y=y;
this.vx=Math.random()*4-2;
this.vy=Math.random()*2;

this.el=document.createElement("div");
this.el.className="ransom-char";
this.el.innerText=char;

this.el.style.fontFamily=fonts[Math.floor(Math.random()*fonts.length)];

document.getElementById("ransom-root").appendChild(this.el);
}

update(){
this.vy+=0.25;

this.x+=this.vx;
this.y+=this.vy;

if(this.y>150){
this.y=150;
this.vy*=-0.4;
this.vx*=0.9;
}

this.render();
}

render(){
this.el.style.transform=
`translate(${this.x}px,${this.y}px) rotate(${this.vx*2}deg)`;
}
}

let letters=[];

function initRansomPhysics(text){

const root=document.getElementById("ransom-root");
root.innerHTML="";

letters=[];

let x=50,y=20;

[...text].forEach(c=>{
if(c===" "){x+=20;return;}

const l=new Letter(c,x,y);
letters.push(l);

x+=18+Math.random()*5;
y+=(Math.random()*10-5);
});

animate();
}

function animate(){
letters.forEach(l=>l.update());
requestAnimationFrame(animate);
}