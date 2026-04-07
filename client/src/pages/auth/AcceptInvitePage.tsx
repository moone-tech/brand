// =============================================================================
// client/src/pages/auth/AcceptInvitePage.tsx — Accept invitation & set password
// =============================================================================

import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { storeTokens, storeUser } from '../../lib/auth';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../lib/i18n';
import { MooneLogo } from '../../components/MooneLogo';
import type { UserProfile } from '@shared/types';

interface InvitePreview {
  name: string;
  email: string;
  invitedByName: string;
}

export function AcceptInvitePage() {
  const { t } = useTranslation();
  const { setUser } = useAuth();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();

  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [previewLoading, setPreviewLoading] = useState(true);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate token on mount and pre-fill name
  useEffect(() => {
    if (!token) { setPreviewLoading(false); return; }

    api.get<{ data: InvitePreview }>(`/auth/accept-invite?token=${encodeURIComponent(token)}`)
      .then(r => {
        setPreview(r.data.data);
        setName(r.data.data.name);
      })
      .catch((err: unknown) => {
        const msg = (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message;
        setPreviewError(msg ?? t('accept_invalid'));
      })
      .finally(() => setPreviewLoading(false));
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post<{
        data: { user: UserProfile; tokens: { accessToken: string; refreshToken: string } };
      }>('/auth/accept-invite', { token, name, password });

      storeTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
      storeUser(data.data.user);
      setUser(data.data.user);  // sync React auth state so ProtectedRoute lets the user through
      navigate('/admin');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message;
      setError(msg ?? t('accept_error'));
    } finally {
      setLoading(false);
    }
  }

  // ── No token in URL ────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
        <p style={{ color: 'var(--muted)' }}>{t('accept_invalid')}</p>
      </div>
    );
  }

  // ── Loading token validation ────────────────────────────────────────────────
  if (previewLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
        <div className="w-6 h-6 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'var(--primary)' }} />
      </div>
    );
  }

  // ── Token invalid / expired / already used ─────────────────────────────────
  if (previewError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-6"><MooneLogo height={30} style={{ color: 'var(--text)' }} /></div>
          <p className="text-sm mb-6" style={{ color: 'var(--destructive)' }}>{previewError}</p>
          <a
            href="/auth/login"
            className="text-sm hover:underline"
            style={{ color: 'var(--primary)' }}
          >
            {t('forgot_back')}
          </a>
        </div>
      </div>
    );
  }

  // ── Accept form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-1"><MooneLogo height={30} style={{ color: 'var(--text)' }} /></div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>{t('accept_subtitle')}</div>
          {preview && (
            <div className="mt-3 text-xs" style={{ color: 'var(--muted)' }}>
              {preview.invitedByName && `${preview.invitedByName} · `}{preview.email}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-caps block mb-2">{t('accept_name_label')}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none"
              style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder={t('accept_name_placeholder')}
            />
          </div>

          <div>
            <label className="label-caps block mb-2">{t('accept_pw_label')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none"
              style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder={t('accept_pw_placeholder')}
            />
          </div>

          {error && <p className="text-sm" style={{ color: 'var(--destructive)' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-60"
            style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
          >
            {loading ? t('accept_loading') : t('accept_submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
