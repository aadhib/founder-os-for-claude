# CLI Usage

The `founderos` CLI manages skills across your AI tools. Every command is
listed below with its flags and a real example.

```
founderos <command> [options]
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
founderos install                       # interactive wizard
founderos install --yes                 # install everything
founderos install --dry-run             # preview — writes nothing
founderos install --only fix-my-ui,founder-mode
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
founderos uninstall                 # remove everything
founderos uninstall --dry-run       # preview
founderos uninstall --restore       # remove, then restore backups
founderos uninstall --skill fix-my-ui
```

---

## `doctor`

Health check: environment, detected tools, install manifest, and drift.

| Flag | Description |
|---|---|
| `--security` | Run the security audit instead — path safety, symlink checks, manifest integrity, skill-content check. |

```bash
founderos doctor
founderos doctor --security
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
founderos list
founderos list --json | jq '.[] | select(.installed)'
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
founderos add startup-roast
founderos add fix-my-ui --tool cursor
founderos add fix-my-ui --dry-run
```

---

## `remove <skill>`

Remove a single skill from your tools and the manifest.

| Flag | Description |
|---|---|
| `-t, --tool <tools>` | Comma-separated tool ids (defaults to all). |

```bash
founderos remove viral-carousel
founderos remove fix-my-ui --tool claude-code
```

---

## `update`

Re-sync installed skills with the latest bundled catalog. Only re-places skills
whose version changed or whose files went missing.

```bash
founderos update
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
founderos init
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
founderos verify
founderos verify --security
```

---

## `examples [skill]`

Browse the bundled example library.

```bash
founderos examples            # list all
founderos examples fix-my-ui  # one skill
```

---

## `integrations`

Show supported AI tools, detection status, and where skills are placed.

```bash
founderos integrations
```

---

## Tips

- Run `founderos doctor` after any change — it's the fastest way to confirm state.
- Use `--tool` to keep work and personal tool setups separate.
- `founderos list --json` is the integration point for scripts and dashboards.
