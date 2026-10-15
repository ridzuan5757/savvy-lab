# Sprite render tools

The terminal pictures in `savvy-progress/assets/` are rendered from vector SVG, not drawn by hand.

1. `render-blobs.html`, `render-items.html` and `render-build2.html` draw every blob, item and build-loop frame. A `?t=<ms>` parameter pauses the CSS animations at that time.
2. `render.sh` takes a screenshot of each page with headless Chrome, with a transparent background.
3. `make-assets.py` cuts the screenshots into the PNG files that the mod reads.

Run `./render.sh` to rebuild all assets. You need Google Chrome and Python 3 with Pillow. The blob art itself is in `blob-defs.js` (the same shapes as `savvy-progress/hooks/lab.ts`).
