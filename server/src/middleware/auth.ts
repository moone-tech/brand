// =============================================================================
// server/src/middleware/auth.ts — JWT authentication middleware
// =============================================================================

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './AppError';
import type { JwtPayload, UserRole } from '@shared/types';

// Extend Express Request with authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/** Verify JWT and attach user to request */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('UNAUTHORIZED', 'Přihlášení je vyžadováno', 401));
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.auth.jwtSecret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(new AppError('UNAUTHORIZED', 'Neplatný nebo expirovaný token', 401));
  }
}

/** Require one of the specified roles */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError('UNAUTHORIZED', 'Přihlášení je vyžadováno', 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError('FORBIDDEN', 'Nemáš oprávnění k této akci', 403));
    }
    next();
  };
}
