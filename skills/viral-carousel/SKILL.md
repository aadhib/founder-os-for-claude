---
name: viral-carousel
description: Generates LinkedIn and Instagram carousels for founders — hooks, slide copy, captions, hashtags, CTAs, and visual direction. Trigger when a founder wants to turn an idea into shareable carousel content.
version: 1.0.0
category: growth
tools: [Claude Code, Cursor, Codex CLI, Gemini CLI]
---

# viral-carousel

> Turn one insight into a scroll-stopping carousel — copy, structure, and visual
> direction included, ready to drop into a design tool.

## Purpose

`viral-carousel` exists because carousels are the highest-leverage content format
for founders — and the hardest to do well. Most founder carousels die on slide 1
because the hook is weak, or sprawl across 12 slides because there's no narrative
spine. This skill produces a **complete carousel package**: a tested hook, a
slide-by-slide narrative, the caption, hashtags, the CTA, and concrete visual
direction — formatted for either LinkedIn or Instagram dimensions.

## Use Cases

- Turning a `founder-mode` insight or a lesson learned into content.
- Repurposing a blog post, launch, or metric into a carousel.
- Building a consistent founder content cadence.
- "Build in public" milestone posts.
- Explaining a concept (AI trend, SaaS metric, startup lesson) visually.
- Storytelling a failure, pivot, or win.

## Ideal User

A founder or operator building an audience who has insights but not the time —
or the content instinct — to package them. They want carousels that sound like a
sharp human, not a content farm, and they want the visual direction handed to
them, not just the words.

## Input Requirements

| Input | Required | Notes |
|---|---|---|
| **Topic or insight** | ✅ | The one idea the carousel delivers. |
| **Platform** | ✅ | `linkedin` (1080×1080 square) or `instagram` (1080×1440 portrait). |
| **Audience** | Recommended | Founders? developers? operators? — shapes voice. |
| **Goal** | Recommended | Reach, authority, leads, or community. |
| **Voice / examples** | Optional | Past posts or a tone reference. |
| **Proof / specifics** | Optional | Numbers, stories, screenshots — specificity travels. |

If the topic is too broad ("growth"), the skill narrows it to one angle and says so.

## Operating Principles

1. **The hook is 80% of the result.** If slide 1 fails, nothing else ran.
2. **One idea per carousel.** Depth on one point beats breadth on five.
3. **One idea per slide.** A slide is a beat, not a paragraph.
4. **Narrative spine** — setup → tension → turn → payoff → CTA.
5. **Specific and concrete** — real numbers, real stories, no platitudes.
6. **Earn the swipe.** Every slide must create a reason to see the next.
7. **Visual direction is part of the deliverable**, not an afterthought.

## Workflow Engine

### Step 1 — Sharpen the angle
Compress the topic into one specific, contrarian, or surprising angle. Reject
generic framings. State the single takeaway in one sentence.

### Step 2 — Write the hook (slide 1)
Generate 5 hook options across proven patterns: the contrarian take, the
specific number, the mistake/lesson, the "nobody tells you", the bold promise.
Pick the strongest and explain why.

### Step 3 — Build the narrative spine
Outline the carousel as beats: hook → context → tension → insight(s) → payoff →
CTA. Choose slide count (LinkedIn 6–10, Instagram 7–12).

### Step 4 — Write the slides
One idea per slide. Short lines. Each slide ends with momentum into the next.
Slide copy is *tight* — headline + 1–2 supporting lines max.

### Step 5 — Write the CTA slide
A clear, single action: follow, comment a keyword, share, or a soft product
mention. Match it to the stated goal.

### Step 6 — Write the caption
Open with a hook line (the feed shows it before "...more"), expand the idea,
close with the CTA. Add a P.S. if it earns its place.

### Step 7 — Hashtags
5–10 relevant tags, mixed reach (broad + niche). No spam stacks.

### Step 8 — Visual direction
Per-slide: layout, emphasis, what's big, what's small. Plus an overall system:
color, type, background, accent, and consistency rules. Include a ready-to-paste
**Claude Design prompt** for generating the slides.

### Step 9 — Animation ideas
2–3 subtle motion suggestions for video/Reel variants.

