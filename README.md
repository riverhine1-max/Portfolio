# River Hine — Portfolio

A static, cinematic portfolio for game development, systems design, and web projects. No framework and no build step: GitHub Pages serves the HTML directly.

## Add new work (the "open slots")

Everything on the Work page — grid, index, filters, Then → Now timeline, project count, and the homepage reel — is rendered from **`projects.js`** (in the main folder).

1. Add a cover (~1600px wide) and a thumbnail (~800px) to `Images/`.
2. Copy the `TEMPLATE` block at the top of `projects.js`, paste it into `window.PROJECTS`, and fill it in.
3. Give it `featured: 5` (or any number) to put it in the homepage reel, and `timeline` / `era` to add it to Then → Now.
4. Optional: link a case-study page with `page: 'MyProject.html'` (copy `ExplodingNuts.html` as a starting point), or add `media` / `details` / `links` to open it in the built-in project viewer instead.

`SITE.openSlots` controls how many reserved “Next project loading” slots appear after your work. Lower it as you fill them.

## Pages

- `index.html` — loader, portal-film hero with ember particles, scroll-pinned project reel, the Gilded Fate “every choice changes the run” chapters, future projects and open slots, about teaser, contact.
- `WorkSample.html` — the full archive with filters, grid / index / timeline views, open slots, the project viewer (deep links like `WorkSample.html#gilded-fate`), and the video reel.
- `GildedFate.html`, `ExplodingNuts.html`, `WebsiteRedesigns.html` — case studies.
- `GameDesignCopilot.html` — case study for the Game Design Copilot, the AI design tool in homepage Slot 11. The playable app itself lives in `Project/game-design-copilot/` (a built copy; see the README there).
- `Grovefall.html`, `GrovefallGDD.html`, `CustomAIResearch.html` — future development projects. GROVEFALL trailers are AI-generated gameplay visions and always carry that disclosure.
- `About.html`, `Resume.html`, `Contact.html`, `Certifications.html`, `404.html`.
- `Project/` demos and the legacy ARC pages are preserved as-is.

## Design system

- `studio.css` — one stylesheet for every page (tokens, type, components, responsive rules, reduced motion, print).
- `studio.js` — motion engine: loader, page-transition curtain, Lenis smooth scroll, custom cursor, magnetic buttons, split-text reveals, scroll-scrubbed reel and chapters, marquee velocity, counters, video players, systems explorer, and the video carousel.
- `work.js` — Work page rendering and the project viewer dialog.
- Fonts are self-hosted as `.woff2` files in the main folder (Archivo, Instrument Serif, JetBrains Mono — SIL Open Font License). `lenis.min.js` is Lenis 1.3 (MIT).

Every effect is progressive: without JavaScript the content is still readable, and `prefers-reduced-motion` or Save-Data turn off smooth scrolling, autoplaying film, particles, and scroll animation.

Older stylesheets and scripts in the root (`site.css`, `motion.css`, `work-samples.js`, …) belong to the previous design. `site.css`, `style.css`, and `game.js` are still used by the `Project/` demos and legacy ARC pages; the rest are no longer referenced.

## Media

Existing gameplay and screenshots remain the project evidence. Higgsfield concept artwork and animation supply the full-screen atmosphere and are labeled as not gameplay. The muted hero film plays in a loop and pauses offscreen or when the page is hidden; reduced-motion and data-saving preferences stop it loading. Large gameplay recordings and trailers load only when you press play. Project media uses the original screenshots, without fabricated gameplay or outcomes. Website redesigns are independent concepts, not commissioned-client claims. Gilded Fate and the prototypes remain explicitly in development.

Generation provenance: image `63fb267a-763f-4cbb-82e8-8a7b20f407ea` (GPT Image 2.5); animation `29518861-35b0-4f36-bd8d-1847a4fcd891` (Kling 3.0 Turbo).

Portal hero provenance: image `324f8366-202c-49a7-a321-e6e4f56ca8e0` (GPT Image 2.5); animation `e262b4bb-d608-4ff9-8c04-a56f7b290d40` (Kling 3.0 Turbo). Delivered as `Images/portal-world.webp` and `Media/portal-world.mp4`.

The public resume PDF and legacy resume image use the public email address. The phone number and school email are removed from the current contact page and resume assets.

## Local development and checks

Serve the repository with any static HTTP server (for example `python3 -m http.server`). Run `node tests/studio.cjs` for the current smoke test. Keep all URLs relative so the site keeps working under the `/Portfolio/` GitHub Pages prefix (`404.html` uses `<base href="/Portfolio/">`).
