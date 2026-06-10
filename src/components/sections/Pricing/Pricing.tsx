'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section/Section';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { TextReveal } from '@/components/animations/TextReveal';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { Button } from '@/components/ui/Button/Button';
import { MagneticButton } from '@/components/ui/MagneticButton/MagneticButton';
import styles from './Pricing.module.css';
import { TiltCard } from '@/components/animations/TiltCard';

export const Pricing = () => {
  const t = useTranslations('pricing');

  const tiers = [
    {
      name: t('tier1_name'),
      price: t('tier1_price'),
      period: t('tier1_period'),
      desc: t('tier1_desc'),
      features: [
        t('tier1_f1'),
        t('tier1_f2'),
        t('tier1_f3'),
        t('tier1_f4')
      ],
      cta: t('tier1_cta'),
      popular: false
    },
    {
      name: t('tier2_name'),
      price: t('tier2_price'),
      period: t('tier2_period'),
      desc: t('tier2_desc'),
      features: [
        t('tier2_f1'),
        t('tier2_f2'),
        t('tier2_f3'),
        t('tier2_f4'),
        t('tier2_f5')
      ],
      cta: t('tier2_cta'),
      popular: true
    },
    {
      name: t('tier3_name'),
      price: t('tier3_price'),
      period: t('tier3_period'),
      desc: t('tier3_desc'),
      features: [
        t('tier3_f1'),
        t('tier3_f2'),
        t('tier3_f3'),
        t('tier3_f4')
      ],
      cta: t('tier3_cta'),
      popular: false
    }
  ];

  return (
    <Section id="pricing" className={styles.section} withOrb orbColor="mint" orbPosition="left">
      <div className={styles.container}>
        <div className={styles.header}>
          <ScrollReveal>
            <div className="caption text-accent mb-4 uppercase tracking-widest text-center">
              {t('overline')}
            </div>
            <h2 className="h2 text-center">{t('title')}</h2>
            <p className="body text-secondary text-center max-w-2xl mt-4 mx-auto">
              {t('subtitle')}
            </p>
          </ScrollReveal>
        </div>

        <StaggerChildren className={styles.grid}>
          {tiers.map((tier, idx) => (
            <TiltCard 
              key={idx} 
              className={`${styles.card} ${tier.popular ? styles.popular : ''}`}
              intensity={5}
            >
              {tier.popular && (
                <div className={styles.popularBadge}>
                  {t('popular_label')}
                </div>
              )}
              <div className={styles.cardHeader}>
                <h3 className="h3 mb-2">{tier.name}</h3>
                <p className="body text-tertiary">{tier.desc}</p>
                <div className={styles.priceRow}>
                  <span className={`display ${styles.price}`}>{tier.price}</span>
                  <span className="caption text-tertiary lowercase">{tier.period}</span>
                </div>
              </div>

              <div className={styles.divider} />

              <ul className={styles.featuresList}>
                {tier.features.map((feat, fidx) => (
                  <li key={fidx} className={styles.featureItem}>
                    <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="body text-secondary">{feat}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.cardFooter}>
                <MagneticButton strength={5}>
                  <Button 
                    href="https://wa.me/1234567890" 
                    variant={tier.popular ? 'primary' : 'secondary'} 
                    size="md" 
                    className="w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tier.cta}
                  </Button>
                </MagneticButton>
              </div>
            </TiltCard>
          ))}
        </StaggerChildren>
      </div>
    </Section>
  );
};

export default Pricing;
