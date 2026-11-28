# WALL

WALL is a four-language 2D pixel-art game about the Western Wall, Jewish history, texts and thought. Follow 24 chronological chapters, compare evidence and build a three-source exhibition. The study room includes the Jewish calendar, communities, everyday life, diasporas, Hebrew and Aramaic, and Kabbalah.

The atlas covers ancient groups, regional communities and later movements. Activities include the Geniza letters, a turnable Talmud folio, the 1930 commission map, Safed’s three reading tables, and an interactive model of Yehuda Ashlag’s four phases, screen and returning light.

[Play WALL in your browser](https://kaansavukduran.github.io/wall/)

## Play locally

Open the standalone HTML file from [GitHub Releases](https://github.com/kaansavukduran/wall/releases) directly in a browser that permits downloaded HTML files. The game and its catalogue are bundled; following external source links still requires an internet connection.

For the static ZIP or a source checkout:

1. Extract the web ZIP, or open this checkout in a terminal.
2. Run `python3 -m http.server 8000` in the directory containing `index.html`.
3. Open http://localhost:8000/. Select Türkçe, English, עברית or Azərbaycanca. Choose **New game** for the plaza or **Continue** to return to the visitor’s last position in the chapter. Use the onscreen arrows or the keyboard. Inspect the scene, open a source and choose an answer to proceed. In each chapter, try a new example after answering. Progress and your explanation drafts are saved in the browser.

## Build and verify

- `node --test tests/content.test.js`
- `node scripts/build.mjs` creates a clean `site` directory for static hosting. Remove old build output before a new local build.
- `node tests/browser.cjs http://localhost:8000/` runs a Chromium route if Playwright is installed. Set `WALL_BROWSER` optionally to use a system Chromium. The test completes all chapters in each language and covers the source catalogue, ordering exercises, gematria, ABYA, final tour, load recovery and persistence.
- [Campaign plan](docs/PLAN.md) · [Source catalogue](docs/SOURCES.tsv) · [Asset provenance](assets/PROVENANCE.md)

## Controllers and downloads

A standard controller uses the left stick to walk, the D-pad to navigate, A to select, B to close a panel, X to inspect, Y for the timeline and Start for the study room. A on a select field cycles its options. Controller compatibility depends on the operating system and device mapping.

See [GitHub Releases](https://github.com/kaansavukduran/wall/releases) for the web ZIP, Windows x64 setup and portable executables, Linux x64 AppImage, and Android preview APK. Windows previews are unsigned. Android preview certificates can differ between versions, which prevents in-place updates between those APKs. Removing an installed version can erase its local progress. Native source and packaging are under `desktop/` and `android/`.

In versions that include **Settings → Transfer a save**, create save text and keep a copy before changing installations. Paste it into the new copy of WALL, review the chapter and draft counts, and select **Merge saves**. Chapter progress is combined and existing drafts on the destination are kept. The transfer works offline. When an older preview lacks this screen, its save remains in that installation.

If the browser refuses a write, WALL keeps the changes in the open session and shows a warning. Before closing the game, copy the save text from Settings or select **Try saving again** once storage is available.

Tabs sharing the same browser profile keep all completed chapters. On the opening screen, **Continue** uses the last scene saved in that profile.

**Settings → Appearance and motion** offers dark, light, system and high-contrast palettes, an 80–200% scale and reduced animation. Each preference is saved separately and can travel in a save from this version.

This repository publishes Pages from `gh-pages`. To publish a tested release, push it to `main` and run `bash scripts/publish-pages.sh` from that clean checkout. Check the published `build.json` for the version, commit, four locales, save schema and plan, content, catalogue and engine fingerprints. The single-file HTML includes the same build record.
