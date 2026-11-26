# Architecture

- Start: index.html and start.js display the reference-led Fragaria loader and call start() after browser initialization.
- Runtime: game.js owns the chronological chapter state, focus and movement, source and study panels, and local progression. Completion is keyed by chapter ID. v0.1 saves remain readable.
- Art: world.js caches scenery, advances the visitor from animation frame time and only redraws active movement or changed scenes.
- Content: content.js assembles chapters-early.js, chapters-modern.js and the architecture lessons. library.js and scenes.js contain optional readings and simulations. The campaign plan and source catalogue live in docs.
- Deployment: scripts/build.mjs exports static files. .github/workflows/pages.yml tests, builds and deploys the main revision to /wall/ once Pages is enabled. Build identity is in build.json.
