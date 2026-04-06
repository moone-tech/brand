// =============================================================================
// server/src/modules/auth/validation.ts — Zod schemas for auth endpoints
// =============================================================================

import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Heslo musí mít alespoň 8 znaků')
  .regex(/[A-Z]/, 'Heslo musí obsahovat velké písmeno')
  .regex(/[0-9]/, 'Heslo musí obsahovat číslici');

export const loginSchema = z.object({
  email: z.string().email('Neplatný email'),
  password: z.string().min(1, 'Heslo je povinné'),
});

export const registerFromInviteSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(2, 'Jméno musí mít alespoň 2 znaky'),
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Neplatný email'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const inviteUserSchema = z.object({
  email: z.string().email('Neplatný email'),
  name: z.string().min(2, 'Jméno musí mít alespoň 2 znaky'),
  role: z.enum(['admin', 'editor', 'viewer']),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
});
