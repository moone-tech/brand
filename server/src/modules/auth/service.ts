// =============================================================================
// server/src/modules/auth/service.ts — Auth use cases and orchestration
// =============================================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { config } from '../../config';
import { AppError } from '../../middleware/AppError';
import { withTransaction } from '../../lib/db';
import { sendInvitationEmail, sendPasswordResetEmail } from '../../lib/email';
import * as q from './queries';
import type {
  LoginInput,
  RegisterFromInviteInput,
  InviteUserInput,
  AuthResponse,
  AuthTokens,
  JwtPayload,
  UserRole,
  UUID,
} from '@shared/types';

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

function generateTokens(payload: JwtPayload): AuthTokens {
  const accessToken = jwt.sign(payload, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign(
    { id: payload.id },
    config.auth.jwtRefreshSecret,
    { expiresIn: config.auth.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'] },
  );

  return { accessToken, refreshToken };
}

function refreshTokenExpiry(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}

function secureToken(): string {
  return randomBytes(32).toString('hex');
}

// ---------------------------------------------------------------------------
// Auth use cases
// ---------------------------------------------------------------------------

export async function login(input: LoginInput): Promise<AuthResponse> {
  const user = await q.findUserByEmail(input.email);
  if (!user || !user.password_hash) {
    throw new AppError('UNAUTHORIZED', 'Neplatný email nebo heslo', 401);
  }

  const valid = await bcrypt.compare(input.password, user.password_hash);
  if (!valid) throw new AppError('UNAUTHORIZED', 'Neplatný email nebo heslo', 401);

  await q.updateUserLastLogin(user.id);

  const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
  const tokens = generateTokens(payload);
  await q.createRefreshToken(user.id, tokens.refreshToken, refreshTokenExpiry());

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatar_url,
      lastLoginAt: user.last_login_at,
      invitedById: user.invited_by_id,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
    tokens,
  };
}

export async function refreshTokens(token: string): Promise<AuthTokens> {
  const record = await q.findRefreshToken(token);
  if (!record) throw new AppError('UNAUTHORIZED', 'Neplatný refresh token', 401);

  const user = await q.findUserById(record.user_id);
  if (!user) throw new AppError('UNAUTHORIZED', 'Uživatel nenalezen', 401);

  await q.revokeRefreshToken(token);

  const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
  const tokens = generateTokens(payload);
  await q.createRefreshToken(user.id, tokens.refreshToken, refreshTokenExpiry());

  return tokens;
}

export async function logout(refreshToken: string): Promise<void> {
  await q.revokeRefreshToken(refreshToken);
}

// ---------------------------------------------------------------------------
// Invitation flow
// ---------------------------------------------------------------------------

export async function inviteUser(input: InviteUserInput, invitedById: UUID): Promise<void> {
  const existing = await q.findUserByEmail(input.email);
  if (existing) throw new AppError('CONFLICT', 'Uživatel s tímto emailem již existuje', 409);

  const token = secureToken();
  const inviter = await q.findUserById(invitedById);
  if (!inviter) throw new AppError('NOT_FOUND', 'Zvaný uživatel nenalezen', 404);

  await q.createInvitation({
    email: input.email,
    name: input.name,
    role: input.role,
    token,
    invitedById,
  });

  const inviteUrl = `${config.server.appUrl}/auth/accept-invite?token=${token}`;
  await sendInvitationEmail({
    to: { email: input.email, name: input.name },
    invitedByName: inviter.name,
    inviteUrl,
  });
}

export async function previewInvite(token: string): Promise<{ name: string; email: string; invitedByName: string }> {
  const invitation = await q.findInvitationByToken(token);
  if (!invitation) throw new AppError('NOT_FOUND', 'Pozvánka nenalezena nebo vypršela', 404);
  if (invitation.accepted_at) throw new AppError('CONFLICT', 'Pozvánka byla již použita', 409);
  if (new Date(invitation.expires_at) < new Date()) {
    throw new AppError('EXPIRED', 'Platnost pozvánky vypršela', 410);
  }
  return {
    name: invitation.name,
    email: invitation.email,
    invitedByName: invitation.invited_by_name ?? '',
  };
}

export async function acceptInvite(input: RegisterFromInviteInput): Promise<AuthResponse> {
  // Validate invitation before touching the DB transactionally
  const invitation = await q.findInvitationByToken(input.token);
  if (!invitation) throw new AppError('NOT_FOUND', 'Pozvánka nenalezena', 404);
  if (invitation.accepted_at) throw new AppError('CONFLICT', 'Pozvánka byla již použita', 409);
  if (new Date(invitation.expires_at) < new Date()) {
    throw new AppError('EXPIRED', 'Platnost pozvánky vypršela', 410);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  // Create user + mark invitation accepted atomically so partial state is impossible
  const user = await withTransaction(async (client) => {
    const newUser = await q.createUser(
      {
        email: invitation.email,
        name: input.name,
        role: invitation.role as UserRole,
        passwordHash,
        invitedById: invitation.invited_by_id,
      },
      client,
    );
    await q.acceptInvitation(input.token, client);
    return newUser;
  });

  const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
  const tokens = generateTokens(payload);
  await q.createRefreshToken(user.id, tokens.refreshToken, refreshTokenExpiry());

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatar_url ?? null,
      lastLoginAt: user.last_login_at ?? null,
      invitedById: user.invited_by_id ?? null,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
    tokens,
  };
}

// ---------------------------------------------------------------------------
// Password reset flow
// ---------------------------------------------------------------------------

export async function forgotPassword(email: string): Promise<void> {
  const user = await q.findUserByEmail(email);
  // Always return success to prevent user enumeration
  if (!user || !user.password_hash) return;

  const token = secureToken();
  await q.createPasswordResetToken(user.id, token);

  const resetUrl = `${config.server.appUrl}/auth/reset-password?token=${token}`;
  await sendPasswordResetEmail({ to: { email: user.email, name: user.name }, resetUrl });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const record = await q.findPasswordResetToken(token);
  if (!record) throw new AppError('NOT_FOUND', 'Token je neplatný nebo vypršel', 404);

  const passwordHash = await bcrypt.hash(newPassword, 12);
  const ok = await q.consumePasswordResetToken(token, passwordHash);
  if (!ok) throw new AppError('NOT_FOUND', 'Token je neplatný nebo vypršel', 404);
}

// ---------------------------------------------------------------------------
// User management
// ---------------------------------------------------------------------------

export async function listUsers() {
  return q.listUsers();
}

export async function updateUserRole(targetId: UUID, role: UserRole, requesterId: UUID): Promise<void> {
  if (targetId === requesterId) throw new AppError('CONFLICT', 'Nelze změnit vlastní roli', 409);
  await q.updateUserRole(targetId, role);
}

export async function deleteUser(targetId: UUID, requesterId: UUID): Promise<void> {
  if (targetId === requesterId) throw new AppError('CONFLICT', 'Nelze odstranit vlastní účet', 409);
  await q.revokeAllUserRefreshTokens(targetId);
  await q.softDeleteUser(targetId);
}

export async function getMe(id: UUID) {
  const user = await q.findUserById(id);
  if (!user) throw new AppError('NOT_FOUND', 'Uživatel nenalezen', 404);
  return user;
}
