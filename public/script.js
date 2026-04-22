
let posts = [];
let current = 0;

document.addEventListener("DOMContentLoaded", async () => {

  renderRansom("FALAN FİLAN");

  posts = await loadPosts();
  posts = sortByDate(posts);

  renderFeed(posts);
  initSwipe();
  parallax();
});

/* LOAD */
async function loadPosts(){
  const res = await fetch("/posts.json");
  return await res.json();
}

/* SORT */
function sortByDate(p){
  return p.sort((a,b)=> new Date(b.date)-new Date(a.date));
}

/* RANSOM */
function renderRansom(text){
  const el=document.getElementById("sidebar-title");
  el.innerHTML="";

  let i=0;

  (function loop(){
    if(i<text.length){
      const s=document.createElement("span");
      s.textContent=text[i];
      s.className="ransom-char";
      el.appendChild(s);
      i++;
      setTimeout(loop,80);
    }
  })();
}

/* FEED */
function renderFeed(data){
  const t=document.getElementById("timeline");
  t.innerHTML="";

  data.forEach((p,i)=>{
    const d=document.createElement("div");
    d.className="post";

    const media = p.images?.[0];

    const isVideo = media?.includes(".mp4");

    const mediaHTML = media
      ? (isVideo
          ? `<video src="${media}" muted loop playsinline></video>`
          : `<img src="${media}">`)
      : "";

    d.innerHTML = `
      ${mediaHTML}
      <h2>${p.title || ""}</h2>
      <small>${p.date || ""}</small>
    `;

    /* AUDIO */
    if(p.audio){
      const a=document.createElement("audio");
      a.controls=true;
      a.src=p.audio;
      d.appendChild(a);
    }

    d.onclick=()=>openModal(i);

    t.appendChild(d);
  });

  observeVideos();
}

/* AUTO PLAY VIDEO */
function observeVideos(){
  const vids=document.querySelectorAll("video");

  const obs=new IntersectionObserver(e=>{
    e.forEach(v=>{
      if(v.isIntersecting) v.target.play();
      else v.target.pause();
    });
  },{threshold:0.6});

  vids.forEach(v=>obs.observe(v));
}

/* MODAL */
function openModal(i){
  current=i;

  const p=posts[i];
  const media=p.images?.[0];

  const isVideo=media?.includes(".mp4");

  document.getElementById("modal-body").innerHTML=`
    ${media ? (isVideo
      ? `<video src="${media}" autoplay muted loop></video>`
      : `<img src="${media}">`)
    : ""}

    <h1>${p.title}</h1>
    <p>${p.description || ""}</p>

    ${p.audio ? `<audio controls src="${p.audio}"></audio>` : ""}
  `;

  document.getElementById("modal").classList.remove("hidden");
}

function closeModal(){
  document.getElementById("modal").classList.add("hidden");
}

/* SWIPE */
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

/* PARALLAX */
function parallax(){
  window.addEventListener("mousemove",e=>{
    const x=(window.innerWidth-e.pageX)/50;
    const y=(window.innerHeight-e.pageY)/50;

    document.getElementById("bg")
      .style.transform=`translate(${x}px,${y}px) scale(1.08)`;
  });
}