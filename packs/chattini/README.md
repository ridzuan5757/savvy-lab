# Chattini sprite pack (recipe)

A savvy-progress sprite pack starring **Chattini**, the mascot of **Raora Panthera** (hololive English -Justice-). Each subagent in the panel shows as Chattini in the state it is in, and its lab table becomes a café counter with Chattini's own items.

| State | Emote |
|---|---|
| working | notebook and pencil |
| reading | glasses, finger up |
| thinking | question mark |
| done | star eyes |
| failed | crying |
| planned | lying down |
| overload | spiral eyes |
| returned | side-eye |

## This folder has no official art

The agent frames are made from Raora Panthera's emotes, which belong to COVER Corporation and their artists. This repository does **not** include them. `build.sh` downloads the emotes from [hololive.wiki](https://hololive.wiki/wiki/Category:Emotes_-_Raora_Panthera) on your own machine and renders the pack there, for your personal, non-commercial use. Follow [hololive's derivative works guidelines](https://hololive.tv/terms) and do not redistribute the built pack.

The bench items (pickle, gift box, flower pot, glow sticks, espresso, pizza, gelato, pasta), the heart, sparkle and puff marks and the café counter are drawn for this pack in `render-items.html` and are covered by this repository's MIT license.

## Build and use

Needs `curl`, Python 3 with Pillow, and Google Chrome (set `CHROME` for another path).

```sh
packs/chattini/build.sh                 # writes ~/.claude/sprite-packs/chattini
```

Then in Claude Code: `/plugin configure savvy-progress@local-plugins` and set `spritePack` to that folder. Restart Claude Code.

## Credits

- **Chattini** and **Raora Panthera** © COVER Corporation (hololive production). Emote art by its original artists.
- Emote files are fetched from [hololive.wiki](https://hololive.wiki).
- Animation, bench items and the pack format: savvy-lab.

This is an unofficial, non-commercial fan project, not affiliated with or endorsed by COVER Corporation.
