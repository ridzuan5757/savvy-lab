// Fork addition (savvy-lab): hide the tree on a narrow terminal and bring it back
// once the terminal is wide again.

// Below this many terminal columns the pane hides; it comes back at HIDE + GAP,
// so a width near the line does not make it flicker.
export const HIDE_BELOW_DEFAULT = 160
export const GAP = 10

// The render viewport's `columns` is the conversation's width: while the pane is
// docked, the terminal is that plus the dock (its body and its frame).
export const terminalColumns = (conversation: number, docked: boolean, paneBody: number): number =>
  docked ? conversation + paneBody + 2 : conversation

export const parseHideBelow = (value: unknown): number => {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : HIDE_BELOW_DEFAULT
}

// The pane hides when it is not docked, or when the terminal is narrow and the
// person did not open it on purpose since the terminal was last wide.
export const shouldHide = (docked: boolean, columns: number, hideBelow: number, held: boolean): boolean =>
  !docked || (!held && hideBelow > 0 && columns < hideBelow)

export const shouldShow = (conversation: number, hideBelow: number): boolean => conversation >= hideBelow + GAP
