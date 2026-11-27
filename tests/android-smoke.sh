#!/usr/bin/env bash
set -euo pipefail
adb install WALL-*.apk
adb shell am start -W -n com.fragariainteractive.wall/.WallActivity
adb shell pidof com.fragariainteractive.wall
for attempt in {1..12}; do
  adb shell uiautomator dump /sdcard/wall-window.xml >/dev/null 2>&1 || true
  screen="$(adb shell cat /sdcard/wall-window.xml 2>/dev/null || true)"
  if grep -Eq 'Timeline|Zaman çizelgesi|A trail of stone|Bir taşın izi' <<< "$screen"; then
    echo 'The bundled game reached the first playable scene'
    exit 0
  fi
  sleep 2
done
adb logcat -b crash -d
exit 1
