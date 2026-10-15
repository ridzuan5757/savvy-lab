"""Cuts the Chrome screenshots from render.sh into savvy-progress/assets/.

blobs/<costume>-<palette>-<frame>.png  256x272, 7 costumes x 12 palettes x 8 frames
items/<kind>-<liquid>-<state>.png       80x136 (5x4 cells), 8 kinds x 6 liquids x 5 states
items/puff<0|1>.png, items/bench*.png   delete puff, bench tiles (16x34 px per cell)
build/<tier>-<frame>.png, build/scene-<frame>.png   planned build loop, 16 frames
"""
import os
import sys

from PIL import Image

SRC, DST = sys.argv[1], sys.argv[2]
COSTUMES = ['fable', 'heavy', 'careful', 'medium', 'light', 'explore', 'other']
LIQ = [(110, 198, 255), (76, 208, 125), (245, 197, 66), (242, 115, 150), (180, 140, 242), (255, 159, 74)]
for d in ('blobs', 'items', 'build'):
    os.makedirs(f'{DST}/{d}', exist_ok=True)

for f in range(8):
    im = Image.open(f'{SRC}/blobs-{f}.png').convert('RGBA')
    for r, c in enumerate(COSTUMES):
        for p in range(12):
            im.crop((p * 256, r * 272, p * 256 + 256, r * 272 + 272)).save(f'{DST}/blobs/{c}-{p}-{f}.png', optimize=True)

base = Image.open(f'{SRC}/items-base.png').convert('RGBA')
mask = Image.open(f'{SRC}/items-mask.png').convert('RGBA')
over = [base.crop((j * 48, 112, j * 48 + 48, 160)) for j in range(6)]
TW, TH = 80, 136


def tile(i, c, state):
    t = Image.new('RGBA', (TW, TH), (0, 0, 0, 0))
    cell = Image.new('RGBA', (128, 112), (0, 0, 0, 0))
    tint = Image.new('RGBA', (128, 112), LIQ[c] + (255,))
    tint.putalpha(mask.crop((i * 128, 0, i * 128 + 128, 112)).split()[3])
    cell.alpha_composite(tint)
    cell.alpha_composite(base.crop((i * 128, 0, i * 128 + 128, 112)))
    t.alpha_composite(cell.crop((24, 0, 104, 112)), (0, TH - 112 + 2))
    if state.startswith('new'):
        t.alpha_composite(over[int(state[-1])], (16, 0))
    if state.startswith('edit'):
        t.alpha_composite(over[2 + int(state[-1])], (16, 0))
    return t


for i in range(8):
    for c in range(6):
        for s in ['plain', 'new0', 'new1', 'edit0', 'edit1']:
            tile(i, c, s).save(f'{DST}/items/{i}-{c}-{s}.png', optimize=True)
for f in range(2):
    t = Image.new('RGBA', (TW, TH), (0, 0, 0, 0))
    t.alpha_composite(over[4 + f], (16, TH - 64))
    t.save(f'{DST}/items/puff{f}.png', optimize=True)


def bench(cols, leg=None):
    w = cols * 16
    b = Image.new('RGBA', (w, 34), (0, 0, 0, 0))
    px = b.load()
    for x in range(w):
        for y in range(0, 2):
            px[x, y] = (224, 168, 106, 255)
        for y in range(2, 10):
            px[x, y] = (201, 138, 75, 255)
        for y in range(10, 18):
            px[x, y] = (138, 90, 43, 255)
    if leg:
        x0 = 6 if leg == 'l' else w - 18
        for x in range(x0, x0 + 12):
            for y in range(18, 34):
                px[x, y] = (107, 74, 43, 255)
    return b


bench(5).save(f'{DST}/items/bench5.png')
bench(1).save(f'{DST}/items/bench1.png')
bench(5, 'l').save(f'{DST}/items/bench-left.png')
bench(5, 'r').save(f'{DST}/items/bench-right.png')

for f in range(16):
    im = Image.open(f'{SRC}/b2blob-{f}.png').convert('RGBA')
    for r, t in enumerate(COSTUMES):
        im.crop((0, r * 272, 256, r * 272 + 272)).save(f'{DST}/build/{t}-{f}.png', optimize=True)
    Image.open(f'{SRC}/b2scene-{f}.png').convert('RGBA').save(f'{DST}/build/scene-{f}.png', optimize=True)
