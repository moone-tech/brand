// =============================================================================
// client/src/pages/auth/ForgotPasswordPage.tsx — Password reset request
// =============================================================================

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>Mo.one</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Reset hesla</div>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="text-4xl">📬</div>
            <p style={{ color: 'var(--text)' }}>Pokud email existuje, přišel ti odkaz na reset hesla.</p>
            <Link to="/auth/login" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              Zpět na přihlášení
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-caps block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none"
                style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}
                placeholder="tvuj@email.cz"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              {loading ? 'Odesílám…' : 'Odeslat odkaz'}
            </button>

            <div className="text-center">
              <Link to="/auth/login" className="text-sm hover:underline" style={{ color: 'var(--muted)' }}>
                Zpět na přihlášení
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
