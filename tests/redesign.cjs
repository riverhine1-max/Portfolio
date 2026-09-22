const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.TEST_URL || 'http://127.0.0.1:8123/';
const assert = (value, message) => { if (!value) throw new Error(message); };
(async () => {
  fs.mkdirSync('test-results', { recursive: true });
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const pages = ['index.html','WorkSample.html','GildedFate.html','ExplodingNuts.html','WebsiteRedesigns.html','About.html','Resume.html','Contact.html','Certifications.html'];
  for (const width of [1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({width, height:900});
    for (const file of pages) {
      await page.goto(base + file);
      assert(await page.locator('h1').count() === 1, file+' h1');
      assert(await page.locator('main').count() === 1, file+' main');
      assert(await page.locator('link[rel="canonical"]').count() === 1, file+' canonical');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), file+' overflow '+width);
      await page.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => { img.loading='eager'; return img.decode(); })));
      assert(await page.locator('img').evaluateAll(imgs => imgs.every(img => img.naturalWidth > 0)),file+' images');
      if (width <= 760) {
        const menu=page.getByRole('button',{name:'Menu',exact:false});
        assert(!await page.locator('#portfolio-nav').isVisible(), 'nav starts closed');
        await menu.click(); assert(await page.locator('#portfolio-nav').isVisible(),'menu opens');
        await page.keyboard.press('Escape'); assert(!await page.locator('#portfolio-nav').isVisible(),'Escape closes');
        assert(await menu.evaluate(e=>e===document.activeElement),'menu focus restoration');
      }
      if ([1440,390].includes(width) && ['index.html','GildedFate.html','WorkSample.html','Resume.html'].includes(file))
        await page.screenshot({path:`test-results/redesign-${width}-${file}.png`,fullPage:true});
    }
    await page.goto(base+'GildedFate.html');
    for (const key of ['fate','map','combat','reward','hero']) {
      await page.locator(`[data-system="${key}"]`).click();
      assert(await page.locator(`[data-system="${key}"]`).getAttribute('aria-pressed')==='true','system selection');
      await page.locator('#system-image').evaluate(img=>img.decode());
    }
    await page.locator('[data-system="hero"]').press('ArrowRight');
    assert(await page.locator('[data-system="fate"]').getAttribute('aria-pressed')==='true','arrow navigation');
    console.log(width+' desktop/mobile pages, images, navigation, systems PASS');
  }
  await page.goto(base+'Contact.html');
  assert(!/mtchs\.org|tel:|sms:|891.?5598/.test(await page.content()),'private contact leaked');
  await page.goto(base+'Resume.html');
  assert(await page.getByRole('link',{name:'Download PDF'}).count()===1,'PDF download');
  assert(await page.locator('.reading-copy').count()>=5,'HTML resume');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base);
  assert(await page.locator('#world-film').getAttribute('src')===null,'ambient video should not load automatically');
  assert(await page.locator('#world-film').evaluate(v=>v.paused),'reduced-motion film paused');
  await page.goto(base+'WorkSample.html');
  await page.locator('[data-featured-project="gilded-fate"] a').focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/GildedFate.html');
  assert(page.url().endsWith('GildedFate.html'),'case-study link keyboard activation');
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const touchPage=await touch.newPage();await touchPage.goto(base+'GildedFate.html');
  await touchPage.getByRole('button',{name:'Menu',exact:false}).tap();
  assert(await touchPage.locator('#portfolio-nav').isVisible(),'touch menu');
  await touchPage.getByRole('button',{name:'Close',exact:false}).tap();
  await touchPage.locator('[data-system="combat"]').tap();
  assert(await touchPage.locator('[data-system="combat"]').getAttribute('aria-pressed')==='true','touch explorer');
  await touch.close();
  // Keep all project links relative to the Pages /Portfolio/ prefix and detect broken local paths.
  for (const file of pages) {
    await page.goto(base+file);
    for (const href of await page.locator('a[href]').evaluateAll(es=>es.map(e=>e.getAttribute('href')))) {
      if (/^(https?:|mailto:|#)/.test(href)) continue;
      const local=decodeURIComponent(href.split(/[?#]/)[0]);
      assert(fs.existsSync(path.resolve(local)),file+' broken local link '+local);
    }
  }
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const plain=await noJS.newPage();await plain.goto(base);
  assert(await plain.locator('#portfolio-nav').isVisible(),'no-JS navigation');
  await noJS.close();
  assert(!errors.length,errors.join('\n'));
  await browser.close();
  console.log('Privacy, local links, HTML resume, reduced motion and no-JS navigation PASS');
})().catch(e=>{console.error(e);process.exit(1)});
