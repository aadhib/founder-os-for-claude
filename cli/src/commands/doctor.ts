/**
 * `founderos doctor`
 *
 * Health check. Validates the environment, reports detected tools, summarizes
 * the install manifest, and surfaces common, fixable issues.
 */

import { detectIntegrations } from '../integrations/index.js';
import { validateEnvironment } from '../utils/env.js';
import { readManifest } from '../utils/manifest.js';
import { listSkills } from '../utils/skills.js';
import { exists } from '../utils/fs.js';
import { fullSecurityReport } from '../utils/security.js';
import { logger, color } from '../utils/logger.js';

const glyph = { ok: color.green('✓'), warn: color.yellow('!'), fail: color.red('✗') };

export interface DoctorArgs {
  security?: boolean;
}

export async function doctorCommand(args: DoctorArgs = {}): Promise<void> {
  if (args.security) {
    await securityDoctor();
    return;
  }

  logger.section('Founder OS — doctor');

  // Environment
  const env = await validateEnvironment();
  logger.raw('\n  Environment');
  for (const c of env.checks) {
    logger.raw(`    ${glyph[c.status]} ${c.name.padEnd(20)} ${color.dim(c.detail)}`);
  }

  // Tools
  const integrations = await detectIntegrations();
  logger.raw('\n  AI tools');
  for (const i of integrations) {
    const g = i.detected ? glyph.ok : glyph.warn;
    const how = i.detected ? `via ${i.detectedBy}` : 'not detected';
    logger.raw(`    ${g} ${i.name.padEnd(20)} ${color.dim(how)}`);
  }

  // Manifest / installed skills
  const manifest = await readManifest();
  const allSkills = await listSkills();
  logger.raw('\n  Installed skills');
  if (manifest.entries.length === 0) {
    logger.raw(`    ${glyph.warn} ${color.dim('nothing installed yet — run `founderos install`')}`);
  } else {
    const byTool = new Map<string, number>();
    let broken = 0;
    for (const e of manifest.entries) {
      byTool.set(e.toolId, (byTool.get(e.toolId) ?? 0) + 1);
      if (!(await exists(e.path))) broken += 1;
    }
    for (const [toolId, count] of byTool) {
      logger.raw(`    ${glyph.ok} ${toolId.padEnd(20)} ${color.dim(`${count} skill(s)`)}`);
    }
    if (broken > 0) {
      logger.raw(
        `    ${glyph.fail} ${color.dim(`${broken} manifest entr(ies) point to missing files — run \`founderos install --force\``)}`,
      );
    }
  }

  // Drift: bundled skills not installed anywhere
  const installedIds = new Set(manifest.entries.map((e) => e.skillId));
  const missing = allSkills.filter((s) => !installedIds.has(s.id));
  if (missing.length) {
    logger.raw('\n  Available but not installed');
    for (const s of missing) {
      logger.raw(`    ${glyph.warn} ${s.id.padEnd(20)} ${color.dim('founderos add ' + s.id)}`);
    }
  }

  // Verdict
  const healthy = env.ok && manifest.entries.length > 0;
  logger.raw();
  if (healthy) {
    logger.ok(color.green('Founder OS looks healthy.'));
    logger.info('Run `founderos doctor --security` for the security audit.');
  } else if (!env.ok) {
    logger.error('Environment has blocking issues — see above.');
    process.exitCode = 1;
  } else {
    logger.warn('Founder OS is installed but no skills are placed yet.');
  }
  logger.raw();
}

/** `founderos doctor --security` — the security-focused audit. */
async function securityDoctor(): Promise<void> {
  logger.section('Founder OS — security audit');

  const report = await fullSecurityReport();

  let lastArea = '';
  for (const f of report.findings) {
    if (f.area !== lastArea) {
      logger.raw(`\n  ${color.dim(f.area)}`);
      lastArea = f.area;
    }
    logger.raw(`    ${glyph[f.severity]} ${f.detail}`);
  }

  const fails = report.findings.filter((f) => f.severity === 'fail').length;
  const warns = report.findings.filter((f) => f.severity === 'warn').length;

  logger.raw();
  if (report.ok && warns === 0) {
    logger.ok(color.green('Security audit passed — no issues found.'));
  } else if (report.ok) {
    logger.warn(`Security audit passed with ${warns} warning(s) — review them above.`);
  } else {
    logger.error(`Security audit failed — ${fails} blocking issue(s).`);
    process.exitCode = 1;
  }
  logger.raw();
}
