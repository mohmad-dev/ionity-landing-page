'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section/Section';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './SocialProof.module.css';

const LOGOS = [
  { name: "Spectra Cloud", icon: "▲" },
  { name: "Aether Edge", icon: "◆" },
  { name: "Apex Logic", icon: "⬡" },
  { name: "Vertex Labs", icon: "▼" },
  { name: "Helix Systems", icon: "●" },
  { name: "Cognitive Core", icon: "■" },
  { name: "Quantum Edge", icon: "✦" }
];

export const SocialProof = () => {
  const t = useTranslations('socialProof');
  const prefersReducedMotion = useReducedMotion();

  // For infinite marquee, we duplicate the logos
  const marqueeLogos = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <Section id="social-proof" className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <h2 className="caption text-tertiary text-center mb-8 uppercase tracking-widest">
            {t('title')}
          </h2>
        </ScrollReveal>

        <div className={styles.logosWrapper} dir="ltr">
          <div 
            className={`${styles.logos} ${prefersReducedMotion ? '' : styles.marquee}`}
          >
            {marqueeLogos.map((item, i) => (
              <div key={i} className={styles.logoItem}>
                <span className={styles.logoIcon}>{item.icon}</span>
                <span className={styles.logoText}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default SocialProof;
