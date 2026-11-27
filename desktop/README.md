# WALL desktop packaging

This package wraps the existing static game in Electron without exposing Node.js APIs to the page. The app serves only the staged game files through a restricted `wall://app/` protocol. External source links open in the system browser.

## Build

Use Node.js 22 or newer and install dependencies in this directory:

```sh
npm ci
npm run dist:linux
```

The Linux command creates an x64 AppImage in `dist/`. On Windows, run `npm run dist:windows` to create an NSIS `WALL-<version>-win-x64.exe` installer and a portable `.exe`. Windows packages should be built on a Windows runner. `npm run dist:all` is available for matrix or release jobs, but should be run separately on Ubuntu and Windows hosts.

## Release packaging

Publishing a GitHub Release now starts the platform package workflow for the matching tag. It builds the x64 AppImage on Ubuntu and builds Windows Setup and Portable on a Windows runner. The workflow checks each package and attaches it to the release. The installed binary smoke test is a separate workflow using the release assets.

On Linux, make the downloaded AppImage executable with `chmod +x` and run it. If FUSE is unavailable, the same AppImage supports `--appimage-extract-and-run`. The Windows portable build starts directly. The two Windows preview executables are unsigned.
