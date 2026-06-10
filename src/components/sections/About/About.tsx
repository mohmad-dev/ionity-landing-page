'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section/Section';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { TextReveal } from '@/components/animations/TextReveal';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import styles from './About.module.css';
import { TiltCard } from '@/components/animations/TiltCard';

export const About = () => {
  const t = useTranslations('about');

  const values = [
    {
      number: '01',
      title: t('value1_title'),
      desc: t('value1_desc')
    },
    {
      number: '02',
      title: t('value2_title'),
      desc: t('value2_desc')
    },
    {
      number: '03',
      title: t('value3_title'),
      desc: t('value3_desc')
    }
  ];

  return (
    <Section id="about" className={styles.section} withOrb orbColor="cool" orbPosition="right">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left: Text and Overline */}
          <div className={styles.left}>
            <ScrollReveal>
              <div className="caption text-accent mb-4 uppercase tracking-widest">
                {t('overline')}
              </div>
            </ScrollReveal>
            <TextReveal as="h2" type="words" className="h1 mb-6">
              {t('title')}
            </TextReveal>
            <ScrollReveal delay={0.2}>
              <p className="body text-secondary max-w-xl">
                {t('description')}
              </p>
            </ScrollReveal>
          </div>

          {/* Right: Modern Value Grid */}
          <div className={styles.right}>
            <StaggerChildren className={styles.valuesList}>
              {values.map((value, i) => (
                <TiltCard key={i} className={styles.valueCard} intensity={6}>
                  <div className={styles.header}>
                    <span className={`mono text-accent ${styles.number}`}>{value.number}</span>
                    <h3 className="h3">{value.title}</h3>
                  </div>
                  <p className="body text-secondary mt-3">{value.desc}</p>
                </TiltCard>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
