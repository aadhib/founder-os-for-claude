/**
 * Founder OS — AI tool integrations
 *
 * Detects which AI coding tools are present on the machine and how Founder OS
 * should hook into each one. Detection is deliberately layered: a tool counts
 * as "detected" if its binary is on PATH OR its config directory exists.
 */

import os from 'node:os';
import path from 'node:path';
import { execa } from 'execa';
import { exists } from '../utils/fs.js';
import { toolSkillDir } from '../utils/paths.js';

export interface Integration {
  /** Stable id used in flags and the manifest. */
  id: string;
  /** Display name. */
  name: string;
  /** Whether the tool appears to be installed. */
  detected: boolean;
  /** How it was detected — useful for `doctor` output. */
  detectedBy: 'binary' | 'config-dir' | 'none';
  /** Absolute path where skills are placed for this tool. */
  skillDir: string;
  /** One-line note shown in `integrations` output. */
  note: string;
}

interface IntegrationSpec {
  id: string;
  name: string;
  binaries: string[];
  configDirs: string[];
  note: string;
}

const SPECS: IntegrationSpec[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    binaries: ['claude'],
    configDirs: ['.claude'],
    note: 'Skills load from ~/.claude/skills and trigger with /skill-name.',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    binaries: ['cursor'],
    configDirs: ['.cursor'],
    note: 'Skills are placed as Cursor rules under ~/.cursor/skills.',
  },
  {
    id: 'codex',
    name: 'Codex CLI',
    binaries: ['codex'],
    configDirs: ['.codex'],
    note: 'Skills are placed under ~/.codex/skills and referenced in prompts.',
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    binaries: ['gemini'],
    configDirs: ['.gemini'],
    note: 'Best-effort: skills placed under ~/.gemini/skills as context files.',
  },
];

async function onPath(bin: string): Promise<boolean> {
  // `bin` comes only from the hardcoded SPECS below — never user input.
  const cmd = process.platform === 'win32' ? `where ${bin}` : `command -v ${bin}`;
  try {
    await execa(cmd, { shell: true });
    return true;
  } catch {
    return false;
  }
}

async function detectOne(spec: IntegrationSpec): Promise<Integration> {
  const home = os.homedir();

  for (const bin of spec.binaries) {
    if (await onPath(bin)) {
      return {
        id: spec.id,
        name: spec.name,
        detected: true,
        detectedBy: 'binary',
        skillDir: toolSkillDir(spec.id),
        note: spec.note,
      };
    }
  }

  for (const dir of spec.configDirs) {
    if (await exists(path.join(home, dir))) {
      return {
        id: spec.id,
        name: spec.name,
        detected: true,
        detectedBy: 'config-dir',
        skillDir: toolSkillDir(spec.id),
        note: spec.note,
      };
    }
  }

  return {
    id: spec.id,
    name: spec.name,
    detected: false,
    detectedBy: 'none',
    skillDir: toolSkillDir(spec.id),
    note: spec.note,
  };
}

export async function detectIntegrations(): Promise<Integration[]> {
  return Promise.all(SPECS.map(detectOne));
}

export async function getIntegration(id: string): Promise<Integration | undefined> {
  return (await detectIntegrations()).find((i) => i.id === id);
}

export const SUPPORTED_TOOL_IDS = SPECS.map((s) => s.id);
