// Ransom başlık render
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

// Slider mantığı
function initSlider(sliderId, images) {
  const slider = document.getElementById(sliderId);
  const slidesContainer = slider.querySelector('.slides');
  slidesContainer.innerHTML = '';
  images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    if (i === 0) img.classList.add('active');
    slidesContainer.appendChild(img);
  });
  let currentIndex = 0;
  const slideImages = slidesContainer.querySelectorAll('img');
  slider.querySelector('.next').addEventListener('click', () => {
    slideImages[currentIndex].classList.remove('active');
    currentIndex = (currentIndex+1) % slideImages.length;
    slideImages[currentIndex].classList.add('active');
  });
  slider.querySelector('.prev').addEventListener('click', () => {
    slideImages[currentIndex].classList.remove('active');
    currentIndex = (currentIndex-1+slideImages.length) % slideImages.length;
    slideImages[currentIndex].classList.add('active');
  });
}

// Filtre seçimi
document.getElementById('filterSelect').addEventListener('change', e => {
  document.querySelectorAll('.slides img').forEach(el => {
    el.className = e.target.value ? 'active '+e.target.value : 'active';
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

// Background collage
function createCollage(images) {
  const collage = document.getElementById('bg-collage');
  collage.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const img = document.createElement('img');
    img.src = images[Math.floor(Math.random() * images.length)];
    collage.appendChild(img);
  }
}
const today = new Date().toISOString().split('T')[0];
const storedDay = localStorage.getItem('collageDay');
const bgImages = [
  'assets/background/bg1.jpg',
  'assets/background/bg2.jpg',
  'assets/background/bg3.jpg'
];
if (storedDay !== today) {
  createCollage(bgImages);
  localStorage.setItem('collageDay', today);
}