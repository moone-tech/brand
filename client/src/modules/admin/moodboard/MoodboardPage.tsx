// =============================================================================
// client/src/modules/admin/moodboard/MoodboardPage.tsx — Visual mood board
// =============================================================================

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Link as LinkIcon, Palette, StickyNote, Image } from 'lucide-react';
import { api } from '../../../lib/api';
import type { MoodboardBoard, MoodboardItem, MoodboardItemType } from '@shared/types';
import { useAuth } from '../../../hooks/useAuth';
import { cn } from '../../../lib/cn';

const TYPE_ICONS: Record<MoodboardItemType, typeof Image> = {
  image: Image,
  url: LinkIcon,
  color: Palette,
  note: StickyNote,
};

const TYPE_LABELS: Record<MoodboardItemType, string> = {
  image: 'Obrázek (URL)',
  url: 'Odkaz',
  color: 'Barva (hex)',
  note: 'Poznámka',
};

export function MoodboardPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const canEdit = user?.role !== 'viewer';

  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<{ type: MoodboardItemType; value: string; title: string; note: string }>({
    type: 'url',
    value: '',
    title: '',
    note: '',
  });

  const { data: boardsData } = useQuery({
    queryKey: ['moodboard-boards'],
    queryFn: () => api.get<{ data: MoodboardBoard[] }>('/moodboard/boards').then(r => r.data.data),
  });

  const boards = boardsData ?? [];
  const activeBoardId = selectedBoard ?? boards[0]?.id ?? null;

  const { data: itemsData } = useQuery({
    queryKey: ['moodboard-items', activeBoardId],
    queryFn: () => api.get<{ data: MoodboardItem[] }>(`/moodboard/boards/${activeBoardId}/items`).then(r => r.data.data),
    enabled: !!activeBoardId,
  });

  const items = itemsData ?? [];

  const createBoard = useMutation({
    mutationFn: (name: string) => api.post('/moodboard/boards', { name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['moodboard-boards'] }); setNewBoardName(''); },
  });

  const createItem = useMutation({
    mutationFn: () => api.post('/moodboard/items', { boardId: activeBoardId, ...newItem }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['moodboard-items', activeBoardId] });
      setShowAddItem(false);
      setNewItem({ type: 'url', value: '', title: '', note: '' });
    },
  });

  const deleteItem = useMutation({
    mutationFn: (id: string) => api.delete(`/moodboard/items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['moodboard-items', activeBoardId] }),
  });

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Mood Board</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Vizuální reference a inspirace pro CI</p>
        </div>
        {canEdit && (
          <form
            onSubmit={e => { e.preventDefault(); if (newBoardName) createBoard.mutate(newBoardName); }}
            className="flex items-center gap-2"
          >
            <input
              value={newBoardName}
              onChange={e => setNewBoardName(e.target.value)}
              placeholder="Nový board…"
              className="px-3 py-2 rounded-xl text-sm border focus:outline-none w-44"
              style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
            <button
              type="submit"
              disabled={!newBoardName}
              className="p-2 rounded-xl disabled:opacity-40"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              <Plus size={16} />
            </button>
          </form>
        )}
      </div>

      {/* Board tabs */}
      {boards.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {boards.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBoard(b.id)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={{
                background: activeBoardId === b.id ? 'var(--primary)' : 'var(--surface)',
                color: activeBoardId === b.id ? 'var(--primary-fg)' : 'var(--muted)',
                border: `1px solid ${activeBoardId === b.id ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}

      {/* Add item button */}
      {activeBoardId && canEdit && !showAddItem && (
        <button
          onClick={() => setShowAddItem(true)}
          className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:border-[var(--primary)]"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          <Plus size={15} /> Přidat položku
        </button>
      )}

      {/* Add item form */}
      {showAddItem && (
        <div
          className="mb-6 p-5 rounded-2xl border space-y-4"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Nová položka</p>

          {/* Type selector */}
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(TYPE_LABELS) as MoodboardItemType[]).map(type => (
              <button
                key={type}
                onClick={() => setNewItem(p => ({ ...p, type }))}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border')}
                style={{
                  background: newItem.type === type ? 'var(--primary)' : 'var(--elevated)',
                  color: newItem.type === type ? 'var(--primary-fg)' : 'var(--muted)',
                  borderColor: newItem.type === type ? 'transparent' : 'var(--border)',
                }}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          <input
            value={newItem.title}
            onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
            placeholder="Název (volitelný)"
            className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none"
            style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
          <input
            value={newItem.value}
            onChange={e => setNewItem(p => ({ ...p, value: e.target.value }))}
            placeholder={newItem.type === 'color' ? '#3b82f6' : newItem.type === 'note' ? 'Text poznámky…' : 'URL…'}
            className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none"
            style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />

          <div className="flex gap-2">
            <button
              onClick={() => newItem.value && createItem.mutate()}
              disabled={!newItem.value}
              className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              Přidat
            </button>
            <button
              onClick={() => setShowAddItem(false)}
              className="px-4 py-2 rounded-xl text-sm"
              style={{ color: 'var(--muted)' }}
            >
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* Items grid */}
      {items.length === 0 && activeBoardId ? (
        <div className="text-center py-20">
          <Image size={32} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)' }}>Board je prázdný. Přidej první položku.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => {
            const Icon = TYPE_ICONS[item.type];
            return (
              <div
                key={item.id}
                className="group relative rounded-2xl border overflow-hidden"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                {/* Preview */}
                {item.type === 'image' ? (
                  <img src={item.value} alt={item.title ?? ''} className="w-full h-40 object-cover" loading="lazy" />
                ) : item.type === 'color' ? (
                  <div className="w-full h-40" style={{ background: item.value }} />
                ) : (
                  <div
                    className="w-full h-40 flex items-center justify-center"
                    style={{ background: 'var(--elevated)' }}
                  >
                    <Icon size={28} style={{ color: 'var(--muted)' }} />
                  </div>
                )}

                {/* Info */}
                <div className="p-3">
                  {item.title && (
                    <p className="text-xs font-medium truncate mb-1" style={{ color: 'var(--text)' }}>{item.title}</p>
                  )}
                  <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                    {item.type === 'url' ? (
                      <a href={item.value} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: 'var(--primary)' }}>
                        {item.value}
                      </a>
                    ) : item.value}
                  </p>
                </div>

                {/* Delete */}
                {canEdit && (
                  <button
                    onClick={() => deleteItem.mutate(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'var(--destructive)', color: '#fff' }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
