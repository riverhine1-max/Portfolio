const {chromium}=require('playwright');
const fs=require('node:fs');
const base=process.env.TEST_URL||'http://127.0.0.1:8123/';
const ok=(v,m)=>{if(!v)throw Error(m)};
(async()=>{
fs.mkdirSync('test-results',{recursive:true});
const b=await chromium.launch({channel:'msedge',headless:true});
const p=await b.newPage(); const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const width of [1440,1024,768,390,360]){
 await p.setViewportSize({width,height:900});await p.goto(base);
 ok(await p.locator('h1').count()===1,'h1');ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
 await p.locator('.world-visual img').evaluate(i=>i.decode());
 await p.waitForFunction(()=>{const v=document.querySelector('#world-film');return !v.paused&&v.currentTime>0});
 ok(await p.locator('.world-motion').count()===1,'film pause control');
 for(const key of ['nuts','web','gilded']){await p.locator(`[data-showcase="${key}"]`).click();await p.locator('#showcase-image').evaluate(i=>i.decode());ok(await p.locator(`[data-showcase="${key}"]`).getAttribute('aria-pressed')==='true','project selector');}
 await p.locator('[data-showcase="gilded"]').press('ArrowRight');ok(await p.locator('[data-showcase="nuts"]').getAttribute('aria-pressed')==='true','keyboard selector');
 await p.locator('[data-showcase="gilded"]').click();
 for(const key of ['map','hexer-combat','vanguard']){await p.locator(`[data-journey="${key}"]`).click();await p.locator('#journey-image').evaluate(i=>i.decode());}
 if(width<761){await p.evaluate(()=>scrollTo(0,0));await p.locator('.menu-toggle').click();ok(await p.locator('#portfolio-nav').isVisible(),'menu');await p.keyboard.press('Escape');ok(!await p.locator('#portfolio-nav').isVisible(),'menu escape');}
 // Reveal each section through ordinary scrolling before the full-page design capture.
 for(const section of await p.locator('.reveal').all()){await section.scrollIntoViewIfNeeded();await p.waitForTimeout(120)}
 await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(850);
 if([1440,390].includes(width)){await p.screenshot({path:`test-results/motion-${width}.png`,fullPage:true});await p.screenshot({path:`test-results/motion-hero-${width}.png`});}
 for(const file of ['GildedFate.html','WorkSample.html','About.html','Resume.html','Contact.html']){await p.goto(base+file);ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' overflow '+width)}
 console.log(width+' motion layout and interactions PASS');
}
await p.emulateMedia({reducedMotion:'reduce'});await p.goto(base);ok(await p.locator('#world-film').getAttribute('src')===null,'reduced motion loads no video');ok(await p.locator('#world-film').evaluate(v=>v.paused),'reduced motion paused');
await p.emulateMedia({reducedMotion:'no-preference'});await p.setViewportSize({width:1440,height:900});await p.goto(base);await p.waitForFunction(()=>{const v=document.querySelector('#world-film');return v.duration>0&&!v.paused});
await p.locator('#world-film').evaluate(v=>{v.currentTime=v.duration-.15});await p.waitForFunction(()=>{const v=document.querySelector('#world-film');return v.currentTime<1.5&&!v.paused});
await p.mouse.move(700,500);await p.mouse.wheel(0,600);await p.waitForTimeout(100);const mid=await p.evaluate(()=>scrollY);ok(mid>0&&mid<590,'wheel easing intermediate position '+mid);await p.waitForTimeout(700);ok(await p.evaluate(()=>scrollY)>590,'wheel easing destination');
await p.locator('.motion-contact').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('#world-film').paused);await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.waitForFunction(()=>!document.querySelector('#world-film').paused);
console.log('Automatic playback, looping, offscreen pause/resume, and eased wheel scrolling PASS');
const touch=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const t=await touch.newPage();await t.goto(base);await t.locator('[data-showcase="web"]').tap();ok(await t.locator('#showcase-title').textContent()==='Website redesigns','touch projects');await touch.close();
const plain=await b.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const n=await plain.newPage();await n.goto(base);ok(await n.locator('#portfolio-nav').isVisible(),'noJS nav');ok(await n.locator('.motion-work').isVisible(),'noJS content');await plain.close();
ok(!errors.length,errors.join());await b.close();console.log('Motion, reduced motion, touch, no-JS and console PASS');
})().catch(e=>{console.error(e);process.exit(1)});
