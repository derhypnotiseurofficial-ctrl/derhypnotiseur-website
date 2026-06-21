// ============================================================
// Cookie Consent + Google Analytics
// ============================================================
(function () {
  var GA_ID = 'G-XP99ET6V8B';
  var COOKIE_KEY = 'cookie_consent';

  function loadGA() {
    if (window._gaLoaded) return;
    window._gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  var consent = localStorage.getItem(COOKIE_KEY);
  if (consent === 'accepted') { loadGA(); }

  var banner = document.getElementById('cookie-banner');
  if (banner && consent === null) {
    banner.hidden = false;
    document.getElementById('cookie-accept').addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      banner.hidden = true;
      loadGA();
    });
    document.getElementById('cookie-decline').addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'declined');
      banner.hidden = true;
    });
  }
})();

// ============================================================
// Carousel
// ============================================================
(function () {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (!track || slides.length === 0) return;

  let current = 0;
  const total = slides.length;

  function getSlidesVisible() {
    return window.innerWidth <= 900 ? 1 : 3;
  }

  function updateCarousel() {
    const visible = getSlidesVisible();
    const slideWidth = 100 / visible;
    slides.forEach(s => { s.style.minWidth = slideWidth + '%'; });

    const maxIndex = total - visible;
    const safeIndex = Math.min(current, maxIndex);
    track.style.transform = `translateX(-${safeIndex * slideWidth}%)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    const visible = getSlidesVisible();
    const maxIndex = total - visible;
    current = Math.max(0, Math.min(index, maxIndex));
    updateCarousel();
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { current = i; updateCarousel(); });
  });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();

  // Auto-advance every 4 seconds
  setInterval(() => {
    const visible = getSlidesVisible();
    current = current >= total - visible ? 0 : current + 1;
    updateCarousel();
  }, 4000);
})();

// ============================================================
// Accordion FAQ
// ============================================================
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', function () {
    const content = this.nextElementSibling;
    const isOpen = this.getAttribute('aria-expanded') === 'true';

    // Close all
    document.querySelectorAll('.accordion-trigger').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      t.nextElementSibling.classList.remove('open');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      this.setAttribute('aria-expanded', 'true');
      content.classList.add('open');
    }
  });
});

// ============================================================
// Back to top button
// ============================================================
const backBtn = document.getElementById('back-to-top');
if (backBtn) {
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 400);
  });
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// Formular-Rückmeldung aus URL-Params
// ============================================================
(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === '1') {
    const el = document.getElementById('form-success');
    if (el) {
      el.style.display = 'block';
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  if (params.get('error') === '1') {
    const el = document.getElementById('form-error');
    if (el) el.style.display = 'block';
  }
})();

// ============================================================
// YouTube Facade – iframe erst bei Klick laden
// ============================================================
document.querySelectorAll('.yt-facade').forEach(function(facade) {
  facade.addEventListener('click', function() {
    var id = this.dataset.videoid;
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
    iframe.title = 'DER HYPNOTISEUR – Timo Dante Comedy Hypnoseshow';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    this.innerHTML = '';
    this.appendChild(iframe);
    this.classList.remove('yt-facade');
  });
});

// ============================================================
// Smooth scroll for all anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
