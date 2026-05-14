/**
 * Founder OS — skill installer
 *
 * Takes a set of integrations + a skill selection and physically places skill
 * folders into each tool's directory, then records the result in the manifest.
 *
 * Every write is gated by:
 *   - `assertSafeSkillId` — the skill id can never be path-traversal.
 *   - `assertSafeInstallPath` — the destination must be inside the home dir
 *     (or the project cwd) and must not escape via a symlinked parent.
 *   - a symlink refusal — an existing skill folder that is itself a symlink is
 *     never followed or overwritten.
 *   - a backup — when `--force` overwrites an existing folder, the original is
 *     copied to `<dir>.founderos-backup-<timestamp>` first.
 *
 * `--dry-run` runs the full plan without writing a single byte.
 */

import path from 'node:path';
import type { Integration } from '../integrations/index.js';
import { listSkills, type SkillMeta } from '../utils/skills.js';
import { backupDir, copyDir, ensureDir, exists, isSymlink, remove } from '../utils/fs.js';
import { recordInstall, type ManifestEntry } from '../utils/manifest.js';
import { assertSafeInstallPath, assertSafeSkillId, UnsafePathError } from '../utils/safe-paths.js';
import { logger } from '../utils/logger.js';

export interface InstallOptions {
  /** Overwrite skills that are already installed (creates a backup first). */
  force: boolean;
  /** Restrict to these skill ids. Defaults to all bundled skills. */
  only?: string[];
  /** Plan only — write nothing. */
  dryRun?: boolean;
  /** Print every path decision. */
  verbose?: boolean;
  /** Extra allowed write root (used by `founder-os init` for project installs). */
  allowCwd?: string;
}

export type InstallStatus =
  | 'placed'
  | 'skipped'
  | 'failed'
  | 'would-place'
  | 'would-overwrite'
  | 'would-skip';

export interface InstallDetail {
  skillId: string;
  toolId: string;
  status: InstallStatus;
  path: string;
  reason?: string;
  backupPath?: string;
}

export interface InstallReport {
  placed: number;
  skipped: number;
  failed: number;
  /** Number of distinct tool directories written to. */
  targets: number;
  details: InstallDetail[];
}

/** Place a single skill folder into a single tool directory. */
async function placeSkill(
  skill: SkillMeta,
  tool: Integration,
  opts: InstallOptions,
): Promise<InstallDetail> {
  const base: Omit<InstallDetail, 'status' | 'path'> = {
    skillId: skill.id,
    toolId: tool.id,
  };

  let dest: string;
  try {
    // 1. The skill id must be safe to use as a path segment.
    assertSafeSkillId(skill.id);

    // 2. The destination must be inside the allowed write area.
    const rawDest = path.join(tool.skillDir, skill.id);
    dest = assertSafeInstallPath(rawDest, opts.allowCwd ? { allowCwd: opts.allowCwd } : {});
  } catch (err) {
    const reason = err instanceof UnsafePathError ? err.message : String(err);
    return { ...base, status: 'failed', path: String((err as UnsafePathError)?.target ?? ''), reason };
  }

  if (opts.verbose) logger.info(`${skill.id} → ${dest}`);

  try {
    const alreadyThere = await exists(dest);

    // 3. Never follow or overwrite a symlinked skill folder.
    if (alreadyThere && (await isSymlink(dest))) {
      return {
        ...base,
        status: 'failed',
        path: dest,
        reason: 'destination is a symlink — refusing to follow or overwrite it',
      };
    }

    // 4. Exists and not forcing → skip.
    if (alreadyThere && !opts.force) {
      return {
        ...base,
        status: opts.dryRun ? 'would-skip' : 'skipped',
        path: dest,
        reason: 'already installed',
      };
    }

    // 5. Dry run → report the plan, write nothing.
    if (opts.dryRun) {
      return {
        ...base,
        status: alreadyThere ? 'would-overwrite' : 'would-place',
        path: dest,
      };
    }

    // 6. Forced overwrite → back up the original first, then replace.
    let backupPath: string | undefined;
    if (alreadyThere) {
      const made = await backupDir(dest);
      if (made) {
        backupPath = made;
        if (opts.verbose) logger.info(`backed up existing → ${made}`);
      }
      await remove(dest);
    }

    // 7. Place the skill.
    await ensureDir(tool.skillDir);
    await copyDir(skill.dir, dest);

    return backupPath
      ? { ...base, status: 'placed', path: dest, backupPath }
      : { ...base, status: 'placed', path: dest };
  } catch (err) {
    return {
      ...base,
      status: 'failed',
      path: dest,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function installAllSkills(
  integrations: Integration[],
  opts: InstallOptions,
): Promise<InstallReport> {
  const all = await listSkills();
  const selected = opts.only ? all.filter((s) => opts.only!.includes(s.id)) : all;

  // Install into detected tools; if none detected, still install into the
  // default location for each so nothing is silently dropped.
  const targets = integrations.filter((i) => i.detected);
  const effectiveTargets = targets.length ? targets : integrations;

  const details: InstallDetail[] = [];
  const manifestEntries: ManifestEntry[] = [];
  const now = new Date().toISOString();

  for (const tool of effectiveTargets) {
    for (const skill of selected) {
      const detail = await placeSkill(skill, tool, opts);
      details.push(detail);

      if (detail.status === 'placed') {
        manifestEntries.push({
          skillId: skill.id,
          toolId: tool.id,
          path: detail.path,
          version: skill.version,
          installedAt: now,
          ...(detail.backupPath ? { backupPath: detail.backupPath } : {}),
        });
      }
      if (detail.status === 'failed') {
        logger.warn(`Failed: ${skill.id} → ${tool.name} (${detail.reason})`);
      }
    }
  }

  // Only the real run touches the manifest.
  if (!opts.dryRun && manifestEntries.length) await recordInstall(manifestEntries);

  return {
    placed: details.filter((d) => d.status === 'placed').length,
    skipped: details.filter((d) => d.status === 'skipped' || d.status === 'would-skip').length,
    failed: details.filter((d) => d.status === 'failed').length,
    targets: effectiveTargets.length,
    details,
  };
}

/** Install one skill across the given tools — used by `founder-os add`. */
export async function installSkill(
  skillId: string,
  integrations: Integration[],
  opts: InstallOptions,
): Promise<InstallReport> {
  return installAllSkills(integrations, { ...opts, only: [skillId] });
}
