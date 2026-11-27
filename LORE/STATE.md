# WALL state

Repository: kaansavukduran/wall
Ref: main
Base: v0.3.0 runtime 1c121a18cf92428eb887f431ccfe10139493fc5e.
Current: v0.4.1 preview adds Windows Setup and portable, Linux AppImage, and Android APK workflows. Desktop and Android package the same static game and store progress locally. Added ritual exercises in chapters 1 and 5, visible controller focus, and reduced per-frame allocations.
Validation: Chromium covered all 25 checkpoints in each language and simulated standard browser and native Android controller event paths. v0.4.0 released all five packages. Its extracted AppImage started and played locally; Windows Setup and Portable started on Windows CI, and Android reached the first screen on an API 35 emulator. Physical gamepad remains untested. Local Chromium cold-start medians were 132 ms and 156 ms (five samples per version, overlapping ranges); no speed improvement established.
Pages: BLOCKED. Integration returned HTTP 403; GitHub repository reports has_pages=false. Cloud browser is at GitHub sign-in for the owner account.
Next: Verify release attachments and, once the owner session is available, enable GitHub Actions in Pages, deploy and test the live URL. Then expand the historical reenactments and study modules beyond the playable preview.
