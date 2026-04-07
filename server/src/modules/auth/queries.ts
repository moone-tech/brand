// =============================================================================
// server/src/modules/auth/queries.ts — All SQL for auth module
// =============================================================================

import { db } from '../../lib/db';
import { AppError } from '../../middleware/AppError';
import type { PoolClient } from 'pg';
import type { UUID, UserRole } from '@shared/types';

type Queryable = typeof db | PoolClient;

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function findUserByEmail(email: string) {
  const { rows } = await db.query(
    `SELECT id, email, name, role, password_hash, avatar_url, last_login_at, invited_by_id,
            created_at, updated_at, deleted_at
     FROM users WHERE email = $1 AND deleted_at IS NULL`,
    [email],
  );
  return rows[0] ?? null;
}

export async function findUserById(id: UUID) {
  const { rows } = await db.query(
    `SELECT id, email, name, role, avatar_url, last_login_at, invited_by_id,
            created_at, updated_at, deleted_at
     FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [id],
  );
  return rows[0] ?? null;
}

export async function listUsers() {
  const { rows } = await db.query(
    `SELECT u.id, u.email, u.name, u.role, u.avatar_url, u.last_login_at,
            u.invited_by_id, ib.name AS invited_by_name, u.created_at, u.updated_at
     FROM users u
     LEFT JOIN users ib ON ib.id = u.invited_by_id
     WHERE u.deleted_at IS NULL
     ORDER BY u.created_at ASC`,
  );
  return rows;
}

export async function createUser(
  data: {
    email: string;
    name: string;
    role: UserRole;
    passwordHash: string;
    invitedById: UUID | null;
  },
  qb: Queryable = db,
) {
  try {
    const { rows } = await qb.query(
      `INSERT INTO users (email, name, role, password_hash, invited_by_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, role, avatar_url, last_login_at, invited_by_id, created_at, updated_at`,
      [data.email, data.name, data.role, data.passwordHash, data.invitedById],
    );
    return rows[0];
  } catch (err: unknown) {
    const pgCode = (err as { code?: string })?.code;
    // 23505 = unique_violation (email already registered)
    if (pgCode === '23505') throw new AppError('CONFLICT', 'Uživatel s tímto emailem již existuje', 409);
    // 23503 = foreign_key_violation (inviter was hard-deleted)
    if (pgCode === '23503') throw new AppError('CONFLICT', 'Pozvánka odkazuje na neexistujícího uživatele', 409);
    throw err;
  }
}

export async function updateUserLastLogin(id: UUID) {
  await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [id]);
  await db.query('INSERT INTO login_log (user_id) VALUES ($1)', [id]);
}

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

export async function getAttendanceSummary() {
  const { rows } = await db.query(`
    SELECT
      u.id, u.name, u.email, u.role, u.last_login_at,
      COUNT(ll.id) FILTER (WHERE ll.logged_in_at > NOW() - INTERVAL '30 days')         AS logins_30d,
      COUNT(ll.id) FILTER (WHERE ll.logged_in_at > NOW() - INTERVAL '7 days')          AS logins_7d,
      COUNT(DISTINCT DATE(ll.logged_in_at)) FILTER (WHERE ll.logged_in_at > NOW() - INTERVAL '30 days') AS active_days_30d,
      MAX(ll.logged_in_at)                                                              AS last_seen
    FROM users u
    LEFT JOIN login_log ll ON ll.user_id = u.id
    WHERE u.deleted_at IS NULL
    GROUP BY u.id, u.name, u.email, u.role, u.last_login_at
    ORDER BY last_seen DESC NULLS LAST
  `);
  return rows;
}

export async function getUserLoginHistory(userId: UUID) {
  const { rows } = await db.query(
    `SELECT logged_in_at FROM login_log WHERE user_id = $1 ORDER BY logged_in_at DESC LIMIT 90`,
    [userId],
  );
  return rows;
}

export async function updateUserRole(id: UUID, role: UserRole) {
  await db.query('UPDATE users SET role = $1 WHERE id = $2 AND deleted_at IS NULL', [role, id]);
}

export async function softDeleteUser(id: UUID) {
  await db.query('UPDATE users SET deleted_at = NOW() WHERE id = $1', [id]);
}

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

export async function findInvitationByToken(token: string) {
  const { rows } = await db.query(
    `SELECT i.*, u.name AS invited_by_name
     FROM invitations i
     LEFT JOIN users u ON u.id = i.invited_by_id
     WHERE i.token = $1`,
    [token],
  );
  return rows[0] ?? null;
}

export async function createInvitation(data: {
  email: string;
  name: string;
  role: UserRole;
  token: string;
  invitedById: UUID;
}) {
  const { rows } = await db.query(
    `INSERT INTO invitations (email, name, role, token, invited_by_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.email, data.name, data.role, data.token, data.invitedById],
  );
  return rows[0];
}

export async function acceptInvitation(token: string, qb: Queryable = db) {
  await qb.query(
    'UPDATE invitations SET accepted_at = NOW() WHERE token = $1',
    [token],
  );
}

export async function listInvitations() {
  const { rows } = await db.query(
    `SELECT i.*, u.name AS invited_by_name
     FROM invitations i
     JOIN users u ON u.id = i.invited_by_id
     ORDER BY i.created_at DESC`,
  );
  return rows;
}

// ---------------------------------------------------------------------------
// Password reset tokens
// ---------------------------------------------------------------------------

export async function createPasswordResetToken(userId: UUID, token: string) {
  // Invalidate previous tokens
  await db.query(
    `UPDATE password_reset_tokens SET used_at = NOW()
     WHERE user_id = $1 AND used_at IS NULL`,
    [userId],
  );
  await db.query(
    `INSERT INTO password_reset_tokens (user_id, token) VALUES ($1, $2)`,
    [userId, token],
  );
}

export async function findPasswordResetToken(token: string) {
  const { rows } = await db.query(
    `SELECT prt.*, u.email, u.name
     FROM password_reset_tokens prt
     JOIN users u ON u.id = prt.user_id
     WHERE prt.token = $1 AND prt.used_at IS NULL AND prt.expires_at > NOW()`,
    [token],
  );
  return rows[0] ?? null;
}

export async function consumePasswordResetToken(token: string, newHash: string) {
  const { rows } = await db.query(
    `UPDATE password_reset_tokens SET used_at = NOW()
     WHERE token = $1 RETURNING user_id`,
    [token],
  );
  if (!rows[0]) return false;
  await db.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [newHash, rows[0].user_id],
  );
  return true;
}

// ---------------------------------------------------------------------------
// Refresh tokens
// ---------------------------------------------------------------------------

export async function createRefreshToken(userId: UUID, token: string, expiresAt: Date) {
  await db.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
    [userId, token, expiresAt],
  );
}

export async function findRefreshToken(token: string) {
  const { rows } = await db.query(
    `SELECT * FROM refresh_tokens
     WHERE token = $1 AND revoked_at IS NULL AND expires_at > NOW()`,
    [token],
  );
  return rows[0] ?? null;
}

export async function revokeRefreshToken(token: string) {
  await db.query(
    'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token = $1',
    [token],
  );
}

export async function revokeAllUserRefreshTokens(userId: UUID) {
  await db.query(
    'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
    [userId],
  );
}
