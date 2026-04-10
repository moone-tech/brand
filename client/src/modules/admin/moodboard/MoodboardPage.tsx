// =============================================================================
// client/src/modules/admin/moodboard/MoodboardPage.tsx — Visual mood board
// =============================================================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Trash2, Link as LinkIcon, Palette, StickyNote, Image, Upload,
  Pencil, Check, X, FileText, Bold, Italic, Heading2, Heading3,
  Quote, Link2, Download, Eye, ChevronLeft,
} from 'lucide-react';
import { api } from '../../../lib/api';
import type { MoodboardBoard, MoodboardItem, MoodboardItemType } from '@shared/types';
import { useAuth } from '../../../hooks/useAuth';
import { useTranslation } from '../../../lib/i18n';
import { cn } from '../../../lib/cn';

type FormOnlyType = 'image' | 'image_upload' | 'url' | 'color' | 'note';
type ItemFormType = MoodboardItemType | 'image_upload';
type PageTab = 'moodboard' | 'articles' | 'documents';

const TYPE_ICONS: Record<MoodboardItemType, typeof Image> = {
  image: Image,
  url: LinkIcon,
  color: Palette,
  note: StickyNote,
  article: FileText,
  document: FileText,
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
// Article editor
// ---------------------------------------------------------------------------

interface ArticleEditorProps {
  boardId: string;
  onSave: () => void;
  onCancel: () => void;
}

function ArticleEditor({ boardId, onSave, onCancel }: ArticleEditorProps) {
  const qc = useQueryClient();
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const handleSave = async () => {
    if (!title.trim() || !editorRef.current) return;
    setSaving(true);
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.innerText ?? '';
    const excerpt = text.slice(0, 180).trim();
    try {
      await api.post('/moodboard/items', {
        boardId,
        type: 'article',
        title: title.trim(),
        value: html,
        note: excerpt,
      });
      qc.invalidateQueries({ queryKey: ['moodboard-items', boardId] });
      onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 p-2 rounded-xl border flex-wrap"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {[
          { Icon: Bold,      cmd: 'bold',          title: 'Bold' },
          { Icon: Italic,    cmd: 'italic',         title: 'Italic' },
          { Icon: Heading2,  cmd: 'formatBlock',    val: 'h2', title: 'Heading 2' },
          { Icon: Heading3,  cmd: 'formatBlock',    val: 'h3', title: 'Heading 3' },
          { Icon: Quote,     cmd: 'formatBlock',    val: 'blockquote', title: 'Quote' },
        ].map(({ Icon, cmd, val, title: tip }) => (
          <button
            key={tip}
            title={tip}
            onMouseDown={e => { e.preventDefault(); exec(cmd, val); }}
            className="p-2 rounded-lg hover:bg-[var(--elevated)] transition-colors"
            style={{ color: 'var(--text)' }}
          >
            <Icon size={15} />
          </button>
        ))}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
        <button
          title="Link"
          onMouseDown={e => {
            e.preventDefault();
            const url = prompt('URL:');
            if (url) exec('createLink', url);
          }}
          className="p-2 rounded-lg hover:bg-[var(--elevated)] transition-colors"
          style={{ color: 'var(--text)' }}
        >
          <Link2 size={15} />
        </button>
      </div>

      {/* Title */}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Název článku"
        className="w-full px-4 py-3 rounded-xl border text-lg font-semibold focus:outline-none"
        style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />

      {/* Content */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-64 px-4 py-3 rounded-xl border focus:outline-none text-sm leading-relaxed article-body"
        style={{ background: 'var(--elevated)', borderColor: 'var(--border)', color: 'var(--text)' }}
        data-placeholder="Začněte psát..."
      />

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!title.trim() || saving}
          className="px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
          style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
        >
          {saving ? 'Ukládám…' : 'Uložit článek'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm"
          style={{ color: 'var(--muted)' }}
        >
          Zrušit
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article viewer
// ---------------------------------------------------------------------------

function ArticleViewer({ item, onClose, onDelete, canEdit }: {
  item: MoodboardItem;
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
}) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm"
          style={{ color: 'var(--muted)' }}
        >
          <ChevronLeft size={16} /> Zpět na články
        </button>
        {canEdit && (
          <button
            onClick={onDelete}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: 'var(--destructive)', color: '#fff' }}
          >
            <Trash2 size={13} /> Smazat
          </button>
        )}
      </div>
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
        {new Date(item.createdAt ?? '').toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>{item.title}</h1>
      <div
        className="article-body text-sm leading-relaxed max-w-2xl"
        style={{ color: 'var(--text)' }}
        dangerouslySetInnerHTML={{ __html: item.value }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Articles tab
// ---------------------------------------------------------------------------

function ArticlesTab({ boardId, items, canEdit }: { boardId: string; items: MoodboardItem[]; canEdit: boolean }) {
  const qc = useQueryClient();
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewing, setViewing] = useState<MoodboardItem | null>(null);

  const articles = items.filter(it => it.type === 'article');

  const deleteItem = useMutation({
    mutationFn: (id: string) => api.delete(`/moodboard/items/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['moodboard-items', boardId] });
      setViewing(null);
    },
  });

  if (viewing) {
    return (
      <ArticleViewer
        item={viewing}
        onClose={() => setViewing(null)}
        onDelete={() => deleteItem.mutate(viewing.id)}
        canEdit={canEdit}
      />
    );
  }

  return (
    <div>
      {canEdit && !editorOpen && (
        <button
          onClick={() => setEditorOpen(true)}
          className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:border-[var(--primary)]"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          <Plus size={15} /> Nový článek
        </button>
      )}

      {editorOpen && (
        <div
          className="mb-8 p-5 rounded-2xl border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <ArticleEditor
            boardId={boardId}
            onSave={() => setEditorOpen(false)}
            onCancel={() => setEditorOpen(false)}
          />
        </div>
      )}

      {articles.length === 0 && !editorOpen ? (
        <div className="text-center py-20">
          <FileText size={32} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)' }}>Zatím žádné články. Napište první.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(art => (
            <div
              key={art.id}
              className="group flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-colors hover:border-[var(--primary)]"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              onClick={() => setViewing(art)}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--elevated)' }}
              >
                <FileText size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1 truncate" style={{ color: 'var(--text)' }}>{art.title}</p>
                {art.note && (
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>{art.note}</p>
                )}
                <p className="text-xs mt-2" style={{ color: 'var(--muted)', opacity: 0.6 }}>
                  {new Date(art.createdAt ?? '').toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              {canEdit && (
                <button
                  onClick={e => { e.stopPropagation(); deleteItem.mutate(art.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg mt-0.5"
                  style={{ color: 'var(--destructive)' }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Documents tab
// ---------------------------------------------------------------------------

function DocumentsTab({ boardId, items, canEdit }: { boardId: string; items: MoodboardItem[]; canEdit: boolean }) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  const docs = items.filter(it => it.type === 'document');

  const deleteItem = useMutation({
    mutationFn: (id: string) => api.delete(`/moodboard/items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['moodboard-items', boardId] }),
  });

  const uploadFile = useCallback(async (file: File) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowed.includes(file.type)) {
      alert('Povoleny jsou pouze soubory PDF a DOCX.');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async ev => {
      const dataUrl = ev.target?.result as string;
      const ext = file.name.split('.').pop()?.toUpperCase() ?? 'DOC';
      const kb = Math.round(file.size / 1024);
      try {
        await api.post('/moodboard/items', {
          boardId,
          type: 'document',
          title: file.name,
          value: dataUrl,
          note: `${ext} · ${kb} KB`,
        });
        qc.invalidateQueries({ queryKey: ['moodboard-items', boardId] });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }, [boardId, qc]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  }, [uploadFile]);

  const downloadDoc = (item: MoodboardItem) => {
    const a = document.createElement('a');
    a.href = item.value;
    a.download = item.title ?? 'document';
    a.click();
  };

  return (
    <div>
      {/* PDF preview overlay */}
      {pdfPreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-white text-sm font-medium">PDF náhled</span>
            <button onClick={() => setPdfPreview(null)} className="text-white/60 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <iframe src={pdfPreview} className="flex-1 w-full border-0" title="PDF preview" />
        </div>
      )}

      {/* Drop zone */}
      {canEdit && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleFileInput}
          />
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-2 mb-6 h-28 rounded-2xl border-2 border-dashed cursor-pointer transition-colors',
              dragging ? 'border-[var(--primary)] bg-[var(--elevated)]' : 'hover:border-[var(--primary)]',
            )}
            style={{ borderColor: dragging ? undefined : 'var(--border)', background: dragging ? undefined : 'var(--surface)' }}
          >
            <Upload size={22} style={{ color: 'var(--muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
              {uploading ? 'Nahrávám…' : 'Přetáhněte nebo klikněte pro nahrání PDF / DOCX'}
            </p>
          </div>
        </>
      )}

      {docs.length === 0 ? (
        <div className="text-center py-16">
          <FileText size={32} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)' }}>Žádné dokumenty. Nahrajte PDF nebo DOCX.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map(doc => {
            const isPdf = doc.value.startsWith('data:application/pdf');
            const ext = doc.note?.split(' ·')[0] ?? 'DOC';
            return (
              <div
                key={doc.id}
                className="group flex items-center gap-4 p-4 rounded-2xl border"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs"
                  style={{ background: isPdf ? '#ef444420' : '#3b82f620', color: isPdf ? '#ef4444' : '#3b82f6' }}
                >
                  {ext}
                </div>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{doc.title}</p>
                  {doc.note && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{doc.note}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {isPdf && (
                    <button
                      onClick={() => setPdfPreview(doc.value)}
                      title="Zobrazit PDF"
                      className="p-2 rounded-lg hover:bg-[var(--elevated)] transition-colors"
                      style={{ color: 'var(--muted)' }}
                    >
                      <Eye size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => downloadDoc(doc)}
                    title="Stáhnout"
                    className="p-2 rounded-lg hover:bg-[var(--elevated)] transition-colors"
                    style={{ color: 'var(--muted)' }}
                  >
                    <Download size={15} />
                  </button>
                  {canEdit && (
                    <button
                      onClick={() => deleteItem.mutate(doc.id)}
                      title="Smazat"
                      className="p-2 rounded-lg hover:bg-[var(--elevated)] transition-colors opacity-0 group-hover:opacity-100"
                      style={{ color: 'var(--destructive)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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

  const [pageTab, setPageTab] = useState<PageTab>('moodboard');
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [formType, setFormType] = useState<FormOnlyType>('url');
  const [newItem, setNewItem] = useState<{ value: string; title: string; note: string }>({
    value: '',
    title: '',
    note: '',
  });
  const [uploading, setUploading] = useState(false);

  const TYPE_LABELS: Record<FormOnlyType, string> = {
    image: t('moodboard_type_image'),
    image_upload: t('moodboard_type_image_upload'),
    url: t('moodboard_type_url'),
    color: t('moodboard_type_color'),
    note: t('moodboard_type_note'),
  };

  const { data: boardsData } = useQuery({
    queryKey: ['moodboard-boards'],
    queryFn: () => api.get<{ data: MoodboardBoard[] }>('/moodboard/boards').then(r => r.data.data),
    staleTime: 60_000,
  });

  const boards = boardsData ?? [];
  const activeBoardId = selectedBoard ?? boards[0]?.id ?? null;

  const { data: itemsData } = useQuery({
    queryKey: ['moodboard-items', activeBoardId],
    queryFn: () => api.get<{ data: MoodboardItem[] }>(`/moodboard/boards/${activeBoardId}/items`).then(r => r.data.data),
    enabled: !!activeBoardId,
    staleTime: 30_000,
  });

  const allItems = itemsData ?? [];
  const items = allItems.filter(it => it.type !== 'article' && it.type !== 'document');

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

  const PAGE_TABS: { id: PageTab; label: string }[] = [
    { id: 'moodboard', label: 'Moodboard' },
    { id: 'articles', label: 'Články' },
    { id: 'documents', label: 'Dokumenty' },
  ];

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{t('moodboard_title')}</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{t('moodboard_subtitle')}</p>
        </div>
        {canEdit && pageTab === 'moodboard' && (
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

      {/* Page tabs: Moodboard | Articles | Documents */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--elevated)' }}>
        {PAGE_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setPageTab(tab.id)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: pageTab === tab.id ? 'var(--surface)' : 'transparent',
              color: pageTab === tab.id ? 'var(--text)' : 'var(--muted)',
              boxShadow: pageTab === tab.id ? '0 1px 4px rgba(0,0,0,.15)' : undefined,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Board tabs (moodboard tab only) */}
      {pageTab === 'moodboard' && boards.length > 0 && (
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

      {/* ── MOODBOARD TAB ── */}
      {pageTab === 'moodboard' && (
        <>
          {activeBoardId && canEdit && !showAddItem && (
            <button
              onClick={() => setShowAddItem(true)}
              className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:border-[var(--primary)]"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <Plus size={15} /> {t('moodboard_add_item')}
            </button>
          )}

          {showAddItem && (
            <div
              className="mb-6 p-5 rounded-2xl border space-y-4"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t('moodboard_new_item')}</p>

              <div className="flex gap-2 flex-wrap">
                {(Object.keys(TYPE_LABELS) as FormOnlyType[]).map(type => (
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

              {formType === 'image_upload' ? (
                <div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
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
                    {item.type === 'image' ? (
                      <img src={item.value} alt={item.title ?? ''} className="w-full h-40 object-cover" loading="lazy" />
                    ) : item.type === 'color' ? (
                      <div className="w-full h-40" style={{ background: item.value }} />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center" style={{ background: 'var(--elevated)' }}>
                        <Icon size={28} style={{ color: 'var(--muted)' }} />
                      </div>
                    )}
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
        </>
      )}

      {/* ── ARTICLES TAB ── */}
      {pageTab === 'articles' && activeBoardId && (
        <ArticlesTab boardId={activeBoardId} items={allItems} canEdit={canEdit} />
      )}

      {/* ── DOCUMENTS TAB ── */}
      {pageTab === 'documents' && activeBoardId && (
        <DocumentsTab boardId={activeBoardId} items={allItems} canEdit={canEdit} />
      )}

      {!activeBoardId && pageTab !== 'moodboard' && (
        <div className="text-center py-20">
          <p style={{ color: 'var(--muted)' }}>Nejprve vytvořte moodboard nástěnku.</p>
        </div>
      )}
    </div>
  );
}
