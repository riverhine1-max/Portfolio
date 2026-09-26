(() => {
  const data = {
    grovefall: [
      {title:'GROVEFALL — Trailer V4', label:'Current cut', src:'https://d2ol7oe51mr4n9.cloudfront.net/user_3J90Kiwz4QISGac5QlSgYngKSH0/09cee475-df52-46a8-9bef-49d41e5e3046.mp4', poster:'Images/grovefall-trailer-v4-poster.webp?v=4r3', description:'A 93-second cinematic journey rebuilt from scratch with world exploration, grounded weapon-switch combat, the living squirrel tree-city, and a final Iron Spire reveal.'},
      {title:'GROVEFALL — Trailer V3', label:'Archive', src:'Media/grovefall-trailer.mp4?v=3', poster:'Images/grovefall-poster.webp?v=3', description:'A continuity-led gameplay-vision trailer with three camera-led bridge shots, direct action cuts, and one continuous sound arc.'},
      {title:'GROVEFALL — Trailer V2', label:'Archive', src:'Media/grovefall-trailer-v2.mp4?v=2', poster:'Images/grovefall-trailer-v2-poster.webp?v=2', description:'The transition and sound pass that introduced a connected score arc.'},
      {title:'GROVEFALL — Trailer V1', label:'First cut', src:'Media/grovefall-trailer-v1.mp4?v=1', poster:'Images/grovefall-trailer-v1-poster.webp?v=1', description:'The original gameplay-vision assembly for the hero, world, combat, and Iron Spire.'}
    ],
    cinematic: [
      {title:'GROVEFALL — Trailer V4', label:'Current cut', src:'https://d2ol7oe51mr4n9.cloudfront.net/user_3J90Kiwz4QISGac5QlSgYngKSH0/09cee475-df52-46a8-9bef-49d41e5e3046.mp4', poster:'Images/grovefall-trailer-v4-poster.webp?v=4r3', description:'A 93-second cinematic journey rebuilt from scratch with world exploration, grounded weapon-switch combat, the living squirrel tree-city, and a final Iron Spire reveal.'},
      {title:'GROVEFALL — Trailer V3', label:'Archive', src:'Media/grovefall-trailer.mp4?v=3', poster:'Images/grovefall-poster.webp?v=3', description:'A cinematic gameplay vision rebuilt around camera-led continuity shots and a unified sound arc.'},
      {title:'GROVEFALL — Trailer V2', label:'Archive', src:'Media/grovefall-trailer-v2.mp4?v=2', poster:'Images/grovefall-trailer-v2-poster.webp?v=2', description:'A previous GROVEFALL transition and sound pass.'},
      {title:'GROVEFALL — Trailer V1', label:'First cut', src:'Media/grovefall-trailer-v1.mp4?v=1', poster:'Images/grovefall-trailer-v1-poster.webp?v=1', description:'The original GROVEFALL gameplay-vision assembly.'},
      {title:'Portal world loop', label:'Homepage motion', src:'Media/portal-world-loop.mp4?v=portal3', poster:'Images/portal-world.webp?v=portal3', description:'A seamless ambient world loop for the portfolio home screen.'},
      {title:'Vanguard motion study', label:'Character study', src:'Media/vanguard-fight.mp4', poster:'Images/portfolio-projects/gilded-fate-vanguard-portrait.webp', description:'A Gilded Fate character motion study, presented as a concept film.'}
    ]
  };
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-video-carousel]').forEach(root=>{
    const items=data[root.dataset.videoCarousel]||[]; if(!items.length)return;
    const video=root.querySelector('video'), title=root.querySelector('[data-video-title]'), copy=root.querySelector('[data-video-copy]'), state=root.querySelector('[data-video-state]'), picker=root.querySelector('[data-video-picker]'), play=root.querySelector('[data-video-play]');
    let selected=0;
    const render=(next, focus=false)=>{ selected=(next+items.length)%items.length; const item=items[selected]; video.pause(); video.removeAttribute('src'); video.poster=item.poster; video.src=item.src; video.load(); title.textContent=item.title; copy.textContent=item.description; state.textContent=item.label; [...picker.children].forEach((button,index)=>button.setAttribute('aria-pressed',String(index===selected))); if(focus)picker.children[selected].focus(); };
    items.forEach((item,index)=>{const button=document.createElement('button'); button.type='button';button.setAttribute('aria-pressed',String(index===0));button.innerHTML=`${item.title}<small>${item.label}</small>`;button.addEventListener('click',()=>render(index));picker.append(button)});
    play?.addEventListener('click',()=>{if(video.paused){video.play().catch(()=>{});play.textContent='Pause'}else{video.pause();play.textContent='Play'}});
    video.addEventListener('play',()=>play&&(play.textContent='Pause'));video.addEventListener('pause',()=>play&&(play.textContent='Play'));
    root.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();if(event.key==='Home')render(0,true);else if(event.key==='End')render(items.length-1,true);else render(selected+(event.key==='ArrowRight'?1:-1),true)});
    if(reduced)video.preload='metadata'; render(0);
  });
})();
