import { expect, mock, test } from 'claude-code/testing'

const PANE = { component: 'Pane', requestId: 'savvy-agents', props: { title: '', isFocused: false, bodyColumns: 70, placement: 'dock', scroll: { offset: 0, bodyRows: 40 }, view: {} } as never } as const

test('main: with no subagents the panel shows the main session row', async ($, on) => {
  mock.clock(on, { now: Date.parse('2026-10-15T08:00:00Z') })
  mock.env(on, { LANG: 'en_US.UTF-8' })
  on('settings.read', async () => ({ value: {} }) as never)
  on('session.start', async () => ({ cwd: '/repo' }) as never)
  await $.session.start({ source: 'startup', cwd: '/repo', surface: 'terminal', isInteractive: true } as never)
  const ui = await $.ui.mount({ plugin: 'savvy-progress', surface: 'terminal', ...PANE })
  expect((await ui.findAll({ type: 'Text', text: /Main session/ })).length).toBeGreaterThan(0)
  expect(await ui.findAll({ type: 'Text', text: /No subagents yet/ })).toHaveLength(0)
  await ui.unmount()
})

test('main: showMain off keeps the panel to subagents', { options: { showMain: 'off' } }, async ($, on) => {
  mock.clock(on, { now: Date.parse('2026-10-15T08:00:00Z') })
  mock.env(on, { LANG: 'en_US.UTF-8' })
  on('settings.read', async () => ({ value: {} }) as never)
  on('session.start', async () => ({ cwd: '/repo' }) as never)
  await $.session.start({ source: 'startup', cwd: '/repo', surface: 'terminal', isInteractive: true } as never)
  const ui = await $.ui.mount({ plugin: 'savvy-progress', surface: 'terminal', ...PANE })
  expect(await ui.findAll({ type: 'Text', text: /Main session/ })).toHaveLength(0)
  await ui.unmount()
})
