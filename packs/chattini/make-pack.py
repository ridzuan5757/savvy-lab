"""Cuts the Chrome screenshots from build.sh into a savvy-progress sprite pack.

<state>-<frame>.png        256x272, the agent frames (from the official emotes)
items/<kind>-<state>.png   80x136 (5x4 cells), Chattini's bench items
items/puff<0|1>.png        a deleted file's puff
items/bench*.png           the cafe counter tiles (16x34 px per cell)
<state>~<n>-<frame>.png   alternates of a state, one picked per run
scene-<frame>.png          the planned rows' build loop, 320x170 (20x5 cells)
pack.json                  { name, frames, frameMs, states, variants, items, bench, scene }
"""
import json
import os
import sys

from PIL import Image

WORK, OUT = sys.argv[1], sys.argv[2]
STATES = ['working', 'reading', 'thinking', 'done', 'failed', 'planned', 'overload', 'returned']
# Cells in render-frames.html order: the states, then the alternates as <state>~<n>.
CELLS = STATES + ['done~1', 'done~2', 'failed~1', 'failed~2', 'planned~1', 'overload~1']
VARIANTS = {'done': 3, 'failed': 3, 'planned': 2, 'overload': 2}
FRAMES = 8
SCENE = 16
os.makedirs(f'{OUT}/items', exist_ok=True)

for f in range(FRAMES):
    shot = Image.open(f'{WORK}/frames-{f}.png').convert('RGBA')
    for i, s in enumerate(CELLS):
        shot.crop((i * 256, 0, i * 256 + 256, 272)).save(f'{OUT}/{s}-{f}.png', optimize=True)
for f in range(SCENE):
    Image.open(f'{WORK}/scene-{f}.png').convert('RGBA').save(f'{OUT}/scene-{f}.png', optimize=True)

sheet = Image.open(f'{WORK}/items.png').convert('RGBA')
over = [sheet.crop((j * 48, 112, j * 48 + 48, 160)) for j in range(6)]
TW, TH = 80, 136
for k in range(8):
    item = sheet.crop((k * 128 + 24, 0, k * 128 + 104, 112))
    for state in ['plain', 'new0', 'new1', 'edit0', 'edit1']:
        t = Image.new('RGBA', (TW, TH), (0, 0, 0, 0))
        t.alpha_composite(item, (0, TH - 112 + 2))
        if state.startswith('new'):
            t.alpha_composite(over[int(state[-1])], (16, 0))
        if state.startswith('edit'):
            t.alpha_composite(over[2 + int(state[-1])], (16, 0))
        t.save(f'{OUT}/items/{k}-{state}.png', optimize=True)
for f in range(2):
    t = Image.new('RGBA', (TW, TH), (0, 0, 0, 0))
    t.alpha_composite(over[4 + f], (16, TH - 64))
    t.save(f'{OUT}/items/puff{f}.png', optimize=True)
for i, (name, cols) in enumerate([('bench-left', 5), ('bench5', 5), ('bench1', 1), ('bench-right', 5)]):
    sheet.crop((i * 128, 160, i * 128 + cols * 16, 194)).save(f'{OUT}/items/{name}.png', optimize=True)

json.dump({'name': 'Chattini', 'frames': FRAMES, 'frameMs': 125, 'states': STATES, 'variants': VARIANTS, 'items': 8, 'bench': True, 'scene': SCENE}, open(f'{OUT}/pack.json', 'w'), indent=2)
print(f'pack written to {OUT}')
