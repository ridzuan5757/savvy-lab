#!/bin/sh
# Renders every sprite frame with headless Chrome, then cuts them into
# savvy-progress/assets/ with make-assets.py. Needs Google Chrome and Python 3 with Pillow.
set -eu
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=${1:-$HERE/out}
DST=${2:-$HERE/../../savvy-progress/assets}
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
mkdir -p "$OUT"
shot() { "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --force-device-scale-factor=1 --default-background-color=00000000 --virtual-time-budget=2000 \
  --window-size="$1" --screenshot="$OUT/$2" "file://$HERE/$3" 2>/dev/null; }
for i in 0 1 2 3 4 5 6 7; do shot 3072,1904 "blobs-$i.png" "render-blobs.html?t=$((i * 125))"; done
for m in base mask; do shot 1024,160 "items-$m.png" "render-items.html?mode=$m"; done
i=0; while [ $i -lt 16 ]; do
  shot 256,1904 "b2blob-$i.png" "render-build2.html?mode=blob&t=$((i * 125))"
  shot 320,170 "b2scene-$i.png" "render-build2.html?mode=scene&t=$((i * 125))"
  i=$((i + 1))
done
python3 -I "$HERE/make-assets.py" "$OUT" "$DST"
