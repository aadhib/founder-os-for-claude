/**
 * Founder OS — setup wizard entrypoint
 *
 * A thin standalone wrapper around the interactive wizard, which lives in the
 * CLI package (`cli/src/setup-wizard.ts`) so it ships compiled with `founderos`.
 *
 * The normal path is `founderos install` (no flags), which runs the wizard
 * internally. This entrypoint exists for local use:
 *
 *   pnpm --filter founderos build       # build the CLI first
 *   pnpm tsx install/setup-wizard.ts     # then run the wizard directly
 */

import { runSetupWizard } from '../cli/dist/setup-wizard.js';

runSetupWizard()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
