/* ============================================================
   Founder OS — landing page interactions
   Vanilla JS, no dependencies. Progressive + reduced-motion aware.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- copy-to-clipboard ---------- */
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy') || '';
        var label = btn.querySelector('.copy-label');
        var done = function () {
          btn.classList.add('copied');
          if (label) label.textContent = 'Copied';
          window.setTimeout(function () {
            btn.classList.remove('copied');
            if (label) label.textContent = 'Copy';
          }, 1700);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(fallback);
        } else {
          fallback();
        }
        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (e) { /* no-op */ }
          document.body.removeChild(ta);
          done();
        }
      });
    });
  }

  /* ---------- sticky nav state ---------- */
  function initNavState() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- scroll progress bar ---------- */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-bar');
    if (!bar) return;
    var ticking = false;
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct.toFixed(2) + '%';
      ticking = false;
    };
    update();
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- mobile menu ---------- */
  function initMobileMenu() {
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');
    var overlay = document.getElementById('mobile-overlay');
    if (!toggle || !links) return;

    var setOpen = function (open) {
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('menu-open'));
    });
    if (overlay) overlay.addEventListener('click', function () { setOpen(false); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- reveal on scroll + terminal trigger ---------- */
  function initReveal() {
    var revealEls = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
      var term0 = document.getElementById('terminal');
      if (term0) term0.classList.add('run');
      return;
    }

    revealEls.forEach(function (el) {
      var delay = el.getAttribute('data-reveal-delay');
      if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    revealEls.forEach(function (el) { io.observe(el); });

    var terminal = document.getElementById('terminal');
    if (terminal) {
      var termIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            terminal.classList.add('run');
            termIO.unobserve(terminal);
          }
        });
      }, { threshold: 0.4 });
      termIO.observe(terminal);
    }
  }

  /* ---------- parallax ambient glow ---------- */
  function initParallax() {
    if (reduceMotion) return;
    var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!layers.length) return;
    var ticking = false;
    var apply = function () {
      var y = window.scrollY;
      layers.forEach(function (el) {
        var rate = parseFloat(el.getAttribute('data-parallax')) || 0;
        el.style.transform = 'translate3d(0,' + (y * rate).toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(apply);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- skill card cursor glow ---------- */
  function initSkillGlow() {
    if (reduceMotion) return;
    document.querySelectorAll('.skill').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    initCopyButtons();
    initNavState();
    initScrollProgress();
    initMobileMenu();
    initReveal();
    initParallax();
    initSkillGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
