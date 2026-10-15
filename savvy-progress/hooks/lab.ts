// Lab blobs: one blob family in lab coats, the gear naming the tier (mortarboard
// and starlight flask for fable, headlamp and microscope for heavy, ...) and the
// body colour naming the run, so a busy flow reads as a crowd, not a column.
// Desktop draws them as vector SVG; the terminal as 16×16 half-block sprites
// beside a lab table that holds one item per file the agent touched.

import type { FileMark } from '../types'

// ---------------------------------------------------------------------------
// Palettes: b body, s shade, o outline, k blush, a pen. A run keeps its index.

export type Palette = { n: string; b: string; s: string; o: string; k: string; a: string }

export const PALETTES: readonly Palette[] = [
  { n: 'Peach', b: '#FFC797', s: '#FFA463', o: '#9A4A10', k: '#F57A82', a: '#FF7A2F' },
  { n: 'Mint', b: '#A6EBB8', s: '#74CF8D', o: '#22703F', k: '#F7A38E', a: '#2E9E5B' },
  { n: 'Sky', b: '#A9D8F8', s: '#77BAEC', o: '#1D5A8C', k: '#F7A3B6', a: '#3D8CCB' },
  { n: 'Lavender', b: '#C7B8FA', s: '#9F8DEB', o: '#3B2E8A', k: '#E68FBC', a: '#6151C2' },
  { n: 'Butter', b: '#FCE38A', s: '#EEC75A', o: '#9A7420', k: '#F7A38E', a: '#E3A92C' },
  { n: 'Bubblegum', b: '#F9BFD8', s: '#EC93BB', o: '#8E2A5A', k: '#F27396', a: '#E0457A' },
  { n: 'Seafoam', b: '#9BE8DB', s: '#62CCBA', o: '#1B6B5F', k: '#F7A38E', a: '#2A9C8C' },
  { n: 'Lilac', b: '#E3C4F5', s: '#C99BE6', o: '#6A2E8A', k: '#F28FB0', a: '#9A4FC9' },
  { n: 'Coral', b: '#FFB3A7', s: '#F58A7A', o: '#9A2E20', k: '#F06A7A', a: '#E0503C' },
  { n: 'Lime', b: '#D6F08A', s: '#B4D85A', o: '#4E6A10', k: '#F7A38E', a: '#7FA020' },
  { n: 'Periwinkle', b: '#B8C8FF', s: '#8DA2F2', o: '#283E9A', k: '#F29AC0', a: '#4A64D9' },
  { n: 'Cocoa', b: '#E2C2A4', s: '#C9A07C', o: '#6B4126', k: '#F59E8B', a: '#A0643A' },
]

export const paletteOf = (i: number | undefined): Palette => PALETTES[(((i ?? 0) % PALETTES.length) + PALETTES.length) % PALETTES.length] ?? PALETTES[0]!

// The colour a planned task, or a run from before palettes, wears.
const TIER_PALETTE: Record<string, number> = { fable: 4, heavy: 3, careful: 1, medium: 2, light: 0, explore: 6, other: 5 }
export const defaultPalette = (costume: string): number => TIER_PALETTE[costume] ?? 5

export const hashOf = (s: string): number => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7)

// A new run takes the first palette no running agent wears, starting from its own
// hash so consecutive runs do not walk the list in order.
export function pickPalette(id: string, inUse: ReadonlySet<number>): number {
  const start = hashOf(id) % PALETTES.length
  for (let k = 0; k < PALETTES.length; k++) {
    const i = (start + k) % PALETTES.length
    if (!inUse.has(i)) return i
  }
  return start
}

export const LAB_NAMES: Record<string, string> = {
  fable: 'Professor Puff',
  heavy: 'Dr. Lumen',
  careful: 'Pip',
  medium: 'Bubbles',
  light: 'Zippy',
  explore: 'Scout',
  other: 'Mocha',
}
export const labName = (costume: string): string => LAB_NAMES[costume] ?? LAB_NAMES.other!

// ---------------------------------------------------------------------------
// Vector blobs (desktop). Every period divides one second: a running row redraws
// once a second and restarts its animations in phase.

export const LAB_CSS = `<style>
.lab *{transform-box:view-box}
.lab.run .sq{animation:lsq 1s ease-in-out infinite;transform-origin:15px 26px}
.lab.c-light.run .sq,.lab.c-light.run .lsh{animation-duration:.5s}
@keyframes lsq{0%,100%{transform:scale(1,1)}50%{transform:scale(1.05,.94)}}
.lab.run .lsh{animation:lsh 1s ease-in-out infinite;transform-origin:15px 26.4px}
@keyframes lsh{50%{transform:scaleX(1.08)}}
.lab.run .tassel{animation:lswing 1s ease-in-out infinite;transform-origin:20.4px 7.4px}
@keyframes lswing{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}}
.lab.run .twk{animation:ltwk 1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.lab.run .twk.b{animation-delay:-.5s}
@keyframes ltwk{0%,100%{transform:scale(.4);opacity:.3}50%{transform:scale(1.15);opacity:1}}
.lab.run .glow{animation:lglow 1s ease-in-out infinite}
@keyframes lglow{50%{opacity:.15}}
.lab.run .knob{animation:lspin 1s linear infinite;transform-origin:27.6px 21px}
@keyframes lspin{to{transform:rotate(360deg)}}
.lab.run .lean{animation:llean 1s ease-in-out infinite;transform-origin:15px 26px}
@keyframes llean{0%,100%{transform:rotate(0)}50%{transform:rotate(4deg)}}
.lab.run .drop{animation:ldrop 1s cubic-bezier(.5,0,1,.6) infinite}
@keyframes ldrop{0%{transform:translateY(0);opacity:0}15%{opacity:1}80%{transform:translateY(6px);opacity:1}81%,100%{transform:translateY(6px);opacity:0}}
.lab.run .ripple{animation:lripple 1s ease-out infinite;transform-origin:26.5px 22.6px}
@keyframes lripple{0%,78%{transform:scaleY(1)}88%{transform:scaleY(1.6)}100%{transform:scaleY(1)}}
.lab.run .bub{animation:lbub 1s ease-in infinite}
.lab.run .bub.b{animation-delay:-.33s}.lab.run .bub.c{animation-delay:-.66s}
@keyframes lbub{0%{transform:translateY(0);opacity:0}20%{opacity:1}100%{transform:translateY(-8px);opacity:0}}
.lab.run .prop{animation:lprop .5s linear infinite;transform-origin:15px 4.6px}
@keyframes lprop{0%{transform:scaleX(1)}50%{transform:scaleX(-1)}100%{transform:scaleX(1)}}
.lab.run .ck{opacity:0;animation:lck 1s steps(1) infinite}
.lab.run .ck.b{animation-name:lck2}.lab.run .ck.c{animation-name:lck3}
@keyframes lck{0%,15%{opacity:0}16%,100%{opacity:1}}
@keyframes lck2{0%,40%{opacity:0}41%,100%{opacity:1}}
@keyframes lck3{0%,65%{opacity:0}66%,100%{opacity:1}}
.lab.run .mag{animation:lmag 1s ease-in-out infinite}
@keyframes lmag{0%,100%{transform:translate(0,0)}25%{transform:translate(-1px,1px)}50%{transform:translate(0,2px)}75%{transform:translate(1px,1px)}}
.lab.run .steam{animation:lsteam 1s ease-out infinite}
.lab.run .steam.b{animation-delay:-.5s}
@keyframes lsteam{0%{transform:translateY(1px);opacity:0}30%{opacity:.9}100%{transform:translateY(-4px);opacity:0}}
@media (prefers-reduced-motion: reduce){.lab.run *{animation:none!important}.lab .ck{opacity:1!important}}
</style>`

