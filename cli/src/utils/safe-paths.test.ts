/**
 * Founder OS — safe path validation tests
 *
 * These are the most security-critical tests in the suite: they prove the CLI
 * cannot be made to write to a system directory, the filesystem root, the home
 * root, or through a symlink that escapes the allowed area.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import {
  assertSafeInstallPath,
  assertSafeSkillId,
  isInside,
  UnsafePathError,
} from './safe-paths.js';

const HOME = os.homedir();

test('rejects the filesystem root', () => {
  const root = process.platform === 'win32' ? 'C:\\' : '/';
  assert.throws(() => assertSafeInstallPath(root), UnsafePathError);
});

test('rejects known system directories', () => {
  const dirs = process.platform === 'win32' ? ['C:\\Windows'] : ['/etc', '/usr', '/bin', '/var'];
  for (const d of dirs) {
    assert.throws(() => assertSafeInstallPath(d), UnsafePathError, `expected ${d} to be rejected`);
  }
});

test('rejects the bare home directory itself', () => {
  assert.throws(() => assertSafeInstallPath(HOME), UnsafePathError);
});

test('rejects paths outside the home directory', () => {
  const outside = process.platform === 'win32' ? 'C:\\some-other-place\\x' : '/tmp/founder-os-x';
  assert.throws(() => assertSafeInstallPath(outside), UnsafePathError);
});

test('rejects path traversal that escapes home', () => {
  const escaping = path.join(HOME, '..', '..', 'etc', 'evil');
  assert.throws(() => assertSafeInstallPath(escaping), UnsafePathError);
});

test('accepts a normal skill directory inside home', () => {
  const ok = path.join(HOME, '.claude', 'skills', 'fix-my-ui');
  const resolved = assertSafeInstallPath(ok);
  assert.equal(resolved, path.resolve(ok));
});

test('accepts a project path when allowCwd is given', () => {
  // `allowCwd` is always a real, existing directory in practice (process.cwd()).
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'founder-os-cwd-test-'));
  try {
    const projectPath = path.join(cwd, '.claude', 'skills', 'founder-mode');
    const resolved = assertSafeInstallPath(projectPath, { allowCwd: cwd });
    assert.equal(resolved, path.resolve(projectPath));
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('rejects a project path when allowCwd is NOT given', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'founder-os-cwd-test-'));
  try {
    const projectPath = path.join(cwd, '.claude', 'skills', 'founder-mode');
    assert.throws(() => assertSafeInstallPath(projectPath), UnsafePathError);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('detects a symlinked parent that escapes the allowed area', () => {
  // Build: <home>/.founderos-symlink-test/link -> <tmpdir>/escape
  const base = fs.mkdtempSync(path.join(HOME, '.founderos-symlink-test-'));
  const escapeTarget = fs.mkdtempSync(path.join(os.tmpdir(), 'founder-os-escape-'));
  const link = path.join(base, 'link');
  try {
    fs.symlinkSync(escapeTarget, link, 'dir');
    const through = path.join(link, 'skills', 'fix-my-ui');
    assert.throws(() => assertSafeInstallPath(through), UnsafePathError);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
    fs.rmSync(escapeTarget, { recursive: true, force: true });
  }
});

test('isInside is strict — a directory is not inside itself', () => {
  assert.equal(isInside(HOME, HOME), false);
  assert.equal(isInside(HOME, path.join(HOME, 'x')), true);
  assert.equal(isInside(path.join(HOME, 'x'), HOME), false);
});

test('assertSafeSkillId accepts valid kebab-case ids', () => {
  for (const id of ['fix-my-ui', 'founder-mode', 'a', 'a1', 'enterprise-saas-audit']) {
    assert.equal(assertSafeSkillId(id), id);
  }
});

test('assertSafeSkillId rejects path traversal and separators', () => {
  for (const bad of ['../evil', '..', 'a/b', 'a\\b', '/etc', 'UPPER', '1leading', '-leading', '']) {
    assert.throws(() => assertSafeSkillId(bad), UnsafePathError, `expected "${bad}" to be rejected`);
  }
});
