# Installation

Founder OS installs in one command. Pick the path that matches your setup.

## Requirements

- **Node.js 18+** ([nodejs.org](https://nodejs.org))
- One of: `npm`, `pnpm`, or `bun`
- macOS, Linux, or Windows
- At least one supported AI tool — Claude Code, Cursor, Codex CLI, or Gemini CLI
  (optional; skills can still be placed in default locations)

## One-command install

You never clone the repo, download a ZIP, or copy skills by hand. Pick one:

### npm / pnpm / bun — recommended

```bash
npx founder-os install
pnpm dlx founder-os install
bunx founder-os install
```

### curl (macOS / Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.sh | bash
```

### PowerShell (Windows)

```powershell
irm https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.ps1 | iex
```

> **Security note:** the `curl | bash` and `irm | iex` paths run a short shell
> script that only checks Node and hands off to the npm package — it downloads
> nothing else and never elevates. Inspect it first with
> `curl -fsSL <url>`, or prefer `npx founder-os install`. The shell scripts
> require confirmation before doing anything (pass `--yes` to skip). See
> [Security](security.md) and [SECURITY.md](../SECURITY.md).

### Preview before you install

```bash
npx founder-os install --dry-run
```

Shows every directory that would be created or overwritten — and writes nothing.

## What the installer does

1. **Validates your environment** — Node version, package manager, OS, write access.
2. **Detects your AI tools** — by binary on `PATH` or config directory.
3. **Places skills** into each tool's directory:
   | Tool | Directory |
   |---|---|
   | Claude Code | `~/.claude/skills/` |
   | Cursor | `~/.cursor/skills/` |
   | Codex CLI | `~/.codex/skills/` |
   | Gemini CLI | `~/.gemini/skills/` |
4. **Records a manifest** at `~/.founderos/manifest.json`.
5. **Prints next steps.**

## Interactive vs. non-interactive

- `founder-os install` — runs the **setup wizard** (pick tools, pick skills).
- `founder-os install --yes` — non-interactive, installs everything everywhere.
- `founder-os install --dry-run` — preview every change, write nothing.
- `founder-os install --force` — overwrite existing skills (backs them up first).
- `founder-os install --verbose` — print every path decision.
- `founder-os install --from-bootstrap` — used internally by the shell installers.

## Safety guarantees

The installer:

- **never requires sudo / Administrator** — it refuses to run elevated.
- **validates every target path** — system directories and the home root are refused.
- **backs up before overwriting** — `--force` copies the existing folder to
  `<dir>.founderos-backup-<timestamp>` first.
- **never follows symlinks** — a symlinked skill folder is left untouched.
- **shows exactly what it will do** — and waits for confirmation unless `--yes`.

## Project-local install

To commit skills alongside a repo so your whole team shares them:

```bash
cd your-project
npx founder-os init
```

This writes `.founderos.json` and places skills under `.claude/skills/` (or your
tool's project directory). Teammates run `npx founder-os init` after cloning.

## Verifying the install

```bash
founder-os doctor              # environment, tools, manifest health
founder-os doctor --security   # path safety, symlink checks, manifest integrity
```

A healthy install shows a green environment, your detected tools, and the
installed skill count.

## Updating

```bash
founder-os update
```

Re-syncs installed skills with the latest bundled catalog — only touches what
changed or went missing.

## Uninstalling

The clean way — uses the manifest, re-validates every path, never needs elevation:

```bash
founder-os uninstall                 # remove everything Founder OS installed
founder-os uninstall --dry-run       # preview what would be removed
founder-os uninstall --restore       # remove, then restore pre-install backups
founder-os uninstall --skill fix-my-ui   # scope to one skill
founder-os remove <skill>            # remove a single skill
```

`founder-os uninstall` only touches paths recorded in
`~/.founderos/manifest.json` and only inside your home directory.

## Next

- [CLI Usage](cli-usage.md)
- [Troubleshooting](troubleshooting.md) if anything went wrong
