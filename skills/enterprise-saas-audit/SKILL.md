---
name: enterprise-saas-audit
description: Full enterprise-readiness audit — SOC2 posture, RBAC, multi-tenancy, SSO/SCIM, audit logs, data residency, SLAs, and procurement readiness. Trigger when a SaaS wants to sell upmarket and close enterprise deals.
version: 1.0.0
category: engineering
tools: [Claude Code, Cursor, Codex CLI, Gemini CLI]
---

# enterprise-saas-audit

> The checklist enterprise buyers run on you — run it on yourself first, and turn
> the gaps into a prioritized roadmap to your first six-figure contract.

## Purpose

Selling to enterprise isn't a sales problem — it's a readiness problem. Deals
stall in security review, procurement, and legal because the product is missing
SSO, audit logs, an RBAC model, or a SOC2 report. `enterprise-saas-audit` runs
the buyer's evaluation *before the buyer does*: it audits the product,
architecture, and process across the dimensions enterprise procurement actually
checks, then returns a gap analysis ranked by **deal impact**.

## Use Cases

- A PLG SaaS getting inbound from enterprise and not knowing what's missing.
- Preparing for a first security review / vendor questionnaire.
- Scoping the work to become "SOC2-ready" without over-building.
- Designing a multi-tenant architecture before it's load-bearing.
- Building the RBAC / SSO / audit-log roadmap.
- Self-assessment before raising a round where enterprise traction matters.

## Ideal User

A founder or eng lead at a SaaS with product-market fit in SMB/mid-market who is
now getting pulled upmarket. They need to know **exactly what to build, in what
order, to stop losing enterprise deals** — without boiling the ocean.

## Input Requirements

| Input | Required | Notes |
|---|---|---|
| **Product & architecture overview** | ✅ | What it is; how tenancy/data work today. |
| **Current customer profile** | ✅ | SMB, mid-market — and what enterprise prospects are asking for. |
| **Codebase or design access** | Recommended | To verify tenancy, auth, and logging claims. |
| **Active enterprise deals** | Recommended | Their specific requirements sharpen the ranking. |
| **Compliance target** | Optional | SOC2 Type II, ISO 27001, HIPAA, FedRAMP. |
| **Team size & runway** | Optional | Calibrates how aggressive the roadmap can be. |

The skill audits design + claims even without code access, but flags every
unverified claim as `UNVERIFIED`.

## Operating Principles

1. **Audit like the buyer.** Enterprise procurement has a real checklist — use it.
2. **Rank by deal impact**, not by engineering interest.
3. **Don't over-build.** "SOC2-ready" ≠ "FedRAMP". Match the target.
4. **Tenancy and identity are foundational** — they're expensive to retrofit.
5. **Auditability is a feature** enterprises pay for; treat it as one.
6. **Process counts.** Enterprises buy your process, not just your product.
7. **Sequence to unblock revenue** — the roadmap should close deals, in order.

## Workflow Engine

### Step 1 — Establish the target
Define the enterprise buyer being sold to and the realistic compliance bar
(SOC2 Type II is the common first target). Right-size the rest of the audit to it.

### Step 2 — Audit the 10 enterprise domains
Score each `ready / partial / gap` with specific findings:
1. **Multi-tenancy & data isolation** — model, blast radius, noisy-neighbor.
2. **Identity — SSO & SCIM** — SAML/OIDC, provisioning, deprovisioning.
3. **RBAC & permissions** — role model, least privilege, custom roles.
4. **Audit logging** — who-did-what, immutability, export, retention.
5. **Security posture** — encryption at rest/in transit, secrets, vuln management.
6. **Compliance & certifications** — SOC2/ISO status, policies, evidence.
7. **Data residency & privacy** — region controls, DPA, sub-processors, deletion/DSAR.
8. **Reliability & SLAs** — uptime track record, status page, incident process, DR.
9. **Admin & lifecycle** — org management, user lifecycle, bulk ops, sandbox.
10. **Procurement readiness** — security questionnaire answers, MSA/DPA, pricing for enterprise, support tiers.

### Step 3 — Classify gaps by deal impact
Tag each gap: `🔴 deal-blocker` (deals die without it), `🟠 deal-slower` (stalls
review), `🟡 deal-sweetener` (helps, not required), `⚪ later`.

### Step 4 — Sequence the roadmap
Order by `deal impact ÷ effort`. Group into "unblock the first enterprise deal",
"scale to repeatable enterprise sales", "move upmarket / certify". Note dependencies.

### Step 5 — Draft the procurement answers
For the deal-blockers being closed, draft the language the team will paste into
security questionnaires — so engineering work converts directly to sales velocity.

