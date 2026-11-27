# WALL state

Repository: kaansavukduran/wall
Ref: main
Verified runtime: v0.4.1, 551c3f5bea2acbeb804349546ec6680a515338ef.
Current: v0.4.1 preview adds Windows Setup and portable, Linux AppImage, and Android APK workflows. Desktop and Android package the same static game and store progress locally. Added ritual exercises in chapters 1 and 5, visible controller focus, and reduced per-frame allocations.
Validation: Chromium covered all 25 checkpoints in each language and simulated standard browser and native Android controller event paths. v0.4.1 published the web ZIP, Windows x64 Setup and Portable, Linux x64 AppImage, Android APK and standalone browser file. Run 45942339575 verified the Windows releases and Android API 35 emulator. The downloaded AppImage payload completed the prologue locally. Offline Chromium checked the single-file HTML through an intercepted response; file navigation was blocked by environment policy. The public download matches the tested bytes. Physical gamepad remains untested. Android preview signing certificates differ in v0.4.0 and v0.4.1; stable signing Secrets access returns HTTP 403. Local Chromium cold-start medians were 132 ms and 156 ms (five samples per version, overlapping ranges); no speed improvement established.
Pages: BLOCKED. Integration returned HTTP 403; GitHub repository reports has_pages=false. Cloud browser is at GitHub sign-in for the owner account.
Next: Once the owner session is available, enable GitHub Actions in Pages, deploy and test the live URL. Then expand the historical reenactments and study modules beyond the playable preview.
