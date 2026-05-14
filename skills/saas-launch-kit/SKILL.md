---
name: saas-launch-kit
description: Generates an end-to-end SaaS launch plan — positioning, landing copy, pricing, onboarding, email flows, Product Hunt plan, SEO, and analytics. Trigger when a founder is preparing to launch or relaunch a product.
version: 1.0.0
category: growth
tools: [Claude Code, Cursor, Codex CLI, Gemini CLI]
---

# saas-launch-kit

> Everything you need to take a SaaS from "it works" to "people are paying" —
> generated as one coherent, sequenced launch system.

## Purpose

`saas-launch-kit` solves the founder's "launch is a thousand small things"
problem. Instead of cobbling together a positioning doc, some landing copy, a
pricing page, an onboarding flow, and a Product Hunt checklist from ten different
sources, this skill produces them as **one internally-consistent system** — every
asset derives from the same positioning, so the messaging never contradicts
itself across surfaces.

## Use Cases

- First public launch of a new SaaS.
- Relaunch / repositioning of an existing product.
- Product Hunt, Hacker News, or demo-day preparation.
- Spinning up a waitlist and pre-launch funnel.
- Rewriting a landing page that isn't converting.
- Designing onboarding + lifecycle emails for a new tier.

## Ideal User

A founder 2–6 weeks from launch who has a working product and no marketing team.
They need launch-ready assets that are coherent, credible, and not cringe — and
they need them fast.

## Input Requirements

| Input | Required | Notes |
|---|---|---|
| **Product description** | ✅ | What it does, for whom. |
| **Target customer** | ✅ | The narrower, the better the copy. |
| **Core differentiator** | ✅ | Why you, not the incumbent. |
| **Pricing intent** | Recommended | Free tier? usage vs. seat? rough price points. |
| **Launch channels** | Recommended | PH, HN, X, communities, cold outbound. |
| **Existing assets** | Optional | Current site, logo, brand voice. |
| **Launch date** | Optional | Enables a dated countdown plan. |

Missing required inputs are requested before generation — launch copy built on a
guessed customer is worse than no copy.

## Operating Principles

1. **Positioning is the source of truth.** Every asset descends from it.
2. **One customer, one promise, one primary CTA** — across all surfaces.
3. **Specific beats clever.** Concrete outcomes outperform wordplay.
4. **Credibility before persuasion.** Proof, then pitch.
5. **Launch is a sequence, not a day.** Pre-launch → launch → post-launch.
6. **Pricing communicates value** — packaging is a messaging decision.
7. **Instrument everything** — if it's not measured, it didn't launch.

## Workflow Engine

### Step 1 — Lock positioning
Produce a positioning statement: *For [customer] who [need], [product] is the
[category] that [key benefit]. Unlike [alternative], we [differentiator].*
Everything downstream references this.

### Step 2 — Messaging hierarchy
Derive: the one-liner, the headline, 3 value pillars, and the objection list with
responses.

### Step 3 — Landing page copy
Section-by-section copy: hero, social proof, problem, solution, value pillars,
how-it-works, pricing teaser, FAQ, final CTA. One primary CTA throughout.

### Step 4 — Pricing & packaging
Recommend tier structure, names, price points, the anchor, what gates each tier,
and the free/trial strategy. Explain the logic.

### Step 5 — Onboarding flow
Design the activation path: signup → first value ("aha") → habit. Define the
single activation metric.

### Step 6 — Lifecycle emails
Write the sequence: welcome, activation nudges, feature education, trial-ending,
win-back. Subject + body skeleton for each.

### Step 7 — Launch sequence
A dated plan: pre-launch (waitlist, teaser, list warm-up), launch day (PH/HN/X
choreography, hour-by-hour), post-launch (follow-up, retargeting, content).

### Step 8 — SEO & content scaffold
Sitemap, core pages, the first 5–10 content pieces mapped to search intent, and
required legal pages.

### Step 9 — Analytics setup
The event taxonomy, the funnel to instrument, the north-star and guardrail metrics.

### Step 10 — Assemble the Output Schema.

## Output Schema

