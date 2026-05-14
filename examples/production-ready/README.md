# Example — `production-ready`

A real run of the `production-ready` skill on an MVP about to launch.

---

## Input

> Next.js 15 + Postgres prototype on Vercel. ~50 beta users, launching public in
> 2 weeks. Concern: "it works but I have no idea if it's safe to put in front of
> real users." Repo access provided.

---

## Output (abridged)

# Production-Ready Audit — Beta MVP

## System Map
- **Stack:** Next.js 15 (App Router), Postgres (Neon), Vercel hosting, Clerk auth.
- **Entry points:** 14 route handlers under `app/api/`, 3 server actions.
- **Trust boundaries:** public API routes, the Clerk webhook, direct DB access.
- **Not inspected:** Vercel project env config (no dashboard access) — flagged below.

## Domain Scorecard
| # | Domain | Status | Headline finding |
|---|--------|:------:|------------------|
| 1 | Architecture | warn | DB queries scattered across route handlers, no data layer |
| 2 | Secrets & env | **fail** | DB URL with credentials committed in `lib/db.ts` |
| 3 | Auth & authz | **fail** | one endpoint returns records with no ownership check |
| 4 | Input handling | warn | no validation on 6 of 14 route handlers |
| 5 | Error handling | warn | unhandled rejections in 3 server actions leak stack traces |
| 6 | Observability | **fail** | no error tracking, no uptime monitoring |
| 7 | Type safety | pass | strict mode on, minimal `any` |
| 8 | CI/CD | **fail** | no CI — nothing runs on PR |
| 9 | Deploy | pass | Vercel defaults are fine for this stage |
| 10 | Performance | warn | N+1 query in the dashboard loader |
| 11 | Database safety | warn | migrations exist; no automated backups confirmed |
| 12 | Scalability | warn | no rate limiting on public endpoints |

**Production readiness: 2/12 passing**

## Findings

### 🔴 Launch Blockers
- **Committed DB credentials** — `lib/db.ts:14` — the connection string with
  username/password is in source and in git history. *Fix:* rotate the
  credential now, move to `process.env.DATABASE_URL`, scrub history with
  `git filter-repo`.
- **Broken object-level authorization** — `app/api/projects/[id]/route.ts:22` —
  returns any project by id with no check that it belongs to the caller. Any
  logged-in user can read any project. *Fix:* assert
  `project.ownerId === auth().userId` before returning.
- **No error tracking** — failures in production will be completely invisible.
  *Fix:* add Sentry (or equivalent) before launch — this is a 30-minute task.
- **No CI** — nothing prevents a broken build or a type error from shipping.
  *Fix:* add a GitHub Actions workflow running `build` + `typecheck` + `test` on PR.

### 🟠 High
- **Unvalidated input** on 6 route handlers — *Fix:* add a `zod` schema per handler.
- **Leaked stack traces** — *Fix:* wrap server actions, return generic errors to the client.
- **No rate limiting** — *Fix:* add `@upstash/ratelimit` on public endpoints.

### 🟡 Medium
- N+1 query in `app/dashboard/page.tsx` — batch with a single join.
- No automated DB backups confirmed — verify Neon's backup settings.

## Remediation Plan

### Before launch (blockers + cheap high-risk)
- [ ] Rotate DB credential, move to env var, scrub git history — 1h
- [ ] Fix the object-level auth check — 30m
- [ ] Add Sentry — 30m
- [ ] Add CI: build + typecheck + test on PR — 1h
- [ ] Add zod validation to the 6 unvalidated handlers — 2h
- [ ] Add rate limiting to public endpoints — 1h

### First week after
- [ ] Introduce a `lib/data/` layer, move queries out of route handlers
- [ ] Wrap server actions, sanitize error responses
- [ ] Confirm and document automated DB backups

### First month
- [ ] Fix the dashboard N+1
- [ ] Add a basic uptime/status monitor
- [ ] Write the first incident runbook

## Required Gates Before Launch
- **CI:** build, typecheck, test must pass on every PR.
- **Observability:** Sentry capturing errors; an uptime check on `/`.
- **Rollback:** documented — Vercel "promote previous deployment" + DB migrations
  are forward-only, so a rollback note must say "do not roll back past a migration."

## Sign-off Checklist
- [ ] Zero open launch-blockers
- [ ] CI green on `main`
- [ ] Sentry receiving events from production
- [ ] Auth check verified with a cross-account test
- [ ] DB credential rotated and history scrubbed
