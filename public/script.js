let posts = [];
let current = 0;

document.addEventListener("DOMContentLoaded", async () => {
  posts = await loadPosts();
  posts.sort((a,b)=> new Date(b.date) - new Date(a.date));

  renderFeed(posts);
  buildArchive();
  observeActive();
});

/* LOAD */
async function loadPosts(){
  const res = await fetch("/posts.json");
  return await res.json();
}

/* SLIDER */
function createSlider(media){
  const wrap = document.createElement("div");
  wrap.className = "slider";

  let i = 0;

  const slides = media.map(src=>{
    let el;

    if(src.endsWith(".mp4")){
      el = document.createElement("video");
      el.src = src;
      el.muted = true;
      el.autoplay = true;
      el.loop = true;
      el.playsInline = true;
      el.controls = true;

      el.addEventListener("canplay", ()=>{
        el.play().catch(()=>{});
      });

    } else {
      el = document.createElement("img");
      el.src = src;
    }

    el.className = "slide";
    return el;
  });

  function render(){
    slides.forEach(s=>s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  const prev = document.createElement("button");
  const next = document.createElement("button");

  prev.className = "prev";
  next.className = "next";

  prev.textContent = "‹";
  next.textContent = "›";

  prev.onclick = e=>{
    e.stopPropagation();
    i = (i-1+slides.length)%slides.length;
    render();
  };

  next.onclick = e=>{
    e.stopPropagation();
    i = (i+1)%slides.length;
    render();
  };

  slides.forEach(s=>wrap.appendChild(s));
  wrap.appendChild(prev);
  wrap.appendChild(next);

  render();
  return wrap;
}

/* FEED */
function renderFeed(data){
  const t = document.getElementById("timeline");

  data.forEach((p,index)=>{
    const post = document.createElement("div");
    post.className = "post";
    post.dataset.index = index;

    post.onclick = ()=> openModal(index);

    if(p.images){
      post.appendChild(createSlider(p.images));
    }

    const overlay = document.createElement("div");
    overlay.className = "overlay";

    overlay.innerHTML = `
      <h2>${p.title}</h2>
      <p>${p.description ? p.description.slice(0,120)+"..." : ""}</p>
    `;

    post.appendChild(overlay);
    t.appendChild(post);
  });
}

/* ARCHIVE */
function buildArchive(){
  const archive = document.getElementById("left-archive");
  const map = {};

  posts.forEach((p,i)=>{
    const d = new Date(p.date);
    const m = d.toLocaleString("tr-TR",{month:"long",year:"numeric"});
    const day = d.toLocaleDateString("tr-TR",{day:"2-digit",month:"2-digit"});

    if(!map[m]) map[m] = [];
    map[m].push({day,title:p.title,index:i});
  });

  Object.keys(map).forEach(m=>{
    const month = document.createElement("div");
    month.textContent = m;

    const days = document.createElement("div");

    map[m].forEach(d=>{
      const el = document.createElement("div");
      el.textContent = `${d.day} - ${d.title}`;
      el.onclick = ()=>{
        document.querySelectorAll(".post")[d.index]
          .scrollIntoView({behavior:"smooth"});
      };
      days.appendChild(el);
    });

    archive.appendChild(month);
    archive.appendChild(days);
  });
}

/* OBSERVER */
function observeActive(){
  const postsEl = document.querySelectorAll(".post");

  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      const videos = e.target.querySelectorAll("video");

      if(e.isIntersecting){
        e.target.classList.add("active");
        videos.forEach(v=>v.play().catch(()=>{}));
      } else {
        e.target.classList.remove("active");
        videos.forEach(v=>v.pause());
      }
    });
  },{threshold:0.6});

  postsEl.forEach(p=>obs.observe(p));
}

/* MODAL */
function openModal(index){
  current = index;
  const p = posts[index];

  const modal = document.getElementById("modal");
  const media = document.getElementById("modal-media");
  const side = document.getElementById("modal-side");

  media.innerHTML = "";

  if(p.images){
    media.appendChild(createSlider(p.images));
  }

  let audioHTML = "";

  if(p.audio){
    const name = p.audio.split("/").pop();
    audioHTML = `
      <div class="player">
        <div>🎵 ${name}</div>
        <audio src="${p.audio}" controls autoplay></audio>
      </div>
    `;
  }

  side.innerHTML = `
    <h2>${p.title}</h2>
    <small>${p.date}</small>
    <p>${p.description || ""}</p>
    ${audioHTML}
  `;

  modal.classList.remove("hidden");
}

/* NAV */
document.getElementById("closeModal").onclick =
  ()=> document.getElementById("modal").classList.add("hidden");