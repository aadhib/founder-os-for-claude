# Architecture

How Founder OS is put together — for contributors and the curious.

## The big picture

```
┌─────────────────────────────────────────────────────────┐
│  install/                                                │
│  install.sh / install.ps1   ── ensure Node, pick runner  │
│         │                                                │
│         ▼                                                │
│  cli/  founder-os install --from-bootstrap               │
│         │                                                │
│         ▼                                                │
│  bootstrap.ts ── validate → detect → place → doctor      │
└─────────┬───────────────────────────────────────────────┘
          │
   ┌──────▼──────┐   ┌─────────────┐   ┌──────────────┐
   │ integrations│   │ installers  │   │ skills/      │
   │ detect tools│──▶│ place skills│◀──│ the catalog  │
   └─────────────┘   └──────┬──────┘   └──────────────┘
                            │
                            ▼
                  ~/.founderos/manifest.json
                  (record of what went where)
```

## Design principles

1. **Shell scripts contain no logic.** `install.sh` / `install.ps1` only ensure
   a Node runtime exists, then defer to the TypeScript CLI. One source of truth.
2. **The manifest is the state.** `~/.founderos/manifest.json` records every
   placed skill, so `update` and `remove` are precise, not best-effort.
3. **Skills are data, not code.** A skill is a Markdown file. The CLI never
   executes skill content — it only copies files.
4. **Detection is layered.** A tool counts as present if its binary is on `PATH`
   *or* its config dir exists — robust to PATH quirks.
5. **Fail loud, proceed sensibly.** Missing tools → install to defaults + warn.
   Missing env prerequisites → stop with a clear message.

## The CLI package (`cli/`)

| Module | Responsibility |
|---|---|
| `src/index.ts` | Commander wiring + top-level error handling. |
| `src/commands/` | One file per command. Commands orchestrate; they don't implement low-level logic. |
| `src/integrations/` | Per-tool detection. The single place that knows about Claude Code / Cursor / Codex / Gemini. |
| `src/installers/` | Skill placement: copy a skill folder into a tool directory, update the manifest. |
| `src/templates/` | Scaffolding strings for `founder-os init`. |
| `src/utils/logger.ts` | The consistent terminal voice. |
| `src/utils/env.ts` | Environment validation. |
| `src/utils/paths.ts` | Every filesystem location, with platform quirks isolated here. |
| `src/utils/fs.ts` | Async filesystem helpers. |
| `src/utils/skills.ts` | The skill registry — reads `skills/`, parses frontmatter, validates structure. |
| `src/utils/manifest.ts` | Read/write the install manifest. |

### Dependency direction

```
commands → installers → utils
commands → integrations → utils
commands → utils
```

`utils` depends on nothing in the package. `integrations` and `installers` never
import from `commands`. This keeps the graph acyclic and the modules testable in
isolation.

## The skill catalog (`skills/`)

Each skill is a folder with a `SKILL.md`. The frontmatter is parsed by a minimal
YAML reader in `utils/skills.ts` (flat keys, scalars + inline arrays only — no
dependency needed). `verifySkill` checks the structural contract; `founder-os
verify` and the test suite both run it.

## The bootstrap layer (`install/`)

The shell scripts (`install.sh` / `install.ps1`) contain no skill logic — they
ensure a Node runtime exists, then call `founder-os install --from-bootstrap`.

The real bootstrap pipeline (`cli/src/bootstrap.ts`) and interactive wizard
(`cli/src/setup-wizard.ts`) live **inside the CLI package**, so they ship
compiled with `founder-os` and are covered by its build and tests.
`install/bootstrap.ts` and `install/setup-wizard.ts` are thin standalone
entrypoints for local use. `install/validate-env.js` is a zero-dependency
pre-flight check that works before anything is built.

## Build & release

- **Monorepo:** pnpm workspaces + Turbo.
- **CLI build:** `tsc` → `cli/dist/`. The `bin` entry points at `dist/index.js`.
- **Published package:** `founder-os` ships `dist/` + the `skills/` folder.
- **CI** runs build, test, lint, and `founder-os verify` on every PR.

## Why no framework

The CLI deliberately uses a thin stack — Commander, Chalk, Ora, Inquirer, Execa —
and hand-rolls the small things (frontmatter parsing, the manifest). The whole
tool is small enough that a framework would add more surface area than it
removes. The constraint keeps install size and cold-start fast.
