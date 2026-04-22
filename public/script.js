// === COLLAGE TEXT ===
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
      `ransom/${upper}1.png`,
      `ransom/${upper}2.png`
    ];

    const img = document.createElement('img');
    img.src = variants[Math.floor(Math.random() * variants.length)];
    img.className = 'collage-letter';

    container.appendChild(img);
  }
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  renderCollageText("Linkler", "sidebar-title");

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const keyword = e.target.value.toLowerCase();
      document.querySelectorAll('.post').forEach(post => {
        const text = post.innerText.toLowerCase();
        post.style.display = text.includes(keyword) ? 'block' : 'none';
      });
    });
  }

  loadPosts(); // 🔥 BURAYA ALDIK (daha güvenli)
});

// === SLIDER ===
function initSlider(sliderId, media) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const slidesContainer = slider.querySelector('.slides');
  slidesContainer.innerHTML = '';

  if (!media || media.length === 0) return;

  media.forEach((src, i) => {
    let el;

    if (src.endsWith('.mp4')) {
      el = document.createElement('video');
      el.src = src;
      el.muted = true;
    } else {
      el = document.createElement('img');
      el.src = src;
    }

    if (i === 0) el.classList.add('active');
    slidesContainer.appendChild(el);
  });

  let currentIndex = 0;
  const slideItems = slidesContainer.children;

  function showSlide(index) {
    [...slideItems].forEach(el => el.classList.remove('active'));
    slideItems[index].classList.add('active');
  }

  slider.querySelector('.next').onclick = () => {
    currentIndex = (currentIndex + 1) % slideItems.length;
    showSlide(currentIndex);
  };

  slider.querySelector('.prev').onclick = () => {
    currentIndex = (currentIndex - 1 + slideItems.length) % slideItems.length;
    showSlide(currentIndex);
  };
}

// === VIDEO MODAL ===
function openVideoModal(src) {
  const modal = document.createElement('div');
  modal.className = 'video-modal';

  modal.innerHTML = `
    <div class="video-wrapper">
      <video src="${src}" controls autoplay></video>
      <button class="close-modal">×</button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('.close-modal').onclick = () => modal.remove();
}

// === POSTS LOAD (FIXED) ===
function loadPosts() {
  fetch('/posts.json') //
    .then(res => {
      if (!res.ok) throw new Error("JSON yüklenemedi");
      return res.json();
    })
    .then(posts => {
      const timeline = document.getElementById('timeline');
      if (!timeline) return;

      timeline.innerHTML = '';

if (post.audio) {
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.src = post.audio;
  postDiv.appendChild(audio);
}
      
posts.forEach((post, idx) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'collage-title';
        titleDiv.id = `title-${idx}`;
        postDiv.appendChild(titleDiv);

        renderCollageText(post.title || "Başlık", `title-${idx}`);

        const slider = document.createElement('div');
        slider.className = 'slider';
        slider.id = `slider-${idx}`;

        slider.innerHTML = `
          <div class="slides"></div>
          <button class="prev">‹</button>
          <button class="next">›</button>
        `;

        postDiv.appendChild(slider);
        initSlider(`slider-${idx}`, post.images || []);

        timeline.appendChild(postDiv);
      });
    })
    .catch((err) => {
      console.error(err);

      const timeline = document.getElementById('timeline');
      if (!timeline) return;

      timeline.innerHTML = `
        <div class="post">
          <h2>TEST POST</h2>
          <p>JSON yüklenemedi → dosya yolu hatalı.</p>
        </div>
      `;
    });
}
