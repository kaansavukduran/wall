# Architecture

- Start: index.html and start.js display the reference-led Fragaria loader and call start() after browser initialization.
- Runtime: game.js owns the chronological chapter state, focus and movement, source and study panels, and local progression. Completion is keyed by chapter ID. v0.1 saves remain readable.
- Art: world.js caches scenery, advances the visitor from animation frame time and only redraws active movement or changed scenes.
- Content: content.js assembles the chronological campaign. scenes.js and sequences.js supply the stage models and ordering tasks. The six four-chapter evidence decks load when their disclosure opens. The study room has separate calendar, atlas, Kotel, language and Kabbalah modules. catalogue.js loads the public docs/SOURCES.tsv on demand.
- Local progress: the campaign uses wall.progress.v1. The exhibition keeps earlier wall.tour.0 through wall.tour.2 source choices and wall.journal notes, with additional keys for matched evidence and the open question. Study drafts stay in local storage.
- Testing: tests/browser.cjs exercises the full route with Playwright. WALL_BROWSER_ENGINE selects Chromium, Firefox or WebKit. The browser compatibility workflow installs each engine on GitHub runners. The installed smoke workflow separately launches the AppImage, both Windows binaries and an Android API 35 emulator.
- Deployment: scripts/build.mjs exports static files. The live Pages site uses the branch source in gh-pages. scripts/publish-pages.sh builds a clean main revision, updates that branch by fast-forward and records the source commit in build.json. The Actions workflow deploys directly when the repository publishes through the workflow source.
