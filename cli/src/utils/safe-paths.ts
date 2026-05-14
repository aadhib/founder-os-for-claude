/**
 * Founder OS — safe path validation
 *
 * Every filesystem write the CLI performs is routed through here first. The
 * goal: it must be impossible for a bug, a crafted skill id, or a hostile
 * environment variable to make Founder OS write to a system directory, the
 * filesystem root, the home root itself, or through a symlink that escapes
 * the allowed area.
 *
 * Allowed write area = inside the user's home directory OR inside the current
 * working directory (for `founderos init`). Nothing else, ever.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export class UnsafePathError extends Error {
  constructor(
    public readonly target: string,
    public readonly reason: string,
  ) {
    super(`Refusing to write to unsafe path: ${target}\n  reason: ${reason}`);
    this.name = 'UnsafePathError';
  }
}

/** Filesystem roots and well-known system directories — never writable. */
function systemDirs(): string[] {
  if (process.platform === 'win32') {
    const sysRoot = process.env['SystemRoot'] ?? 'C:\\Windows';
    const programFiles = process.env['ProgramFiles'] ?? 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] ?? 'C:\\Program Files (x86)';
    return [sysRoot, programFiles, programFilesX86, 'C:\\', 'C:\\Users'];
  }
  return [
    '/',
    '/etc',
    '/usr',
    '/bin',
    '/sbin',
    '/boot',
    '/dev',
    '/proc',
    '/sys',
    '/var',
    '/opt',
    '/root',
    '/Library',
    '/System',
    '/Applications',
    '/private',
    '/Users',
    '/home',
  ];
}

/** Case-aware equality for paths (Windows + macOS are case-insensitive). */
function pathEquals(a: string, b: string): boolean {
  if (process.platform === 'linux') return a === b;
  return a.toLowerCase() === b.toLowerCase();
}

/** Is `child` strictly inside `parent` (not equal to it)? */
export function isInside(parent: string, child: string): boolean {
  const rel = path.relative(parent, child);
  return rel.length > 0 && !rel.startsWith('..') && !path.isAbsolute(rel);
}

/**
 * Compute the *effective real path* of `target`: resolve the deepest existing
 * ancestor through `realpath` (defeating symlinked parents), then re-append the
 * not-yet-created tail (which cannot contain symlinks because it doesn't
 * exist). This is what every containment check is performed against.
 */
function effectiveRealPath(target: string): string {
  let existing = target;
  while (!fs.existsSync(existing)) {
    const parent = path.dirname(existing);
    if (parent === existing) break; // reached a root
    existing = parent;
  }
  let realExisting: string;
  try {
    realExisting = fs.realpathSync(existing);
  } catch {
    realExisting = existing;
  }
  const tail = path.relative(existing, target);
  return tail ? path.join(realExisting, tail) : realExisting;
}

/** Realpath a directory that is known to exist (allowed roots always exist). */
function realDir(dir: string): string {
  try {
    return fs.realpathSync(dir);
  } catch {
    return path.resolve(dir);
  }
}

export interface SafePathOptions {
  /** Also allow paths inside this directory (used by `founderos init`). */
  allowCwd?: string;
}

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f]/;

/**
 * Validate that `target` is a safe place to create/modify a directory.
 * Throws `UnsafePathError` if not. Returns the resolved absolute path.
 */
export function assertSafeInstallPath(target: string, opts: SafePathOptions = {}): string {
  if (!target || typeof target !== 'string') {
    throw new UnsafePathError(String(target), 'empty or non-string path');
  }

  const resolved = path.resolve(target);

  // 1. No NUL bytes or ASCII control characters in the path.
  if (CONTROL_CHARS.test(resolved)) {
    throw new UnsafePathError(resolved, 'path contains control characters');
  }

  // 2. Reject filesystem roots and known system directories (by literal path).
  for (const sys of systemDirs()) {
    if (pathEquals(resolved, path.resolve(sys))) {
      throw new UnsafePathError(resolved, 'path is a filesystem root or system directory');
    }
  }

  // 3. Reject the bare home directory itself.
  const home = path.resolve(os.homedir());
  if (pathEquals(resolved, home)) {
    throw new UnsafePathError(resolved, 'path is the home directory root');
  }

  // 4. Compute the effective real path (defeats symlinked parents) and confirm
  //    it lives inside the home directory — or inside an explicitly allowed
  //    cwd. Allowed roots are realpath'd too so the comparison is consistent
  //    (e.g. macOS /var -> /private/var).
  const effective = effectiveRealPath(resolved);

  const allowedRoots = [realDir(home)];
  if (opts.allowCwd) allowedRoots.push(realDir(opts.allowCwd));

  // The effective path must also not BE an allowed root or a system dir.
  for (const sys of systemDirs()) {
    if (pathEquals(effective, path.resolve(sys))) {
      throw new UnsafePathError(effective, 'path resolves to a system directory');
    }
  }
  if (allowedRoots.some((root) => pathEquals(effective, root))) {
    throw new UnsafePathError(effective, 'path resolves to the root of the allowed write area');
  }

  const insideAllowed = allowedRoots.some((root) => isInside(root, effective));
  if (!insideAllowed) {
    throw new UnsafePathError(
      effective,
      `path is outside the allowed write area (must be inside ${allowedRoots.join(' or ')})`,
    );
  }

  return resolved;
}

/**
 * Validate a skill id before it is ever used as a path segment. Skill ids come
 * from directory names in the bundled catalog, but this guards against a
 * crafted catalog entry being used for path traversal.
 */
export function assertSafeSkillId(id: string): string {
  if (id.includes('..') || id.includes('/') || id.includes('\\')) {
    throw new UnsafePathError(id, 'skill id contains path traversal characters');
  }
  if (!/^[a-z][a-z0-9-]{0,63}$/.test(id)) {
    throw new UnsafePathError(id, 'skill id must be kebab-case, 1-64 chars, no path separators');
  }
  return id;
}
