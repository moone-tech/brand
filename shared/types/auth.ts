// =============================================================================
// shared/types/auth.ts — Authentication and user management types
// =============================================================================

import type { UUID, ISODate, UserRole, InvitationStatus, BaseEntity } from './common';

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
  lastLoginAt: ISODate | null;
  invitedById: UUID | null;
}

/** Safe public profile (no sensitive fields) */
export type UserProfile = Omit<User, 'deletedAt'>;

// ---------------------------------------------------------------------------
// Invitation
// ---------------------------------------------------------------------------

export interface Invitation {
  id: UUID;
  email: string;
  name: string;
  role: UserRole;
  status: InvitationStatus;
  invitedById: UUID;
  invitedByName: string;
  expiresAt: ISODate;
  acceptedAt: ISODate | null;
  createdAt: ISODate;
}

// ---------------------------------------------------------------------------
// Auth request/response shapes
// ---------------------------------------------------------------------------

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterFromInviteInput {
  token: string;
  name: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

/** JWT access token payload */
export interface JwtPayload {
  id: UUID;
  email: string;
  role: UserRole;
}

// ---------------------------------------------------------------------------
// Invite management
// ---------------------------------------------------------------------------

export interface InviteUserInput {
  email: string;
  name: string;
  role: UserRole;
}
