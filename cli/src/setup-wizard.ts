/**
 * Founder OS — interactive setup wizard
 *
 * Runs when `founderos install` is invoked without `--yes` / `--from-bootstrap`.
 * Walks the user through tool selection and skill selection, then delegates to
 * the same installer the bootstrap pipeline uses.
 */

import inquirer from 'inquirer';
import { detectIntegrations, type Integration } from './integrations/index.js';
import { installAllSkills } from './installers/index.js';
import { listSkills, type SkillMeta } from './utils/skills.js';
import { logger } from './utils/logger.js';

export interface WizardResult {
  tools: string[];
  skills: string[];
  installed: number;
}

export async function runSetupWizard(): Promise<WizardResult> {
  logger.banner();
  logger.intro(
    "Let's get Founder OS wired into your workflow. A few quick questions —",
    'you can change everything later with `founderos add` / `remove`.',
  );

  // ── 1. tools ────────────────────────────────────────────────────────────
  const integrations = await detectIntegrations();
  const detected = integrations.filter((i) => i.detected);

  if (detected.length) {
    logger.ok(`Detected: ${detected.map((i) => i.name).join(', ')}`);
  } else {
    logger.warn('No AI tools auto-detected — pick the ones you use.');
  }

  const { tools } = await inquirer.prompt<{ tools: string[] }>([
    {
      type: 'checkbox',
      name: 'tools',
      message: 'Install Founder OS skills for which tools?',
      choices: integrations.map((i: Integration) => ({
        name: `${i.name}${i.detected ? '  (detected)' : ''}`,
        value: i.id,
        checked: i.detected,
      })),
      validate: (a: readonly unknown[]) => (a.length ? true : 'Select at least one tool.'),
    },
  ]);

  // ── 2. skills ───────────────────────────────────────────────────────────
  const allSkills = await listSkills();
  const { mode } = await inquirer.prompt<{ mode: 'all' | 'choose' }>([
    {
      type: 'list',
      name: 'mode',
      message: 'Which skills do you want?',
      choices: [
        { name: `Everything — all ${allSkills.length} skills (recommended)`, value: 'all' },
        { name: 'Let me choose', value: 'choose' },
      ],
    },
  ]);

  let skills: string[];
  if (mode === 'all') {
    skills = allSkills.map((s) => s.id);
  } else {
    const answer = await inquirer.prompt<{ skills: string[] }>([
      {
        type: 'checkbox',
        name: 'skills',
        message: 'Select skills:',
        choices: allSkills.map((s: SkillMeta) => ({
          name: `${s.id.padEnd(22)} ${s.description}`,
          value: s.id,
          checked: true,
        })),
        validate: (a: readonly unknown[]) => (a.length ? true : 'Select at least one skill.'),
      },
    ]);
    skills = answer.skills;
  }

  // ── 3. confirm + install ────────────────────────────────────────────────
  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Install ${skills.length} skill(s) for ${tools.length} tool(s)?`,
      default: true,
    },
  ]);

  if (!confirm) {
    logger.warn('Cancelled. Nothing was written.');
    return { tools, skills, installed: 0 };
  }

  const targets = integrations.filter((i) => tools.includes(i.id));
  const report = await installAllSkills(targets, { force: false, only: skills });

  logger.section('Setup complete');
  logger.list([
    `Tools:  ${tools.join(', ')}`,
    `Skills: ${report.placed} installed, ${report.skipped} already present`,
  ]);
  logger.outro('Run `founderos doctor` to verify, then try `/founder-mode` in your tool.');

  return { tools, skills, installed: report.placed };
}
