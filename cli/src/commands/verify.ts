/**
 * `founder-os verify`
 *
 * Validates every bundled skill against the structural contract (required
 * frontmatter keys + required SKILL.md sections). With `--security`, also runs
 * the catalog security audit (no executable content, no symlinks, plain text
 * only). Used in CI to keep the catalog consistent and safe. Exits non-zero on
 * any failure.
 */

import { listSkills, verifySkill } from '../utils/skills.js';
import { auditSkillCatalog } from '../utils/security.js';
import { logger, color } from '../utils/logger.js';

export interface VerifyArgs {
  security?: boolean;
}

export async function verifyCommand(args: VerifyArgs = {}): Promise<void> {
  logger.section('Founder OS — verify skill catalog');

  const skills = await listSkills();
  if (skills.length === 0) {
    logger.error('No skills found in the bundled catalog.');
    process.exitCode = 1;
    return;
  }

  let failures = 0;

  for (const skill of skills) {
    const result = await verifySkill(skill);
    if (result.ok) {
      logger.ok(`${skill.id.padEnd(24)} ${color.dim('v' + skill.version)}`);
    } else {
      failures += 1;
      logger.error(skill.id);
      if (result.missingFrontmatter.length) {
        logger.raw(`     ${color.dim('missing frontmatter:')} ${result.missingFrontmatter.join(', ')}`);
      }
      if (result.missingSections.length) {
        logger.raw(`     ${color.dim('missing sections:')} ${result.missingSections.join(', ')}`);
      }
    }
  }

  logger.raw();
  if (failures === 0) {
    logger.ok(color.green(`All ${skills.length} skills pass the structural contract.`));
  } else {
    logger.error(`${failures} of ${skills.length} skills failed verification.`);
    process.exitCode = 1;
  }

  if (args.security) {
    logger.section('Security audit — bundled catalog');
    const audit = await auditSkillCatalog();
    const glyph = { ok: color.green('✓'), warn: color.yellow('!'), fail: color.red('✗') };
    for (const f of audit.findings) {
      if (f.severity === 'ok') continue; // keep the summary tight — only show issues
      logger.raw(`  ${glyph[f.severity]} ${f.area.padEnd(28)} ${color.dim(f.detail)}`);
    }
    const fails = audit.findings.filter((f) => f.severity === 'fail').length;
    if (audit.ok) {
      logger.ok(color.green('Catalog security audit passed — plain documentation only.'));
    } else {
      logger.error(`Catalog security audit failed — ${fails} blocking issue(s).`);
      process.exitCode = 1;
    }
    logger.raw();
  }
}
