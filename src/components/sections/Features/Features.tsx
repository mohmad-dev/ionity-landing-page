'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section/Section';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import styles from './Features.module.css';

/* ── Premium geometric SVG icons ───────────────────────── */
const ICONS = [
  /* 0 — Web Apps */
  <svg key={0} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>,

  /* 1 — Mobile Apps */
  <svg key={1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>,

  /* 2 — ERP */
  <svg key={2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>,

  /* 3 — Hospital Systems */
  <svg key={3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>,

  /* 4 — POS / Cashier */
  <svg key={4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="12" rx="2" />
    <line x1="2" y1="20" x2="22" y2="20" />
    <rect x="5" y="16" width="14" height="4" />
  </svg>,

  /* 5 — CRM */
  <svg key={5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,

  /* 6 — Cloud & Hosting */
  <svg key={6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>,

  /* 7 — Custom Software */
  <svg key={7} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>,

  /* 8 — UI/UX */
  <svg key={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
  </svg>,

  /* 9 — APIs */
  <svg key={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6M12 3v18" />
  </svg>,
];

interface FeatureCardProps {
  idx: number;
  title: string;
  description: string;
}

const FeatureCard = ({ idx, title, description }: FeatureCardProps) => (
  <article
    className={`${styles.card} ${styles[`card${idx}`] ?? ''}`}
    aria-label={title}
  >
    <div className={styles.cardIcon}>{ICONS[idx]}</div>
    <div className={styles.cardBody}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{description}</p>
    </div>
    <div className={styles.cardArrow} aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </article>
);

export const Features = () => {
  const t = useTranslations('features');

  const features = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => ({
    title: t(`items.${idx}.title`),
    description: t(`items.${idx}.description`),
  }));

  return (
    <Section id="features">
      {/* Section header */}
      <ScrollReveal className={styles.header}>
        <p className={`overline ${styles.overlineTag}`}>{t('overline')}</p>
        <h2 className={styles.sectionTitle}>{t('title')}</h2>
        <p className={styles.sectionSubtitle}>{t('subtitle')}</p>
      </ScrollReveal>

      {/* Bento grid */}
      <StaggerChildren className={styles.grid}>
        {features.map((feature, idx) => (
          <FeatureCard
            key={idx}
            idx={idx}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </StaggerChildren>
    </Section>
  );
};

export default Features;
