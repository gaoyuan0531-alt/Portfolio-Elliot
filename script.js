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

// Lightbox
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => {
    const id = card.dataset.project;
    const lb = document.getElementById(`lightbox-${id}`);
    if (lb) lb.classList.add('open');
  });
});

document.querySelectorAll('.lightbox').forEach((lb) => {
  lb.querySelector('.lightbox-close').addEventListener('click', () => lb.classList.remove('open'));
  lb.querySelector('.lightbox-backdrop').addEventListener('click', () => lb.classList.remove('open'));

  lb.querySelectorAll('.thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      lb.querySelectorAll('.thumb').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
      lb.querySelector('.lightbox-main-img img').src = thumb.src;
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
