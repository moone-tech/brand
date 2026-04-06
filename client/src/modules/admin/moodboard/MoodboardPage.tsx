// =============================================================================
// client/src/modules/admin/moodboard/MoodboardPage.tsx — Visual mood board
// =============================================================================

import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Link as LinkIcon, Palette, StickyNote, Image, Upload, Pencil, Check, X } from 'lucide-react';
import { api } from '../../../lib/api';
import type { MoodboardBoard, MoodboardItem, MoodboardItemType } from '@shared/types';
import { useAuth } from '../../../hooks/useAuth';
import { useTranslation } from '../../../lib/i18n';
import { cn } from '../../../lib/cn';

type ItemFormType = MoodboardItemType | 'image_upload';

const TYPE_ICONS: Record<MoodboardItemType, typeof Image> = {
  image: Image,
  url: LinkIcon,
  color: Palette,
  note: StickyNote,
};

// ---------------------------------------------------------------------------
// Inline note editor on a card
// ---------------------------------------------------------------------------

function NoteEditor({ item, canEdit }: { item: MoodboardItem; canEdit: boolean }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.note ?? '');

  const saveNote = useMutation({
    mutationFn: (note: string) => api.patch(`/moodboard/items/${item.id}/note`, { note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['moodboard-items', item.boardId] });
      setEditing(false);
    },
  });

  if (!canEdit && !item.note) return null;

  return (
    <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
      {editing ? (
        <div className="space-y-1.5">
          <textarea
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={3}
            className="w-full px-2 py-1.5 rounded-lg text-xs border focus:outline-none resize-none"
            style={{ background: 'var(--elevated)', borderColor: 'var(--primary)', color: 'var(--text)' }}
          />
          <div className="flex gap-1">
            <button
              onClick={() => saveNote.mutate(draft)}
              disabled={saveNote.isPending}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              <Check size={11} /> {t('moodboard_note_save')}
            </button>
            <button
              onClick={() => { setEditing(false); setDraft(item.note ?? ''); }}
              className="px-2 py-1 rounded-md text-xs"
              style={{ color: 'var(--muted)' }}
            >
              <X size={11} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-1.5 group/note">
          <p className="flex-1 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
            {item.note || (canEdit ? <em style={{ opacity: 0.5 }}>+ {t('moodboard_note_edit')}</em> : null)}
          </p>
          {canEdit && (
            <button
              onClick={() => { setDraft(item.note ?? ''); setEditing(true); }}
              className="opacity-0 group-hover/note:opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <Pencil size={11} style={{ color: 'var(--muted)' }} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function MoodboardPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();
  const canEdit = user?.role !== 'viewer';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [formType, setFormType] = useState<ItemFormType>('url');
  const [newItem, setNewItem] = useState<{ value: string; title: string; note: string }>({
    value: '',
    title: '',
    note: '',
  });
  const [uploading, setUploading] = useState(false);

  const TYPE_LABELS: Record<ItemFormType, string> = {
    image: t('moodboard_type_image'),
    image_upload: t('moodboard_type_image_upload'),
    url: t('moodboard_type_url'),
    color: t('moodboard_type_color'),
    note: t('moodboard_type_note'),
  };

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
    mutationFn: (payload: { type: MoodboardItemType; value: string; title: string; note: string }) =>
      api.post('/moodboard/items', { boardId: activeBoardId, ...payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['moodboard-items', activeBoardId] });
      setShowAddItem(false);
      setFormType('url');
      setNewItem({ value: '', title: '', note: '' });
    },
  });

  const deleteItem = useMutation({
    mutationFn: (id: string) => api.delete(`/moodboard/items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['moodboard-items', activeBoardId] }),
  });

  // Convert selected file to base64 data URL
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = ev => {
      setNewItem(p => ({ ...p, value: ev.target?.result as string }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }, []);

  function handleSubmit() {
    if (!newItem.value) return;
    const type: MoodboardItemType = formType === 'image_upload' ? 'image' : formType;
    createItem.mutate({ type, ...newItem });
  }

  function getValuePlaceholder() {
    switch (formType) {
      case 'color': return t('moodboard_value_placeholder_color');
      case 'note': return t('moodboard_value_placeholder_note');
      case 'image_upload': return '';
      default: return t('moodboard_value_placeholder_url');
    }
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{t('moodboard_title')}</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{t('moodboard_subtitle')}</p>
        </div>
        {canEdit && (
          <form
            onSubmit={e => { e.preventDefault(); if (newBoardName) createBoard.mutate(newBoardName); }}
            className="flex items-center gap-2"
          >
            <input
              value={newBoardName}
              onChange={e => setNewBoardName(e.target.value)}
              placeholder={t('moodboard_new_board')}
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
          <Plus size={15} /> {t('moodboard_add_item')}
        </button>
      )}

      {/* Add item form */}
      {showAddItem && (
        <div
          className="mb-6 p-5 rounded-2xl border space-y-4"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t('moodboard_new_item')}</p>

          {/* Type selector */}
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(TYPE_LABELS) as ItemFormType[]).map(type => (
              <button
                key={type}
                onClick={() => { setFormType(type); setNewItem(p => ({ ...p, value: '' })); }}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border')}
                style={{
                  background: formType === type ? 'var(--primary)' : 'var(--elevated)',
                  color: formType === type ? 'var(--primary-fg)' : 'var(--muted)',
                  borderColor: formType === type ? 'transparent' : 'var(--border)',
                }}
              >
                {type === 'image_upload' && <Upload size={12} />}
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          <input
            value={newItem.title}
            onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))}
            placeholder={t('moodboard_title_placeholder')}
            className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none"
            style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />

          {/* Value input — file picker or text */}
          {formType === 'image_upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {newItem.value ? (
                <div className="relative w-full rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                  <img src={newItem.value} alt="preview" className="w-full h-48 object-contain" style={{ background: 'var(--elevated)' }} />
                  <button
                    onClick={() => setNewItem(p => ({ ...p, value: '' }))}
                    className="absolute top-2 right-2 p-1.5 rounded-lg"
                    style={{ background: 'var(--destructive)', color: '#fff' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed text-sm font-medium transition-colors hover:border-[var(--primary)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)', background: 'var(--elevated)' }}
                >
                  <Upload size={18} />
                  {uploading ? t('moodboard_uploading') : t('moodboard_upload_click')}
                </button>
              )}
            </div>
          ) : (
            <input
              value={newItem.value}
              onChange={e => setNewItem(p => ({ ...p, value: e.target.value }))}
              placeholder={getValuePlaceholder()}
              className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none"
              style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!newItem.value || createItem.isPending}
              className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              {t('moodboard_add')}
            </button>
            <button
              onClick={() => setShowAddItem(false)}
              className="px-4 py-2 rounded-xl text-sm"
              style={{ color: 'var(--muted)' }}
            >
              {t('moodboard_cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Items grid */}
      {items.length === 0 && activeBoardId ? (
        <div className="text-center py-20">
          <Image size={32} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)' }}>{t('moodboard_empty')}</p>
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
                    ) : item.type === 'image' && item.value.startsWith('data:') ? (
                      <em>nahraný obrázek</em>
                    ) : (
                      item.value
                    )}
                  </p>
                  <NoteEditor item={item} canEdit={canEdit} />
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
