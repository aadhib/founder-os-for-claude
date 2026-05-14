/**
 * Founder OS — environment validation
 *
 * The TypeScript counterpart to install/validate-env.js. The standalone JS
 * file exists for the pre-bootstrap moment; this version is what every CLI
 * command uses once the package is resolved.
 */

import os from 'node:os';
import { execa } from 'execa';
import { exists } from './fs.js';
import { STATE_DIR } from './paths.js';

export type CheckStatus = 'ok' | 'warn' | 'fail';

export interface EnvCheck {
  name: string;
  status: CheckStatus;
  detail: string;
}

export interface EnvReport {
  checks: EnvCheck[];
  ok: boolean;
}

async function which(bin: string): Promise<string | null> {
  // `bin` is always a hardcoded constant from this codebase — never user input.
  const cmd = process.platform === 'win32' ? `where ${bin}` : `command -v ${bin}`;
  try {
    const { stdout } = await execa(cmd, { shell: true });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

export async function validateEnvironment(): Promise<EnvReport> {
  const checks: EnvCheck[] = [];

  // Node version
  const major = Number(process.versions.node.split('.')[0]);
  checks.push({
    name: 'Node.js',
    status: major >= 18 ? 'ok' : 'fail',
    detail: major >= 18 ? `v${process.versions.node}` : `v${process.versions.node} — need >= 18`,
  });

  // Package manager
  const managers: string[] = [];
  for (const m of ['pnpm', 'npm', 'bun', 'yarn']) {
    if (await which(m)) managers.push(m);
  }
  checks.push({
    name: 'Package manager',
    status: managers.length ? 'ok' : 'fail',
    detail: managers.length ? managers.join(', ') : 'none found',
  });

  // OS
  const supported = ['darwin', 'linux', 'win32'];
  checks.push({
    name: 'Operating system',
    status: supported.includes(process.platform) ? 'ok' : 'warn',
    detail: `${os.type()} ${os.release()}`,
  });

  // State dir reachable
  const homeOk = await exists(os.homedir());
  checks.push({
    name: 'Home directory',
    status: homeOk ? 'ok' : 'fail',
    detail: homeOk ? os.homedir() : 'unreachable',
  });

  // State dir (informational)
  checks.push({
    name: 'Founder OS state',
    status: 'ok',
    detail: (await exists(STATE_DIR)) ? STATE_DIR : `${STATE_DIR} (will be created)`,
  });

  const ok = !checks.some((c) => c.status === 'fail');
  return { checks, ok };
}
