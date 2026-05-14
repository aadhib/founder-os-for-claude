---
name: production-ready
description: Audits a prototype across architecture, security, auth, CI/CD, performance, observability, and scale, then returns a prioritized path to production. Trigger when a working prototype needs to become a real product.
version: 1.0.0
category: engineering
tools: [Claude Code, Cursor, Codex CLI, Gemini CLI]
---

# production-ready

> The gap between "it works on my machine" and "real users depend on it" — mapped,
> prioritized, and turned into a checklist you can actually execute.

## Purpose

Prototypes are built to answer "can this work?" Production systems answer "can
this be trusted?" `production-ready` audits the distance between the two. It
inspects a codebase across the dimensions that cause real incidents — secrets
handling, auth, error paths, CI/CD, observability, database safety, performance,
scalability — and returns a **risk-ranked remediation plan**, not a generic
best-practices lecture.

## Use Cases

- Pre-launch hardening of a prototype or MVP.
- Onboarding a "vibe-coded" project into a real engineering process.
- Pre-investment or pre-acquisition technical due diligence (self-assessment).
- Establishing CI/CD and observability where there is none.
- Deciding what's *actually* blocking launch vs. what's nice-to-have.
- Periodic production-readiness review as the system grows.

## Ideal User

A founder or small engineering team with a working product and no dedicated
platform/infra/security function. They can implement fixes but need someone to
tell them **which fixes matter, in what order, and which are launch-blockers.**

## Input Requirements

| Input | Required | Notes |
|---|---|---|
| **Codebase access** | ✅ | Repo, or key files: config, auth, API, CI, Dockerfile, DB layer. |
| **Stack & hosting** | Recommended | Framework, DB, host (Vercel, AWS, etc.). |
| **Launch context** | Recommended | Expected users, data sensitivity, launch date. |
| **Known pain** | Optional | Anything already breaking or worrying the team. |
| **Compliance needs** | Optional | If SOC2/GDPR/HIPAA matters, the audit shifts. |

If only partial code is available, the skill audits what it can and explicitly
lists what it could not inspect.

## Operating Principles

1. **Risk-rank everything.** A launch-blocker and a nice-to-have are not equals.
2. **Incidents over ideals.** Audit what actually causes outages and breaches.
3. **Boundaries first.** Trust internal code; harden the edges.
4. **Reversibility matters.** Database and auth mistakes are the expensive ones.
5. **Observability is non-negotiable** — you can't operate what you can't see.
6. **Concrete over generic.** "Add logging" is useless; name the file and the line.
7. **Launch-blockers are a short list** — protect that list's credibility.

## Workflow Engine

### Step 1 — Map the system
Identify the stack, entry points, data stores, external dependencies, and trust
boundaries. Note what you can and cannot see.

### Step 2 — Audit the 12 domains
For each, score `pass / warn / fail` and capture specific findings:
1. **Architecture** — separation of concerns, coupling, obvious foot-guns.
2. **Secrets & env** — hardcoded keys, `.env` hygiene, secret rotation.
3. **Auth & authz** — session handling, token storage, access control gaps.
4. **Input handling** — validation at boundaries, injection surfaces (SQL, XSS, command).
5. **Error handling** — swallowed errors, leaked stack traces, crash paths.
6. **Logging & observability** — structured logs, error tracking, metrics, alerts.
7. **TypeScript / type safety** — strictness, `any` leakage, unchecked access.
8. **CI/CD** — automated build, test, lint, deploy; rollback path.
9. **Containerization / deploy** — Dockerfile quality, build reproducibility, host config.
10. **Performance** — N+1 queries, bundle size, blocking calls, caching.
11. **Database safety** — migrations, backups, connection pooling, destructive-op guards.
12. **Scalability & limits** — rate limits, timeouts, concurrency, statelessness.

### Step 3 — Classify findings
Tag every finding: `🔴 launch-blocker`, `🟠 high`, `🟡 medium`, `⚪ low`.
Launch-blockers are: anything that leaks data, allows unauthorized access, loses
data, or takes the system down with normal use.

### Step 4 — Sequence the remediation
Order fixes by `risk ÷ effort`. Launch-blockers first regardless of effort.
Group into "before launch", "first week after", "first month".

