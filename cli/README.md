# `founderos` CLI

The TypeScript CLI that powers Founder OS. Detects your AI tools, places
skills in the right directories, and keeps everything in sync.

## Install

```bash
npx founderos install
```

## Commands

| Command | Description |
|---|---|
| `founderos install` | Interactive setup wizard (or `--yes` for non-interactive) |
| `founderos doctor` | Environment + manifest health check |
| `founderos list` | List all skills and install status (`--json` supported) |
| `founderos update` | Re-sync installed skills with the latest catalog |
| `founderos init` | Scaffold Founder OS into the current project |
| `founderos add <skill>` | Install a single skill |
| `founderos remove <skill>` | Remove a single skill |
| `founderos verify` | Validate the skill catalog (used in CI) |
| `founderos examples [skill]` | Browse the bundled example library |
| `founderos integrations` | Show supported tools and detection status |

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
pnpm --filter founderos build
pnpm --filter founderos test
node cli/dist/index.js doctor
```
