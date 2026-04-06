// =============================================================================
// client/src/modules/admin/AdminDashboard.tsx — Admin workspace overview
// =============================================================================

import { Link } from 'react-router-dom';
import { Palette, Image, Kanban, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const CARDS = [
  {
    to: '/admin/ci',
    icon: Palette,
    label: 'CI Editor',
    desc: 'Edituj brand core — mise, hodnoty, hlas a positioning',
    color: 'var(--primary)',
  },
  {
    to: '/admin/moodboard',
    icon: Image,
    label: 'Mood Board',
    desc: 'Sbírej vizuální reference a inspiraci pro corporate identity',
    color: '#a855f7',
  },
  {
    to: '/admin/projects',
    icon: Kanban,
    label: 'Projekty',
    desc: 'Kanban board pro CI úkoly — To Do, In Progress, Review, Done',
    color: 'var(--warning)',
  },
];

export function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8 animate-fade-in space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
          Vítej, {user?.name?.split(' ')[0] ?? 'tady'} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Mo.one Brand Workspace — kde se buduje corporate identity.
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
          <p className="label-caps mb-4">Admin</p>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <Users size={16} style={{ color: 'var(--muted)' }} />
            Správa uživatelů
          </Link>
        </div>
      )}
    </div>
  );
}
