/**
 * `founder-os remove <skill>`
 *
 * Removes a skill folder from every tool it was installed into (or a subset
 * via --tool) and updates the manifest.
 */

import path from 'node:path';
import fsp from 'node:fs/promises';
import { readManifest, recordRemoval } from '../utils/manifest.js';
import { remove, exists, isSymlink } from '../utils/fs.js';
import { toolSkillDir } from '../utils/paths.js';
import { assertSafeInstallPath, UnsafePathError } from '../utils/safe-paths.js';
import { logger, color } from '../utils/logger.js';

export interface RemoveArgs {
  tool?: string;
}

export async function removeCommand(skillId: string, args: RemoveArgs): Promise<void> {
  const manifest = await readManifest();
  let entries = manifest.entries.filter((e) => e.skillId === skillId);

  if (args.tool) {
    const wanted = args.tool.split(',').map((t) => t.trim());
    entries = entries.filter((e) => wanted.includes(e.toolId));
  }

  if (entries.length === 0) {
    logger.warn(`${skillId} is not installed${args.tool ? ` for ${args.tool}` : ''}.`);
    // Best-effort cleanup in case the manifest drifted.
    return;
  }

  logger.step(`Removing ${color.purple(skillId)}`);
  for (const entry of entries) {
    const target = entry.path || path.join(toolSkillDir(entry.toolId), skillId);

    // Re-validate the path before deleting — never trust the manifest blindly.
    try {
      assertSafeInstallPath(target);
    } catch (err) {
      logger.error(`${entry.toolId} → ${err instanceof UnsafePathError ? err.reason : String(err)}`);
      process.exitCode = 1;
      continue;
    }

    if (!(await exists(target))) {
      logger.warn(`${entry.toolId} → already gone`);
      continue;
    }
    // A symlinked skill folder: remove only the link, never its target.
    if (await isSymlink(target)) {
      await fsp.unlink(target);
      logger.ok(`${entry.toolId} → removed (symlink unlinked, target untouched)`);
      continue;
    }
    await remove(target);
    logger.ok(`${entry.toolId} → removed`);
  }

  const removed = await recordRemoval(skillId, args.tool ? args.tool : undefined);
  logger.outro(`${skillId} removed (${removed} manifest entr(ies) cleared).`);
}
