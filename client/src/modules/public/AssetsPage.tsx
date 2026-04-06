// =============================================================================
// client/src/modules/public/AssetsPage.tsx — Brand assets download page
// =============================================================================

import { Download } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

export function AssetsPage() {
  const { t } = useTranslation();

  const ASSET_GROUPS = [
    {
      label: t('assets_group_logos'),
      items: [
        { name: t('assets_logo_white'), file: '/assets/logo/moone-white.svg' },
        { name: t('assets_logo_black'), file: '/assets/logo/moone-black.svg' },
        { name: t('assets_logo_icon'),  file: '/assets/logo/moone-icon.svg' },
        { name: t('assets_logo_legi'),  file: '/assets/logo/legione-logo.svg' },
      ],
    },
    {
      label: t('assets_group_colors'),
      items: [
        { name: t('assets_colors_ase'), file: '/assets/colors/moone-palette.ase' },
        { name: t('assets_colors_css'), file: '/assets/colors/moone-palette.css' },
      ],
    },
    {
      label: t('assets_group_typography'),
      items: [
        { name: t('assets_font_figtree'), file: 'https://fonts.google.com/specimen/Figtree' },
      ],
    },
  ];

  return (
    <div className="animate-fade-in space-y-12">
      <div>
        <p className="label-caps mb-3" style={{ color: 'var(--primary)' }}>{t('assets_eyebrow')}</p>
        <h1 className="text-3xl font-bold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          {t('assets_heading')}
        </h1>
        <p className="text-base max-w-xl" style={{ color: 'var(--muted)' }}>
          {t('assets_desc')}
        </p>
      </div>

      <div className="space-y-10">
        {ASSET_GROUPS.map(group => (
          <div key={group.label}>
            <p className="label-caps mb-4">{group.label}</p>
            <div className="space-y-2">
              {group.items.map(item => (
                <a
                  key={item.name}
                  href={item.file}
                  download={!item.file.startsWith('http')}
                  target={item.file.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border group transition-colors hover:border-[var(--primary)]"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.name}</span>
                  <Download size={15} className="opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="p-6 rounded-2xl border text-sm"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        <strong style={{ color: 'var(--text)' }}>{t('assets_custom_label')}</strong>
        {' '}{t('assets_custom_contact')}{' '}
        <a href="mailto:brand@mo.one" style={{ color: 'var(--primary)' }} className="hover:underline">brand@mo.one</a>
      </div>
    </div>
  );
}
