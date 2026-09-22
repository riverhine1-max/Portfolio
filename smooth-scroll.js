// Smooth discrete mouse-wheel steps; preserve native touch, trackpad, keyboard,
// nested scrolling, dialogs, browser zoom and reduced-motion behavior.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mouse = matchMedia('(hover: hover) and (pointer: fine)');
  let frame = 0, target = 0, previousTime = 0, writtenY = scrollY;
  const limit = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const stop = () => { cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
  function tick(time) {
    const elapsed = Math.min(40, time - (previousTime || time - 16));
    previousTime = time;
    target = Math.max(0, Math.min(limit(), target));
    const next = scrollY + (target - scrollY) * (1 - Math.exp(-elapsed / 105));
    writtenY = Math.abs(target - next) < .8 ? target : next;
    scrollTo({top: writtenY, behavior: 'instant'});
    writtenY = scrollY;
    if (Math.abs(target - scrollY) < 1) stop();
    else frame = requestAnimationFrame(tick);
  }
  function nestedScroll(event) {
    for (const node of event.composedPath()) {
      if (!(node instanceof Element) || node === document.body || node === document.documentElement) continue;
      if (node.matches('dialog, textarea, select, input, [contenteditable="true"]')) return true;
      const overflow = getComputedStyle(node).overflowY;
      if (/(auto|scroll)/.test(overflow) && node.scrollHeight > node.clientHeight + 1) return true;
    }
    return false;
  }
  addEventListener('wheel', event => {
    if (event.defaultPrevented || reduced.matches || !mouse.matches || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || document.querySelector('dialog[open]') || nestedScroll(event)) { stop(); return; }
    // Trackpads already supply fine-grained inertial events.
    if (event.deltaMode === 0 && Math.abs(event.deltaY) < 45) { stop(); return; }
    const delta = event.deltaY * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? innerHeight : 1);
    if (!delta || !event.cancelable) return;
    event.preventDefault();
    if (!frame) target = scrollY;
    if ((target - scrollY) * delta < 0) target = scrollY;
    target = Math.max(0, Math.min(limit(), target + delta));
    if (!frame) frame = requestAnimationFrame(tick);
  }, {passive: false});
  addEventListener('scroll', () => { if (frame && Math.abs(scrollY - writtenY) > 3) stop(); }, {passive:true});
  for (const name of ['pointerdown','touchstart','keydown','resize','hashchange']) addEventListener(name, stop, {passive:true});
  document.addEventListener('visibilitychange', stop);
  reduced.addEventListener('change', stop);
})();
