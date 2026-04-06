// =============================================================================
// client/src/modules/public/AssetsPage.tsx — Brand assets download page
// =============================================================================

import { Download } from 'lucide-react';

const ASSET_GROUPS = [
  {
    label: 'Loga',
    items: [
      { name: 'Mo.one logo — bílé (SVG)', file: '/assets/logo/moone-white.svg' },
      { name: 'Mo.one logo — černé (SVG)', file: '/assets/logo/moone-black.svg' },
      { name: 'Mo.one ikona (SVG)', file: '/assets/logo/moone-icon.svg' },
      { name: 'Legi.one logo (SVG)', file: '/assets/logo/legione-logo.svg' },
    ],
  },
  {
    label: 'Barvy',
    items: [
      { name: 'Paleta barev (ASE)', file: '/assets/colors/moone-palette.ase' },
      { name: 'Paleta barev (CSS vars)', file: '/assets/colors/moone-palette.css' },
    ],
  },
  {
    label: 'Typografie',
    items: [
      { name: 'Figtree — Google Fonts', file: 'https://fonts.google.com/specimen/Figtree' },
    ],
  },
];

export function AssetsPage() {
  return (
    <div className="animate-fade-in space-y-12">
      <div>
        <p className="label-caps mb-3" style={{ color: 'var(--primary)' }}>BRAND ASSETS</p>
        <h1 className="text-3xl font-bold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          Vizuální assety ke stažení
        </h1>
        <p className="text-base max-w-xl" style={{ color: 'var(--muted)' }}>
          Oficální brand assety Mo.one pro zaměstnance, partnery a média.
          Používejte výhradně soubory z tohoto portálu.
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
        <strong style={{ color: 'var(--text)' }}>Potřebuješ specifické assety?</strong>
        {' '}Kontaktuj brand tým přes{' '}
        <a href="mailto:brand@mo.one" style={{ color: 'var(--primary)' }} className="hover:underline">brand@mo.one</a>
      </div>
    </div>
  );
}
