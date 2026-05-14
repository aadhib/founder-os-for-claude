# Skills

The Founder OS skill catalog. Each folder is one Claude Skill with a single
`SKILL.md` that follows the [skill authoring contract](../CONTRIBUTING.md#authoring-a-skill).

| Skill | Category | What it does |
|---|---|---|
| [`founder-mode`](founder-mode/) | strategy | AI COO + CTO + Product Strategist — roadmaps, prioritization, GTM, pricing |
| [`fix-my-ui`](fix-my-ui/) | design | Screenshot → premium 2026 redesign brief with Tailwind specs |
| [`saas-launch-kit`](saas-launch-kit/) | growth | End-to-end launch system — positioning, copy, pricing, onboarding, PH plan |
| [`startup-roast`](startup-roast/) | growth | Brutally honest, constructive product + landing page teardown |
| [`viral-carousel`](viral-carousel/) | growth | LinkedIn / Instagram carousels — hooks, slides, captions, visual direction |
| [`production-ready`](production-ready/) | engineering | Prototype → production audit across 12 domains |
| [`ai-agent-architect`](ai-agent-architect/) | engineering | Multi-agent system design — MCP, tools, memory, evals, observability |
| [`enterprise-saas-audit`](enterprise-saas-audit/) | engineering | Enterprise-readiness audit — SOC2, RBAC, SSO, multi-tenancy, procurement |

## Every skill has the same shape

```
Purpose · Use Cases · Ideal User · Input Requirements · Operating Principles
· Workflow Engine · Output Schema · Quality Checklist · Examples
· Anti-Patterns · Advanced Mode · Best Practices · Integration Compatibility
```

Run `founder-os verify` to validate the whole catalog against this contract.

## Installing

```bash
npx founder-os install            # all skills, all detected tools
npx founder-os add fix-my-ui      # one skill
```

Skills are plain Markdown — read them before enabling. They contain no
executable code.
