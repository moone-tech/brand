// =============================================================================
// client/src/pages/auth/LoginPage.tsx — Admin login
// =============================================================================

import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/cn';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Neplatný email nebo heslo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>Mo.one</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Brand Workspace</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-caps block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={cn(
                'w-full px-4 py-3 rounded-xl text-sm transition-colors',
                'border focus:outline-none',
              )}
              style={{
                background: 'var(--elevated)',
                border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
                color: 'var(--text)',
              }}
              placeholder="tvuj@email.cz"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-caps">Heslo</label>
              <Link
                to="/auth/forgot-password"
                className="text-xs hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                Zapomenuté heslo
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition-colors"
              style={{
                background: 'var(--elevated)',
                border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
                color: 'var(--text)',
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--destructive)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-60"
            style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
          >
            {loading ? 'Přihlašování…' : 'Přihlásit se'}
          </button>
        </form>

        <p className="text-center text-xs mt-8" style={{ color: 'var(--muted)' }}>
          Nemáš přístup?{' '}
          <Link to="/" className="hover:underline" style={{ color: 'var(--text)' }}>
            Zpět na brand.mo.one
          </Link>
        </p>
      </div>
    </div>
  );
}
