/**
 * Founder OS — installer & uninstaller tests
 *
 * Proves the safety-critical installer behavior:
 *   - --dry-run writes nothing and touches no manifest
 *   - a real install places skills and records them
 *   - --force backs up an existing folder before overwriting it
 *   - uninstall removes only what the manifest records
 *
 * `FOUNDER_OS_STATE_DIR` is redirected to a throwaway directory *before* any
 * module that reads it is imported, so the real `~/.founderos` is never
 * touched. Skill directories are created inside the home dir so they stay
 * within the CLI's allowed write area.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';

// Redirect state BEFORE importing anything that reads paths/manifest.
const stateDir = fs.mkdtempSync(path.join(os.homedir(), '.founderos-state-test-'));
process.env['FOUNDER_OS_STATE_DIR'] = stateDir;

/**
 * Probe directory-symlink support. Windows CI runners often lack the
 * privilege, so the symlink-refusal test is skipped there instead of failing.
 */
function symlinksSupported(): boolean {
  const probe = fs.mkdtempSync(path.join(os.tmpdir(), 'fos-symcheck-'));
  try {
    fs.symlinkSync(probe, path.join(probe, 'link'), 'dir');
    return true;
  } catch {
    return false;
  } finally {
    fs.rmSync(probe, { recursive: true, force: true });
  }
}
const SYMLINK_SKIP = symlinksSupported()
  ? false
  : 'directory symlinks are not supported on this platform/runner';

const { installAllSkills } = await import('./index.js');
const { uninstallSkills } = await import('./uninstall.js');
const { readManifest } = await import('../utils/manifest.js');
const { listSkills } = await import('../utils/skills.js');
type Integration = import('../integrations/index.js').Integration;

let skillRoot: string;
let tool: Integration;
const SKILL = 'fix-my-ui';

before(async () => {
  // A fake tool whose skill directory lives safely inside the home dir.
  skillRoot = fs.mkdtempSync(path.join(os.homedir(), '.founderos-tool-test-'));
  tool = {
    id: 'claude-code',
    name: 'Claude Code (test)',
    detected: true,
    detectedBy: 'binary',
    skillDir: skillRoot,
    note: 'test fixture',
  };
  // Sanity: the bundled catalog actually contains the skill we test with.
  const all = await listSkills();
  assert.ok(
    all.some((s) => s.id === SKILL),
    `bundled catalog must contain ${SKILL}`,
  );
});

after(() => {
  fs.rmSync(skillRoot, { recursive: true, force: true });
  fs.rmSync(stateDir, { recursive: true, force: true });
});

test('--dry-run writes nothing and records nothing', async () => {
  const report = await installAllSkills([tool], { force: false, dryRun: true, only: [SKILL] });

  assert.ok(report.details.length > 0);
  for (const d of report.details) assert.equal(d.status, 'would-place');

  // Nothing on disk.
  assert.equal(fs.existsSync(path.join(skillRoot, SKILL)), false);
  // Nothing in the manifest.
  const manifest = await readManifest();
  assert.equal(manifest.entries.length, 0);
});

test('a real install places the skill and records it', async () => {
  const report = await installAllSkills([tool], { force: false, only: [SKILL] });

  assert.equal(report.placed, 1);
  assert.equal(report.failed, 0);
  assert.equal(fs.existsSync(path.join(skillRoot, SKILL, 'SKILL.md')), true);

  const manifest = await readManifest();
  assert.equal(manifest.entries.length, 1);
  assert.equal(manifest.entries[0]?.skillId, SKILL);
});

test('installing again without --force skips (no overwrite)', async () => {
  const report = await installAllSkills([tool], { force: false, only: [SKILL] });
  assert.equal(report.placed, 0);
  assert.equal(report.skipped, 1);
});

test('--force backs up the existing folder before overwriting', async () => {
  // Mark the currently-installed copy so we can prove the backup captured it.
  const marker = path.join(skillRoot, SKILL, 'MARKER.md');
  await fsp.writeFile(marker, 'original-copy');

  const report = await installAllSkills([tool], { force: true, only: [SKILL] });
  assert.equal(report.placed, 1);

  const placed = report.details.find((d) => d.status === 'placed');
  assert.ok(placed?.backupPath, 'expected a backup path on the placed detail');
  assert.equal(fs.existsSync(placed!.backupPath!), true);
  // The backup must contain the marker from the original copy.
  assert.equal(
    fs.readFileSync(path.join(placed!.backupPath!, 'MARKER.md'), 'utf8'),
    'original-copy',
  );

  fs.rmSync(placed!.backupPath!, { recursive: true, force: true });
});

test('a symlinked skill folder is refused, never followed', { skip: SYMLINK_SKIP }, async () => {
  const linkName = 'startup-roast';
  const realTarget = fs.mkdtempSync(path.join(os.homedir(), '.founderos-linktarget-'));
  const linkPath = path.join(skillRoot, linkName);
  fs.symlinkSync(realTarget, linkPath, 'dir');
  try {
    const report = await installAllSkills([tool], { force: true, only: [linkName] });
    const detail = report.details[0];
    assert.equal(detail?.status, 'failed');
    assert.match(detail?.reason ?? '', /symlink/i);
    // The symlink target was never written into.
    assert.equal(fs.existsSync(path.join(realTarget, 'SKILL.md')), false);
  } finally {
    fs.unlinkSync(linkPath);
    fs.rmSync(realTarget, { recursive: true, force: true });
  }
});

test('uninstall --dry-run removes nothing', async () => {
  const report = await uninstallSkills({ dryRun: true });
  assert.ok(report.details.every((d) => d.status === 'would-remove'));
  assert.equal(fs.existsSync(path.join(skillRoot, SKILL)), true);
});

test('uninstall removes the skill and clears the manifest', async () => {
  const report = await uninstallSkills({});
  assert.equal(report.removed, 1);
  assert.equal(fs.existsSync(path.join(skillRoot, SKILL)), false);

  const manifest = await readManifest();
  assert.equal(manifest.entries.length, 0);
});
