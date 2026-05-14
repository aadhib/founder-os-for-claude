#!/usr/bin/env node
/**
 * Founder OS website — build
 *
 * The site is intentionally a static, zero-framework page. "Build" just copies
 * public/ to dist/ so it can be deployed by any static host (Vercel, Pages, etc).
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public');
const out = path.join(root, 'dist');

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(src, out, { recursive: true });

const files = fs.readdirSync(out);
console.log(`founder-os website: built ${files.length} file(s) → dist/`);
