/**
 * `founderos uninstall`
 *
 * Cleanly removes skills the CLI installed. Never requires elevation, never
 * touches anything outside the manifest, re-validates every path before
 * deleting, and supports `--dry-run` and `--restore`.
 */

import { uninstallSkills, type UninstallOptions } from '../installers/uninstall.js';
import { readManifest } from '../utils/manifest.js';
import { logger, color } from '../utils/logger.js';

export interface UninstallArgs {
  skill?: string;
  tool?: string;
  dryRun?: boolean;
  restore?: boolean;
}

export async function uninstallCommand(args: UninstallArgs): Promise<void> {
  logger.section(args.dryRun ? 'Uninstall — dry run' : 'Uninstalling Founder OS skills');

  const manifest = await readManifest();
  if (manifest.entries.length === 0) {
    logger.warn('Nothing to uninstall — the manifest is empty.');
    return;
  }

  const opts: UninstallOptions = {
    dryRun: args.dryRun ?? false,
    restore: args.restore ?? false,
    ...(args.skill ? { skillId: args.skill } : {}),
    ...(args.tool ? { toolId: args.tool } : {}),
  };

  const report = await uninstallSkills(opts);

  if (report.details.length === 0) {
    logger.warn('No manifest entries matched the given filters.');
    return;
  }

  for (const d of report.details) {
    const label =
      d.status === 'removed'
        ? color.green('removed   ')
        : d.status === 'restored'
          ? color.green('restored  ')
          : d.status === 'missing'
            ? color.dim('not found ')
            : d.status === 'would-remove'
              ? color.yellow('would rm  ')
              : d.status === 'would-restore'
                ? color.yellow('would rstr')
                : color.red('failed    ');
    logger.raw(`  ${label} ${d.skillId.padEnd(22)} ${color.dim(d.toolId)}`);
    if (d.reason) logger.raw(`             ${color.dim(d.reason)}`);
  }

  logger.raw();
  if (args.dryRun) {
    logger.info('Nothing was deleted. Re-run without --dry-run to apply.');
  } else {
    logger.table([
      ['Removed', String(report.removed)],
      ['Restored', String(report.restored)],
      ['Already gone', String(report.missing)],
      ['Failed', String(report.failed)],
    ]);
    if (!args.restore) {
      logger.info('Pre-install backups (if any) were left in place — remove them manually if not needed.');
    }
  }
  logger.raw();

  if (report.failed > 0) process.exitCode = 1;
}
