/**
 * `founder-os integrations`
 *
 * Prints the supported AI tools, whether each is detected, where skills get
 * placed, and the integration note for each.
 */

import { detectIntegrations } from '../integrations/index.js';
import { logger, color } from '../utils/logger.js';

export async function integrationsCommand(): Promise<void> {
  logger.section('Founder OS — integrations');
  logger.raw();

  const integrations = await detectIntegrations();

  for (const i of integrations) {
    const badge = i.detected
      ? color.green(`● detected (${i.detectedBy})`)
      : color.dim('○ not detected');
    logger.raw(`  ${color.purple(i.name)}  ${badge}`);
    logger.table([
      ['id', i.id],
      ['skill dir', i.skillDir],
      ['note', i.note],
    ]);
    logger.raw();
  }

  const detected = integrations.filter((i) => i.detected).length;
  logger.info(`${detected}/${integrations.length} tools detected on this machine.`);
  logger.raw();
}
