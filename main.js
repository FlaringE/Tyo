/**
 * TYO BIOPEDIA — main.js
 * Dr. Tajudeen Olanrewaju Yahaya Portfolio
 * VPS path: /var/www/tyo-biopedia/main.js
 *
 * Modules:
 *  1. progressBar      — scroll progress indicator
 *  2. particleCanvas   — ambient background particles
 *  3. scienceLayer     — floating biology SVG icons
 *  4. navBehavior      — scroll class + hamburger menu
 *  5. revealOnScroll   — IntersectionObserver fade-in
 *  6. counterAnimation — number count-up on scroll
 */

'use strict';

/* ── 1. SCROLL PROGRESS BAR ─────────────────────────────────── */
(function progressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  function updateBar() {
    const scrolled  = document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight
                    - document.documentElement.clientHeight;
    const pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateBar, { passive: true });
})();

/* ── 2. PARTICLE CANVAS ─────────────────────────────────────── */
(function particleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const CONFIG = {
    maxParticles: 50,
    densityDivisor: 22000,
    connectionDistance: 65,
    connectionAlpha: 0.05,
    colors: ['0,224,122', '125,212,168'],
    speedRange: 0.15,
    sizeRange: [0.4, 1.6],
    alphaRange: [0.08, 0.43],
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * (CONFIG.sizeRange[1] - CONFIG.sizeRange[0]) + CONFIG.sizeRange[0];
    this.vx = (Math.random() - 0.5) * CONFIG.speedRange;
    this.vy = (Math.random() - 0.5) * CONFIG.speedRange;
    this.a  = Math.random() * (CONFIG.alphaRange[1] - CONFIG.alphaRange[0]) + CONFIG.alphaRange[0];
    this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.a})`;
    ctx.fill();
  };

  function initParticles() {
    const count = Math.min(Math.floor((W * H) / CONFIG.densityDivisor), CONFIG.maxParticles);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);

        if (d < CONFIG.connectionDistance) {
          const alpha = (1 - d / CONFIG.connectionDistance) * CONFIG.connectionAlpha;
          ctx.strokeStyle = `rgba(0,224,122,${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }

  resize();
  initParticles();
  loop();

  window.addEventListener('resize', () => { resize(); initParticles(); });
})();

