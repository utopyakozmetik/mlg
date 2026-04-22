// ======================
// COLLAGE TEXT
// ======================
function renderCollageText(text, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  for (let char of text) {
    if (char === ' ') {
      container.appendChild(document.createTextNode(' '));
      continue;
    }

    const upper = char.toUpperCase();

    const variants = [
      `/ransom/${upper}1.png`,
      `/ransom/${upper}2.png`
    ];

    const img = document.createElement('img');
    img.src = variants[Math.floor(Math.random() * variants.length)];
    img.className = 'collage-letter';

    container.appendChild(img);
  }
}

// ======================
// INIT
// ======================
document.addEventListener('DOMContentLoaded', () => {
  renderCollageText("LINKLER", "sidebar-title");

  const search = document.getElementById('searchInput');

  if (search) {
    search.addEventListener('input', e => {
      const val = e.target.value.toLowerCase();

      document.querySelectorAll('.post').forEach(p => {
        p.style.display = p.innerText.toLowerCase().includes(val)
          ? 'block'
          : 'none';
      });
    });
  }

  loadPosts();
});

// ======================
// SLIDER (FIXED)
// ======================
function initSlider(id, media) {
  const slider = document.getElementById(id);
  if (!slider || !media?.length) return;

  const container = slider.querySelector('.slides');
  container.innerHTML = '';

  media.forEach(src => {
    let el;

    if (src.endsWith('.mp4')) {
      el = document.createElement('video');
      el.src = src;
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
    } else {
      el = document.createElement('img');
      el.src = src;
    }

    el.style.display = 'none';
    container.appendChild(el);
  });

  const items = container.children;
  let i = 0;

  function show(n) {
    [...items].forEach(x => x.style.display = 'none');

    const active = items[n];
    active.style.display = 'block';

    if (active.tagName === 'VIDEO') {
      active.currentTime = 0;
      active.play().catch(()=>{});
    }
  }

  show(0);

  slider.querySelector('.next').onclick = () => {
    i = (i + 1) % items.length;
    show(i);
  };

  slider.querySelector('.prev').onclick = () => {
    i = (i - 1 + items.length) % items.length;
    show(i);
  };
}

// ======================
// LOAD POSTS
// ======================
function loadPosts() {
  fetch('/posts.json')
    .then(r => r.json())
    .then(posts => {
      const timeline = document.getElementById('timeline');
      timeline.innerHTML = '';

      posts.forEach((post, idx) => {
        const postEl = document.createElement('div');
        postEl.className = 'post';

        // TITLE
        const title = document.createElement('div');
        title.className = 'collage-title';
        title.id = `title-${idx}`;
        postEl.appendChild(title);

        renderCollageText(post.title, `title-${idx}`);

        // DESCRIPTION
        if (post.description) {
          const d = document.createElement('p');
          d.textContent = post.description;
          postEl.appendChild(d);
        }

        // SLIDER
        const slider = document.createElement('div');
        slider.className = 'slider';
        slider.id = `slider-${idx}`;

        slider.innerHTML = `
          <div class="slides"></div>
          <button class="prev">‹</button>
          <button class="next">›</button>
        `;

        postEl.appendChild(slider);

        // AUDIO
        if (post.audio) {
          const audio = document.createElement('audio');
          audio.controls = true;
          audio.src = post.audio;
          postEl.appendChild(audio);
        }

        timeline.appendChild(postEl);

        // IMPORTANT ORDER FIX
        initSlider(`slider-${idx}`, post.images);
      });
    })
    .catch(err => console.log(err));
}