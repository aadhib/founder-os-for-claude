/**
 * `founder-os init`
 *
 * Scaffolds Founder OS into the *current project* rather than the user's home
 * directory — useful for teams who want skills committed alongside the repo.
 * Writes a `.founderos.json` config and a project-local README pointer.
 */

import path from 'node:path';
import { detectIntegrations } from '../integrations/index.js';
import { listSkills } from '../utils/skills.js';
import { backupDir, copyDir, ensureDir, exists, isSymlink, remove, writeJson } from '../utils/fs.js';
import { projectSkillDir } from '../utils/paths.js';
import { assertSafeInstallPath, assertSafeSkillId, UnsafePathError } from '../utils/safe-paths.js';
import { renderProjectReadme, type ProjectConfig } from '../templates/index.js';
import { logger, color } from '../utils/logger.js';
import fs from 'node:fs/promises';

export interface InitArgs {
  tool?: string;
  force?: boolean;
}

export async function initCommand(args: InitArgs): Promise<void> {
  const cwd = process.cwd();
  logger.section('Founder OS — init project');

  const configPath = path.join(cwd, '.founderos.json');
  if ((await exists(configPath)) && !args.force) {
    logger.warn('.founderos.json already exists. Use --force to overwrite.');
    return;
  }

  let integrations = await detectIntegrations();
  if (args.tool) {
    const wanted = args.tool.split(',').map((t) => t.trim());
    integrations = integrations.filter((i) => wanted.includes(i.id));
  }
  // Default to claude-code if nothing detected — most common project case.
  const targets = integrations.filter((i) => i.detected);
  const effective = targets.length
    ? targets
    : integrations.filter((i) => i.id === 'claude-code');

  const skills = await listSkills();

  logger.step('Placing skills into project');
  let placed = 0;
  for (const tool of effective) {
    const dir = projectSkillDir(cwd, tool.id);
    // The project dir must be inside the current working directory — never escape it.
    try {
      assertSafeInstallPath(dir, { allowCwd: cwd });
    } catch (err) {
      logger.error(err instanceof UnsafePathError ? err.message : String(err));
      process.exitCode = 1;
      return;
    }
    await ensureDir(dir);

    for (const skill of skills) {
      assertSafeSkillId(skill.id);
      const dest = assertSafeInstallPath(path.join(dir, skill.id), { allowCwd: cwd });

      // Never follow or overwrite a symlinked skill folder.
      if ((await exists(dest)) && (await isSymlink(dest))) {
        logger.warn(`${skill.id} → destination is a symlink, skipping`);
        continue;
      }
      if (await exists(dest)) {
        if (!args.force) continue;
        const backup = await backupDir(dest);
        if (backup) logger.info(`backed up existing → ${path.relative(cwd, backup)}`);
        await remove(dest);
      }
      placed += await copyDir(skill.dir, dest);
    }
    logger.ok(`${tool.id} → ${path.relative(cwd, dir)}`);
  }

  const config: ProjectConfig = {
    version: 1,
    tools: effective.map((t) => t.id),
    skills: skills.map((s) => s.id),
    createdAt: new Date().toISOString(),
  };
  await writeJson(configPath, config);
  logger.ok('.founderos.json written');

  const readmePath = path.join(cwd, 'FOUNDER_OS.md');
  if (!(await exists(readmePath)) || args.force) {
    await fs.writeFile(readmePath, renderProjectReadme(config), 'utf8');
    logger.ok('FOUNDER_OS.md written');
  }

  logger.outro(
    `Project initialized with ${skills.length} skills. Commit ${color.purple('.founderos.json')} to share with your team.`,
  );
}
