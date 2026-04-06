// =============================================================================
// client/src/pages/auth/ResetPasswordPage.tsx — Set new password via token
// =============================================================================

import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      navigate('/auth/login?reset=1');
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
        <div className="text-center">
          <p style={{ color: 'var(--muted)' }}>Neplatný nebo vypršelý odkaz.</p>
          <Link to="/auth/forgot-password" className="text-sm hover:underline mt-2 block" style={{ color: 'var(--primary)' }}>
            Požádat o nový odkaz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>Mo.one</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Nové heslo</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
            style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
          >
            {loading ? 'Ukládám…' : 'Nastavit nové heslo'}
          </button>
        </form>
      </div>
    </div>
  );
}
