---
name: fix-my-ui
description: Analyzes a UI screenshot and returns a premium 2026-grade redesign brief with spacing, typography, hierarchy, accessibility, and Tailwind specs. Trigger when someone shares a screenshot and wants it to look better.
version: 1.0.0
category: design
tools: [Claude Code, Cursor, Codex CLI, Gemini CLI]
---

# fix-my-ui

> The viral flagship. Drop in a screenshot of an ugly screen, get back a
> shareable "before → after" redesign brief that an engineer can implement today.

## Purpose

`fix-my-ui` exists because most founders and engineers can *tell* their UI looks
amateur but can't articulate *why* or *what to change*. This skill closes that
gap. It performs a structured visual audit of a screenshot, diagnoses the
specific failures (spacing, type scale, hierarchy, contrast, density), and emits
a concrete redesign brief — including Tailwind utility recommendations and motion
suggestions — calibrated to **2026 enterprise SaaS** aesthetics.

The output is designed to be **screenshot-worthy**: a clean before/after
narrative that founders share on X and LinkedIn.

## Use Cases

- Turning a prototype dashboard into something that looks funded.
- Fixing a landing page hero that isn't converting.
- Auditing a settings page, table, or form for density and clarity.
- Modernizing a dated UI (gradients, drop shadows, 2018 Bootstrap energy).
- Establishing a spacing + type system from a single screen.
- Pre-launch polish pass before a Product Hunt or demo day.

## Ideal User

A technical founder or full-stack engineer who can implement CSS/Tailwind but
lacks a designer. They want **specific, implementable instructions** — not "make
it pop" — and they want the result to look like a 2026 product, not a template.

## Input Requirements

| Input | Required | Notes |
|---|---|---|
| **Screenshot** | ✅ | The UI to fix. Full screen or component. |
| **Context** | Recommended | What is this screen? Who uses it? |
| **Stack** | Recommended | Tailwind / CSS / styled-components — changes the spec format. |
| **Brand constraints** | Optional | Existing colors, fonts, logo. |
| **Target vibe** | Optional | "Linear-like", "Stripe-like", "calm", "dense pro tool". Defaults to *premium dark-mode enterprise SaaS*. |

If no screenshot is provided, the skill asks for one — it cannot operate on a
text description alone.

## Operating Principles

1. **Diagnose before prescribing.** Name the specific failure before the fix.
2. **Systems over patches.** Fix the spacing scale, not one margin.
3. **Hierarchy is the job.** The eye should know where to go in < 1 second.
4. **Specificity is the product.** Every recommendation maps to a value or utility class.
5. **Accessibility is not optional.** Contrast and focus states are part of "looks good."
6. **Restraint reads as premium.** Fewer colors, fewer weights, more whitespace.
7. **Motion supports meaning** — never decoration for its own sake.

## Workflow Engine

### Step 1 — Read the screen
Describe what the UI *is* and what the user is trying to do on it. Identify the
intended primary action.

### Step 2 — Audit against the 8 pillars
Score each pillar 1–5 and note the specific failure:
1. **Spacing & rhythm** — consistent scale? breathing room?
2. **Typography** — type scale, weights, line-height, line-length.
3. **Hierarchy** — is the primary action obvious? is contrast doing work?
4. **Color & theming** — palette discipline, dark-mode quality, semantic color.
5. **Layout & density** — grid, alignment, bento structure, information density.
6. **Components** — buttons, inputs, cards — consistent and modern?
7. **Accessibility** — contrast ratios, focus states, target sizes, motion safety.
8. **Responsiveness** — does the layout hold at sm / md / lg?

### Step 3 — Diagnose the top failures
Pick the 3–5 highest-leverage problems. For each: what's wrong, why it reads as
amateur, what it costs the user.

### Step 4 — Prescribe the system
Define the corrected foundations:
- **Spacing scale** (e.g., 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64).
- **Type scale** (sizes, weights, line-heights).
- **Color tokens** (background layers, text layers, accent, semantic).
- **Radius, shadow, border** conventions.

### Step 5 — Prescribe the redesign
Walk the screen top-to-bottom. For each region: the change, and the exact
Tailwind utilities (or CSS) to achieve it.

### Step 6 — Add motion
Suggest 2–4 specific micro-interactions with timing and easing. Note any
`prefers-reduced-motion` handling.

