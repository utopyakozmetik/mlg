
let posts = [];

document.addEventListener("DOMContentLoaded", async () => {

  renderRansom("FALAN FİLAN");

  posts = await fetch("/posts.json").then(r=>r.json());

  posts.sort((a,b)=> new Date(b.date+"T00:00:00") - new Date(a.date+"T00:00:00"));

  renderFeed(posts);
  observeActive();
});

/* RANSOM TEXT */
function renderRansom(text){
  const el = document.getElementById("sidebar-title");
  el.innerHTML = "";

  for(let char of text){
    if(char===" "){
      el.appendChild(document.createTextNode(" "));
      continue;
    }

    const up = char.toUpperCase();

    const img = document.createElement("img");
    img.src = `/ransom/${up}${Math.random()>0.5?1:2}.png`;

    const span = document.createElement("span");
    span.className="ransom-char";
    span.appendChild(img);

    el.appendChild(span);
  }
}

/* SLIDER */
function createSlider(media){
  const wrap=document.createElement("div");
  wrap.className="slider";

  let i=0;

  const slides = media.map(src=>{
    const el = document.createElement(src.includes(".mp4")?"video":"img");
    el.src = src;
    el.className="slide";
    return el;
  });

  const prev=document.createElement("button");
  prev.innerText="<";

  const next=document.createElement("button");
  next.innerText=">";

  function render(){
    slides.forEach(s=>s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  prev.onclick=(e)=>{
    e.stopPropagation();
    i=(i-1+slides.length)%slides.length;
    render();
  };

  next.onclick=(e)=>{
    e.stopPropagation();
    i=(i+1)%slides.length;
    render();
  };

  slides.forEach(s=>wrap.appendChild(s));
  wrap.appendChild(prev);
  wrap.appendChild(next);

  wrap.onclick=()=>openModal(media);

  render();
  return wrap;
}

/* FEED */
function renderFeed(data){
  const t=document.getElementById("timeline");
  t.innerHTML="";

  data.forEach(p=>{
    const d=document.createElement("div");
    d.className="post";

    const slider=createSlider(p.images);
    d.appendChild(slider);

    const box=document.createElement("div");
    box.className="text-box";

    const title=document.createElement("div");
    renderRansomText(p.title, title);

    const date=document.createElement("small");
    date.textContent=p.date;

    const desc=document.createElement("p");
    desc.textContent=p.description;

    box.appendChild(title);
    box.appendChild(date);
    box.appendChild(desc);

    d.appendChild(box);

    if(p.audio){
      const a=document.createElement("audio");
      a.controls=true;
      a.src=p.audio;
      d.appendChild(a);
    }

    t.appendChild(d);
  });
}

/* RANSOM TITLE */
function renderRansomText(text, container){
  for(let char of text){
    if(char===" "){
      container.appendChild(document.createTextNode(" "));
      continue;
    }

    const img=document.createElement("img");
    img.src=`/ransom/${char.toUpperCase()}1.png`;
    img.style.height="30px";

    container.appendChild(img);
  }
}

/* ACTIVE */
function observeActive(){
  const posts=document.querySelectorAll(".post");

  const obs=new IntersectionObserver(e=>{
    e.forEach(x=>{
      x.target.classList.toggle("active",x.isIntersecting);
    });
  },{threshold:0.6});

  posts.forEach(p=>obs.observe(p));
}

/* FULLSCREEN */
function openModal(media){
  const m=document.createElement("div");
  m.className="modal";

  let i=0;

  const img=document.createElement("img");
  img.src=media[0];

  m.appendChild(img);

  m.onclick=()=>{
    i=(i+1)%media.length;
    img.src=media[i];
  };

  document.body.appendChild(m);

  m.onclick=(e)=>{
    e.stopPropagation();
    i=(i+1)%media.length;
    img.src=media[i];
  };

  m.ondblclick=()=>m.remove();
}