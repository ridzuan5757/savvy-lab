# savvy-lab

Claude Code plugins for orchestrated subagent work, with a lab of animated blobs that shows what each agent does.

> **Fork notice.** `filetree` here is a fork of [data-goblin/claude-code-filetree](https://github.com/data-goblin/claude-code-filetree) (0.2.26, MIT, © Kurt Buhler), forked to hide the tree on a narrow terminal, bring it back when wide, and keep it after the savvy agents panel; its license is in [filetree/LICENSE](filetree/LICENSE).
>
> `savvy-progress` here is a fork of [johnnyvizz/claude-kit](https://github.com/johnnyvizz/claude-kit) (savvy-progress 1.2.1, MIT). It was forked to add the lab blobs, the per-agent lab table of file work, the planned-task build loop and real terminal pictures. The original work is © johnnyvizz; see [LICENSE](LICENSE).

| Lab blobs | Lab table | Planned build loop |
| --- | --- | --- |
| ![Lab blobs](docs/blobs.png) | ![Lab table](docs/lab-table.png) | ![Planned build loop](docs/planned-build.png) |

## Plugins

| Plugin | What it does |
| --- | --- |
| [`savvy-progress`](savvy-progress) | Progress bar above the prompt and an agents panel. Each subagent is a lab blob: its gear shows the tier, its colour is its own, and its lab table shows the files it writes, edits and deletes. |
| [`filetree`](filetree) | IDE-style file tree in the sidebar with git status and highlights on the files Claude reads and writes. The fork hides it when the terminal is narrower than 160 columns (`hideBelow`), opens it again when the terminal is wide, and moves it to the tab after the savvy agents panel. |
| [`savvy-flow-autostart`](savvy-flow-autostart) | A `SessionStart` hook that loads the savvy-flow playbook into every session, so each task goes through plan → delegate → review without the slash command. |

## Install

1. Add the marketplace:
   ```
   claude plugin marketplace add ridzuan5757/savvy-lab
   ```
2. Install the panel and the file tree:
   ```
   claude plugin install savvy-progress@local-plugins
   claude plugin install filetree@local-plugins
   ```
3. Optional: install savvy-flow from upstream, and the autostart hook. For one project only, install the hook with `--scope local` from that project's folder.
   ```
   claude plugin marketplace add johnnyvizz/claude-kit
   claude plugin install savvy-flow@claude-kit
   claude plugin install savvy-flow-autostart@local-plugins
   ```
4. Restart Claude Code.

If you have the upstream `savvy-progress@claude-kit` or `filetree@claude-code-filetree` installed, uninstall it: each pair registers the same tools and panes.

## Requirements

- Terminal pictures need a terminal with the kitty graphics protocol and Unicode placeholders: Ghostty, kitty or a libghostty terminal. Other terminals get half-block pixel sprites.
- Bash file tracking needs the session to run inside a git repository; elsewhere only `rm` and `mv` in the command text are seen.
- `savvy-flow-autostart` needs `savvy-flow@claude-kit`.

## Rebuild the sprites

```
tools/render/render.sh
```

It needs Google Chrome and Python 3 with Pillow. See [tools/render](tools/render).

## License

MIT. See [LICENSE](LICENSE).
