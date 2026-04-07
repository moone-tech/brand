// =============================================================================
// server/src/modules/auth/routes.ts — Auth HTTP handlers
// =============================================================================

import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import * as svc from './service';
import {
  loginSchema,
  registerFromInviteSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  inviteUserSchema,
  updateUserSchema,
} from './validation';

const router = Router();

// Public routes
router.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await svc.login(input);
    res.json({ data: result });
  } catch (err) { next(err); }
});

// Validate invite token and return invitation preview (name, email) before form submit
router.get('/accept-invite', async (req, res, next) => {
  try {
    const token = String(req.query['token'] ?? '');
    if (!token) { res.status(400).json({ error: { code: 'MISSING_TOKEN', message: 'Token je povinný' } }); return; }
    const invitation = await svc.previewInvite(token);
    res.json({ data: invitation });
  } catch (err) { next(err); }
});

router.post('/accept-invite', async (req, res, next) => {
  try {
    const input = registerFromInviteSchema.parse(req.body);
    const result = await svc.acceptInvite(input);
    res.status(201).json({ data: result });
  } catch (err) { next(err); }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    await svc.forgotPassword(email);
    res.json({ data: { message: 'Pokud email existuje, přijde odkaz na reset hesla.' } });
  } catch (err) { next(err); }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    await svc.resetPassword(token, password);
    res.json({ data: { message: 'Heslo bylo úspěšně změněno.' } });
  } catch (err) { next(err); }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    const tokens = await svc.refreshTokens(refreshToken);
    res.json({ data: tokens });
  } catch (err) { next(err); }
});

// Authenticated routes
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    await svc.logout(refreshToken);
    res.json({ data: { message: 'Odhlášení proběhlo úspěšně.' } });
  } catch (err) { next(err); }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await svc.getMe(req.user!.id);
    res.json({ data: user });
  } catch (err) { next(err); }
});

// Admin: user management
router.get('/users', authenticate, requireRole('admin'), async (_req, res, next) => {
  try {
    const users = await svc.listUsers();
    res.json({ data: users });
  } catch (err) { next(err); }
});

router.post('/users/invite', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const input = inviteUserSchema.parse(req.body);
    await svc.inviteUser(input, req.user!.id);
    res.status(201).json({ data: { message: 'Pozvánka odeslána.' } });
  } catch (err) { next(err); }
});

router.patch('/users/:id/role', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { role } = updateUserSchema.parse(req.body);
    if (!role) { res.status(400).json({ error: { code: 'MISSING_FIELD', message: 'Role je povinná' } }); return; }
    await svc.updateUserRole(req.params.id, role, req.user!.id);
    res.json({ data: { message: 'Role aktualizována.' } });
  } catch (err) { next(err); }
});

router.delete('/users/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    await svc.deleteUser(req.params.id, req.user!.id);
    res.json({ data: { message: 'Uživatel byl odstraněn.' } });
  } catch (err) { next(err); }
});

export { router as authRouter };
