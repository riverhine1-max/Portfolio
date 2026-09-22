(() => {
  const systems = {
    hero: ['01 / Begin with a character', 'Choose your hero.', 'The Vanguard, Hexer, and Reaper have distinct systems. The character archive introduces the hero before the run.', 'vanguard', 'Vanguard character archive'],
    fate: ['02 / Starting choices', 'Enter the Fateweave.', 'The Fateweave presents starting choices before the journey unfolds. It gives the run a decision point outside combat.', 'fateweave', 'The Fateweave starting choices'],
    map: ['03 / Run progression', 'Pick a route.', 'A branching map connects the run’s rooms. The route screen makes the available paths visible between encounters.', 'map', 'Branching map and Vault rooms'],
    combat: ['04 / Card combat', 'Read the battlefield.', 'Cards, enemies, and status effects share the combat interface. This screen shows the Hexer’s actions in an encounter.', 'hexer-combat', 'Hexer combat with cards and enemies'],
    reward: ['05 / After the encounter', 'Carry the run forward.', 'The victory screen presents card rewards after combat, connecting the encounter to the next stage of the run.', 'victory', 'Victory and card rewards']
  };
  const buttons = [...document.querySelectorAll('[data-system]')];
  function selectSystem(button) {
    const [step, title, copy, file, alt] = systems[button.dataset.system];
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.getElementById('system-step').textContent = step;
    document.getElementById('system-title').textContent = title;
    document.getElementById('system-copy').textContent = copy;
    const img = document.getElementById('system-image');
    img.alt = alt;
    img.src = `Images/portfolio-projects/gilded-fate-${file}-20260916.webp`;
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => selectSystem(button));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (i + buttons.length - 1) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); buttons[next].focus(); selectSystem(buttons[next]); }
    });
  });
  const film = document.getElementById('brand-film');
  const motion = document.querySelector('.motion-control');
  if (film && motion) {
    motion.hidden = false;
    const stop = () => { film.pause(); motion.textContent = 'Play ambient film'; motion.setAttribute('aria-pressed', 'false'); };
    motion.addEventListener('click', async () => {
      if (!film.paused) { stop(); return; }
      if (!film.getAttribute('src')) film.src = film.dataset.src;
      film.hidden = false;
      try { await film.play(); motion.textContent = 'Pause ambient film'; motion.setAttribute('aria-pressed', 'true'); }
      catch { film.hidden = true; motion.textContent = 'Film unavailable — try again'; }
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) stop();
    }).observe(film.parentElement);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', stop);
  }
})();
