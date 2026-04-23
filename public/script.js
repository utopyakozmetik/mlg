
let posts = [];

document.addEventListener("DOMContentLoaded", async () => {

  renderRansom("FALAN FİLAN");

  posts = await loadPosts();

  posts.sort((a,b)=>
    new Date(b.date) - new Date(a.date)
  );

  renderFeed(posts);
});

/* LOAD SAFE */
async function loadPosts(){
  try {
    const res = await fetch("/posts.json");
    if(!res.ok) throw new Error("JSON yok");
    return await res.json();
  } catch(e){
    console.error(e);
    return [];
  }
}

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

/* SLIDER ENGINE */
function createSlider(media){

  const wrap = document.createElement("div");
  wrap.className = "slider";

  let i = 0;

  const slides = media.map(src=>{

    if(src.endsWith(".mp4")){
      const v = document.createElement("video");
      v.src = src;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.controls = true;
      v.className = "slide";
      return v;
    }

    const img = document.createElement("img");
    img.src = src;
    img.className = "slide";
    return img;
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

    box.innerHTML = `
      <h2>${p.title}</h2>
      <small>${p.date}</small>
      <p>${p.description || ""}</p>
    `;

    post.appendChild(box);

    if(p.audio){
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = p.audio;
      post.appendChild(audio);
    }

    t.appendChild(post);
  });
}