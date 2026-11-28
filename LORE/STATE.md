# WALL state

Repository: kaansavukduran/wall
Ref: main
Verified release: v0.6.6, ec928c38bafd515bc424ac6a94c059aa9a828393.
Pages: run 46121535429. Opened the live Settings and confirmed invalid save text is rejected. Browser compatibility run 46121319484 passed in Chromium, Firefox and WebKit. The shared sequence now wraps and the Talmud page uses direct region selection, resolving the enlarged-text failures in v0.6.5.
Packages: v0.6.6 web run 46121537586 passed and platform run 46121537619 builds native packages. The v0.6.5 installed checks passed (46120365541). Actions secrets still return HTTP 403 to the integration. The APK uses preview signing. Physical device and controller tests remain open.
Candidate v0.6.7: added 80–200% appearance scale, dark/light/system/high-contrast color themes and reduced motion in four languages. Current saves can carry these preferences. Checked the primary text and control contrast pairs. All 23 content tests and four Chromium campaigns passed locally, including system color change, 200% at 320 CSS px, relaunch and independent setting resets.
Next: verify v0.6.7 in hosted browsers, release and installed builds. Add the chronological accountability archive.
