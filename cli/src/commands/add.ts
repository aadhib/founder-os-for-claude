/**
 * `founder-os add <skill>`
 *
 * Installs a single skill across all detected tools (or a subset via --tool).
 * Supports --dry-run and --verbose; --force creates a backup before overwriting.
 */

import { detectIntegrations } from '../integrations/index.js';
import { installSkill, type InstallOptions } from '../installers/index.js';
import { getSkill } from '../utils/skills.js';
import { logger, color } from '../utils/logger.js';

export interface AddArgs {
  tool?: string;
  force?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
}

export async function addCommand(skillId: string, args: AddArgs): Promise<void> {
  const skill = await getSkill(skillId);
  if (!skill) {
    logger.error(`Unknown skill: ${skillId}`);
    logger.info('Run `founder-os list` to see available skills.');
    process.exitCode = 1;
    return;
  }

  let integrations = await detectIntegrations();
  if (args.tool) {
    const wanted = args.tool.split(',').map((t) => t.trim());
    integrations = integrations.filter((i) => wanted.includes(i.id));
    if (integrations.length === 0) {
      logger.error(`No matching tools for: ${args.tool}`);
      process.exitCode = 1;
      return;
    }
  }

  logger.step(
    `${args.dryRun ? 'Planning' : 'Installing'} ${color.purple(skill.id)} (v${skill.version})`,
  );

  const opts: InstallOptions = {
    force: args.force ?? false,
    dryRun: args.dryRun ?? false,
    verbose: args.verbose ?? false,
  };
  const report = await installSkill(skillId, integrations, opts);

  for (const d of report.details) {
    switch (d.status) {
      case 'placed':
        logger.ok(`${d.toolId} → ${d.path}`);
        if (d.backupPath) logger.info(`backed up existing → ${d.backupPath}`);
        break;
      case 'skipped':
        logger.warn(`${d.toolId} → already installed (use --force)`);
        break;
      case 'would-place':
        logger.raw(`  ${color.green('+ place    ')} ${d.toolId} → ${color.dim(d.path)}`);
        break;
      case 'would-overwrite':
        logger.raw(`  ${color.yellow('~ overwrite')} ${d.toolId} → ${color.dim(d.path)}`);
        break;
      case 'would-skip':
        logger.raw(`  ${color.dim('· skip     ')} ${d.toolId} → ${color.dim(d.path)}`);
        break;
      default:
        logger.error(`${d.toolId} → ${d.reason}`);
    }
  }

  if (args.dryRun) {
    logger.info('Dry run — nothing was written.');
    return;
  }
  if (report.placed > 0) {
    logger.outro(`${skill.id} installed. Trigger it with /${skill.id} in your tool.`);
  }
  if (report.failed > 0) process.exitCode = 1;
}
