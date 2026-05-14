---
name: ai-agent-architect
description: Designs production AI agent systems — MCP architecture, tool orchestration, agent roles, memory, queues, evals, human approvals, retries, and observability. Trigger when someone is building an agentic feature or multi-agent system.
version: 1.0.0
category: engineering
tools: [Claude Code, Cursor, Codex CLI, Gemini CLI]
---

# ai-agent-architect

> Turn "we want an AI agent" into a concrete, safe, observable system design —
> with the failure modes mapped before they happen in production.

## Purpose

Most agent projects fail not because the model is weak but because the
**system around it** is missing — no retries, no evals, no human approvals, no
observability, no memory strategy, unbounded tool access. `ai-agent-architect`
designs that system. It takes a desired agentic capability and produces a
production-grade architecture: agent roles, tool boundaries, memory and queue
design, an eval harness, human-in-the-loop checkpoints, and an observability
plan — grounded in the failure modes specific to agents.

## Use Cases

- Designing a single-agent feature (a research agent, a triage agent, a coding agent).
- Architecting a multi-agent workflow with specialized roles.
- Adding MCP tools to an existing product safely.
- Designing the memory layer for a stateful assistant.
- Building an eval harness so agent quality is measurable.
- Adding human approval gates to a high-stakes agent.
- Retrofitting observability and safety onto an agent already in production.

## Ideal User

An engineer or technical founder building an agentic product who can write the
code but wants the **architecture, safety model, and failure handling** designed
first — before they discover the gaps in production.

## Input Requirements

| Input | Required | Notes |
|---|---|---|
| **Desired capability** | ✅ | What the agent should accomplish, in user terms. |
| **Autonomy level** | ✅ | Fully autonomous, human-approved, or suggest-only. |
| **Tools / actions needed** | Recommended | What the agent must read or do. |
| **Stack** | Recommended | Language, model provider, infra, existing queue/DB. |
| **Risk profile** | Recommended | What's the worst a wrong action can do? |
| **Scale & latency** | Optional | Requests/day, acceptable latency. |

If autonomy level is missing, the skill defaults to **human-approved for any
state-changing action** and says so.

## Operating Principles

1. **Autonomy is earned, not assumed.** Default to approval gates on side effects.
2. **Tools are the attack surface.** Least privilege, scoped, auditable.
3. **Every agent step can fail** — design retries, timeouts, and fallbacks first.
4. **If it's not evaluated, it's not engineered.** Evals are part of the architecture.
5. **Observability is the difference between a product and a science experiment.**
6. **Memory is a design decision**, not a vector DB you bolt on.
7. **Prefer the simplest topology that works** — one good agent beats five confused ones.

## Workflow Engine

### Step 1 — Define the job
Restate the capability as a precise job: inputs, the successful outcome, what
"done" means, and what must never happen.

### Step 2 — Choose the topology
Pick the simplest viable structure: single agent, agent + tools, supervisor +
workers, or pipeline. Justify the choice. Reject multi-agent if one agent suffices.

### Step 3 — Define agent roles
For each agent: its single responsibility, its system prompt's job, its allowed
tools, its inputs, and its outputs. Keep responsibilities narrow.

### Step 4 — Design the tool layer
For each tool/MCP server: purpose, input/output schema, side effects (read vs.
write), permission scope, and rate/cost limits. Mark which tools require approval.

### Step 5 — Design memory
Decide per-need: short-term (context window), working (scratchpad/state), and
long-term (retrieval). Specify what's stored, where, for how long, and how it's
retrieved. Avoid storing what isn't used.

### Step 6 — Design orchestration & queues
Define how work flows: sync vs. async, queue boundaries, concurrency, idempotency
keys, and where long-running work is durable across crashes.

### Step 7 — Design failure handling
Per step: timeout, retry policy (count, backoff), fallback behavior, and the
circuit-breaker condition. Define what a "graceful failure" looks like to the user.

### Step 8 — Design human-in-the-loop
Identify every state-changing or high-risk action. Specify the approval UX, what
the human sees, and the default if no response.

### Step 9 — Design the eval harness
Define the eval set (golden cases + adversarial cases), the scoring method
(assertion, rubric, or LLM-judge), and the CI gate. Evals run on every prompt or
model change.

### Step 10 — Design observability
Specify traces (per agent step), structured logs, metrics (latency, cost,
success rate, tool-error rate), and alerts.

### Step 11 — Safety review
Walk the top failure modes: prompt injection via tool output, runaway loops,
cost blowouts, data exfiltration, hallucinated actions. Specify the mitigation for each.

### Step 12 — Assemble the Output Schema.

## Output Schema

