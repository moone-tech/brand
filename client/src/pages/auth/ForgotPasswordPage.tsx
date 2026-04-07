// =============================================================================
// client/src/pages/auth/ForgotPasswordPage.tsx — Password reset request
// =============================================================================

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useTranslation } from '../../lib/i18n';
import { MooneLogo } from '../../components/MooneLogo';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
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
          <div className="flex justify-center mb-1"><MooneLogo height={30} style={{ color: 'var(--text)' }} /></div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>{t('forgot_subtitle')}</div>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="text-4xl">📬</div>
            <p style={{ color: 'var(--text)' }}>{t('forgot_sent')}</p>
            <Link to="/auth/login" className="text-sm hover:underline" style={{ color: 'var(--primary)' }}>
              {t('forgot_back')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-caps block mb-2">{t('forgot_email_label')}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none"
                style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}
                placeholder={t('forgot_placeholder')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              {loading ? t('forgot_sending') : t('forgot_submit')}
            </button>

            <div className="text-center">
              <Link to="/auth/login" className="text-sm hover:underline" style={{ color: 'var(--muted)' }}>
                {t('forgot_back')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
