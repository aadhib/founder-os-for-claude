# Integrations

Founder OS works across four AI tools. This page covers how detection works,
where skills land, and how to trigger them in each.

## How detection works

A tool is considered **detected** if either:
1. its binary is on your `PATH`, or
2. its config directory exists in your home folder.

Run `founderos integrations` to see the live status on your machine.

If no tool is detected, skills are still placed in the default per-tool
locations — so nothing is silently dropped — and `doctor` will tell you.

## Claude Code — ✅ Full

- **Skill directory:** `~/.claude/skills/`
- **Trigger:** type `/skill-name` in a Claude Code session (e.g. `/founder-mode`).
- **Notes:** the best experience — strong long-context handling, native vision
  for `fix-my-ui`, and it can apply changes directly to your files.

## Cursor — ✅ Full

- **Skill directory:** `~/.cursor/skills/`
- **Trigger:** reference the skill by name in chat, or wire it as a Cursor rule.
- **Notes:** great for skills that produce code or copy you want placed straight
  into the repo.

## Codex CLI — ✅ Full

- **Skill directory:** `~/.codex/skills/`
- **Trigger:** reference the skill file in your prompt.
- **Notes:** vision-dependent skills (`fix-my-ui`) work best with a screenshot
  attached rather than a text description.

## Gemini CLI — ⚠️ Partial / best-effort

- **Skill directory:** `~/.gemini/skills/`
- **Trigger:** load the skill file as a context file.
- **Notes:** skills work as context files; some Markdown-heavy output (scoring
  tables) renders best in a Markdown-aware viewer. Live-URL skills depend on your
  Gemini CLI setup.

## Per-skill compatibility

Each skill's `SKILL.md` ends with an **Integration Compatibility** table noting
any tool-specific caveats. The general rule:

| Capability | Claude Code | Cursor | Codex CLI | Gemini CLI |
|---|:---:|:---:|:---:|:---:|
| Text generation skills | ✅ | ✅ | ✅ | ✅ |
| Vision skills (`fix-my-ui`) | ✅ | ✅ | ⚠️ | ✅ |
| Repo-wide audit skills | ✅ | ✅ | ✅ | ⚠️ |
| Apply changes to files | ✅ | ✅ | ✅ | ⚠️ |

## Installing for a specific tool

```bash
founderos add fix-my-ui --tool cursor
founderos install --yes        # all detected tools
```

## Adding a new integration

Integrations are defined in [`cli/src/integrations/index.ts`](../cli/src/integrations/index.ts).
Each is a spec with an id, display name, detection binaries, config directories,
and a note. Adding a tool is a single entry plus a `toolSkillDir` case in
[`cli/src/utils/paths.ts`](../cli/src/utils/paths.ts). PRs welcome — see
[CONTRIBUTING.md](../CONTRIBUTING.md).
