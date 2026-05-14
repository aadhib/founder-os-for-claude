<div align="center">

<img src="screenshots/logo.svg" alt="Founder OS for Claude" width="120" />

# Founder OS for Claude

**The AI operating system for founders, CTOs, and product builders.**

Cursor Rules + Claude Skills + Founder Workflows — installable in one command.

[![CI](https://github.com/aadhib/founder-os-for-claude/actions/workflows/ci.yml/badge.svg)](https://github.com/aadhib/founder-os-for-claude/actions/workflows/ci.yml)
[![Release](https://github.com/aadhib/founder-os-for-claude/actions/workflows/release.yml/badge.svg)](https://github.com/aadhib/founder-os-for-claude/actions/workflows/release.yml)
[![npm](https://img.shields.io/npm/v/@aadhib/founderos.svg?color=8b5cf6)](https://www.npmjs.com/package/@aadhib/founderos)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-339933.svg)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e.svg)](CONTRIBUTING.md)

[Install](#-install-in-one-command) ·
[Skills](#-the-skills) ·
[Quickstart](#-quickstart) ·
[Docs](docs/) ·
[Examples](examples/) ·
[Roadmap](ROADMAP.md)

</div>

```console
$ founderos verify

▌ Founder OS — verify skill catalog
✓ ai-agent-architect       v1.0.0
✓ enterprise-saas-audit    v1.0.0
✓ fix-my-ui                v1.0.0
✓ founder-mode             v1.0.0
✓ production-ready         v1.0.0
✓ saas-launch-kit          v1.0.0
✓ startup-roast            v1.0.0
✓ viral-carousel           v1.0.0

✓ All 8 skills pass the structural contract.
```

---

## What is this?

**Founder OS** is a curated system of production-grade Claude Skills built for people who *ship companies*, not just code.

Most "prompt packs" are a folder of `.txt` files. Founder OS is different:

- A real **TypeScript CLI** that detects your environment and installs skills into the right place.
- **8 enterprise-grade skills**, each with a workflow engine, output schema, quality checklist, and anti-patterns.
- **Cross-platform** — macOS, Linux, Windows.
- **Cross-tool** — Claude Code, Cursor, Codex CLI, Gemini CLI.
- **One command** to go from zero to a fully wired AI operator stack.

> Think of it as the operating layer between *you* and your AI — opinionated, structured, and tuned for founder velocity.

---

## ⚡ Install in one command

**Recommended — the npm path (no shell piping, fully transparent):**

```bash
npx @aadhib/founderos install          # npm
pnpm dlx @aadhib/founderos install     # pnpm
bunx @aadhib/founderos install         # bun
```

**Shell one-liners (macOS / Linux / Windows):**

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.sh | bash

# Windows (PowerShell)
irm https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.ps1 | iex
```

> You never clone the repo, download a ZIP, or copy skills by hand. One command does everything.

### What the installer does — and nothing else

1. 🔒 **Refuses to run as root / Administrator.** Founder OS only writes to your home directory.
2. 🔍 Detects Claude Code, Cursor, Codex CLI, and Gemini CLI.
3. ✅ Validates Node, package manager, and OS.
4. 👀 **Prints the exact command it will run** and waits for confirmation (unless `--yes`).
5. 📦 Installs skills into the correct per-tool directories — **backing up anything it would overwrite**.
6. 🩺 Runs `doctor` and prints your next steps.

It writes no files itself, uses no temp directories, opens no network connections beyond the npm registry, and contains no `postinstall` script. The shell scripts are thin — they only check Node and hand off to the `founderos` npm package.

### Manual verification (for the cautious — recommended)

```bash
# 1. Read the installer before running it
curl -fsSL https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.sh

# 2. Or skip shells entirely and preview every change first
npx @aadhib/founderos install --dry-run    # shows exactly what would be written, writes nothing

# 3. After install, audit it
founderos doctor --security        # path safety, symlink checks, manifest integrity
founderos verify --security        # confirms skills are plain documentation only
```

The `founderos` package is published to npm with **build provenance** — npm can attest the tarball was built by this repo's release workflow. See [SECURITY.md](SECURITY.md) for the full supply-chain story.

---

## 🧠 The Skills

| Skill | What it does | Best for |
|---|---|---|
| 🧭 **founder-mode** | AI COO + CTO + Product Strategist. Roadmaps, prioritization, GTM, pricing. | Solo founders, CEOs |
| 🎨 **fix-my-ui** | Analyze a UI screenshot → premium 2026 redesign with Tailwind specs. | Anyone shipping a UI |
| 🚀 **saas-launch-kit** | Positioning, landing copy, pricing, onboarding, Product Hunt plan. | Pre-launch SaaS |
| 🔥 **startup-roast** | Brutally honest, constructive teardown of your product & landing page. | Reality checks |
| 📱 **viral-carousel** | LinkedIn / Instagram carousels with hooks, slides, captions, visual direction. | Founder content |
| 🛡️ **production-ready** | Audits a prototype across security, CI/CD, perf, scale → production plan. | Prototype → prod |
| 🤖 **ai-agent-architect** | Designs multi-agent systems: MCP, tools, memory, evals, observability. | AI product teams |
| 🏢 **enterprise-saas-audit** | Full enterprise-readiness audit: SOC2 posture, RBAC, multi-tenancy, SLAs. | Selling upmarket |

Each skill ships with a complete `SKILL.md`: purpose, ideal user, input requirements, operating principles, a step-by-step **workflow engine**, an **output schema**, a **quality checklist**, **examples**, **anti-patterns**, and an **advanced mode**.

---

## 🚀 Quickstart

```bash
# 1. Install everything
npx @aadhib/founderos install

# 2. Confirm your environment is healthy
founderos doctor

# 3. See what's installed
founderos list

# 4. Add or remove individual skills
founderos add fix-my-ui
founderos remove startup-roast

# 5. Browse real example outputs
founderos examples

# 6. Preview, audit, and cleanly uninstall
founderos install --dry-run     # see every change before applying
founderos doctor --security     # run the security audit
founderos uninstall             # remove everything (with optional --restore)
```

Then, inside Claude Code or Cursor:

```
/founder-mode  We're a 2-person team building an AI meeting-notes tool. Give me a 90-day roadmap.

/fix-my-ui     [attach screenshot] Make this dashboard feel like a 2026 enterprise SaaS.

/startup-roast https://myproduct.com — be brutal.
```

---

## 🗂️ Architecture

```
founder-os-for-claude/
├── cli/                  TypeScript CLI (Commander + Ora + Chalk + Inquirer + Execa)
│   └── src/
│       ├── commands/     install · doctor · list · add · remove · verify · ...
│       ├── installers/   per-tool skill placement
│       ├── integrations/ Claude Code · Cursor · Codex · Gemini detection
│       ├── templates/    scaffolding for `founderos init`
│       └── utils/        logging, fs, env detection
├── install/              install.sh · install.ps1 · validate-env.js · bootstrap.ts
├── skills/               8 enterprise-grade Claude Skills
├── examples/             real example outputs (not placeholders)
├── docs/                 installation · usage · integrations · architecture
├── website/              landing page
└── .github/              CI, release, issue & PR templates
```

```
        ┌──────────────┐
        │   You / CEO  │
        └──────┬───────┘
               │  natural language
        ┌──────▼───────┐
        │  Founder OS  │  ← skills, workflow engines, output schemas
        └──────┬───────┘
     ┌─────────┼──────────┬───────────┐
┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌────▼────┐
│ Claude │ │ Cursor │ │ Codex  │ │ Gemini  │
│  Code  │ │        │ │  CLI   │ │  CLI    │
└────────┘ └────────┘ └────────┘ └─────────┘
```

---

## 🆚 Why not just use prompts?

| | Prompt packs | Cursor rules | **Founder OS** |
|---|---|---|---|
| One-command install | ❌ | ⚠️ manual | ✅ |
| Multi-tool support | ❌ | ❌ | ✅ Claude / Cursor / Codex / Gemini |
| Structured workflow engines | ❌ | ❌ | ✅ |
| Output schemas + quality gates | ❌ | ❌ | ✅ |
| Environment doctor | ❌ | ❌ | ✅ |
| Versioned + updatable | ❌ | ⚠️ | ✅ `founderos update` |
| Real example library | ⚠️ | ❌ | ✅ |

---

## 📸 Examples

Real, non-placeholder outputs live in [`examples/`](examples/):

- [`examples/fix-my-ui/`](examples/fix-my-ui/) — ugly dashboard → modern redesign brief
- [`examples/startup-roast/`](examples/startup-roast/) — full landing-page teardown
- [`examples/saas-launch-kit/`](examples/saas-launch-kit/) — complete launch plan
- [`examples/ai-agent-architect/`](examples/ai-agent-architect/) — multi-agent system design
- [`examples/viral-carousel/`](examples/viral-carousel/) — 8-slide LinkedIn carousel

### Sample — a real `fix-my-ui` audit scorecard

From [`examples/fix-my-ui/`](examples/fix-my-ui/), a run on a flat gray SaaS dashboard:

| Pillar | Score | Key issue |
|---|:---:|---|
| Spacing & rhythm | 2 / 5 | inconsistent 12/13/17px gutters, no scale |
| Typography | 2 / 5 | 5 sizes, 3 weights, no hierarchy |
| Hierarchy | 1 / 5 | 4 elements share the same blue — no entry point |
| Color & theming | 2 / 5 | flat gray, no background layering |
| Accessibility | 2 / 5 | gray-on-gray text fails WCAG AA contrast |
| **Overall** | **2.1 / 5** | rebuilt to **4.6 / 5** in the redesign brief |

> **Before:** "A flat gray wall of numbers where everything is equally loud."
> **After:** "A layered dark dashboard where the one number that matters is the first — and obvious — thing you see."

---

## 🛠️ For contributors

```bash
git clone https://github.com/aadhib/founder-os-for-claude
cd founder-os-for-claude
pnpm install
pnpm build
pnpm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the skill authoring guide and PR process.

---

## 🔒 Security & supply chain

Founder OS is built to be safe to run on day one of an open-source release.

- **No elevation, ever.** Installers refuse to run as root / Administrator and only write inside your home directory.
- **Path-validated writes.** Every filesystem write is checked against an allow-list — system directories, filesystem roots, and the home root itself are hard-refused, and symlinked targets are never followed.
- **Backups before overwrite.** `--force` copies the existing folder to `<dir>.founderos-backup-<timestamp>` before replacing it.
- **No install-time code execution.** The npm package has no `postinstall` hook. The only executable is the `founderos` CLI bin.
- **Dry-run everything.** `founderos install --dry-run` shows every planned change and writes nothing.
- **Built-in audits.** `founderos doctor --security` and `founderos verify --security` check path safety, symlinks, manifest integrity, and confirm skills are plain documentation.
- **Hardened CI/CD.** Least-privilege workflow permissions, pinned action versions, `pnpm audit` + dependency review gates, npm publish only on maintainer-pushed tags, with build provenance.

Full details, dependency policy, and how to report a vulnerability → [SECURITY.md](SECURITY.md).

---

## 🗺️ Roadmap

- [x] 8 launch skills
- [x] Cross-platform CLI
- [ ] `founderos studio` — local web UI
- [ ] Skill marketplace + community registry
- [ ] Team workspaces & shared skill configs
- [ ] Eval harness for skill output quality

Full roadmap → [ROADMAP.md](ROADMAP.md)

---

## ⭐ Star history

<a href="https://star-history.com/#aadhib/founder-os-for-claude&Date">
  <img src="https://api.star-history.com/svg?repos=aadhib/founder-os-for-claude&type=Date" alt="Star history chart" width="600" />
</a>

If Founder OS saves you time, a ⭐ helps other founders find it.

---

## 💬 Community

- **Discussions** — [GitHub Discussions](https://github.com/aadhib/founder-os-for-claude/discussions)
- **Issues & skill requests** — [GitHub Issues](https://github.com/aadhib/founder-os-for-claude/issues)
- **Contributing** — [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

MIT © Founder OS contributors. See [LICENSE](LICENSE).

<div align="center">
<sub>Built for founders who ship. Not affiliated with Anthropic.</sub>
</div>
