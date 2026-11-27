# WALL

A four-language 2D pixel-art learning game about the Western Wall, Jewish history and Jewish thought. The 0.4 preview connects all 24 planned chapters to a first playable route. A full production build still needs deeper historical reenactments, expanded readings, editorial review and device testing.

## Play locally

Open `WALL-v0.4.1-Offline.html` from [the release](https://github.com/kaansavukduran/wall/releases/tag/v0.4.1) directly in a browser that permits downloaded HTML files. The game and its catalogue are bundled; following external source links still requires an internet connection.

For the static ZIP or a source checkout:

1. Extract the web ZIP, or open this checkout in a terminal.
2. Run `python3 -m http.server 8000` in the directory containing `index.html`.
3. Open http://localhost:8000/. Select Türkçe, English, עברית or Azərbaycanca. Use the onscreen arrows or the keyboard. Inspect the scene, open a source and choose an answer to proceed. Progress and the finale note are saved in the browser.

## Build and verify

- `node --test tests/content.test.js`
- `node scripts/build.mjs` creates a clean `site` directory for static hosting. Remove old build output before a new local build.
- `node tests/browser.cjs http://localhost:8000/` runs a Chromium route if Playwright is installed. Set `WALL_BROWSER` optionally to use a system Chromium. The test completes all chapters in each language and covers the source catalogue, ordering exercises, gematria, ABYA, final tour, load recovery and persistence.
- [Campaign plan](docs/PLAN.md) · [Source catalogue](docs/SOURCES.tsv) · [Asset provenance](assets/PROVENANCE.md)

## Controllers and downloads

A standard controller uses the left stick to walk, the D-pad to navigate, A to select, B to close a panel, X to inspect, Y for the timeline and Start for the study room. A on a select field cycles its options. Controller compatibility depends on the operating system and device mapping.

See [GitHub Releases](https://github.com/kaansavukduran/wall/releases) for the web ZIP, Windows x64 setup and portable executables, Linux x64 AppImage, and Android preview APK. Windows previews are unsigned. Android preview certificates can differ between versions, which prevents in-place updates between those APKs. Removing an installed version can erase its local progress. Native source and packaging are under `desktop/` and `android/`.

Pages target: https://kaansavukduran.github.io/wall/
