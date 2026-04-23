let posts = [];

document.addEventListener("DOMContentLoaded", async () => {

  renderRansom("FALAN FİLAN");

  posts = await fetch("/posts.json").then(r => r.json());

  posts.sort((a,b)=>
    new Date(b.date+"T00:00:00") - new Date(a.date+"T00:00:00")
  );

  renderFeed(posts);
  observeActive();

  document.querySelector(".close-btn")?.addEventListener("click", closeModal);
});

/* RANSOM */
function renderRansom(text){
  const el = document.getElementById("sidebar-title");
  el.innerHTML = "";

  [...text].forEach(c=>{
    const s = document.createElement("span");
    s.textContent = c;
    el.appendChild(s);
  });
}

/* SLIDER */
function createSlider(media){

  const wrap = document.createElement("div");
  wrap.className = "slider";

  let i = 0;

  const slides = media.map(src=>{
    const el = document.createElement(src.includes(".mp4") ? "video" : "img");
    el.src = src;
    el.className = "slide";
    return el;
  });

  function render(){
    slides.forEach(s=>s.classList.remove("active"));
    if(slides[i]) slides[i].classList.add("active");
  }

  const prev = document.createElement("button");
  prev.textContent = "<";

  const next = document.createElement("button");
  next.textContent = ">";

  prev.onclick = (e)=>{
    e.stopPropagation();
    i = (i - 1 + slides.length) % slides.length;
    render();
  };

  next.onclick = (e)=>{
    e.stopPropagation();
    i = (i + 1) % slides.length;
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
  t.innerHTML = "";

  data.forEach(p=>{

    const post = document.createElement("div");
    post.className = "post";

    if(p.images?.length){
      post.appendChild(createSlider(p.images));
    }

    const box = document.createElement("div");
    box.className = "text-box";

    const title = document.createElement("h2");
    title.textContent = p.title;

    const date = document.createElement("small");
    date.textContent = p.date;

    const desc = document.createElement("p");
    desc.textContent = p.description || "";

    box.appendChild(title);
    box.appendChild(date);
    box.appendChild(desc);

    post.appendChild(box);

    if(p.audio){
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = p.audio;
      post.appendChild(audio);
    }

    /* FULLSCREEN */
    post.onclick = () => openModal(p);

    t.appendChild(post);
  });
}

/* ACTIVE */
function observeActive(){
  const posts = document.querySelectorAll(".post");

  const obs = new IntersectionObserver(e=>{
    e.forEach(x=>{
      x.target.classList.toggle("active", x.isIntersecting);
    });
  },{threshold:0.6});

  posts.forEach(p=>obs.observe(p));
}

/* MODAL OPEN */
function openModal(p){

  const m = document.getElementById("modal");
  m.classList.remove("hidden");

  m.innerHTML = `
    <div class="modal-content">

      <button class="close-btn">×</button>

      <div id="modal-slider"></div>

      <div class="modal-text">
        <h1>${p.title}</h1>
        <small>${p.date}</small>
        <p>${p.description || ""}</p>
      </div>

      <div class="audio-ui">
        <audio controls src="${p.audio || ""}"></audio>
      </div>

    </div>
  `;

  let i = 0;

  const container = document.getElementById("modal-slider");

  const slides = (p.images || []).map(src=>{
    const el = document.createElement(src.includes(".mp4") ? "video" : "img");
    el.src = src;
    return el;
  });

  function render(){
    container.innerHTML = "";
    if(slides[i]) container.appendChild(slides[i]);
  }

  container.onclick = ()=>{
    i = (i + 1) % slides.length;
    render();
  };

  render();

  document.querySelector(".close-btn").onclick = closeModal;
}

/* CLOSE */
function closeModal(){
  document.getElementById("modal").classList.add("hidden");
}