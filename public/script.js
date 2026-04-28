let posts=[];
let current=0;

/* AUDIO */
let activeMedia=null;
const globalAudio=document.getElementById("globalAudio");

function stopAll(){
if(globalAudio) globalAudio.pause();
if(activeMedia){
activeMedia.pause();
activeMedia=null;
}
document.querySelectorAll("video").forEach(v=>v.pause());
}

function playPostAudio(a){
stopAll();
activeMedia=a;
a.play().catch(()=>{});
}

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

posts=await fetch("posts.json").then(r=>r.json());
posts.sort((a,b)=>new Date(b.date)-new Date(a.date));

render();
buildArchive();
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
wrap.className="slider";

let i=0;

const slides=media.map(src=>{
const el=document.createElement(src.endsWith(".mp4")?"video":"img");

el.src=src;
el.className="slide";

if(el.tagName==="VIDEO"){
el.autoplay=true;
el.loop=true;
el.controls=true;
bindVideo(el);
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

prev.innerHTML="← Previous";
next.innerHTML="Next →";

prev.onclick=(e)=>{e.stopPropagation();i=(i-1+slides.length)%slides.length;show();}
next.onclick=(e)=>{e.stopPropagation();i=(i+1)%slides.length;show();}

wrap.appendChild(prev);
wrap.appendChild(next);

show();
return wrap;
}

/* ARCHIVE */
function buildArchive(){
const a=document.getElementById("left-archive");
a.innerHTML="";

const map={};

posts.forEach((p,i)=>{
const d=new Date(p.date);
const m=d.toLocaleString("tr-TR",{month:"long",year:"numeric"});

if(!map[m]) map[m]=[];
map[m].push({title:p.title,index:i});
});

Object.keys(map).forEach(m=>{
const t=document.createElement("div");
t.textContent=m;
t.style.opacity=.6;
a.appendChild(t);

map[m].forEach(x=>{
const el=document.createElement("div");
el.textContent=x.title;
el.onclick=()=>document.querySelectorAll(".post")[x.index].scrollIntoView({behavior:"smooth"});
a.appendChild(el);
});
});
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

/* OPEN */
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

s.innerHTML=`
<h2>${ransomText(p.title||"")}</h2>
<p>${ransomText(p.description||"")}</p>
`;

document.getElementById("modal").classList.remove("hidden");
}

/* RANSOM TEXT */
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
transform:rotate(${Math.random()*30-15}deg);
">${c}</span>`;
}).join("");
}

/* AUDIO PLAYER */
function setupPlayer(){

const tracks=[
{src:"assets/music/track1.mp3"},
{src:"assets/music/track2.mp3"}
];

let i=0;

function load(){
stopAll();
globalAudio.src=tracks[i].src;
globalAudio.play();
activeMedia=globalAudio;
}

document.getElementById("prevTrack").onclick=()=>{i--;if(i<0)i=tracks.length-1;load();}
document.getElementById("nextTrack").onclick=()=>{i++;if(i>=tracks.length)i=0;load();}

globalAudio.onplay=stopAll;

load();
}

/* PHYSICS */
const fonts=["Special Elite","Courier Prime","IM Fell English"];

class L{
constructor(c,x,y){
this.c=c;
this.x=x;
this.y=y;
this.vx=Math.random()*4-2;
this.vy=Math.random()*2;

this.el=document.createElement("div");
this.el.className="ransom-char";
this.el.innerText=c;
this.el.style.fontFamily=fonts[Math.random()*fonts.length|0];

document.getElementById("ransom-root").appendChild(this.el);
}

update(){
this.vy+=0.2;
this.x+=this.vx;
this.y+=this.vy;

this.render();
}

render(){
this.el.style.transform=`translate(${this.x}px,${this.y}px)`;
}
}

let letters=[];

function initRansomPhysics(text){

const root=document.getElementById("ransom-root");
root.innerHTML="";
letters=[];

let x=50,y=20;

[...text].forEach(c=>{
const l=new L(c,x,y);
letters.push(l);
x+=15;
});

loop();
}

function loop(){
letters.forEach(l=>l.update());
requestAnimationFrame(loop);
}