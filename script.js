// Language toggle
const langToggle = document.getElementById('langToggle');
let isZh = false;

langToggle.addEventListener('click', () => {
  isZh = !isZh;
  langToggle.textContent = isZh ? 'EN' : '中文';
  document.documentElement.lang = isZh ? 'zh' : 'en';

  document.querySelectorAll('[data-zh]').forEach((el) => {
    if (isZh) {
      el.dataset.en = el.innerHTML;
      el.innerHTML = el.dataset.zh;
    } else {
      if (el.dataset.en) el.innerHTML = el.dataset.en;
    }
  });
});

// Photo album gallery
(function () {
  const gallery = document.getElementById('photo-gallery');
  const galleryImg = document.getElementById('gallery-img');
  const galleryTitle = document.getElementById('gallery-album-title');
  const galleryCounter = document.getElementById('gallery-counter');
  const galleryStrip = document.getElementById('gallery-strip');
  let current = 0;
  let photos = [];

  function openAlbum(key) {
    const album = window.albums[key];
    if (!album) return;
    photos = album.photos;
    const isZh = document.documentElement.lang === 'zh';
    galleryTitle.textContent = isZh ? album.nameZh : album.name;

    // Build strip
    galleryStrip.innerHTML = '';
    photos.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.addEventListener('click', () => goTo(i));
      galleryStrip.appendChild(img);
    });

    goTo(0);
    gallery.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function goTo(index) {
    current = (index + photos.length) % photos.length;
    galleryImg.src = photos[current];
    galleryCounter.textContent = `${current + 1} / ${photos.length}`;
    galleryStrip.querySelectorAll('img').forEach((img, i) => {
      img.classList.toggle('active', i === current);
    });
    // Scroll strip to active thumb
    const activeThumb = galleryStrip.children[current];
    if (activeThumb) activeThumb.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
  }

  function closeGallery() {
    gallery.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.album-card').forEach(card => {
    card.addEventListener('click', () => openAlbum(card.dataset.album));
  });

  document.querySelector('.gallery-prev').addEventListener('click', () => goTo(current - 1));
  document.querySelector('.gallery-next').addEventListener('click', () => goTo(current + 1));
  document.querySelector('.gallery-close').addEventListener('click', closeGallery);
  document.querySelector('.photo-gallery-backdrop').addEventListener('click', closeGallery);

  document.addEventListener('keydown', (e) => {
    if (!gallery.classList.contains('open')) return;
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'Escape') closeGallery();
  });
})();

// Lightbox
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => {
    const id = card.dataset.project;
    const lb = document.getElementById(`lightbox-${id}`);
    if (lb) lb.classList.add('open');
  });
});

// Stride slide captions
const strideCaptions = [
  'Onboarding &amp; Authentication — a clean entry flow with splash screen, goal-setting intro, and login / sign-up screens using Google, Apple, and Facebook SSO.',
  'Routines — the core habit-tracking feature. Users create daily habits, log incremental progress, and see their current streaks at a glance.',
  'Calendar — week and month views that unify personal events and active routines in one unified schedule.',
  'Social &amp; Profile — a community feed where users share milestones and import each other\'s routines, adding real social accountability to habit-building.',
];

document.querySelectorAll('.lightbox').forEach((lb) => {
  lb.querySelector('.lightbox-close').addEventListener('click', () => lb.classList.remove('open'));
  lb.querySelector('.lightbox-backdrop').addEventListener('click', () => lb.classList.remove('open'));

  const thumbs = lb.querySelectorAll('.thumb');
  const caption = lb.querySelector('.lightbox-slide-caption');

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
      lb.querySelector('.lightbox-main-img img').src = thumb.src;
      if (caption && lb.id === 'lightbox-stride') {
        caption.innerHTML = strideCaptions[i] || '';
      }
    });
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.lightbox.open').forEach((lb) => lb.classList.remove('open'));
  }
});

// Smooth active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => observer.observe(s));

// Fade-in on scroll
const fadeEls = document.querySelectorAll('.card, .exp-item, .hero h1, .hero-sub');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

fadeEls.forEach((el) => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});
