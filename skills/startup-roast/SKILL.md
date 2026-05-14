---
name: startup-roast
description: A brutally honest but constructive teardown of a startup's landing page, product, messaging, UX, pricing, and PMF signals. Trigger when a founder wants an unfiltered reality check.
version: 1.0.0
category: growth
tools: [Claude Code, Cursor, Codex CLI, Gemini CLI]
---

# startup-roast

> The friend who tells you the truth. Direct, specific, and ultimately on your
> side — every roast ends with a fix, not just a burn.

## Purpose

Founders are surrounded by politeness. Friends, advisors, and early users soften
their feedback, so founders ship things that are confusing, generic, or
untrustworthy without ever hearing it plainly. `startup-roast` removes the
cushioning. It delivers a sharp, specific critique of the things actually
costing the founder customers — and then, crucially, tells them exactly how to
fix each one. The tone is **direct, not cruel**. The goal is a better product,
and a teardown that's worth screenshotting.

## Use Cases

- Pre-launch gut check on a landing page.
- "Why isn't anyone signing up?" diagnosis.
- Messaging clarity audit.
- Pricing page credibility review.
- Onboarding / first-run experience teardown.
- Differentiation check — "do we actually sound different?"
- Trust audit — "would a stranger give us their credit card?"

## Ideal User

A founder who is stuck, plateaued, or about to launch and wants the unvarnished
truth *before* the market delivers it for free. They can handle directness and
prefer it. They are **not** looking for encouragement — they're looking for the
list of things to fix.

## Input Requirements

| Input | Required | Notes |
|---|---|---|
| **Landing page URL or screenshot** | ✅ | The primary surface under review. |
| **Product description** | Recommended | What it actually does (so the roast judges clarity, not guesses). |
| **Target customer** | Recommended | Who it's *for* — clarity is judged against them. |
| **Current metric pain** | Optional | "Signups OK, activation bad" focuses the roast. |
| **Pricing page** | Optional | Enables the pricing teardown. |

At minimum the skill needs *something to look at*. A URL or screenshot is
mandatory; everything else sharpens the critique.

## Operating Principles

1. **Specific, not general.** "Your hero is confusing" is useless. Quote the exact line.
2. **Direct, never cruel.** Roast the work, respect the founder.
3. **Every burn ships with a fix.** No criticism without a concrete remedy.
4. **Judge against the customer**, not against your taste.
5. **Prioritize ruthlessly.** The #1 problem matters more than problems 2–10 combined.
6. **Trust is a feature.** Audit credibility as hard as clarity.
7. **End on the path forward**, not the pile of problems.

## Workflow Engine

### Step 1 — First impression (the 5-second test)
React as a cold visitor would in 5 seconds. What do you think this is? Who is it
for? Is that correct? This is the single most important signal.

### Step 2 — Clarity teardown
Quote the headline, subhead, and primary CTA verbatim. Rate whether a stranger
understands the product. Identify jargon, vagueness, and feature-speak.

### Step 3 — Messaging & differentiation
Does it sound like every other tool in the category? Find the sentences that
could appear on a competitor's site unchanged — those are dead weight.

### Step 4 — UX & conversion path
Trace the path from landing to signup. Count the friction points. Is the primary
action obvious and singular?

### Step 5 — Trust audit
Would a stranger trust this with their email and credit card? Check for: social
proof, specificity, polish, broken things, sketchy claims, missing legal pages.

### Step 6 — Pricing review (if available)
Is pricing clear, anchored, and value-aligned? Can a visitor self-select a tier
in 10 seconds?

### Step 7 — PMF signal read
From what's visible, assess product-market-fit signals: is the pain obvious, is
the promise specific, does the page imply real usage?

### Step 8 — The verdict
Assign a grade, name the #1 problem, and give the prioritized fix list.

### Step 9 — Assemble the Output Schema.

## Output Schema

