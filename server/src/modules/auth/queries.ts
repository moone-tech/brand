// =============================================================================
// server/src/modules/auth/queries.ts — All SQL for auth module
// =============================================================================

import { db } from '../../lib/db';
import type { UUID, UserRole } from '@shared/types';

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

export async function createUser(data: {
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  invitedById: UUID | null;
}) {
  const { rows } = await db.query(
    `INSERT INTO users (email, name, role, password_hash, invited_by_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, name, role, avatar_url, last_login_at, invited_by_id, created_at, updated_at`,
    [data.email, data.name, data.role, data.passwordHash, data.invitedById],
  );
  return rows[0];
}

export async function updateUserLastLogin(id: UUID) {
  await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [id]);
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
     JOIN users u ON u.id = i.invited_by_id
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

export async function acceptInvitation(token: string) {
  await db.query(
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
