import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

import { MARK_MS, applyOps, bashOps, benchTiles, buildFrame, claimOps, itemSprite, onTable, parseStatus, pickPalette, statusOps, table, tableSlots } from './lab'
import type { BashWindow } from './lab'

const T0 = Date.parse('2026-10-15T08:00:00Z')

test('files: rm, git rm and mv in Bash become deletes and new files', async () => {
  expect(bashOps('rm -f a.txt "b c.txt" && git rm -q d.py; mv e.py f.py')).toEqual([
    { path: 'a.txt', op: 'gone' },
    { path: 'b c.txt', op: 'gone' },
    { path: 'd.py', op: 'gone' },
    { path: 'e.py', op: 'gone' },
    { path: 'f.py', op: 'new' },
  ])
  expect(bashOps('ls -la && pytest -q')).toEqual([])
})

test('files: an edit keeps its place, a delete puffs and then leaves the table', async () => {
  let files = applyOps([], [{ path: 'a.py', op: 'new' }, { path: 'b.py', op: 'new' }], T0)
  files = applyOps(files, [{ path: 'a.py', op: 'edit' }], T0 + 100)
  expect(files.map(f => `${f.path}:${f.op}`)).toEqual(['a.py:edit', 'b.py:new'])

  files = applyOps(files, [{ path: 'b.py', op: 'gone' }], T0 + 200)
  expect(onTable(files, T0 + 300).map(f => f.path)).toEqual(['a.py', 'b.py'])
  expect(onTable(files, T0 + 200 + MARK_MS).map(f => f.path)).toEqual(['a.py'])

  // A Write over a file already on the table is an edit of it, not a second item.
  files = applyOps(files, [{ path: 'a.py', op: 'new' }], T0 + 300)
  expect(files.filter(f => f.path === 'a.py')).toEqual([{ path: 'a.py', op: 'edit', at: T0 + 300 }])
})

test('files: past the table width the oldest items leave and are counted', async () => {
  const many = applyOps([], Array.from({ length: 30 }, (_, i) => ({ path: `f${i}.py`, op: 'new' as const })), T0)
  const desk = table(30, many, T0, 0)
  expect(desk.hidden).toBeGreaterThan(0)
  expect(desk.pixels).toHaveLength(10)
  expect(desk.pixels.every(row => row.length === 30)).toBe(true)
})

test('palettes: a new run never takes a colour a running agent wears', async () => {
  const inUse = new Set<number>()
  for (let i = 0; i < 12; i++) inUse.add(pickPalette(`agent-${i}`, inUse))
  expect(inUse.size).toBe(12)
})

const PANE = { component: 'Pane', requestId: 'savvy-agents', props: { title: '', isFocused: false, bodyColumns: 70, placement: 'dock', scroll: { offset: 0, bodyRows: 40 }, view: {} } as never } as const

async function session($: Engine, on: On) {
  mock.clock(on, { now: T0 })
  mock.env(on, { LANG: 'en_US.UTF-8' })
  on('settings.read', async () => ({ value: {} }) as never)
  on('session.start', async () => ({ cwd: '/repo' }) as never)
  // The engine beneath answers the spawn and the tools as a session would.
  on('agent.spawn', async () => ({ model: 'claude-opus-5-5', agentId: 'a1' }) as never)
  on('tool.call', async e => {
    const call = e as unknown as { tool: string; file_path?: string }
    if (call.tool === 'Write') return { result: { type: 'create', filePath: call.file_path } } as never
    if (call.tool === 'Edit') return { result: { filePath: call.file_path } } as never
    return { result: {} } as never
  })
  await $.session.start({ source: 'startup', cwd: '/repo', surface: 'terminal', isInteractive: true } as never)
  await $.agent.spawn({ tool_use_id: 't1', prompt: 'go', description: 'Refactor TTL eviction', subagentType: 'savvy-flow:savvy-careful' } as never)
  await $.tool.call({ tool: 'Write', agentId: 'a1', file_path: '/repo/ttl.py', content: 'x' } as never)
  await $.tool.call({ tool: 'Edit', agentId: 'a1', file_path: '/repo/cache.py', old_string: 'a', new_string: 'b' } as never)
  await $.tool.call({ tool: 'Bash', agentId: 'a1', command: 'rm /repo/old.py' } as never)
}

test('terminal pane: a run draws its lab blob, its name, its file count and the table', async ($, on) => {
  await session($, on)
  const ui = await $.ui.mount({ plugin: 'savvy-progress', surface: 'terminal', ...PANE })
  expect(await ui.findAll({ type: 'Text', text: /^Pip$/ })).toHaveLength(1)
  expect((await ui.findAll({ type: 'Text', text: /2 files/ })).length).toBeGreaterThan(0)
  // Half-block pixels: the sprite's 8 lines and the table's 5.
  expect((await ui.findAll({ type: 'Text', text: /▀/ })).length).toBeGreaterThan(10)
  await ui.unmount()
})

test('desktop pane: a run draws a lab blob in its own palette', async ($, on) => {
  await session($, on)
  const ui = await $.ui.mount({ plugin: 'savvy-progress', surface: 'desktop', ...PANE })
  const svgs = (await ui.findAll({ type: 'Svg' })).map(s => String(s.props.source)).join('')
  expect(svgs).toContain('class="lab c-careful run"')
  expect(svgs).toMatch(/lab c-careful run/)
  await ui.unmount()
})

