/**
 * Founder OS — bootstrap pipeline
 *
 * The programmatic install pipeline, shared by `founderos install
 * --from-bootstrap` and the standalone `install/bootstrap.ts` entrypoint.
 * Keeps "what order do things happen in" in exactly one place.
 *
 * Pipeline: validate environment → detect tools → place skills → summarize.
 */

import { detectIntegrations, type Integration } from './integrations/index.js';
import { installAllSkills, type InstallReport } from './installers/index.js';
import { validateEnvironment, type EnvReport } from './utils/env.js';
import { logger } from './utils/logger.js';

export interface BootstrapOptions {
  /** Skip interactive prompts — used by curl|bash and CI. */
  nonInteractive?: boolean;
  /** Only install for these tool ids (defaults to all detected). */
  only?: string[];
  /** Overwrite skills that already exist. */
  force?: boolean;
}

export interface BootstrapResult {
  env: EnvReport;
  integrations: Integration[];
  install: InstallReport;
  ok: boolean;
}

const emptyReport = (): InstallReport => ({
  placed: 0,
  skipped: 0,
  failed: 0,
  targets: 0,
  details: [],
});

export async function bootstrap(opts: BootstrapOptions = {}): Promise<BootstrapResult> {
  logger.section('Founder OS bootstrap');

  // 1. environment
  logger.step('Validating environment');
  const env = await validateEnvironment();
  if (!env.ok) {
    for (const c of env.checks.filter((c) => c.status === 'fail')) {
      logger.error(`${c.name}: ${c.detail}`);
    }
    logger.error('Environment validation failed. Resolve the issues above and re-run.');
    return { env, integrations: [], install: emptyReport(), ok: false };
  }
  logger.ok('Environment healthy');

  // 2. detect tools
  logger.step('Detecting AI tools');
  let integrations = await detectIntegrations();
  if (opts.only?.length) {
    // `only` here scopes tools when used by the standalone entrypoint.
    const wanted = new Set(opts.only);
    const toolMatches = integrations.filter((i) => wanted.has(i.id));
    if (toolMatches.length) integrations = toolMatches;
  }
  const present = integrations.filter((i) => i.detected);
  if (present.length === 0) {
    logger.warn('No AI tools detected on PATH. Skills will be placed in default locations.');
  } else {
    logger.ok(`Detected: ${present.map((i) => i.name).join(', ')}`);
  }

  // 3. place skills
  logger.step('Installing skills');
  const install = await installAllSkills(integrations, { force: opts.force ?? false });
  logger.ok(`Installed ${install.placed} skill file(s) across ${install.targets} target(s)`);

  // 4. summary
  logger.section('Bootstrap complete');
  logger.list([
    `Skills installed: ${install.placed}`,
    `Targets written:  ${install.targets}`,
    `Skipped (exists): ${install.skipped}`,
  ]);

  return { env, integrations, install, ok: install.failed === 0 };
}
