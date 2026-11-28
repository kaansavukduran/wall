# WALL state

Repository: kaansavukduran/wall
Ref: main
Live release: v0.6.5, a7925946f2f019ddb7b1df2792b6e2e91f5bc99f.
Pages: run 46120002045. Turned the Talmud folio and solved the reversed reading positions in the live game.
Packages: v0.6.5 web and platform runs 46120045295 and 46120045320 attached six files. Native checks passed (46120365541). Hosted browsers failed the new narrow-screen era-label separation assertion (46120046884), although local Chromium passed. v0.6.4 installed checks passed (46119971982). The integration receives HTTP 403 from Actions secrets; APK uses preview signing. Physical devices and controllers are open.
Candidate v0.6.6: local-only versioned save export and merge with known data validation, existing draft preservation and rollback on a failed write. The era label uses normal flow at all sizes. All 22 unit tests and four local Chromium campaigns passed. Local stand-alone HTML passed with networking blocked, simulated clipboard failure and two isolated profiles. Verify the candidate with Chromium, Firefox and WebKit before Pages and Release.
Next: publish v0.6.6 after the hosted matrix passes, then add accessible reading preferences.
