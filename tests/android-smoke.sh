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
  local label="$1" after="${2:-}" point x y height width portrait_width
  for attempt in {1..5}; do
    if read_screen; then
      if [[ -n "$after" ]] && grep -Eq "$after" "$screen_file"; then return 0; fi
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
        echo "Tap $label at $x,$y"
        adb shell input tap "$x" "$y"
        if [[ -z "$after" ]]; then return 0; fi
        continue
      fi
    fi
    # Scroll the document above the navigation bar to reveal the next control.
    read -r width height < <(adb shell wm size | tail -1 | sed -E 's/.* ([0-9]+)x([0-9]+)/\1 \2/')
    if grep -Eq 'rotation="[13]"' "$screen_file"; then
      portrait_width="$width"
      width="$height"
      height="$portrait_width"
    fi
    adb shell input swipe "$((width / 2))" "$((height * 4 / 5))" "$((width / 2))" "$((height / 3))" 400
  done
  if read_screen; then
    python3 - "$screen_file" <<'PYDIAG'
import sys
from xml.etree import ElementTree
root = ElementTree.parse(sys.argv[1]).getroot()
print("Rotation:", root.get("rotation"))
print("Visible labels:", [node.get("text") for node in root.iter("node") if node.get("text")])
PYDIAG
  fi
  echo "Tap could not reach the expected state: $label -> $after" >&2
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
echo 'Play the plaza in portrait'
tap_label 'Western retaining wall|Batı istinat duvarı|הקיר התומך המערבי|Qərb istinad divarı' 'Correct. The Kotel|Doğru. Kotel|נכון. הכותל|Doğrudur. Kotel'
tap_label 'Continue|Devam et|המשך|Davam et' 'At the seder table|Seder sofrası|ליד שולחן הסדר|Seder süfrəsində'
wait_for_screen 'At the seder table|Seder sofrası|ליד שולחן הסדר|Seder süfrəsində'

adb shell cmd window user-rotation lock 1
wait_for_screen 'rotation="1"'
wait_for_screen 'At the seder table|Seder sofrası|ליד שולחן הסדר|Seder süfrəsində'
python3 - "$screen_file" <<'PYLANDSCAPE'
import re
import sys
from xml.etree import ElementTree

webviews = [node for node in ElementTree.parse(sys.argv[1]).iter("node")
            if node.get("class") == "android.webkit.WebView"]
for node in webviews:
    x1, y1, x2, y2 = map(int, re.findall(r"[0-9]+", node.get("bounds", "")))
    if x2 - x1 > y2 - y1 > 0:
        break
else:
    sys.exit("WALL WebView did not expose a landscape viewport")
PYLANDSCAPE
adb shell input gamepad keyevent KEYCODE_BUTTON_Y
wait_for_screen 'Unlocked chapters|Açık bölümler|פרקים פתוחים|Açıq bölmələr'
adb shell input gamepad keyevent KEYCODE_BUTTON_B
wait_for_screen 'At the seder table|Seder sofrası|ליד שולחן הסדר|Seder süfrəsində'
echo 'Play chapter 1 in landscape'
tap_label 'An early record of the name Israel in Canaan|Kenan’da İsrail adının erken bir kaydı|אזכור קדום של השם ישראל בכנען|Kənanda İsrail adının erkən qeydi' 'The inscription records a name|Yazıt bir topluluk|הכתובת מתעדת שם|Kitabə bir adı'
tap_label 'Continue|Devam et|המשך|Davam et' 'Solomon’s description|Süleyman’ın tasviri|תיאור מקדש שלמה|Süleyman məbədinin təsviri'
wait_for_screen 'Solomon’s description|Süleyman’ın tasviri|תיאור מקדש שלמה|Süleyman məbədinin təsviri'
adb shell cmd window user-rotation lock 0
wait_for_screen 'rotation="0"'

adb shell am force-stop "$package"
adb shell am start -W -n "$package/.WallActivity"
wait_for_screen 'Solomon’s description|Süleyman’ın tasviri|תיאור מקדש שלמה|Süleyman məbədinin təsviri'
echo 'The Android APK completed checkpoints in both orientations, handled emulator gamepad buttons and restored chapter 2 after relaunch'
