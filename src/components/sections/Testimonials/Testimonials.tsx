import React from 'react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section/Section';
import { SectionLabel } from '@/components/ui/SectionLabel/SectionLabel';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import styles from './Testimonials.module.css';

export const Testimonials = () => {
  const t = useTranslations('testimonials');

  const testimonials = [0, 1, 2].map(idx => ({
    quote: t(`items.${idx}.quote`),
    author: t(`items.${idx}.author`),
    role: t(`items.${idx}.role`)
  }));

  return (
    <Section id="testimonials" className={styles.section} withOrb orbColor="mint" orbPosition="right">
      <div className={styles.header}>
        <ScrollReveal>
          <SectionLabel>{t('overline')}</SectionLabel>
          <h2 className="h2 max-w-2xl">{t('title')}</h2>
        </ScrollReveal>
      </div>

      <StaggerChildren className={styles.grid}>
        {testimonials.map((item, idx) => (
          <div key={idx} className={styles.card}>
            {/* Quote Icon */}
            <div className={styles.quoteIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11L8 15H11V19H5V15L7 11H5V5H11V11H10ZM20 11L18 15H21V19H15V15L17 11H15V5H21V11H20Z" fill="currentColor"/>
              </svg>
            </div>
            
            <p className="body mb-6 text-primary">{item.quote}</p>
            
            <div className={styles.author}>
              <div className={styles.avatar}>
                {item.author.charAt(0)}
              </div>
              <div className={styles.meta}>
                <h3 className={styles.name}>{item.author}</h3>
                <p className="caption text-secondary">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </StaggerChildren>
    </Section>
  );
};

export default Testimonials;
