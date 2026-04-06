// =============================================================================
// server/src/modules/ci/queries.ts — CI settings SQL queries
// =============================================================================

import { db } from '../../lib/db';
import type { UUID } from '@shared/types';

export async function getCiSettings(): Promise<Record<string, unknown>> {
  const { rows } = await db.query('SELECT data FROM ci_settings WHERE id = 1');
  return (rows[0]?.data as Record<string, unknown>) ?? {};
}

export async function upsertCiSettings(
  data: Record<string, unknown>,
  updatedBy: UUID,
): Promise<void> {
  await db.query(
    `INSERT INTO ci_settings (id, data, updated_by)
     VALUES (1, $1, $2)
     ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW(), updated_by = $2`,
    [JSON.stringify(data), updatedBy],
  );
}