/* ── 3. FLOATING SCIENCE LAYER ──────────────────────────────── */
(function scienceLayer() {
  const layer = document.getElementById('science-layer');
  if (!layer) return;

  const ICONS = [
    /* DNA Helix */
    `<svg width="70" height="110" viewBox="0 0 70 110" fill="none" aria-hidden="true">
      <path d="M35 0 C60 12,60 24,35 36 C10 48,10 60,35 72 C60 84,60 96,35 108" stroke="#00e07a" stroke-width="1.5" opacity=".65"/>
      <path d="M35 0 C10 12,10 24,35 36 C60 48,60 60,35 72 C10 84,10 96,35 108" stroke="#7dd4a8" stroke-width="1.5" opacity=".5"/>
      <line x1="22" y1="18" x2="48" y2="18" stroke="#00e07a" stroke-width="1" opacity=".55"/>
      <line x1="12" y1="36" x2="58" y2="36" stroke="#7dd4a8" stroke-width="1" opacity=".5"/>
      <line x1="22" y1="54" x2="48" y2="54" stroke="#00e07a" stroke-width="1" opacity=".55"/>
      <line x1="12" y1="72" x2="58" y2="72" stroke="#7dd4a8" stroke-width="1" opacity=".5"/>
      <line x1="22" y1="90" x2="48" y2="90" stroke="#00e07a" stroke-width="1" opacity=".55"/>
      <circle cx="22" cy="18" r="2.5" fill="#00e07a" opacity=".75"/>
      <circle cx="48" cy="18" r="2.5" fill="#00e07a" opacity=".55"/>
      <circle cx="12" cy="36" r="2.5" fill="#7dd4a8" opacity=".75"/>
      <circle cx="58" cy="36" r="2.5" fill="#7dd4a8" opacity=".55"/>
      <circle cx="22" cy="54" r="2.5" fill="#00e07a" opacity=".75"/>
      <circle cx="48" cy="54" r="2.5" fill="#00e07a" opacity=".55"/>
      <circle cx="12" cy="72" r="2.5" fill="#7dd4a8" opacity=".75"/>
      <circle cx="58" cy="72" r="2.5" fill="#7dd4a8" opacity=".55"/>
      <circle cx="22" cy="90" r="2.5" fill="#00e07a" opacity=".75"/>
      <circle cx="48" cy="90" r="2.5" fill="#00e07a" opacity=".55"/>
    </svg>`,

    /* Molecule */
    `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <line x1="40" y1="40" x2="70" y2="20" stroke="#00e07a" stroke-width="1.2" opacity=".65"/>
      <line x1="40" y1="40" x2="10" y2="20" stroke="#00e07a" stroke-width="1.2" opacity=".65"/>
      <line x1="40" y1="40" x2="40" y2="70" stroke="#00e07a" stroke-width="1.2" opacity=".65"/>
      <line x1="40" y1="40" x2="68" y2="58" stroke="#7dd4a8" stroke-width="1" opacity=".55"/>
      <line x1="40" y1="40" x2="12" y2="58" stroke="#7dd4a8" stroke-width="1" opacity=".55"/>
      <circle cx="40" cy="40" r="7" fill="#030b05" stroke="#00e07a" stroke-width="1.5" opacity=".9"/>
      <circle cx="70" cy="20" r="4.5" fill="#030b05" stroke="#7dd4a8" stroke-width="1.2" opacity=".75"/>
      <circle cx="10" cy="20" r="4.5" fill="#030b05" stroke="#7dd4a8" stroke-width="1.2" opacity=".75"/>
      <circle cx="40" cy="70" r="4.5" fill="#030b05" stroke="#00e07a" stroke-width="1.2" opacity=".75"/>
      <circle cx="68" cy="58" r="3.5" fill="#030b05" stroke="#7dd4a8" stroke-width="1" opacity=".65"/>
      <circle cx="12" cy="58" r="3.5" fill="#030b05" stroke="#7dd4a8" stroke-width="1" opacity=".65"/>
      <text x="36" y="44" font-size="7" fill="#00e07a" opacity=".9" font-family="monospace">C</text>
    </svg>`,

    /* Cell */
    `<svg width="90" height="90" viewBox="0 0 90 90" fill="none" aria-hidden="true">
      <ellipse cx="45" cy="45" rx="40" ry="32" stroke="#00e07a" stroke-width="1.2" opacity=".45" stroke-dasharray="4 3"/>
      <ellipse cx="45" cy="45" rx="29" ry="22" stroke="#7dd4a8" stroke-width="1" opacity=".35"/>
      <circle cx="45" cy="45" r="10" fill="none" stroke="#00e07a" stroke-width="1.5" opacity=".65"/>
      <circle cx="45" cy="45" r="5" fill="#00e07a" opacity=".2"/>
      <circle cx="28" cy="38" r="3" fill="none" stroke="#7dd4a8" stroke-width="1" opacity=".55"/>
      <circle cx="62" cy="50" r="2.5" fill="none" stroke="#7dd4a8" stroke-width="1" opacity=".5"/>
      <circle cx="36" cy="58" r="2" fill="none" stroke="#00e07a" stroke-width="1" opacity=".5"/>
      <circle cx="56" cy="34" r="2.5" fill="none" stroke="#00e07a" stroke-width="1" opacity=".5"/>
    </svg>`,

    /* Benzene ring */
    `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" aria-hidden="true">
      <polygon points="35,8 62,22 62,50 35,64 8,50 8,22" stroke="#00e07a" stroke-width="1.3" fill="none" opacity=".65"/>
      <polygon points="35,18 52,27 52,46 35,56 18,46 18,27" stroke="#7dd4a8" stroke-width="1" fill="none" opacity=".45"/>
      <line x1="35" y1="8"  x2="35" y2="18" stroke="#00e07a" stroke-width="1" opacity=".45"/>
      <line x1="62" y1="22" x2="52" y2="27" stroke="#00e07a" stroke-width="1" opacity=".45"/>
      <line x1="62" y1="50" x2="52" y2="46" stroke="#00e07a" stroke-width="1" opacity=".45"/>
      <line x1="35" y1="64" x2="35" y2="56" stroke="#00e07a" stroke-width="1" opacity=".45"/>
      <line x1="8"  y1="50" x2="18" y2="46" stroke="#00e07a" stroke-width="1" opacity=".45"/>
      <line x1="8"  y1="22" x2="18" y2="27" stroke="#00e07a" stroke-width="1" opacity=".45"/>
      <circle cx="35" cy="36" r="3" fill="#00e07a" opacity=".25"/>
    </svg>`,

    /* Microscope */
    `<svg width="55" height="80" viewBox="0 0 55 80" fill="none" aria-hidden="true">
      <rect x="22" y="2"  width="12" height="22" rx="6" stroke="#00e07a" stroke-width="1.3" fill="none" opacity=".65"/>
      <rect x="20" y="20" width="16" height="8"  rx="2" stroke="#7dd4a8" stroke-width="1.2" fill="none" opacity=".6"/>
      <line x1="28" y1="28" x2="28" y2="50" stroke="#00e07a" stroke-width="1.5" opacity=".65"/>
      <line x1="14" y1="50" x2="42" y2="50" stroke="#7dd4a8" stroke-width="1.3" opacity=".6"/>
      <line x1="14" y1="50" x2="10" y2="60" stroke="#00e07a" stroke-width="1.2" opacity=".55"/>
      <line x1="42" y1="50" x2="46" y2="60" stroke="#00e07a" stroke-width="1.2" opacity=".55"/>
      <line x1="8"  y1="60" x2="48" y2="60" stroke="#7dd4a8" stroke-width="1.5" opacity=".65"/>
      <ellipse cx="28" cy="60" rx="20" ry="4" stroke="#00e07a" stroke-width="1" fill="none" opacity=".25"/>
    </svg>`,

    /* Leaf */
    `<svg width="65" height="80" viewBox="0 0 65 80" fill="none" aria-hidden="true">
      <path d="M32 75 C32 75 5 55 5 30 C5 12 18 5 32 5 C46 5 60 12 60 30 C60 55 32 75 32 75Z" stroke="#00e07a" stroke-width="1.3" fill="none" opacity=".45"/>
      <line x1="32" y1="72" x2="32" y2="20" stroke="#7dd4a8" stroke-width="1.2" opacity=".55"/>
      <line x1="32" y1="55" x2="18" y2="42" stroke="#00e07a" stroke-width="1" opacity=".45"/>
      <line x1="32" y1="45" x2="46" y2="34" stroke="#00e07a" stroke-width="1" opacity=".45"/>
      <line x1="32" y1="35" x2="20" y2="27" stroke="#7dd4a8" stroke-width="1" opacity=".4"/>
      <line x1="32" y1="28" x2="44" y2="22" stroke="#7dd4a8" stroke-width="1" opacity=".4"/>
    </svg>`,

    /* Atom */
    `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <ellipse cx="40" cy="40" rx="35" ry="15" stroke="#00e07a" stroke-width="1.2" opacity=".55"/>
      <ellipse cx="40" cy="40" rx="35" ry="15" stroke="#7dd4a8" stroke-width="1" opacity=".4" transform="rotate(60 40 40)"/>
      <ellipse cx="40" cy="40" rx="35" ry="15" stroke="#00e07a" stroke-width="1" opacity=".4" transform="rotate(120 40 40)"/>
      <circle cx="40" cy="40" r="5" fill="#00e07a" opacity=".5"/>
      <circle cx="75" cy="40" r="3" fill="#7dd4a8" opacity=".7"/>
    </svg>`,
  ];

  /* Spawn configuration: left position, duration, delay, scale */
  const SPAWN_CONFIG = [
    { left: '4%',  dur: 28, delay: 0,  scale: 0.70 },
    { left: '14%', dur: 36, delay: 8,  scale: 0.55 },
    { left: '24%', dur: 42, delay: 3,  scale: 0.80 },
    { left: '36%', dur: 31, delay: 15, scale: 0.50 },
    { left: '50%', dur: 38, delay: 5,  scale: 0.65 },
    { left: '64%', dur: 33, delay: 12, scale: 0.75 },
    { left: '74%', dur: 45, delay: 20, scale: 0.55 },
    { left: '84%', dur: 29, delay: 7,  scale: 0.70 },
    { left: '91%', dur: 37, delay: 18, scale: 0.60 },
    { left: '7%',  dur: 41, delay: 25, scale: 0.50 },
    { left: '44%', dur: 34, delay: 30, scale: 0.65 },
    { left: '70%', dur: 48, delay: 22, scale: 0.45 },
  ];

  const fragment = document.createDocumentFragment();

  SPAWN_CONFIG.forEach(function (cfg, i) {
    const el = document.createElement('div');
    el.className       = 'science-icon';
    el.innerHTML       = ICONS[i % ICONS.length];
    el.style.left            = cfg.left;
    el.style.transform       = `scale(${cfg.scale})`;
    el.style.animationDuration = `${cfg.dur}s`;
    el.style.animationDelay   = `${cfg.delay}s`;
    el.setAttribute('aria-hidden', 'true');
    fragment.appendChild(el);
  });

  layer.appendChild(fragment);
})();

