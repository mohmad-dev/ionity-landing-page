'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section/Section';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { TextReveal } from '@/components/animations/TextReveal';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import styles from './ProblemSolution.module.css';

export const ProblemSolution = () => {
  const t = useTranslations('problem');

  return (
    <Section id="problem" className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <div className="caption text-accent mb-4 uppercase tracking-widest">{t('overline')}</div>
        </ScrollReveal>
        
        <TextReveal as="h2" type="words" className="h1 mb-12">
          {t('title')}
        </TextReveal>

        <div className={styles.splitLayout}>
          {/* The Old Way */}
          <ScrollReveal direction="up" delay={0.2} className={styles.cardOld}>
            <div className={styles.iconWrapperOld}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h3 className="h3 mb-4 text-tertiary">{t('old_way')}</h3>
            <p className="body text-tertiary">{t('old_desc')}</p>
          </ScrollReveal>

          {/* The Ionity Way */}
          <ScrollReveal direction="up" delay={0.4} className={styles.cardNew}>
            <div className={styles.iconWrapperNew}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <h3 className="h3 mb-4 text-primary">{t('new_way')}</h3>
            <p className="body text-secondary">{t('new_desc')}</p>
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
};
