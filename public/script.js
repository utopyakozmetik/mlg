
// =====================
// STATE
// =====================
let posts = [];
let current = 0;

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", async () => {
  renderRansom("FALAN FİLAN");

  posts = await loadPosts();
  posts = sortByDate(posts);

  renderFeed(posts);
  initSwipe();
  parallax();
});

// =====================
// LOAD (LOCAL + CACHE READY)
// =====================
async function loadPosts(){
  const local = localStorage.getItem("posts");
  if(local) return JSON.parse(local);

  const res = await fetch("/posts.json");
  return await res.json();
}

// =====================
// SORT DATE
// =====================
function sortByDate(p){
  return p.sort((a,b)=> new Date(b.date)-new Date(a.date));
}

// =====================
// SIDEBAR RANSOM
// =====================
function renderRansom(text){
  const el = document.getElementById("sidebar-title");
  el.innerHTML = "";

  let i=0;

  (function type(){
    if(i<text.length){
      const s=document.createElement("span");
      s.textContent=text[i];
      s.className="ransom-char";

      s.onmouseover=()=>s.textContent=randomChar();

      el.appendChild(s);
      i++;
      setTimeout(type,80);
    }
  })();
}

function randomChar(){
  return String.fromCharCode(65+Math.random()*26);
}

// =====================
// FEED
// =====================
function renderFeed(data){
  const t=document.getElementById("timeline");
  t.innerHTML="";

  data.forEach((p,i)=>{
    const d=document.createElement("div");
    d.className="post";

    d.innerHTML=`
      <video src="${p.images[0]}" muted loop playsinline></video>
      <h2>${p.title}</h2>
      <small>${p.date}</small>
    `;

    d.onclick=()=>openModal(i);

    t.appendChild(d);
  });

  observeVideos();
}

// =====================
// AUTO PLAY
// =====================
function observeVideos(){
  const vids=document.querySelectorAll("video");

  const o=new IntersectionObserver(e=>{
    e.forEach(v=>{
      if(v.isIntersecting) v.target.play();
      else v.target.pause();
    });
  },{threshold:0.6});

  vids.forEach(v=>o.observe(v));
}

// =====================
// FULLSCREEN VIEW
// =====================
function openModal(i){
  current=i;

  const p=posts[i];
  const m=document.getElementById("modal");

  document.getElementById("modal-body").innerHTML=`
    <video src="${p.images[0]}" autoplay muted loop></video>
    <h1>${p.title}</h1>
    <p>${p.description||""}</p>
    <small>${p.date}</small>
  `;

  m.classList.remove("hidden");
}

function closeModal(){
  document.getElementById("modal").classList.add("hidden");
}

// =====================
// SWIPE
// =====================
function initSwipe(){
  let start=0;

  window.addEventListener("touchstart",e=>{
    start=e.touches[0].clientY;
  });

  window.addEventListener("touchend",e=>{
    let end=e.changedTouches[0].clientY;

    if(start-end>50) next();
    if(end-start>50) prev();
  });
}

function next(){
  current=(current+1)%posts.length;
  openModal(current);
}

function prev(){
  current=(current-1+posts.length)%posts.length;
  openModal(current);
}

// =====================
// PARALLAX
// =====================
function parallax(){
  window.addEventListener("mousemove",e=>{
    const x=(window.innerWidth-e.pageX)/50;
    const y=(window.innerHeight-e.pageY)/50;

    document.getElementById("bg")
      .style.transform=`translate(${x}px,${y}px) scale(1.1)`;
  });
}

// =====================
// ADMIN PANEL
// =====================
function openAdmin(){
  document.getElementById("admin").classList.remove("hidden");
}

function closeAdmin(){
  document.getElementById("admin").classList.add("hidden");
}

function savePost(){
  const p={
    title: a_title.value,
    date: a_date.value,
    images:[a_media.value],
    description:a_desc.value
  };

  posts.push(p);

  localStorage.setItem("posts",JSON.stringify(posts));

  renderFeed(posts);

  closeAdmin();
}