"""Cuts the Chrome screenshots from build.sh into a savvy-progress sprite pack.

<state>-<frame>.png        256x272, the agent frames (from the official emotes)
items/<kind>-<state>.png   80x136 (5x4 cells), Chattini's bench items
items/puff<0|1>.png        a deleted file's puff
items/bench*.png           the cafe counter tiles (16x34 px per cell)
pack.json                  { name, frames, frameMs, states, items, bench }
"""
import json
import os
import sys

from PIL import Image

WORK, OUT = sys.argv[1], sys.argv[2]
STATES = ['working', 'reading', 'thinking', 'done', 'failed', 'planned', 'overload', 'returned']
FRAMES = 8
os.makedirs(f'{OUT}/items', exist_ok=True)

for f in range(FRAMES):
    shot = Image.open(f'{WORK}/frames-{f}.png').convert('RGBA')
    for i, s in enumerate(STATES):
        shot.crop((i * 256, 0, i * 256 + 256, 272)).save(f'{OUT}/{s}-{f}.png', optimize=True)

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

json.dump({'name': 'Chattini', 'frames': FRAMES, 'frameMs': 125, 'states': STATES, 'items': 8, 'bench': True}, open(f'{OUT}/pack.json', 'w'), indent=2)
print(f'pack written to {OUT}')
