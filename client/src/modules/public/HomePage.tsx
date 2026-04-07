// =============================================================================
// client/src/modules/public/HomePage.tsx — Investment memorandum landing page
// Hero: full-bleed brand image (Tesla-style headline → image → content).
// Design: anchor-first — neutral palette, no decorative colour.
// =============================================================================

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

export function HomePage() {
  const { t } = useTranslation();

  const STATS = [
    { value: t('home_stat_banks'),     label: t('home_stat_banks_label') },
    { value: t('home_stat_merchants'), label: t('home_stat_merchants_label') },
    { value: t('home_stat_users'),     label: t('home_stat_users_label') },
    { value: t('home_stat_live'),      label: t('home_stat_live_label') },
  ];

  const PILLARS = [
    { num: '01', title: t('home_pillar1_title'), desc: t('home_pillar1_desc') },
    { num: '02', title: t('home_pillar2_title'), desc: t('home_pillar2_desc') },
    { num: '03', title: t('home_pillar3_title'), desc: t('home_pillar3_desc') },
  ];

  const WHY_NOW = [
    { title: t('home_why_cnb'), desc: t('home_why_cnb_desc') },
    { title: t('home_why_eu'),  desc: t('home_why_eu_desc') },
    { title: t('home_why_sk'),  desc: t('home_why_sk_desc') },
  ];

  return (
    <div className="animate-fade-in space-y-20">

      {/* ── Hero — full-bleed image with text overlay ─────────────────────── */}
      <section className="pt-10">
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ height: 'clamp(420px, 60vw, 720px)' }}
        >
          {/* Background image */}
          <img
            src="/hero.png"
            alt="Mo.one ecosystem — coffee, workspace, payments, lifestyle"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
          />

          {/* Dark gradient overlay — bottom-heavy so text at bottom is readable */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.72) 100%)',
            }}
          />

          {/* Text content — sits in lower half */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <p className="label-caps mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {t('home_eyebrow')}
            </p>
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-end">
              <h1
                className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
                style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
              >
                {t('home_hero_line1')}
                <br />
                {t('home_hero_line2')}
              </h1>
              <div>
                <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {t('home_hero_desc')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:jkoudelka@mo.one"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                    style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
                  >
                    {t('home_cta_primary')} <ArrowRight size={15} />
                  </a>
                  <Link
                    to="/guidelines"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-colors"
                    style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#ffffff', background: 'rgba(255,255,255,0.08)' }}
                  >
                    {t('home_cta_guidelines')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────────────── */}
      <section
        className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border"
        style={{ borderColor: 'var(--border)', background: 'var(--border)' }}
      >
        {STATS.map(s => (
          <div key={s.label} className="px-6 py-7" style={{ background: 'var(--surface)' }}>
            <p
              className="text-3xl font-bold tracking-tight mb-1"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              {s.value}
            </p>
            <p className="text-xs leading-snug" style={{ color: 'var(--muted)' }}>
              {s.label}
            </p>
          </div>
        ))}
      </section>

      {/* ── Executive summary ─────────────────────────────────────────────────── */}
      <section>
        <p className="label-caps mb-6">{t('home_exec_label')}</p>
        <p
          className="text-base max-w-3xl"
          style={{ color: 'var(--text)', lineHeight: '1.8' }}
        >
          {t('home_exec_text')}
        </p>
      </section>

      {/* ── Three pillars ─────────────────────────────────────────────────────── */}
      <section>
        <p className="label-caps mb-8">{t('home_pillars_label')}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {PILLARS.map(p => (
            <div
              key={p.num}
              className="p-6 rounded-2xl border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <span className="label-caps block mb-5" style={{ color: 'var(--muted)' }}>
                {p.num}
              </span>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why now ───────────────────────────────────────────────────────────── */}
      <section>
        <p className="label-caps mb-6">{t('home_why_label')}</p>
        <p
          className="text-2xl md:text-3xl font-semibold tracking-tight max-w-3xl mb-10"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: '1.25' }}
        >
          {t('home_why_title')}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {WHY_NOW.map((w, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <p className="text-xs font-semibold mb-3 leading-snug" style={{ color: 'var(--text)' }}>
                {w.title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing quote ─────────────────────────────────────────────────────── */}
      <section className="text-center pb-8">
        <p className="label-caps mb-6" style={{ color: 'var(--muted)' }}>
          {t('home_mission_label')}
        </p>
        <blockquote
          className="text-2xl md:text-3xl font-semibold tracking-tight max-w-3xl mx-auto leading-snug mb-6"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
        >
          {t('home_mission_quote')}
        </blockquote>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {t('home_mission_footer')}
        </p>
      </section>

    </div>
  );
}
