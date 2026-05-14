# Changelog

All notable changes to Founder OS are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- **Renamed the npm package and CLI binary `founder-os` → `founderos`.** The
  unscoped name `founder-os` was already taken on npm by an unrelated project,
  so `npx founder-os install` would have run the wrong package. Install with
  `npx founderos install`; the command is `founderos`.

### Added
- `founderos uninstall` — clean removal via the manifest, with `--dry-run`,
  `--restore`, `--skill`, and `--tool` scoping.
- `founderos install --dry-run` / `--verbose` — preview every change, write nothing.
- `founderos doctor --security` — path-safety, symlink, and manifest-integrity audit.
- `founderos verify --security` — confirms the bundled catalog is plain documentation.
- Automatic backups: `--force` copies an existing skill folder to
  `<dir>.founderos-backup-<timestamp>` before overwriting it.

### Security
- All filesystem writes routed through `assertSafeInstallPath` — refuses
  filesystem roots, system directories, the home root, and symlink escapes.
- Skill ids validated with `assertSafeSkillId` before use as path segments.
- `remove` / `uninstall` re-validate every manifest path before deleting.
- Installers refuse to run as root / Administrator, print the exact command,
  and require confirmation unless `--yes`.
- GitHub workflows hardened: least-privilege permissions, pinned action
  versions, `pnpm audit` + dependency-review gates, npm publish only on
  maintainer-pushed tags with build provenance.
- npm package: no install hooks, `exports` map, trimmed published tarball.

### Planned
- `founderos studio` local web UI
- Community skill registry

## [1.0.0] — 2026-05-14

### Added
- One-command installer for npm, pnpm, bun, curl, and PowerShell.
- `founderos` CLI with commands: `install`, `doctor`, `list`, `update`,
  `init`, `add`, `remove`, `verify`, `examples`, `integrations`.
- Environment detection for Claude Code, Cursor, Codex CLI, and Gemini CLI.
- Cross-platform support: macOS, Linux, Windows.
- 8 launch skills:
  - `founder-mode` — strategic operator workflow
  - `fix-my-ui` — UI screenshot → premium redesign brief
  - `saas-launch-kit` — end-to-end launch plan generator
  - `startup-roast` — brutally honest product teardown
  - `viral-carousel` — LinkedIn / Instagram carousel generator
  - `production-ready` — prototype → production audit
  - `ai-agent-architect` — multi-agent system designer
  - `enterprise-saas-audit` — enterprise-readiness audit
- Real example library under `examples/`.
- Full documentation set under `docs/`.
- CI, release automation, issue and PR templates.

[Unreleased]: https://github.com/aadhib/founder-os-for-claude/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/aadhib/founder-os-for-claude/releases/tag/v1.0.0
