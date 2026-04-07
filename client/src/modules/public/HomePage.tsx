// =============================================================================
// client/src/modules/public/HomePage.tsx — Public brand portal landing page
// Anchor-first CI: neutral palette, color only for semantic/interactive roles.
// =============================================================================

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';
import { HeroIllustration } from '../../components/HeroIllustration';

export function HomePage() {
  const { t } = useTranslation();

  const PILLARS = [
    { num: '01', title: t('home_pillar1_title'), desc: t('home_pillar1_desc') },
    { num: '02', title: t('home_pillar2_title'), desc: t('home_pillar2_desc') },
    { num: '03', title: t('home_pillar3_title'), desc: t('home_pillar3_desc') },
  ];

  const AUDIENCES = [
    { labelKey: 'home_aud1_label' as const, descKey: 'home_aud1_desc' as const, href: '/guidelines' },
    { labelKey: 'home_aud2_label' as const, descKey: 'home_aud2_desc' as const, href: '/guidelines#entities' },
    { labelKey: 'home_aud3_label' as const, descKey: 'home_aud3_desc' as const, href: '/assets' },
    { labelKey: 'home_aud4_label' as const, descKey: 'home_aud4_desc' as const, href: '/guidelines#entities' },
  ];

  return (
    <div className="animate-fade-in space-y-24">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-10 pb-4">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Text */}
          <div className="max-w-xl">
            <p className="label-caps mb-4" style={{ color: 'var(--primary)' }}>
              {t('home_eyebrow')}
            </p>
            <h1
              className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6"
              style={{ color: 'var(--text)' }}
            >
              {t('home_hero_line1')}
              <br />
              <span style={{ color: 'var(--text)' }}>{t('home_hero_line2')}</span>
            </h1>
            <p className="text-lg max-w-md leading-relaxed" style={{ color: 'var(--muted)' }}>
              {t('home_hero_desc')}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/guidelines"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
              >
                {t('home_cta_guidelines')} <ArrowRight size={15} />
              </Link>
              <Link
                to="/assets"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-colors hover:border-[var(--text)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                {t('home_cta_assets')}
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div
            className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="w-full h-full p-4">
              <HeroIllustration />
            </div>
          </div>

        </div>
      </section>

      {/* ── Pillars ───────────────────────────────────────────────────────────── */}
      <section>
        <p className="label-caps mb-8">{t('home_pillars_label')}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {PILLARS.map(p => (
            <div
              key={p.num}
              className="p-6 rounded-2xl border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <span className="label-caps mb-4 block" style={{ color: 'var(--muted)' }}>
                {p.num}
              </span>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Audiences ─────────────────────────────────────────────────────────── */}
      <section>
        <p className="label-caps mb-8">{t('home_audiences_label')}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AUDIENCES.map(a => (
            <Link
              key={a.labelKey}
              to={a.href}
              className="group p-5 rounded-2xl border transition-colors hover:border-[var(--text)]"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  {t(a.labelKey)}
                </span>
                <ArrowRight
                  size={13}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--muted)' }}
                />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                {t(a.descKey)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────────── */}
      <section
        className="p-10 rounded-3xl border text-center"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p className="label-caps mb-4" style={{ color: 'var(--muted)' }}>
          {t('home_mission_label')}
        </p>
        <blockquote
          className="text-2xl md:text-3xl font-semibold tracking-tight max-w-2xl mx-auto leading-snug"
          style={{ color: 'var(--text)' }}
        >
          {t('home_mission_quote')}
        </blockquote>
        <p className="text-sm mt-6" style={{ color: 'var(--muted)' }}>
          {t('home_mission_footer')}
        </p>
      </section>

    </div>
  );
}
