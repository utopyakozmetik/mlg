let posts = [];

document.addEventListener("DOMContentLoaded", async () => {

  renderRansom("FALAN FİLAN");

  posts = await fetch("/posts.json").then(r => r.json());

  /* 🔥 DATE FIX */
  posts.sort((a, b) => {
    return new Date(b.date + "T00:00:00") - new Date(a.date + "T00:00:00");
  });

  renderFeed(posts);
  observeActive();
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

  const prev = document.createElement("button");
  prev.className = "prev";
  prev.innerText = "<";

  const next = document.createElement("button");
  next.className = "next";
  next.innerText = ">";

  const counter = document.createElement("div");
  counter.className = "counter";

  function render(){
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
    counter.innerText = `${i+1} / ${slides.length}`;
  }

  prev.onclick = () => {
    i = (i - 1 + slides.length) % slides.length;
    render();
  };

  next.onclick = () => {
    i = (i + 1) % slides.length;
    render();
  };

  slides.forEach(s => wrap.appendChild(s));
  wrap.appendChild(prev);
  wrap.appendChild(next);
  wrap.appendChild(counter);

  /* 🔥 CLICK BUG FIX */
  wrap.addEventListener("click", e => e.stopPropagation());

  render();

  return wrap;
}

/* FEED */
function renderFeed(data){
  const t = document.getElementById("timeline");
  t.innerHTML = "";

  data.forEach((p,i)=>{
    const d = document.createElement("div");
    d.className = "post";

    /* SLIDER */
    const slider = createSlider(p.images);
    d.appendChild(slider);

    /* TEXT (NO innerHTML bug) */
    const title = document.createElement("h2");
    title.textContent = p.title;

    const date = document.createElement("small");
    date.textContent = p.date;

    const desc = document.createElement("p");
    desc.textContent = p.description || "";

    d.appendChild(title);
    d.appendChild(date);
    d.appendChild(desc);

    /* AUDIO */
    if(p.audio){
      const a = document.createElement("audio");
      a.controls = true;
      a.src = p.audio;
      d.appendChild(a);
    }

    t.appendChild(d);
  });
}

/* ACTIVE GLOW */
function observeActive(){
  const posts = document.querySelectorAll(".post");

  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      e.target.classList.toggle("active", e.isIntersecting);
    });
  }, { threshold: 0.6 });

  posts.forEach(p => obs.observe(p));
}