/* ── 4. NAV BEHAVIOR ────────────────────────────────────────── */
(function navBehavior() {
  const nav     = document.getElementById('site-nav');
  const btn     = document.getElementById('hamburger-btn');
  const drawer  = document.getElementById('nav-drawer');
  const links   = drawer ? drawer.querySelectorAll('a') : [];

  /* Scroll class */
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* Toggle open/close */
  function toggleDrawer(open) {
    if (!btn || !drawer) return;
    btn.classList.toggle('is-open', open);
    drawer.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    btn.setAttribute('aria-expanded', String(open));
  }

  if (btn)    btn.addEventListener('click', () => toggleDrawer(!drawer.classList.contains('is-open')));
  links.forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleDrawer(false); });
})();

/* ── 5. REVEAL ON SCROLL ─────────────────────────────────────── */
(function revealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ── 6. COUNTER ANIMATION ────────────────────────────────────── */
(function counterAnimation() {
  const counters = document.querySelectorAll('[data-count-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const el      = entry.target;
      const target  = parseInt(el.dataset.countTarget, 10);
      const suffix  = el.querySelector('.count-suffix');
      const suffixHTML = suffix ? suffix.outerHTML : '';
      const step    = Math.ceil(target / 50);
      let current   = 0;

      const timer = setInterval(function () {
        current = Math.min(current + step, target);
        el.innerHTML = current + suffixHTML;
        if (current >= target) clearInterval(timer);
      }, 35);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();
