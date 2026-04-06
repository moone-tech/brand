// =============================================================================
// server/src/config.ts — Single source of truth for all environment variables
// =============================================================================

import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config = {
  server: {
    port: parseInt(optionalEnv('PORT', '3001'), 10),
    clientUrl: optionalEnv('CLIENT_URL', 'http://localhost:5173'),
    nodeEnv: optionalEnv('NODE_ENV', 'development'),
    appUrl: optionalEnv('APP_URL', 'http://localhost:5173'),
  },
  db: {
    host: optionalEnv('DB_HOST', 'localhost'),
    port: parseInt(optionalEnv('DB_PORT', '5432'), 10),
    name: optionalEnv('DB_NAME', 'moone_brand'),
    user: optionalEnv('DB_USER', 'postgres'),
    password: optionalEnv('DB_PASSWORD', ''),
  },
  auth: {
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtRefreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    jwtExpiresIn: optionalEnv('JWT_EXPIRES_IN', '15m'),
    jwtRefreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  brevo: {
    apiKey: optionalEnv('BREVO_API_KEY', ''),
    fromEmail: optionalEnv('BREVO_FROM_EMAIL', 'noreply@mo.one'),
    fromName: optionalEnv('BREVO_FROM_NAME', 'Mo.one Brand'),
  },
} as const;

export const isDev = config.server.nodeEnv === 'development';
