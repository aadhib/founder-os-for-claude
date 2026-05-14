# Example — `ai-agent-architect`

A real run of the `ai-agent-architect` skill designing a support-triage agent.

---

## Input

> "An agent that triages incoming support emails and drafts replies. Should be
> human-approved — never auto-send. Stack: TypeScript, Claude, Postgres, existing
> BullMQ queue. Risk: a wrong auto-sent reply to a customer is bad; a wrong draft
> a human catches is fine."

---

## Output (abridged)

# AI Agent Architecture — Support Email Triage + Draft

## The Job
- **Inputs:** an incoming support email (subject, body, sender, thread history).
- **Success outcome:** the email is categorized, prioritized, and has a draft
  reply waiting for human approval.
- **Definition of done:** a draft exists in the agent inbox; a label is applied.
- **Must never happen:** a reply is sent without human approval.

## Topology
- **Chosen:** Agent + tools (single agent).
- **Why:** Triage and drafting share the same context (the email + thread). A
  multi-agent split would add a handoff and a serialization boundary for zero
  benefit. Rejected: supervisor+workers (overkill), pipeline (no independent stages).
- **Diagram:**
  ```
  email ──► [queue] ──► triage-agent ──► tools ──► draft + label ──► human inbox
                                                          │
                                                    (approve) ──► send
  ```

## Agents
| Agent | Responsibility | Allowed tools | In → Out |
|-------|----------------|---------------|----------|
| triage-agent | Categorize, prioritize, draft a reply | read_thread, search_kb, draft_reply, apply_label | email → {category, priority, draft} |

## Tool Layer
| Tool / MCP | Purpose | I/O | Side effects | Scope | Approval? |
|------------|---------|-----|--------------|-------|-----------|
| read_thread | Fetch full email thread | `{threadId}` → messages | read | this mailbox only | no |
| search_kb | Find relevant help-center articles | `{query}` → articles | read | KB only | no |
| draft_reply | Save a draft (NOT send) | `{threadId, body}` → draftId | write (draft) | this mailbox | **yes** |
| apply_label | Tag the thread | `{threadId, label}` → ok | write (label) | label set is fixed enum | no (low risk) |

There is intentionally **no `send_reply` tool**. Sending happens only from the
human approval UI — the agent cannot send, by construction.

## Memory
- **Short-term:** the email + thread in context.
- **Working:** per-email scratchpad for the agent's reasoning (not persisted).
- **Long-term:** retrieval over *resolved* tickets for similar past cases. Email
  bodies are retained 30 days then purged — we don't store what we don't use.

## Orchestration & Queues
- Async via the existing BullMQ queue. Each email is one job.
- Idempotency key = `messageId`, so a redelivered email is not double-drafted.
- Concurrency capped at 5 to bound model cost spikes.

## Failure Handling
| Step | Timeout | Retry | Fallback | Circuit breaker |
|------|---------|-------|----------|-----------------|
| read_thread | 10s | 2, exp backoff | fail the job, alert | 5 failures in 1m → pause queue |
| search_kb | 8s | 1 | proceed without KB context | — |
| model call | 60s | 1 | label "needs-human", no draft | cost > $X/hr → pause |
| draft_reply | 10s | 2 | label "draft-failed", alert | — |

## Human-in-the-Loop
| Action | Risk | Approval UX | Default if no response |
|--------|------|-------------|------------------------|
| Send a reply | High — customer-facing | Draft shown in agent inbox; human edits + clicks Send | After 4h: stays a draft. Never auto-sends. |

## Eval Harness
- **Eval set:** 40 golden tickets (known correct category + a reference draft) +
  15 adversarial (prompt-injection attempts hidden in email bodies, ambiguous
  requests, angry customers).
- **Scoring:** category = exact-match assertion; draft = LLM-judge rubric
  (accurate, on-tone, no hallucinated commitments).
- **CI gate:** evals run on every prompt or model change; category accuracy must
  stay ≥ 90%, zero injection cases may produce a tool call.

## Observability
- **Traces:** one span per agent step (tool calls, model call) per email.
- **Logs:** structured — `messageId`, category, priority, draft length, latency, cost.
- **Metrics:** drafts/hr, category accuracy (sampled), tool error rate, cost/email.
- **Alerts:** queue paused, cost/hr over threshold, draft-failed rate > 5%.

## Safety Review
| Failure mode | Likelihood | Impact | Mitigation |
|--------------|-----------|--------|------------|
| Prompt injection in email body | High | Could trigger unwanted tool calls | Email body wrapped as untrusted data; system prompt says tool output/email content is never instructions; no `send` tool exists |
| Runaway loop | Medium | Cost blowout | Max 8 tool calls/email; concurrency cap; cost circuit breaker |
| Hallucinated commitment in draft | Medium | Bad customer promise | Human approval gate; LLM-judge eval flags unsupported claims |
| Cross-mailbox data leak | Low | Privacy breach | `read_thread` scoped to the single mailbox; tested in evals |

## Build Sequence
1. Build the eval set first (forces "what is a good triage?" to be concrete).
2. Tools with read-only scope + the draft tool.
3. The agent loop + orchestration on the existing queue.
4. The human approval inbox UI.
5. Observability + alerts.
6. Run the adversarial evals; do not ship until injection cases are clean.
