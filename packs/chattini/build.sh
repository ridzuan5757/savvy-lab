#!/bin/sh
# Builds the Chattini sprite pack for savvy-progress on this machine.
#
# The agent frames come from Raora Panthera's emotes, which are COVER Corp.'s
# art: this script downloads them from hololive.wiki to your machine and
# renders the pack there. This repository ships none of them. The bench items
# and marks are drawn for this pack (render-items.html).
#
# Needs: curl, python3 with Pillow, Google Chrome (or set CHROME).
# Usage: ./build.sh [output folder]   (default ~/.claude/sprite-packs/chattini)
set -eu
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=${1:-$HOME/.claude/sprite-packs/chattini}
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$WORK/source" "$OUT"

# Emotes: one per state (working, reading, thinking, done, failed, planned, overload,
# returned), then the alternates for done, failed, planned and overload.
for n in 33 13 22 19 50 46 25 45 31 49 32 24 47 27; do
  url=$(curl -fsSL -A "savvy-lab-pack-builder" \
    "https://hololive.wiki/w/api.php?action=query&titles=File:Emote-raora$n.png&prop=imageinfo&iiprop=url&format=json" |
    python3 -I -c 'import json,sys; p=json.load(sys.stdin)["query"]["pages"]; print(next(iter(p.values()))["imageinfo"][0]["url"])')
  curl -fsSL -A "savvy-lab-pack-builder" -o "$WORK/source/emote-$n.png" "$url"
done

cp "$HERE/render-frames.html" "$HERE/render-items.html" "$HERE/render-scene.html" "$WORK/"
shot() { "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --force-device-scale-factor=1 --default-background-color=00000000 --virtual-time-budget=2000 \
  --window-size="$1" --screenshot="$WORK/$2" "file://$WORK/$3" 2>/dev/null; }
i=0; while [ $i -lt 8 ]; do shot 3584,272 "frames-$i.png" "render-frames.html?t=$((i * 125))"; i=$((i + 1)); done
i=0; while [ $i -lt 16 ]; do shot 320,170 "scene-$i.png" "render-scene.html?t=$((i * 125))"; i=$((i + 1)); done
shot 1024,194 items.png render-items.html

python3 -I "$HERE/make-pack.py" "$WORK" "$OUT"
echo "In Claude Code: /agents-theme chattini   (themes are found in ~/.claude/sprite-packs)"
