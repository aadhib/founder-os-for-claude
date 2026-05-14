/**
 * Founder OS — bootstrap entrypoint
 *
 * A thin standalone wrapper around the real bootstrap pipeline, which lives in
 * the CLI package (`cli/src/bootstrap.ts`) so it ships compiled with `founder-os`.
 *
 * The shell installers do NOT run this file directly — they call
 * `founder-os install --from-bootstrap`. This entrypoint exists for local use:
 *
 *   pnpm --filter founder-os build      # build the CLI first
 *   pnpm tsx install/bootstrap.ts       # then run the pipeline directly
 *
 * Keeping the logic in the CLI package means there is one source of truth and
 * the install behavior is covered by the CLI's build and tests.
 */

import { bootstrap } from '../cli/dist/bootstrap.js';

bootstrap({ nonInteractive: process.argv.includes('--non-interactive') })
  .then((result) => process.exit(result.ok ? 0 : 1))
  .catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
