# savvy-progress (lab fork)

> Forked from [johnnyvizz/claude-kit](https://github.com/johnnyvizz/claude-kit/tree/main/plugins/savvy-progress) (savvy-progress 1.2.1, MIT) to add the lab blobs, the lab table of each agent's file work and the planned-task build loop. See [What the fork adds](#what-the-fork-adds).

A Claude Code mod: a progress bar above the prompt and a live panel of subagents. Made for the [savvy-flow](https://github.com/johnnyvizz/claude-kit/tree/main/plugins/savvy-flow) skill, and useful with any subagents.

## What the fork adds

- **Lab blobs in place of the crabs.** The gear shows the tier: Professor Puff (fable, mortarboard and starlight flask), Dr. Lumen (heavy, headlamp and microscope), Pip (careful, goggles and pipette), Bubbles (medium, bubbling flask), Zippy (light, propeller beanie and clipboard), Scout (Explore, bucket hat and magnifier), Mocha (other, bow and coffee).
- **A colour per run.** Each run gets one of 12 palettes that no running agent wears; a return round keeps its colour.
- **Real pictures in the terminal.** In terminals with kitty graphics (Ghostty, kitty), the panel draws the vector art as PNG sprite frames at 8 fps. Elsewhere it falls back to 16×16 half-block pixel sprites.
- **A lab table per agent.** One item per file the agent wrote, edited or deleted: a new file gets a green `+`, an edit a sparkle, a delete a puff. Bash file work is found by comparing `git status` before and after each subagent command; when two agents' commands overlap, the command that names the file keeps it.
- **A build loop for planned tasks.** A planned task's blob hammers its workstation together until the task starts.
- **The panel opens again** for each new subagent if it was closed (`autoOpen: any`).

The sprite frames in `assets/` are rendered from SVG by the tools in [`tools/render`](../tools/render).

- **Progress bar**: the flow's title, phase, accepted tasks out of planned, and a button with the crew size that opens the panel. It appears once something reports progress (savvy-flow does) or a `savvy-*` worker starts.
- **Agents panel** (`/agents-info` toggles it; `/agents-info open` opens it or brings it forward without toggling): running, finished and planned subagents with model, effort, task progress, context, estimated cost and time. Each lab blob animates its gear while it works. `prefers-reduced-motion` stops the desktop animations.

## Tools it adds

- `mcp__savvy-progress__progress`: the orchestrator reports the plan, phase and accepted tasks. Only the main session can: a call from a subagent is ignored, so a worker cannot rename, finish or reset the flow.
- `mcp__savvy-progress__step`: a worker reports its own steps (`done`, `total`, `note`). A worker that does not report shows its context fill in grey instead. The tool is listed up front rather than behind ToolSearch, and each `savvy-*` worker gets one line at the end of its brief asking for these reports.

Cost is a rough estimate from token counts and a built-in per-model price table (`PRICES` in `hooks/register.tsx`, list prices as of 2026-10-10), not a bill. Cache writes are priced at the 1-hour rate, which is what Claude Code writes on a subscription; a session that writes 5-minute entries is overestimated there.

## Settings

`language`: `auto` (default), `en`, `ru` or `he`. Hebrew draws the bar and the panel right to left. `auto` follows Claude Code's `language` setting, then the system locale, and falls back to English. Set it in `/config`, or, for a mod loaded by hand, in `~/.claude/settings.json`:

```json
{ "pluginConfigs": { "savvy-progress": { "options": { "language": "ru" } } } }
```

`autoOpen`: `savvy` (default) or `any`. With `savvy` the panel opens by itself when a `savvy-*` worker starts or a plan is reported. With `any` it also opens, once per session, when any other subagent starts. `/agents-info` toggles it either way.

Install instructions are in the [repository README](../../README.md).
