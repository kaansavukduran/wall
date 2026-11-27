# WALL desktop packaging

This package wraps the existing static game in Electron without exposing Node.js APIs to the page. The app serves only the staged game files through a restricted `wall://app/` protocol. External source links open in the system browser.

## Build

Use Node.js 22 or newer and install dependencies in this directory:

```sh
npm install
npm run dist:linux
```

The Linux command creates an x64 AppImage in `dist/`. On Windows, run `npm run dist:windows` to create an NSIS `WALL-<version>-win-x64.exe` installer and a portable `.exe`. Windows packages should be built on a Windows runner. `npm run dist:all` is available for matrix or release jobs, but should be run separately on Ubuntu and Windows hosts.

## CI note

The repository's release and Pages workflows live in the root `.github/workflows/` directory. This desktop-owned change does not alter those workflow files. To publish desktop artifacts automatically, add a Windows and Ubuntu matrix to the existing release workflow or invoke these commands from a new root workflow. Attach `desktop/dist/*` to the matching release after validating each artifact.
