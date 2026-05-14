#!/usr/bin/env node
/**
 * Founder OS website — check
 *
 * Lightweight sanity check used for both `lint` and `test`: confirms the static
 * entry point exists and references its stylesheet. Keeps CI green without
 * pulling in a full toolchain for a static page.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const publicDir = path.resolve(__dirname, '..', 'public');
const required = ['index.html', 'styles.css'];

let failed = false;
for (const file of required) {
  const full = path.join(publicDir, file);
  if (!fs.existsSync(full)) {
    console.error(`✗ missing required file: public/${file}`);
    failed = true;
  }
}

if (!failed) {
  const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
  if (!html.includes('styles.css')) {
    console.error('✗ index.html does not reference styles.css');
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('✓ founderos website: checks passed');
