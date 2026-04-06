// =============================================================================
// server/src/middleware/errorHandler.ts — Global Express error handler
// =============================================================================

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from './AppError';
import { logger } from '../lib/logger';

const ERROR_STATUS: Record<string, number> = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  EXPIRED: 410,
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    const first = err.errors[0];
    res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: first?.message ?? 'Neplatný vstup',
        field: first?.path.join('.'),
      },
    });
    return;
  }

  if (err instanceof AppError) {
    const status = ERROR_STATUS[err.code] ?? err.statusCode;
    res.status(status).json({ error: { code: err.code, message: err.message } });
    return;
  }

  logger.error(err, 'Unhandled error');
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Interní chyba serveru' } });
}
