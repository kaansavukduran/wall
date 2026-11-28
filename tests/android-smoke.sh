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
  local label="$1" after="${2:-}" point action x y end
  for attempt in {1..8}; do
    if ! read_screen; then continue; fi
    if [[ -n "$after" ]] && grep -Eq "$after" "$screen_file"; then return 0; fi
    point=$(python3 - "$screen_file" "$label" <<'PY'
import re
import sys
from xml.etree import ElementTree

screen, pattern = sys.argv[1:]
nodes = list(ElementTree.parse(screen).iter("node"))

def bounds(node):
    return tuple(map(int, re.findall(r"-?[0-9]+", node.get("bounds", ""))))

webview = next(node for node in nodes if node.get("class") == "android.webkit.WebView")
left, top, right, bottom = bounds(webview)
center = (left + right) // 2
upper = top + (bottom - top) // 6
lower = bottom - (bottom - top) // 6
scroll_up = False
for node in nodes:
    if not any(re.fullmatch(pattern, node.get(key, "")) for key in ("text", "content-desc")):
        continue
    x1, y1, x2, y2 = bounds(node)
    if x2 <= x1 or y2 <= y1:
        continue
    visible_left, visible_top = max(left, x1), max(top, y1)
    visible_right, visible_bottom = min(right, x2), min(bottom, y2)
    if visible_right > visible_left and visible_bottom > visible_top:
        print("tap", (visible_left + visible_right) // 2, (visible_top + visible_bottom) // 2, 0)
        break
    scroll_up = y2 <= top
else:
    start, end = (upper, lower) if scroll_up else (lower, upper)
    print("swipe", center, start, end)
PY
    )
    read -r action x y end <<< "$point"
    if [[ "$action" == tap ]]; then
      echo "Tap $label at $x,$y"
      adb shell input tap "$x" "$y"
      if [[ -z "$after" ]]; then return 0; fi
    else
      echo "Scroll to $label from $x,$y to $x,$end"
      adb shell input swipe "$x" "$y" "$x" "$end" 400
    fi
  done
  if read_screen; then
    if [[ -n "$after" ]] && grep -Eq "$after" "$screen_file"; then return 0; fi
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

activate_with_gamepad() {
  local label="$1" after="$2" selected
  for attempt in {1..18}; do
    adb shell input gamepad keyevent KEYCODE_DPAD_DOWN
    if ! read_screen; then continue; fi
    selected=$(python3 - "$screen_file" "$label" <<'PY'
import re
import sys
from xml.etree import ElementTree

screen, pattern = sys.argv[1:]
for node in ElementTree.parse(screen).iter("node"):
    if node.get("focused") == "true" and any(
        re.fullmatch(pattern, node.get(key, "")) for key in ("text", "content-desc")
    ):
        print("yes")
        break
PY
    )
    if [[ "$selected" == yes ]]; then
      echo "Activate $label with the emulator gamepad"
      adb shell input gamepad keyevent KEYCODE_BUTTON_A
      wait_for_screen "$after"
      return
    fi
  done
  echo "Gamepad focus did not reach: $label" >&2
  return 1
}

adb install WALL-*.apk
adb shell am start -W -n "$package/.WallActivity"
adb shell pidof "$package"
plaza='A trail of stone|Bir taşın izi|בעקבות האבן|Daşın izi'
new_game='New game|Yeni oyun|משחק חדש'
wait_for_screen "$plaza|$new_game"
tap_label "$new_game" "$plaza"
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
activate_with_gamepad 'Continue|Devam et|המשך|Davam et' 'Solomon’s description|Süleyman’ın tasviri|תיאור מקדש שלמה|Süleyman məbədinin təsviri'
wait_for_screen 'Solomon’s description|Süleyman’ın tasviri|תיאור מקדש שלמה|Süleyman məbədinin təsviri'
adb shell cmd window user-rotation lock 0
wait_for_screen 'rotation="0"'

adb shell am force-stop "$package"
adb shell am start -W -n "$package/.WallActivity"
resume='Continue|Devam et|המשך|Davam et'
chapter_two='An exact plan recovered in excavation|Kazıda bulunan birebir plan|תוכנית מדויקת שנתגלתה בחפירה|Qazıntıda tapılmış dəqiq plan'
wait_for_screen "$chapter_two|$resume"
tap_label "$resume" "$chapter_two"
echo 'The Android APK completed checkpoints in both orientations, handled emulator gamepad buttons and restored chapter 2 after relaunch'
