// =============================================================================
// client/src/layouts/PublicLayout.tsx — Public brand portal shell
// =============================================================================

import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { ThemeToggle } from '../components/ThemeToggle';
import { PublicBottomNav } from '../components/PublicBottomNav';

export function PublicLayout() {
  const { pathname } = useLocation();
  const { t, lang, setLang } = useTranslation();

  const NAV = [
    { to: '/', label: t('nav_overview') },
    { to: '/guidelines', label: t('nav_guidelines') },
    { to: '/assets', label: t('nav_assets') },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
            Mo.one
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: pathname === item.to ? 'var(--primary)' : 'var(--muted)',
                  background: pathname === item.to ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <div className="flex gap-1">
              {(['cs', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="text-xs font-semibold px-2 py-1 rounded-md transition-colors"
                  style={{
                    color: lang === l ? 'var(--text)' : 'var(--muted)',
                    background: lang === l ? 'var(--elevated)' : 'transparent',
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link
              to="/auth/login"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              {t('nav_team')}
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 pt-6 pb-mobile-nav md:pb-12">
        <Outlet />
      </main>

      {/* Footer — hidden on mobile (bottom nav replaces it) */}
      <footer className="hidden md:block border-t mt-24 py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Mo.one</span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>© 2026 Mo.one a.s.</span>
        </div>
      </footer>

      {/* Mobile bottom navigation */}
      <PublicBottomNav />
    </div>
  );
}
