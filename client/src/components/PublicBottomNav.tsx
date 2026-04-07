// =============================================================================
// client/src/components/PublicBottomNav.tsx — Mobile bottom navigation (public)
// Visible only on mobile (flex md:hidden). Fixed to bottom with safe-area padding.
// =============================================================================

import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, FolderOpen, LogIn } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { cn } from '../lib/cn';

export function PublicBottomNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const items = [
    { to: '/',           label: t('nav_overview'),   icon: Home,       exact: true },
    { to: '/guidelines', label: t('nav_guidelines'),  icon: BookOpen },
    { to: '/assets',     label: t('nav_assets'),      icon: FolderOpen },
    { to: '/auth/login', label: t('nav_team'),        icon: LogIn },
  ];

  function isActive(to: string, exact = false) {
    return exact ? pathname === to : pathname.startsWith(to);
  }

  return (
    <nav
      className="flex md:hidden fixed bottom-0 inset-x-0 z-50 border-t"
      style={{
        background: 'var(--background)',
        borderColor: 'var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {items.map(item => {
        const active = isActive(item.to, item.exact);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-w-0 transition-opacity',
              active ? '' : 'opacity-50 hover:opacity-80',
            )}
            style={{ color: active ? 'var(--primary)' : 'var(--muted)' }}
          >
            <item.icon size={20} strokeWidth={active ? 2.5 : 1.75} />
            <span className="text-[10px] font-semibold leading-none truncate w-full text-center px-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
