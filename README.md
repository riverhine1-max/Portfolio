# River Hine — Portfolio

A static portfolio for game development, systems design, and web projects.

## Pages

- `index.html`: identity, flagship project, selected work, and opt-in ambient film.
- `GildedFate.html`: flagship case study with a keyboard- and touch-accessible systems explorer.
- `ExplodingNuts.html` and `WebsiteRedesigns.html`: supporting case studies.
- `WorkSample.html`: complete galleries, smaller projects, learning lab, and timeline.
- `About.html`, `Resume.html`, and `Contact.html`: background, HTML resume, and public contact.
- `Certifications.html`: supporting credentials, linked from the resume and footer.

The original page names, gallery hash links, `Project/` demos, and legacy ARC assets are intentionally preserved. GitHub Pages serves static files; the database explorer is a read-only snapshot rather than a PHP backend.

## Design and behavior

`site.css` retains the tested gallery/dialog geometry. `redesign.css` defines the editorial visual system and page layouts. `navigation.js` adds mobile disclosure navigation while keeping the links usable without JavaScript. `interactions.js` handles the Gilded Fate explorer and ambient film. No framework, build step, external fonts, or animation library is required.

Project descriptions and resume facts come from existing repository content. Website redesigns are independent concepts, not commissioned-client claims. Gilded Fate and the prototypes remain explicitly in development.

## Media

Existing gameplay and screenshots remain the project evidence. `Images/portfolio-brand.webp` and `Media/portfolio-brand.mp4` are conceptual artwork and animation generated with Higgsfield for this portfolio. They are visibly labeled as not gameplay. The film loads only on user request, has a pause control, and pauses when offscreen or when the page is hidden. It never autoplays, including under reduced-motion preferences.

Generation provenance: image `63fb267a-763f-4cbb-82e8-8a7b20f407ea` (GPT Image 2.5); animation `29518861-35b0-4f36-bd8d-1847a4fcd891` (Kling 3.0 Turbo).

The public resume PDF and legacy resume image use the public email address. The phone number and school email are removed from the current contact page and resume assets. Existing Git history is not rewritten.

## Local development and checks

Serve the repository with any static HTTP server. There is no build step. See `tests/README.md` for browser checks. Existing demos can also be opened directly through their project links.

Maintain all relative URLs so the site continues working under the `/Portfolio/` GitHub Pages prefix.
