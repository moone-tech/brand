// =============================================================================
// server/src/db/seed.ts — Create initial admin user
// Usage: npm run db:seed --workspace=server
// Reads ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD from env or prompts
// =============================================================================

import bcrypt from 'bcryptjs';
import { db } from '../lib/db';
import { logger } from '../lib/logger';

async function seed(): Promise<void> {
  const email = process.env.ADMIN_EMAIL ?? 'patrik@mo.one';
  const name = process.env.ADMIN_NAME ?? 'Patrik Štípák';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('Set ADMIN_PASSWORD env variable before running seed.');
    process.exit(1);
  }

  const { rows: existing } = await db.query(
    'SELECT id FROM users WHERE email = $1',
    [email],
  );

  if (existing.length > 0) {
    logger.info({ email }, 'Admin user already exists, skipping');
    await db.end();
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await db.query(
    `INSERT INTO users (email, name, role, password_hash)
     VALUES ($1, $2, 'admin', $3)`,
    [email, name, hash],
  );

  logger.info({ email, name }, 'Admin user created');
  await db.end();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
