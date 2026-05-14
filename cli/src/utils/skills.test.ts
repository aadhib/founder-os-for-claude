/**
 * Founder OS — skill catalog tests
 *
 * Runs against the real bundled skills/ directory. These are the same checks
 * `founder-os verify` performs, wired into `node --test` for CI.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listSkills, verifySkill } from './skills.js';

test('skill catalog is non-empty', async () => {
  const skills = await listSkills();
  assert.ok(skills.length >= 8, `expected >= 8 skills, found ${skills.length}`);
});

test('every skill has complete frontmatter', async () => {
  const skills = await listSkills();
  for (const s of skills) {
    assert.ok(s.name, `${s.id}: missing name`);
    assert.ok(s.description, `${s.id}: missing description`);
    assert.match(s.version, /^\d+\.\d+\.\d+$/, `${s.id}: bad version`);
    assert.ok(s.tools.length > 0, `${s.id}: no tools listed`);
  }
});

test('every skill passes the structural contract', async () => {
  const skills = await listSkills();
  for (const s of skills) {
    const result = await verifySkill(s);
    assert.ok(
      result.ok,
      `${s.id} failed: frontmatter=[${result.missingFrontmatter}] sections=[${result.missingSections}]`,
    );
  }
});

test('skill ids are unique and kebab-case', async () => {
  const skills = await listSkills();
  const seen = new Set<string>();
  for (const s of skills) {
    assert.ok(!seen.has(s.id), `duplicate skill id: ${s.id}`);
    seen.add(s.id);
    assert.match(s.id, /^[a-z][a-z0-9-]*$/, `${s.id}: not kebab-case`);
  }
});
