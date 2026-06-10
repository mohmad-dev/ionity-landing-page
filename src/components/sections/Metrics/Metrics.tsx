'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section/Section';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter/AnimatedCounter';
import styles from './Metrics.module.css';

export const Metrics = () => {
  const t = useTranslations('metrics');

  const stats = [
    { value: t('stat1_value'), label: t('stat1_label') },
    { value: t('stat2_value'), label: t('stat2_label') },
    { value: t('stat3_value'), label: t('stat3_label') },
  ];

  return (
    <section id="metrics" className={styles.section}>
      <div className={styles.inner}>
        <ScrollReveal className={styles.header}>
          <p className="overline" style={{ color: 'var(--text-tertiary)' }}>{t('overline')}</p>
          <h2 className={styles.title}>{t('title')}</h2>
        </ScrollReveal>

        <StaggerChildren className={styles.grid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <AnimatedCounter value={stat.value} className={styles.value} />
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
};

export default Metrics;
