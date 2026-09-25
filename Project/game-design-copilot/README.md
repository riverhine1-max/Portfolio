# Game Design Copilot (live build)

This folder is the built web app that the portfolio links to
(`GameDesignCopilot.html` → "Open the app"). GitHub Pages serves it at
`/Portfolio/Project/game-design-copilot/`.

These are generated files: don't edit them by hand. To update the app, change the
source project, run `npm run build` there, and copy everything in its `dist/`
folder into this folder (replace the old files).

The free built-in AI downloads its model the first time someone uses it and needs
a WebGPU browser (recent Chrome or Edge, or Safari on macOS / iOS 26).
