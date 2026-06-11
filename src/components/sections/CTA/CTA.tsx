import React from 'react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section/Section';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { TextReveal } from '@/components/animations/TextReveal';
import { MagneticButton } from '@/components/ui/MagneticButton/MagneticButton';
import { Button } from '@/components/ui/Button/Button';
import styles from './CTA.module.css';

export const CTA = () => {
  const t = useTranslations('cta');

  return (
    <Section id="cta" className={styles.section} withOrb orbColor="mint" orbPosition="center">
      <div className={styles.container}>
        <ScrollReveal className={styles.content}>
          <h2 className="display text-primary mb-6">{t('title')}</h2>
          <p className="h3 text-secondary max-w-2xl mx-auto mb-12">
            {t('subtitle')}
          </p>
          <div className={styles.actions}>
            <ScrollReveal direction="up" delay={0.4}>
              <MagneticButton>
                <Button href="#contact" variant="primary" size="lg">
                  {t('primary')}
                </Button>
              </MagneticButton>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.5}>
              <MagneticButton strength={10}>
                <Button href="https://wa.me/1234567890" variant="secondary" size="lg" target="_blank" rel="noopener noreferrer">
                  {t('secondary')}
                </Button>
              </MagneticButton>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
};

export default CTA;
