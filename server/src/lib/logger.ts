// =============================================================================
// server/src/lib/logger.ts — Pino structured logger
// =============================================================================

import pino from 'pino';
import { isDev } from '../config';

export const logger = pino(
  isDev
    ? { level: 'debug', transport: { target: 'pino-pretty', options: { colorize: true } } }
    : { level: 'info' },
);
