
let posts = [];
let current = 0;

document.addEventListener("DOMContentLoaded", async () => {

  renderRansom("FALAN FİLAN");

  posts = await loadPosts();

  posts = posts.sort((a,b)=>
    new Date(b.date) - new Date(a.date)
  );

  renderFeed(posts);

  observeActive();
});

/* LOAD */
async function loadPosts(){
  try {
    const res = await fetch("/posts.json");
    return await res.json();
  } catch (e) {
    console.error("JSON LOAD ERROR", e);
    return [];
  }
}

/* RANSOM */
function renderRansom(text){
  const el = document.getElementById("sidebar-title");

  let arr = text.split("");
  let i = 0;

  setInterval(() => {
    i = (i + 1) % arr.length;

    el.textContent =
      arr.slice(i).join("") +
      " " +
      arr.slice(0, i).join("");

  }, 150);
}

/* =========================
   SLIDER ENGINE (FIXED)
========================= */
function createSlider(media){

  const wrap = document.createElement("div");
  wrap.className = "slider";

  let i = 0;

  const slides = media.map(src => {

    let el;

    if(!src) return null;

    if(src.endsWith(".mp4")){
      el = document.createElement("video");
      el.src = src;
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.controls = true;
    } else {
      el = document.createElement("img");
      el.src = src;
    }

    el.className = "slide";
    return el;
  }).filter(Boolean);

  function render(){
    slides.forEach(s => s.classList.remove("active"));

    if(!slides[i]) return;

    slides[i].classList.add("active");

    if(slides[i].tagName === "VIDEO"){
      slides[i].play().catch(()=>{});
    }
  }

  const prev = document.createElement("button");
  const next = document.createElement("button");

  prev.textContent = "<";
  next.textContent = ">";

  prev.onclick = (e) => {
    e.stopPropagation();
    i = (i - 1 + slides.length) % slides.length;
    render();
  };

  next.onclick = (e) => {
    e.stopPropagation();
    i = (i + 1) % slides.length;
    render();
  };

  slides.forEach(s => wrap.appendChild(s));
  wrap.appendChild(prev);
  wrap.appendChild(next);

  render();
  return wrap;
}

/* =========================
   FEED
========================= */
function renderFeed(data){

  const t = document.getElementById("timeline");
  t.innerHTML = "";

  data.forEach((p,index) => {

    const post = document.createElement("div");
    post.className = "post";

    post.onclick = () => openModal(index);

    if(p.images?.length){
      post.appendChild(createSlider(p.images));
    }

    const box = document.createElement("div");
    box.className = "text-box";

    box.innerHTML = `
      <h2>${p.title}</h2>
      <small>${p.date}</small>
      <p>${p.description || ""}</p>
    `;

    post.appendChild(box);

    /* AUDIO FIX */
    if(p.audio){
      const audio = document.createElement("audio");
      audio.src = p.audio;
      audio.controls = true;
      audio.preload = "auto";
      post.appendChild(audio);
    }

    t.appendChild(post);
  });
}

/* =========================
   ACTIVE POST HIGHLIGHT
========================= */
function observeActive(){

  const postsEl = document.querySelectorAll(".post");

  const obs = new IntersectionObserver(entries => {

    entries.forEach(entry => {
      entry.target.classList.toggle(
        "active",
        entry.isIntersecting
      );
    });

  }, { threshold: 0.6 });

  postsEl.forEach(p => obs.observe(p));
}

/* =========================
   MODAL (FULL SLIDER FIXED)
========================= */
function openModal(index){

  current = index;
  const p = posts[index];

  const modal = document.getElementById("modal");
  const media = document.getElementById("modal-media");
  const text = document.getElementById("modal-text");

  media.innerHTML = "";

  if(!p.images?.length) return;

  let i = 0;

  const slides = p.images.map(src => {

    let el;

    if(src.endsWith(".mp4")){
      el = document.createElement("video");
      el.src = src;
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.controls = true;
    } else {
      el = document.createElement("img");
      el.src = src;
    }

    el.style.maxWidth = "100%";
    el.style.maxHeight = "60vh";
    el.style.display = "none";

    return el;
  });

  function render(){
    slides.forEach(s => s.style.display = "none");

    if(!slides[i]) return;

    slides[i].style.display = "block";

    if(slides[i].tagName === "VIDEO"){
      slides[i].play().catch(()=>{});
    }
  }

  const prev = document.createElement("button");
  const next = document.createElement("button");

  prev.textContent = "<";
  next.textContent = ">";

  prev.onclick = () => {
    i = (i - 1 + slides.length) % slides.length;
    render();
  };

  next.onclick = () => {
    i = (i + 1) % slides.length;
    render();
  };

  media.appendChild(prev);
  media.appendChild(next);

  slides.forEach(s => media.appendChild(s));

  render();

  text.innerHTML = `
    <h2>${p.title}</h2>
    <small>${p.date}</small>
    <p>${p.description || ""}</p>
  `;

  modal.classList.remove("hidden");
}

/* CLOSE */
document.getElementById("closeModal").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

/* NAV */
document.getElementById("nextPost").onclick = () => {
  current = (current + 1) % posts.length;
  openModal(current);
};

document.getElementById("prevPost").onclick = () => {
  current = (current - 1 + posts.length) % posts.length;
  openModal(current);
};