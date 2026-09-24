# River Hine — Portfolio

## GROVEFALL and future development work

- `Grovefall.html` is the public samurai action-game concept page, with the current trailer and version carousel.
- `GrovefallGDD.html` is the readable public game design document; `docs/grovefall-gdd.md` is its editable source and `Documents/GROVEFALL-GDD.pdf` is the download.
- `CustomAIResearch.html` records a research-stage AI workflow project without claiming a released product.
- The cinematic carousel deliberately loads only the selected video. GROVEFALL trailers are AI-generated gameplay visions and always carry that disclosure.

A static portfolio for game development, systems design, and web projects, with a cinematic motion-led homepage inspired by the immersive examples in the MotionSites gallery.

## Pages

- `index.html`: full-screen cinematic hero, interactive project theater, and a scroll-driven flagship walkthrough.
- `GildedFate.html`: flagship case study with a keyboard- and touch-accessible systems explorer.
- `ExplodingNuts.html` and `WebsiteRedesigns.html`: supporting case studies.
- `WorkSample.html`: complete galleries, smaller projects, learning lab, and timeline.
- `About.html`, `Resume.html`, and `Contact.html`: background, HTML resume, and public contact.
- `Certifications.html`: supporting credentials, linked from the resume and footer.

The original page names, gallery hash links, `Project/` demos, and legacy ARC assets are intentionally preserved. GitHub Pages serves static files; the database explorer is a read-only snapshot rather than a PHP backend.

## Design and behavior

`site.css` retains the tested gallery/dialog geometry. `redesign.css` defines case-study layouts. `motion.css` and `motion.js` provide the cinematic identity, pointer depth, scroll reveals, project selector, and sticky walkthrough. `navigation.js` adds mobile disclosure navigation while keeping links usable without JavaScript. `interactions.js` handles the dedicated Gilded Fate systems explorer. `smooth-scroll.js` eases discrete mouse-wheel steps while preserving native trackpad/touch input, nested scrollers, keyboard input, and reduced-motion preferences. No framework, build step, external fonts, or animation library is required.

Project descriptions and resume facts come from existing repository content. Website redesigns are independent concepts, not commissioned-client claims. Gilded Fate and the prototypes remain explicitly in development.

## Media

Existing gameplay and screenshots remain the project evidence. Higgsfield concept artwork and animation supply the full-screen atmosphere and are labeled as not gameplay. The muted hero film automatically plays in a loop, without an activation button, and pauses offscreen or when the page is hidden. Reduced-motion and data-saving preferences disable automatic video loading. If autoplay is blocked, the artwork remains visible. Project media uses the original screenshots, without fabricated gameplay or outcomes.

Generation provenance: image `63fb267a-763f-4cbb-82e8-8a7b20f407ea` (GPT Image 2.5); animation `29518861-35b0-4f36-bd8d-1847a4fcd891` (Kling 3.0 Turbo).

The public resume PDF and legacy resume image use the public email address. The phone number and school email are removed from the current contact page and resume assets. Existing Git history is not rewritten.

## Local development and checks

Serve the repository with any static HTTP server. There is no build step. See `tests/README.md` for browser checks. Existing demos can also be opened directly through their project links.

Maintain all relative URLs so the site continues working under the `/Portfolio/` GitHub Pages prefix.

Portal hero provenance: image `324f8366-202c-49a7-a321-e6e4f56ca8e0` (GPT Image 2.5); animation `e262b4bb-d608-4ff9-8c04-a56f7b290d40` (Kling 3.0 Turbo). Delivered as `Images/portal-world.webp` and `Media/portal-world.mp4`.
