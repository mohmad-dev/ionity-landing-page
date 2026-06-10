import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { IonityLogo } from '@/components/ui/IonityLogo/IonityLogo';
import styles from './Footer.module.css';

export const Footer = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <IonityLogo size={28} />
              <span className={styles.logoText} style={{ margin: 0 }}>Ionity</span>
            </div>
            <p className="caption text-tertiary max-w-xs">
              {t('description')}
            </p>
          </div>
          
          <div className={styles.linksRow}>
            <div className={styles.column}>
              <div className="caption text-secondary font-bold mb-4">{t('product')}</div>
              <Link href="#features" className={styles.link}>{tNav('features')}</Link>
              <Link href="#product" className={styles.link}>{tNav('product')}</Link>
              <Link href="#pricing" className={styles.link}>{t('pricing')}</Link>
            </div>
            <div className={styles.column}>
              <div className="caption text-secondary font-bold mb-4">{t('company')}</div>
              <Link href="#about" className={styles.link}>{tNav('about')}</Link>
              <Link href="#careers" className={styles.link}>{t('careers')}</Link>
              <Link href="#contact" className={styles.link}>{tNav('contact')}</Link>
            </div>
            <div className={styles.column}>
              <div className="caption text-secondary font-bold mb-4">{t('legal')}</div>
              <Link href="#privacy" className={styles.link}>{t('links.privacy')}</Link>
              <Link href="#terms" className={styles.link}>{t('links.terms')}</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p className="caption text-secondary">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
