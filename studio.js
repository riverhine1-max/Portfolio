/* ==========================================================================
   RIVER HINE — STUDIO MOTION ENGINE
   Vanilla JS. Every effect is progressive: content works without it, and
   prefers-reduced-motion / Save-Data turn the heavy parts off.
   ========================================================================== */
(() => {
  'use strict';
  const d = document, root = d.documentElement, body = d.body;
  root.classList.add('js');
  window.__studio = true;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const narrow = matchMedia('(max-width: 900px)');
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } }
  };
  const MARK = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 49V15h17q12 0 12 10T31 35H14m15 0 16 14M44 15v34M44 32h10M54 15v34" fill="none" stroke="#e9c37c" stroke-width="4" stroke-linejoin="round"/></svg>';

  /* ---------------------------------------------------------------- chrome */
  const chrome = d.createElement('div');
  chrome.innerHTML = `<div class="grain" aria-hidden="true"></div><div class="vignette" aria-hidden="true"></div><div class="progress" aria-hidden="true"></div><div class="curtain" aria-hidden="true">${MARK}</div>`;
  body.append(...chrome.children);
  const progressBar = $('.progress'), curtain = $('.curtain');

  /* ------------------------------------------------------ data-driven work */
  const PROJECTS = (window.PROJECTS || []).slice();
  const SITE = window.SITE || { openSlots: 2 };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const statusChip = p => `<span class="chip chip--${p.tone || 'gold'} status"><i class="dot${p.tone === 'gold' ? ' dot--gold' : p.tone === 'ember' ? ' dot--ember' : ''}"></i>${esc(p.status)}</span>`;
  $$('[data-project-count]').forEach(el => { el.dataset.count = PROJECTS.length; if (!reduced) el.textContent = '00'; else el.textContent = String(PROJECTS.length).padStart(2, '0'); });
  $$('[data-slot-count]').forEach(el => { el.textContent = String(SITE.openSlots || 0).padStart(2, '0'); });
  $$('[data-slot-next]').forEach(el => { el.textContent = String(PROJECTS.length + 1).padStart(2, '0'); });

  const reelTrack = $('[data-reel-track]');
  if (reelTrack && PROJECTS.length) {
    const featured = PROJECTS.filter(p => p.featured).sort((a, b) => a.featured - b.featured);
    const cards = featured.map((p, i) => `
      <a class="reel-card" href="${esc(p.page || 'WorkSample.html#' + p.id)}" data-cursor="${p.page ? 'Explore' : 'Open'}">
        <div class="reel-card__media">
          <img src="${esc(p.cover || p.thumb)}" alt="${esc(p.coverAlt || p.title)}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async" style="object-position:${esc(p.focus || '50% 50%')}">
          <div class="reel-card__top"><span class="reel-card__num">${String(i + 1).padStart(2, '0')} / ${String(featured.length + 1).padStart(2, '0')}</span>${statusChip(p)}</div>
          <div class="reel-card__overlay"><h3 class="reel-card__title">${esc(p.title)}</h3><span class="reel-card__go" aria-hidden="true">↗</span></div>
        </div>
        <div class="reel-card__meta"><span class="mono">${esc(p.discipline)}</span><p>${esc(p.summary)}</p><span class="reel-card__year">${esc(p.year)}</span></div>
      </a>`).join('');
    const total = PROJECTS.length, slots = SITE.openSlots || 0;
    reelTrack.innerHTML = cards + `
      <a class="reel-card reel-card--end" href="WorkSample.html" data-cursor="Archive">
        <div class="reel-end">
          <span class="eyebrow"><b>${String(featured.length + 1).padStart(2, '0')}</b> The full archive</span>
          <p class="reel-end__big">${String(total).padStart(2, '0')} projects<br><span class="serif">+ ${slots} open slot${slots === 1 ? '' : 's'}</span></p>
          <div class="loadbar"><div class="loadbar__track"><i></i></div><span><em>Next project loading</em><em>Enter →</em></span></div>
        </div>
      </a>`;
    $$('[data-reel-total]').forEach(el => { el.textContent = String(featured.length + 1).padStart(2, '0'); });
  }

  /* ------------------------------------------------------------ split text */
  function split(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    const mode = el.dataset.split === 'words' ? 'words' : 'chars';
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = d.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(d.createTextNode(' ')); return; }
            const mask = d.createElement('span'); mask.className = 'mask';
            if (mode === 'words') {
              const w = d.createElement('span'); w.className = 'wd'; w.style.setProperty('--i', i++); w.textContent = part; mask.append(w);
            } else {
              [...part].forEach(ch => { const c = d.createElement('span'); c.className = 'ch'; c.style.setProperty('--i', i++); c.textContent = ch; mask.append(c); });
            }
            frag.append(mask);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') walk(child);
      });
    };
    if (!el.hasAttribute('aria-label') && !el.closest('[aria-hidden="true"]')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    walk(el);
    if (el.dataset.d) el.style.setProperty('--d', el.dataset.d);
  }
  $$('[data-split]').forEach(split);
  $$('[data-reveal][data-d]').forEach(el => el.style.setProperty('--d', el.dataset.d));

  /* ---------------------------------------------------------------- reveal */
  const waiting = [];
  const revealIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      if (e.target.hasAttribute('data-wait') && !heroReleased) { waiting.push(e.target); } else e.target.classList.add('is-in');
      revealIO.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
  let heroReleased = false;
  function releaseHero() {
    if (heroReleased) return; heroReleased = true;
    waiting.splice(0).forEach(el => el.classList.add('is-in'));
    $$('[data-wait]').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('is-in'); });
    d.dispatchEvent(new Event('studio:ready'));
  }
  // A fully clipped element never "intersects", so clip reveals watch their parent.
  const clipIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return; e.target._clipKids.forEach(k => k.classList.add('is-in')); clipIO.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }) : null;
  $$('[data-reveal],[data-split]').forEach(el => {
    if (!revealIO) { el.classList.add('is-in'); return; }
    if (el.dataset.reveal === 'clip') { const p = el.parentElement; (p._clipKids = p._clipKids || []).push(el); clipIO.observe(p); }
    else revealIO.observe(el);
  });

  /* ---------------------------------------------------------------- loader */
  const loader = $('.loader');
  const cameFromTransition = store.get('rh-transition') === '1';
  store.set('rh-transition', '0');
  if (loader) {
    if (store.get('rh-loaded') || reduced) { loader.remove(); releaseHeroSoon(); }
    else {
      body.classList.add('is-loading');
      const count = $('.loader__count b', loader), bar = $('.loader__bar', loader);
      const start = performance.now(), min = 1700;
      let loaded = false; addEventListener('load', () => { loaded = true; }, { once: true });
      if (d.readyState === 'complete') loaded = true;
      const tick = now => {
        const t = clamp((now - start) / min, 0, 1);
        const target = loaded ? t : Math.min(t, .86);
        const eased = 1 - Math.pow(1 - target, 3);
        const n = Math.round(eased * 100);
        count.textContent = String(n).padStart(3, '0');
        bar.style.setProperty('--load', eased);
        if (n >= 100) {
          store.set('rh-loaded', '1');
          setTimeout(() => { loader.classList.add('is-done'); body.classList.remove('is-loading'); setTimeout(releaseHero, 350); setTimeout(() => loader.remove(), 1300); }, 180);
        } else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(() => { loaded = true; }, 5000); // never hold the page hostage
    }
  } else releaseHeroSoon();
  function releaseHeroSoon() { setTimeout(releaseHero, cameFromTransition ? 420 : 120); }

  /* ------------------------------------------------------ page transitions */
  if (cameFromTransition && !reduced && !loader) {
    curtain.classList.add('no-anim', 'is-in');
    requestAnimationFrame(() => requestAnimationFrame(() => { curtain.classList.remove('no-anim'); curtain.classList.add('is-out'); curtain.classList.remove('is-in'); setTimeout(() => curtain.classList.remove('is-out'), 1000); }));
  }
  addEventListener('pageshow', e => { if (e.persisted) { curtain.classList.remove('is-in', 'is-out'); root.classList.remove('menu-open'); } });
  d.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download') || a.dataset.noTransition !== undefined) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (!/(\.html?$|\/$)/.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.search === location.search) {
      if (url.hash) { e.preventDefault(); scrollToHash(url.hash); history.pushState(null, '', url.hash); }
      return;
    }
    if (reduced) return;
    e.preventDefault();
    store.set('rh-transition', '1');
    curtain.classList.remove('is-out'); curtain.classList.add('is-in');
    setTimeout(() => { location.href = url.href; }, 680);
  });

  /* ----------------------------------------------------------------- lenis */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.095, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.2 });
    window.__lenis = lenis;
  }
  function scrollToHash(hash) {
    const target = hash && hash.length > 1 ? d.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (!target) return;
    const offset = -(parseInt(getComputedStyle(root).getPropertyValue('--header-h')) || 78) - 8;
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    if (target.tabIndex < 0 && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) { target.setAttribute('tabindex', '-1'); }
    setTimeout(() => target.focus({ preventScroll: true }), 50);
  }
  d.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    if (!d.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))) return;
    e.preventDefault(); scrollToHash(a.getAttribute('href')); history.pushState(null, '', a.getAttribute('href'));
  });
  const stopScroll = () => lenis && lenis.stop();
  const startScroll = () => lenis && lenis.start();
  window.Studio = { stopScroll, startScroll, scrollToHash, get lenis() { return lenis; } };

  /* ---------------------------------------------------------- scroll loop */
  const handlers = [];
  const onScroll = fn => handlers.push(fn);
  let lastY = scrollY, velocity = 0, dir = 1;
  function frame(t) {
    if (lenis) lenis.raf(t);
    const y = lenis ? lenis.scroll : scrollY;
    const dy = y - lastY;
    velocity = lenis ? lenis.velocity : lerp(velocity, dy, .2);
    if (Math.abs(dy) > .3) dir = dy > 0 ? 1 : -1;
    for (const fn of handlers) fn(y, dy);
    lastY = y;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------------------------------------------------------------- header */
  const header = $('.site-header');
  let hideAcc = 0;
  onScroll((y, dy) => {
    const max = root.scrollHeight - innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
    if (!header || root.classList.contains('menu-open')) return;
    header.classList.toggle('is-scrolled', y > 40);
    hideAcc = clamp(hideAcc + dy, -120, 120);
    if (y < 160 || hideAcc < -40) header.classList.remove('is-hidden');
    else if (hideAcc > 60) header.classList.add('is-hidden');
    root.classList.toggle('header-visible', !header.classList.contains('is-hidden') && y > 40);
  });

  /* ------------------------------------------------------------------ menu */
  const menuBtn = $('.menu-btn'), menu = $('.menu');
  if (menuBtn && menu) {
    menuBtn.hidden = false;
    const setMenu = open => {
      root.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      $('.menu-btn__text', menuBtn).textContent = open ? 'Close' : 'Menu';
      menu.inert = !open; menu.setAttribute('aria-hidden', String(!open));
      open ? stopScroll() : startScroll();
      if (open) header.classList.remove('is-hidden');
    };
    setMenu(false);
    menuBtn.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); } });
    narrow.addEventListener('change', () => setMenu(false));
    menu.addEventListener('click', e => { if (e.target.closest('a')) setTimeout(() => setMenu(false), 500); });
  }

  /* ------------------------------------------------------ magnetic / tilt */
  if (fine && !reduced) {
    $$('[data-magnetic]').forEach(el => {
      const s = parseFloat(el.dataset.magnetic) || .35;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * s}px,${(e.clientY - r.top - r.height / 2) * s}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 10}deg`);
        el.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - .5) * -10}deg`);
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
    $$('.cred').forEach(el => el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--gx', `${e.clientX - r.left}px`); el.style.setProperty('--gy', `${e.clientY - r.top}px`);
    }));
  }

  /* -------------------------------------------------------------- scramble */
  const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFGHJKRSTX';
  $$('[data-scramble]').forEach(el => {
    const original = el.textContent; let raf = 0;
    el.setAttribute('aria-label', original);
    const run = () => {
      if (reduced) return;
      cancelAnimationFrame(raf);
      const start = performance.now(), dur = 520;
      const step = now => {
        const p = clamp((now - start) / dur, 0, 1), fixed = Math.floor(p * original.length);
        el.innerHTML = original.split('').map((c, i) => i < fixed || c === ' ' ? esc(c) : `<span class="scramble-char" aria-hidden="true">${esc(GLYPHS[(Math.random() * GLYPHS.length) | 0])}</span>`).join('');
        if (p < 1) raf = requestAnimationFrame(step); else el.textContent = original;
      };
      raf = requestAnimationFrame(step);
    };
    (el.closest('a,button') || el).addEventListener('pointerenter', run);
  });

  /* ------------------------------------------------------ clock / copy / year */
  const clocks = $$('[data-clock]');
  if (clocks.length) {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const tickClock = () => { const t = fmt.format(new Date()); clocks.forEach(c => { c.textContent = t; }); };
    tickClock(); setInterval(tickClock, 1000);
  }
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async e => {
    e.preventDefault();
    try { await navigator.clipboard.writeText(btn.dataset.copy); btn.dataset.copied = 'Copied to clipboard'; }
    catch { btn.dataset.copied = btn.dataset.copy; }
    setTimeout(() => btn.removeAttribute('data-copied'), 2000);
  }));
  $$('[data-to-top]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); lenis ? lenis.scrollTo(0, { duration: 1.8 }) : scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }));

  /* -------------------------------------------------------------- counters */
  const countIO = 'IntersectionObserver' in window && new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return; countIO.unobserve(e.target);
    const el = e.target, to = parseFloat(el.dataset.count), pad = parseInt(el.dataset.pad || '2', 10);
    if (reduced) { el.textContent = String(to).padStart(pad, '0'); return; }
    const start = performance.now(), dur = 1800;
    const step = now => { const p = clamp((now - start) / dur, 0, 1), v = Math.round(to * (1 - Math.pow(2, -10 * p))); el.textContent = String(p >= 1 ? to : v).padStart(pad, '0'); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .4 });
  $$('[data-count]').forEach(el => countIO ? countIO.observe(el) : (el.textContent = el.dataset.count));

  /* ------------------------------------------------------------------ hero */
  const hero = $('.hero');
  if (hero) {
    const inner = $('.hero__media-inner', hero), content = $('.hero__content', hero), video = $('video[data-src]', hero), toggle = $('[data-film-toggle]', hero);
    let heroVisible = true, userPaused = false;
    if (fine && !reduced) hero.addEventListener('pointermove', e => {
      inner.style.setProperty('--mx', `${(e.clientX / innerWidth - .5) * -2.4}%`);
      inner.style.setProperty('--my', `${(e.clientY / innerHeight - .5) * -2.4}%`);
    });
    onScroll(y => {
      const h = hero.offsetHeight, p = clamp(y / h, 0, 1);
      heroVisible = p < 1;
      if (reduced) return;
      hero.style.setProperty('--hp', p.toFixed(4));
      if (content) { content.style.transform = `translate3d(0,${p * -90}px,0)`; content.style.opacity = String(clamp(1 - p * 1.35, 0, 1)); }
    });
    if (video && !reduced && !saveData) {
      const startFilm = () => {
        video.src = video.dataset.src; video.load();
        video.addEventListener('canplay', () => { video.classList.add('is-ready'); if (!userPaused) video.play().catch(() => {}); }, { once: true });
      };
      d.readyState === 'complete' ? setTimeout(startFilm, 400) : addEventListener('load', () => setTimeout(startFilm, 400), { once: true });
      new IntersectionObserver(([e]) => { if (!video.src) return; e.isIntersecting && !userPaused ? video.play().catch(() => {}) : video.pause(); }).observe(hero);
      d.addEventListener('visibilitychange', () => { if (d.hidden) video.pause(); else if (heroVisible && !userPaused && video.src) video.play().catch(() => {}); });
      toggle?.addEventListener('click', () => {
        userPaused = !video.paused;
        userPaused ? video.pause() : video.play().catch(() => {});
        toggle.textContent = userPaused ? 'Play film' : 'Pause film';
        toggle.setAttribute('aria-pressed', String(userPaused));
      });
    } else if (toggle) toggle.hidden = true;

    /* Ember field: additive gold sparks drifting up through the portal light. */
    const canvas = $('.hero__embers', hero);
    if (canvas && !reduced) {
      const ctx = canvas.getContext('2d');
      let w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2), parts = [], px = -999, py = -999, running = true;
      const make = (fresh) => ({ x: Math.random() * w, y: fresh ? h + Math.random() * 40 : Math.random() * h, r: Math.random() * 1.7 + .35, vy: -(Math.random() * .55 + .18), vx: (Math.random() - .5) * .25, life: Math.random() * Math.PI * 2, a: Math.random() * .6 + .25 });
      const size = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); const n = Math.round(clamp(w * h / 14000, 30, 120)); parts = Array.from({ length: n }, () => make(false)); };
      size(); addEventListener('resize', size);
      hero.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; });
      hero.addEventListener('pointerleave', () => { px = py = -999; });
      new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) draw(); }).observe(hero);
      function draw() {
        if (!running || d.hidden) return;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        for (const p of parts) {
          p.life += .02; p.x += p.vx + Math.sin(p.life) * .22; p.y += p.vy;
          const dx = p.x - px, dy = p.y - py, dist = dx * dx + dy * dy;
          if (dist < 16000) { const f = (16000 - dist) / 16000; p.x += dx * .02 * f; p.y += dy * .02 * f; }
          if (p.y < -10 || p.x < -10 || p.x > w + 10) Object.assign(p, make(true));
          const flick = p.a * (.65 + Math.sin(p.life * 3) * .35);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          g.addColorStop(0, `rgba(255,226,160,${flick})`); g.addColorStop(.4, `rgba(233,170,90,${flick * .45})`); g.addColorStop(1, 'rgba(233,150,60,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();
        }
        requestAnimationFrame(draw);
      }
      d.addEventListener('visibilitychange', () => { if (!d.hidden && running) draw(); });
      draw();
    }
  }
  /* Cinematic page heroes get the same slow push-in. */
  $$('.cine-hero').forEach(h => onScroll(y => { if (!reduced) h.style.setProperty('--hp', clamp(y / h.offsetHeight, 0, 1).toFixed(4)); }));

  /* --------------------------------------------------------------- marquee */
  const marquees = $$('.marquee');
  if (marquees.length && !reduced) {
    const anims = marquees.map(m => ({ m, a: $('.marquee__track', m).getAnimations()[0], rate: 1 }));
    let skew = 0;
    onScroll(() => {
      const v = clamp(velocity, -60, 60);
      skew = lerp(skew, clamp(v * -.12, -7, 7), .12);
      anims.forEach(o => {
        o.m.style.setProperty('--skew', `${skew.toFixed(2)}deg`);
        if (!o.a) return;
        o.rate = lerp(o.rate, dir * (1 + Math.abs(v) / 9), .08);
        o.a.playbackRate = o.rate;
      });
    });
  }

  /* ------------------------------------------------ statement word lighting */
  $$('[data-light]').forEach(el => {
    const walk = node => [...node.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = d.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.append(d.createTextNode(' '));
          else { const s = d.createElement('span'); s.className = 'w' + (c.parentElement.classList.contains('gold') ? ' gold' : ''); s.textContent = part; frag.append(s); }
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) walk(c);
    });
    walk(el);
    const words = $$('.w', el);
    if (reduced) { words.forEach(w => w.classList.add('is-lit')); return; }
    onScroll(() => {
      const r = el.getBoundingClientRect();
      const p = clamp((innerHeight * .85 - r.top) / (r.height + innerHeight * .35), 0, 1);
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    });
  });

  /* ------------------------------------------------------------ project reel */
  const reel = $('.reel');
  if (reel) {
    const track = $('.reel__track', reel), bar = $('.reel__bar', reel), current = $('[data-reel-current]', reel);
    let dist = 0;
    const cards = () => $$('.reel-card', track);
    const measure = () => {
      if (narrow.matches) { reel.style.removeProperty('--reel-h'); track.style.transform = ''; return; }
      dist = Math.max(0, track.scrollWidth - innerWidth);
      reel.style.setProperty('--reel-h', `${dist + innerHeight}px`);
    };
    measure(); addEventListener('resize', measure); addEventListener('load', measure); narrow.addEventListener('change', measure);
    onScroll(() => {
      if (narrow.matches) return;
      const r = reel.getBoundingClientRect();
      const total = reel.offsetHeight - innerHeight;
      const p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
      if (r.bottom < 0 || r.top > innerHeight) return;
      track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
      bar && bar.style.setProperty('--rp', p.toFixed(4));
      const list = cards();
      if (current) current.textContent = String(Math.min(list.length, Math.floor(p * (list.length - .001)) + 1)).padStart(2, '0');
      if (!reduced) list.forEach(c => {
        const img = $('img', c); if (!img) return;
        const cr = c.getBoundingClientRect();
        const off = ((cr.left + cr.width / 2) - innerWidth / 2) / innerWidth;
        img.style.setProperty('--par', `${(off * -7).toFixed(2)}%`);
      });
    });
  }

  /* ------------------------------------------------------ flagship chapters */
  const chapters = $('.chapters');
  if (chapters) {
    const frames = $$('.chapters__frame', chapters), tabs = $$('.chapter-tab', chapters), caption = $('.chapters__caption', chapters);
    const film = $('.chapters__hero video', chapters), still = $('.chapters__hero img', chapters);
    const count = $('[data-chapter-count]', chapters);
    const data = tabs.map(t => ({ step: t.dataset.step, title: t.dataset.title, copy: t.dataset.copy, clip: t.dataset.clip }));
    let active = -1, filmOK = !reduced && !saveData, inView = false, autoTimer = 0;
    const set = i => {
      if (i === active) return; active = i;
      frames.forEach((f, k) => f.classList.toggle('is-active', k === i));
      tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-pressed', String(k === i)); });
      if (count) count.textContent = `0${i + 1} / 0${tabs.length}`;
      caption.classList.add('is-swapping');
      setTimeout(() => {
        $('.mono', caption).textContent = data[i].step; $('h3', caption).textContent = data[i].title; $('p', caption).textContent = data[i].copy;
        caption.classList.remove('is-swapping');
      }, 260);
      if (film && filmOK && inView && data[i].clip) {
        film.classList.remove('is-ready'); film.src = data[i].clip; film.load();
        film.oncanplay = () => { film.classList.add('is-ready'); film.play().catch(() => {}); };
        film.onerror = () => film.classList.remove('is-ready');
      }
    };
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && film && filmOK && !film.src && active >= 0 && data[active].clip) { film.src = data[active].clip; film.oncanplay = () => { film.classList.add('is-ready'); film.play().catch(() => {}); }; }
      if (!inView && film) film.pause(); else if (film && film.src) film.play().catch(() => {});
      if (narrow.matches) { clearInterval(autoTimer); if (inView && !reduced) autoTimer = setInterval(() => set((active + 1) % tabs.length), 5200); }
    }, { threshold: .2 }).observe(chapters);
    set(0);
    const progressOf = () => { const total = chapters.offsetHeight - innerHeight; return total > 0 ? clamp(-chapters.getBoundingClientRect().top / total, 0, 1) : 0; };
    onScroll(() => {
      if (narrow.matches) return;
      const p = progressOf(), n = tabs.length;
      tabs.forEach((t, k) => t.style.setProperty('--fill', clamp(p * n - k, 0, 1).toFixed(3)));
      set(Math.min(n - 1, Math.floor(p * n)));
    });
    tabs.forEach((t, k) => t.addEventListener('click', () => {
      if (narrow.matches) { clearInterval(autoTimer); set(k); tabs.forEach((x, j) => x.style.setProperty('--fill', j <= k ? 1 : 0)); return; }
      const total = chapters.offsetHeight - innerHeight;
      const y = chapters.getBoundingClientRect().top + (lenis ? lenis.scroll : scrollY) + total * ((k + .5) / tabs.length);
      lenis ? lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }));
    if (still && film) film.poster = still.currentSrc || still.src;
  }

  /* ----------------------------------------------------- cover / cta scrubs */
  $$('.cover').forEach(c => {
    const frame = $('.cover__frame', c);
    onScroll(() => {
      if (reduced) return;
      const r = c.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = clamp((innerHeight - r.top) / (innerHeight * .9), 0, 1);
      frame.style.setProperty('--ci', `${((1 - p) * 7).toFixed(2)}%`);
      frame.style.setProperty('--cs', p.toFixed(3));
    });
  });
  $$('.cta').forEach(c => onScroll(() => {
    if (reduced) { c.style.setProperty('--cp', 1); return; }
    const r = c.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    c.style.setProperty('--cp', clamp((innerHeight - r.top) / (innerHeight * .9), 0, 1).toFixed(3));
  }));
  $$('[data-parallax]').forEach(el => {
    const s = parseFloat(el.dataset.parallax) || .15;
    onScroll(() => {
      if (reduced) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      el.style.transform = `translate3d(0,${((r.top + r.height / 2 - innerHeight / 2) * -s).toFixed(1)}px,0)`;
    });
  });

  /* ------------------------------------------------------ players & videos */
  $$('.player').forEach(pl => {
    const video = $('video', pl), poster = $('.player__poster', pl);
    if (!video || !poster) return;
    const start = () => {
      if (!video.currentSrc && video.dataset.src) video.src = video.dataset.src;
      pl.classList.add('is-playing'); video.controls = true; video.play().catch(() => {}); video.focus({ preventScroll: true });
    };
    poster.addEventListener('click', start);
    poster.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start(); } });
  });
  const autoIO = 'IntersectionObserver' in window && new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.addEventListener('canplay', () => v.classList.add('is-ready'), { once: true }); } v.play().catch(() => {}); }
    else v.pause();
  }), { threshold: .15 });
  if (!reduced && !saveData) $$('video[data-autoplay]').forEach(v => autoIO && autoIO.observe(v));

  /* ------------------------------------------------------ systems explorer */
  $$('[data-explorer]').forEach(ex => {
    const tabs = $$('.explorer__tab', ex), img = $('.explorer__panel img', ex);
    const step = $('[data-ex-step]', ex), title = $('[data-ex-title]', ex), copy = $('[data-ex-copy]', ex);
    const select = (t, focus) => {
      tabs.forEach(b => b.setAttribute('aria-pressed', String(b === t)));
      img.classList.add('is-swapping');
      const next = new Image(); next.src = t.dataset.src;
      const swap = () => { img.src = t.dataset.src; img.alt = t.dataset.alt; step.textContent = t.dataset.step; title.textContent = t.dataset.title; copy.textContent = t.dataset.copy; requestAnimationFrame(() => img.classList.remove('is-swapping')); };
      next.decode ? next.decode().then(swap, swap) : (next.onload = swap);
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return; e.preventDefault();
        select(tabs[(map[e.key] + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ------------------------------------------------------------ doc TOC spy */
  const tocLinks = $$('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(tocLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      tocLinks.forEach(a => a.classList.remove('is-active'));
      map.get(e.target.id)?.classList.add('is-active');
    }), { rootMargin: '-30% 0px -60% 0px' });
    map.forEach((_, id) => { const s = d.getElementById(id); if (s) io.observe(s); });
  }

  /* -------------------------------------------------------- video carousel */
  const VIDEO_SETS = {
    grovefall: [
      { title: 'GROVEFALL — Trailer V4', label: 'Current cut', src: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3J90Kiwz4QISGac5QlSgYngKSH0/09cee475-df52-46a8-9bef-49d41e5e3046.mp4', poster: 'Images/grovefall-trailer-v4-poster.webp?v=4r3', description: 'A 93-second cinematic journey rebuilt from scratch with world exploration, grounded weapon-switch combat, the living squirrel tree-city, and a final Iron Spire reveal.' },
      { title: 'GROVEFALL — Trailer V3', label: 'Archive', src: 'Media/grovefall-trailer.mp4?v=3', poster: 'Images/grovefall-poster.webp?v=3', description: 'A continuity-led gameplay-vision trailer with three camera-led bridge shots, direct action cuts, and one continuous sound arc.' },
      { title: 'GROVEFALL — Trailer V2', label: 'Archive', src: 'Media/grovefall-trailer-v2.mp4?v=2', poster: 'Images/grovefall-trailer-v2-poster.webp?v=2', description: 'The transition and sound pass that introduced a connected score arc.' },
      { title: 'GROVEFALL — Trailer V1', label: 'First cut', src: 'Media/grovefall-trailer-v1.mp4?v=1', poster: 'Images/grovefall-trailer-v1-poster.webp?v=1', description: 'The original gameplay-vision assembly for the hero, world, combat, and Iron Spire.' }
    ],
    cinematic: [
      { title: 'GROVEFALL — Trailer V4', label: 'Current cut · AI vision', src: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3J90Kiwz4QISGac5QlSgYngKSH0/09cee475-df52-46a8-9bef-49d41e5e3046.mp4', poster: 'Images/grovefall-trailer-v4-poster.webp?v=4r3', description: 'A 93-second cinematic journey rebuilt from scratch with world exploration, grounded weapon-switch combat, the living squirrel tree-city, and a final Iron Spire reveal. AI-generated, not recorded gameplay.' },
      { title: 'GROVEFALL — Trailer V3', label: 'Archive · AI vision', src: 'Media/grovefall-trailer.mp4?v=3', poster: 'Images/grovefall-poster.webp?v=3', description: 'A continuity-led gameplay vision rebuilt around camera-led shots and a unified sound arc. AI-generated, not recorded gameplay.' },
      { title: 'Gilded Fate — Gameplay', label: 'Recorded gameplay', src: 'Media/gilded-fate-gameplay.mp4', poster: 'Images/portfolio-projects/gilded-fate-gameplay-poster.webp', description: 'Actual development footage from the current Unity build of Gilded Fate.' },
      { title: 'Exploding Nuts — Unity', label: 'Recorded gameplay', src: 'Media/exploding-nuts-unity-gameplay.mp4', poster: 'Images/portfolio-projects/exploding-nuts-unity-gameplay-poster.webp', description: 'The Unity / C# evolution of the Exploding Nuts arena roguelite.' },
      { title: 'GROVEFALL — Trailer V2', label: 'Archive · AI vision', src: 'Media/grovefall-trailer-v2.mp4?v=2', poster: 'Images/grovefall-trailer-v2-poster.webp?v=2', description: 'A previous GROVEFALL transition and sound pass.' },
      { title: 'Portal world loop', label: 'Homepage motion', src: 'Media/portal-world-loop.mp4?v=portal3', poster: 'Images/portal-world.webp?v=portal3', description: 'A seamless ambient concept loop for the portfolio home screen. Concept film, not gameplay.' },
      { title: 'Vanguard motion study', label: 'Character study', src: 'Media/vanguard-fight.mp4', poster: 'Images/portfolio-projects/gilded-fate-vanguard-portrait.webp', description: 'A Gilded Fate character motion study, presented as a concept film.' }
    ]
  };
  $$('[data-vc]').forEach(vc => {
    const items = VIDEO_SETS[vc.dataset.vc] || []; if (!items.length) return;
    const video = $('video', vc), list = $('.vc__list', vc), title = $('[data-vc-title]', vc), copy = $('[data-vc-copy]', vc), label = $('[data-vc-label]', vc);
    let sel = -1;
    const render = (i, focus) => {
      if (i === sel) return; sel = (i + items.length) % items.length;
      const it = items[sel];
      video.pause(); video.removeAttribute('src'); video.preload = 'none'; video.poster = it.poster; video.src = it.src;
      title.textContent = it.title; copy.textContent = it.description; if (label) label.textContent = it.label;
      $$('.vc__item', list).forEach((b, k) => b.setAttribute('aria-pressed', String(k === sel)));
      if (focus) list.children[sel].focus();
    };
    list.innerHTML = items.map(it => `<button type="button" class="vc__item" aria-pressed="false"><img src="${esc(it.poster)}" alt="" loading="lazy"><span><strong>${esc(it.title)}</strong><small>${esc(it.label)}</small></span></button>`).join('');
    $$('.vc__item', list).forEach((b, k) => b.addEventListener('click', () => { const was = sel; render(k); if (was !== k) video.play().catch(() => {}); }));
    list.addEventListener('keydown', e => {
      const keys = { ArrowDown: sel + 1, ArrowRight: sel + 1, ArrowUp: sel - 1, ArrowLeft: sel - 1, Home: 0, End: items.length - 1 };
      if (!(e.key in keys)) return; e.preventDefault(); render(keys[e.key], true);
    });
    render(0);
  });

  /* ---------------------------------------------------------- triptych */
  $$('.triptych').forEach(t => {
    const items = $$('.trip', t);
    items.forEach(it => it.addEventListener('focus', () => { items.forEach(o => o.classList.toggle('is-open', o === it)); }));
    t.addEventListener('pointerleave', () => items.forEach(o => o.classList.remove('is-open')));
  });

  /* Keep the reel and chapter geometry honest after fonts settle. */
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => dispatchEvent(new Event('resize')));
})();
