# Architecture

- Start: index.html and start.js display the reference-led Fragaria loader and call start() after browser initialization.
- Runtime: game.js owns the chronological chapter state, focus and movement, source and study panels, and local progression. Completion is keyed by chapter ID. v0.1 saves remain readable.
- Art: world.js caches scenery, advances the visitor from animation frame time and only redraws active movement or changed scenes.
- Content: content.js assembles the campaign. library.js, scenes.js, sequences.js and ancient-lessons.js contain readings, scene models and exercises. catalogue.js loads the public TSV on demand. Research lives in docs/SOURCES.tsv.
- Deployment: scripts/build.mjs exports static files. The live Pages site uses the branch source in gh-pages. scripts/publish-pages.sh builds a clean main revision, updates that branch by fast-forward and records the source commit in build.json. The Actions workflow deploys directly when the repository publishes through the workflow source.
