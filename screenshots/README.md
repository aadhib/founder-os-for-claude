# Screenshots & brand assets

Visual assets used in the README, docs, and website.

| File | Used in | Status |
|---|---|---|
| `logo.svg` | README header, website | ✅ final |
| `hero.svg` | README hero | 🟡 placeholder — replace with a real terminal capture |
| `install-flow.svg` | README install section | 🟡 placeholder — replace with a real recording/capture |
| `before-after.svg` | README examples section | 🟡 placeholder — replace with a real `fix-my-ui` before/after |
| `star-history.svg` | README star-history section | 🟡 placeholder — embed [star-history.com](https://star-history.com) after launch |

## Asset spec (for replacements)

- **Width:** 820px for inline README images, 600px for the star chart.
- **Theme:** dark — background `#0a0a0b`, surface `#141416`, accent `#8b5cf6`,
  highlight `#bef264`. Keep it consistent with `logo.svg`.
- **Format:** SVG where vector works; PNG/GIF for real captures. Update the
  README `<img src>` if the extension changes.
- **Terminal captures:** record with a clean prompt, 14px monospace, the Founder
  OS color palette. Tools like `asciinema` + `agg` or `vhs` work well.

The SVG placeholders are intentionally branded and presentable — the repo looks
finished today, and assets can be swapped without touching layout.