### Step 5 — Define the gates
Specify the CI checks and observability that must exist before launch — so
regressions can't silently return.

### Step 6 — Assemble the Output Schema.

## Output Schema

```markdown
# Production-Ready Audit — <Project>

## System Map
- Stack / hosting / data stores / trust boundaries
- Not inspected: <what was unavailable>

## Domain Scorecard
| # | Domain | Status | Headline finding |
|---|--------|:------:|------------------|
| 1 | Architecture | warn | ... |
| ... | | | |
**Production readiness: <X>/12 passing**

## Findings
### 🔴 Launch Blockers
- **<finding>** — `path/to/file:line` — risk — fix.
### 🟠 High / 🟡 Medium / ⚪ Low
- ...

## Remediation Plan
### Before launch (blockers + cheap high-risk)
- [ ] fix — file — effort
### First week / First month
- [ ] ...

## Required Gates Before Launch
- CI: build / test / lint / typecheck
- Observability: error tracking / uptime / key alerts
- Rollback: <documented path>

## Sign-off Checklist
- [ ] Zero open launch-blockers
- [ ] ...
```

## Quality Checklist

- [ ] All 12 domains are scored.
- [ ] Every finding cites a file (and line where possible).
- [ ] Every finding has a severity tag and a concrete fix.
- [ ] Launch-blockers are a short, defensible list — not everything.
- [ ] Remediation is ordered by risk ÷ effort.
- [ ] Required CI gates and observability are specified.
- [ ] A rollback path is documented.
- [ ] What couldn't be inspected is explicitly listed.

## Examples

**Input:** Next.js + Postgres prototype on Vercel, ~50 beta users, launching in 2 weeks.

**Output (abridged):**
- **Readiness:** 5/12 passing.
- **🔴 Launch blocker:** `lib/db.ts:14` — connection string with credentials
  committed to the repo. *Fix:* rotate the credential, move to env var, scrub git history.
- **🔴 Launch blocker:** `app/api/user/route.ts:22` — endpoint returns any user's
  record by id with no ownership check. *Fix:* assert `session.userId === params.id`.
- **🟠 High:** No error tracking — failures are invisible. *Fix:* add Sentry before launch.
- **Required gate:** CI currently runs nothing. Add build + typecheck + test on PR.

See [`examples/production-ready/`](../../examples/production-ready/) for a full audit.

## Anti-Patterns

- ❌ **Generic best-practices dump** with no reference to the actual code.
- ❌ **Everything is a launch-blocker** — destroys the signal.
- ❌ **Findings with no fix** or no file reference.
- ❌ **Auditing only the code you like** and ignoring config/CI/DB.
- ❌ **Ignoring observability** because the code "looks fine".
- ❌ **Recommending a rewrite** when targeted fixes would do.
- ❌ **Silently skipping** files you couldn't access instead of listing them.

## Advanced Mode

- **Threat model** — STRIDE-style pass over the trust boundaries.
- **Load model** — back-of-envelope capacity math for the expected launch traffic.
- **Cost audit** — flag architecture choices that won't survive a hosting bill.
- **Incident runbook** — generate the first runbook for the top 3 failure modes.
- **Compliance gap pass** — map findings to SOC2 / GDPR controls (see also `enterprise-saas-audit`).
- **Dependency audit** — flag unmaintained, vulnerable, or oversized dependencies.

## Best Practices

- Run it on a feature branch before every major launch — treat the sign-off checklist as a real gate.
- Give it the launch context — "10 users" and "10,000 users" produce different audits.
- Fix launch-blockers before touching anything else, no exceptions.
- Re-run after remediation to confirm the score moved and nothing regressed.
- Pair with `enterprise-saas-audit` when selling upmarket, and `ai-agent-architect` if the system has agents.

## Integration Compatibility

| Tool | Support | Notes |
|---|---|---|
| Claude Code | ✅ Full | Best — can read the whole repo and apply fixes directly. |
| Cursor | ✅ Full | Strong with full-repo context; can implement fixes inline. |
| Codex CLI | ✅ Full | Point it at the repo or paste key files. |
| Gemini CLI | ⚠️ Partial | Works on provided files; large-repo traversal depends on setup. |
