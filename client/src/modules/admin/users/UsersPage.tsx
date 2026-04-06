// =============================================================================
// client/src/modules/admin/users/UsersPage.tsx — User management (admin only)
// =============================================================================

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Trash2, ChevronDown } from 'lucide-react';
import { api } from '../../../lib/api';
import { useTranslation } from '../../../lib/i18n';
import type { UserProfile, UserRole, InviteUserInput } from '@shared/types';
import { useAuth } from '../../../hooks/useAuth';

const ROLES: UserRole[] = ['viewer', 'editor', 'admin'];

export function UsersPage() {
  const qc = useQueryClient();
  const { user: me } = useAuth();
  const { t } = useTranslation();

  const ROLE_LABELS: Record<UserRole, string> = {
    viewer: t('users_role_viewer'),
    editor: t('users_role_editor'),
    admin: t('users_role_admin'),
  };

  const [inviteForm, setInviteForm] = useState<InviteUserInput>({ email: '', name: '', role: 'editor' });
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [inviteError, setInviteError] = useState('');

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get<{ data: UserProfile[] }>('/auth/users').then(r => r.data.data),
  });

  const users = usersData ?? [];

  const invite = useMutation({
    mutationFn: (input: InviteUserInput) => api.post('/auth/users/invite', input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setInviteSuccess(`${t('users_invite_sent')} ${inviteForm.email}`);
      setInviteForm({ email: '', name: '', role: 'editor' });
      setTimeout(() => setInviteSuccess(''), 4000);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      setInviteError(msg ?? t('users_error'));
      setTimeout(() => setInviteError(''), 4000);
    },
  });

  const changeRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => api.patch(`/auth/users/${id}/role`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => api.delete(`/auth/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  return (
    <div className="p-8 animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--text)' }}>{t('users_title')}</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('users_subtitle')}</p>
      </div>

      {/* Invite form */}
      <div
        className="p-6 rounded-2xl border mb-8"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p className="font-semibold mb-4" style={{ color: 'var(--text)' }}>{t('users_invite_section')}</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <input
            type="email"
            value={inviteForm.email}
            onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
            placeholder={t('users_email_placeholder')}
            className="px-3 py-2.5 rounded-xl text-sm border focus:outline-none"
            style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
          <input
            value={inviteForm.name}
            onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))}
            placeholder={t('users_name_placeholder')}
            className="px-3 py-2.5 rounded-xl text-sm border focus:outline-none"
            style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
          <div className="relative">
            <select
              value={inviteForm.role}
              onChange={e => setInviteForm(f => ({ ...f, role: e.target.value as UserRole }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none appearance-none"
              style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setInviteError('');
              if (inviteForm.email && inviteForm.name) invite.mutate(inviteForm);
            }}
            disabled={!inviteForm.email || !inviteForm.name || invite.isPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40"
            style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
          >
            <Mail size={14} />
            {invite.isPending ? t('users_sending') : t('users_send_invite')}
          </button>
          {inviteSuccess && <p className="text-sm" style={{ color: 'var(--reward)' }}>{inviteSuccess}</p>}
          {inviteError && <p className="text-sm" style={{ color: 'var(--destructive)' }}>{inviteError}</p>}
        </div>

        <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
          {ROLE_LABELS[inviteForm.role]}. {t('users_expires')}
        </p>
      </div>

      {/* Users list */}
      <div className="space-y-2">
        {users.map(u => (
          <div
            key={u.id}
            className="flex items-center gap-4 px-4 py-3 rounded-xl border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--elevated)', color: 'var(--muted)' }}
            >
              {u.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                {u.name}
                {u.id === me?.id && (
                  <span className="ml-2 text-xs" style={{ color: 'var(--muted)' }}>{t('users_you')}</span>
                )}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{u.email}</p>
            </div>

            <div className="relative">
              <select
                value={u.role}
                onChange={e => changeRole.mutate({ id: u.id, role: e.target.value as UserRole })}
                disabled={u.id === me?.id}
                className="px-3 py-1.5 rounded-lg text-xs border focus:outline-none appearance-none pr-7 disabled:opacity-50"
                style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
            </div>

            {u.id !== me?.id && (
              <button
                onClick={() => {
                  if (confirm(`${t('users_remove_confirm')} ${u.name}?`)) deleteUser.mutate(u.id);
                }}
                className="opacity-30 hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} style={{ color: 'var(--destructive)' }} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
