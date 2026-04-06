// =============================================================================
// client/src/pages/auth/AcceptInvitePage.tsx — Accept invitation & set password
// =============================================================================

import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { storeTokens, storeUser } from '../../lib/auth';
import type { UserProfile } from '@shared/types';

export function AcceptInvitePage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post<{ data: { user: UserProfile; tokens: { accessToken: string; refreshToken: string } } }>(
        '/auth/accept-invite',
        { token, name, password },
      );
      storeTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
      storeUser(data.data.user);
      navigate('/admin');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setError(msg ?? 'Nastala chyba, zkus to znovu.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
        <p style={{ color: 'var(--muted)' }}>Neplatný odkaz.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>Mo.one</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Přijmout pozvánku</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-caps block mb-2">Tvoje jméno</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none"
              style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="Jméno Příjmení"
            />
          </div>

          <div>
            <label className="label-caps block mb-2">Nové heslo</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none"
              style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}
              placeholder="Min. 8 znaků, velké písmeno, číslice"
            />
          </div>

          {error && <p className="text-sm" style={{ color: 'var(--destructive)' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-60"
            style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
          >
            {loading ? 'Nastavuji účet…' : 'Aktivovat účet'}
          </button>
        </form>
      </div>
    </div>
  );
}
