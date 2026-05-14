/**
 * `founder-os examples`
 *
 * Lists the bundled example library and prints how to open each one. Examples
 * are real outputs checked into the repo under examples/.
 */

import path from 'node:path';
import { PACKAGE_ROOT } from '../utils/paths.js';
import { listDirs, exists, readText } from '../utils/fs.js';
import { logger, color } from '../utils/logger.js';

const EXAMPLES_DIR = path.resolve(PACKAGE_ROOT, '..', 'examples');

export async function examplesCommand(skillId?: string): Promise<void> {
  logger.section('Founder OS — example library');

  if (!(await exists(EXAMPLES_DIR))) {
    logger.warn('No examples directory found in this install.');
    return;
  }

  const dirs = await listDirs(EXAMPLES_DIR);
  const filtered = skillId ? dirs.filter((d) => d === skillId) : dirs;

  if (filtered.length === 0) {
    logger.warn(skillId ? `No examples for "${skillId}".` : 'No examples found.');
    return;
  }

  logger.raw();
  for (const dir of filtered.sort()) {
    const readmePath = path.join(EXAMPLES_DIR, dir, 'README.md');
    let summary = '';
    if (await exists(readmePath)) {
      const text = await readText(readmePath);
      const firstLine = text.split('\n').find((l) => l.trim() && !l.startsWith('#'));
      summary = firstLine?.trim() ?? '';
    }
    logger.raw(`  ${color.purple(dir)}`);
    if (summary) logger.raw(`     ${color.dim(summary)}`);
    logger.raw(`     ${color.dim('open: ' + path.join('examples', dir))}`);
    logger.raw();
  }

  logger.info('Browse on GitHub: https://github.com/aadhib/founder-os-for-claude/tree/main/examples');
  logger.raw();
}
