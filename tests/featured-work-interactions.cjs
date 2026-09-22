const path = require('node:path');
const output = process.env.QA_OUTPUT || 'test-results';
require('node:fs').mkdirSync(output, { recursive: true });
const {chromium}=require('playwright');
const ok=(x,m)=>{if(!x)throw Error(m)};
(async()=>{const b=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge',headless:true});const p=await b.newPage({viewport:{width:390,height:844}});await p.goto((process.env.TEST_URL || 'http://127.0.0.1:8123/')+'WorkSample.html');
// Featured case studies intentionally have a stronger hierarchy than smaller projects.
for(const id of ['gilded-fate','exploding-nuts','website-demos','arc-ui','snake','arc-db']){
 await p.locator(`[data-project="${id}"], [data-gallery-project="${id}"]`).click();const y=await p.evaluate(()=>scrollY);await p.mouse.move(1,1);await p.mouse.wheel(0,700);await p.waitForTimeout(100);ok(await p.evaluate(()=>scrollY)===y,'body moved');
 await p.locator('.modal-close').focus();for(let i=0;i<28;i++){await p.keyboard.press('Tab');ok(await p.locator('#projectModal').evaluate(e=>e.contains(document.activeElement)),'Tab escaped '+id);}
 await p.locator('.project-modal__content').evaluate(e=>e.scrollTop=e.scrollHeight);const r=await p.locator('.modal-close').boundingBox();ok(r.y>=0&&r.y+r.height<=844,'close offscreen');
 await p.locator('.modal-close').click();
}
await p.locator('[data-gallery-project="gilded-fate"]').click();const rect=await p.locator('#projectModal').boundingBox();
await p.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:false})));ok(await p.locator('#projectModal').evaluate(e=>e.open),'late page load closed the dialog');
await p.evaluate(()=>{projects['gilded-fate'].media=[{type:'video',src:'Media/gilded-fate-gameplay.mp4',alt:'QA video fixture'}];openProject('gilded-fate');});
const video=p.locator('#modalMedia video');await video.evaluate(async e=>{e.muted=true;await e.play()});ok(await video.evaluate(e=>e.videoWidth>0),'video failed');ok(Math.abs((await p.locator('#projectModal').boundingBox()).height-rect.height)<1,'video shift');await p.locator('.modal-close').click();
await p.goto((process.env.TEST_URL || 'http://127.0.0.1:8123/')+'WorkSample.html#gilded-fate');ok(await p.locator('#projectModal').evaluate(e=>e.open),'deep link');await p.locator('.modal-close').click();ok(!p.url().includes('#'),'deep link cleanup');
await p.emulateMedia({reducedMotion:'reduce'});ok(await p.locator('.project-card').first().evaluate(e=>getComputedStyle(e).transitionDuration==='0s'),'reduced motion');
console.log('PASS: six focus cycles, scroll locking, close visibility, video playback, deep links, reduced motion');await b.close();})();
