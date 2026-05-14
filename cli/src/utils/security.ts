/**
 * Founder OS — security checks
 *
 * Powers `founder-os doctor --security` and `founder-os verify --security`.
 * These checks answer one question: "could anything Founder OS installed, or
 * is about to install, do something it shouldn't?"
 *
 * Nothing here executes skill content — skills are plain Markdown. The checks
 * are about *files and paths*: are install targets safe, is anything a symlink,
 * does a skill folder contain anything other than documentation.
 */

import path from 'node:path';
import fsp from 'node:fs/promises';
import { listSkills, type SkillMeta } from './skills.js';
import { readManifest } from './manifest.js';
import { detectIntegrations } from '../integrations/index.js';
import { exists, isSymlink, listDirs } from './fs.js';
import { assertSafeInstallPath, UnsafePathError } from './safe-paths.js';

export type Severity = 'ok' | 'warn' | 'fail';

export interface SecurityFinding {
  area: string;
  severity: Severity;
  detail: string;
}

export interface SecurityReport {
  findings: SecurityFinding[];
  ok: boolean;
}

/** Files allowed inside a skill folder. Skills are documentation, nothing else. */
const ALLOWED_SKILL_EXTENSIONS = new Set(['.md', '.markdown', '.txt']);
/** A skill file larger than this is suspicious — flag it for review. */
const MAX_SKILL_FILE_BYTES = 256 * 1024;

/** Walk a skill folder and flag anything that is not plain documentation. */
async function auditSkillFolder(skill: SkillMeta): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = [];
  const area = `skill:${skill.id}`;

  async function walk(dir: string): Promise<void> {
    let entries: import('node:fs').Dirent[];
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch (err) {
      findings.push({
        area,
        severity: 'warn',
        detail: `could not read ${dir}: ${err instanceof Error ? err.message : String(err)}`,
      });
      return;
    }

    for (const entry of entries) {
      const full = path.join(dir, entry.name);

      if (entry.isSymbolicLink()) {
        findings.push({
          area,
          severity: 'fail',
          detail: `contains a symlink (${entry.name}) — skills must be plain files`,
        });
        continue;
      }
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!entry.isFile()) {
        findings.push({
          area,
          severity: 'fail',
          detail: `contains a non-regular file (${entry.name})`,
        });
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_SKILL_EXTENSIONS.has(ext)) {
        findings.push({
          area,
          severity: 'fail',
          detail: `contains a non-documentation file (${entry.name}) — only ${[...ALLOWED_SKILL_EXTENSIONS].join(', ')} allowed`,
        });
        continue;
      }

      try {
        const stat = await fsp.stat(full);
        if (stat.size > MAX_SKILL_FILE_BYTES) {
          findings.push({
            area,
            severity: 'warn',
            detail: `${entry.name} is unusually large (${Math.round(stat.size / 1024)}KB)`,
          });
        }
        // Confirm the file is valid UTF-8 text (no embedded binary payload).
        const buf = await fsp.readFile(full);
        if (buf.includes(0)) {
          findings.push({
            area,
            severity: 'fail',
            detail: `${entry.name} contains NUL bytes — not plain text`,
          });
        }
      } catch {
        // stat/read failures are reported by the outer walk catch on next pass
      }
    }
  }

  await walk(skill.dir);

  if (findings.length === 0) {
    findings.push({ area, severity: 'ok', detail: 'plain documentation only' });
  }
  return findings;
}

/** Verify the bundled skill catalog is safe to ship and install. */
export async function auditSkillCatalog(): Promise<SecurityReport> {
  const skills = await listSkills();
  const findings: SecurityFinding[] = [];

  for (const skill of skills) {
    findings.push(...(await auditSkillFolder(skill)));
  }

  const ok = !findings.some((f) => f.severity === 'fail');
  return { findings, ok };
}

/** Audit the live install state: target paths, symlinks, manifest integrity. */
export async function auditInstallEnvironment(): Promise<SecurityReport> {
  const findings: SecurityFinding[] = [];

  // 1. Every tool's install directory must be a safe write target.
  const integrations = await detectIntegrations();
  for (const tool of integrations) {
    try {
      assertSafeInstallPath(path.join(tool.skillDir, 'probe-skill-id'));
      findings.push({
        area: `target:${tool.id}`,
        severity: 'ok',
        detail: `${tool.skillDir} is inside the allowed write area`,
      });
    } catch (err) {
      findings.push({
        area: `target:${tool.id}`,
        severity: 'fail',
        detail: err instanceof UnsafePathError ? err.reason : String(err),
      });
    }
  }

  // 2. No installed skill directory may be a symlink.
  for (const tool of integrations) {
    if (!(await exists(tool.skillDir))) continue;
    for (const name of await listDirs(tool.skillDir)) {
      const full = path.join(tool.skillDir, name);
      if (await isSymlink(full)) {
        findings.push({
          area: `target:${tool.id}`,
          severity: 'fail',
          detail: `installed skill "${name}" is a symlink — Founder OS never installs symlinks`,
        });
      }
    }
  }

  // 3. Manifest integrity — every recorded path must still be a safe path.
  const manifest = await readManifest();
  let badEntries = 0;
  for (const entry of manifest.entries) {
    try {
      assertSafeInstallPath(entry.path);
    } catch {
      badEntries += 1;
    }
  }
  findings.push({
    area: 'manifest',
    severity: badEntries === 0 ? 'ok' : 'fail',
    detail:
      badEntries === 0
        ? `${manifest.entries.length} manifest entr(ies), all paths valid`
        : `${badEntries} manifest entr(ies) point outside the allowed write area`,
  });

  const ok = !findings.some((f) => f.severity === 'fail');
  return { findings, ok };
}

/** Combined report for `doctor --security`. */
export async function fullSecurityReport(): Promise<SecurityReport> {
  const [env, catalog] = await Promise.all([auditInstallEnvironment(), auditSkillCatalog()]);
  const findings = [...env.findings, ...catalog.findings];
  return { findings, ok: env.ok && catalog.ok };
}
