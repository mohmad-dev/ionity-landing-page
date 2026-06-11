'use client';

import React, { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import styles from './Hero.module.css';
import { Button } from '@/components/ui/Button/Button';
import { MagneticButton } from '@/components/ui/MagneticButton/MagneticButton';

// Lazy-load Spline so it never blocks the initial render
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className={styles.splineFallback} aria-hidden="true" />,
});

export const Hero = () => {
  const t = useTranslations('hero');
  const textRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<HTMLDivElement>(null);

  // GSAP entrance — simple, Apple-style: fade + translate, no bounce
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          delay: 0.15,
        }
      );
      gsap.fromTo(
        splineRef.current,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power2.out',
          delay: 0.35,
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Subtle dot-grid background — static, no animation */}
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.inner}>
        {/* ── LEFT: Text content ── */}
        <div className={styles.content} ref={textRef}>
          {/* Overline badge */}
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

        {/* ── RIGHT: Spline 3D object ── */}
        <div className={styles.visual} ref={splineRef} aria-hidden="true">
          <div className={styles.splineWrapper}>
            <Spline
              scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            />
          </div>
          {/* Decorative border ring */}
          <div className={styles.visualRing} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
