/**
 * `founder-os update`
 *
 * Re-syncs installed skills with the bundled catalog. Compares manifest
 * versions against the catalog and re-places anything that's out of date or
 * missing on disk.
 */

import path from 'node:path';
import { detectIntegrations } from '../integrations/index.js';
import { installSkill } from '../installers/index.js';
import { listSkills } from '../utils/skills.js';
import { readManifest } from '../utils/manifest.js';
import { exists } from '../utils/fs.js';
import { toolSkillDir } from '../utils/paths.js';
import { logger, color } from '../utils/logger.js';

export async function updateCommand(): Promise<void> {
  logger.section('Founder OS — update');

  const [catalog, manifest, integrations] = await Promise.all([
    listSkills(),
    readManifest(),
    detectIntegrations(),
  ]);

  if (manifest.entries.length === 0) {
    logger.warn('Nothing installed yet. Run `founder-os install` first.');
    return;
  }

  const catalogById = new Map(catalog.map((s) => [s.id, s]));
  const toUpdate = new Set<string>();

  for (const entry of manifest.entries) {
    const latest = catalogById.get(entry.skillId);
    if (!latest) continue;

    const target = entry.path || path.join(toolSkillDir(entry.toolId), entry.skillId);
    const onDisk = await exists(target);

    if (!onDisk) {
      logger.warn(`${entry.skillId} (${entry.toolId}) — missing on disk, will reinstall`);
      toUpdate.add(entry.skillId);
    } else if (latest.version !== entry.version) {
      logger.step(`${entry.skillId} ${color.dim(entry.version)} → ${color.purple(latest.version)}`);
      toUpdate.add(entry.skillId);
    }
  }

  if (toUpdate.size === 0) {
    logger.ok('Everything is up to date.');
    return;
  }

  for (const skillId of toUpdate) {
    await installSkill(skillId, integrations, { force: true });
  }

  logger.outro(`Updated ${toUpdate.size} skill(s).`);
}
