// =============================================================================
// client/src/layouts/AdminLayout.tsx — Admin workspace shell
// =============================================================================

import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, Palette, Image, Kanban, Users, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../lib/i18n';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '../lib/cn';

export function AdminLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, lang, setLang } = useTranslation();

  const NAV = [
    { to: '/admin', label: t('nav_admin'), icon: LayoutGrid, exact: true },
    { to: '/admin/ci', label: t('nav_ci'), icon: Palette },
    { to: '/admin/moodboard', label: t('nav_moodboard'), icon: Image },
    { to: '/admin/projects', label: t('nav_projects'), icon: Kanban },
  ];

  const ADMIN_NAV = [
    { to: '/admin/users', label: t('nav_users'), icon: Users },
  ];

  function isActive(to: string, exact = false) {
    return exact ? pathname === to : pathname.startsWith(to);
  }

  async function handleLogout() {
    await logout();
    navigate('/auth/login');
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col border-r"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <Link to="/" className="flex items-center gap-2 group" target="_blank">
            <span className="font-bold text-base tracking-tight" style={{ color: 'var(--text)' }}>Mo.one</span>
            <span className="label-caps">Brand</span>
            <ExternalLink size={11} className="opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: 'var(--muted)' }} />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          <p className="label-caps px-2 mb-2">Workspace</p>
          {NAV.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive(item.to, item.exact)
                  ? 'text-white'
                  : 'hover:opacity-80',
              )}
              style={{
                background: isActive(item.to, item.exact) ? 'var(--primary)' : 'transparent',
                color: isActive(item.to, item.exact) ? 'var(--primary-fg)' : 'var(--muted)',
              }}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <>
              <p className="label-caps px-2 mt-5 mb-2">Admin</p>
              {ADMIN_NAV.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  )}
                  style={{
                    background: isActive(item.to) ? 'var(--primary)' : 'transparent',
                    color: isActive(item.to) ? 'var(--primary-fg)' : 'var(--muted)',
                  }}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Controls: theme + lang */}
        <div className="px-3 py-2 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
          <ThemeToggle compact />
          <div className="flex gap-1 flex-1">
            {(['cs', 'en'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors"
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

        {/* User */}
        <div className="px-2 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--elevated)' }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
              title={t('logout')}
            >
              <LogOut size={14} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
