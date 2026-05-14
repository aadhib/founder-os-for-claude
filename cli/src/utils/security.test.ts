/**
 * Founder OS — security audit tests
 *
 * Confirms the bundled skill catalog is safe to ship and install: plain
 * documentation only, no executables, no symlinks, no binary payloads. This is
 * the same audit `founderos verify --security` runs in CI.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditSkillCatalog } from './security.js';

test('the bundled skill catalog passes the security audit', async () => {
  const report = await auditSkillCatalog();
  const failures = report.findings.filter((f) => f.severity === 'fail');
  assert.equal(
    failures.length,
    0,
    `catalog security failures:\n${failures.map((f) => `  ${f.area}: ${f.detail}`).join('\n')}`,
  );
  assert.equal(report.ok, true);
});

test('the audit actually inspected every skill (no silent empty pass)', async () => {
  const report = await auditSkillCatalog();
  // At least one finding per skill — the catalog has 8.
  assert.ok(
    report.findings.length >= 8,
    `expected findings for the whole catalog, got ${report.findings.length}`,
  );
});
