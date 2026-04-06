// =============================================================================
// client/src/modules/admin/AdminDashboard.tsx — Admin workspace overview
// =============================================================================

import { Link } from 'react-router-dom';
import { Palette, Image, Kanban, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../lib/i18n';

export function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const CARDS = [
    {
      to: '/admin/ci',
      icon: Palette,
      label: t('nav_ci'),
      desc: t('dashboard_ci_desc'),
      color: 'var(--primary)',
    },
    {
      to: '/admin/moodboard',
      icon: Image,
      label: t('nav_moodboard'),
      desc: t('dashboard_moodboard_desc'),
      color: '#a855f7',
    },
    {
      to: '/admin/projects',
      icon: Kanban,
      label: t('nav_projects'),
      desc: t('dashboard_projects_desc'),
      color: 'var(--warning)',
    },
  ];

  return (
    <div className="p-8 animate-fade-in space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
          {t('dashboard_greeting')} {user?.name?.split(' ')[0] ?? t('dashboard_greeting_fallback')} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {t('dashboard_subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {CARDS.map(card => (
          <Link
            key={card.to}
            to={card.to}
            className="group p-6 rounded-2xl border transition-all hover:border-[var(--primary)]"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `color-mix(in srgb, ${card.color} 15%, transparent)` }}
            >
              <card.icon size={20} style={{ color: card.color }} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{card.label}</h3>
              <ArrowRight
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--primary)' }}
              />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{card.desc}</p>
          </Link>
        ))}
      </div>

      {user?.role === 'admin' && (
        <div>
          <p className="label-caps mb-4">{t('dashboard_admin_section')}</p>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <Users size={16} style={{ color: 'var(--muted)' }} />
            {t('dashboard_manage_users')}
          </Link>
        </div>
      )}
    </div>
  );
}
