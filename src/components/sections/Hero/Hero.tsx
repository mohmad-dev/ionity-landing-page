'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './Hero.module.css';
import { Button } from '@/components/ui/Button/Button';
import { MagneticButton } from '@/components/ui/MagneticButton/MagneticButton';

export const Hero = () => {
  const t = useTranslations('hero');

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Subtle grid background — static, no animation */}
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Overline */}
        <div className={styles.overline}>
          <span className={styles.dot} aria-hidden="true" />
          <span className="overline">{t('overline')}</span>
        </div>

        {/* Headline — the primary hero element */}
        <h1 className={styles.headline}>
          {t('title')}
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div className={styles.actions}>
          <MagneticButton>
            <Button
              href="https://wa.me/1234567890"
              variant="primary"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('cta_primary')}
            </Button>
          </MagneticButton>
          <MagneticButton strength={10}>
            <Button href="#features" variant="secondary" size="lg">
              {t('cta_secondary')}
            </Button>
          </MagneticButton>
        </div>

        {/* Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Metrics strip */}
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{t('metric1_val')}</span>
            <span className={styles.metricLabel}>{t('metric1_lbl')}</span>
          </div>
          <div className={styles.metricSep} aria-hidden="true" />
          <div className={styles.metric}>
            <span className={styles.metricValue}>{t('metric2_val')}</span>
            <span className={styles.metricLabel}>{t('metric2_lbl')}</span>
          </div>
          <div className={styles.metricSep} aria-hidden="true" />
          <div className={styles.metric}>
            <span className={styles.metricValue}>{t('metric3_val')}</span>
            <span className={styles.metricLabel}>{t('metric3_lbl')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