const INK = '#2A2230'
const COAT = '#FFFFFF'
const COATS = '#E6E4EE'
const BODY = 'M6 22C6 13.5 9.6 8 15 8S24 13.5 24 22C24 25 21 26 15 26S6 25 6 22Z'
const SHADE = 'M24 19.5C24 24.6 21 25.6 15 25.6C11.6 25.6 9 25.2 7.6 24.3C13.5 24.6 20.6 23.6 24 19.5Z'
const COAT_PATH = 'M6.25 20.2C6.1 20.9 6 21.5 6 22C6 25 9 26 15 26S24 25 24 22C24 21.5 23.9 20.9 23.75 20.2L18.4 20.2L15 24L11.6 20.2Z'

const blobBody = (p: Palette): string => `<path d="${BODY}" fill="${p.b}" stroke="${p.o}" stroke-width=".6"/>
<path d="${SHADE}" fill="${p.s}"/>
<ellipse cx="10.6" cy="12.4" rx="2.1" ry="1.2" fill="#fff" opacity=".75" transform="rotate(-35 10.6 12.4)"/>
<circle cx="13.2" cy="10.6" r=".45" fill="#fff" opacity=".8"/>
<path d="${COAT_PATH}" fill="${COAT}" stroke="${p.o}" stroke-width=".5" stroke-linejoin="round"/>
<path d="M7 24.2C10 25.3 20 25.3 23 24.2" stroke="${COATS}" stroke-width=".6" fill="none"/>
<path d="M11.6 20.2L13 22.6M18.4 20.2L17 22.6" stroke="${COATS}" stroke-width=".5"/>
<circle cx="15" cy="25" r=".35" fill="${COATS}"/>
<rect x="8.4" y="22.4" width="2.4" height="1.6" rx=".3" fill="none" stroke="${COATS}" stroke-width=".4"/>
<rect x="9.1" y="21.3" width=".5" height="1.6" rx=".2" fill="${p.a}"/>`

const EYES = {
  happy: `<path d="M11.1 16.4Q12.2 14.8 13.3 16.4M16.7 16.4Q17.8 14.8 18.9 16.4" stroke="${INK}" stroke-width=".7" fill="none" stroke-linecap="round"/>`,
  normal: `<ellipse cx="12.2" cy="16" rx="1.15" ry="1.45" fill="${INK}"/><ellipse cx="17.8" cy="16" rx="1.15" ry="1.45" fill="${INK}"/>
<circle cx="11.85" cy="15.4" r=".45" fill="#fff"/><circle cx="17.45" cy="15.4" r=".45" fill="#fff"/>
<circle cx="12.55" cy="16.6" r=".2" fill="#fff"/><circle cx="18.15" cy="16.6" r=".2" fill="#fff"/>`,
}

const blush = (p: Palette): string =>
  `<ellipse cx="9.6" cy="18.1" rx="1.25" ry=".65" fill="${p.k}" opacity=".75"/><ellipse cx="20.4" cy="18.1" rx="1.25" ry=".65" fill="${p.k}" opacity=".75"/>`

const MOUTH = {
  smile: `<path d="M14.1 18.1Q15 19.7 15.9 18.1Z" fill="#6B2A3A" stroke="${INK}" stroke-width=".35" stroke-linejoin="round"/>`,
  oh: `<ellipse cx="15" cy="18.7" rx=".6" ry=".75" fill="#6B2A3A" stroke="${INK}" stroke-width=".3"/>`,
  tongue: `<path d="M14.1 18.3Q15 18.9 15.9 18.3" stroke="${INK}" stroke-width=".45" fill="none" stroke-linecap="round"/><path d="M15.2 18.6Q15.9 18.6 15.9 19.3Q15.7 19.9 15.2 19.6Z" fill="#F27396" stroke="${INK}" stroke-width=".25"/>`,
  grin: `<path d="M13.8 18Q15 20.2 16.2 18Z" fill="#6B2A3A" stroke="${INK}" stroke-width=".35" stroke-linejoin="round"/><path d="M14.4 19.1Q15 19.6 15.6 19.1" fill="#F27396"/>`,
}

const arm = (x: number, y: number, p: Palette): string =>
  `<ellipse cx="${x}" cy="${y}" rx="1.35" ry="1.05" fill="${COAT}" stroke="${p.o}" stroke-width=".45"/>`

type Look = {
  eyes: keyof typeof EYES
  mouth: keyof typeof MOUTH
  hand: [number, number]
  head: (p: Palette) => string
  prop?: (p: Palette) => string
  // Drawn behind the blob and outside its squish: a microscope stays on the bench.
  bench?: () => string
  lean?: boolean
}

