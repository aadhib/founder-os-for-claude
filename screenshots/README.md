# Brand assets

| File | Used in | Status |
|---|---|---|
| `logo.svg` | README header, website | ✅ final |

The README no longer uses mockup placeholder images — it shows **real CLI
output**, a **real `fix-my-ui` audit scorecard** (from `examples/fix-my-ui/`),
and a **live star-history chart** (rendered by star-history.com from the repo's
actual stars).

## If you add real captures later

- **Width:** 820px for inline README images, 600px for charts.
- **Theme:** dark — background `#0a0a0b`, surface `#141416`, accent `#8b5cf6`,
  highlight `#bef264`. Match `logo.svg`.
- **Terminal captures:** record with [`vhs`](https://github.com/charmbracelet/vhs)
  or `asciinema` + `agg`, 14px monospace, the Founder OS palette.
- Drop the file here and reference it from `README.md` with a relative path.