### Step 7 — Write the before/after narrative
A tight, shareable summary of the transformation.

### Step 8 — Assemble the Output Schema.

## Output Schema

```markdown
# fix-my-ui — Redesign Brief

## What This Screen Is
<1–2 sentences + the intended primary action>

## Audit Scorecard
| Pillar | Score | Key issue |
|--------|:-----:|-----------|
| Spacing & rhythm | 2/5 | inconsistent 13/17/21px margins |
| Typography | 2/5 | 5 font sizes, 3 weights, no scale |
| ... | | |
**Overall: 2.3 / 5**

## Top Failures (highest leverage first)
1. **<failure>** — what's wrong / why it reads amateur / what it costs.

## The Corrected System
- **Spacing scale:** 4 8 12 16 24 32 48 64
- **Type scale:** ...
- **Color tokens:** ...
- **Radius / shadow / border:** ...

## Redesign — Region by Region
### <Region>
- Change: ...
- Tailwind: `class="..."`

## Motion
- <interaction> — `transition-* duration-* ease-*` — reduced-motion: ...

## Before → After
**Before:** <one sentence>
**After:** <one sentence>

## Implementation Checklist
- [ ] ...
```

## Quality Checklist

- [ ] A scorecard with all 8 pillars is present.
- [ ] Every prescribed change names a concrete value or Tailwind utility.
- [ ] A spacing scale and type scale are explicitly defined.
- [ ] Contrast ratios are checked; focus states are specified.
- [ ] At least 2 motion suggestions include timing and easing.
- [ ] A before/after narrative exists and is genuinely shareable.
- [ ] No recommendation is vague ("make it modern", "add polish").
- [ ] Responsiveness is addressed for at least sm and lg.

## Examples

**Input:** Screenshot of a SaaS analytics dashboard — gray-on-gray, 5 font sizes,
12px gutters, a blue "Save" button competing with three other blue elements.

**Output (abridged):**
- **Overall score:** 2.1 / 5.
- **Top failure:** No hierarchy — four elements share the same blue, so the eye
  has no entry point. Fix: one accent color, used once per view, on the primary action only.
- **System:** 8px spacing scale; 3-size type scale (`text-sm` / `text-base` /
  `text-2xl`, weights 400/600); 3 background layers (`#0a0a0b` / `#141416` / `#1c1c20`).
- **Before:** "A flat gray wall of numbers."
  **After:** "A layered dark dashboard where the one number that matters is the
  first thing you see."

See [`examples/fix-my-ui/`](../../examples/fix-my-ui/) for the full before/after brief.

## Anti-Patterns

- ❌ **Vague advice.** "Improve the spacing" — give the scale.
- ❌ **Patching one value.** Fix the system, not the symptom.
- ❌ **Adding more.** Premium UI usually means *removing* — colors, weights, borders.
- ❌ **Ignoring accessibility** because it "looks fine."
- ❌ **Trend-chasing.** Glassmorphism everywhere is not a strategy.
- ❌ **Generating code for a stack the user didn't mention.**
- ❌ **Operating without a screenshot.** Always require the image.

## Advanced Mode

- **Full design-token export** — emit a `tailwind.config` theme extension or CSS custom properties block.
- **Component spec sheet** — define button/input/card variants as a mini design system.
- **Multi-breakpoint redesign** — explicit layouts for sm / md / lg / xl.
- **A/B hypothesis** — frame the redesign as a testable conversion hypothesis.
- **Empty / loading / error states** — design the states the screenshot didn't show.
- **Accessibility audit deep-dive** — WCAG AA/AAA pass with exact contrast ratios.

## Best Practices

- Crop the screenshot to the screen you actually want fixed — full-window shots dilute the audit.
- Tell the skill your stack so the spec is copy-pasteable.
- Run it again on the *after* screenshot to confirm the score improved.
- Pair with `startup-roast` for a combined UX + conversion teardown.
- Save the "Corrected System" block — it becomes your design system seed.

## Integration Compatibility

| Tool | Support | Notes |
|---|---|---|
| Claude Code | ✅ Full | Best — strong vision + can write the Tailwind directly into your files. |
| Cursor | ✅ Full | Attach the screenshot in chat; invoke the skill by name. |
| Codex CLI | ⚠️ Partial | Vision support varies by model; text-described UIs get a reduced audit. |
| Gemini CLI | ✅ Full | Strong image input; redesign brief renders well. |