const LOOKS: Record<string, Look> = {
  fable: {
    eyes: 'happy',
    mouth: 'smile',
    hand: [23.4, 21.4],
    head: () => `<path d="M11.4 8.6V9.9Q15 11.1 18.6 9.9V8.6" fill="#2B2A33" stroke="${INK}" stroke-width=".35"/>
<path d="M8.8 7.4L15 5.1L21.2 7.4L15 9.7Z" fill="#3A3946" stroke="${INK}" stroke-width=".4" stroke-linejoin="round"/>
<g class="tassel"><path d="M15 7.4L20.4 7.4V10.4" stroke="#F5C542" stroke-width=".45" fill="none"/><rect x="19.9" y="10.2" width="1" height="1.4" rx=".3" fill="#F5C542"/></g>
<circle cx="15" cy="7.4" r=".45" fill="#F5C542"/>`,
    prop: () => `<path d="M24.7 16.6V18.7L22.7 23Q22.4 24.1 23.5 24.1H27.9Q29 24.1 28.7 23L26.7 18.7V16.6Z" fill="#EAF6FF" fill-opacity=".7" stroke="${INK}" stroke-width=".4" stroke-linejoin="round"/>
<path d="M23.3 21.6H28.1L28.7 23Q29 24.1 27.9 24.1H23.5Q22.4 24.1 22.7 23Z" fill="#FFD54A"/>
<rect x="24.4" y="16.1" width="2.6" height=".7" rx=".3" fill="#fff" stroke="${INK}" stroke-width=".35"/>
<path class="twk" d="M27.6 12.6L28 13.7L29.1 14.1L28 14.5L27.6 15.6L27.2 14.5L26.1 14.1L27.2 13.7Z" fill="#F5C542"/>
<path class="twk b" d="M23.6 13.2L23.9 14L24.7 14.3L23.9 14.6L23.6 15.4L23.3 14.6L22.5 14.3L23.3 14Z" fill="#FFE27A"/>
<circle class="twk b" cx="25.8" cy="22.8" r=".35" fill="#fff"/>`,
  },
  heavy: {
    eyes: 'normal',
    mouth: 'oh',
    hand: [23.6, 20.6],
    lean: true,
    head: () => `<path d="M7.4 12.9Q15 10.3 22.6 12.9" stroke="#2B2A33" stroke-width=".9" fill="none" stroke-linecap="round"/>
<circle class="glow" cx="15" cy="11.1" r="2.6" fill="#FFF3B0" opacity=".55"/>
<circle cx="15" cy="11.1" r="1.3" fill="#FFE58A" stroke="${INK}" stroke-width=".4"/><circle cx="14.6" cy="10.7" r=".35" fill="#fff"/>`,
    bench: () => `<rect x="22.4" y="24.8" width="7.2" height="1.4" rx=".6" fill="#4A4A58" stroke="${INK}" stroke-width=".35"/>
<path d="M27.8 24.8V19.2Q27.8 16.9 25.9 16.6" stroke="#4A4A58" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<rect x="22.7" y="21.3" width="4" height=".8" rx=".3" fill="#6A6A7A"/>
<circle class="glow" cx="24.6" cy="22.8" r=".55" fill="#7FF0FF"/>
<g transform="rotate(-22 24.4 16)"><rect x="23.5" y="13.6" width="1.8" height="5.6" rx=".4" fill="#EDEDF4" stroke="${INK}" stroke-width=".35"/><rect x="23.1" y="12.6" width="2.6" height="1.3" rx=".35" fill="#4A4A58"/></g>
<g class="knob"><circle cx="27.6" cy="21" r=".9" fill="#9EA2B0" stroke="${INK}" stroke-width=".3"/><path d="M27.6 20.2V21.8" stroke="${INK}" stroke-width=".3"/></g>`,
  },
  careful: {
    eyes: 'normal',
    mouth: 'tongue',
    hand: [24.6, 17.2],
    head: () => `<path d="M7.3 12.2Q15 9.6 22.7 12.2" stroke="#3A3A44" stroke-width=".8" fill="none"/>
<circle cx="12.3" cy="11" r="1.75" fill="#BFEAFF" fill-opacity=".85" stroke="#3A3A44" stroke-width=".55"/>
<circle cx="17.7" cy="11" r="1.75" fill="#BFEAFF" fill-opacity=".85" stroke="#3A3A44" stroke-width=".55"/>
<path d="M11.4 10.4L12.2 9.8M16.8 10.4L17.6 9.8" stroke="#fff" stroke-width=".4" stroke-linecap="round"/>`,
    prop: () => `<path d="M25.2 18.6V24.1Q25.2 25.5 26.5 25.5Q27.8 25.5 27.8 24.1V18.6" fill="#EAF6FF" fill-opacity=".7" stroke="${INK}" stroke-width=".4"/>
<path class="ripple" d="M25.4 22.6H27.6V24.1Q27.6 25.2 26.5 25.2Q25.4 25.2 25.4 24.1Z" fill="#5ED48A"/>
<path d="M24.9 18.6H28.1" stroke="${INK}" stroke-width=".45" stroke-linecap="round"/>
<rect x="26.15" y="11.6" width=".7" height="4.2" rx=".3" fill="#EAF6FF" stroke="${INK}" stroke-width=".3"/>
<ellipse cx="26.5" cy="10.7" rx="1" ry="1.3" fill="#F27396" stroke="${INK}" stroke-width=".35"/>
<circle class="drop" cx="26.5" cy="16.4" r=".45" fill="#5ED48A"/>`,
  },
  medium: {
    eyes: 'normal',
    mouth: 'smile',
    hand: [23.5, 21.6],
    head: p => `<path d="M14.6 8.3C13.4 6.2 16.4 5 16.9 6.8C17.1 7.6 16.2 7.9 15.8 7.4" stroke="${p.o}" stroke-width=".55" fill="none" stroke-linecap="round"/>`,
    prop: () => `<rect x="25.3" y="16.3" width="1.6" height="3.4" fill="#EAF6FF" fill-opacity=".8" stroke="${INK}" stroke-width=".4"/>
<circle cx="26.1" cy="22.3" r="2.95" fill="#EAF6FF" fill-opacity=".75" stroke="${INK}" stroke-width=".4"/>
<path d="M23.25 22.6A2.85 2.85 0 0 0 28.95 22.6Z" fill="#6EC6FF"/>
<path d="M24.9 16.3H27.3" stroke="${INK}" stroke-width=".45" stroke-linecap="round"/>
<circle class="bub" cx="25.6" cy="21.6" r=".45" fill="#BDE6FF" stroke="#3D8CCB" stroke-width=".2"/>
<circle class="bub b" cx="26.5" cy="21.8" r=".35" fill="#BDE6FF" stroke="#3D8CCB" stroke-width=".2"/>
<circle class="bub c" cx="26" cy="21.4" r=".55" fill="#BDE6FF" stroke="#3D8CCB" stroke-width=".2"/>
<ellipse cx="25.2" cy="21.2" rx=".5" ry=".9" fill="#fff" opacity=".7"/>`,
  },
  light: {
    eyes: 'normal',
    mouth: 'grin',
    hand: [23.2, 21.8],
    head: () => `<path d="M10.6 9.6Q15 4.6 19.4 9.6Z" fill="#F04E5A" stroke="${INK}" stroke-width=".4"/>
<path d="M15 5.3Q12.6 7 12.4 9.2L15 9.6Z" fill="#FFD23F"/><path d="M15 5.3Q17.4 7 17.6 9.2L15 9.6Z" fill="#3D8CCB"/>
<path d="M10.6 9.6Q15 4.6 19.4 9.6Z" fill="none" stroke="${INK}" stroke-width=".4"/>
<path d="M15 5.2V4.5" stroke="${INK}" stroke-width=".4"/>
<g class="prop"><path d="M15 4.6Q12.4 3.6 11.8 4.6Q12.4 5.5 15 4.6Q17.6 3.6 18.2 4.6Q17.6 5.5 15 4.6Z" fill="#FFD23F" stroke="${INK}" stroke-width=".3"/></g>
<circle cx="15" cy="4.6" r=".4" fill="#F04E5A" stroke="${INK}" stroke-width=".25"/>`,
    prop: () => `<rect x="22.6" y="17.4" width="5.4" height="7" rx=".6" fill="#C98A4B" stroke="${INK}" stroke-width=".4"/>
<rect x="23.2" y="18.3" width="4.2" height="5.6" rx=".2" fill="#fff"/>
<rect x="24.3" y="16.9" width="2" height="1.1" rx=".3" fill="#9EA2B0" stroke="${INK}" stroke-width=".3"/>
<path d="M24.9 19.6H26.9M24.9 21.2H26.9M24.9 22.8H26.9" stroke="#C9CCD6" stroke-width=".4"/>
<path class="ck" d="M23.5 19.5L23.9 19.9L24.5 19.1" stroke="#2EAA5B" stroke-width=".45" fill="none" stroke-linecap="round"/>
<path class="ck b" d="M23.5 21.1L23.9 21.5L24.5 20.7" stroke="#2EAA5B" stroke-width=".45" fill="none" stroke-linecap="round"/>
<path class="ck c" d="M23.5 22.7L23.9 23.1L24.5 22.3" stroke="#2EAA5B" stroke-width=".45" fill="none" stroke-linecap="round"/>`,
  },
  explore: {
    eyes: 'normal',
    mouth: 'smile',
    hand: [23.4, 20.4],
    head: () => `<path d="M9 10.4Q9.6 5.6 15 5.6T21 10.4Z" fill="#D9C08A" stroke="${INK}" stroke-width=".4"/>
<path d="M9.4 9.2Q15 8.1 20.6 9.2" stroke="#A8864A" stroke-width=".7" fill="none"/>
<ellipse cx="15" cy="10.5" rx="8" ry="1.25" fill="#C9AE72" stroke="${INK}" stroke-width=".4"/>`,
    prop: () => `<g class="mag"><path d="M24.4 17.1L23 19.4" stroke="#6B4A2B" stroke-width="1" stroke-linecap="round"/>
<circle cx="26" cy="15" r="2.3" fill="#CFF2FF" fill-opacity=".6" stroke="#6B4A2B" stroke-width=".7"/>
<path d="M25 14.2Q25.4 13.6 26.1 13.6" stroke="#fff" stroke-width=".4" fill="none" stroke-linecap="round"/></g>`,
  },
  other: {
    eyes: 'happy',
    mouth: 'smile',
    hand: [23.1, 21.6],
    head: () => `<path d="M9.6 9.6L7 8V11.4Z" fill="#E0457A" stroke="${INK}" stroke-width=".35" stroke-linejoin="round"/>
<path d="M9.6 9.6L12.2 8V11.4Z" fill="#E0457A" stroke="${INK}" stroke-width=".35" stroke-linejoin="round"/>
<circle cx="9.6" cy="9.7" r=".7" fill="#FF7FA6" stroke="${INK}" stroke-width=".3"/>`,
    prop: () => `<rect x="23" y="20" width="4.4" height="4.8" rx=".8" fill="#fff" stroke="${INK}" stroke-width=".4"/>
<path d="M27.4 21Q29.2 21 29.2 22.4Q29.2 23.7 27.4 23.7" stroke="${INK}" stroke-width=".5" fill="none"/>
<ellipse cx="25.2" cy="20.4" rx="1.9" ry=".35" fill="#7A4A2B"/>
<path d="M25.2 23.6C24.2 22.9 24.1 22.1 24.7 21.9C25 21.8 25.2 22.1 25.2 22.1C25.2 22.1 25.4 21.8 25.7 21.9C26.3 22.1 26.2 22.9 25.2 23.6Z" fill="#F27396"/>
<path class="steam" d="M24.4 19.2Q23.8 18.2 24.4 17.3T24.4 15.4" stroke="#B9B6C4" stroke-width=".45" fill="none" stroke-linecap="round"/>
<path class="steam b" d="M26 19.2Q25.4 18.2 26 17.3T26 15.4" stroke="#B9B6C4" stroke-width=".45" fill="none" stroke-linecap="round"/>`,
  },
}

