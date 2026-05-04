/* ========================================
   NARUTO CHANNEL — SCRIPT.JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. MUSIC TOGGLE ─────────────────────────
  const audio = document.getElementById('bg-music');
  const musicBtn = document.getElementById('musicToggle');
  const musicIcon = musicBtn?.querySelector('.music-icon');

  let musicPlaying = false;

  function tryAutoplay() {
    if (!audio) return;
    audio.volume = 0.3;
    const promise = audio.play();
    if (promise !== undefined) {
      promise.then(() => {
        musicPlaying = true;
        musicBtn?.classList.add('playing');
        if (musicIcon) musicIcon.textContent = '🎵';
      }).catch(() => {
        // Autoplay blocked — wait for user gesture
        musicPlaying = false;
      });
    }
  }
  tryAutoplay();

  musicBtn?.addEventListener('click', () => {
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      musicPlaying = false;
      musicBtn.classList.remove('playing');
      if (musicIcon) musicIcon.textContent = '🔇';
    } else {
      audio.volume = 0.3;
      audio.play();
      musicPlaying = true;
      musicBtn.classList.add('playing');
      if (musicIcon) musicIcon.textContent = '🎵';
    }
  });

  // Start music on first interaction (for browsers that block autoplay)
  const startMusicOnce = () => {
    if (!musicPlaying && audio) {
      audio.volume = 0.3;
      audio.play().then(() => {
        musicPlaying = true;
        musicBtn?.classList.add('playing');
        if (musicIcon) musicIcon.textContent = '🎵';
      }).catch(() => {});
    }
    document.removeEventListener('click', startMusicOnce);
    document.removeEventListener('keydown', startMusicOnce);
    document.removeEventListener('touchstart', startMusicOnce);
  };
  document.addEventListener('click', startMusicOnce);
  document.addEventListener('keydown', startMusicOnce);
  document.addEventListener('touchstart', startMusicOnce, { passive: true });


  // ── 2. NAVBAR SCROLL ────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });


  // ── 3. HAMBURGER MENU ───────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function openMenu() {
    hamburger?.classList.add('open');
    navLinks?.classList.add('open');
    navOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    navOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    if (hamburger.classList.contains('open')) closeMenu();
    else openMenu();
  });

  navOverlay?.addEventListener('click', closeMenu);

  // Close on nav link click (mobile)
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  // ── 4. HERO STAT COUNTER ────────────────────
  const statNums = document.querySelectorAll('.stat-num');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));


  // ── 5. SCROLL REVEAL ────────────────────────
  const revealEls = document.querySelectorAll(
    '.playlist-card, .schedule-card, .past-stream-card, .featured-video-wrap, .about-section, .channel-banner-inner'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ── 6. FILTER BUTTONS (VIDEOS PAGE) ─────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const playlistCards = document.querySelectorAll('.playlist-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      playlistCards.forEach(card => {
        if (filter === 'all' || card.dataset.filter === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ── 7. KUNAI FLOATING PARTICLES ─────────────
  const kunaiLayer = document.getElementById('kunaiLayer');
  if (kunaiLayer) {
    const symbols = ['⚡', '🌀', '🔥', '✦', '◆'];
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 18 + 10}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.3 + 0.05};
        animation: floatKunai ${Math.random() * 10 + 8}s ease-in-out infinite alternate;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
        color: var(--orange);
        transform: rotate(${Math.random() * 360}deg);
      `;
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      kunaiLayer.appendChild(el);
    }

    // Inject keyframe
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatKunai {
        from { transform: translateY(0) rotate(0deg); }
        to { transform: translateY(-40px) rotate(180deg); }
      }
    `;
    document.head.appendChild(style);
  }


  // ── 8. SMOOTH ANCHOR SCROLL ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── 9. PAGE TRANSITION EFFECT ───────────────
  document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('mailto')) {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });

  // Fade in on load
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });

});
