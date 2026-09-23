/* One state at a time; native navigation and Escape always provide an exit. */
(() => {
  const story=document.getElementById('run-story'); if(!story)return;
  story.classList.add('run-enhanced');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const steps=[...story.querySelectorAll('.run-step')], stage=story.querySelector('.vanguard-stage');
  const film=document.getElementById('vanguard-film'), play=document.getElementById('run-play');
  const caption=story.querySelector('.stage-caption');
  let state=0, pinned=false, finished=false, paused=reduced.matches, started=0, timer=0, loadTimer=0, lastWheel=0, touchY=0, load=0;
  const dwell=5200;
  function media(){
    const request=++load;clearTimeout(loadTimer);film.pause();film.classList.remove('is-ready');
    if(reduced.matches||navigator.connection?.saveData)return;
    caption.textContent='LOADING MOTION STUDY · STILL PREVIEW AVAILABLE';
    film.src=`Media/vanguard-${steps[state].dataset.state}.mp4`;
    let ready=false;
    const settled=()=>{if(ready||request!==load)return;ready=true;clearTimeout(loadTimer);started=performance.now();schedule();};
    film.oncanplay=()=>{if(request!==load)return;caption.textContent='VANGUARD / MOTION STUDY · NOT GAMEPLAY';film.classList.add('is-ready');settled();if(!paused&&!document.hidden&&pinned)film.play().catch(()=>{});};
    film.onerror=()=>{caption.textContent='VANGUARD / STILL PREVIEW';film.classList.remove('is-ready');settled();};
    // Keep the still available on slow connections, without waiting indefinitely.
    loadTimer=setTimeout(()=>{caption.textContent='VANGUARD / STILL PREVIEW';settled()},8000);
    film.preload='auto';film.load();
  }
  function schedule(){clearTimeout(timer);if(!paused&&pinned&&!document.hidden)timer=setTimeout(()=>advance(1),dwell);}
  function render(){
    steps.forEach((s,i)=>s.setAttribute('aria-pressed',String(i===state)));
    stage.dataset.state=steps[state].dataset.state;
    document.getElementById('run-count').textContent=`0${state+1} / 05`;
    document.getElementById('run-prev').disabled=state===0;
    play.textContent=paused?'Play':'Pause';started=performance.now();clearTimeout(timer);media();
    play.hidden=reduced.matches;
    if(reduced.matches||navigator.connection?.saveData)schedule();
  }
  function release(exit=false){
    if(!pinned)return;const top=story.offsetTop;pinned=false;finished=true;story.classList.remove('is-pinned');clearTimeout(timer);clearTimeout(loadTimer);film.pause();
    if(exit)window.scrollTo({top:top+story.offsetHeight,behavior:'instant'});
  }
  function advance(direction){
    if(direction>0&&state===4){release(true);paused=true;play.textContent='Replay';return;}
    state=Math.max(0,Math.min(4,state+direction));render();
  }
  function pin(){
    if(pinned||finished||reduced.matches||innerHeight<600)return;
    story.style.setProperty('--story-height',story.offsetHeight+'px');pinned=true;
    story.classList.add('is-pinned');scrollTo({top:story.offsetTop,behavior:'instant'});render();
  }
  let previousY=scrollY;
  addEventListener('scroll',()=>{
    const top=story.getBoundingClientRect().top;
    if(!pinned&&!finished&&scrollY>previousY&&top<=24&&top+story.offsetHeight>0)pin();
    previousY=scrollY;
  },{passive:true});
  addEventListener('wheel',event=>{
    if(event.ctrlKey||event.metaKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||reduced.matches)return;
    const box=story.getBoundingClientRect();
    const delta=event.deltaY*(event.deltaMode===1?18:event.deltaMode===2?innerHeight:1);
    if(!pinned&&!finished&&delta>0&&box.top>=0&&box.top<=delta+24)pin();
    if(!pinned)return;event.preventDefault();
    const now=performance.now(),fresh=now-lastWheel>180;lastWheel=now;
    if(delta<0&&state===0){release();return;}
    if(fresh&&now-started>=dwell)advance(delta>0?1:-1);
  },{passive:false});
  story.addEventListener('touchstart',e=>{touchY=e.touches[0].clientY},{passive:true});
  story.addEventListener('touchmove',e=>{if(!pinned)return;e.preventDefault();const delta=touchY-e.touches[0].clientY;if(Math.abs(delta)>45&&performance.now()-started>=dwell){advance(delta>0?1:-1);touchY=e.touches[0].clientY}},{passive:false});
  addEventListener('keydown',e=>{
    if(!pinned)return;
    if(e.key==='Escape'){release();paused=true;play.textContent='Play';return;}
    if(e.target.closest('button,a,input,textarea,select'))return;
    if(['ArrowDown','PageDown',' ','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();if(performance.now()-started>=dwell)advance(['ArrowUp','PageUp'].includes(e.key)?-1:1);}
    if(['End','Home'].includes(e.key))release();
  });
  steps.forEach((button,i)=>button.addEventListener('click',()=>{state=i;paused=true;render()}));
  document.getElementById('run-prev').addEventListener('click',()=>{paused=true;advance(-1)});
  document.getElementById('run-next').addEventListener('click',()=>{paused=true;advance(1)});
  play.addEventListener('click',()=>{if(state===4&&!pinned){state=0;finished=false;}paused=!paused;if(!paused&&!reduced.matches){finished=false;pin()}render()});
  story.querySelector('a[href="#future"]').addEventListener('click',()=>release());
  document.getElementById('run-exit').addEventListener('click',()=>{if(pinned)release(true);else document.getElementById('future').scrollIntoView({behavior:'instant'})});
  document.addEventListener('focusin',e=>{if(pinned&&!story.contains(e.target))release()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);film.pause()}else{started=performance.now();schedule();if(!paused&&pinned)film.play().catch(()=>{})}});
  reduced.addEventListener('change',()=>{release();paused=true;render()});
  addEventListener('resize',()=>{if(pinned&&innerHeight<600)release()});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting){film.pause();clearTimeout(timer)}}).observe(story);
  render();
})();
