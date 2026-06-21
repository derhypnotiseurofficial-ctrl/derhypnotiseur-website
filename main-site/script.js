/* ═══════════════════════════════════════════════════════
   DER HYPNOTISEUR – main-site/script.js
   ═══════════════════════════════════════════════════════ */

/* ── Cookie Consent + Google Analytics ── */
(function () {
  const GA_ID = 'G-XP99ET6V8B';
  const COOKIE_KEY = 'cookie_consent';

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

(function () {
  'use strict';

  /* ── Page Loader ── */
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loader-progress');
  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 18;
    if (p >= 100) { p = 100; clearInterval(tick); }
    if (progress) progress.style.width = p + '%';
  }, 80);

  window.addEventListener('load', () => {
    clearInterval(tick);
    if (progress) progress.style.width = '100%';
    setTimeout(() => { if (loader) loader.classList.add('done'); }, 300);
  });

  /* ── Custom Cursor ── */
  const cur = document.getElementById('cursor');
  const curF = document.getElementById('cursor-follower');
  let mx = -100, my = -100, fx = -100, fy = -100;

  if (cur && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
    });

    (function followCursor() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      if (curF) { curF.style.left = fx + 'px'; curF.style.top = fy + 'px'; }
      requestAnimationFrame(followCursor);
    })();

    document.querySelectorAll('a, button, .btn, .show-card, .tilt-card, .acc-trigger').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('back-to-top');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 60);
    if (backTop) backTop.classList.toggle('visible', y > 500);
    lastScroll = y;
  }, { passive: true });

  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Mobile Menu ── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function openMenu() {
    if (!mobileMenu || !burger) return;
    mobileMenu.classList.add('open');
    mobileMenu.removeAttribute('aria-hidden');
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!mobileMenu || !burger) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ── Smooth Scroll for nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── IntersectionObserver for reveal animations ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-up, .reveal-img').forEach(el => revealObserver.observe(el));

  /* ── Counter Animations ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (!target) return;
    const duration = 1600;
    const start = performance.now();
    (function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('de-DE');
      if (progress < 1) requestAnimationFrame(update);
    })(start);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ── 3D Tilt Cards ── */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  });

  /* ── Magnetic Buttons ── */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── YouTube Facade ── */
  document.querySelectorAll('.yt-facade').forEach(facade => {
    facade.addEventListener('click', function () {
      const id = this.dataset.videoid;
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
      iframe.title = 'DER HYPNOTISEUR – Timo Dante Showreel';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      this.innerHTML = '';
      this.appendChild(iframe);
      this.classList.remove('yt-facade');
    });
  });

  /* ── Testimonials Carousel ── */
  const track = document.querySelector('.testi-track');
  const dotsContainer = document.querySelector('.testi-dots');
  const slides = document.querySelectorAll('.testi-slide');
  let current = 0;
  let autoplayTimer;

  if (track && slides.length > 0 && dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(idx) {
      current = idx;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      dotsContainer.querySelectorAll('.testi-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
    }

    function startAutoplay() {
      autoplayTimer = setInterval(() => goTo((current + 1) % slides.length), 5000);
    }

    startAutoplay();
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    track.parentElement.addEventListener('mouseleave', startAutoplay);

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? (current + 1) % slides.length : (current - 1 + slides.length) % slides.length);
    });
  }

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.acc-trigger').forEach(trigger => {
    trigger.addEventListener('click', function () {
      const item = this.closest('.acc-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Contact Form ── */
  const form = document.querySelector('.c-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const successEl = document.getElementById('form-success');
      const errorEl = document.getElementById('form-error');
      if (successEl) successEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';

      const honeypot = form.querySelector('[name="website"]');
      if (honeypot && honeypot.value) return;

      const origText = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Wird gesendet…'; btn.disabled = true; }

      try {
        const resp = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
        });
        if (resp.ok) {
          if (successEl) { successEl.style.display = 'block'; successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
          form.reset();
        } else {
          throw new Error('server');
        }
      } catch {
        if (errorEl) { errorEl.style.display = 'block'; }
      } finally {
        if (btn) { btn.textContent = origText; btn.disabled = false; }
      }
    });
  }

  /* ── Parallax Hero on scroll ── */
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.5) {
        heroBg.style.transform = 'translateY(' + (y * 0.35) + 'px)';
      }
    }, { passive: true });
  }

})();
