const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');

// A small DOM/event clock harness checks the interaction contract without a
// browser dependency. Visual and responsive checks are performed in-browser.
function setup(reduce=false){
 let now=0,id=0;const timers=new Map(),globalEvents={},docEvents={};
 function node(){const attrs={},events={},classes=new Set();return {dataset:{},style:{setProperty(){}},classList:{add:v=>classes.add(v),remove:v=>classes.delete(v),contains:v=>classes.has(v)},setAttribute:(k,v)=>attrs[k]=v,getAttribute:k=>attrs[k],addEventListener:(k,f)=>events[k]=f,fire:(k,e={})=>events[k]?.(e),pause(){this.paused=true},play(){this.paused=false;return Promise.resolve()},load(){},closest(){return null}}}
 const steps=['deck','path','fight','rewards','shape'].map(state=>{const n=node();n.dataset.state=state;return n});
 const stage=node(),skip=node(),story=node();story.offsetTop=1000;story.offsetHeight=800;story.getBoundingClientRect=()=>({top:1000-context.scrollY});story.querySelectorAll=()=>steps;story.querySelector=s=>s==='.vanguard-stage'?stage:skip;story.contains=()=>true;
 const names=['vanguard-film','run-play','run-count','run-prev','run-next','run-exit'];const nodes=Object.fromEntries(names.map(x=>[x,node()]));nodes['run-story']=story;
 const reduced={matches:reduce,addEventListener(k,f){this.change=f}};
 const context={document:{hidden:false,getElementById:x=>nodes[x],addEventListener:(k,f)=>docEvents[k]=f},matchMedia:()=>reduced,navigator:{},innerHeight:900,scrollY:0,performance:{now:()=>now},setTimeout:(f,ms)=>{timers.set(++id,{f,t:now+ms});return id},clearTimeout:k=>timers.delete(k),addEventListener:(k,f)=>globalEvents[k]=f,scrollTo:({top})=>context.scrollY=top};context.window=context;
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../run-story.js'),'utf8'),context);
 function tick(ms){const end=now+ms;for(;;){const next=[...timers].sort((a,b)=>a[1].t-b[1].t)[0];if(!next||next[1].t>end)break;now=next[1].t;timers.delete(next[0]);next[1].f()}now=end}
 function wheel(delta=10000){let prevented=false;globalEvents.wheel({deltaY:delta,deltaX:0,deltaMode:0,preventDefault(){prevented=true}});return prevented}
 return {nodes,steps,story,tick,wheel,globalEvents,docEvents,reduced,context,ready:()=>nodes['vanguard-film'].oncanplay?.(),count:()=>nodes['run-count'].textContent};
}
test('large wheel bursts cannot skip states; autoplay presents all five then exits',()=>{
 const h=setup();assert.equal(h.wheel(),true);h.ready();
 for(let i=0;i<20;i++)h.wheel();assert.equal(h.count(),'01 / 05');
 for(let i=2;i<=5;i++){h.tick(5200);assert.equal(h.count(),`0${i} / 05`);h.ready()}
 h.tick(5200);assert.equal(h.story.classList.contains('is-pinned'),false);assert.equal(h.context.scrollY,1800);
});
test('slow media gets its full chapter duration after becoming playable',()=>{
 const h=setup();h.wheel();h.tick(5000);assert.equal(h.count(),'01 / 05');h.ready();h.tick(5000);assert.equal(h.count(),'01 / 05');h.tick(200);assert.equal(h.count(),'02 / 05');
});
test('failed media falls back and does not trap the experience',()=>{
 const h=setup();h.wheel();h.nodes['vanguard-film'].onerror();h.tick(5200);assert.equal(h.count(),'02 / 05');h.nodes['run-exit'].fire('click');assert.equal(h.story.classList.contains('is-pinned'),false);
});
test('Escape releases the scroll lock immediately',()=>{
 const h=setup();h.wheel();h.globalEvents.keydown({key:'Escape'});assert.equal(h.story.classList.contains('is-pinned'),false);
});
test('reduced motion keeps native scrolling and does not load animation',()=>{
 const h=setup(true);assert.equal(h.wheel(),false);assert.equal(h.story.classList.contains('is-pinned'),false);assert.equal(h.nodes['vanguard-film'].src,undefined);assert.equal(h.nodes['run-play'].textContent,'Play');
});
test('manual state selection pauses autoplay and remains keyboard-addressable',()=>{
 const h=setup();h.wheel();h.steps[2].fire('click');h.ready();h.tick(15000);assert.equal(h.count(),'03 / 05');assert.equal(h.nodes['run-play'].textContent,'Play');
});
