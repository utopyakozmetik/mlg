let posts = [];

document.addEventListener("DOMContentLoaded", async () => {

  renderRansom("FALAN FİLAN");

  posts = await fetch("/posts.json").then(r=>r.json());

  posts.sort((a,b)=> new Date(b.date)-new Date(a.date));

  renderFeed(posts);
  observeActive();
});

/* RANSOM */
function renderRansom(text){
  const el = document.getElementById("sidebar-title");
  el.innerHTML = "";

  [...text].forEach(c=>{
    const s=document.createElement("span");
    s.textContent=c;
    s.className="ransom-char";
    el.appendChild(s);
  });
}

/* SLIDER */
function createSlider(media){
  const wrap=document.createElement("div");
  wrap.className="slider";

  let i=0;

  const slides=media.map(src=>{
    const el=document.createElement(src.includes(".mp4")?"video":"img");
    el.src=src;
    el.className="slide";
    return el;
  });

  const prev=document.createElement("button");
  prev.className="prev";
  prev.innerText="<";

  const next=document.createElement("button");
  next.className="next";
  next.innerText=">";

  const counter=document.createElement("div");
  counter.className="counter";

  function render(){
    slides.forEach(s=>s.classList.remove("active"));
    slides[i].classList.add("active");
    counter.innerText=`${i+1} / ${slides.length}`;
  }

  prev.onclick=()=>{
    i=(i-1+slides.length)%slides.length;
    render();
  };

  next.onclick=()=>{
    i=(i+1)%slides.length;
    render();
  };

  slides.forEach(s=>wrap.appendChild(s));
  wrap.appendChild(prev);
  wrap.appendChild(next);
  wrap.appendChild(counter);

  render();

  return wrap;
}

/* FEED */
function renderFeed(data){
  const t=document.getElementById("timeline");
  t.innerHTML="";

  data.forEach((p,i)=>{
    const d=document.createElement("div");
    d.className="post";

    const slider=createSlider(p.images);
    d.appendChild(slider);

    d.innerHTML += `
      <h2>${p.title}</h2>
      <small>${p.date}</small>
      <p>${p.description || ""}</p>
    `;

    if(p.audio){
      const a=document.createElement("audio");
      a.controls=true;
      a.src=p.audio;
      d.appendChild(a);
    }

    t.appendChild(d);
  });
}

/* ACTIVE */
function observeActive(){
  const posts=document.querySelectorAll(".post");

  const obs=new IntersectionObserver(e=>{
    e.forEach(x=>{
      x.target.classList.toggle("active", x.isIntersecting);
    });
  },{threshold:0.6});

  posts.forEach(p=>obs.observe(p));
}