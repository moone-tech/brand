// =============================================================================
// client/src/lib/api.ts — Axios instance with auth and token refresh
// =============================================================================

import axios, { type AxiosError } from 'axios';
import type { ApiError } from '@shared/types';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('brand-access-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401: attempt token refresh (once per request — _retry flag prevents infinite loop)
let refreshing: Promise<void> | null = null;

api.interceptors.response.use(
  res => res,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as typeof error.config & { _retry?: boolean };
    // Bail out if not a 401, no config, or already retried — prevents infinite loop
    if (error.response?.status !== 401 || !original || original._retry) throw error;
    original._retry = true;

    if (!refreshing) {
      refreshing = (async () => {
        const refreshToken = localStorage.getItem('brand-refresh-token');
        if (!refreshToken) {
          localStorage.removeItem('brand-access-token');
          window.dispatchEvent(new Event('auth:logout'));
          return;
        }
        try {
          const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken });
          localStorage.setItem('brand-access-token', data.data.accessToken);
          localStorage.setItem('brand-refresh-token', data.data.refreshToken);
        } catch {
          localStorage.removeItem('brand-access-token');
          localStorage.removeItem('brand-refresh-token');
          window.dispatchEvent(new Event('auth:logout'));
        }
      })().finally(() => { refreshing = null; });
    }

    await refreshing;
    // Only retry if we successfully refreshed (token exists)
    if (!localStorage.getItem('brand-access-token')) throw error;
    return api(original);
  },
);
