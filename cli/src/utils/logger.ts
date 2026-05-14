/**
 * Founder OS — terminal logger
 *
 * A thin, opinionated wrapper over chalk so every command in the CLI has a
 * consistent, premium-looking voice. No state, no side effects beyond stdout.
 */

import chalk from 'chalk';

const purple = chalk.hex('#8b5cf6');
const green = chalk.hex('#22c55e');
const red = chalk.hex('#ef4444');
const yellow = chalk.hex('#eab308');
const dim = chalk.dim;

export const logger = {
  /** Big gradient-ish banner used at the top of `install`. */
  banner(): void {
    console.log(
      purple.bold(
        [
          '',
          '  ███████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗ ███████╗██████╗',
          '  ██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗██╔════╝██╔══██╗',
          '  █████╗  ██║   ██║██║   ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝',
          '  ██╔══╝  ██║   ██║██║   ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗',
          '  ██║     ╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝███████╗██║  ██║',
          '  ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝',
          '',
        ].join('\n'),
      ),
    );
    console.log(dim('  the AI operating system for founders · v1.0.0\n'));
  },

  /** Section header with a rule. */
  section(title: string): void {
    console.log('\n' + purple.bold(`▌ ${title}`));
  },

  /** A pending/active step. */
  step(msg: string): void {
    console.log(`${purple('▸')} ${msg}`);
  },

  /** Success line. */
  ok(msg: string): void {
    console.log(`${green('✓')} ${msg}`);
  },

  /** Warning — non-fatal. */
  warn(msg: string): void {
    console.log(`${yellow('!')} ${msg}`);
  },

  /** Error — usually fatal. */
  error(msg: string): void {
    console.error(`${red('✗')} ${red(msg)}`);
  },

  /** Plain dim info. */
  info(msg: string): void {
    console.log(dim(`  ${msg}`));
  },

  /** Bulleted list. */
  list(items: string[]): void {
    for (const item of items) console.log(`  ${purple('•')} ${item}`);
  },

  /** Key/value table. */
  table(rows: Array<[string, string]>): void {
    const width = Math.max(...rows.map(([k]) => k.length));
    for (const [k, v] of rows) {
      console.log(`  ${dim(k.padEnd(width))}  ${v}`);
    }
  },

  /** Intro paragraph(s) for interactive flows. */
  intro(...lines: string[]): void {
    console.log('');
    for (const line of lines) console.log(`  ${line}`);
    console.log('');
  },

  /** Closing call-to-action. */
  outro(msg: string): void {
    console.log('\n' + green('✓ ') + chalk.bold(msg) + '\n');
  },

  raw(msg = ''): void {
    console.log(msg);
  },
};

export const color = { purple, green, red, yellow, dim };
