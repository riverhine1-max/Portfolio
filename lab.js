(() => {
  const canvas=document.getElementById('dungeon');if(!canvas)return;
  const ctx=canvas.getContext('2d'),seedInput=document.getElementById('map-seed');
  function generate(){
    let seed=Math.max(1,Math.min(999999,Math.trunc(Number(seedInput.value)||1)));seedInput.value=seed;
    const initial=seed,random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
    ctx.fillStyle='#0b1014';ctx.fillRect(0,0,640,400);const rooms=[];
    for(let i=0;i<9;i++)rooms.push({x:45+(i%3)*200+random()*45,y:35+Math.floor(i/3)*120+random()*20,w:55+random()*50,h:40+random()*35});
    ctx.strokeStyle='#655840';ctx.lineWidth=9;
    rooms.forEach((r,i)=>{if(!i)return;const prev=rooms[i-1];ctx.beginPath();ctx.moveTo(prev.x+prev.w/2,prev.y+prev.h/2);ctx.lineTo(r.x+r.w/2,prev.y+prev.h/2);ctx.lineTo(r.x+r.w/2,r.y+r.h/2);ctx.stroke()});
    rooms.forEach((r,i)=>{ctx.fillStyle=i===0?'#ddc18a':i===8?'#a87661':'#303d40';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.strokeStyle='#b49b6c';ctx.lineWidth=1;ctx.strokeRect(r.x,r.y,r.w,r.h);ctx.fillStyle=i===0?'#111':'#f4e5c8';ctx.font='12px monospace';ctx.fillText(i===0?'START':i===8?'EXIT':String(i+1),r.x+9,r.y+24)});
    canvas.setAttribute('aria-label',`Dungeon seed ${initial}: nine connected rooms, starting upper left and ending lower right.`);
    document.getElementById('map-status').textContent=`Seed ${initial} · 9 rooms · One connected route`;
  }
  document.getElementById('generate-map').addEventListener('click',generate);
  document.getElementById('random-map').addEventListener('click',()=>{seedInput.value=Math.floor(Math.random()*999999)+1;generate()});generate();
  const hand=document.getElementById('card-playground');let cards=[['◇','Strike','Apply pressure'],['⬡','Guard','Hold your ground'],['✦','Focus','Prepare your next turn']];
  function deal(){hand.replaceChildren();cards.forEach(([symbol,name,copy])=>{const b=document.createElement('button');b.type='button';b.className='play-card';b.setAttribute('aria-pressed','false');b.setAttribute('aria-label',`Reveal ${name} card`);b.innerHTML=`<span aria-hidden="true">${symbol}</span><strong>REVEAL</strong><small>Interaction study</small>`;b.addEventListener('click',()=>{const open=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(open));b.setAttribute('aria-label',`${open?'Hide':'Reveal'} ${name} card`);b.querySelector('strong').textContent=open?name:'REVEAL';b.querySelector('small').textContent=open?copy:'Interaction study'});hand.append(b)})}
  document.getElementById('shuffle-cards').addEventListener('click',()=>{for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]]}deal();document.getElementById('card-status').textContent='Hand shuffled. Flip a card to explore.'});deal();
})();
