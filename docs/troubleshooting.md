# Troubleshooting

Common issues and how to fix them. Start every diagnosis with:

```bash
founderos doctor
```

It reports environment health, detected tools, the install manifest, and drift.

---

## Install issues

### "No Node package manager found"

The installer needs `npm`, `pnpm`, or `bun`. Install Node 18+ from
[nodejs.org](https://nodejs.org) (npm comes with it) and re-run.

### "Node X detected. Founder OS needs Node 18+"

Upgrade Node. With `nvm`: `nvm install 18 && nvm use 18`.

### `curl | bash` fails or is blocked

Corporate networks sometimes block piped shell installs. Use the package-manager
path instead:

```bash
npx founderos install
```

### Permission denied writing skills

The installer writes to `~/.claude/skills/` (and equivalents). If your home
directory or a tool config dir is read-only, fix the permissions or run
`founderos doctor` to see exactly which path failed.

---

## Detection issues

### "No AI tools detected"

Founder OS looks for a tool's binary on `PATH` or its config directory in your
home folder. If you have the tool but it isn't detected:

- Confirm the binary is on `PATH`: `which claude` / `which cursor`.
- Or install directly to that tool: `founderos add <skill> --tool cursor`.
- Skills are still placed in default locations even when nothing is detected.

### Tool detected but skills don't trigger

- **Claude Code:** confirm skills are in `~/.claude/skills/` and restart the session. Trigger with `/skill-name`.
- **Cursor:** reference the skill by name in chat; check `~/.cursor/skills/`.
- **Codex / Gemini:** these load skills as context files — reference the file in your prompt.

---

## Manifest & state issues

### `doctor` says "manifest entries point to missing files"

Skill files were deleted or moved out of band. Re-place them:

```bash
founderos install --force
```

### Skills look out of date

```bash
founderos update
```

Re-syncs installed skills with the latest bundled catalog.

### Reset everything

The safe way — removes only what Founder OS installed, then reinstalls clean:

```bash
founderos uninstall --yes 2>/dev/null || founderos uninstall
founderos install --yes
```

`~/.founderos/manifest.json` is just a record — deleting it is safe; the next
install rebuilds it. `founderos uninstall` is preferred over `rm -rf` because
it re-validates every path before deleting and never touches anything outside
the manifest.

---

## Security

### `doctor --security` reports a failure

Run it for the detail:

```bash
founderos doctor --security
```

Common findings:
- **"installed skill is a symlink"** — a skill folder was replaced with a
  symlink out of band. Founder OS never installs symlinks. Remove it and
  re-run `founderos install --force`.
- **"manifest entry points outside the allowed write area"** — the manifest was
  edited or moved. Reset it: `founderos uninstall` then `founderos install`.

### The `curl | bash` installer refused to run

It refuses to run as root, and refuses to run non-interactively without
`--yes`. Either run it as a normal user with a TTY, or pass `--yes`:

```bash
curl -fsSL https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.sh | bash -s -- --yes
```

---

## Verification issues

### `founderos verify` fails after editing a skill

The skill is missing a required frontmatter key or section. The output names
exactly what's missing. See [Authoring Skills](authoring-skills.md) for the
full contract.

---

## Still stuck?

- Search [GitHub Issues](https://github.com/aadhib/founder-os-for-claude/issues).
- Ask in [Discussions](https://github.com/aadhib/founder-os-for-claude/discussions)
  or [Discord](https://discord.gg/founder-os).
- Open a bug report with the output of `founderos doctor` attached.
