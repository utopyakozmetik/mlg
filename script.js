function renderCollageText(text, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (let char of text) {
    if (char === ' ') {
      container.appendChild(document.createTextNode(' '));
      continue;
    }
    const upper = char.toUpperCase();
    const variants = [
      `assets/ransom/${upper}1.png`,
      `assets/ransom/${upper}2.png`
    ];
    const img = document.createElement('img');
    img.src = variants[Math.floor(Math.random() * variants.length)];
    img.className = 'collage-letter';
    container.appendChild(img);
  }
}

// Slider + video + otomatik geçiş (post bazlı)
function initSlider(sliderId, media) {
  const slider = document.getElementById(sliderId);
  const slidesContainer = slider.querySelector('.slides');
  slidesContainer.innerHTML = '';

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

  slider.querySelector('.next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slideItems.length;
    showSlide(currentIndex);
  });
  slider.querySelector('.prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slideItems.length) % slideItems.length;
    showSlide(currentIndex);
  });

  // Slayt süresi dropdown (post bazlı)
  const intervalSelect = slider.querySelector('.intervalSelect');
  let intervalId = null;
  intervalSelect.addEventListener('change', e => {
    if (intervalId) clearInterval(intervalId);
    const val = parseInt(e.target.value);
    if (val > 0) {
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % slideItems.length;
        showSlide(currentIndex);
      }, val * 1000);
    }
  });

  // Video modal
  slidesContainer.addEventListener('click', e => {
    if (e.target.tagName === 'VIDEO') openVideoModal(e.target.src);
  });
}

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
  modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
}

// Filtre
document.getElementById('filterSelect').addEventListener('change', e => {
  const filter = e.target.value;
  document.querySelectorAll('.slides img, .slides video').forEach(el => {
    el.className = filter ? 'active ' + filter : 'active';
  });
});

// Arama
document.getElementById('searchInput').addEventListener('input', e => {
  const keyword = e.target.value.toLowerCase();
  document.querySelectorAll('.post').forEach(post => {
    const text = post.innerText.toLowerCase();
    post.style.display = text.includes(keyword) ? 'block' : 'none';
  });
});

// Postları yükle
fetch('data/posts.json')
  .then(res => res.json())
  .then(posts => {
    const timeline = document.getElementById('timeline');
    posts.forEach((post, idx) => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'collage-title';
      titleDiv.id = `title-${idx}`;
      postDiv.appendChild(titleDiv);
      renderCollageText(post.title, `title-${idx}`);

      const slider = document.createElement('div');
      slider.className = 'slider';
      slider.id = `slider-${idx}`;
      slider.innerHTML = `
        <div class="slides"></div>
        <button class="prev">‹</button>
        <button class="next">›</button>
        <select class="intervalSelect">
          <option value="0">Manuel</option>
          <option value="3">3 sn</option>
          <option value="5">5 sn</option>
          <option value="10">10 sn</option>
        </select>
      `;
      postDiv.appendChild(slider);
      initSlider(`slider-${idx}`, post.images);

      const desc = document.createElement('p');
      desc.textContent = post.description;
      postDiv.appendChild(desc);

      if (post.audio) {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = post.audio;
        postDiv.appendChild(audio);
      }

      timeline.appendChild(postDiv);
    });
  });