// The blob's own box is 30×28 units, as the crab's was.
export const LAB_BOX = 30

// A blob as a nested <svg> at (x, y): its own viewport, so the CSS origins in
// LAB_CSS stay in blob units wherever and at whatever scale it is placed.
export function labSvg(x: number, y: number, costume: string, palette: number, dim = false, isWorking = false, scale = 1.1, mirror = false): string {
  const look = LOOKS[costume] ?? LOOKS.other!
  const p = paletteOf(palette)
  const char = `${blobBody(p)}${EYES[look.eyes]}${blush(p)}${MOUTH[look.mouth]}${look.head(p)}${arm(6.4, 21.2, p)}${look.prop ? look.prop(p) : ''}${arm(look.hand[0], look.hand[1], p)}`
  const body = look.lean ? `<g class="lean"><g class="sq">${char}</g></g>` : `<g class="sq">${char}</g>`
  const flip = mirror ? ' transform="translate(30,0) scale(-1,1)"' : ''
  const w = Math.round(LAB_BOX * scale * 100) / 100
  const h = Math.round(28 * scale * 100) / 100
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 30 28" opacity="${dim ? 0.45 : 1}"><g class="lab c-${costume}${isWorking ? ' run' : ''}"${flip}><ellipse class="lsh" cx="15" cy="26.4" rx="8.5" ry="1.1" fill="#000" opacity=".15"/>${look.bench ? look.bench() : ''}${body}</g></svg>`
}

