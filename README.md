# WALL

A four-language 2D pixel-art learning game about the Western Wall, Jewish history and Jewish thought. Explore Wall visits and prayer in the prologue, follow the 24-chapter route, and build your own three-source exhibition at the end. Open three kinds of Qumran scrolls, turn a Talmud folio, compare two family letters in the Geniza workbench, and move between the Galilee cave tradition, Meron pilgrimage and the Merton Zohar copy. Three reading tables in Safed show how a Pesah rule, an ethical example and a mystical diagram answer different questions. In the Mandate chapter, compare the 1928 screen incident with the 1930 commission’s ownership, access and passage rules. The closing chapter includes a source-linked conversation about listening, the study group and the prayer minyan. The study room includes everyday Jewish life, the festival calendar, illustrated diaspora objects, community atlas, migration archive, Kabbalah workshop with advanced comparisons Hebrew–Aramaic readings, and an archive comparing records of violence and responsibility from the Hasmonean period to 1994.

## Play locally

Open the standalone HTML file from [GitHub Releases](https://github.com/kaansavukduran/wall/releases) directly in a browser that permits downloaded HTML files. The game and its catalogue are bundled; following external source links still requires an internet connection.

For the static ZIP or a source checkout:

1. Extract the web ZIP, or open this checkout in a terminal.
2. Run `python3 -m http.server 8000` in the directory containing `index.html`.
3. Open http://localhost:8000/. Select Türkçe, English, עברית or Azərbaycanca. Use the onscreen arrows or the keyboard. Inspect the scene, open a source and choose an answer to proceed. In each chapter, try a new example after answering. Progress and your explanation drafts are saved in the browser.

## Build and verify

- `node --test tests/content.test.js`
- `node scripts/build.mjs` creates a clean `site` directory for static hosting. Remove old build output before a new local build.
- `node tests/browser.cjs http://localhost:8000/` runs a Chromium route if Playwright is installed. Set `WALL_BROWSER` optionally to use a system Chromium. The test completes all chapters in each language and covers the source catalogue, ordering exercises, gematria, ABYA, final tour, load recovery and persistence.
- [Campaign plan](docs/PLAN.md) · [Source catalogue](docs/SOURCES.tsv) · [Asset provenance](assets/PROVENANCE.md)

## Controllers and downloads

A standard controller uses the left stick to walk, the D-pad to navigate, A to select, B to close a panel, X to inspect, Y for the timeline and Start for the study room. A on a select field cycles its options. Controller compatibility depends on the operating system and device mapping.

See [GitHub Releases](https://github.com/kaansavukduran/wall/releases) for the web ZIP, Windows x64 setup and portable executables, Linux x64 AppImage, and Android preview APK. Windows previews are unsigned. Android preview certificates can differ between versions, which prevents in-place updates between those APKs. Removing an installed version can erase its local progress. Native source and packaging are under `desktop/` and `android/`.

In versions that include **Settings → Transfer a save**, create save text and keep a copy before changing installations. Paste it into the new copy of WALL, review the chapter and draft counts, and select **Merge saves**. Chapter progress is combined and existing drafts on the destination are kept. The transfer works offline. When an older preview lacks this screen, its save remains in that installation.

**Settings → Appearance and motion** offers dark, light, system and high-contrast palettes, an 80–200% scale and reduced animation. Each preference is saved separately and can travel in a save from this version.

[Play WALL on GitHub Pages](https://kaansavukduran.github.io/wall/). This repository publishes from `gh-pages`. To publish a tested release, push it to `main` and run `bash scripts/publish-pages.sh` from that clean checkout. Verify the live version in `build.json` and play the changed scene from the published site.
