/**
 * `founder-os install`
 *
 * Modes:
 *   --from-bootstrap / --yes  → non-interactive, install everything everywhere
 *   --dry-run                 → show the full plan, write nothing
 *   (default)                 → interactive setup wizard
 */

import { detectIntegrations } from '../integrations/index.js';
import { installAllSkills, type InstallOptions } from '../installers/index.js';
import { validateEnvironment } from '../utils/env.js';
import { runSetupWizard } from '../setup-wizard.js';
import { toolSkillDir } from '../utils/paths.js';
import { logger, color } from '../utils/logger.js';

export interface InstallArgs {
  yes?: boolean;
  fromBootstrap?: boolean;
  force?: boolean;
  only?: string;
  dryRun?: boolean;
  verbose?: boolean;
}

export async function installCommand(args: InstallArgs): Promise<void> {
  const nonInteractive = args.yes || args.fromBootstrap || args.dryRun;

  if (!nonInteractive) {
    await runSetupWizard();
    return;
  }

  logger.banner();
  logger.section(args.dryRun ? 'Install — dry run (no files will be written)' : 'Installing Founder OS');

  logger.step('Validating environment');
  const env = await validateEnvironment();
  if (!env.ok) {
    for (const c of env.checks.filter((c) => c.status === 'fail')) {
      logger.error(`${c.name}: ${c.detail}`);
    }
    logger.error('Environment validation failed. Resolve the issues above and re-run.');
    process.exitCode = 1;
    return;
  }
  logger.ok('Environment healthy');

  logger.step('Detecting AI tools');
  const integrations = await detectIntegrations();
  const detected = integrations.filter((i) => i.detected);
  if (detected.length) {
    logger.ok(`Detected: ${detected.map((i) => i.name).join(', ')}`);
  } else {
    logger.warn('No AI tools detected — installing to default locations.');
  }

  logger.step(args.dryRun ? 'Planning skill placement' : 'Placing skills');
  const only = args.only?.split(',').map((s) => s.trim()).filter(Boolean);
  const installOpts: InstallOptions = {
    force: args.force ?? false,
    dryRun: args.dryRun ?? false,
    verbose: args.verbose ?? false,
    ...(only ? { only } : {}),
  };
  const report = await installAllSkills(integrations, installOpts);

  if (args.dryRun) {
    logger.section('Dry run — planned changes');
    for (const d of report.details) {
      const label =
        d.status === 'would-place'
          ? color.green('+ place    ')
          : d.status === 'would-overwrite'
            ? color.yellow('~ overwrite')
            : d.status === 'would-skip'
              ? color.dim('· skip     ')
              : color.red('x ' + d.status);
      logger.raw(`  ${label} ${d.skillId.padEnd(22)} ${color.dim(d.path)}`);
      if (d.reason) logger.raw(`             ${color.dim(d.reason)}`);
    }
    logger.raw();
    logger.info('Nothing was written. Re-run without --dry-run to apply.');
    logger.raw();
    if (report.failed > 0) process.exitCode = 1;
    return;
  }

  logger.section('Install complete');
  logger.table([
    ['Skills placed', String(report.placed)],
    ['Already present', String(report.skipped)],
    ['Failed', String(report.failed)],
    ['Tool targets', String(report.targets)],
  ]);

  // Show exactly where files landed.
  const placedByTool = new Map<string, string>();
  for (const d of report.details) {
    if (d.status === 'placed') placedByTool.set(d.toolId, toolSkillDir(d.toolId));
  }
  if (placedByTool.size) {
    logger.raw('\n  Installed to:');
    for (const [toolId, dir] of placedByTool) {
      logger.raw(`  ${color.purple('•')} ${toolId.padEnd(16)} ${color.dim(dir)}`);
    }
  }
  const backups = report.details.filter((d) => d.backupPath);
  if (backups.length) {
    logger.raw('\n  Backups created (originals preserved):');
    for (const d of backups) logger.raw(`  ${color.purple('•')} ${color.dim(d.backupPath!)}`);
  }

  if (report.failed > 0) process.exitCode = 1;

  logger.raw('\n  Next steps:');
  logger.list([
    'founder-os doctor            — verify your setup',
    'founder-os doctor --security — run the security audit',
    'founder-os list              — see installed skills',
    'founder-os examples          — browse real outputs',
    'founder-os uninstall         — cleanly remove everything',
  ]);
  logger.raw();
}
