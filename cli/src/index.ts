#!/usr/bin/env node
/**
 * Founder OS — CLI entry point
 *
 * The AI operating system for founders. Wires every command into Commander
 * and keeps top-level error handling in one place.
 */

import { Command } from 'commander';
import { installCommand } from './commands/install.js';
import { uninstallCommand } from './commands/uninstall.js';
import { doctorCommand } from './commands/doctor.js';
import { listCommand } from './commands/list.js';
import { updateCommand } from './commands/update.js';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { removeCommand } from './commands/remove.js';
import { verifyCommand } from './commands/verify.js';
import { examplesCommand } from './commands/examples.js';
import { integrationsCommand } from './commands/integrations.js';
import { logger } from './utils/logger.js';

const VERSION = '1.0.0';

const program = new Command();

program
  .name('founderos')
  .description('The AI operating system for founders, CTOs, and product builders.')
  .version(VERSION, '-v, --version', 'print the Founder OS version');

program
  .command('install')
  .description('install Founder OS skills into your AI tools')
  .option('-y, --yes', 'non-interactive — install everything')
  .option('--from-bootstrap', 'invoked by the install scripts (implies --yes)')
  .option('-f, --force', 'overwrite skills that are already installed (backs them up first)')
  .option('--only <skills>', 'comma-separated list of skill ids to install')
  .option('--dry-run', 'show exactly what would change — write nothing')
  .option('--verbose', 'print every path decision')
  .action(installCommand);

program
  .command('uninstall')
  .description('cleanly remove installed skills (never requires elevation)')
  .option('-s, --skill <skill>', 'only uninstall this skill')
  .option('-t, --tool <tool>', 'only uninstall from this tool')
  .option('--dry-run', 'show what would be removed — delete nothing')
  .option('--restore', 'restore the pre-install backup after removing each skill')
  .action(uninstallCommand);

program
  .command('doctor')
  .description('check environment health and the install manifest')
  .option('--security', 'run the security audit instead of the health check')
  .action(doctorCommand);

program
  .command('list')
  .description('list all skills and their install status')
  .option('--json', 'output machine-readable JSON')
  .action(listCommand);

program
  .command('update')
  .description('re-sync installed skills with the latest bundled catalog')
  .action(updateCommand);

program
  .command('init')
  .description('scaffold Founder OS into the current project')
  .option('-t, --tool <tools>', 'comma-separated tool ids (defaults to detected)')
  .option('-f, --force', 'overwrite existing project config and skills')
  .action(initCommand);

program
  .command('add')
  .argument('<skill>', 'skill id to install')
  .description('install a single skill')
  .option('-t, --tool <tools>', 'comma-separated tool ids (defaults to all detected)')
  .option('-f, --force', 'overwrite if already installed (backs it up first)')
  .option('--dry-run', 'show what would change — write nothing')
  .option('--verbose', 'print every path decision')
  .action(addCommand);

program
  .command('remove')
  .argument('<skill>', 'skill id to remove')
  .description('remove a single skill')
  .option('-t, --tool <tools>', 'comma-separated tool ids (defaults to all)')
  .action(removeCommand);

program
  .command('verify')
  .description('validate the skill catalog against the structural contract')
  .option('--security', 'also run the catalog security audit')
  .action(verifyCommand);

program
  .command('examples')
  .argument('[skill]', 'optional skill id to filter examples')
  .description('browse the bundled example library')
  .action(examplesCommand);

program
  .command('integrations')
  .description('show supported AI tools and detection status')
  .action(integrationsCommand);

async function main(): Promise<void> {
  try {
    await program.parseAsync(process.argv);
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

void main();
