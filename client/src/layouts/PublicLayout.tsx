// =============================================================================
// client/src/layouts/PublicLayout.tsx — Public brand portal shell
// =============================================================================

import { Link, useLocation, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Přehled' },
  { to: '/guidelines', label: 'Brand Guidelines' },
  { to: '/assets', label: 'Assety' },
];

export function PublicLayout() {
  const { pathname } = useLocation();

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

          <Link
            to="/auth/login"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            Tým →
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t mt-24 py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Mo.one</span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>© 2026 Mo.one a.s.</span>
        </div>
      </footer>
    </div>
  );
}