// ---------------------------------------------------------------------------
// Terminal sprites: 16×16 pixels, drawn two to a cell with `▀`.

export type Pixels = (string | null)[][]

const FIX: Record<string, string> = {
  w: '#FFFFFF', g: '#D9D6E3', e: '#2A2230', m: '#6B2A3A', S: '#1d2026',
  K: '#2B2A33', Y: '#F5C542', y: '#FFE27A', G: '#DCEFFA', L: '#FFE58A', R: '#F04E5A', B: '#3D8CCB',
  T: '#D9C08A', t: '#A8864A', P: '#E0457A', Z: '#FF9EC0', M: '#8E92A0', D: '#4A4A58', C: '#C98A4B',
  W: '#FFFFFF', N: '#7A5230', c: '#7FF0FF', V: '#4CD07D', U: '#6EC6FF', u: '#BDE6FF', F: '#7A4A2B', z: '#9EA3B0', q: '#BFEAFF',
}

const BASE16 = [
  '................', '................', '................',
  '....oooooo......', '...obbbbbbo.....', '..obhbbbbbbo....', '..obbbbbbbso....',
  '.obbebbbbebso...', '.obbebbbbebso...', '.obkbmbbmbkso...',
  '.owwwwmmwwwwo...', 'owwwwwbbwwwwwo..', 'owwgwwwwwwwwwo..', '.owwwwwwwwwwo...', '..oooooooooo....', '...SSSSSSSS.....',
]

type Px = [x: number, y: number, c: string]
const pts = (s: string): Px[] =>
  s.trim().split(/\s+/).map(t => {
    const [x = '0', y = '0', c = '.'] = t.split(',')
    return [Number(x), Number(y), c]
  })

// Gear pixels per costume; `alt` replaces some of them in the second frame.
const GEAR16: Record<string, { on: Px[]; alt: Px[] }> = {
  fable: {
    on: pts('2,1,K 3,1,K 4,1,K 5,1,K 6,1,K 7,1,K 8,1,K 9,1,K 10,1,K 11,1,K 4,2,K 5,2,K 6,2,K 7,2,K 8,2,K 9,2,K 11,2,Y 11,3,Y 11,4,Y 13,8,G 14,8,G 13,9,G 14,9,G 12,10,G 13,10,Y 14,10,Y 15,10,G 12,11,Y 13,11,Y 14,11,Y 15,11,Y 12,12,Y 13,12,Y 14,12,Y 15,12,Y 15,6,y'),
    alt: pts('15,6,. 13,6,y 11,4,. 12,4,Y'),
  },
  heavy: {
    on: pts('3,4,K 4,4,K 5,4,K 6,4,L 7,4,L 8,4,K 9,4,K 10,4,K 6,3,L 7,3,L 6,2,y 7,2,y 12,5,D 13,5,D 13,6,W 13,7,W 13,8,W 14,7,D 15,8,D 15,9,D 15,10,D 12,10,M 13,10,M 14,10,M 13,11,c 15,11,D 15,12,D 12,13,D 13,13,D 14,13,D 15,13,D'),
    alt: pts('6,2,. 7,2,. 13,11,. 13,12,c'),
  },
  careful: {
    on: pts('3,4,K 4,4,q 5,4,q 6,4,K 7,4,K 8,4,q 9,4,q 10,4,K 13,3,P 13,4,P 13,5,G 13,6,G 13,7,G 13,8,V 12,10,M 14,10,M 12,11,M 14,11,M 12,12,M 14,12,M 13,13,M 13,10,G 13,11,V 13,12,V'),
    alt: pts('13,8,. 13,9,V 13,10,V'),
  },
  medium: {
    on: pts('6,2,o 7,1,o 8,1,o 8,2,o 13,7,G 14,7,G 13,8,G 14,8,G 12,9,G 13,9,G 14,9,G 15,9,G 12,10,U 13,10,W 14,10,U 15,10,U 12,11,U 13,11,U 14,11,U 15,11,U 13,12,U 14,12,U 14,5,u'),
    alt: pts('14,5,. 13,4,u 13,10,U 14,10,W'),
  },
  light: {
    on: pts('5,2,R 6,2,Y 7,2,B 8,2,R 4,2,R 9,2,B 6,1,K 7,1,K 4,0,Y 5,0,Y 8,0,Y 9,0,Y 13,7,M 14,7,M 12,8,C 13,8,W 14,8,W 15,8,C 12,9,C 13,9,V 14,9,W 15,9,C 12,10,C 13,10,W 14,10,W 15,10,C 12,11,C 13,11,V 14,11,W 15,11,C 12,12,C 13,12,W 14,12,W 15,12,C 12,13,C 13,13,C 14,13,C 15,13,C'),
    alt: pts('4,0,. 9,0,. 6,0,Y 7,0,Y 13,11,W'),
  },
  explore: {
    on: pts('4,1,T 5,1,T 6,1,T 7,1,T 8,1,T 9,1,T 2,2,t 3,2,t 4,2,t 5,2,t 6,2,t 7,2,t 8,2,t 9,2,t 10,2,t 11,2,t 13,5,N 14,5,N 12,6,N 13,6,q 14,6,q 15,6,N 12,7,N 13,7,q 14,7,W 15,7,N 13,8,N 14,8,N 12,9,N 12,10,N'),
    alt: pts('13,7,W 14,7,q'),
  },
  other: {
    on: pts('1,3,P 2,3,Z 3,3,P 1,4,P 3,4,P 12,9,F 13,9,F 14,9,F 12,10,W 13,10,P 14,10,W 15,10,W 12,11,W 13,11,W 14,11,W 15,11,W 12,12,W 13,12,W 14,12,W 13,7,z 12,6,z'),
    alt: pts('13,7,. 12,6,. 12,7,z 13,6,z 14,5,z'),
  },
}

const lighten = (hex: string, a: number): string =>
  '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - a) + 255 * a).toString(16).padStart(2, '0')).join('')

export const SPRITE = 16

