// Progressive enhancement: links remain available when JavaScript is disabled.
(() => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#portfolio-nav');
  if (!button || !nav) return;
  const mobile = matchMedia('(max-width: 760px)');
  document.documentElement.classList.add('nav-ready');
  button.hidden = false;
  function setOpen(open, restore = false) {
    button.setAttribute('aria-expanded', String(open));
    button.firstChild.textContent = open ? 'Close ' : 'Menu ';
    nav.classList.toggle('is-open', open);
    if (restore) button.focus();
  }
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setOpen(false);
  });
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.site-header')) setOpen(false);
  });
  mobile.addEventListener('change', () => setOpen(false));
})();