### Step 6 — Assemble the Output Schema.

## Output Schema

```markdown
# Enterprise SaaS Audit — <Product>

## Target
- Enterprise buyer: ... · Compliance bar: ... · Audited against: <scope>

## Enterprise Readiness Scorecard
| # | Domain | Status | Headline gap |
|---|--------|:------:|--------------|
| 1 | Multi-tenancy & isolation | partial | ... |
| ... | | | |
**Enterprise readiness: <X>/10 domains ready**

## Gap Analysis
### 🔴 Deal Blockers
- **<gap>** — current state — why it kills deals — what "done" looks like.
### 🟠 Deal Slowers / 🟡 Sweeteners / ⚪ Later
- ...

## Roadmap
### Phase 1 — Unblock the first enterprise deal
- [ ] item — effort — unblocks
### Phase 2 — Repeatable enterprise sales
### Phase 3 — Move upmarket / certify

## Procurement Answer Drafts
- SSO: ...
- Audit logging: ...
- Data residency: ...
- (drafts for each closed deal-blocker)

## Unverified Claims
- <claims that need code/process confirmation>
```

## Quality Checklist

- [ ] A specific enterprise buyer and compliance bar are defined.
- [ ] All 10 domains are scored.
- [ ] Every gap states current state, deal impact, and definition of done.
- [ ] Gaps are tagged by deal impact, not engineering preference.
- [ ] Deal-blockers are a short, defensible list.
- [ ] The roadmap is sequenced by deal impact ÷ effort with dependencies noted.
- [ ] Procurement answer drafts exist for the deal-blockers being closed.
- [ ] Unverified claims are explicitly listed, not assumed true.
- [ ] The audit is right-sized — no FedRAMP advice for a SOC2 target.

## Examples

**Input:** "Project-management SaaS, strong in 10–50 person companies. A 2,000-person
enterprise is in a trial and their security team sent a 120-question questionnaire."

**Output (abridged):**
- **Readiness:** 4/10 domains ready.
- **🔴 Deal blocker:** No SSO. Their IT will not approve a tool without SAML.
  *Done =* SAML SSO + enforced-SSO org setting.
- **🔴 Deal blocker:** No audit log. The questionnaire has 8 questions on it.
  *Done =* immutable who-did-what log, 1-year retention, CSV export.
- **🟠 Deal slower:** Tenancy is shared-schema with `tenant_id` filtering — works,
  but the questionnaire asks about isolation; needs a written explanation + tests
  proving no cross-tenant access.
- **Phase 1 roadmap:** SSO → audit log → tenancy isolation test suite +
  write-up → DPA template. That sequence closes this specific deal.

See [`examples/enterprise-saas-audit/`](../../examples/enterprise-saas-audit/) for a full audit.

## Anti-Patterns

- ❌ **Over-building** — chasing ISO 27001 when the deal just needs SSO.
- ❌ **Ranking by engineering interest** instead of deal impact.
- ❌ **Treating every gap as a blocker** — kills prioritization.
- ❌ **Assuming claims are true** without verifying tenancy/logging in code.
- ❌ **Ignoring process** — policies and incident response are part of the sale.
- ❌ **A roadmap that doesn't map to revenue** — every phase should close deals.
- ❌ **Generic compliance advice** untethered from the actual buyer.

## Advanced Mode

- **Security questionnaire autofill** — answer a real vendor questionnaire end-to-end.
- **Tenancy migration plan** — staged path from shared-schema to stronger isolation with zero downtime.
- **SOC2 evidence map** — map each control to the artifact that proves it.
- **Enterprise pricing & packaging** — design the enterprise tier, SLA, and support model.
- **Pen-test prep** — scope and remediation-readiness for a third-party penetration test.
- **DPA / sub-processor pack** — draft the legal artifacts procurement will request.

## Best Practices

- Run this *before* the first enterprise security review, not during it.
- Feed in the prospect's actual questionnaire — it makes the ranking precise.
- Close deal-blockers in sequence; don't parallelize into half-finished features.
- Pair with `production-ready` for the underlying engineering hardening.
- Re-run after each phase — the readiness score is your upmarket progress metric.

## Integration Compatibility

| Tool | Support | Notes |
|---|---|---|
| Claude Code | ✅ Full | Best — can verify tenancy/auth/logging claims directly in the repo. |
| Cursor | ✅ Full | Strong with repo context for verifying claims. |
| Codex CLI | ✅ Full | Audit output is plain Markdown; works with pasted architecture docs. |
| Gemini CLI | ⚠️ Partial | Works on provided design docs; deep code verification depends on setup. |
