// =============================================================================
// client/src/hooks/useAuth.ts — Auth context and hook
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '@shared/types';
import { api } from '../lib/api';
import { storeTokens, clearTokens, storeUser, getStoredUser, isLoggedIn } from '../lib/auth';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile) => void;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  setUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthState(): AuthState {
  const [user, setUserState] = useState<UserProfile | null>(getStoredUser);
  const [loading, setLoading] = useState(isLoggedIn());

  useEffect(() => {
    if (!isLoggedIn()) { setLoading(false); return; }
    api.get<{ data: UserProfile }>('/auth/me')
      .then(r => { setUserState(r.data.data); storeUser(r.data.data); })
      .catch(() => { clearTokens(); setUserState(null); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = () => { clearTokens(); setUserState(null); };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ data: { user: UserProfile; tokens: { accessToken: string; refreshToken: string } } }>(
      '/auth/login', { email, password },
    );
    storeTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
    storeUser(data.data.user);
    setUserState(data.data.user);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('brand-refresh-token');
    if (refreshToken) {
      try { await api.post('/auth/logout', { refreshToken }); } catch {}
    }
    clearTokens();
    setUserState(null);
  }, []);

  const setUser = useCallback((u: UserProfile) => {
    storeUser(u);
    setUserState(u);
  }, []);

  return { user, loading, login, logout, setUser };
}
