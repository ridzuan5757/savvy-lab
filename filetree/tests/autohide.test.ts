import { expect, test } from 'claude-code/testing'

import { GAP, parseHideBelow, shouldHide, shouldShow, terminalColumns } from '../hooks/autohide'

test('autohide: a docked pane adds its width to the conversation to give the terminal', async () => {
  expect(terminalColumns(178, true, 58)).toBe(238)
  expect(terminalColumns(119, false, 58)).toBe(119)
})

test('autohide: hides below the line unless opened on purpose, and always off the dock', async () => {
  expect(shouldHide(true, 238, 160, false)).toBe(false)
  expect(shouldHide(true, 119, 160, false)).toBe(true)
  expect(shouldHide(true, 119, 160, true)).toBe(false)
  expect(shouldHide(false, 238, 160, true)).toBe(true)
  expect(shouldHide(true, 50, 0, false)).toBe(false)
})

test('autohide: comes back only past the gap, so the edge does not flicker', async () => {
  expect(shouldShow(165, 160)).toBe(false)
  expect(shouldShow(160 + GAP, 160)).toBe(true)
  expect(parseHideBelow('140')).toBe(140)
  expect(parseHideBelow('nope')).toBe(160)
})
