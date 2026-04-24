/* ============================================================
   AutoAds — script.js
   Features:
   - Custom cursor
   - Scroll progress bar + auto rickshaw icon
   - Scroll-based reveal animations
   - Counter animation for stats
   - Contact form submission handler
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top  = e.clientY + 'px';
  });

  // Expand ring on interactive elements
  const interactiveEls = document.querySelectorAll('a, button, input, textarea, select');

  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width   = '52px';
      cursorRing.style.height  = '52px';
      cursorRing.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width   = '34px';
      cursorRing.style.height  = '34px';
      cursorRing.style.opacity = '0.6';
    });
  });


  /* ─────────────────────────────────────────
     2. SCROLL PROGRESS BAR + AUTO ICON
  ───────────────────────────────────────── */
  const progressFill = document.getElementById('progress-fill');
  const autoIcon     = document.getElementById('auto-icon');

  function updateScrollProgress() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.body.scrollHeight - window.innerHeight;
    const percentage = Math.min((scrollTop / docHeight) * 100, 100);

    progressFill.style.width = percentage + '%';
    autoIcon.style.left      = percentage + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });


  /* ─────────────────────────────────────────
     3. SCROLL REVEAL ANIMATIONS
  ───────────────────────────────────────── */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));


  /* ─────────────────────────────────────────
     4. COUNTER ANIMATION (Stats section)
  ───────────────────────────────────────── */
  function animateCounter(el) {
    const target      = parseInt(el.dataset.target, 10);
    const duration    = 1800;
    const frameRate   = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      const current  = Math.round(progress * target);

      if (target >= 1000) {
        el.textContent = current.toLocaleString('en-IN');
      } else {
        el.textContent = current;
      }

      if (frame >= totalFrames) {
        clearInterval(timer);
        if (target >= 1000) {
          el.textContent = target.toLocaleString('en-IN');
        } else {
          el.textContent = target;
        }
      }
    }, frameRate);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-count[data-target]').forEach((el) => {
    counterObserver.observe(el);
  });


  /* ─────────────────────────────────────────
     5. NAVBAR — add shadow on scroll
  ───────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgba(13, 13, 13, 0.96)';
      navbar.style.boxShadow  = '0 4px 32px rgba(0,0,0,0.4)';
    } else {
      navbar.style.background = 'rgba(13, 13, 13, 0.80)';
      navbar.style.boxShadow  = 'none';
    }
  }, { passive: true });


  /* ─────────────────────────────────────────
     6. CONTACT FORM SUBMISSION
  ───────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const successMsg  = document.getElementById('successMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://formspree.io/f/meevpzpa', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          successMsg.style.display = 'block';
          contactForm.reset();

          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 5000);

        } else {
          alert('Something went wrong. Please try again.');
        }

      } catch (error) {
        alert('Network error. Please check your connection and try again.');
      }
    });
  }

});