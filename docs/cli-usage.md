# CLI Usage

The `founder-os` CLI manages skills across your AI tools. Every command is
listed below with its flags and a real example.

```
founder-os <command> [options]
```

Global flags: `-v, --version`, `-h, --help`.

---

## `install`

Install skills into your AI tools.

| Flag | Description |
|---|---|
| `-y, --yes` | Non-interactive — install everything, everywhere detected. |
| `--from-bootstrap` | Used by the shell installers (implies `--yes`). |
| `-f, --force` | Overwrite installed skills — **backs them up first**. |
| `--only <skills>` | Comma-separated skill ids to install. |
| `--dry-run` | Show every planned change and write nothing. |
| `--verbose` | Print every path decision. |

```bash
founder-os install                       # interactive wizard
founder-os install --yes                 # install everything
founder-os install --dry-run             # preview — writes nothing
founder-os install --only fix-my-ui,founder-mode
```

Every write is path-validated, refuses system directories, and never follows
symlinks. See [Security](security.md).

---

## `uninstall`

Cleanly remove skills the CLI installed. Uses the manifest, re-validates every
path before deleting, and never requires elevation.

| Flag | Description |
|---|---|
| `-s, --skill <skill>` | Only uninstall this skill. |
| `-t, --tool <tool>` | Only uninstall from this tool. |
| `--dry-run` | Show what would be removed — delete nothing. |
| `--restore` | Restore the pre-install backup after removing each skill. |

```bash
founder-os uninstall                 # remove everything
founder-os uninstall --dry-run       # preview
founder-os uninstall --restore       # remove, then restore backups
founder-os uninstall --skill fix-my-ui
```

---

## `doctor`

Health check: environment, detected tools, install manifest, and drift.

| Flag | Description |
|---|---|
| `--security` | Run the security audit instead — path safety, symlink checks, manifest integrity, skill-content check. |

```bash
founder-os doctor
founder-os doctor --security
```

Exits non-zero if the environment (or, with `--security`, the security audit)
has blocking issues.

---

## `list`

List the full skill catalog and install status.

| Flag | Description |
|---|---|
| `--json` | Machine-readable output. |

```bash
founder-os list
founder-os list --json | jq '.[] | select(.installed)'
```

---

## `add <skill>`

Install a single skill.

| Flag | Description |
|---|---|
| `-t, --tool <tools>` | Comma-separated tool ids (defaults to all detected). |
| `-f, --force` | Overwrite if already installed — backs it up first. |
| `--dry-run` | Show what would change — write nothing. |
| `--verbose` | Print every path decision. |

```bash
founder-os add startup-roast
founder-os add fix-my-ui --tool cursor
founder-os add fix-my-ui --dry-run
```

---

## `remove <skill>`

Remove a single skill from your tools and the manifest.

| Flag | Description |
|---|---|
| `-t, --tool <tools>` | Comma-separated tool ids (defaults to all). |

```bash
founder-os remove viral-carousel
founder-os remove fix-my-ui --tool claude-code
```

---

## `update`

Re-sync installed skills with the latest bundled catalog. Only re-places skills
whose version changed or whose files went missing.

```bash
founder-os update
```

---

## `init`

Scaffold Founder OS into the current project (skills committed alongside the repo).

| Flag | Description |
|---|---|
| `-t, --tool <tools>` | Comma-separated tool ids (defaults to detected). |
| `-f, --force` | Overwrite existing `.founderos.json` and skills. |

```bash
cd your-project
founder-os init
```

Writes `.founderos.json` and `FOUNDER_OS.md`. Commit both.

---

## `verify`

Validate every bundled skill against the structural contract (required
frontmatter + required `SKILL.md` sections). Used in CI.

| Flag | Description |
|---|---|
| `--security` | Also run the catalog security audit — confirms skills are plain documentation only (no executables, no symlinks, no binary content). |

```bash
founder-os verify
founder-os verify --security
```

---

## `examples [skill]`

Browse the bundled example library.

```bash
founder-os examples            # list all
founder-os examples fix-my-ui  # one skill
```

---

## `integrations`

Show supported AI tools, detection status, and where skills are placed.

```bash
founder-os integrations
```

---

## Tips

- Run `founder-os doctor` after any change — it's the fastest way to confirm state.
- Use `--tool` to keep work and personal tool setups separate.
- `founder-os list --json` is the integration point for scripts and dashboards.
