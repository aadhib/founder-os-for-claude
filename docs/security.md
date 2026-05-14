# Security

How Founder OS keeps your machine safe — and how to verify it yourself.

For the formal policy, threat model, and vulnerability reporting, see the
top-level [SECURITY.md](../SECURITY.md). This page is the practical guide.

## The one-line summary

Founder OS only ever writes plain Markdown files into AI-tool folders inside
your home directory. It never elevates, never runs skill content, never ships
an install hook, and shows you exactly what it will do before it does it.

## Safe by default

| Guarantee | How |
|---|---|
| **No elevation** | `install.sh` / `install.ps1` refuse to run as root / Administrator. The CLI never calls `sudo`. |
| **Validated paths** | Every write goes through `assertSafeInstallPath` — filesystem roots, system directories, and the home root itself are refused. |
| **Inside home only** | Writes must land inside your home directory (or, for `init`, the current project). Nothing else is reachable. |
| **No symlink escape** | The real path of the deepest existing parent is resolved and re-checked; symlinked skill folders are never followed or overwritten. |
| **Backups before overwrite** | `--force` copies the existing folder to `<dir>.founderos-backup-<timestamp>` before replacing it. |
| **Safe skill ids** | A skill id is validated as kebab-case with no path separators before it is ever used as a path segment. |
| **Manifest re-validation** | `remove` / `uninstall` re-validate every manifest path before deleting — a tampered manifest can't redirect a delete. |
| **No install-time code** | The npm package has no `postinstall` / `preinstall`. The only executable is the `founderos` bin. |

## Verify it yourself

### Before installing

```bash
# Read the installer — it is short and does exactly what its header says
curl -fsSL https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.sh

# Or skip shells entirely and preview every change
npx founderos install --dry-run
```

`--dry-run` prints every directory that would be created or overwritten and
writes nothing.

### After installing

```bash
founderos doctor --security
```

Runs the security audit:

- every tool's install directory is a safe write target
- no installed skill folder is a symlink
- the manifest contains only valid, in-home paths
- bundled skills are plain documentation (no executables, no binary content, no symlinks)

```bash
founderos verify --security
```

Runs the catalog audit on the bundled skills specifically — useful in CI and
before publishing.

## Uninstalling safely

```bash
founderos uninstall --dry-run     # see what would be removed
founderos uninstall               # remove everything the CLI installed
founderos uninstall --restore     # remove, then restore pre-install backups
```

`uninstall` only touches paths recorded in `~/.founderos/manifest.json`, and
re-validates each one before deleting.

## Supply chain

- **npm provenance** — the `founderos` package is published with a signed
  provenance attestation tying the tarball to this repo's release workflow.
- **Reproducible** — `dist/` is a plain `tsc` compile; `skills/` is copied
  verbatim. No bundling, no minification, no code generation.
- **Hardened CI/CD** — least-privilege workflow tokens, pinned action versions,
  `pnpm audit` + dependency-review gates, publish only on maintainer-pushed
  tags. See [`.github/workflows/`](../.github/workflows/).
- **Minimal dependencies** — five runtime dependencies, all mainstream and
  audited weekly by Dependabot.

## Reporting a vulnerability

Use [GitHub Security Advisories](https://github.com/aadhib/founder-os-for-claude/security/advisories/new)
or email **security@founderos.dev**. Do not open a public issue. Full process
in [SECURITY.md](../SECURITY.md).
