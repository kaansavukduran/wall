#!/usr/bin/env bash
set -euo pipefail
package=com.fragariainteractive.wall
screen_file=$(mktemp)
trap 'rm -f "$screen_file"' EXIT

read_screen() {
  adb shell uiautomator dump /sdcard/wall-window.xml >/dev/null 2>&1 &&
    adb shell cat /sdcard/wall-window.xml > "$screen_file"
}

wait_for_screen() {
  local labels="$1"
  for attempt in {1..12}; do
    if read_screen && grep -Eq "$labels" "$screen_file"; then return 0; fi
    sleep 2
  done
  adb logcat -b crash -d
  echo "The installed game did not show: $labels" >&2
  return 1
}

tap_label() {
  local label="$1" point x y height width
  for attempt in {1..5}; do
    if read_screen; then
      point=$(python3 - "$screen_file" "$label" <<'PY'
import re
import sys
from xml.etree import ElementTree

screen, pattern = sys.argv[1:]
for node in ElementTree.parse(screen).iter("node"):
    if any(re.fullmatch(pattern, node.get(key, "")) for key in ("text", "content-desc")):
        x1, y1, x2, y2 = map(int, re.findall(r"[0-9]+", node.get("bounds", "")))
        if x2 > x1 and y2 > y1:
            print((x1 + x2) // 2, (y1 + y2) // 2)
            break
PY
)
      if [[ -n "$point" ]]; then
        read -r x y <<< "$point"
        adb shell input tap "$x" "$y"
        return 0
      fi
    fi
    # Scroll the document above the navigation bar to reveal the next control.
    read -r width height < <(adb shell wm size | tail -1 | sed -E 's/.* ([0-9]+)x([0-9]+)/\1 \2/')
    adb shell input swipe "$((width / 2))" "$((height * 4 / 5))" "$((width / 2))" "$((height / 3))" 400
  done
  echo "No tappable control with label: $label" >&2
  return 1
}

adb install WALL-*.apk
adb shell am start -W -n "$package/.WallActivity"
adb shell pidof "$package"
wait_for_screen 'A trail of stone|Bir taşın izi|בעקבות האבן|Daşın izi'
if [[ -n "${WALL_TAG:-}" ]]; then
  version=$(adb shell dumpsys package "$package" | awk '!found && /versionName=/{sub(/.*versionName=/, ""); print; found=1}')
  [[ "$version" == "${WALL_TAG#v}" ]]
fi
tap_label 'Western retaining wall|Batı istinat duvarı|הקיר התומך המערבי|Qərb istinad divarı'
tap_label 'Continue|Devam et|המשך|Davam et'
wait_for_screen 'At the seder table|Seder sofrası|ליד שולחן הסדר|Seder süfrəsində'

adb shell cmd window user-rotation lock 1
wait_for_screen 'rotation="1"'
wait_for_screen 'At the seder table|Seder sofrası|ליד שולחן הסדר|Seder süfrəsində'
adb shell input gamepad keyevent KEYCODE_BUTTON_Y
wait_for_screen 'Unlocked chapters|Açık bölümler|פרקים פתוחים|Açıq bölmələr'
adb shell input gamepad keyevent KEYCODE_BUTTON_B
wait_for_screen 'At the seder table|Seder sofrası|ליד שולחן הסדר|Seder süfrəsində'
adb shell cmd window user-rotation lock 0
wait_for_screen 'rotation="0"'

adb shell am force-stop "$package"
adb shell am start -W -n "$package/.WallActivity"
wait_for_screen 'At the seder table|Seder sofrası|ליד שולחן הסדר|Seder süfrəsində'
echo 'The released Android package accepted touch, preserved chapter 1 through rotation, handled emulator gamepad buttons and restored chapter 1 after relaunch'