```markdown
# Startup Roast — <Product>

## The 5-Second Test
> What I thought this was: ...
> What it actually is: ...
> Verdict: <pass / fail> — <why>

## Clarity 🔥
- Headline (quoted): "..." — <verdict + fix>
- Subhead (quoted): "..." — <verdict + fix>
- Primary CTA (quoted): "..." — <verdict + fix>

## Messaging & Differentiation 🔥
- Generic sentences (could be any competitor): "...", "..."
- What's actually different (if anything): ...
- Fix: ...

## UX & Conversion Path 🔥
- Friction points: 1) ... 2) ...
- Fix: ...

## Trust Audit 🔥
- Credibility gaps: ...
- Fix: ...

## Pricing 🔥
- <verdict + fix, or "not reviewed">

## PMF Signal Read
- <honest read of what the surface implies>

## The Verdict
- **Grade: <A–F>**
- **The #1 problem:** ...
- **Fix list (do in this order):**
  1. ...
  2. ...
  3. ...
- **What's already working:** <1–2 genuine positives>
```

## Quality Checklist

- [ ] The 5-second test is answered honestly and first.
- [ ] Headline, subhead, and CTA are quoted **verbatim**.
- [ ] Every criticism is paired with a concrete fix.
- [ ] Generic/replaceable sentences are explicitly identified.
- [ ] A single #1 problem is named — not a tie.
- [ ] The fix list is ordered by leverage.
- [ ] At least one genuine positive is acknowledged.
- [ ] Tone is direct but never insulting to the founder personally.

## Examples

**Input:** Landing page for "FlowSync — the all-in-one platform for modern teams."

**Output (abridged):**
- **5-second test:** "I thought this was a project management tool. It's
  apparently a... calendar sync product? Fail."
- **Headline roast:** "'The all-in-one platform for modern teams' — this sentence
  has appeared on 10,000 landing pages and described none of them. *Fix:* say the
  literal thing it does: 'Keep every team's calendar in sync without manual
  invites.'"
- **#1 problem:** Nobody knows what you do in 5 seconds. Nothing else matters
  until that's fixed.
- **Already working:** "Your demo GIF is genuinely good — move it above the fold."

See [`examples/startup-roast/`](../../examples/startup-roast/) for a full teardown.

## Anti-Patterns

- ❌ **Generic criticism** — not quoting the actual copy.
- ❌ **Cruelty** — attacking the founder instead of the work.
- ❌ **Burns without fixes** — entertaining, useless.
- ❌ **Listing 20 problems equally** — no prioritization is no help.
- ❌ **Softening into a feedback sandwich** until the critique is toothless.
- ❌ **Judging against your taste** instead of the target customer.
- ❌ **No positives at all** — kills the founder's ability to act on it.

## Advanced Mode

- **Competitor side-by-side** — roast the page next to two competitors' pages.
- **Funnel-stage roast** — separate teardowns for landing, signup, onboarding, pricing.
- **Persona roast** — react as 3 distinct target personas, note where they diverge.
- **Rewrite pass** — don't just critique the headline, ship 3 replacement options.
- **Conversion-impact estimate** — rank fixes by likely conversion lift.

## Best Practices

- Give the skill the *target customer* — the whole roast is calibrated to them.
- Don't argue with the roast; note it and decide. The point is the outside view.
- Feed the fixes into `saas-launch-kit` or `fix-my-ui` to actually execute them.
- Re-roast after the fixes — the grade should move.
- Share the before/after roast — it's some of the most engaging founder content there is.

## Integration Compatibility

| Tool | Support | Notes |
|---|---|---|
| Claude Code | ✅ Full | Can fetch the URL, screenshot it, and roast in one pass. |
| Cursor | ✅ Full | Paste the URL or screenshot in chat. |
| Codex CLI | ⚠️ Partial | Works best with a screenshot or pasted copy rather than a live URL. |
| Gemini CLI | ✅ Full | Strong with screenshots; live URL fetching depends on setup. |
