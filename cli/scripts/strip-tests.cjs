#!/usr/bin/env node
//
// Founder OS CLI - strip non-shippable artifacts from dist/ before packing.
//
// package.json's `files` whitelist includes the whole dist/ directory, and
// npm does NOT reliably honor .npmignore patterns inside a files-listed
// directory. So we explicitly remove compiled test files and source maps
// here, in `prepack`, right before the tarball is built.
//
// This never affects the test suite: CI (and `prepublishOnly`) compile and
// run tests from a separate `pnpm build` step before prepack ever runs.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const distDir = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('x strip-tests: dist/ not found - run the build first.');
  process.exit(1);
}

let removed = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    const name = entry.name;
    const isTest = /\.test\.js$/.test(name) || /\.test\.d\.ts$/.test(name);
    const isSourceMap = /\.js\.map$/.test(name);
    if (isTest || isSourceMap) {
      fs.rmSync(full);
      removed += 1;
    }
  }
}

walk(distDir);
console.log('ok strip-tests: removed ' + removed + ' non-shippable file(s) from dist/');
