/* ═══════════════════════════════════════════════════════════
   SUBHASH YADAV — CAMPAIGN 2026
   script.js — All interactivity
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. CUSTOM CURSOR ───────────────────────────────────────── */
(function initCursor() {
  const dot = document.getElementById('cursorDot');
  if (!dot) return;
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  document.querySelectorAll('a, button, .slide-card, .video-thumb-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width  = '20px';
      dot.style.height = '20px';
      dot.style.opacity = '0.7';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width  = '10px';
      dot.style.height = '10px';
      dot.style.opacity = '1';
    });
  });

  // Hide on mobile
  if ('ontouchstart' in window) dot.style.display = 'none';
})();


/* ── 2. NAV: scroll state & hamburger ──────────────────────── */
(function initNav() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Active section highlight
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = navLinks.querySelectorAll('a[href^="#"]');

  const activateLink = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', activateLink, { passive: true });
})();


/* ── 3. SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Stagger children in grids
  document.querySelectorAll('.vision-grid, .promises-grid').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((card, i) => {
      card.style.transitionDelay = (i * 0.09) + 's';
    });
  });

  els.forEach(el => io.observe(el));
})();


/* ── 4. INFINITE SLIDER (seamless cloning) ──────────────────── */
(function initSliders() {
  const tracks = ['track1', 'track2'];
  tracks.forEach(id => {
    const track = document.getElementById(id);
    if (!track) return;
    const original = Array.from(track.children);
    // Clone enough copies for seamless looping
    [1, 2].forEach(() => {
      original.forEach(child => {
        const clone = child.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        // Rebind lightbox click on clones
        clone.addEventListener('click', () => openLightbox(clone));
        track.appendChild(clone);
      });
    });
  });

  // Pause on hover is handled in CSS
})();


/* ── 5. LIGHTBOX ────────────────────────────────────────────── */
const lightbox       = document.getElementById('lightbox');
const lightboxMedia  = document.getElementById('lightboxMedia');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(card) {
  const img     = card.querySelector('img');
  const overlay = card.querySelector('.slide-overlay span');
  const caption = overlay ? overlay.textContent : '';

  if (!img) return;

  lightboxMedia.innerHTML = `<img src="${img.src}" alt="${caption}">`;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxMedia.innerHTML = '';
  document.body.style.overflow = '';
}

// Bind original slide cards
document.querySelectorAll('.slide-card').forEach(card => {
  card.addEventListener('click', () => openLightbox(card));
});

// Close button & backdrop
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});


/* ── 6. VIDEO SWAP (sidebar → main) ─────────────────────────── */
(function initVideoSwap() {
  const mainVideo  = document.getElementById('mainVideo');
  const mainLabel  = document.querySelector('.video-main-label');
  const thumbCards = document.querySelectorAll('.video-thumb-card');

  thumbCards.forEach(card => {
    card.addEventListener('click', () => {
      const src   = card.dataset.src;
      const label = card.dataset.label;

      if (src && mainVideo) {
        mainVideo.src  = src;
        mainVideo.load();
        mainVideo.play().catch(() => {}); // autoplay may be blocked
      }
      if (mainLabel && label) mainLabel.textContent = label;

      // Scroll to main video on mobile
      if (window.innerWidth < 900) {
        document.querySelector('.video-main')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
})();


/* ── 7. VOLUNTEER FORM ──────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById('volunteerForm');
  const btn  = document.getElementById('formSubmitBtn');
  if (!form || !btn) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Animate button
    btn.textContent = '✓ धन्यवाद! हम जल्द संपर्क करेंगे।';
    btn.style.background = '#1A7C12';
    btn.disabled = true;

    // Optional: send data somewhere
    // const data = new FormData(form);
    // fetch('/api/volunteer', { method: 'POST', body: data });
  });
})();


/* ── 8. HERO PARALLAX (subtle) ──────────────────────────────── */
(function initParallax() {
  const watermark = document.querySelector('.hero-watermark');
  if (!watermark) return;

  const onScroll = () => {
    const y = window.scrollY;
    watermark.style.transform = `translateY(calc(-50% + ${y * 0.15}px))`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── 9. SMOOTH ANCHOR OFFSET (account for fixed nav) ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});