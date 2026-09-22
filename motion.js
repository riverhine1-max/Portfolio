(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!document.body.classList.contains('motion-home')) return;
  const progress = document.createElement('div'); progress.className='page-progress'; progress.setAttribute('aria-hidden','true'); document.body.append(progress);
  let queued=false;
  function updateScroll(){queued=false;const range=document.documentElement.scrollHeight-innerHeight;progress.style.setProperty('--progress',range>0?scrollY/range:0);const hero=document.querySelector('.motion-hero');if(hero)hero.style.setProperty('--departure',reduced.matches?0:Math.min(1,scrollY/hero.offsetHeight));}
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateScroll)}},{passive:true});updateScroll();
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target)}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(e=>reveal.observe(e));
  }
  const projects={
    gilded:['Gilded Fate','Unity / C# · In development','A dark-fantasy roguelike deckbuilder with three playable heroes, branching routes, and interlocking card systems.','Images/portfolio-projects/gilded-fate-title-20260916.webp','GildedFate.html'],
    nuts:['Exploding Nuts','Browser → Unity / C# · Prototype','An arena roguelite that grew from browser interactions into 3D gameplay, progression, and weapon systems.','Images/portfolio-projects/exploding-nuts-unity-title-20260916.webp','ExplodingNuts.html'],
    web:['Website redesigns','HTML / CSS / JavaScript · Independent concepts','Responsive redesign concepts for Treasure Valley businesses, built for practice and real-world outreach.','Images/optimized/websites-card.webp','WebsiteRedesigns.html']
  };
  const tabs=[...document.querySelectorAll('[data-showcase]')];
  async function swapImage(image,src,alt){
    image.dataset.requested=src;
    if(image.getAttribute('src')===src){image.alt=alt;return;}
    const incoming=new Image();incoming.src=src;
    try{await incoming.decode()}catch{return;}
    if(image.dataset.requested!==src)return;
    image.src=src;image.alt=alt;
    image.getAnimations().forEach(a=>a.cancel());
    if(!reduced.matches)image.animate([{opacity:.25,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
  }
  function select(button){const [title,meta,copy,img,url]=projects[button.dataset.showcase];tabs.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.getElementById('showcase-title').textContent=title;document.getElementById('showcase-meta').textContent=meta;document.getElementById('showcase-copy').textContent=copy;const image=document.getElementById('showcase-image');swapImage(image,img,title+' — actual project screenshot');for(const id of ['showcase-link','showcase-detail']){const a=document.getElementById(id);a.href=url;a.setAttribute('aria-label','Explore '+title+' case study')}}
  tabs.forEach((b,i)=>{b.addEventListener('click',()=>select(b));b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].focus();select(tabs[n])})});
  const steps=[...document.querySelectorAll('[data-journey]')];
  let manualUntil=0;
  function step(b){steps.forEach(s=>s.setAttribute('aria-pressed',String(s===b)));const img=document.getElementById('journey-image');const src='Images/portfolio-projects/gilded-fate-'+b.dataset.journey+'-20260916.webp';swapImage(img,src,b.querySelector('strong').textContent+' — actual Gilded Fate screen')}
  steps.forEach(b=>b.addEventListener('click',()=>{manualUntil=performance.now()+1500;step(b);if(innerWidth<=760)document.querySelector('.journey-stage').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'})}));
  if('IntersectionObserver' in window){const story=new IntersectionObserver(entries=>{if(innerWidth<=760||reduced.matches||performance.now()<manualUntil)return;for(const e of entries)if(e.isIntersecting)step(e.target)},{rootMargin:'-35% 0px -35% 0px',threshold:0});steps.forEach(b=>story.observe(b))}
  const hero=document.querySelector('.motion-hero'),film=document.getElementById('world-film');
  let enabled=!reduced.matches&&!navigator.connection?.saveData,visible=true;
  film.muted=true;film.loop=true;
  function pause(){film.pause()}
  async function play(){if(!visible||document.hidden||!enabled)return;if(!film.getAttribute('src'))film.src=film.dataset.src;try{await film.play();if(!visible||document.hidden||!enabled)pause()}catch{/* The poster remains visible if the browser blocks autoplay. */}}
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&enabled)play();else pause()},{threshold:.05}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else if(enabled)play()});
  reduced.addEventListener('change',()=>{enabled=!reduced.matches&&!navigator.connection?.saveData;updateScroll();if(enabled)play();else pause()});
  if(enabled)play();
  hero.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',((event.clientX-r.left)/r.width-.5)*-16+'px');hero.style.setProperty('--my',((event.clientY-r.top)/r.height-.5)*-12+'px')},{passive:true});
  hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--mx','0px');hero.style.setProperty('--my','0px')});
})();
