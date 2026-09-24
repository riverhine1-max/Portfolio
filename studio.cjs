// Smoke test for the studio redesign.
// Serve the repo (e.g. `python3 -m http.server 8123`) and run: node tests/studio.cjs
// Set TEST_URL to change the base URL (include the trailing slash).
const { chromium } = require('playwright');
const BASE = process.env.TEST_URL || 'http://127.0.0.1:8123/';
const PAGES = ['index.html', 'WorkSample.html', 'GildedFate.html', 'ExplodingNuts.html', 'WebsiteRedesigns.html', 'Grovefall.html', 'GrovefallGDD.html', 'CustomAIResearch.html', 'About.html', 'Resume.html', 'Contact.html', 'Certifications.html'];
const WIDTHS = [1440, 390];

(async () => {
  const browser = await chromium.launch();
  let failures = 0;
  const fail = msg => { failures++; console.error('✗', msg); };
  const checked = new Set();
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 700, hasTouch: width < 700 });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('rh-loaded', '1'); } catch {} });
    for (const path of PAGES) {
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400 && !/\.mp4/.test(r.url())) errors.push(`${r.status()} ${r.url()}`); });
      await page.goto(BASE + path, { waitUntil: 'load' });
      await page.waitForTimeout(900);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (overflow > 1) fail(`${path} @${width}: horizontal overflow ${overflow}px`);
      errors.forEach(e => fail(`${path} @${width}: ${e}`));
      if (path === 'index.html' && await page.locator('.reel-card').count() < 2) fail('homepage reel did not render');
      if (path === 'WorkSample.html' && await page.locator('#projectGrid .card').count() < 3) fail('work grid did not render');
      if (width === WIDTHS[0]) {
        const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h && !/^(https?:|mailto:|#)/.test(h)));
        for (const href of links) {
          const url = new URL(href, BASE + path).href.split('#')[0];
          if (checked.has(url)) continue; checked.add(url);
          const res = await page.request.get(url);
          if (!res.ok()) fail(`${path}: broken link ${href} (${res.status()})`);
        }
      }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log(failures ? `\n${failures} problem(s) found` : `✓ ${PAGES.length} pages × ${WIDTHS.length} widths, ${checked.size} local links OK`);
  process.exit(failures ? 1 : 0);
})();