```markdown
# SaaS Launch Kit — <Product>

## 1. Positioning
- Statement: For ... who ... <product> is the ... that ... Unlike ... we ...
- One-liner: ...
- Headline + subhead: ...
- Value pillars: 1) ... 2) ... 3) ...
- Objections & responses: | objection | response |

## 2. Landing Page Copy
### Hero / Social Proof / Problem / Solution / Pillars / How It Works / Pricing / FAQ / Final CTA
<copy per section>

## 3. Pricing & Packaging
| Tier | Price | For whom | Gates | Notes |
- Anchor logic: ...
- Free / trial strategy: ...

## 4. Onboarding Flow
- Activation metric: ...
- Steps: signup → ... → aha → habit

## 5. Lifecycle Emails
| # | Trigger | Subject | Goal | Body skeleton |

## 6. Launch Sequence
### Pre-launch (T-14 → T-1) / Launch Day (hour-by-hour) / Post-launch (T+1 → T+14)

## 7. SEO & Content
- Sitemap / core pages / first 10 content pieces / legal pages checklist

## 8. Analytics
- Event taxonomy / funnel / north-star + guardrails

## Launch Readiness Checklist
- [ ] ...
```

## Quality Checklist

- [ ] One positioning statement; every asset traces back to it.
- [ ] Exactly one primary CTA across all surfaces.
- [ ] Pricing tiers each state who they're for and what they gate.
- [ ] Onboarding names a single activation metric.
- [ ] Email sequence covers welcome → activation → trial-end → win-back.
- [ ] Launch sequence is dated and has an hour-by-hour launch day.
- [ ] Legal pages checklist is present (privacy, terms, etc.).
- [ ] Analytics section defines a north-star and at least one guardrail.
- [ ] No section contradicts the positioning.

## Examples

**Input:** "Inboxly — an AI inbox triage tool for solo founders. Differentiator:
it drafts replies in *your* voice from your past sent mail. Want to launch on PH
in 3 weeks."

**Output (abridged):**
- **Positioning:** "For solo founders drowning in email, Inboxly is the AI inbox
  assistant that drafts replies in your actual voice. Unlike generic AI email
  tools, we learn from your sent mail — so drafts sound like you, not a robot."
- **Headline:** "Your inbox, triaged. Your replies, in your voice."
- **Pricing:** Free (50 drafts/mo, anchor), Pro $19/mo (unlimited + voice tuning),
  Team $49/seat. Free tier gates volume, not the core magic.
- **Launch day:** 12:01am PT PH post → 6am founder X thread → 9am HN Show HN →
  all-day comment presence → 5pm "we're #1" update.

See [`examples/saas-launch-kit/`](../../examples/saas-launch-kit/) for the full kit.

## Anti-Patterns

- ❌ **Inconsistent messaging** — the hero says one thing, pricing page says another.
- ❌ **Multiple primary CTAs** competing on the same page.
- ❌ **Clever headlines** that don't say what the product does.
- ❌ **Pricing with no anchor** or no logic for the tiering.
- ❌ **A launch "day" with no pre-launch** — launches need warm-up.
- ❌ **Onboarding with no activation metric.**
- ❌ **Forgetting legal pages** — they block real launches.

## Advanced Mode

- **Multi-segment positioning** — distinct messaging tracks for 2–3 ICPs.
- **Conversion-rate model** — projected funnel math from traffic to revenue.
- **Channel-specific launch copy** — tailored PH, HN, X, and Reddit variants.
- **Cold outbound sequence** — if launch includes sales-led motion.
- **Pricing experiment design** — Van Westendorp / tier-test plan.
- **Press / influencer kit** — one-pager, assets list, outreach templates.

## Best Practices

- Lock positioning *first* and don't touch it once downstream assets are built.
- Run `startup-roast` on the generated landing copy before you ship it.
- Run `fix-my-ui` on the landing page design once copy is in place.
- Use `founder-mode` to decide *whether* now is the right time to launch.
- Keep the readiness checklist as your literal pre-launch gate.

## Integration Compatibility

| Tool | Support | Notes |
|---|---|---|
| Claude Code | ✅ Full | Can write copy directly into your marketing site files. |
| Cursor | ✅ Full | Great for generating + placing landing page sections. |
| Codex CLI | ✅ Full | Reference the skill file; outputs as Markdown. |
| Gemini CLI | ✅ Full | Long-form generation works well as a context file. |