// Frame 1 bobs the blob a pixel down and swaps the gear's alt pixels.
export function sprite(costume: string, palette: number, frame: number): Pixels {
  const p = paletteOf(palette)
  const map: Record<string, string> = { ...FIX, b: p.b, s: p.s, o: p.o, k: p.k, h: lighten(p.b, 0.7) }
  const grid: Pixels = Array.from({ length: SPRITE }, () => Array<string | null>(SPRITE).fill(null))
  const put = (x: number, y: number, c: string) => {
    const row = grid[y]
    if (row === undefined || x < 0 || x >= SPRITE) return
    row[x] = c === '.' ? null : (map[c] ?? null)
  }
  const bob = frame === 1 ? 1 : 0
  BASE16.forEach((row, y) => [...row].forEach((c, x) => c !== '.' && put(x, c === 'S' ? y : y + bob, c)))
  const gear = GEAR16[costume] ?? GEAR16.other!
  gear.on.forEach(([x, y, c]) => put(x, y + bob, c))
  if (frame === 1) gear.alt.forEach(([x, y, c]) => put(x, y + bob, c))
  return grid
}

// ---------------------------------------------------------------------------
// The lab table: one item per file, newest on the right.

const LIQ = ['#6EC6FF', '#4CD07D', '#F5C542', '#F27396', '#B48CF2', '#FF9F4A']
const ITEMS: readonly string[][] = [
  ['g..g', 'g..g', 'gUUg', 'gUUg', 'gggg'],
  ['.gg.', '.gg.', 'gUUg', 'gUUg', 'gggg'],
  ['U.V.Y', 'U.V.Y', 'CCCCC', 'C...C'],
  ['WWWW', 'zzzz', 'WWWW'],
  ['.K.', 'gUg', 'gUg', 'gUg', 'gUg', 'ggg'],
  ['RRRR', 'RWWR', 'RRRR'],
  ['gUUg', 'gggg'],
  ['.g.', '.g.', 'gUg', 'gUg', '.g.'],
]
export const TABLE_ROWS = 5
const TABLE_H = TABLE_ROWS * 2
// How long a mark shows its sparkle, or a deleted file its puff.
export const MARK_MS = 2500

const itemOf = (path: string) => {
  const h = hashOf(path)
  return { it: ITEMS[h % ITEMS.length]!, liq: LIQ[(h >>> 3) % LIQ.length]!, liq2: LIQ[(h >>> 6) % LIQ.length]! }
}

// The files a table shows at `at`: deleted ones only while they puff.
export const onTable = (files: readonly FileMark[], at: number): FileMark[] => files.filter(f => f.op !== 'gone' || at - f.at < MARK_MS)

export function table(width: number, files: readonly FileMark[], at: number, frame: number): { pixels: Pixels; hidden: number } {
  const grid: Pixels = Array.from({ length: TABLE_H }, () => Array<string | null>(width).fill(null))
  const put = (x: number, y: number, c: string | null) => {
    const row = grid[y]
    if (row !== undefined && x >= 0 && x < width) row[x] = c
  }
  for (let x = 0; x < width; x++) {
    put(x, 7, '#C98A4B')
    put(x, 8, '#8A5A2B')
  }
  for (const x of [1, 2, width - 3, width - 2]) put(x, 9, '#6B4A2B')

  const list = onTable(files, at)
  const shown: FileMark[] = []
  let used = 2
  for (let i = list.length - 1; i >= 0; i--) {
    const f = list[i]!
    const w = itemOf(f.path).it[0]!.length + 1
    if (used + w > width - 2) break
    used += w
    shown.unshift(f)
  }
  let x = 2
  for (const f of shown) {
    const s = itemOf(f.path)
    const h = s.it.length
    const fresh = at - f.at < MARK_MS
    const colours: Record<string, string> = { g: '#DCEFFA', U: s.liq, V: s.liq2, Y: '#F5C542', K: '#2B2A33', C: '#C98A4B', W: '#F4F3EE', z: '#9EA3B0', R: s.liq }
    s.it.forEach((row, dy) =>
      [...row].forEach((ch, dx) => {
        if (ch === '.') return
        const y = 7 - h + dy
        if (f.op === 'gone') {
          if ((dx + dy + frame) % 2 === 0) put(x + dx, y, '#9EA3B0')
          return
        }
        put(x + dx, y, colours[ch] ?? null)
      }),
    )
    const cx = x + Math.floor(s.it[0]!.length / 2)
    const top = 7 - h - 1
    if (fresh && f.op === 'new') {
      put(cx, top, '#4CD07D')
      if (frame) put(cx, top - 1, '#4CD07D')
    }
    if (fresh && f.op === 'edit') {
      put(cx, top, '#FFE27A')
      put(cx - 1 + 2 * frame, top - 1, '#FFE27A')
    }
    x += s.it[0]!.length + 1
  }
  return { pixels: grid, hidden: list.length - shown.length }
}

// ---------------------------------------------------------------------------
// Pixels to terminal runs: each cell is `▀` (top pixel as colour, bottom as
// background), `▄` when only the bottom is set, a space when neither.

export type Run = { text: string; color?: string; backgroundColor?: string }

export function cellRows(pixels: Pixels): Run[][] {
  const rows: Run[][] = []
  for (let y = 0; y < pixels.length; y += 2) {
    const top = pixels[y] ?? []
    const bottom = pixels[y + 1] ?? []
    const runs: Run[] = []
    for (let x = 0; x < top.length; x++) {
      const t = top[x] ?? null
      const b = bottom[x] ?? null
      const cell: Run = t && b ? { text: '▀', color: t, backgroundColor: b } : t ? { text: '▀', color: t } : b ? { text: '▄', color: b } : { text: ' ' }
      const last = runs[runs.length - 1]
      if (last && last.color === cell.color && last.backgroundColor === cell.backgroundColor && last.text[0] === cell.text) last.text += cell.text
      else runs.push(cell)
    }
    rows.push(runs)
  }
  return rows
}

// ---------------------------------------------------------------------------
// File operations from a tool call.

// `git status --porcelain=v1 -z` as path → XY code. A rename or copy names its
// source after it; the source counts as deleted.
export type Status = Map<string, string>

export function parseStatus(z: string): Status {
  const status: Status = new Map()
  const parts = z.split('\0')
  for (let i = 0; i < parts.length; i++) {
    const entry = parts[i] ?? ''
    if (entry.length < 4) continue
    const xy = entry.slice(0, 2)
    status.set(entry.slice(3), xy)
    if (xy.includes('R') || xy.includes('C')) {
      const from = parts[++i]
      if (from && xy.includes('R')) status.set(from, ' D')
    }
  }
  return status
}

