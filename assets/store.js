(() => {
  const data = window.SPOTON_GIFTS;
  const grid = document.querySelector('.products');
  if (!data || !grid) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STORAGE_KEY = 'spoton-gifts-cart';

  const ICONS = {
    pen: '<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z"/><path d="M14.5 6.5l3 3"/>',
    mug: '<path d="M4 8h11v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"/><path d="M15 10h1.5a2.5 2.5 0 0 1 0 5H15"/><path d="M7.5 3.5v2M10.5 3.5v2"/>',
    tumbler: '<path d="M8 3h8v3l1 2v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8l1-2Z"/><path d="M7 11h10"/>',
    cup: '<path d="M6.5 8h11l-1.4 12.2a1 1 0 0 1-1 .8H8.9a1 1 0 0 1-1-.8Z"/><path d="M5 5h14v3H5Z"/><path d="M9 5l.8-2h4.4L15 5"/>',
    bottle: '<path d="M10 2h4v3h-4Z"/><path d="M9 5h6l1 3v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8Z"/><path d="M8 12h8"/>',
    notebook: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 3v18M12 8h4M12 11h4"/>',
    planner: '<rect x="4" y="4" width="16" height="17" rx="1.5"/><path d="M4 9h16M8 2v4M16 2v4M8 13h2M12 13h2M16 13h.01M8 17h2M12 17h2"/>',
    tote: '<path d="M5 8h14l-1 13H6Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    backpack: '<path d="M6 9a6 6 0 0 1 12 0v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z"/><path d="M9 4.5V3h6v1.5M9 14h6v4H9Z"/>',
    tshirt: '<path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0Z"/>',
    cap: '<path d="M4 15a8 8 0 0 1 16 0"/><path d="M4 15h9c4 0 7 1 8 3H4Z"/><path d="M12 6.5v.01"/>',
    powerbank: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="m12.5 8-2 4h3l-2 4"/>',
    usb: '<rect x="8" y="9" width="8" height="12" rx="1.5"/><path d="M9.5 9V3h5v6M11 5.5h.01M13 5.5h.01"/>',
    keychain: '<circle cx="8" cy="8" r="4"/><path d="m11 11 8 8M16 16l2-2M18.5 18.5 20 17"/>',
    lanyard: '<path d="m7 3 5 10 5-10"/><rect x="8" y="13" width="8" height="8" rx="1"/><path d="M10 17h4"/>',
    umbrella: '<path d="M3 12a9 9 0 0 1 18 0Z"/><path d="M12 3V2M12 12v7a2 2 0 0 1-4 0"/>',
    giftbox: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8S10.5 3.5 8 4.5 9.5 8 12 8Zm0 0s1.5-4.5 4-3.5S14.5 8 12 8Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    bag: '<path d="M5 8h14l-1 13H6Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'
  };
  const icon = (key, cls = '') => `<svg viewBox="0 0 24 24" class="ico ${cls}" aria-hidden="true">${ICONS[key] || ICONS.giftbox}</svg>`;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const norm = (s) => String(s).toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  const toLatinDigits = (s) => String(s).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const catName = (id) => (data.categories.find((c) => c.id === id) || {}).name || '';
  const products = new Map(data.products.map((p) => [p.id, p]));
  const stepFor = (p) => (p.min >= 100 ? 50 : 10);
  const media = (p) => (p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : icon(p.icon, 'product-ico'));

  /* ---------- Catalog ---------- */
  const chips = $('.store-chips');
  const counts = data.categories.map((c) => data.products.filter((p) => p.cat === c.id).length);
  chips.innerHTML = [`<button class="chip" type="button" data-filter="all" aria-pressed="true">الكل<sup>${pad(data.products.length)}</sup></button>`]
    .concat(data.categories.map((c, i) => `<button class="chip" type="button" data-filter="${c.id}" aria-pressed="false">${esc(c.name)}<sup>${pad(counts[i])}</sup></button>`))
    .join('');

  grid.innerHTML = data.products.map((p) => `
    <article class="product" data-id="${p.id}">
      <button class="product-media" type="button" data-open="${p.id}" aria-label="تفاصيل ${esc(p.name)}">
        ${media(p)}
        <span class="product-cat">${esc(catName(p.cat))}</span>
      </button>
      <div class="product-body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="product-meta">
          <span class="swatches">${p.colors.map((c) => `<span style="--c:${c.hex}" title="${esc(c.name)}"></span>`).join('')}</span>
          <span>الحد الأدنى <b>${p.min}</b> قطعة</span>
        </div>
        <button class="btn btn-sm product-add" type="button" data-open="${p.id}">${icon('plus')}أضف للطلب</button>
      </div>
    </article>`).join('');

  const searchInput = $('.search input');
  const empty = $('.store-empty');
  const resultCount = $('.result-count b');
  let filter = 'all';

  const applyFilter = () => {
    const q = norm(searchInput.value.trim());
    let shown = 0;
    $$('.product', grid).forEach((el) => {
      const p = products.get(el.dataset.id);
      const visible = (filter === 'all' || p.cat === filter)
        && (!q || norm(`${p.name} ${p.desc} ${catName(p.cat)}`).includes(q));
      el.hidden = !visible;
      if (visible && !reduceMotion) {
        el.style.setProperty('--i', shown % 8);
        el.classList.remove('pop');
        void el.offsetWidth;
        el.classList.add('pop');
      }
      if (visible) shown++;
    });
    empty.hidden = shown > 0;
    resultCount.textContent = shown;
  };

  chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    filter = chip.dataset.filter;
    $$('.chip', chips).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    applyFilter();
  });
  searchInput.addEventListener('input', applyFilter);
  applyFilter();

  /* ---------- Cart state ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').filter((it) => products.has(it.id)); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } };
  const totalItems = () => cart.length;

  /* ---------- Overlays (modal + drawer) ---------- */
  let lastFocus = null;
  const openLayer = (el) => {
    lastFocus = document.activeElement;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => $('[data-autofocus]', el)?.focus(), 80);
  };
  const closeLayer = (el) => {
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    if (!$('.modal.open, .drawer.open')) document.body.classList.remove('no-scroll');
    lastFocus?.focus?.();
  };
  const trapFocus = (el, e) => {
    const f = $$('button, input, textarea, select, a[href]', el).filter((x) => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  };

  /* ---------- Product modal ---------- */
  const modal = $('.modal');
  const form = $('.modal-body', modal);
  const qtyInput = $('#pm-qty');
  const qtyError = $('.pm-error', modal);
  let current = null;

  const openProduct = (id) => {
    const p = products.get(id);
    if (!p) return;
    current = p;
    $('.modal-media', modal).innerHTML = media(p);
    $('.pm-cat', modal).textContent = catName(p.cat);
    $('#pm-title').textContent = p.name;
    $('.pm-desc', modal).textContent = p.desc;
    $('.pm-min', modal).textContent = `(الحد الأدنى ${p.min} قطعة)`;
    $('.opt-colors', modal).innerHTML = p.colors.map((c, i) => `
      <label class="radio"><input type="radio" name="color" value="${esc(c.name)}" ${i === 0 ? 'checked' : ''}><span><i style="--c:${c.hex}"></i>${esc(c.name)}</span></label>`).join('');
    $('.opt-prints', modal).innerHTML = p.prints.map((pr, i) => `
      <label class="radio"><input type="radio" name="print" value="${esc(pr)}" ${i === 0 ? 'checked' : ''}><span>${esc(pr)}</span></label>`).join('');
    qtyInput.min = p.min;
    qtyInput.step = stepFor(p);
    qtyInput.value = p.min;
    qtyInput.removeAttribute('aria-invalid');
    qtyError.hidden = true;
    $('#pm-notes').value = '';
    openLayer(modal);
  };

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) openProduct(opener.dataset.open);
  });
  $$('[data-close]', modal).forEach((b) => b.addEventListener('click', () => closeLayer(modal)));
  $$('.qty [data-step]', modal).forEach((b) => b.addEventListener('click', () => {
    const step = Number(qtyInput.step) * Number(b.dataset.step);
    const next = (Number(toLatinDigits(qtyInput.value)) || current.min) + step;
    qtyInput.value = Math.max(current.min, next);
    qtyInput.removeAttribute('aria-invalid');
    qtyError.hidden = true;
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const qty = Math.round(Number(toLatinDigits(qtyInput.value)));
    if (!qty || qty < current.min) {
      qtyInput.setAttribute('aria-invalid', 'true');
      qtyError.textContent = `الحد الأدنى لهذا المنتج ${current.min} قطعة.`;
      qtyError.hidden = false;
      qtyInput.focus();
      return;
    }
    const color = form.elements.color.value;
    const print = form.elements.print.value;
    const notes = $('#pm-notes').value.trim();
    const key = `${current.id}|${color}|${print}`;
    const existing = cart.find((it) => it.key === key);
    if (existing) {
      existing.qty += qty;
      if (notes) existing.notes = [existing.notes, notes].filter(Boolean).join(' — ');
    } else {
      cart.push({ key, id: current.id, color, print, qty, notes });
    }
    save();
    renderCart(true);
    closeLayer(modal);
    toast(`أُضيف «${current.name}» إلى طلبك`);
  });

  /* ---------- Cart drawer ---------- */
  const drawer = $('.drawer');
  const list = $('.cart-list', drawer);
  const cartEmpty = $('.cart-empty', drawer);
  const cartForm = $('#cart-form');
  const formError = $('.form-error', drawer);
  const sentNote = $('.sent-note', drawer);
  const badges = $$('.badge');
  const cartSide = $('.cart-side');

  const renderCart = (bump = false) => {
    const n = totalItems();
    badges.forEach((b) => {
      b.textContent = n;
      b.classList.toggle('show', n > 0);
      if (bump && n > 0) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    });
    cartSide?.classList.toggle('has-items', n > 0);
    $('.drawer-count', drawer).textContent = n ? `(${n})` : '';
    cartEmpty.hidden = n > 0;
    cartForm.hidden = n === 0;
    $$('.drawer-foot .btn', drawer).forEach((b) => { b.disabled = n === 0; });
    list.innerHTML = cart.map((it, i) => {
      const p = products.get(it.id);
      return `
        <li class="cart-item" data-index="${i}">
          <span class="cart-thumb">${icon(p.icon)}</span>
          <span class="cart-info"><b>${esc(p.name)}</b><small>${esc(it.color)} · ${esc(it.print)}</small>${it.notes ? `<small>${esc(it.notes)}</small>` : ''}</span>
          <span class="cart-actions">
            <span class="qty"><button type="button" data-cstep="-1" aria-label="إنقاص">−</button><input type="number" value="${it.qty}" min="${p.min}" aria-label="الكمية"><button type="button" data-cstep="1" aria-label="زيادة">+</button></span>
            <button class="cart-remove" type="button" data-remove>حذف</button>
          </span>
        </li>`;
    }).join('');
  };

  list.addEventListener('click', (e) => {
    const row = e.target.closest('.cart-item');
    if (!row) return;
    const it = cart[Number(row.dataset.index)];
    const p = products.get(it.id);
    if (e.target.closest('[data-remove]')) {
      cart.splice(Number(row.dataset.index), 1);
    } else if (e.target.closest('[data-cstep]')) {
      it.qty = Math.max(p.min, it.qty + stepFor(p) * Number(e.target.closest('[data-cstep]').dataset.cstep));
    } else {
      return;
    }
    save();
    renderCart();
  });
  list.addEventListener('change', (e) => {
    const input = e.target.closest('input');
    if (!input) return;
    const it = cart[Number(input.closest('.cart-item').dataset.index)];
    const p = products.get(it.id);
    it.qty = Math.max(p.min, Math.round(Number(toLatinDigits(input.value))) || p.min);
    save();
    renderCart();
  });

  $$('[data-cart]').forEach((b) => b.addEventListener('click', () => {
    sentNote.hidden = true;
    openLayer(drawer);
  }));
  $$('[data-close-drawer]', drawer).forEach((b) => b.addEventListener('click', () => closeLayer(drawer)));

  document.addEventListener('keydown', (e) => {
    const layer = $('.modal.open') || $('.drawer.open');
    if (!layer) return;
    if (e.key === 'Escape') closeLayer(layer);
    if (e.key === 'Tab') trapFocus(layer, e);
  });

  /* ---------- Send order ---------- */
  const readForm = () => {
    const f = Object.fromEntries(new FormData(cartForm).entries());
    Object.keys(f).forEach((k) => { f[k] = String(f[k]).trim(); });
    f.phone = toLatinDigits(f.phone || '');
    return f;
  };
  const validate = (f) => {
    const problems = [];
    $$('input', cartForm).forEach((i) => i.removeAttribute('aria-invalid'));
    if (!f.name) { problems.push('الاسم'); $('#cf-name').setAttribute('aria-invalid', 'true'); }
    if (!/^\+?[0-9\s-]{9,15}$/.test(f.phone)) { problems.push('رقم جوال صحيح'); $('#cf-phone').setAttribute('aria-invalid', 'true'); }
    if (problems.length) {
      formError.textContent = `فضلًا أدخل: ${problems.join('، ')}.`;
      formError.hidden = false;
      $('[aria-invalid="true"]', cartForm)?.focus();
      return false;
    }
    formError.hidden = true;
    return true;
  };
  const buildMessage = (f) => {
    const lines = ['طلب عرض سعر — هدايا دعائية', ''];
    cart.forEach((it, i) => {
      const p = products.get(it.id);
      lines.push(`${i + 1}) ${p.name}`);
      lines.push(`   الكمية: ${it.qty} | اللون: ${it.color} | الشعار: ${it.print}`);
      if (it.notes) lines.push(`   ملاحظات: ${it.notes}`);
    });
    lines.push('', `الاسم: ${f.name}`);
    if (f.company) lines.push(`الجهة: ${f.company}`);
    lines.push(`الجوال: ${f.phone}`);
    if (f.city) lines.push(`المدينة: ${f.city}`);
    if (f.date) lines.push(`موعد الاحتياج: ${f.date}`);
    if (f.notes) lines.push(`ملاحظات: ${f.notes}`);
    lines.push('', 'سأرفق الشعار في هذه المحادثة.');
    return lines.join('\n');
  };
  const send = (channel) => {
    if (!cart.length) return;
    const f = readForm();
    if (!validate(f)) return;
    const msg = buildMessage(f);
    if (channel === 'email') {
      window.location.href = `mailto:${data.email}?subject=${encodeURIComponent('طلب عرض سعر — هدايا دعائية')}&body=${encodeURIComponent(msg)}`;
    } else {
      window.open(`https://wa.me/${data.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    }
    sentNote.hidden = false;
    sentNote.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  cartForm.addEventListener('submit', (e) => { e.preventDefault(); send('whatsapp'); });
  $('[data-send="email"]', drawer).addEventListener('click', () => send('email'));
  $('[data-clear]', drawer).addEventListener('click', () => {
    cart = [];
    save();
    renderCart();
    sentNote.hidden = true;
  });

  /* ---------- Toast ---------- */
  const toastEl = $('.toast');
  let toastTimer;
  const toast = (text) => {
    $('.toast-text', toastEl).textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3800);
  };
  $('.toast [data-cart]', toastEl)?.addEventListener('click', () => toastEl.classList.remove('show'));

  renderCart();
})();
