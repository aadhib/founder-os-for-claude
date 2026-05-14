# Security Policy

Founder OS is a CLI that installs Markdown skill files into local AI-tool
directories. It is designed to be safe to run on an untrusted machine and safe
to publish as open source. This document covers the threat model, the
supply-chain story, the dependency policy, and how to report a vulnerability.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅        |
| < 1.0   | ❌        |

## Supported Node.js versions

| Node.js | Status |
|---------|--------|
| 22.x    | ✅ tested in CI |
| 20.x    | ✅ tested in CI |
| 18.x    | ✅ minimum supported, tested in CI |
| < 18    | ❌ unsupported |

## Reporting a Vulnerability

**Do not open a public issue for security vulnerabilities.**

Use **[GitHub Security Advisories](https://github.com/aadhib/founder-os-for-claude/security/advisories/new)**
(Security → Report a vulnerability) — or, if you cannot, email
**security@founderos.dev**.

Include:

- A description of the vulnerability and its impact
- Steps to reproduce
- Affected version(s)

You will get an acknowledgement within **48 hours** and a status update within
**5 business days**. We aim to ship a fix or mitigation within **30 days** of
confirmation, and we will credit you in the release notes unless you prefer to
remain anonymous.

## Threat model

Founder OS does three things: detects AI tools, copies skill folders into their
directories, and records a manifest. The security-relevant surfaces are:

| Surface | Risk | Mitigation |
|---|---|---|
| **Install scripts** (`install/install.sh`, `install.ps1`) | run with user privileges; could write somewhere dangerous | refuse root/Administrator; no temp files; no secondary downloads; print the exact command and require confirmation; hand straight off to the npm package |
| **Filesystem writes** (installers, `init`, `remove`, `uninstall`) | path traversal, arbitrary overwrite, symlink escape | every write routed through `assertSafeInstallPath` — see below |
| **Skill ids used as path segments** | a crafted catalog entry could traverse | `assertSafeSkillId` enforces kebab-case, no separators, no `..` |
| **The manifest** (`~/.founderos/manifest.json`) | a tampered manifest could point `remove`/`uninstall` at any path | every manifest path is **re-validated** before deletion |
| **`curl | bash` install path** | classic untrusted-pipe risk | the script is short, auditable, downloads nothing else, and the npm path (`npx founderos install`) avoids piping entirely |
| **Dependency chain** | a compromised dependency | minimal, pinned dependencies; `pnpm audit` gate in CI; Dependabot; no `postinstall` |
| **Release pipeline** | a malicious publish | publish only on maintainer-pushed tags; least-privilege workflow tokens; npm provenance |

### Path safety guarantees

`cli/src/utils/safe-paths.ts` is the single chokepoint for every write. It
guarantees a target directory:

1. contains no control characters,
2. is **not** a filesystem root or a known system directory (`/`, `/etc`,
   `/usr`, `C:\`, `C:\Windows`, `C:\Program Files`, …),
3. is **not** the bare home directory itself,
4. is **inside** the user's home directory (or, for `founderos init`, inside
   the current project directory) — nothing else is writable,
5. does not escape the allowed area through a **symlinked parent** — the
   deepest existing ancestor's real path is resolved and re-checked.

A symlinked skill folder is never followed or overwritten — `remove` /
`uninstall` unlink the symlink and leave its target untouched.

### What Founder OS never does

- Never runs as / requires root or Administrator.
- Never edits files outside your home or project directory.
- Never executes skill content — skills are plain Markdown.
- Never ships a `postinstall` / `preinstall` script.
- Never opens network connections beyond the npm registry.
- Never reads or logs environment secrets.

## Supply-chain trust

### npm package provenance

The `founderos` package is published with **[npm provenance](https://docs.npmjs.com/generating-provenance-statements)**.
npm cryptographically attests that the published tarball was built by this
repository's `release.yml` workflow, from this source, at the tagged commit.
Verify it on the package page (the "Provenance" section) or with:

```bash
npm view founderos --json | grep -A5 provenance
```

### Reproducible builds

The published tarball contains only:

- `dist/` — the compiled CLI (`tsc` output, no bundler, no minification)
- `skills/` — the Markdown skill catalog, copied verbatim from `/skills`

To reproduce locally:

```bash
git clone https://github.com/aadhib/founder-os-for-claude
cd founder-os-for-claude && pnpm install --frozen-lockfile
pnpm --filter founderos build
node cli/scripts/bundle-skills.cjs
# cli/dist + cli/skills now match the published package contents
```

There is no build-time code generation — `dist/` is a deterministic `tsc`
compile of `cli/src/`.

### Verifying the installer scripts

The shell installers are intentionally short and do exactly what their header
comments say. Always read them first:

```bash
curl -fsSL https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.sh
```

Or skip shells entirely: `npx founderos install --dry-run`.

## Dependency policy

- **Minimal surface.** The CLI has five runtime dependencies — `chalk`,
  `commander`, `execa`, `inquirer`, `ora` — all widely used and actively
  maintained. New runtime dependencies require justification in the PR.
- **Pinned ranges.** Dependencies use caret ranges against known-good versions;
  Dependabot proposes updates weekly and CI gates them.
- **Audited in CI.** Every CI run executes `pnpm audit --audit-level=high` and,
  on PRs, `dependency-review-action`. A release cannot ship with a known
  high/critical advisory.
- **No transitive install scripts trusted blindly.** The package itself has no
  install hooks; `pnpm` is configured to surface dependency install scripts.

## Hardening recommendations for users

- Prefer `npx founderos install` over `curl | bash`.
- Run `founderos install --dry-run` first to preview every change.
- Run `founderos doctor --security` after installing.
- Review which directories were written — `founderos doctor` prints them.
- Skills are plain Markdown — read them before enabling. They contain no
  executable code, but they do shape model behavior.

## Security checklist for maintainers (pre-release)

- [ ] `pnpm audit --audit-level=high` is clean
- [ ] `founderos verify --security` passes
- [ ] `founderos doctor --security` passes on a clean machine
- [ ] CI is green on all three OSes and all supported Node versions
- [ ] No new runtime dependency added without justification
- [ ] Workflow permissions are still least-privilege
- [ ] The release tag matches `cli/package.json` version
- [ ] Provenance is enabled on the publish step
