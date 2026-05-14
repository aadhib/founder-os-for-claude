/**
 * Founder OS — path resolution
 *
 * Centralizes every filesystem location the CLI cares about so platform
 * quirks (Windows %APPDATA%, XDG, ~/Library) live in exactly one file.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Repo root when running from source; package root when installed from npm. */
export const PACKAGE_ROOT = path.resolve(here, '..', '..');

/**
 * Where the bundled skills live. Two layouts are supported:
 *   - published npm package: `<package>/skills` (copied in by the `prepack` script)
 *   - monorepo / source:     `<repo>/skills`
 * The first that exists wins; falls back to the published layout.
 */
function resolveSkillsDir(): string {
  const candidates = [
    path.join(PACKAGE_ROOT, 'skills'),
    path.resolve(PACKAGE_ROOT, '..', 'skills'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return candidates[0]!;
}

export const SKILLS_DIR = resolveSkillsDir();

/**
 * Local Founder OS state directory (manifest of what we installed).
 * Overridable via `FOUNDER_OS_STATE_DIR` — used by the test suite to avoid
 * touching the real `~/.founderos`, and available to users who relocate state.
 */
export const STATE_DIR =
  process.env['FOUNDER_OS_STATE_DIR'] ?? path.join(os.homedir(), '.founderos');
export const MANIFEST_PATH = path.join(STATE_DIR, 'manifest.json');

/**
 * Per-tool skill install directories. These follow each tool's documented
 * conventions; the installer falls back gracefully when a dir is absent.
 */
export function toolSkillDir(toolId: string): string {
  const home = os.homedir();
  switch (toolId) {
    case 'claude-code':
      // Claude Code reads skills from ~/.claude/skills
      return path.join(home, '.claude', 'skills');
    case 'cursor':
      // Cursor rules / skills directory
      return path.join(home, '.cursor', 'skills');
    case 'codex':
      return path.join(home, '.codex', 'skills');
    case 'gemini':
      return path.join(home, '.gemini', 'skills');
    default:
      return path.join(STATE_DIR, 'skills', toolId);
  }
}

/** Project-local install dir, used by `founder-os init`. */
export function projectSkillDir(cwd: string, toolId: string): string {
  switch (toolId) {
    case 'claude-code':
      return path.join(cwd, '.claude', 'skills');
    case 'cursor':
      return path.join(cwd, '.cursor', 'skills');
    default:
      return path.join(cwd, '.founderos', 'skills', toolId);
  }
}
