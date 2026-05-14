/**
 * `founderos list`
 *
 * Shows the full skill catalog with install status per skill.
 */

import { listSkills } from '../utils/skills.js';
import { readManifest } from '../utils/manifest.js';
import { logger, color } from '../utils/logger.js';

const CATEGORY_GLYPH: Record<string, string> = {
  strategy: '🧭',
  design: '🎨',
  growth: '🚀',
  engineering: '🛡️',
  uncategorized: '•',
};

export async function listCommand(opts: { json?: boolean } = {}): Promise<void> {
  const skills = await listSkills();
  const manifest = await readManifest();
  const installedIds = new Set(manifest.entries.map((e) => e.skillId));

  if (opts.json) {
    logger.raw(
      JSON.stringify(
        skills.map((s) => ({ ...s, installed: installedIds.has(s.id) })),
        null,
        2,
      ),
    );
    return;
  }

  logger.section(`Founder OS — ${skills.length} skills`);
  logger.raw();

  for (const s of skills) {
    const installed = installedIds.has(s.id);
    const status = installed ? color.green('● installed') : color.dim('○ available');
    const glyph = CATEGORY_GLYPH[s.category] ?? '•';
    logger.raw(`  ${glyph}  ${color.purple(s.id.padEnd(22))} ${status}  ${color.dim('v' + s.version)}`);
    logger.raw(`     ${color.dim(s.description)}`);
    logger.raw();
  }

  logger.info('Add a skill:    founderos add <skill>');
  logger.info('Remove a skill: founderos remove <skill>');
  logger.raw();
}
