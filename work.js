/* ==========================================================================
   WORK ARCHIVE — renders every project from projects.js into three
   views (grid / index / timeline), handles filters, open slots, and the
   project viewer dialog. Deep links: WorkSample.html#<project-id> opens a
   project; ?view=index|timeline picks a view; #experiments filters the lab.
   ========================================================================== */
(() => {
  'use strict';
  const d = document;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const PROJECTS = window.PROJECTS || [];
  const SITE = window.SITE || { openSlots: 2 };
  const byId = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGallery = p => (p.media && p.media.length) || (p.images && p.images.length) || p.live;
  const dotClass = t => t === 'gold' ? ' dot--gold' : t === 'ember' ? ' dot--ember' : '';
  const chip = p => `<span class="chip chip--${esc(p.tone || 'gold')} status"><i class="dot${dotClass(p.tone)}"></i>${esc(p.status)}</span>`;
  const CATS = [['all', 'All work'], ['game', 'Games'], ['web', 'Web'], ['experiment', 'Experiments'], ['concept', 'Concepts']];

  /* ------------------------------------------------------------- grid */
  const grid = $('#projectGrid'), index = $('#projectIndex'), timeline = $('#projectTimeline');
  const slotsTotal = Math.max(0, SITE.openSlots | 0);
  const cardHTML = (p, i) => {
    const primary = p.page
      ? `<a class="card__cover-link" href="${esc(p.page)}" data-cursor="Explore" aria-label="${esc(p.title)} — open the project"></a>`
      : `<button class="card__cover-link" type="button" data-open="${esc(p.id)}" data-cursor="View" aria-label="${esc(p.title)} — open project viewer" aria-haspopup="dialog"></button>`;
    const media = p.art === 'ai'
      ? `<div class="card__art"><span class="ai-glyph" aria-hidden="true">[ <i>✳</i> ]</span></div>`
      : `<img src="${esc(p.size === 'xl' ? (p.cover || p.thumb) : (p.thumb || p.cover))}" alt="${esc(p.coverAlt || p.title)}" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async" style="object-position:${esc(p.focus || '50% 50%')}">`;
    const actions = [];
    if (p.page) actions.push(`<a class="link" href="${esc(p.page)}">Explore project <span class="arr">↗</span></a>`);
    if (hasGallery(p)) actions.push(`<button class="link link--gold" type="button" data-open="${esc(p.id)}" aria-haspopup="dialog">${p.live && !(p.media || p.images) ? (p.interactive ? 'Play in viewer' : 'Live preview') : 'Media gallery'}</button>`);
    return `
      <article class="card${p.size === 'xl' ? ' card--xl' : ''}" data-cats="${esc((p.categories || []).join(' '))}" data-id="${esc(p.id)}" data-reveal data-d="${(i % 3) * 90}">
        ${primary}
        <div class="card__media">${media}<div class="card__top"><span class="card__num">${pad(i + 1)}</span>${chip(p)}</div></div>
        <div class="card__body">
          <div class="card__row"><span class="card__type">${esc(p.discipline)}</span><span class="card__year">${esc(p.year)}</span></div>
          <h3 class="card__title">${esc(p.title)}</h3>
          <p class="card__summary">${esc(p.summary)}</p>
          ${p.size === 'xl' ? `<div class="tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
          ${p.note ? `<p class="disclose">${esc(p.note)}</p>` : ''}
          ${actions.length ? `<div class="card__actions">${actions.join('')}</div>` : ''}
        </div>
      </article>`;
  };
  const slotHTML = (n, k) => `
      <article class="card card--slot" data-cats="slot" data-reveal data-d="${k * 90}">
        <div class="card__media"><span class="slot-big" aria-hidden="true">${pad(n)}</span></div>
        <div class="card__body">
          <div class="card__row"><span class="card__type">Open slot · Reserved</span><span class="card__year">Soon</span></div>
          <h3 class="card__title">Next project loading<span class="caret" aria-hidden="true"></span></h3>
          <p class="card__summary">This slot is saved for whatever I build next. Check back — or bring me the idea.</p>
          <div class="loadbar" aria-hidden="true"><div class="loadbar__track"><i></i></div><span><em>Compiling</em><em>${pad(n)} / ${pad(PROJECTS.length + slotsTotal)}</em></span></div>
          <div class="card__actions"><a class="link" href="Contact.html">Have an idea? Let’s talk <span class="arr">↗</span></a></div>
        </div>
      </article>`;
  if (grid) {
    grid.innerHTML = PROJECTS.map(cardHTML).join('') + Array.from({ length: slotsTotal }, (_, k) => slotHTML(PROJECTS.length + k + 1, k)).join('');
    // Reveal newly rendered cards (the engine's observer has already run).
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.style.setProperty('--d', e.target.dataset.d || 0); e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' }) : null;
    $$('[data-reveal]', grid).forEach(el => io ? io.observe(el) : el.classList.add('is-in'));
  }

  /* ------------------------------------------------------------- index */
  if (index) {
    index.innerHTML = `<div class="index-head" aria-hidden="true"><span>No.</span><span>Project</span><span class="col-type">Discipline</span><span>Year</span><span class="col-status">Status</span><span class="col-arrow"></span></div>` +
      PROJECTS.map((p, i) => {
        const tag = p.page ? `a href="${esc(p.page)}"` : `button type="button" data-open="${esc(p.id)}" aria-haspopup="dialog"`;
        const close = p.page ? 'a' : 'button';
        return `<${tag} class="index-row" data-cats="${esc((p.categories || []).join(' '))}" data-preview="${esc(p.thumb || p.cover || '')}" style="width:100%;text-align:left"><span class="index-row__num">${pad(i + 1)}</span><span class="index-row__title">${esc(p.title)}</span><span class="index-row__type">${esc(p.discipline)}</span><span class="index-row__year">${esc(p.year)}</span><span class="index-row__status">${chip(p)}</span><span class="index-row__arrow" aria-hidden="true">→</span></${close}>`;
      }).join('') +
      Array.from({ length: slotsTotal }, (_, k) => `<div class="index-row" data-cats="slot" aria-label="Open slot"><span class="index-row__num">${pad(PROJECTS.length + k + 1)}</span><span class="index-row__title" style="color:var(--faint)">Reserved slot<span class="caret" style="display:inline-block;width:.08em;height:.8em;background:var(--gold);margin-left:.1em;animation:blink 1s steps(1) infinite"></span></span><span class="index-row__type">Next project</span><span class="index-row__year">Soon</span><span class="index-row__status"><span class="chip">Loading</span></span><span class="index-row__arrow"></span></div>`).join('');
    const preview = d.createElement('div'); preview.className = 'hover-preview'; preview.setAttribute('aria-hidden', 'true'); preview.innerHTML = '<img alt="">';
    d.body.append(preview);
    const pimg = $('img', preview);
    let px = 0, py = 0, tx = 0, ty = 0, raf = 0;
    const follow = () => { tx += (px - tx) * .16; ty += (py - ty) * .16; preview.style.left = `${tx}px`; preview.style.top = `${ty}px`; raf = requestAnimationFrame(follow); };
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      index.addEventListener('pointermove', e => { px = e.clientX + 40; py = e.clientY; if (!raf) { tx = px; ty = py; follow(); } });
      index.addEventListener('pointerover', e => {
        const row = e.target.closest('.index-row[data-preview]');
        if (row && row.dataset.preview) { if (pimg.getAttribute('src') !== row.dataset.preview) pimg.src = row.dataset.preview; preview.classList.add('is-on'); }
        else preview.classList.remove('is-on');
      });
      index.addEventListener('pointerleave', () => { preview.classList.remove('is-on'); cancelAnimationFrame(raf); raf = 0; });
    }
  }

  /* ---------------------------------------------------------- timeline */
  if (timeline) {
    const items = PROJECTS.filter(p => p.timeline).sort((a, b) => a.timeline - b.timeline);
    const nowIndex = items.findIndex(p => /^Now/.test(p.era || ''));
    timeline.innerHTML = `<ol class="timeline">` + items.map((p, i) => {
      const phase = i < nowIndex ? 'Then' : i === nowIndex ? 'Now' : 'Next';
      const tag = p.page ? `a href="${esc(p.page)}"` : `button type="button" data-open="${esc(p.id)}" aria-haspopup="dialog"`;
      return `<li class="tl-item${i === nowIndex ? ' tl-item--now' : ''}" data-reveal data-d="${i * 40}"><span class="tl-item__num">${pad(i + 1)}</span><span class="tl-item__node" aria-hidden="true"></span><${tag} class="tl-item__body" style="width:100%"><span class="eyebrow eyebrow--plain"><b>${phase}</b> · ${esc(p.era || '')}</span><h3>${esc(p.title)} <span aria-hidden="true" style="color:var(--gold)">↗</span></h3><p>${esc(p.timelineCopy || p.summary)}</p></${p.page ? 'a' : 'button'}></li>`;
    }).join('') + `</ol>`;
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.style.setProperty('--d', e.target.dataset.d || 0); e.target.classList.add('is-in'); io.unobserve(e.target); } })) : null;
    $$('[data-reveal]', timeline).forEach(el => io ? io.observe(el) : el.classList.add('is-in'));
  }

  /* ------------------------------------------------- filters & views */
  const filterBar = $('#filters'), viewBar = $('#views');
  let filter = 'all', view = 'grid';
  if (filterBar) {
    filterBar.innerHTML = CATS.map(([k, label]) => {
      const n = k === 'all' ? PROJECTS.length : PROJECTS.filter(p => (p.categories || []).includes(k)).length;
      return `<button type="button" class="filter" data-filter="${k}" aria-pressed="${k === 'all'}">${label} <sup>${pad(n)}</sup></button>`;
    }).join('');
  }
  const applyFilter = () => {
    $$('[data-cats]', grid).concat($$('[data-cats]', index || d.createElement('div'))).forEach(el => {
      const cats = el.dataset.cats.split(' ');
      el.hidden = !(filter === 'all' || cats.includes(filter) || (cats.includes('slot') && filter === 'all'));
    });
    $$('.filter', filterBar).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    const status = $('#filterStatus');
    if (status) status.textContent = `${PROJECTS.filter(p => filter === 'all' || (p.categories || []).includes(filter)).length} projects shown`;
    dispatchEvent(new Event('resize'));
  };
  const transition = fn => (d.startViewTransition && !reduced) ? d.startViewTransition(fn) : fn();
  filterBar?.addEventListener('click', e => {
    const b = e.target.closest('[data-filter]'); if (!b || b.dataset.filter === filter) return;
    filter = b.dataset.filter; transition(applyFilter);
  });
  const setView = (v, push = true) => {
    view = ['grid', 'index', 'timeline'].includes(v) ? v : 'grid';
    grid.hidden = view !== 'grid'; if (index) index.hidden = view !== 'index'; if (timeline) timeline.hidden = view !== 'timeline';
    if (filterBar) filterBar.style.visibility = view === 'timeline' ? 'hidden' : '';
    $$('.view-btn', viewBar).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    if (push) { const u = new URL(location.href); view === 'grid' ? u.searchParams.delete('view') : u.searchParams.set('view', view); history.replaceState(null, '', u); }
    dispatchEvent(new Event('resize'));
  };
  viewBar?.addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) transition(() => setView(b.dataset.view)); });
  setView(new URLSearchParams(location.search).get('view') || 'grid', false);
  if (location.hash === '#experiments') { filter = 'experiment'; applyFilter(); }

  /* ------------------------------------------------------------- viewer */
  const modal = $('#projectModal');
  if (!modal) return;
  const mMedia = $('#modalMedia'), closeBtn = $('.modal__close', modal);
  let items = [], at = 0, active = null, prevFocus = null;
  const el = (tag, cls, text) => { const n = d.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
  const show = i => {
    at = (i + items.length) % items.length;
    const it = items[at], stage = $('.modal__stage', mMedia);
    stage.querySelector('video')?.pause();
    const m = el(it.type === 'video' ? 'video' : 'img');
    if (it.type === 'video') { m.controls = true; m.playsInline = true; m.preload = 'metadata'; if (it.poster) m.poster = it.poster; m.setAttribute('aria-label', it.alt); }
    else { m.alt = it.alt; m.decoding = 'async'; }
    m.addEventListener('error', () => { if (stage.contains(m)) stage.append(el('p', 'modal__caption', 'This media could not load. Try another item.')); });
    m.src = it.src; stage.replaceChildren(m);
    const counter = $('.modal__counter', mMedia); if (counter) counter.textContent = `${pad(at + 1)} / ${pad(items.length)}`;
    const cap = $('.modal__caption', mMedia); if (cap) cap.textContent = it.alt;
    $$('.modal__thumb', mMedia).forEach((b, k) => b.setAttribute('aria-pressed', String(k === at)));
    const sel = $('.modal__thumb[aria-pressed="true"]', mMedia);
    if (sel) { const strip = sel.parentElement; strip.scrollLeft = sel.offsetLeft - strip.offsetLeft - (strip.clientWidth - sel.clientWidth) / 2; }
  };
  const renderMedia = p => {
    mMedia.replaceChildren();
    const stage = el('div', 'modal__stage');
    mMedia.append(stage);
    items = p.media || (p.images || []).map((src, i) => ({ type: 'image', src, alt: `${p.title} — screenshot ${i + 1}` }));
    if (items.length) {
      if (items.length > 1) {
        const bar = el('div', 'modal__gallery');
        const prev = el('button', 'modal__arrow', '←'); prev.type = 'button'; prev.setAttribute('aria-label', 'Previous media'); prev.onclick = () => show(at - 1);
        const next = el('button', 'modal__arrow', '→'); next.type = 'button'; next.setAttribute('aria-label', 'Next media'); next.onclick = () => show(at + 1);
        const thumbs = el('div', 'modal__thumbs'); thumbs.setAttribute('role', 'group'); thumbs.setAttribute('aria-label', 'Media thumbnails'); thumbs.setAttribute('data-lenis-prevent', '');
        items.forEach((it, k) => {
          const b = el('button', 'modal__thumb'); b.type = 'button'; b.title = it.alt; b.setAttribute('aria-label', `Show ${it.type === 'video' ? 'video' : 'image'} ${k + 1}: ${it.alt}`);
          const t = el('img'); t.loading = 'lazy'; t.alt = '';
          t.src = it.thumbnail || it.poster || (it.src.startsWith('Images/portfolio-projects/') ? it.src.replace('Images/portfolio-projects/', 'Images/optimized/').replace('.webp', '-800.webp') : it.src);
          t.onerror = () => { t.onerror = null; t.src = it.poster || it.src; };
          b.append(t); if (it.type === 'video') b.append(el('span', 'play', '▶'));
          b.onclick = () => show(k); thumbs.append(b);
        });
        const counter = el('span', 'modal__counter'); counter.setAttribute('aria-live', 'polite');
        bar.append(prev, thumbs, next, counter); mMedia.append(bar);
      }
      mMedia.append(el('p', 'modal__caption', ''));
      show(0);
    } else if (p.live) {
      const f = el('iframe'); f.title = `${p.title} — ${p.interactive ? 'playable game' : 'live website preview'}`; f.src = p.live;
      f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox');
      f.addEventListener('load', () => { try { f.contentDocument?.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); close(); } }); } catch { /* cross-origin */ } });
      stage.append(f);
      mMedia.append(el('p', 'modal__caption', p.interactive ? 'Click the game to focus · Arrow keys / WASD · Touch controls' : (p.mediaNote || 'Live preview · Scroll inside, or open the full project.')));
    }
  };
  const open = (id, trigger) => {
    const p = byId[id]; if (!p) return;
    prevFocus = trigger || d.activeElement; active = id;
    $('#modalTitle').textContent = p.title;
    $('#modalType').textContent = p.modalType || p.discipline;
    $('#modalStatus').innerHTML = chip({ tone: p.tone, status: p.modalStatus || p.status });
    $('#modalDescription').textContent = p.description || p.summary;
    $('#modalDetails').replaceChildren(...(p.details || []).map(([k, v]) => { const w = el('div'); w.append(el('dt', '', k), el('dd', '', v)); return w; }));
    const actions = $('#modalActions');
    const links = (p.links || []).map(([label, url, primary]) => { const a = el('a', primary ? 'btn btn--sm' : 'btn btn--sm btn--ghost'); a.href = url; if (/^https?:/.test(url)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } a.innerHTML = `${esc(label)} <span class="btn__icon"><i>↗</i><i>↗</i></span>`; return a; });
    if (p.page) { const a = el('a', 'btn btn--sm btn--gold'); a.href = p.page; a.innerHTML = `Read the case study <span class="btn__icon"><i>↗</i><i>↗</i></span>`; links.unshift(a); }
    actions.replaceChildren(...links);
    renderMedia(p);
    d.body.classList.add('modal-open'); window.Studio?.stopScroll();
    if (!modal.open) modal.showModal();
    $('.modal__content', modal).scrollTop = 0;
    closeBtn.focus({ preventScroll: true });
    if (location.hash.slice(1) !== id) history.replaceState(null, '', `${location.pathname}${location.search}#${id}`);
  };
  const cleanup = () => {
    if (!active) return;
    mMedia.querySelector('video')?.pause(); mMedia.replaceChildren();
    d.body.classList.remove('modal-open'); window.Studio?.startScroll();
    if (location.hash.slice(1) === active) history.replaceState(null, '', location.pathname + location.search);
    active = null; prevFocus?.focus({ preventScroll: true }); prevFocus = null;
  };
  function close() { if (modal.open) modal.close(); cleanup(); }
  closeBtn.addEventListener('click', close);
  modal.addEventListener('cancel', e => { e.preventDefault(); close(); });
  modal.addEventListener('close', () => { if (!modal.open) cleanup(); });
  let downOutside = false;
  const outside = e => { const r = modal.getBoundingClientRect(); return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom; };
  modal.addEventListener('pointerdown', e => { downOutside = outside(e); });
  modal.addEventListener('click', e => { if (downOutside && outside(e)) close(); });
  modal.addEventListener('keydown', e => {
    if (items.length > 1 && !e.target.closest('video') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); show(at + (e.key === 'ArrowRight' ? 1 : -1)); }
  });
  d.addEventListener('click', e => { const t = e.target.closest('[data-open]'); if (t) { e.preventDefault(); open(t.dataset.open, t); } });
  addEventListener('hashchange', () => { const id = location.hash.slice(1); if (byId[id] && hasGallery(byId[id])) open(id); });
  addEventListener('pageshow', e => { if (e.persisted) close(); });
  const first = location.hash.slice(1);
  if (byId[first] && hasGallery(byId[first])) setTimeout(() => open(first), 300);
})();
