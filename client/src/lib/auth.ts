// =============================================================================
// client/src/lib/auth.ts — Auth state helpers
// =============================================================================

import type { UserProfile } from '@shared/types';

const ACCESS_KEY = 'brand-access-token';
const REFRESH_KEY = 'brand-refresh-token';
const USER_KEY = 'brand-user';

export function storeTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function storeUser(user: UserProfile) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): UserProfile | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as UserProfile; } catch { return null; }
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem(ACCESS_KEY);
}

export function initTheme() {
  // Default dark
  const stored = localStorage.getItem('brand-theme') ?? 'dark';
  document.documentElement.classList.toggle('dark', stored === 'dark');
}
