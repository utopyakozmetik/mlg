let posts = [];
let current = 0;

document.addEventListener("DOMContentLoaded", async () => {

  renderRansom("FALAN FİLAN");

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

/* RANSOM */
function renderRansom(text){
  const el = document.getElementById("sidebar-title");
  let arr = text.split("");
  let i = 0;

  setInterval(()=>{
    i = (i+1)%arr.length;
    el.textContent = arr.slice(i).join("") + " " + arr.slice(0,i).join("");
  },150);
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
      el.controls = true;
      el.muted = true;
      el.autoplay = true;
      el.loop = true;
      el.playsInline = true;
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

    /* OVERLAY EKLENDİ */
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

/* ARCHIVE (DEĞİŞMEDİ) */
function buildArchive(){
  const archive = document.getElementById("archive");
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
    month.className = "archive-month";
    month.textContent = m;

    const days = document.createElement("div");
    days.className = "archive-days";

    month.onclick = ()=> days.style.display =
      days.style.display==="block"?"none":"block";

    map[m].forEach(d=>{
      const el = document.createElement("div");
      el.className = "archive-day";
      el.textContent = `${d.day} - ${d.title}`;

      el.onclick = e=>{
        e.stopPropagation();
        document.querySelectorAll(".post")[d.index]
          .scrollIntoView({behavior:"smooth"});
      };

      days.appendChild(el);
    });

    archive.appendChild(month);
    archive.appendChild(days);
  });
}

/* SCROLL VIDEO CONTROL (SIGNATURE) */
function observeActive(){
  const postsEl = document.querySelectorAll(".post");

  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      const videos = e.target.querySelectorAll("video");

      if(e.isIntersecting){
        videos.forEach(v=> v.play().catch(()=>{}));
      } else {
        videos.forEach(v=> v.pause());
      }

      if(e.isIntersecting){
        const i = e.target.dataset.index;

        document.querySelectorAll(".archive-day")
          .forEach(d=>d.classList.remove("active"));

        const day = document.querySelectorAll(".archive-day")[i];
        if(day) day.classList.add("active");
      }
    });
  },{threshold:0.6});

  postsEl.forEach(p=>obs.observe(p));
}

/* MODAL (GELİŞTİRİLDİ) */
function openModal(index){
  current = index;
  const p = posts[index];

  const modal = document.getElementById("modal");
  const media = document.getElementById("modal-media");
  const text = document.getElementById("modal-text");

  media.innerHTML = "";

  if(p.images){
    media.appendChild(createSlider(p.images));
  }

  if(p.audio){
    const audio = document.createElement("audio");
    audio.src = p.audio;
    audio.autoplay = true;
    audio.controls = true;
    media.appendChild(audio);
  }

  text.innerHTML = `
    <div class="modal-text-inner">
      <h2>${p.title}</h2>
      <small>${p.date}</small>
      <p>${p.description || ""}</p>
    </div>
  `;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

/* NAV */
document.getElementById("nextPost").onclick = ()=>{
  current = (current+1)%posts.length;
  openModal(current);
};

document.getElementById("prevPost").onclick = ()=>{
  current = (current-1+posts.length)%posts.length;
  openModal(current);
};

document.getElementById("closeModal").onclick = ()=>{
  document.getElementById("modal").classList.add("hidden");
  document.body.style.overflow = "auto";
};