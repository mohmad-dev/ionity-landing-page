'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section/Section';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import styles from './Features.module.css';

/* ── Premium geometric SVG icons ───────────────────────── */
const ICONS = [
  /* 0 — Zero-CLS / Performance */
  <svg key={0} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>,

  /* 1 — Global Edge */
  <svg key={1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>,

  /* 2 — Scalable Infra */
  <svg key={2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="5" rx="1" />
    <rect x="2" y="10" width="20" height="5" rx="1" />
    <rect x="2" y="17" width="20" height="5" rx="1" />
    <circle cx="6" cy="5.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="6" cy="12.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="6" cy="19.5" r="1" fill="currentColor" stroke="none" />
  </svg>,

  /* 3 — Developer Experience */
  <svg key={3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
    <line x1="12" y1="3" x2="12" y2="21" />
  </svg>,

  /* 4 — Real-time Sync */
  <svg key={4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="1 4 1 10 7 10" />
    <polyline points="23 20 23 14 17 14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>,

  /* 5 — Security */
  <svg key={5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
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

  const features = [0, 1, 2, 3, 4, 5].map((idx) => ({
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