// What one command changed, from the status before and after it: a path that
// shows up untracked or added is new, a deletion code is gone, a newly modified
// worktree is an edit. A path that left the status was deleted, committed or
// reset: `vanished` lists them for the caller to check on disk. A file edited
// again while already modified keeps its code and is not seen.
export function statusOps(before: Status, after: Status): { ops: FileOp[]; vanished: string[] } {
  const ops: FileOp[] = []
  for (const [path, a] of after) {
    const b = before.get(path)
    if (a === b) continue
    if (a.includes('D')) ops.push({ path, op: 'gone' })
    else if (b === undefined && (a === '??' || a[0] === 'A' || a[0] === 'R' || a[0] === 'C')) ops.push({ path, op: 'new' })
    else if (b === undefined || (a[1] === 'M' && b[1] !== 'M')) ops.push({ path, op: 'edit' })
  }
  const vanished = [...before.keys()].filter(path => !after.has(path) && !(before.get(path) ?? '').includes('D'))
  return { ops, vanished }
}

export type FileOp = { path: string; op: FileMark['op'] }

// Splits a shell line into words, honouring quotes; enough for `rm` arguments.
const words = (segment: string): string[] => {
  const out: string[] = []
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(segment)) !== null) out.push(m[1] ?? m[2] ?? m[3] ?? '')
  return out
}

// Deletes and moves a Bash command names: `rm`, `git rm`, `unlink`, `rmdir`, and
// `mv`/`git mv` as a delete of the source and a new file at the target. A guess
// from the text: `rm -rf dir/` counts as one item.
export function bashOps(command: string): FileOp[] {
  const ops: FileOp[] = []
  for (const segment of command.split(/&&|\|\||;|\||\n/)) {
    let w = words(segment.trim())
    while (w[0] === 'sudo' || w[0] === 'command' || /^[A-Z_]+=/.test(w[0] ?? '')) w = w.slice(1)
    if (w[0] === 'git' && (w[1] === 'rm' || w[1] === 'mv')) w = w.slice(1)
    const cmd = w[0]
    const args = w.slice(1).filter(a => !a.startsWith('-'))
    if (cmd === 'rm' || cmd === 'unlink' || cmd === 'rmdir') args.forEach(path => ops.push({ path, op: 'gone' }))
    if (cmd === 'mv' && args.length >= 2) {
      args.slice(0, -1).forEach(path => ops.push({ path, op: 'gone' }))
      ops.push({ path: args[args.length - 1]!, op: 'new' })
    }
  }
  return ops
}

// The newest mark per path wins. A file already on the table keeps its place, so
// an edit sparkles where the item stands and a delete puffs there; a path the run
// has not touched yet comes on at the right. `gone` marks past their puff drop away.
export function applyOps(files: readonly FileMark[] | undefined, ops: readonly FileOp[], at: number): FileMark[] {
  const list = [...(files ?? [])].filter(f => f.op !== 'gone' || at - f.at < MARK_MS)
  for (const { path, op } of ops) {
    const i = list.findIndex(f => f.path === path)
    const prev = list[i]
    if (prev === undefined || prev.op === 'gone') {
      if (prev !== undefined) list.splice(i, 1)
      list.push({ path, op, at })
    } else {
      list[i] = { path, op: op === 'new' ? 'edit' : op, at }
    }
  }
  return list.slice(-120)
}

// A subagent Bash call's time window and the files it kept.
export type BashWindow = { key: string; agentId: string; start: number; end?: number; paths?: Set<string>; command?: string }

// How strongly a command names a file: 2 for its file name, 1 for its folder's.
export function mentions(command: string | undefined, path: string): number {
  if (!command) return 0
  const parts = path.split('/').filter(Boolean)
  const name = parts[parts.length - 1] ?? ''
  const dir = parts[parts.length - 2] ?? ''
  if (name && command.includes(name)) return 2
  if (dir && command.includes(dir)) return 1
  return 0
}

// Settles which agent keeps each file a Bash call saw, against other agents'
// overlapping calls that already finished: a file both saw goes to the call
// whose command names it more closely, then to the shorter call. Returns the
// ops this call keeps and, per agent, the paths taken from it. Records this
// call's window as finished with the paths it kept.
export function claimOps(windows: BashWindow[], key: string, agentId: string, start: number, end: number, ops: readonly FileOp[], command?: string): { ops: FileOp[]; stolen: Map<string, Set<string>> } {
  const rivals = windows.filter(w => w.key !== key && w.agentId !== agentId && w.paths && w.end !== undefined && w.start < end && w.end > start)
  const stolen = new Map<string, Set<string>>()
  const kept = ops.filter(op => {
    const holders = rivals.filter(w => w.paths?.has(op.path))
    const mine = mentions(command, op.path)
    const beats = (w: BashWindow) => {
      const theirs = mentions(w.command, op.path)
      return theirs !== mine ? theirs > mine : (w.end as number) - w.start <= end - start
    }
    if (holders.some(beats)) return false
    for (const w of holders) {
      w.paths?.delete(op.path)
      stolen.set(w.agentId, (stolen.get(w.agentId) ?? new Set()).add(op.path))
    }
    return true
  })
  const mine = windows.find(w => w.key === key)
  if (mine) Object.assign(mine, { end, paths: new Set(kept.map(op => op.path)) })
  return { ops: kept, stolen }
}

// ---------------------------------------------------------------------------
// Terminal pictures (kitty graphics, as Ghostty draws them): the vector blobs as
// pre-rendered PNG frames, and the lab table composed here from item layers.

export const BLOB_FRAMES = 8
export const BLOB_FRAME_MS = 125
export const BLOB_COLS = 16
export const BLOB_ROWS = 8

// The PNG of one blob frame, rendered from LOOKS by headless Chrome: 256×272 px.
export const blobFrame = (root: string, costume: string, palette: number, frame: number): string =>
  `${root}/assets/blobs/${LOOKS[costume] ? costume : 'other'}-${((palette % PALETTES.length) + PALETTES.length) % PALETTES.length}-${((frame % BLOB_FRAMES) + BLOB_FRAMES) % BLOB_FRAMES}.png`

// The table as sprites: one 5×4-cell Image per file, its frame a PNG picked by
// the item kind and liquid colour (both from the path) and the file's state; a
// one-row bench beneath. Rendered ahead from vector art, 16×34 px per cell.
export const ITEM_COLS = 5
export const ITEM_ROWS = 4
export const ITEM_FRAME_MS = 250
const ITEM_KINDS = 8
const ITEM_LIQUIDS = 6

