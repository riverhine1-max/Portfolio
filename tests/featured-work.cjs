const path = require('node:path');
const output = process.env.QA_OUTPUT || 'test-results';
require('node:fs').mkdirSync(output, { recursive: true });
const fs = require('fs');
const { chromium } = require('playwright');
const sizes = [[2560,1080],[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[430,932],[390,844],[360,800]];
const ids = ['gilded-fate','exploding-nuts','website-demos','arc-ui','snake','arc-db'];
const assert = (ok, msg) => { if (!ok) throw Error(msg); };
(async () => {
 const browser = await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge',headless:true});
 const page = await browser.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.TEST_URL || 'http://127.0.0.1:8123/'; const report=[];
 for (const [width,height] of sizes) {
  await page.setViewportSize({width,height}); await page.goto(base+'WorkSample.html',{waitUntil:'domcontentloaded'});
  let reference;
  for (const id of ids) {
   const card=page.locator(`[data-project="${id}"]`); await card.click();
   const dialog=page.locator('#projectModal'); assert(await dialog.evaluate(e=>e.open),'not open');
   const rect=await dialog.boundingBox();
   assert(rect.width<=1800.5 && rect.x>=0 && rect.y>=0 && rect.x+rect.width<=width+.5 && rect.y+rect.height<=height+.5,`${width} ${id} outside viewport ${JSON.stringify(rect)}`);
   if (reference) assert(Math.abs(rect.width-reference.width)<.5&&Math.abs(rect.height-reference.height)<.5,`${id} shell shifted`); else reference=rect;
   const stage=page.locator('.project-modal__stage'), stageRect=await stage.boundingBox();
   assert(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth+1),`${id} dialog overflow`);
   assert(await page.locator('.project-modal__content').evaluate(e=>e.scrollWidth<=e.clientWidth+1),`${id} content overflow`);
   const gallery=page.locator('.gallery-thumb'); const count=await gallery.count();
   for(let i=0;i<count;i++) { await gallery.nth(i).click();await stage.locator('img').evaluate(e=>e.decode());const r=await dialog.boundingBox(),v=await stage.boundingBox();assert(Math.abs(r.height-rect.height)<.5&&Math.abs(v.height-stageRect.height)<.5&&Math.abs(v.width-stageRect.width)<.5,'gallery shift');assert(await stage.locator('img').evaluate(e=>getComputedStyle(e).objectFit==='contain'&&e.naturalWidth>0),'image containment'); }
   if(count){await page.getByRole('button',{name:'Next media',exact:true}).click();assert(await page.locator('.gallery-counter').textContent()===`1 / ${count}`,'next wrap');await page.getByRole('button',{name:'Previous media',exact:true}).click();assert(await page.locator('.gallery-counter').textContent()===`${count} / ${count}`,'previous wrap');}
   if(id==='arc-db') assert(await stage.locator('iframe').count()===0,'database raw iframe');
   if(id==='snake'){
    const frame=page.frameLocator('#modalMedia iframe');await frame.locator('#startGameButton').click();
    const canvas=await frame.locator('canvas').boundingBox();
    assert(Math.abs(canvas.width-canvas.height)<1,'non square snake');
    assert(canvas.x>=stageRect.x-1&&canvas.y>=stageRect.y-1&&canvas.x+canvas.width<=stageRect.x+stageRect.width+1&&canvas.y+canvas.height<=stageRect.y+stageRect.height+1,'clipped snake');
    assert(await frame.locator('body').evaluate(e=>e.scrollHeight<=innerHeight&&e.scrollWidth<=innerWidth),'snake page scroll');
    await frame.locator('canvas').press('Escape');assert(!await dialog.evaluate(e=>e.open),'iframe Escape');await card.click();
   }
   await page.locator('.modal-close').focus();await page.keyboard.press('Shift+Tab');
   assert(await dialog.evaluate(e=>e.contains(document.activeElement)),'focus escaped');
   if([1920,1024,390].includes(width)) {await page.locator('.modal-close').focus();await page.locator('.project-modal__content').evaluate(e=>e.scrollTop=0);await page.locator('.project-modal__details').evaluate(e=>e.scrollTop=0);await dialog.screenshot({path:path.join(output,`modal-${width}-${id}.png`)});}
   await page.keyboard.press('Escape');assert(!await dialog.evaluate(e=>e.open),'Escape close');assert(await card.evaluate(e=>e===document.activeElement),'focus return');
   await card.click(); await page.mouse.click(2,2); assert(!await dialog.evaluate(e=>e.open),'backdrop close');
   report.push({width,height,id,shell:[rect.width,rect.height],stage:[stageRect.width,stageRect.height],gallery:count});
  }
  console.log(width+'x'+height+' all six PASS');
 }
 assert(errors.length===0,JSON.stringify(errors));fs.writeFileSync(path.join(output,'modal-qa.json'),JSON.stringify(report,null,2));await browser.close();
})();
