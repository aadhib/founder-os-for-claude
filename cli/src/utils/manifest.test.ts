/**
 * Founder OS — manifest tests
 *
 * Covers the install manifest: round-trip persistence, idempotent upserts, and
 * precise removal. State is redirected to a throwaway directory before the
 * manifest module is imported, so the real `~/.founderos` is never touched.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const stateDir = fs.mkdtempSync(path.join(os.homedir(), '.founderos-manifest-test-'));
process.env['FOUNDER_OS_STATE_DIR'] = stateDir;

const { readManifest, writeManifest, recordInstall, recordRemoval } = await import(
  './manifest.js'
);
type ManifestEntry = import('./manifest.js').ManifestEntry;

const entry = (skillId: string, toolId: string): ManifestEntry => ({
  skillId,
  toolId,
  path: path.join(os.homedir(), '.test', toolId, skillId),
  version: '1.0.0',
  installedAt: new Date().toISOString(),
});

before(async () => {
  // Start from a known-empty manifest.
  await writeManifest({ version: 1, cliVersion: '1.0.0', entries: [] });
});

after(() => {
  fs.rmSync(stateDir, { recursive: true, force: true });
});

test('an empty/missing manifest reads back as empty, not a throw', async () => {
  const m = await readManifest();
  assert.equal(m.version, 1);
  assert.deepEqual(m.entries, []);
});

test('recordInstall persists entries and round-trips', async () => {
  await recordInstall([entry('fix-my-ui', 'claude-code'), entry('founder-mode', 'cursor')]);
  const m = await readManifest();
  assert.equal(m.entries.length, 2);
  assert.ok(m.entries.some((e) => e.skillId === 'fix-my-ui' && e.toolId === 'claude-code'));
});

test('recordInstall upserts — same skill+tool is not duplicated', async () => {
  await recordInstall([entry('fix-my-ui', 'claude-code')]);
  const m = await readManifest();
  const matches = m.entries.filter(
    (e) => e.skillId === 'fix-my-ui' && e.toolId === 'claude-code',
  );
  assert.equal(matches.length, 1);
});

test('recordRemoval scoped to a tool removes only that pair', async () => {
  await recordInstall([
    entry('startup-roast', 'claude-code'),
    entry('startup-roast', 'cursor'),
  ]);
  const removed = await recordRemoval('startup-roast', 'cursor');
  assert.equal(removed, 1);

  const m = await readManifest();
  assert.ok(m.entries.some((e) => e.skillId === 'startup-roast' && e.toolId === 'claude-code'));
  assert.ok(!m.entries.some((e) => e.skillId === 'startup-roast' && e.toolId === 'cursor'));
});

test('recordRemoval without a tool removes every entry for the skill', async () => {
  await recordInstall([
    entry('viral-carousel', 'claude-code'),
    entry('viral-carousel', 'cursor'),
  ]);
  const removed = await recordRemoval('viral-carousel');
  assert.equal(removed, 2);

  const m = await readManifest();
  assert.equal(m.entries.some((e) => e.skillId === 'viral-carousel'), false);
});
