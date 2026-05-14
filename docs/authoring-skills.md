# Adding & Authoring Skills

Founder OS skills are plain Markdown files with a strict structure. This page is
the full authoring guide.

## Where skills live

```
skills/
└── your-skill/
    └── SKILL.md
```

One folder per skill. The folder name is the skill **id** — lowercase,
kebab-case, e.g. `growth-loops`.

## The frontmatter contract

Every `SKILL.md` starts with YAML frontmatter. All five keys are required:

```yaml
---
name: your-skill
description: One sentence — what it does and when to trigger it.
version: 1.0.0
category: strategy | design | growth | engineering
tools: [Claude Code, Cursor, Codex CLI, Gemini CLI]
---
```

- `description` is what tools use to decide *when* to fire the skill — make it
  specific and trigger-oriented.
- `version` is semver.
- `category` must be one of the four values.

## The section contract

The body must contain all 13 sections, as `##` or `###` headings:

| Section | What goes here |
|---|---|
| **Purpose** | Why the skill exists; the problem it solves. |
| **Use Cases** | Concrete situations where you'd reach for it. |
| **Ideal User** | Who it's calibrated for. |
| **Input Requirements** | What the user must provide; what's optional. |
| **Operating Principles** | The non-negotiable rules the skill follows. |
| **Workflow Engine** | Numbered, executable, step-by-step logic. |
| **Output Schema** | The exact shape of the deliverable. |
| **Quality Checklist** | Gates the output must pass before it's "done". |
| **Examples** | At least one realistic example. No lorem ipsum. |
| **Anti-Patterns** | The failure modes a model commonly falls into. |
| **Advanced Mode** | Optional depth for power users. |
| **Best Practices** | How to get the most out of the skill. |
| **Integration Compatibility** | Per-tool support notes. |

`founder-os verify` enforces both contracts. CI runs it on every PR.

## Quality bar

A skill is only mergeable if:

- **The Workflow Engine is executable.** A model should be able to follow it
  deterministically — numbered steps, each producing a concrete output.
- **The Output Schema is concrete.** Real headings, fields, and formats — not
  "a summary of findings".
- **There's a real example.** Show actual input → actual output. Add it to
  [`examples/your-skill/`](../examples/) too.
- **Anti-patterns are specific.** "Don't be vague" is itself vague. Name the
  exact way a model gets this wrong.

## Scaffolding a new skill

The CLI ships a stub template ([`cli/src/templates/index.ts`](../cli/src/templates/index.ts) →
`renderSkillStub`). Create the folder and `SKILL.md`, fill in every section, then:

```bash
pnpm --filter founder-os build
node cli/dist/index.js verify     # must pass
```

## Testing your skill

```bash
founder-os verify                 # structural check
founder-os add your-skill         # install it locally
# then trigger /your-skill in Claude Code and iterate
```

The test suite in [`cli/src/utils/skills.test.ts`](../cli/src/utils/skills.test.ts)
runs the same checks `verify` does, against the whole catalog.

## Submitting

Branch as `feat/your-skill`, add the skill + an example, fill out the PR
template. See [CONTRIBUTING.md](../CONTRIBUTING.md) for the full process.