// A sprite pack with its own items draws those: <kind>-<state>.png in its items folder.
export function itemSprite(root: string, f: FileMark, at: number, frame: number, pack?: { root: string; items: number } | null): string {
  const own = pack && pack.items > 0 ? `${pack.root}/items` : ''
  if (f.op === 'gone') return `${own || `${root}/assets/items`}/puff${frame % 2}.png`
  const h = hashOf(f.path)
  const state = at - f.at < MARK_MS ? `${f.op}${frame % 2}` : 'plain'
  if (own && pack) return `${own}/${h % pack.items}-${state}.png`
  return `${root}/assets/items/${h % ITEM_KINDS}-${(h >>> 3) % ITEM_LIQUIDS}-${state}.png`
}

// The bench as tiles at their own size: an Image keeps its picture's shape and
// does not stretch it. A leg tile at each end, 5-cell planks between, 1-cell
// planks for the rest. Each entry is [file, columns].
export function benchTiles(root: string, columns: number, pack?: { root: string; bench: boolean } | null): [string, number][] {
  const tile = (name: string) => (pack?.bench ? `${pack.root}/items/${name}.png` : `${root}/assets/items/${name}.png`)
  if (columns < 10) return Array.from({ length: Math.max(1, columns) }, () => [tile('bench1'), 1] as [string, number])
  const middle = columns - 10
  return [
    [tile('bench-left'), 5],
    ...Array.from({ length: Math.floor(middle / 5) }, () => [tile('bench5'), 5] as [string, number]),
    ...Array.from({ length: middle % 5 }, () => [tile('bench1'), 1] as [string, number]),
    [tile('bench-right'), 5],
  ]
}

// The files a table of `columns` cells has room for, newest kept; `hidden` counts the rest.
export function tableSlots(columns: number, files: readonly FileMark[], at: number): { shown: FileMark[]; hidden: number } {
  const list = onTable(files, at)
  const fit = Math.max(0, Math.floor((columns - 2) / ITEM_COLS))
  const shown = list.slice(Math.max(0, list.length - fit))
  return { shown, hidden: list.length - shown.length }
}

// A planned task's blob builds its workstation while it waits: a 2 s loop of 16
// frames. The blob, with a mallet, is a running blob's size (16×8 cells, in the
// tier's default colour); the bench it builds is a 20×5-cell scene at the bench
// tiles' scale, in the table's place.
export const BUILD_FRAMES = 16
export const SCENE_COLS = 20
const loop = (frame: number) => ((frame % BUILD_FRAMES) + BUILD_FRAMES) % BUILD_FRAMES
export const buildFrame = (root: string, tier: string, frame: number): string =>
  `${root}/assets/build/${LOOKS[tier] ? tier : 'other'}-${loop(frame)}.png`
export const sceneFrame = (root: string, frame: number): string => `${root}/assets/build/scene-${loop(frame)}.png`

// ---------------------------------------------------------------------------
// Sprite packs: a folder of frames, one set per agent state, named
// <state>-<frame>.png, with a pack.json ({ name, frames, frameMs, states }).
// A pack is the person's own and lives outside this plugin (`spritePack`).

export type PackState = 'working' | 'reading' | 'thinking' | 'done' | 'failed' | 'planned' | 'overload' | 'returned'
// `items` and `bench`: the pack's own bench items (items/<kind>-<state>.png) and counter tiles.
// `variants`: alternates per state (<state>~<n>-<frame>.png), one picked per run;
// `scene`: frames of the planned rows' build loop (scene-<frame>.png).
export type SpritePack = { root: string; name: string; frames: number; frameMs: number; states: string[]; items: number; bench: boolean; variants: Record<string, number>; scene: number }

const READ_TOOLS = new Set(['Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch', 'LS', 'NotebookRead'])
// No tool call for this long, and a running agent is thinking.
export const THINK_AFTER_MS = 4000
// A return round shows as returned for its first seconds.
export const RETURNED_MS = 6000
export const OVERLOAD_PCT = 80
// A finished run keeps moving this long, then holds its first frame.
export const SETTLE_MS = 10_000

type StateInput = {
  status: string
  round: number
  startedAt: number
  contextTokens: number
  contextMax: number
  toolNow?: string
  toolsInFlight?: number
  toolEndAt?: number
}

export function agentState(a: StateInput, at: number): PackState {
  if (a.status === 'failed') return 'failed'
  if (a.status === 'done') return 'done'
  if (a.contextMax > 0 && (a.contextTokens / a.contextMax) * 100 >= OVERLOAD_PCT) return 'overload'
  if (a.round > 1 && at - a.startedAt < RETURNED_MS) return 'returned'
  if ((a.toolsInFlight ?? 0) > 0 && a.toolNow) return READ_TOOLS.has(a.toolNow) ? 'reading' : 'working'
  return at - (a.toolEndAt ?? a.startedAt) > THINK_AFTER_MS ? 'thinking' : 'working'
}

export function parsePack(root: string, text: string): SpritePack | null {
  try {
    const d = JSON.parse(text) as Partial<SpritePack>
    const frames = Math.round(Number(d.frames))
    const frameMs = Math.round(Number(d.frameMs))
    if (!Array.isArray(d.states) || !d.states.length || !(frames > 0 && frames <= 64) || !(frameMs >= 40)) return null
    const items = Math.round(Number(d.items ?? 0))
    const scene = Math.round(Number(d.scene ?? 0))
    const variants: Record<string, number> = {}
    for (const [k, v] of Object.entries(d.variants ?? {})) {
      const n = Math.round(Number(v))
      if (n > 1 && n <= 16) variants[k] = n
    }
    return {
      root: root.replace(/\/+$/, ''),
      name: String(d.name || 'pack').slice(0, 40),
      frames,
      frameMs,
      states: d.states.map(String),
      items: items > 0 && items <= 64 ? items : 0,
      bench: d.bench === true,
      variants,
      scene: scene > 0 && scene <= 64 ? scene : 0,
    }
  } catch {
    return null
  }
}

// `seed` (a run's id) picks one of a state's alternates and keeps it for that run.
export function packFrame(pack: SpritePack, state: string, frame: number, seed = ''): string {
  const s = pack.states.includes(state) ? state : (pack.states[0] ?? state)
  const n = pack.variants[s] ?? 1
  const v = n > 1 ? hashOf(`${seed}:${s}`) % n : 0
  return `${pack.root}/${v ? `${s}~${v}` : s}-${((frame % pack.frames) + pack.frames) % pack.frames}.png`
}

export const packScene = (pack: SpritePack, frame: number): string => `${pack.root}/scene-${((frame % pack.scene) + pack.scene) % pack.scene}.png`
