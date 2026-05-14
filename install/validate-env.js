#!/usr/bin/env node
/**
 * Founder OS — environment validator
 *
 * Standalone, zero-dependency sanity check. Runs before the CLI bootstraps
 * so failures surface with a clear message even if nothing else is installed.
 *
 *   node install/validate-env.js
 *
 * Exit codes: 0 = healthy, 1 = blocking issue found.
 */

'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  purple: '\x1b[38;5;141m',
  green: '\x1b[38;5;42m',
  red: '\x1b[38;5;203m',
  yellow: '\x1b[38;5;221m',
};

const checks = [];
const record = (name, status, detail) => checks.push({ name, status, detail });

function which(bin) {
  try {
    const cmd = process.platform === 'win32' ? `where ${bin}` : `command -v ${bin}`;
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

// ── checks ──────────────────────────────────────────────────────────────
function checkNode() {
  const major = Number(process.versions.node.split('.')[0]);
  if (major >= 18) record('Node.js', 'ok', `v${process.versions.node}`);
  else record('Node.js', 'fail', `v${process.versions.node} — need >= 18`);
}

function checkPackageManager() {
  const found = ['pnpm', 'npm', 'bun', 'yarn'].filter((m) => which(m));
  if (found.length) record('Package manager', 'ok', found.join(', '));
  else record('Package manager', 'fail', 'none found — install npm or pnpm');
}

function checkOS() {
  const supported = ['darwin', 'linux', 'win32'];
  if (supported.includes(process.platform)) {
    record('Operating system', 'ok', `${os.type()} ${os.release()}`);
  } else {
    record('Operating system', 'warn', `${process.platform} — untested`);
  }
}

function checkHomeWritable() {
  try {
    const probe = path.join(os.homedir(), '.founderos-write-probe');
    fs.writeFileSync(probe, 'ok');
    fs.unlinkSync(probe);
    record('Home dir writable', 'ok', os.homedir());
  } catch {
    record('Home dir writable', 'fail', `cannot write to ${os.homedir()}`);
  }
}

function checkAiTools() {
  const tools = {
    'Claude Code': 'claude',
    Cursor: 'cursor',
    'Codex CLI': 'codex',
    'Gemini CLI': 'gemini',
  };
  const detected = Object.entries(tools)
    .filter(([, bin]) => which(bin))
    .map(([label]) => label);
  if (detected.length) {
    record('AI tools', 'ok', detected.join(', '));
  } else {
    record('AI tools', 'warn', 'none detected on PATH — skills can still be placed manually');
  }
}

// ── run ─────────────────────────────────────────────────────────────────
checkNode();
checkPackageManager();
checkOS();
checkHomeWritable();
checkAiTools();

console.log(`\n${C.purple}${C.bold}Founder OS — environment check${C.reset}\n`);

const glyph = { ok: `${C.green}✓${C.reset}`, warn: `${C.yellow}!${C.reset}`, fail: `${C.red}✗${C.reset}` };
for (const c of checks) {
  console.log(`  ${glyph[c.status]} ${c.name.padEnd(20)} ${C.dim}${c.detail}${C.reset}`);
}

const failed = checks.filter((c) => c.status === 'fail');
console.log('');
if (failed.length) {
  console.log(`${C.red}${C.bold}${failed.length} blocking issue(s).${C.reset} Resolve them and re-run.\n`);
  process.exit(1);
}
console.log(`${C.green}${C.bold}Environment looks good.${C.reset}\n`);
process.exit(0);
