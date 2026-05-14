#!/usr/bin/env node
//
// Founder OS CLI - portable test runner.
//
// `node --test` discovery behavior varies across Node 18-25 (and newer Node
// may try to execute .ts source files directly). This script removes the
// ambiguity: it recursively finds exactly the compiled test files under dist/
// (files ending in .test.js) and runs them under `node --test`. Works
// identically on every supported Node version.

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const distDir = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('✗ dist/ not found — run `npm run build` first.');
  process.exit(1);
}

/** Recursively collect compiled test files. */
function findTests(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findTests(full));
    } else if (entry.isFile() && entry.name.endsWith('.test.js')) {
      out.push(full);
    }
  }
  return out;
}

const tests = findTests(distDir).sort();

if (tests.length === 0) {
  console.error('✗ no compiled test files found under dist/');
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', ...tests], { stdio: 'inherit' });
process.exit(result.status ?? 1);
