let posts=[];
let current=0;

const audio=document.getElementById("globalAudio");

const clickSound=new Audio("assets/sounds/click.mp3");

function playClick(){
clickSound.currentTime=0;
clickSound.play().catch(()=>{});
}

/* INIT */
document.querySelectorAll(".lang").forEach(l=>{
l.onclick=()=>init();
});

async function init(){

document.getElementById("intro").style.display="none";

posts=await fetch("posts.json").then(r=>r.json());
posts.sort((a,b)=>new Date(b.date)-new Date(a.date));

render();
archive();
player();
setupModal();

/* sadece müzik autoplay */
setTimeout(()=>audio.play().catch(()=>{}),500);
}

/* FEED → SADECE İLK MEDYA */
function render(){

const t=document.getElementById("timeline");
t.innerHTML="";

posts.forEach((p,i)=>{

const el=document.createElement("div");
el.className="post";

let first=p.images?.[0];

if(first){

let media;

if(typeof first==="string"){
media=document.createElement("img");
media.src=first;
}else{
media=document.createElement("video");
media.src=`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,f_auto/${first.src}.mp4`;
media.muted=true;
media.loop=true;
media.playsInline=true;
media.autoplay=true;
}

media.style.width="100%";
el.appendChild(media);
}

el.onclick=()=>{
playClick();
openPost(i);
};

t.appendChild(el);
});
}

/* MODAL */
function openPost(i){

current=i;

const p=posts[i];

const m=document.getElementById("modal-media");
const s=document.getElementById("modal-side");

m.innerHTML="";
s.innerHTML="";

audio.pause();

if(p.images){
m.appendChild(slider(p.images));
}

if(p.audio){
audio.src=p.audio;
audio.play().catch(()=>{});
}

s.innerHTML=`
<h2>${ransomText(p.title)}</h2>
<p>${ransomText(p.description)}</p>
`;

document.getElementById("modal").classList.remove("hidden");
}

/* MODAL SLIDER (DEĞİŞMEDİ) */
function slider(arr){

const wrap=document.createElement("div");
wrap.className="slider";

let i=0;

const slides=arr.map(item=>{

let el;

if(typeof item==="string"){
el=document.createElement("img");
el.src=item;
}else{
el=document.createElement("video");
el.src=`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,f_auto/${item.src}.mp4`;
el.muted=true;
el.loop=true;
el.playsInline=true;
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

slides[i].classList.add("active");

if(slides[i].tagName==="VIDEO"){
slides[i].play().catch(()=>{});
}
}

const prev=document.createElement("div");
const next=document.createElement("div");

prev.innerHTML=`<img src="assets/images/onceki.png">`;
next.innerHTML=`<img src="assets/images/sonraki.png">`;

prev.onclick=(e)=>{e.stopPropagation();i=(i-1+slides.length)%slides.length;show();};
next.onclick=(e)=>{e.stopPropagation();i=(i+1)%slides.length;show();};

wrap.appendChild(prev);
wrap.appendChild(next);

show();
return wrap;
}

/* ARCHIVE → NİSAN IMAGE FIX */
function archive(){

const a=document.getElementById("left-archive");
a.innerHTML="";

const img=document.createElement("img");
img.src="assets/images/nisan.png";
img.style.width="140px";
a.appendChild(img);

posts.forEach((p,i)=>{
const el=document.createElement("div");
el.innerHTML=ransomText(p.title);

el.onclick=()=>{
document.querySelectorAll(".post")[i]
.scrollIntoView({behavior:"smooth"});
};

a.appendChild(el);
});
}

/* MODAL CONTROLS → 1 PREV / 1 NEXT */
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

/* PLAYER (DEĞİŞMEDİ) */
function player(){

const tracks=[
{src:"assets/music/acrimony.mp3",name:"Acrimony"},
{src:"assets/music/res.mp3",name:"Res Facta"}
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

btn.onclick=()=>audio.paused?audio.play():audio.pause();

document.getElementById("prevTrack").onclick=()=>{i--;if(i<0)i=tracks.length-1;load();};
document.getElementById("nextTrack").onclick=()=>{i++;if(i>=tracks.length)i=0;load();};

audio.ontimeupdate=()=>{
if(audio.duration){
bar.style.width=(audio.currentTime/audio.duration)*100+"%";
}
};

load();
}

/* RANSOM (DEĞİŞMEDİ) */
function ransomText(t){

const fonts=["Special Elite","Courier Prime","IM Fell English","Georgia","Arial Black"];

return [...t].map(c=>{
if(c===" ") return " ";
return `<span style="font-family:${fonts[Math.random()*fonts.length|0]};transform:rotate(${Math.random()*20-10}deg);display:inline-block">${c}</span>`;
}).join("");
}