test('git status: new, edited, deleted and renamed files from two snapshots', async () => {
  const before = parseStatus(' M a.py\0?? notes/c.md\0?? notes/d.md\0')
  const after = parseStatus(' M a.py\0?? notes/d.md\0?? notes/e.md\0 M b.py\0 D old.py\0R  new.py\0moved.py\0')
  const diff = statusOps(before, after)
  expect(diff.ops).toEqual([
    { path: 'notes/e.md', op: 'new' },
    { path: 'b.py', op: 'edit' },
    { path: 'old.py', op: 'gone' },
    { path: 'new.py', op: 'new' },
    { path: 'moved.py', op: 'gone' },
  ])
  expect(diff.vanished).toEqual(['notes/c.md'])
})

// Two agents' Bash calls overlap: a long test run (Bubbles, a1) and a quick
// command that makes a note (Zippy, b1). Both snapshots see the note.
test('git status: a file two overlapping Bash calls both saw goes to the shorter call', async () => {
  const note = { path: '/repo/notes/a.md', op: 'new' as const }
  const own = { path: '/repo/own.py', op: 'new' as const }

  // The quick call ends first and keeps the note; the long one, ending later, gives it up.
  let windows: BashWindow[] = [{ key: 'ta', agentId: 'a1', start: T0 }, { key: 'tb', agentId: 'b1', start: T0 + 100 }]
  expect(claimOps(windows, 'tb', 'b1', T0 + 100, T0 + 150, [note]).ops).toEqual([note])
  const long = claimOps(windows, 'ta', 'a1', T0, T0 + 5000, [note, own])
  expect(long.ops).toEqual([own])
  expect(long.stolen.size).toBe(0)

  // The long call ends first and takes the note; the quick one, ending later, takes it back.
  windows = [{ key: 'ta', agentId: 'a1', start: T0 }, { key: 'tb', agentId: 'b1', start: T0 + 4900 }]
  expect(claimOps(windows, 'ta', 'a1', T0, T0 + 5000, [note, own]).ops).toEqual([note, own])
  const quick = claimOps(windows, 'tb', 'b1', T0 + 4900, T0 + 5100, [note])
  expect(quick.ops).toEqual([note])
  expect([...(quick.stolen.get('a1') ?? [])]).toEqual(['/repo/notes/a.md'])
})

test('table sprites: one frame file per kind, colour and state; room for one item per 5 columns', async () => {
  const fresh = { path: 'a.py', op: 'edit' as const, at: T0 }
  expect(itemSprite('/p', fresh, T0 + 10, 1)).toMatch(/^\/p\/assets\/items\/\d-\d-edit1\.png$/)
  expect(itemSprite('/p', fresh, T0 + MARK_MS, 1)).toMatch(/-plain\.png$/)
  expect(itemSprite('/p', { path: 'b.py', op: 'gone', at: T0 }, T0 + 10, 0)).toBe('/p/assets/items/puff0.png')
  const files = applyOps([], Array.from({ length: 20 }, (_, i) => ({ path: `f${i}.py`, op: 'new' as const })), T0)
  const slots = tableSlots(42, files, T0)
  expect(slots.shown).toHaveLength(8)
  expect(slots.hidden).toBe(12)
  expect(slots.shown[7]?.path).toBe('f19.py')
})

test('git status: a command that names the file keeps it, however short the other call', async () => {
  const note = { path: '/repo/savvy/notes/a.md', op: 'new' as const }
  // Pip runs a quick `ls cache` while Zippy's loop in notes/ makes the note.
  const windows: BashWindow[] = [{ key: 'tz', agentId: 'z', start: T0, command: 'cd savvy/notes && for f in a b; do echo x > $f.md; done' }, { key: 'tp', agentId: 'p', start: T0 + 10, command: 'ls cache' }]
  expect(claimOps(windows, 'tp', 'p', T0 + 10, T0 + 20, [note], 'ls cache').ops).toEqual([note])
  const zippy = claimOps(windows, 'tz', 'z', T0, T0 + 500, [note], 'cd savvy/notes && for f in a b; do echo x > $f.md; done')
  expect(zippy.ops).toEqual([note])
  expect([...(zippy.stolen.get('p') ?? [])]).toEqual(['/repo/savvy/notes/a.md'])
})

test('bench tiles: legs at both ends and planks that add up to the width', async () => {
  for (const cols of [4, 10, 23, 47]) {
    const tiles = benchTiles('/p', cols)
    expect(tiles.reduce((n, [, c]) => n + c, 0)).toBe(cols)
    if (cols >= 10) expect([tiles[0]?.[0], tiles[tiles.length - 1]?.[0]]).toEqual(['/p/assets/items/bench-left.png', '/p/assets/items/bench-right.png'])
  }
})

test('build loop: a planned blob plays 16 frames of its tier, others fall back to Mocha', async () => {
  expect(buildFrame('/p', 'careful', 17)).toBe('/p/assets/build/careful-1.png')
  expect(buildFrame('/p', 'nope', 0)).toBe('/p/assets/build/other-0.png')
})