```markdown
# AI Agent Architecture — <Capability>

## The Job
- Inputs / success outcome / definition of done / must-never-happen

## Topology
- Chosen: <single | agent+tools | supervisor+workers | pipeline>
- Why: ... (and why not the others)
- Diagram: <ascii>

## Agents
| Agent | Responsibility | Allowed tools | In → Out |
|-------|----------------|---------------|----------|

## Tool Layer
| Tool / MCP | Purpose | I/O schema | Side effects | Scope | Approval? |
|------------|---------|-----------|--------------|-------|-----------|

## Memory
- Short-term / working / long-term — what, where, TTL, retrieval

## Orchestration & Queues
- Flow / sync vs async / concurrency / idempotency / durability

## Failure Handling
| Step | Timeout | Retry | Fallback | Circuit breaker |

## Human-in-the-Loop
| Action | Risk | Approval UX | Default if no response |

## Eval Harness
- Eval set / scoring method / CI gate / cadence

## Observability
- Traces / logs / metrics / alerts

## Safety Review
| Failure mode | Likelihood | Impact | Mitigation |

## Build Sequence
1. ... 2. ... 3. ...
```

## Quality Checklist

- [ ] The job defines an explicit "must never happen".
- [ ] The simplest viable topology is chosen and alternatives are rejected with reasons.
- [ ] Every agent has exactly one responsibility.
- [ ] Every tool declares side effects, scope, and whether it needs approval.
- [ ] Memory tiers specify what/where/TTL/retrieval — nothing stored "just in case".
- [ ] Every step has a timeout, retry policy, and fallback.
- [ ] Every state-changing action has a human-in-the-loop entry or an explicit reason it doesn't.
- [ ] An eval set and CI gate are defined.
- [ ] Observability covers traces, cost, and success rate.
- [ ] Prompt injection via tool output is addressed in the safety review.

## Examples

**Input:** "An agent that triages incoming support emails and drafts replies.
Human-approved. Stack: TypeScript, Claude, Postgres, existing BullMQ queue."

**Output (abridged):**
- **Topology:** Agent + tools (single agent). Multi-agent rejected — triage and
  drafting share context; splitting them adds handoff failure modes for no gain.
- **Tools:** `read_inbox` (read-only), `search_kb` (read-only), `draft_reply`
  (write — **requires approval**), `apply_label` (write — auto, low risk).
- **Memory:** long-term = resolved-ticket retrieval for similar cases; working =
  per-email scratchpad; no long-term storage of email bodies past 30 days.
- **HITL:** every `draft_reply` goes to an agent inbox; default if no response in
  4h = leave as draft, never auto-send.
- **Safety:** email body is untrusted input — tool outputs are wrapped and the
  agent is instructed to treat them as data, not instructions.

See [`examples/ai-agent-architect/`](../../examples/ai-agent-architect/) for the full design.

## Anti-Patterns

- ❌ **Multi-agent by default** — most problems need one good agent.
- ❌ **Unbounded tool access** — every tool is a permission and an attack surface.
- ❌ **No eval harness** — "it seemed to work" is not engineering.
- ❌ **No retries or timeouts** — agents fail constantly; design for it.
- ❌ **Full autonomy on state-changing actions** without an explicit risk decision.
- ❌ **Memory as a vector DB you bolt on** instead of a deliberate tiered design.
- ❌ **Treating tool output as trusted** — it's an injection vector.
- ❌ **No observability** — you'll be debugging blind in production.

## Advanced Mode

- **Cost model** — projected token + tool cost per run and per month at target scale.
- **Multi-agent choreography** — detailed handoff protocol, shared state, and deadlock avoidance.
- **Eval-driven development plan** — build the eval set before the agent.
- **Streaming + cancellation** — design for partial output and user-initiated stops.
- **Model-portability layer** — abstract the provider so model swaps are config.
- **Red-team plan** — adversarial test cases targeting injection and runaway loops.

## Best Practices

- Start with the eval set — it forces clarity on what "good" means.
- Ship the single-agent version first; earn the multi-agent version with evidence.
- Treat every tool addition as a security review, not a feature.
- Run `production-ready` on the implementation once the architecture is built.
- Revisit the safety review whenever you add a tool or raise the autonomy level.

## Integration Compatibility

| Tool | Support | Notes |
|---|---|---|
| Claude Code | ✅ Full | Best — native MCP support; can scaffold the architecture into code. |
| Cursor | ✅ Full | Strong for implementing the design with repo context. |
| Codex CLI | ✅ Full | Architecture output is plain Markdown; implementation supported. |
| Gemini CLI | ✅ Full | Design generation works well as a context file. |
