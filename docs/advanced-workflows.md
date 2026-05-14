# Advanced Workflows

Individual skills are useful. Chained, they become an operating system. These
are the high-leverage routines that combine skills into repeatable founder
workflows.

## The weekly operator loop

Run at the start of each week.

```
1. /founder-mode   — feed in last week's plan + current metrics.
                     Get an updated bottleneck + 7-day priorities.
2. Execute.
3. /founder-mode   — next week, feed the prior plan back in. It diffs.
```

The skill is built to take its own previous output as input — plans compound
instead of resetting.

## Prototype → launch pipeline

When a `founder-mode` phase is "ship and launch the thing":

```
1. /production-ready   — audit the prototype. Fix all 🔴 launch-blockers.
2. /fix-my-ui          — on every key screen. Apply the redesign briefs.
3. /saas-launch-kit    — generate the full launch system.
4. /startup-roast      — roast the generated landing copy before it ships.
5. Re-run /startup-roast after fixes — the grade should move.
```

Each step's output is the next step's input. The roast at the end catches what
the launch kit was too close to see.

## The enterprise readiness track

When inbound from enterprise starts and deals stall:

```
1. /enterprise-saas-audit  — run the buyer's checklist on yourself.
2. /production-ready       — harden the engineering underneath the gaps.
3. /ai-agent-architect     — if the product has agents, design the safety
                             + observability story procurement will ask about.
4. Re-run /enterprise-saas-audit after each roadmap phase — the readiness
   score is your upmarket progress metric.
```

## The content flywheel

Turn operating work into distribution.

```
1. /founder-mode      — produces sharp insights as a byproduct of planning.
2. /viral-carousel    — turn the best insight into a carousel.
3. /startup-roast     — roast a competitor (or yourself) publicly — high-engagement content.
4. Repeat weekly. The operating work *is* the content pipeline.
```

## Skill chaining principles

- **Output → input.** Every Founder OS skill produces structured output designed
  to be fed into the next skill. Don't paraphrase between steps — pass the whole thing.
- **Roast last.** `startup-roast` is most valuable *after* generation, as a
  quality gate, not before.
- **Audit before build, audit after build.** `production-ready` and
  `enterprise-saas-audit` are bookends — run them to scope work, then again to
  confirm it.
- **Keep the "NOT doing" list.** `founder-mode` produces one every run. It's the
  most valuable artifact — it's what keeps the chain focused.

## Team workflows

Commit skills to your repo so the whole team shares them:

```bash
founderos init        # writes .founderos.json + places skills in the project
git add .founderos.json FOUNDER_OS.md .claude/skills
git commit -m "chore: add Founder OS skills"
```

Teammates run `npx founderos init` after cloning — same skills, same versions,
no global install required. Run `founderos update` to pull catalog updates.

## Automating with `--json`

`founderos list --json` is a stable integration point — wire it into a
dashboard, a pre-commit check, or an onboarding script that confirms new hires
have the skills installed.