### Step 10 — Assemble the Output Schema.

## Output Schema

```markdown
# Viral Carousel — <Topic>

## Angle & Takeaway
- Angle: ...
- One-sentence takeaway: ...
- Platform: <linkedin 1080×1080 | instagram 1080×1440>

## Hook Options
1. ... 2. ... 3. ... 4. ... 5. ...
**Chosen:** #N — <why>

## Slides
| # | Slide copy | Purpose | Swipe trigger |
|---|------------|---------|---------------|
| 1 | <hook>     | stop the scroll | ... |
| 2 | ...        | ...     | ... |
| N | <CTA>      | convert | — |

## Caption
<hook line>
<body>
<CTA>
P.S. <optional>

## Hashtags
#... #... (5–10)

## Visual Direction
- System: color / type / background / accent / consistency rules
- Per-slide layout notes
- Claude Design prompt: "<paste-ready prompt>"

## Animation Ideas (video variant)
- ...
```

## Quality Checklist

- [ ] 5 distinct hook options generated; one chosen with rationale.
- [ ] The carousel delivers exactly one idea.
- [ ] Every slide carries one idea and ends with swipe momentum.
- [ ] Slide count matches the platform norm.
- [ ] CTA slide names a single, specific action tied to the goal.
- [ ] Caption opens with a standalone hook line.
- [ ] 5–10 hashtags, mixed reach, no spam.
- [ ] Visual direction includes a paste-ready Claude Design prompt.
- [ ] Copy is specific — real numbers/stories, zero platitudes.

## Examples

**Input:** Topic: "we cut churn from 8% to 3%". Platform: LinkedIn. Audience: SaaS founders.

**Output (abridged):**
- **Angle:** Churn wasn't a retention problem — it was an onboarding problem in disguise.
- **Chosen hook:** "We spent 6 months fighting churn. The fix took 3 days — and
  it had nothing to do with retention." (specific number + misdirection)
- **Slide 3:** "Every churn interview said the same thing: *'I never got it set
  up.'* Not 'it's too expensive.' Not 'a competitor.' Setup."
- **CTA slide:** "Building in public — follow for the next teardown."
- **Visual system:** near-black bg `#0b0b0c`, one lime accent, one bold sans, big
  numbers as the visual anchor on data slides.

See [`examples/viral-carousel/`](../../examples/viral-carousel/) for the full package.

## Anti-Patterns

- ❌ **Weak hook** — slide 1 that describes instead of provokes.
- ❌ **Two ideas in one carousel** — pick one.
- ❌ **Wall-of-text slides** — a slide is a beat.
- ❌ **Platitudes** — "consistency is key", "fail fast". Be specific or be silent.
- ❌ **Vague CTA** — "thoughts?" is not a CTA.
- ❌ **Hashtag spam** — 30 tags screams bot.
- ❌ **Skipping visual direction** — words without layout is half a deliverable.

## Advanced Mode

- **Series planning** — break a big topic into a 3–5 carousel arc.
- **Hook A/B set** — 2 fully-built slide-1 variants to test.
- **Repurpose engine** — same insight as carousel + X thread + short-form video script.
- **Data-viz slides** — spec actual chart layouts for metric-heavy carousels.
- **Voice cloning** — match a provided set of past posts precisely.
- **Cross-platform resize** — adapt the same carousel for both square and portrait.

## Best Practices

- Feed it real numbers and real stories — specificity is the entire game.
- Generate the carousel, then read slide 1 alone. If it doesn't stop you, regenerate hooks.
- Use the Claude Design prompt to render slides, then iterate on visuals separately.
- Pair with `founder-mode` — its insights are excellent carousel raw material.
- Keep a consistent visual system across carousels so your feed reads as a brand.

## Integration Compatibility

| Tool | Support | Notes |
|---|---|---|
| Claude Code | ✅ Full | Can also generate slide images via the embedded Design prompt. |
| Cursor | ✅ Full | Great for drafting + iterating copy. |
| Codex CLI | ✅ Full | Text output is fully supported. |
| Gemini CLI | ✅ Full | Strong long-form generation; visual rendering depends on setup. |
