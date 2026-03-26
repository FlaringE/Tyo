/* =====================================================
   TYO BIOPEDIA — main.js  v2
   Modules: Scroll Progress, Particle Canvas,
            Nav Scroll + Hamburger, Scroll Reveal,
            Counter Animation
   ===================================================== */

/* ---------- 1. SCROLL PROGRESS BAR ---------- */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', function () {
    const scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}());


/* ---------- 2. PARTICLE CANVAS ---------- */
(function initParticleCanvas() {
  const canvas = document.getElementById('bio-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.r     = Math.random() * 1.2 + 0.4;
    this.vx    = (Math.random() - 0.5) * 0.2;
    this.vy    = (Math.random() - 0.5) * 0.2;
    this.alpha = Math.random() * 0.45 + 0.1;
    this.color = Math.random() > 0.5 ? '0,224,122' : '125,212,168';
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
    ctx.fillStyle = 'rgba(' + this.color + ',' + this.alpha + ')';
    ctx.fill();
  };

  function initParticles() {
    particles = [];
    /* Reduced density: 1 particle per 20000px² */
    const count = Math.min(Math.floor((W * H) / 20000), 60);
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx   = particles[i].x - particles[j].x;
        var dy   = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        /* Shorter connection range + lower alpha than before */
        if (dist < 75) {
          var alpha = (1 - dist / 75) * 0.07;
          ctx.strokeStyle = 'rgba(0,224,122,' + alpha + ')';
          ctx.lineWidth = 0.5;
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
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(loop);
  }

  resize();
  initParticles();
  loop();

  window.addEventListener('resize', function () {
    resize();
    initParticles();
  });
}());


/* ---------- 3. NAV SCROLL + HAMBURGER MENU ---------- */
(function initNav() {
  var nav       = document.getElementById('main-nav');
  var hamburger = document.getElementById('nav-hamburger');
  var drawer    = document.getElementById('nav-drawer');
  var drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

  /* Scroll class */
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* Toggle drawer */
  function toggleDrawer(open) {
    if (!hamburger || !drawer) return;
    hamburger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      var isOpen = drawer.classList.contains('open');
      toggleDrawer(!isOpen);
    });
  }

  /* Close drawer on link click */
  drawerLinks.forEach(function (link) {
    link.addEventListener('click', function () { toggleDrawer(false); });
  });

  /* Close drawer on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') toggleDrawer(false);
  });
}());


/* ---------- 4. SCROLL REVEAL ---------- */
(function initScrollReveal() {
  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
}());


/* ---------- 5. COUNTER ANIMATION ---------- */
(function initCounters() {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el      = entry.target;
      var target  = parseInt(el.dataset.target, 10);
      var suffixEl = el.querySelector('.stat-suffix');
      var suffix   = suffixEl ? suffixEl.outerHTML : '';
      var current  = 0;
      var step     = Math.ceil(target / 50);

      var timer = setInterval(function () {
        current = Math.min(current + step, target);
        el.innerHTML = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 35);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { observer.observe(c); });
}());
