/**
 * Founder OS — skill registry
 *
 * Reads the bundled `skills/` directory, parses each SKILL.md frontmatter,
 * and exposes a typed catalog the rest of the CLI consumes.
 */

import path from 'node:path';
import { SKILLS_DIR } from './paths.js';
import { exists, listDirs, readText } from './fs.js';

export type SkillCategory = 'strategy' | 'design' | 'growth' | 'engineering';

export interface SkillMeta {
  /** Folder name, e.g. "fix-my-ui". */
  id: string;
  /** Display name from frontmatter (falls back to id). */
  name: string;
  description: string;
  version: string;
  category: SkillCategory | 'uncategorized';
  tools: string[];
  /** Absolute path to the skill folder. */
  dir: string;
}

/** Minimal YAML frontmatter parser — flat keys, scalars + inline arrays only. */
function parseFrontmatter(md: string): Record<string, string | string[]> {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const out: Record<string, string | string[]> = {};
  for (const line of match[1]!.split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    const value = rawValue!.trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      out[key!] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      out[key!] = value.replace(/^["']|["']$/g, '');
    }
  }
  return out;
}

export async function listSkills(): Promise<SkillMeta[]> {
  const ids = await listDirs(SKILLS_DIR);
  const skills: SkillMeta[] = [];

  for (const id of ids.sort()) {
    const dir = path.join(SKILLS_DIR, id);
    const skillFile = path.join(dir, 'SKILL.md');
    if (!(await exists(skillFile))) continue;

    const fm = parseFrontmatter(await readText(skillFile));
    const asString = (v: string | string[] | undefined, fallback: string): string =>
      typeof v === 'string' ? v : fallback;
    const asArray = (v: string | string[] | undefined): string[] =>
      Array.isArray(v) ? v : v ? [v] : [];

    skills.push({
      id,
      name: asString(fm['name'], id),
      description: asString(fm['description'], 'No description provided.'),
      version: asString(fm['version'], '0.0.0'),
      category: (asString(fm['category'], 'uncategorized') as SkillMeta['category']),
      tools: asArray(fm['tools']),
      dir,
    });
  }

  return skills;
}

export async function getSkill(id: string): Promise<SkillMeta | undefined> {
  return (await listSkills()).find((s) => s.id === id);
}

/** Structural validation used by `founder-os verify`. */
const REQUIRED_SECTIONS = [
  'Purpose',
  'Use Cases',
  'Ideal User',
  'Input Requirements',
  'Operating Principles',
  'Workflow Engine',
  'Output Schema',
  'Quality Checklist',
  'Examples',
  'Anti-Patterns',
  'Advanced Mode',
  'Best Practices',
  'Integration Compatibility',
];

export interface SkillVerifyResult {
  id: string;
  ok: boolean;
  missingFrontmatter: string[];
  missingSections: string[];
}

export async function verifySkill(skill: SkillMeta): Promise<SkillVerifyResult> {
  const md = await readText(path.join(skill.dir, 'SKILL.md'));
  const fm = parseFrontmatter(md);

  const missingFrontmatter = ['name', 'description', 'version', 'category', 'tools'].filter(
    (k) => !(k in fm),
  );
  const missingSections = REQUIRED_SECTIONS.filter(
    (s) => !new RegExp(`^#{1,3}\\s+${s}\\b`, 'm').test(md),
  );

  return {
    id: skill.id,
    ok: missingFrontmatter.length === 0 && missingSections.length === 0,
    missingFrontmatter,
    missingSections,
  };
}
