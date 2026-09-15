# Featured Work verification

Install Playwright in your development environment. These Node scripts use Microsoft Edge by default; set PLAYWRIGHT_CHANNEL=chrome to use installed Chrome.

Serve the repository with a static web server at http://127.0.0.1:8123/ (or set TEST_URL to your server URL, including its trailing slash). Run from the repository root:

    node tests/featured-work.cjs
    node tests/featured-work-interactions.cjs
    node tests/snake.cjs

Screenshots and the 54-case layout report go to test-results/ (override with QA_OUTPUT). The interaction check uses the public MDN CC0 flower video as a temporary playback fixture; it does not add that video to the portfolio.

The matrix tests all six projects at 2560×1080, 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 430×932, 390×844, and 360×800. It checks stable shell dimensions, image containment, every gallery item, wrapping gallery controls, focus return, Escape, backdrop dismissal, overflow, and embedded Snake sizing. Additional tests cover focus cycling, scroll locking, video playback, deep links, reduced motion, game input, game-over, replay, and resizing.

## Media configuration

Project data lives at the top of work-samples.js. Existing images arrays use the shared gallery. To add real gameplay clips later, use a media array instead:

    media: [
      { type: 'image', src: 'Images/example.webp', alt: 'Combat screen' },
      { type: 'video', src: 'Videos/gameplay.mp4', poster: 'Images/example.webp', alt: 'Gameplay footage' }
    ]

The shell and stage dimensions are shared for images, video, and embedded projects. Database content is a screenshot case study; its live button opens the PHP backend on the school server. GitHub Pages does not execute that PHP.

site.css is the active shared stylesheet. work-samples.css only imports it for compatibility. Legacy ARC Raiders assets are preserved.
