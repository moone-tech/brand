// =============================================================================
// client/src/modules/admin/attendance/AttendancePage.tsx — Login activity
// =============================================================================

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, TrendingUp } from 'lucide-react';
import { api } from '../../../lib/api';
import { useTranslation, type Lang } from '../../../lib/i18n';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AttendanceRow {
  id: string;
  name: string;
  email: string;
  role: string;
  last_login_at: string | null;
  logins_30d: string;
  logins_7d: string;
  active_days_30d: string;
  last_seen: string | null;
}

interface LoginEntry { logged_in_at: string }

interface UserAttendance {
  user: { id: string; name: string; email: string; role: string };
  history: LoginEntry[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const loc = (lang: Lang) => lang === 'cs' ? 'cs-CZ' : 'en-GB';

function fmtDate(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(loc(lang), { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtTime(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleTimeString(loc(lang), { hour: '2-digit', minute: '2-digit' });
}

function relativeTime(iso: string | null, t: (k: any) => string): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return t('attendance_just_now');
  if (mins < 60) return t('attendance_min_ago').replace('{n}', String(mins));
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('attendance_hours_ago').replace('{n}', String(hrs));
  const days = Math.floor(hrs / 24);
  if (days === 1) return t('attendance_yesterday');
  if (days < 30) return t('attendance_days_ago').replace('{n}', String(days));
  return '30+ d';
}

function ActivityBar({ logins }: { logins: number }) {
  const pct = Math.min(logins / 10, 1);
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--elevated)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: logins > 0 ? 'var(--primary)' : 'transparent' }} />
      </div>
      <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>{logins}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Heatmap strip (last 30 days)
// ---------------------------------------------------------------------------

function HeatmapStrip({ history, lang }: { history: LoginEntry[]; lang: Lang }) {
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
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
      <div className="flex gap-1" style={{ minWidth: 196 }}>
        {cells.map(c => (
          <div
            key={c.key}
            title={`${fmtDate(c.key + 'T00:00:00', lang)}: ${c.count}`}
            className="w-4 h-4 rounded-sm shrink-0"
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// User detail panel
// ---------------------------------------------------------------------------

function UserDetailPanel({ userId, onBack }: { userId: string; onBack: () => void }) {
  const { t, lang } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['attendance', userId],
    queryFn: () => api.get<{ data: UserAttendance }>(`/auth/users/${userId}/attendance`).then(r => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'var(--primary)' }} />
      </div>
    );
  }

  if (!data) return null;

  const byDate: Record<string, string[]> = {};
  data.history.forEach(e => {
    const d = e.logged_in_at.slice(0, 10);
    byDate[d] = byDate[d] ?? [];
    byDate[d]!.push(e.logged_in_at);
  });
  const dates = Object.keys(byDate).sort().reverse();

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70" style={{ color: 'var(--muted)' }}>
        <ChevronLeft size={15} /> {t('attendance_back')}
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0" style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}>
          {data.user.name[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate" style={{ color: 'var(--text)' }}>{data.user.name}</p>
          <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{data.user.email}</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="p-4 sm:p-5 rounded-2xl border mb-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <p className="label-caps mb-4">{t('attendance_heatmap')}</p>
        <HeatmapStrip history={data.history} lang={lang} />
      </div>

      {/* Log */}
      {dates.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>{t('attendance_no_activity')}</p>
      ) : (
        <div className="space-y-4">
          {dates.map(d => (
            <div key={d}>
              <p className="label-caps mb-2">{fmtDate(d + 'T00:00:00', lang)}</p>
              <div className="rounded-xl border divide-y overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                {byDate[d]!.map((ts, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{fmtTime(ts, lang)}</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{t('attendance_login')}</span>
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
// Mobile user card (shown below md breakpoint)
// ---------------------------------------------------------------------------

function UserCardMobile({ u, onClick, t }: { u: AttendanceRow; onClick: () => void; t: (k: any) => string }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border transition-colors hover:border-[var(--primary)]"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--elevated)', color: 'var(--muted)' }}>
          {u.name[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{u.name}</p>
          <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{u.email}</p>
        </div>
        <p className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>{relativeTime(u.last_seen, t)}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-[10px] mb-1" style={{ color: 'var(--muted)' }}>{t('attendance_col_7d')}</p>
          <ActivityBar logins={Number(u.logins_7d)} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] mb-1" style={{ color: 'var(--muted)' }}>{t('attendance_col_30d')}</p>
          <ActivityBar logins={Number(u.logins_30d)} />
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function AttendancePage() {
  const { t, lang } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => api.get<{ data: AttendanceRow[] }>('/auth/users/attendance').then(r => r.data.data),
    refetchInterval: 60_000,
  });

  if (selected) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl animate-fade-in">
        <UserDetailPanel userId={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>
          {t('attendance_title')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {t('attendance_subtitle')}
        </p>
      </div>

      {/* Summary stats — stack on mobile, 3-col on sm+ */}
      {data && (
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden border mb-6 sm:mb-8"
          style={{ borderColor: 'var(--border)', background: 'var(--border)' }}
        >
          {[
            { label: t('attendance_active_30d'), value: data.filter(u => Number(u.logins_30d) > 0).length },
            { label: t('attendance_total_30d'), value: data.reduce((s, u) => s + Number(u.logins_30d), 0) },
            { label: t('attendance_active_7d'), value: data.filter(u => Number(u.logins_7d) > 0).length },
          ].map(s => (
            <div key={s.label} className="px-4 py-4 sm:px-5 sm:py-5" style={{ background: 'var(--surface)' }}>
              <p className="text-2xl font-bold tracking-tight mb-0.5" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                {s.value}
              </p>
              <p className="text-xs leading-snug" style={{ color: 'var(--muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'var(--primary)' }} />
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ────────────────────────────────── */}
          <div className="hidden md:block max-w-3xl">
            <div className="grid grid-cols-[1fr_5rem_5rem_6rem] gap-4 px-4 pb-1">
              <span className="label-caps">{t('attendance_col_user')}</span>
              <span className="label-caps text-right">{t('attendance_col_7d')}</span>
              <span className="label-caps text-right">{t('attendance_col_30d')}</span>
              <span className="label-caps text-right">{t('attendance_col_last')}</span>
            </div>
            <div className="space-y-2">
              {(data ?? []).map(u => (
                <button
                  key={u.id}
                  onClick={() => setSelected(u.id)}
                  className="w-full text-left grid grid-cols-[1fr_5rem_5rem_6rem] gap-4 items-center px-4 py-3 rounded-xl border transition-colors hover:border-[var(--primary)]"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--elevated)', color: 'var(--muted)' }}>
                      {u.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{u.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{u.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-end"><ActivityBar logins={Number(u.logins_7d)} /></div>
                  <div className="flex justify-end"><ActivityBar logins={Number(u.logins_30d)} /></div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{relativeTime(u.last_seen, t)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Mobile cards (below md) ────────────────────────────── */}
          <div className="md:hidden space-y-2">
            {(data ?? []).map(u => (
              <UserCardMobile key={u.id} u={u} onClick={() => setSelected(u.id)} t={t} />
            ))}
          </div>
        </>
      )}

      <p className="text-xs mt-6 flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
        <TrendingUp size={11} /> {t('attendance_footer')}
      </p>
    </div>
  );
}
