// =============================================================================
// client/src/layouts/PublicLayout.tsx — Public brand portal shell
// Mobile header: Apple-style — logo · search · hamburger
// Desktop header: logo · nav · controls (unchanged)
// =============================================================================

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { ThemeToggle } from '../components/ThemeToggle';
import { MooneLogo } from '../components/MooneLogo';
import { cn } from '../lib/cn';

export function PublicLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, lang, setLang } = useTranslation();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const NAV = [
    { to: '/',            label: t('nav_overview') },
    { to: '/guidelines',  label: t('nav_guidelines') },
    { to: '/assets',      label: t('nav_assets') },
  ];

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [pathname]);

  // Auto-focus search input when it opens
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Route to assets or guidelines based on query — placeholder
    navigate('/assets');
    setSearchOpen(false);
  }

  function toggleMenu() {
    setMenuOpen(v => !v);
    if (searchOpen) setSearchOpen(false);
  }

  function toggleSearch() {
    setSearchOpen(v => !v);
    if (menuOpen) setMenuOpen(false);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b pt-safe"
        style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
      >
        {/* Main bar — same height on all screen sizes */}
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0" style={{ color: 'var(--text)' }}>
            <MooneLogo height={20} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                style={{
                  color: pathname === item.to ? 'var(--primary)' : 'var(--muted)',
                  background: pathname === item.to
                    ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                    : 'transparent',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right controls */}
          <div className="hidden md:flex items-center gap-1.5">
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
              className="text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
              style={{ color: 'var(--muted)' }}
            >
              {t('nav_team')}
            </Link>
          </div>

          {/* Mobile controls — search + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={toggleSearch}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
              style={{
                background: searchOpen ? 'var(--elevated)' : 'transparent',
                color: 'var(--text)',
              }}
              aria-label="Search"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
            <button
              onClick={toggleMenu}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
              style={{
                background: menuOpen ? 'var(--elevated)' : 'transparent',
                color: 'var(--text)',
              }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={18} /> : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <line x1="2" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="2" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div
            className="md:hidden border-t px-4 py-3"
            style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
          >
            <form onSubmit={handleSearchSubmit}>
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                style={{ background: 'var(--elevated)' }}
              >
                <Search size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={lang === 'cs' ? 'Hledat…' : 'Search…'}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text)' }}
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
          >
            {/* Nav links */}
            <nav className="px-3 pt-3 pb-2 space-y-0.5">
              {NAV.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-colors"
                  style={{
                    color: pathname === item.to ? 'var(--primary)' : 'var(--text)',
                    background: pathname === item.to
                      ? 'color-mix(in srgb, var(--primary) 8%, transparent)'
                      : 'transparent',
                  }}
                >
                  {item.label}
                  {pathname === item.to && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
                  )}
                </Link>
              ))}
              <Link
                to="/auth/login"
                className="flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-colors"
                style={{ color: 'var(--muted)' }}
              >
                {t('nav_team')} →
              </Link>
            </nav>

            {/* Bottom controls */}
            <div
              className="px-4 py-3 border-t flex items-center gap-3"
              style={{ borderColor: 'var(--border)' }}
            >
              <ThemeToggle compact />
              <div className="flex gap-1 ml-auto">
                {(['cs', 'en'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      background: lang === l ? 'var(--elevated)' : 'transparent',
                      color: lang === l ? 'var(--text)' : 'var(--muted)',
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Content — overflow-x:hidden so hero's -mx-6 negative margin doesn't cause scrollbar */}
      <main
        className="max-w-6xl mx-auto px-6 pb-12 overflow-x-hidden"
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <MooneLogo height={16} style={{ color: 'var(--text)' }} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>© 2026 Mo.one a.s.</span>
        </div>
      </footer>
    </div>
  );
}
