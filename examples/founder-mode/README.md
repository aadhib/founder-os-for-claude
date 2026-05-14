# Example — `founder-mode`

A real run of the `founder-mode` skill. Shows how a fuzzy goal becomes a ranked,
sequenced 90-day operating plan.

---

## Input

> 2-person team, AI meeting-notes tool ("Recaply"), $4k MRR, 18-month runway.
> Signups are fine but nobody comes back. Want to triple weekly active users in
> 90 days.

---

## Output

# Founder Mode — Operating Plan

## TL;DR
The bottleneck isn't acquisition — it's the activation-to-habit gap. Users get
value once and never build a loop. The bet: deliver value *outside* the app so
it reaches users without requiring a visit. Expected outcome: weekly active
users 3× by day 90 if the digest open-rate clears 25%.

## The Bottleneck
- **Statement:** Users experience value once but never form a recurring habit.
- **Evidence:** Signups steady, but week-2 retention is the cliff. `ASSUMPTION`:
  no cohort data was provided — confirm with a retention curve.
- **Root causes:**
  1. Value is locked behind opening the app — no ambient delivery.
  2. No trigger ties Recaply to the user's existing workflow.
  3. The "aha" (a clean recap) happens once and isn't reinforced.

## Options Considered
| # | Option | Impact | Effort | Confidence | Reversibility | Score |
|---|--------|:------:|:------:|:----------:|:-------------:|:-----:|
| 1 | Auto-send a recap digest to Slack/email after every meeting | 5 | 4 | 4 | 5 | 90 |
| 2 | Calendar integration: recap appears on the event automatically | 5 | 2 | 4 | 4 | 60 |
| 3 | Weekly "what you discussed" rollup email | 3 | 4 | 3 | 5 | 40.5 |
| 4 | Onboarding checklist in first session | 3 | 4 | 3 | 5 | 40.5 |
| 5 | Add Notion/Linear export integrations | 4 | 2 | 2 | 4 | 24 |
| 6 | Do nothing — improve the in-app recap quality | 2 | 5 | 3 | 5 | 30 |
| 7 | (Contrarian) Kill the app UI, become a pure Slack bot | 4 | 1 | 2 | 1 | 8 |

## The Plan

### Days 0–30 — Ambient value delivery · Primary metric: digest open-rate
- [ ] Ship Slack + email recap digest after every meeting — owner: eng —
  assumption: users want value pushed, not pulled — kill criterion: open-rate
  < 25% after 200 sends.
- [ ] Instrument a real retention curve — owner: founder — assumption: none, this
  is table stakes.

### Days 31–60 — Workflow trigger · Primary metric: week-2 retention
- [ ] Calendar integration so recaps attach to the meeting automatically —
  owner: eng — assumption: calendar is the natural trigger — kill criterion:
  no retention lift vs. digest-only cohort.

### Days 61–90 — Loop reinforcement · Primary metric: weekly active users
- [ ] Weekly rollup + "share recap" action to pull in teammates — owner: eng —
  assumption: team spread compounds retention — kill criterion: <10% of digests
  get shared.

## De-Risking
| Action | Key assumption | Cheapest test | Kill criterion |
|--------|----------------|---------------|----------------|
| Recap digest | Users want push, not pull | Manual digest to 30 users for 1 week | Open-rate < 25% |
| Calendar integration | Calendar is the trigger | Fake-door "connect calendar" button | < 20% click |
| Share action | Team spread aids retention | Add share button, measure use | < 10% share rate |

## Founder Time Allocation
- **Do personally:** retention interviews (10 churned users), the digest copy.
- **Delegate:** integration plumbing, instrumentation.
- **Defer / delete:** export integrations, mobile app, pricing changes.

## What We're Explicitly NOT Doing
- New integrations (Notion/Linear) — distracts from the retention loop.
- Mobile app — no evidence it addresses the bottleneck.
- Pricing changes — you don't have a monetization problem yet, you have a habit problem.

## Open Questions
- What does the actual week-by-week retention curve look like?
- Of users who *do* return, what triggered the return? (interview signal)
