# Contributing to Founder OS

Thanks for helping build the AI operating system for founders. This guide covers how to set up the repo, author skills, and open a clean PR.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating you agree to uphold it.

## Local setup

```bash
git clone https://github.com/aadhib/founder-os-for-claude
cd founder-os-for-claude
pnpm install
pnpm build      # builds the CLI via Turbo
pnpm test       # runs the test suite
pnpm lint       # type-check + lint
```

Requirements: Node >= 18, pnpm >= 8.

## Repo layout

| Path | What lives here |
|---|---|
| `cli/` | The `founderos` TypeScript CLI |
| `install/` | Bootstrap scripts (`install.sh`, `install.ps1`, validators) |
| `skills/` | Claude Skills — one folder per skill |
| `examples/` | Real example outputs |
| `docs/` | User documentation |
| `website/` | Marketing landing page |

## Authoring a skill

Every skill lives in `skills/<skill-name>/` and **must** contain a `SKILL.md` with this structure:

```markdown
---
name: skill-name
description: One sentence — what it does and when to trigger it.
version: 1.0.0
category: strategy | design | growth | engineering
tools: [Claude Code, Cursor, Codex CLI, Gemini CLI]
---

# skill-name

## Purpose
## Use Cases
## Ideal User
## Input Requirements
## Operating Principles
## Workflow Engine        ← numbered, step-by-step execution logic
## Output Schema          ← exact shape of the deliverable
## Quality Checklist      ← gates the output must pass
## Examples
## Anti-Patterns
## Advanced Mode
## Best Practices
## Integration Compatibility
```

### Skill quality bar

- The workflow engine must be **executable** — a model should be able to follow it deterministically.
- The output schema must be **concrete** — headings, fields, formats, not vibes.
- Include at least one **realistic** example. No `lorem ipsum`.
- List **anti-patterns** — the failure modes a model commonly falls into.

Run `founderos verify` after adding a skill to validate its frontmatter and structure.

## Commit & PR conventions

- Branch from `main`: `feat/skill-name`, `fix/...`, `docs/...`.
- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat(skills): add growth-loops skill`.
- Keep PRs focused. One skill or one feature per PR.
- Fill out the PR template. Link related issues.
- CI must pass (build, test, lint, skill verification).

## Reporting bugs / requesting skills

Use the [issue templates](.github/ISSUE_TEMPLATE/). For new skill ideas, open a **Skill request** and describe the founder problem it solves.

## Release process

Maintainers cut releases via the `release` workflow. Versioning follows semver. Changelog entries are required — see [CHANGELOG.md](CHANGELOG.md).
