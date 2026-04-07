// =============================================================================
// client/src/modules/admin/attendance/AttendancePage.tsx — Login activity
// =============================================================================

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, TrendingUp } from 'lucide-react';
import { api } from '../../../lib/api';
import { useTranslation } from '../../../lib/i18n';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AttendanceRow {
  id: string;
  name: string;
  email: string;
  role: string;
  last_login_at: string | null;
  logins_30d: string;   // pg returns bigint as string
  logins_7d: string;
  active_days_30d: string;
  last_seen: string | null;
}

interface LoginEntry {
  logged_in_at: string;
}

interface UserAttendance {
  user: { id: string; name: string; email: string; role: string };
  history: LoginEntry[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('cs-CZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function relativeTime(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'právě teď';
  if (mins < 60) return `před ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `před ${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'včera';
  if (days < 30) return `před ${days} d`;
  return fmtDate(iso);
}

function activityBar(logins: number): React.ReactNode {
  const max = 10;
  const pct = Math.min(logins / max, 1);
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--elevated)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct * 100}%`, background: logins > 0 ? 'var(--primary)' : 'transparent' }}
        />
      </div>
      <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>{logins}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Day heatmap strip (last 30 days)
// ---------------------------------------------------------------------------

function HeatmapStrip({ history }: { history: LoginEntry[] }) {
  const days: Record<string, number> = {};
  history.forEach(e => {
    const d = e.logged_in_at.slice(0, 10);
    days[d] = (days[d] ?? 0) + 1;
  });

  const cells = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - i * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    return { key, count: days[key] ?? 0 };
  }).reverse();

  return (
    <div className="flex gap-1 flex-wrap">
      {cells.map(c => (
        <div
          key={c.key}
          title={`${c.key}: ${c.count} přihlášení`}
          className="w-4 h-4 rounded-sm"
          style={{
            background: c.count === 0
              ? 'var(--elevated)'
              : c.count === 1
              ? 'color-mix(in srgb, var(--primary) 40%, transparent)'
              : 'var(--primary)',
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail panel
// ---------------------------------------------------------------------------

function UserDetailPanel({ userId, onBack }: { userId: string; onBack: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['attendance', userId],
    queryFn: () => api.get<{ data: UserAttendance }>(`/auth/users/${userId}/attendance`)
      .then(r => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'var(--primary)' }} />
      </div>
    );
  }

  if (!data) return null;

  // Group history by date
  const byDate: Record<string, string[]> = {};
  data.history.forEach(e => {
    const d = e.logged_in_at.slice(0, 10);
    byDate[d] = byDate[d] ?? [];
    byDate[d].push(e.logged_in_at);
  });

  const dates = Object.keys(byDate).sort().reverse();

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: 'var(--muted)' }}
      >
        <ChevronLeft size={15} />
        Přehled docházky
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
          style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
        >
          {data.user.name[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>{data.user.name}</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{data.user.email}</p>
        </div>
      </div>

      {/* Heatmap */}
      <div
        className="p-5 rounded-2xl border mb-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p className="label-caps mb-4">Aktivita – posledních 30 dní</p>
        <HeatmapStrip history={data.history} />
      </div>

      {/* Log */}
      {dates.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>Žádná zaznamenaná aktivita.</p>
      ) : (
        <div className="space-y-4">
          {dates.map(d => (
            <div key={d}>
              <p className="label-caps mb-2">{fmtDate(d + 'T00:00:00')}</p>
              <div
                className="rounded-xl border divide-y overflow-hidden"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              >
                {byDate[d].map((ts, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text)' }}>
                      {new Date(ts).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>přihlášení</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function AttendancePage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => api.get<{ data: AttendanceRow[] }>('/auth/users/attendance').then(r => r.data.data),
    refetchInterval: 60_000,
  });

  if (selected) {
    return (
      <div className="p-8 max-w-2xl animate-fade-in">
        <UserDetailPanel userId={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
          {t('nav_attendance')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Přihlášení uživatelů za posledních 30 dní. Klikni na uživatele pro detail.
        </p>
      </div>

      {/* Summary stats */}
      {data && (
        <div
          className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden border mb-8"
          style={{ borderColor: 'var(--border)', background: 'var(--border)' }}
        >
          {[
            { label: 'Aktivní uživatelé (30 d)', value: data.filter(u => Number(u.logins_30d) > 0).length },
            { label: 'Celkem přihlášení (30 d)', value: data.reduce((s, u) => s + Number(u.logins_30d), 0) },
            { label: 'Aktivní tento týden',       value: data.filter(u => Number(u.logins_7d) > 0).length },
          ].map(s => (
            <div key={s.label} className="px-5 py-5" style={{ background: 'var(--surface)' }}>
              <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                {s.value}
              </p>
              <p className="text-xs leading-snug" style={{ color: 'var(--muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Users table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'var(--primary)' }} />
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 pb-1">
            <span className="label-caps">Uživatel</span>
            <span className="label-caps w-20 text-right">7 dní</span>
            <span className="label-caps w-20 text-right">30 dní</span>
            <span className="label-caps w-24 text-right">Naposledy</span>
          </div>

          {(data ?? []).map(u => (
            <button
              key={u.id}
              onClick={() => setSelected(u.id)}
              className="w-full text-left grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3 rounded-xl border transition-colors hover:border-[var(--text)]"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              {/* User */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'var(--elevated)', color: 'var(--muted)' }}
                >
                  {u.name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{u.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{u.email}</p>
                </div>
              </div>

              {/* 7d bar */}
              <div className="w-20 flex justify-end">
                {activityBar(Number(u.logins_7d))}
              </div>

              {/* 30d bar */}
              <div className="w-20 flex justify-end">
                {activityBar(Number(u.logins_30d))}
              </div>

              {/* Last seen */}
              <div className="w-24 text-right">
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {relativeTime(u.last_seen)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-xs mt-6 flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
        <TrendingUp size={11} />
        Data se aktualizují každou minutu. Historická data jsou dostupná od prvního přihlášení po aktivaci modulu.
      </p>
    </div>
  );
}
