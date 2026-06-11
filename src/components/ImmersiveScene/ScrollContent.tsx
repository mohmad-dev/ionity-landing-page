'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button/Button';
import { MagneticButton } from '@/components/ui/MagneticButton/MagneticButton';
import styles from './ImmersiveScene.module.css';

/* ── Service icons (24px SVG set) ─────────────────────────── */
const ICONS = [
  <svg key={0} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  <svg key={1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  <svg key={2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  <svg key={3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  <svg key={4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="12" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  <svg key={5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key={6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
  <svg key={7} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  <svg key={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>,
  <svg key={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6M12 3v18"/></svg>,
];

interface ScrollContentProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const ScrollContent = ({ scrollContainerRef }: ScrollContentProps) => {
  const t = useTranslations();

  const services = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => ({
    title: t(`features.items.${i}.title`),
    description: t(`features.items.${i}.description`),
    icon: ICONS[i],
  }));

  const steps = [0, 1, 2, 3, 4, 5].map(i => ({
    title: t(`howItWorks.step_details.${i}.title`),
    desc: t(`howItWorks.step_details.${i}.desc`),
  }));

  return (
    <div className={styles.scrollContent} ref={scrollContainerRef}>

      {/* ════════════════════════════════════════════════════
          SECTION 1 — HERO
          Full viewport, centered text on left half
      ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionHero}`} id="hero">
        <div className={styles.heroContent} data-reveal>
          <div className={styles.overline}>
            <span className={styles.dot} />
            <span className={styles.overlineText}>{t('hero.overline')}</span>
          </div>
          <h1 className={styles.heroHeadline}>{t('hero.title')}</h1>
          <p className={styles.heroSubtitle}>{t('hero.subtitle')}</p>
          <div className={styles.heroActions}>
            <MagneticButton>
              <Button
                href="https://wa.me/1234567890"
                variant="primary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('hero.cta_primary')}
              </Button>
            </MagneticButton>
            <MagneticButton strength={10}>
              <Button href="#services" variant="secondary" size="lg">
                {t('hero.cta_secondary')}
              </Button>
            </MagneticButton>
          </div>

          {/* Metrics strip */}
          <div className={styles.metricsStrip}>
            <div className={styles.metric}>
              <span className={styles.metricVal}>{t('hero.metric1_val')}</span>
              <span className={styles.metricLbl}>{t('hero.metric1_lbl')}</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metric}>
              <span className={styles.metricVal}>{t('hero.metric2_val')}</span>
              <span className={styles.metricLbl}>{t('hero.metric2_lbl')}</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metric}>
              <span className={styles.metricVal}>{t('hero.metric3_val')}</span>
              <span className={styles.metricLbl}>{t('hero.metric3_lbl')}</span>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className={styles.scrollHint} aria-hidden="true">
          <div className={styles.scrollLine} />
          <span className={styles.scrollLabel}>scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2 — SERVICES
      ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionServices}`} id="services">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <p className={styles.sectionOverline}>{t('features.overline')}</p>
            <h2 className={styles.sectionTitle}>{t('features.title')}</h2>
            <p className={styles.sectionSubtitle}>{t('features.subtitle')}</p>
          </div>

          <div className={styles.servicesGrid} data-reveal="stagger">
            {services.map((s, i) => (
              <article key={i} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.serviceDesc}>{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionProcess}`} id="process">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <p className={styles.sectionOverline}>{t('howItWorks.overline')}</p>
            <h2 className={styles.sectionTitle}>{t('howItWorks.title')}</h2>
          </div>

          <div className={styles.processTimeline}>
            {steps.map((step, i) => (
              <div key={i} className={styles.processStep} data-reveal>
                <div className={styles.stepNumber}>0{i + 1}</div>
                <div className={styles.stepConnector} />
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4 — METRICS (BIG NUMBERS)
      ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionMetrics}`} id="metrics">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <p className={styles.sectionOverline}>{t('metrics.overline')}</p>
            <h2 className={styles.sectionTitle}>{t('metrics.title')}</h2>
          </div>
          <div className={styles.bigMetrics} data-reveal="stagger">
            <div className={styles.bigMetric}>
              <span className={styles.bigMetricVal}>{t('metrics.stat1_value')}</span>
              <span className={styles.bigMetricLbl}>{t('metrics.stat1_label')}</span>
            </div>
            <div className={styles.bigMetric}>
              <span className={styles.bigMetricVal}>{t('metrics.stat2_value')}</span>
              <span className={styles.bigMetricLbl}>{t('metrics.stat2_label')}</span>
            </div>
            <div className={styles.bigMetric}>
              <span className={styles.bigMetricVal}>{t('metrics.stat3_value')}</span>
              <span className={styles.bigMetricLbl}>{t('metrics.stat3_label')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5 — CTA
      ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionCTA}`} id="cta">
        <div className={styles.ctaInner} data-reveal>
          <p className={styles.sectionOverline}>{t('hero.overline')}</p>
          <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
          <p className={styles.ctaSubtitle}>{t('cta.subtitle')}</p>
          <div className={styles.ctaActions}>
            <MagneticButton>
              <Button
                href="#contact"
                variant="primary"
                size="lg"
              >
                {t('cta.primary')}
              </Button>
            </MagneticButton>
          </div>
        </div>
      </section>

    </div>
  );
};
