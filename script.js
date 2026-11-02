/* ═══════════════════════════════════════════
   MR ATHIYO — Interactions v3
   Loader · Vlog embed · Reveals · Cursor · Parallax
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ═════════ STEAM-STYLE LOADER ═════════ */
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPercent = document.getElementById('loaderPercent');
  const loaderStatus = document.getElementById('loaderStatus');
  const loaderGlow = document.querySelector('.loader-glow');
  const loaderTip = document.getElementById('loaderTip');

  const tips = [
    'Press any key to skip',
    'Tip: Check out my first vlog below ↓',
    'Tip: Move your mouse — everything responds',
    'Tip: Software engineering + AI + gaming',
    'Tip: Built with curiosity in Sri Lanka 🇱🇰',
    'Tip: Scroll slowly for cinematic reveals',
    'Tip: Every card reacts to your cursor'
  ];

  const statuses = [
    'Initializing systems…',
    'Loading neural modules…',
    'Rendering 3D avatar…',
    'Compiling experiences…',
    'Polishing pixels…',
    'Almost ready…'
  ];

  let tipIndex = 0;
  const tipCycle = setInterval(() => {
    if (!loaderTip) return;
    tipIndex = (tipIndex + 1) % tips.length;
    loaderTip.style.opacity = '0';
    setTimeout(() => {
      loaderTip.textContent = tips[tipIndex];
      loaderTip.style.opacity = '1';
    }, 200);
  }, 1800);

  document.body.classList.add('loading');

  let progress = 0;
  const finishLoading = () => {
    clearInterval(tipCycle);
    clearInterval(loadInterval);
    progress = 100;
    if (loaderBar) loaderBar.style.width = '100%';
    if (loaderGlow) loaderGlow.style.width = '100%';
    if (loaderPercent) loaderPercent.textContent = '100%';
    if (loaderStatus) loaderStatus.textContent = 'READY';
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
      document.body.classList.remove('loading');
      // Trigger hero reveals after loader
      document.querySelectorAll('.hero [data-reveal]').forEach(el => {
        el.classList.add('is-visible');
      });
    }, 500);
  };

  const loadInterval = setInterval(() => {
    // Progress speeds up then slows near the end
    const remaining = 100 - progress;
    const step = Math.max(0.5, remaining * 0.06 + Math.random() * 2.5);
    progress = Math.min(progress + step, 99);

    if (loaderBar) loaderBar.style.width = progress + '%';
    if (loaderGlow) loaderGlow.style.width = progress + '%';
    if (loaderPercent) loaderPercent.textContent = Math.floor(progress) + '%';

    // Update status text at thresholds
    const idx = Math.min(
      statuses.length - 1,
      Math.floor((progress / 100) * statuses.length)
    );
    if (loaderStatus && loaderStatus.textContent !== statuses[idx]) {
      loaderStatus.textContent = statuses[idx];
    }

    if (progress >= 99) {
      setTimeout(finishLoading, 400);
    }
  }, 120);

  // Skip loader on any key or click
  const skipLoader = (e) => {
    if (e && e.type === 'keydown' && e.key === 'Tab') return;
    finishLoading();
    window.removeEventListener('keydown', skipLoader);
    window.removeEventListener('click', skipLoader);
    if (loader) loader.removeEventListener('click', skipLoader);
  };
  window.addEventListener('keydown', skipLoader);
  window.addEventListener('click', skipLoader);
  if (loader) loader.addEventListener('click', skipLoader);

  /* ═════════ MOBILE MENU ═════════ */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ═════════ SCROLL PROGRESS + STICKY HEADER ═════════ */
  const progressBar = document.querySelector('.scroll-progress span');
  const header = document.getElementById('siteHeader');

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (header) header.classList.toggle('scrolled', scrollTop > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ═════════ SCROLL-REVEAL (staggered) ═════════ */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ═════════ ANIMATED COUNTERS ═════════ */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => counterObserver.observe(c));

  /* ═════════ CUSTOM CURSOR + SPOTLIGHT ═════════ */
  const ring = document.querySelector('.cursor-ring');
  const dot = document.querySelector('.cursor-dot');
  const spotlight = document.querySelector('.spotlight');
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  if (finePointer && ring && dot && spotlight) {
    let ringX = window.innerWidth / 2, ringY = window.innerHeight / 2;
    let mouseX = ringX, mouseY = ringY;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const render = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      spotlight.style.left = mouseX + 'px';
      spotlight.style.top = mouseY + 'px';

      requestAnimationFrame(render);
    };
    render();

    document.querySelectorAll('a, button, .world-card, .project-card, .socials > a, .skill-card, .vlog-thumb')
      .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
      });
  }

  /* ═════════ SPOTLIGHT CARDS ═════════ */
  document.querySelectorAll('.spot-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* ═════════ TILT EFFECT ═════════ */
  document.querySelectorAll('.tilt').forEach(el => {
    const maxTilt = 8;
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateX(${-py * maxTilt}deg) rotateY(${px * maxTilt}deg)`;
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });

  /* ═════════ HERO PARALLAX ═════════ */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (finePointer && parallaxEls.length) {
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;

    window.addEventListener('pointermove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const animateParallax = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      parallaxEls.forEach(el => {
        const depth = parseFloat(el.dataset.parallax) || 0.08;
        el.style.transform = `translate3d(${currentX * depth * 60}px, ${currentY * depth * 60}px, 0)`;
      });
      requestAnimationFrame(animateParallax);
    };
    animateParallax();
  }

  /* ═════════ MAGNETIC BUTTONS ═════════ */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });

  /* ═════════ VLOG — LAZY YOUTUBE EMBED ═════════ */
  const vlogThumb = document.getElementById('vlogThumb');
  const vlogEmbed = document.getElementById('vlogEmbed');
  const VLOG_ID = 'PM4sJMe-uEg'; // Mr Athiyo — First Vlog

  const playVlog = () => {
    if (!vlogEmbed || vlogEmbed.dataset.playing === 'true') return;
    vlogEmbed.dataset.playing = 'true';
    vlogEmbed.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${VLOG_ID}?autoplay=1&rel=0&modestbranding=1&color=white"
        title="Mr Athiyo — My First Vlog"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      ></iframe>
    `;
  };

  if (vlogThumb) {
    vlogThumb.addEventListener('click', playVlog);
    vlogThumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playVlog();
      }
    });
  }

  /* ═════════ 3D AVATAR SPOTLIGHT FOLLOW ═════════ */
  const avatarStage = document.querySelector('.avatar-stage');
  if (finePointer && avatarStage) {
    avatarStage.addEventListener('pointermove', (e) => {
      const rect = avatarStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const img = avatarStage.querySelector('.avatar-3d');
      if (img) {
        img.style.transform = `translate(${x * 14}px, ${y * 14}px) rotate(${x * 3}deg)`;
      }
    });
    avatarStage.addEventListener('pointerleave', () => {
      const img = avatarStage.querySelector('.avatar-3d');
      if (img) img.style.transform = '';
    });
  }

  /* ═════════ ACTIVE NAV HIGHLIGHT ON SCROLL ═════════ */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href').slice(1);
            link.classList.toggle('active', href === id);
          });
        }
      });
    }, { threshold: 0.35, rootMargin: '-80px 0px -55% 0px' });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ═════════ MOUSE-TRAIL SPARKS (desktop only) ═════════ */
  if (finePointer) {
    let lastSpark = 0;
    document.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - lastSpark < 60) return;
      lastSpark = now;

      const spark = document.createElement('span');
      spark.className = 'spark';
      spark.style.left = e.clientX + 'px';
      spark.style.top = e.clientY + 'px';
      document.body.appendChild(spark);

      setTimeout(() => spark.remove(), 900);
    }, { passive: true });
  }

});