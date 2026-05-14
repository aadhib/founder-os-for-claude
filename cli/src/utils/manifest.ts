/**
 * Founder OS — install manifest
 *
 * Tracks what the CLI has placed where, so `list`, `update`, and `remove`
 * can operate precisely instead of guessing. Stored at ~/.founderos/manifest.json
 */

import { MANIFEST_PATH } from './paths.js';
import { readJson, writeJson } from './fs.js';

export interface ManifestEntry {
  skillId: string;
  toolId: string;
  /** Absolute path the skill folder was written to. */
  path: string;
  version: string;
  installedAt: string;
  /** If an existing folder was backed up before this install, its path. */
  backupPath?: string;
}

export interface Manifest {
  version: 1;
  cliVersion: string;
  entries: ManifestEntry[];
}

const EMPTY: Manifest = { version: 1, cliVersion: '1.0.0', entries: [] };

export async function readManifest(): Promise<Manifest> {
  return readJson<Manifest>(MANIFEST_PATH, EMPTY);
}

export async function writeManifest(manifest: Manifest): Promise<void> {
  await writeJson(MANIFEST_PATH, manifest);
}

export async function recordInstall(entries: ManifestEntry[]): Promise<void> {
  const manifest = await readManifest();
  for (const entry of entries) {
    const idx = manifest.entries.findIndex(
      (e) => e.skillId === entry.skillId && e.toolId === entry.toolId,
    );
    if (idx >= 0) manifest.entries[idx] = entry;
    else manifest.entries.push(entry);
  }
  await writeManifest(manifest);
}

export async function recordRemoval(skillId: string, toolId?: string): Promise<number> {
  const manifest = await readManifest();
  const before = manifest.entries.length;
  manifest.entries = manifest.entries.filter((e) =>
    toolId ? !(e.skillId === skillId && e.toolId === toolId) : e.skillId !== skillId,
  );
  await writeManifest(manifest);
  return before - manifest.entries.length;
}
