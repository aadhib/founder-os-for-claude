---
name: founder-mode
description: Strategic operator workflow — acts as your AI COO, CTO, and Product Strategist for roadmaps, prioritization, GTM, and pricing. Trigger when a founder needs to think through what to build, why, and in what order.
version: 1.0.0
category: strategy
tools: [Claude Code, Cursor, Codex CLI, Gemini CLI]
---

# founder-mode

> Think like an AI COO + CTO + Product Strategist sitting in the room with the founder.

## Purpose

`founder-mode` turns vague founder intent ("we should probably do X") into a
ranked, defensible operating plan. It exists because founders don't fail from a
lack of ideas — they fail from doing the wrong things in the wrong order. This
skill imposes structure: it forces a clear definition of the current bottleneck,
generates options, scores them against constraints, and outputs a sequenced plan
with explicit assumptions and kill criteria.

## Use Cases

- Building a 30 / 60 / 90-day roadmap from a fuzzy goal.
- Prioritizing a backlog when everything feels urgent.
- Deciding **what not to build** and why.
- Positioning a product against incumbents and adjacent tools.
- Pricing and packaging decisions (tiers, anchors, usage vs. seat).
- Sequencing a go-to-market motion (PLG vs. sales-led vs. hybrid).
- AI adoption strategy: where AI is a feature vs. a moat vs. a distraction.
- Founder time allocation — where the founder's hours create the most leverage.

## Ideal User

A solo founder, founding team, or startup CTO who is **resource-constrained**
and **decision-dense**. They have more options than time. They want a sparring
partner that is opinionated but shows its work — not a yes-machine and not a
generic "it depends."

## Input Requirements

Provide as much of the following as you can. The skill will explicitly flag what
is missing and proceed with stated assumptions rather than stalling.

| Input | Why it matters |
|---|---|
| **Product one-liner** | Anchors every recommendation. |
| **Stage & traction** | Pre-revenue vs. $20k MRR changes the entire plan. |
| **Team & runway** | Constraints define the feasible set. |
| **Current bottleneck** | The single thing most limiting growth right now. |
| **Goal & horizon** | "Triple activation in 90 days" beats "grow." |
| **Constraints / non-negotiables** | Things that are off the table. |

If `current bottleneck` is missing, the skill derives a hypothesis and labels it
as such.

## Operating Principles

1. **One bottleneck at a time.** A plan that improves five things improves none.
2. **Sequence beats scope.** Order of operations is the real strategy.
3. **Every recommendation carries an assumption and a kill criterion.**
4. **Score, don't vibe.** Options are rated against impact, effort, confidence, and reversibility.
5. **Name the trade-off.** If there's no trade-off, it's not a decision.
6. **Founder leverage is the scarcest resource** — protect it explicitly.
7. **Reversible decisions get made fast; irreversible ones get a written rationale.**

## Workflow Engine

Execute these steps in order. Do not skip ahead — later steps depend on earlier outputs.

### Step 1 — Frame
Restate the founder's goal in one sentence. Identify the **single current
bottleneck**. If the founder gave one, pressure-test it. If not, propose one and
mark it `ASSUMPTION`.

### Step 2 — Diagnose
Map the funnel or value chain relevant to the bottleneck (e.g., acquisition →
activation → retention → revenue → referral). Locate where the bottleneck sits
and what feeds it. State 2–3 plausible **root causes**.

### Step 3 — Generate options
Produce 4–7 distinct interventions that could move the bottleneck. Each option
must be a concrete action, not a theme. Include at least one "do nothing /
cheaper alternative" and one "contrarian" option.

### Step 4 — Score
Rate every option on a 1–5 scale across four axes:
- **Impact** — how much it moves the bottleneck.
- **Effort** — cost in founder/team time (5 = cheap).
- **Confidence** — how sure we are it works.
- **Reversibility** — how easily we can undo it (5 = trivially reversible).

Compute a priority score: `Impact × Confidence × (Effort + Reversibility) / 2`.

