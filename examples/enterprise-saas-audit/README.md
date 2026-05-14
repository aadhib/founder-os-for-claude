# Example — `enterprise-saas-audit`

A real run of the `enterprise-saas-audit` skill on a SaaS being pulled upmarket.

---

## Input

> "Project-management SaaS, strong product-market fit in 10–50 person companies.
> A 2,000-person enterprise is in a trial and their security team just sent a
> 120-question questionnaire. Compliance target: SOC2 Type II eventually. Repo
> access provided. Team: 6 engineers, 14 months runway."

---

## Output (abridged)

# Enterprise SaaS Audit — ProjectTool

## Target
- **Enterprise buyer:** 2,000-person company, IT-gated procurement.
- **Compliance bar:** SOC2 Type II (eventual) — but the *active deal* only needs
  SSO, audit logs, and a tenancy explanation.
- **Audited against:** repo + provided architecture notes.

## Enterprise Readiness Scorecard
| # | Domain | Status | Headline gap |
|---|--------|:------:|--------------|
| 1 | Multi-tenancy & isolation | partial | shared-schema with `tenant_id` filtering — works, but undocumented and untested |
| 2 | Identity — SSO & SCIM | **gap** | no SAML/OIDC; no provisioning |
| 3 | RBAC & permissions | partial | two hardcoded roles (admin/member), no custom roles |
| 4 | Audit logging | **gap** | no who-did-what log anywhere |
| 5 | Security posture | ready | TLS + encryption at rest, secrets in env, deps scanned |
| 6 | Compliance & certs | gap | no SOC2, no written policies |
| 7 | Data residency & privacy | partial | single region; DPA template missing |
| 8 | Reliability & SLAs | partial | good uptime, but no status page or written SLA |
| 9 | Admin & lifecycle | partial | org admin exists; no bulk user ops, no deprovisioning |
| 10 | Procurement readiness | gap | no questionnaire answers, no MSA/DPA |

**Enterprise readiness: 1/10 domains ready**

## Gap Analysis

### 🔴 Deal Blockers
- **No SSO** — current state: email/password only. Why it kills deals: a
  2,000-person IT org will not approve a tool without SAML; it's policy, not
  preference. Done = SAML SSO + an org setting to *enforce* SSO.
- **No audit log** — current state: nothing records user actions. Why it kills
  deals: 8 of the 120 questionnaire questions are about audit logging; "no" to
  all 8 ends the review. Done = immutable who-did-what log, 1-year retention, CSV export.

### 🟠 Deal Slowers
- **Undocumented tenancy** — shared-schema isolation *works*, but the
  questionnaire asks how tenants are isolated and the team has no written answer
  or test proving no cross-tenant access. Stalls the review while engineering
  scrambles. Done = an isolation test suite + a one-page written explanation.
- **No status page / written SLA** — enterprise legal will ask. Done = public
  status page + a 99.9% SLA in the contract.

### 🟡 Sweeteners
- Custom RBAC roles — helps, not required for this deal.
- SCIM provisioning — nice; SAML alone unblocks the deal.

### ⚪ Later
- SOC2 Type II certification, multi-region data residency, ISO 27001.

## Roadmap

### Phase 1 — Unblock the first enterprise deal (next 4–6 weeks)
- [ ] SAML SSO + enforce-SSO org setting — ~2 wks — unblocks the deal
- [ ] Audit log (immutable, exportable, 1yr retention) — ~2 wks — unblocks 8 questions
- [ ] Tenancy isolation test suite + written explanation — ~3 days — unblocks the stall
- [ ] DPA template + sub-processor list — ~2 days — unblocks legal

### Phase 2 — Repeatable enterprise sales
- [ ] Custom RBAC roles
- [ ] Status page + written SLA
- [ ] Reusable security questionnaire answer bank
- [ ] User deprovisioning + bulk ops

### Phase 3 — Move upmarket / certify
- [ ] SOC2 Type II (start the observation window)
- [ ] SCIM provisioning
- [ ] Multi-region data residency

## Procurement Answer Drafts
- **SSO:** "ProjectTool supports SAML 2.0 SSO with all major IdPs (Okta, Entra ID,
  Google). Admins can enforce SSO org-wide, disabling password login."
- **Audit logging:** "All user and admin actions are recorded in an immutable
  audit log retained for 12 months and exportable as CSV by org admins."
- **Tenancy:** "Customer data is logically isolated per tenant. Every query is
  scoped by tenant identifier at the data-access layer, and an automated test
  suite asserts no cross-tenant access on every deploy."

## Unverified Claims
- "Encryption at rest" — confirmed TLS in transit in code; at-rest encryption is
  a Neon/host setting that needs dashboard confirmation. `UNVERIFIED`.
- Uptime track record — claimed good, no monitoring data provided. `UNVERIFIED`.
