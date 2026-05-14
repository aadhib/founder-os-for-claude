# Demos

Recorded walkthroughs of Founder OS in action. Each demo is a short, focused
clip — link them from the README and the website once recorded.

| Demo | Shows | Status |
|---|---|---|
| `install.cast` | `npx founder-os install` end to end | 🟡 to record |
| `fix-my-ui.cast` | Dropping a screenshot, getting a redesign brief | 🟡 to record |
| `startup-roast.cast` | Roasting a landing page live | 🟡 to record |
| `founder-mode.cast` | Generating a 90-day plan from a one-liner | 🟡 to record |

## Recording guide

```bash
# Record a terminal session
asciinema rec demos/install.cast

# Convert to a gif for the README
agg demos/install.cast demos/install.gif
```

Or use [`vhs`](https://github.com/charmbracelet/vhs) with a `.tape` script for
reproducible, scripted recordings — preferred for keeping demos in sync with
CLI changes.

## Style

- Clean prompt, no personal paths visible.
- 14px monospace, Founder OS palette (see `../screenshots/README.md`).
- Keep each clip under ~30s — one idea per demo.
- Caption the key moment so the GIF reads even on autoplay-muted feeds.