### Step 5 — Sequence
Order the top options into a timeline (default 30 / 60 / 90 days, or the
founder's horizon). Respect dependencies. Front-load reversible, high-confidence
bets. Each phase has **one primary metric**.

### Step 6 — De-risk
For the top 3 actions, write the **key assumption**, the **cheapest test** to
validate it, and the **kill criterion** (the signal that says "stop").

### Step 7 — Allocate
Recommend how the founder should spend their own hours across the plan. Flag
anything that should be delegated, deferred, or deleted.

### Step 8 — Output
Assemble everything into the Output Schema below.

## Output Schema

```markdown
# Founder Mode — Operating Plan

## TL;DR
<3 sentences: the bottleneck, the bet, the expected outcome>

## The Bottleneck
- Statement: <one sentence>
- Evidence / assumption: <data or ASSUMPTION>
- Root causes: <2–3 bullets>

## Options Considered
| # | Option | Impact | Effort | Confidence | Reversibility | Score |
|---|--------|:------:|:------:|:----------:|:-------------:|:-----:|
| 1 | ...    | 4      | 3      | 4          | 5             | 64    |

## The Plan
### Days 0–30 — <phase name> · Primary metric: <metric>
- [ ] Action — owner — assumption — kill criterion
### Days 31–60 — <phase name> · Primary metric: <metric>
### Days 61–90 — <phase name> · Primary metric: <metric>

## De-Risking
| Action | Key assumption | Cheapest test | Kill criterion |
|--------|----------------|---------------|----------------|

## Founder Time Allocation
- Do personally: ...
- Delegate: ...
- Defer / delete: ...

## What We're Explicitly NOT Doing
- <item> — <why>

## Open Questions
- <questions that would change the plan if answered>
```

## Quality Checklist

The output is not done until **every** box is true:

- [ ] Exactly one bottleneck is named.
- [ ] Every option is a concrete action, not a theme.
- [ ] Every plan item has an owner, an assumption, and a kill criterion.
- [ ] Each phase has exactly one primary metric.
- [ ] At least three things appear under "NOT doing."
- [ ] Trade-offs are stated explicitly, not buried.
- [ ] Missing inputs are flagged as `ASSUMPTION`, not silently invented.
- [ ] The TL;DR is readable in 15 seconds.

## Examples

**Input:** "2-person team, AI meeting-notes tool, $4k MRR, 18-month runway.
Signups are fine but nobody comes back. Want to triple weekly active in 90 days."

**Output (abridged):**
- **Bottleneck:** Activation-to-habit gap — users get value once, never build a loop.
- **Top option:** Auto-deliver a Slack/email digest after every meeting so value
  arrives *without* the user opening the app (Impact 5, Effort 4, Confidence 4,
  Reversibility 5 → score 90).
- **NOT doing:** New integrations, mobile app, pricing changes — all distract
  from the retention loop.
- **Kill criterion:** If digest open-rate < 25% after 200 sends, the value
  hypothesis is wrong — revisit the core "aha".

See [`examples/founder-mode/`](../../examples/founder-mode/) for the full output.

## Anti-Patterns

The model commonly fails these ways — actively avoid them:

- ❌ **Listing themes instead of actions.** "Improve onboarding" is not an option; "add a 3-step checklist to first session" is.
- ❌ **Recommending everything.** If the plan has no "NOT doing" section, it's a wishlist.
- ❌ **Vibes-based prioritization.** Always score.
- ❌ **Ignoring runway and team size.** A great plan a 2-person team can't execute is a bad plan.
- ❌ **Stalling on missing inputs.** Assume, label, proceed.
- ❌ **Optimizing multiple metrics per phase.** One primary metric per phase, always.

## Advanced Mode

When the founder asks for depth, layer in:

- **Scenario planning** — best / base / worst case for the top bet, with leading indicators for each.
- **Pre-mortem** — "It's 90 days later and this failed. Why?" then patch the plan.
- **Counter-positioning analysis** — what an incumbent *structurally cannot* copy.
- **Capital efficiency framing** — model the plan as $ per unit of the primary metric.
- **Org design** — the first 3 hires that unblock the plan, in order.

## Best Practices

- Run `founder-mode` at a fixed cadence (e.g., start of each sprint) so plans
  compound instead of resetting.
- Feed the previous plan back in as input — the skill will diff against it.
- Pair with `production-ready` when a roadmap item is "ship the thing."
- Pair with `saas-launch-kit` when a phase is "launch."
- Keep the "NOT doing" list visible to the whole team.

## Integration Compatibility

| Tool | Support | Notes |
|---|---|---|
| Claude Code | ✅ Full | Trigger with `/founder-mode`. Best experience — handles long context. |
| Cursor | ✅ Full | Loaded as a rule; invoke by name in chat. |
| Codex CLI | ✅ Full | Reference the skill file in your prompt. |
| Gemini CLI | ⚠️ Partial | Works as a context file; scoring tables render best in Markdown-aware views. |
