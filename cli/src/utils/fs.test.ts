/**
 * Founder OS — filesystem helper tests
 *
 * Covers the primitives the installer depends on: directory copy, backup
 * creation, symlink detection, and JSON round-trips. All temp dirs are created
 * inside the home directory so they stay within the CLI's allowed write area.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import {
  backupDir,
  copyDir,
  ensureDir,
  exists,
  isSymlink,
  readJson,
  remove,
  writeJson,
} from './fs.js';

let workdir: string;

before(() => {
  workdir = fs.mkdtempSync(path.join(os.homedir(), '.founderos-fs-test-'));
});

after(() => {
  fs.rmSync(workdir, { recursive: true, force: true });
});

test('ensureDir + exists', async () => {
  const d = path.join(workdir, 'a', 'b', 'c');
  await ensureDir(d);
  assert.equal(await exists(d), true);
});

test('copyDir copies files recursively and counts them', async () => {
  const src = path.join(workdir, 'src');
  await ensureDir(path.join(src, 'nested'));
  await fsp.writeFile(path.join(src, 'SKILL.md'), '# skill');
  await fsp.writeFile(path.join(src, 'nested', 'extra.md'), 'extra');

  const dest = path.join(workdir, 'dest');
  const count = await copyDir(src, dest);

  assert.equal(count, 2);
  assert.equal(await exists(path.join(dest, 'SKILL.md')), true);
  assert.equal(await exists(path.join(dest, 'nested', 'extra.md')), true);
});

test('backupDir creates a timestamped copy and leaves the original intact', async () => {
  const original = path.join(workdir, 'skill-x');
  await ensureDir(original);
  await fsp.writeFile(path.join(original, 'SKILL.md'), 'v1');

  const backup = await backupDir(original);
  assert.ok(backup, 'expected a backup path');
  assert.match(backup!, /\.founderos-backup-/);
  assert.equal(await exists(backup!), true);
  assert.equal(await exists(original), true, 'original must still exist');
  assert.equal(await fsp.readFile(path.join(backup!, 'SKILL.md'), 'utf8'), 'v1');
});

test('backupDir returns null when there is nothing to back up', async () => {
  const missing = path.join(workdir, 'does-not-exist');
  assert.equal(await backupDir(missing), null);
});

test('isSymlink distinguishes links from real directories', async () => {
  const realDir = path.join(workdir, 'real');
  await ensureDir(realDir);
  const link = path.join(workdir, 'link');
  await fsp.symlink(realDir, link, 'dir');

  assert.equal(await isSymlink(realDir), false);
  assert.equal(await isSymlink(link), true);

  // Removing the symlink must not touch its target.
  await fsp.unlink(link);
  assert.equal(await exists(realDir), true);
});

test('writeJson + readJson round-trip, with a safe fallback', async () => {
  const file = path.join(workdir, 'state', 'manifest.json');
  const data = { version: 1, entries: [{ skillId: 'fix-my-ui' }] };
  await writeJson(file, data);
  assert.deepEqual(await readJson(file, null), data);

  // Missing file → fallback, never a throw.
  assert.deepEqual(await readJson(path.join(workdir, 'nope.json'), { fallback: true }), {
    fallback: true,
  });
});

test('remove deletes a directory tree', async () => {
  const d = path.join(workdir, 'to-remove');
  await ensureDir(path.join(d, 'inner'));
  await remove(d);
  assert.equal(await exists(d), false);
});
