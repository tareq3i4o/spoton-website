(() => {
  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const rtl = doc.dir === 'rtl';

  /* ---------- Split headings into words ---------- */
  let wordIndex = 0;
  const splitWords = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const outer = document.createElement('span');
          const inner = document.createElement('span');
          outer.className = 'w';
          inner.textContent = part;
          inner.style.setProperty('--d', wordIndex++);
          outer.append(inner);
          frag.append(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        splitWords(child);
      }
    });
  };
  $$('.split').forEach((el) => { wordIndex = 0; splitWords(el); });

  /* ---------- Counters ---------- */
  const counters = $$('[data-count]');
  if (!reduceMotion) counters.forEach((el) => { el.textContent = '0'; });
  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1800, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- Reveal on scroll ---------- */
  const startReveals = () => {
    const targets = $$('.reveal, .split, .curtain-img, .panels, .step, [data-count]');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      if (entry.target.dataset.count) runCounter(entry.target);
      io.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((el) => io.observe(el));
  };

  /* ---------- Page curtain ---------- */
  const curtain = $('.curtain');
  let firstVisit = false;
  try {
    firstVisit = !sessionStorage.getItem('spoton-intro');
    sessionStorage.setItem('spoton-intro', '1');
  } catch (e) { /* storage unavailable */ }
  if (curtain && !firstVisit) $('.curtain-logo', curtain)?.remove();

  let revealed = false;
  const revealPage = () => {
    if (revealed) return;
    revealed = true;
    doc.classList.add('page-ready');
    setTimeout(startReveals, reduceMotion ? 0 : 380);
  };
  if (reduceMotion || !curtain) {
    revealPage();
  } else {
    // Lift the curtain once the (self-hosted) headline font is ready; everything else loads behind it.
    const started = performance.now();
    const fontsReady = document.fonts ? document.fonts.load('40px Palestine').catch(() => {}) : Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, 900));
    Promise.race([fontsReady, timeout]).then(() => {
      const minIntro = firstVisit ? 1000 : 60;
      setTimeout(revealPage, Math.max(0, minIntro - (performance.now() - started)));
    });
  }

  const leaveTo = (href) => {
    doc.classList.add('curtain-reset');
    doc.classList.remove('page-ready');
    void curtain.offsetWidth;
    doc.classList.remove('curtain-reset');
    doc.classList.add('page-leaving');
    setTimeout(() => { window.location.href = href; }, 820);
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || !curtain || reduceMotion) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname) return;
    e.preventDefault();
    leaveTo(url.href);
  });

  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    doc.classList.remove('page-leaving', 'menu-open');
    document.body.classList.remove('no-scroll');
    doc.classList.add('page-ready');
  });

  /* ---------- Header, progress, side buttons ---------- */
  const hdr = $('.hdr');
  const progress = $('.progress');
  const toTop = $('.to-top');
  const ring = toTop && $('.ring circle', toTop);
  const parallaxEls = reduceMotion ? [] : $$('[data-parallax]');
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(y / max, 1) : 0;

    if (hdr) {
      hdr.classList.toggle('scrolled', y > 20);
      const busy = doc.classList.contains('menu-open') || $('.drop.open');
      if (Math.abs(y - lastY) > 6) {
        hdr.classList.toggle('hidden', !busy && y > lastY && y > 320);
        lastY = y;
      }
    }
    if (progress) progress.style.transform = `scaleX(${p})`;
    if (toTop) {
      toTop.classList.toggle('show', y > 600);
      if (ring) ring.style.strokeDashoffset = String(157 * (1 - p));
    }

    const vh = window.innerHeight;
    parallaxEls.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const speed = parseFloat(el.dataset.parallax) || 0.08;
      el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * speed).toFixed(1)}px`;
    });
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- Dropdown ---------- */
  $$('.has-drop').forEach((item) => {
    const btn = $('.nav-link', item);
    const drop = $('.drop', item);
    let timer;
    const set = (open) => {
      drop.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', () => set(finePointer ? true : !drop.classList.contains('open')));
    if (finePointer) {
      item.addEventListener('mouseenter', () => { clearTimeout(timer); set(true); });
      item.addEventListener('mouseleave', () => { timer = setTimeout(() => set(false), 200); });
    }
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) set(false); });
    document.addEventListener('click', (e) => { if (!item.contains(e.target)) set(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drop.classList.contains('open')) { set(false); btn.focus(); }
    });
  });

  /* ---------- Mobile menu ---------- */
  const burger = $('.burger');
  const setMenu = (open) => {
    doc.classList.toggle('menu-open', open);
    document.body.classList.toggle('no-scroll', open);
    burger?.setAttribute('aria-expanded', String(open));
    burger?.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  };
  burger?.addEventListener('click', () => setMenu(!doc.classList.contains('menu-open')));
  $$('.mnav a').forEach((a) => a.addEventListener('click', () => {
    const url = new URL(a.href, window.location.href);
    if (url.pathname === window.location.pathname) setMenu(false);
  }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && doc.classList.contains('menu-open')) setMenu(false); });

  /* ---------- Side dots ---------- */
  const dots = $$('.side-dots a');
  if (dots.length && 'IntersectionObserver' in window) {
    const byId = new Map(dots.map((d) => [d.getAttribute('href').slice(1), d]));
    const so = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      dots.forEach((d) => d.classList.remove('active'));
      byId.get(entry.target.id)?.classList.add('active');
    }), { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* ---------- Gallery filters ---------- */
  const tiles = $$('.tile');
  const chips = $$('.filters .chip');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    if (chip.getAttribute('aria-pressed') === 'true') return;
    const filter = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    tiles.forEach((t) => { t.style.transitionDelay = '0ms'; t.classList.add('is-hiding'); });
    setTimeout(() => {
      let i = 0;
      tiles.forEach((t) => {
        t.hidden = filter !== 'all' && t.dataset.cat !== filter;
        if (!t.hidden) t.style.transitionDelay = `${i++ * 45}ms`;
      });
      requestAnimationFrame(() => requestAnimationFrame(() => tiles.forEach((t) => t.classList.remove('is-hiding'))));
    }, reduceMotion ? 0 : 420);
  }));

  /* ---------- Lightbox ---------- */
  const lb = $('.lightbox');
  if (lb && tiles.length) {
    const img = $('.lb-stage img', lb);
    const cap = $('.lb-cap', lb);
    const count = $('.lb-count', lb);
    const closeBtn = $('.lb-close', lb);
    let list = [];
    let current = 0;
    let opener = null;
    const pad = (n) => String(n).padStart(2, '0');

    const show = (i) => {
      current = (i + list.length) % list.length;
      const tile = list[current];
      const src = $('img', tile);
      img.classList.remove('ready');
      img.onload = () => img.classList.add('ready');
      setTimeout(() => {
        img.src = src.currentSrc || src.src;
        img.alt = src.alt;
        if (img.complete) img.classList.add('ready');
      }, img.getAttribute('src') ? 180 : 0);
      cap.innerHTML = '';
      const small = $('.tile-cap small', tile);
      const text = $('.tile-cap span', tile);
      if (small) { const s = document.createElement('small'); s.textContent = small.textContent; cap.append(s); }
      if (text) cap.append(text.textContent);
      count.innerHTML = `<b>${pad(current + 1)}</b> / ${pad(list.length)}`;
    };
    const open = (tile) => {
      list = tiles.filter((t) => !t.hidden);
      opener = tile;
      show(list.indexOf(tile));
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      setTimeout(() => closeBtn.focus(), 50);
    };
    const close = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      opener?.focus();
    };
    tiles.forEach((t) => t.addEventListener('click', () => open(t)));
    closeBtn.addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(current - 1));
    $('.lb-next', lb).addEventListener('click', () => show(current + 1));
    $('.lb-stage', lb).addEventListener('click', (e) => { if (e.target !== img) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current + (rtl ? 1 : -1));
      if (e.key === 'ArrowRight') show(current + (rtl ? -1 : 1));
      if (e.key === 'Tab') {
        const focusables = $$('button', lb);
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    let touchX = null;
    lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(current + ((dx < 0) !== rtl ? 1 : -1));
      touchX = null;
    });
  }

  /* ---------- Floating preview on service rows ---------- */
  const preview = $('.hover-preview');
  if (preview && finePointer && !reduceMotion) {
    const pimg = $('img', preview);
    let x = 0, y = 0, cx = 0, cy = 0, raf = null, hideTimer;
    const loop = () => {
      cx += (x - cx) * 0.14;
      cy += (y - cy) * 0.14;
      preview.style.left = `${cx}px`;
      preview.style.top = `${cy}px`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    $$('.svc[data-img]').forEach((row) => {
      row.addEventListener('mouseenter', () => {
        clearTimeout(hideTimer);
        pimg.src = row.dataset.img;
        if (!raf) { cx = x; cy = y; loop(); }
        preview.classList.add('show');
      });
      row.addEventListener('mouseleave', () => {
        preview.classList.remove('show');
        hideTimer = setTimeout(() => { cancelAnimationFrame(raf); raf = null; }, 500);
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.translate = `${dx * 0.25}px ${dy * 0.35}px`;
      });
      el.addEventListener('mouseleave', () => { el.style.translate = '0 0'; });
    });
  }

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
