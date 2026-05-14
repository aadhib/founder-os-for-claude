# `founder-os` CLI

The TypeScript CLI that powers Founder OS. Detects your AI tools, places
skills in the right directories, and keeps everything in sync.

## Install

```bash
npx founder-os install
```

## Commands

| Command | Description |
|---|---|
| `founder-os install` | Interactive setup wizard (or `--yes` for non-interactive) |
| `founder-os doctor` | Environment + manifest health check |
| `founder-os list` | List all skills and install status (`--json` supported) |
| `founder-os update` | Re-sync installed skills with the latest catalog |
| `founder-os init` | Scaffold Founder OS into the current project |
| `founder-os add <skill>` | Install a single skill |
| `founder-os remove <skill>` | Remove a single skill |
| `founder-os verify` | Validate the skill catalog (used in CI) |
| `founder-os examples [skill]` | Browse the bundled example library |
| `founder-os integrations` | Show supported tools and detection status |

## Architecture

```
src/
├── index.ts            Commander wiring + top-level error handling
├── commands/           one file per command
├── installers/         skill placement logic
├── integrations/       per-tool detection (Claude Code, Cursor, Codex, Gemini)
├── templates/          scaffolding strings for `init`
└── utils/              logger, env, fs, paths, skills, manifest
```

State lives at `~/.founderos/manifest.json` — the record of what was installed
where, so `update` and `remove` are precise rather than best-effort.

## Develop

```bash
pnpm install
pnpm --filter founder-os build
pnpm --filter founder-os test
node cli/dist/index.js doctor
```
