/**
 * Founder OS — filesystem helpers
 *
 * Small async wrappers around node:fs/promises with the error handling the
 * CLI actually needs. Nothing clever — just consistent.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

export async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function isDir(target: string): Promise<boolean> {
  try {
    return (await fs.stat(target)).isDirectory();
  } catch {
    return false;
  }
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/** Recursively copy a directory. Used to place a skill folder. */
export async function copyDir(src: string, dest: string): Promise<number> {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += await copyDir(from, to);
    } else {
      await fs.copyFile(from, to);
      count += 1;
    }
  }
  return count;
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(file: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export async function readText(file: string): Promise<string> {
  return fs.readFile(file, 'utf8');
}

export async function remove(target: string): Promise<void> {
  await fs.rm(target, { recursive: true, force: true });
}

export async function listDirs(parent: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(parent, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

export async function isSymlink(target: string): Promise<boolean> {
  try {
    return (await fs.lstat(target)).isSymbolicLink();
  } catch {
    return false;
  }
}

/**
 * Back up an existing directory before it is overwritten. Copies (never moves)
 * to `<dir>.founderos-backup-<timestamp>` so the original is preserved even if
 * the subsequent write fails. Returns the backup path, or null if there was
 * nothing to back up.
 */
export async function backupDir(dir: string): Promise<string | null> {
  if (!(await exists(dir))) return null;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${dir}.founderos-backup-${stamp}`;
  await copyDir(dir, backupPath);
  return backupPath;
}
