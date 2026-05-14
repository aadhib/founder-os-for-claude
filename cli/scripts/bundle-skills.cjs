#!/usr/bin/env node
/**
 * Founder OS CLI — bundle skills
 *
 * Runs on `prepack`. Copies the monorepo `skills/` directory into the CLI
 * package so the published `founder-os` package is self-contained.
 *
 * At runtime, `utils/paths.ts` looks for `<package>/skills` first (the
 * published layout) and falls back to `<repo>/skills` (the dev layout).
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const cliRoot = path.resolve(__dirname, '..');
const repoSkills = path.resolve(cliRoot, '..', 'skills');
const bundledSkills = path.join(cliRoot, 'skills');

if (!fs.existsSync(repoSkills)) {
  console.error('✗ bundle-skills: source skills/ not found at', repoSkills);
  process.exit(1);
}

fs.rmSync(bundledSkills, { recursive: true, force: true });
fs.cpSync(repoSkills, bundledSkills, { recursive: true });

const count = fs
  .readdirSync(bundledSkills, { withFileTypes: true })
  .filter((e) => e.isDirectory()).length;

console.log(`✓ bundle-skills: bundled ${count} skill(s) into cli/skills/`);
