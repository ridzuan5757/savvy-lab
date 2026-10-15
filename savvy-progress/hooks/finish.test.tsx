import { expect, mock, test } from 'claude-code/testing'

const T0 = Date.parse('2026-10-15T08:00:00Z')
const PANE = { component: 'Pane', requestId: 'savvy-agents', props: { title: '', isFocused: false, bodyColumns: 70, placement: 'dock', scroll: { offset: 0, bodyRows: 40 }, view: {} } as never } as const

test('finish: the pane still draws its agents once the flow is finished', async ($, on) => {
  mock.clock(on, { now: T0 })
  mock.env(on, { LANG: 'en_US.UTF-8' })
  on('settings.read', async () => ({ value: {} }) as never)
  on('session.start', async () => ({ cwd: '/repo' }) as never)
  let n = 0
  on('agent.spawn', async () => ({ model: 'claude-opus-5-5', agentId: `a${++n}` }) as never)
  await $.session.start({ source: 'startup', cwd: '/repo', surface: 'terminal', isInteractive: true } as never)
  await $.tool.call({ tool: 'mcp__savvy-progress__progress', title: 'Panel test', phase: 'delegate', total: 1, tasks: [{ title: 'Notes', tier: 'light' }] } as never)
  await $.agent.spawn({ tool_use_id: 's1', prompt: 'go', description: 'Notes', subagentType: 'savvy-flow:savvy-light' } as never)
  await $.tool.call({ tool: 'mcp__savvy-progress__progress', done: 1, finished: true } as never)

  const ui = await $.ui.mount({ plugin: 'savvy-progress', surface: 'terminal', ...PANE })
  const texts = (await ui.findAll({ type: 'Text' })).map(t => (t as unknown as { text?: string }).text ?? '')
  expect(texts.some(t => t.includes('Notes'))).toBe(true)
  await ui.unmount()
})
