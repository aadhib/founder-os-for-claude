# Example — `fix-my-ui`

A real run of the `fix-my-ui` skill on an ugly SaaS analytics dashboard.

---

## Input

> Screenshot: a SaaS analytics dashboard. Gray-on-gray, 5 different font sizes,
> 12px gutters everywhere, a blue "Save" button competing with three other blue
> elements, no clear focal point. Stack: React + Tailwind. Target vibe: premium
> dark-mode enterprise SaaS.

_(See `before.png` / `after.png` for the visual pair.)_

---

## Output

# fix-my-ui — Redesign Brief

## What This Screen Is
A SaaS analytics dashboard. The user's primary job is to read the headline
metric and spot anomalies. Right now nothing signals where to look first.

## Audit Scorecard
| Pillar | Score | Key issue |
|--------|:-----:|-----------|
| Spacing & rhythm | 2/5 | inconsistent 12/13/17px gutters, no scale |
| Typography | 2/5 | 5 sizes, 3 weights, no hierarchy |
| Hierarchy | 1/5 | 4 elements share the same blue — no entry point |
| Color & theming | 2/5 | flat gray, no background layering, dark mode is just "dark gray" |
| Layout & density | 3/5 | grid is fine; cards are over-bordered |
| Components | 2/5 | buttons inconsistent, inputs un-styled |
| Accessibility | 2/5 | gray text on gray fails AA contrast; no focus states |
| Responsiveness | 3/5 | holds at lg, collapses awkwardly at sm |

**Overall: 2.1 / 5**

## Top Failures (highest leverage first)
1. **No hierarchy.** Four elements use the same blue, so the eye has no entry
   point. It reads as "a wall of equally-important things" — which is exhausting
   and reads as amateur. Costs the user the 1 second it should take to find the
   number that matters.
2. **No spacing system.** Gutters are 12/13/17px at random. The inconsistency is
   subconsciously read as "unfinished."
3. **No background layering.** Dark mode is one flat gray. Premium dark UIs use
   2–3 elevation layers so cards feel placed, not painted on.
4. **Contrast fails AA.** `#8a8a8a` text on `#2b2b2b` is ~2.9:1. Unreadable and
   inaccessible.

## The Corrected System
- **Spacing scale:** `4 8 12 16 24 32 48 64` — nothing off-scale.
- **Type scale:** `text-xs` (labels), `text-sm` (body), `text-3xl font-semibold`
  (the one headline metric). Two weights only: 400 / 600.
- **Color tokens:**
  - bg layers: `#0a0a0b` (app) → `#141416` (card) → `#1c1c20` (raised)
  - text: `#fafafa` (primary) / `#a1a1aa` (secondary) — both pass AA
  - accent: `#8b5cf6` — used **once per view**, on the primary action only
  - semantic: `#22c55e` up, `#ef4444` down
- **Radius / shadow / border:** `rounded-xl`, shadow only on raised layer,
  `border-white/5` instead of hard gray borders.

## Redesign — Region by Region

### Header
- Change: demote the page title, promote the headline metric to hero size.
- Tailwind: title `text-sm text-zinc-400`; metric `text-3xl font-semibold text-zinc-50`.

### Metric cards
- Change: remove hard borders, add background layering, align to the 8px scale.
- Tailwind: `bg-[#141416] rounded-xl p-6 border border-white/5 space-y-2`.

### Action bar
- Change: only "Save" gets the accent. Everything else becomes `ghost`.
- Tailwind: primary `bg-violet-500 hover:bg-violet-400 text-white rounded-lg px-4 py-2`;
  others `text-zinc-400 hover:text-zinc-100`.

### Chart
- Change: drop the chart's own gridlines color to `white/5`, let the data line
  carry the accent.

## Motion
- Metric cards: `transition-colors duration-150 ease-out` on hover (subtle lift via bg).
- Number changes: count-up over `400ms ease-out`. Reduced-motion: snap instantly.
- Primary button: `active:scale-[0.98] transition-transform duration-100`.

## Before → After
**Before:** A flat gray wall of numbers where everything is equally loud.
**After:** A layered dark dashboard where the one number that matters is the
first — and obvious — thing you see.

## Implementation Checklist
- [ ] Replace ad-hoc spacing with the 8px scale.
- [ ] Collapse to a 3-size, 2-weight type scale.
- [ ] Introduce 3 background elevation layers.
- [ ] Restrict the accent color to the single primary action.
- [ ] Fix text contrast to pass WCAG AA.
- [ ] Add focus-visible states to all interactive elements.
- [ ] Add the three motion micro-interactions with reduced-motion handling.
