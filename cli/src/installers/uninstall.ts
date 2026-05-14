/**
 * Founder OS — uninstaller
 *
 * Removes skill folders the CLI installed, using the manifest as the source of
 * truth. Defensive by design:
 *   - every path from the manifest is re-validated with `assertSafeInstallPath`
 *     before deletion (the manifest is a plain JSON file and could be tampered).
 *   - a symlinked skill folder is never followed — only the link is removed.
 *   - `--dry-run` reports the plan without deleting anything.
 *   - `--restore` puts back the most recent pre-install backup, if one exists.
 */

import { readManifest, writeManifest, type ManifestEntry } from '../utils/manifest.js';
import { copyDir, exists, isSymlink, remove } from '../utils/fs.js';
import { assertSafeInstallPath, UnsafePathError } from '../utils/safe-paths.js';
import fsp from 'node:fs/promises';

export interface UninstallOptions {
  /** Restrict to a single skill id. */
  skillId?: string;
  /** Restrict to a single tool id. */
  toolId?: string;
  /** Plan only — delete nothing. */
  dryRun?: boolean;
  /** Restore the pre-install backup after removing the skill. */
  restore?: boolean;
}

export type UninstallStatus =
  | 'removed'
  | 'restored'
  | 'missing'
  | 'failed'
  | 'would-remove'
  | 'would-restore';

export interface UninstallDetail {
  skillId: string;
  toolId: string;
  path: string;
  status: UninstallStatus;
  reason?: string;
}

export interface UninstallReport {
  removed: number;
  restored: number;
  missing: number;
  failed: number;
  details: UninstallDetail[];
}

async function uninstallOne(
  entry: ManifestEntry,
  opts: UninstallOptions,
): Promise<UninstallDetail> {
  const base = { skillId: entry.skillId, toolId: entry.toolId, path: entry.path };

  // Re-validate the manifest path — never trust stored JSON blindly.
  try {
    assertSafeInstallPath(entry.path);
  } catch (err) {
    const reason = err instanceof UnsafePathError ? err.message : String(err);
    return { ...base, status: 'failed', reason };
  }

  try {
    if (!(await exists(entry.path))) {
      return { ...base, status: 'missing' };
    }

    if (opts.dryRun) {
      return {
        ...base,
        status: opts.restore && entry.backupPath ? 'would-restore' : 'would-remove',
      };
    }

    // Remove the installed folder (or just the symlink, if it is one).
    if (await isSymlink(entry.path)) {
      await fsp.unlink(entry.path);
    } else {
      await remove(entry.path);
    }

    // Optionally restore the pre-install backup.
    if (opts.restore && entry.backupPath && (await exists(entry.backupPath))) {
      assertSafeInstallPath(entry.backupPath);
      await copyDir(entry.backupPath, entry.path);
      return { ...base, status: 'restored' };
    }

    return { ...base, status: 'removed' };
  } catch (err) {
    return { ...base, status: 'failed', reason: err instanceof Error ? err.message : String(err) };
  }
}

export async function uninstallSkills(opts: UninstallOptions = {}): Promise<UninstallReport> {
  const manifest = await readManifest();

  let entries = manifest.entries;
  if (opts.skillId) entries = entries.filter((e) => e.skillId === opts.skillId);
  if (opts.toolId) entries = entries.filter((e) => e.toolId === opts.toolId);

  const details: UninstallDetail[] = [];
  for (const entry of entries) {
    details.push(await uninstallOne(entry, opts));
  }

  // Update the manifest — drop entries that were actually removed/restored.
  if (!opts.dryRun) {
    const cleared = new Set(
      details
        .filter((d) => d.status === 'removed' || d.status === 'restored' || d.status === 'missing')
        .map((d) => `${d.skillId}::${d.toolId}`),
    );
    manifest.entries = manifest.entries.filter(
      (e) => !cleared.has(`${e.skillId}::${e.toolId}`),
    );
    await writeManifest(manifest);
  }

  return {
    removed: details.filter((d) => d.status === 'removed').length,
    restored: details.filter((d) => d.status === 'restored').length,
    missing: details.filter((d) => d.status === 'missing').length,
    failed: details.filter((d) => d.status === 'failed').length,
    details,
  };
}
