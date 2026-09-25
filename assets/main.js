(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  const setMenu = (open) => {
    header.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!header.classList.contains('open')));
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Gallery filters
  const chips = document.querySelectorAll('.chip');
  const items = [...document.querySelectorAll('.gallery figure')];
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    items.forEach((item) => { item.hidden = filter !== 'all' && item.dataset.cat !== filter; });
  }));

  // Lightbox
  const lightbox = document.querySelector('.lightbox');
  const lbImg = lightbox.querySelector('img');
  const lbCap = lightbox.querySelector('.lb-cap');
  const visible = () => items.filter((item) => !item.hidden);
  let current = 0;

  const show = (i) => {
    const list = visible();
    current = (i + list.length) % list.length;
    const img = list[current].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = list[current].querySelector('figcaption').textContent;
  };

  items.forEach((item) => item.querySelector('button').addEventListener('click', () => {
    show(visible().indexOf(item));
    lightbox.showModal();
  }));
  lightbox.querySelector('.lb-close').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  lightbox.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', (e) => {
    const step = document.documentElement.dir === 'rtl' ? -1 : 1;
    if (e.key === 'ArrowRight') show(current + step);
    if (e.key === 'ArrowLeft') show(current - step);
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
