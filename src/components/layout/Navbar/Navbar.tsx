'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { playClickSound } from '@/lib/sound';
import styles from './Navbar.module.css';
import { Button } from '@/components/ui/Button/Button';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { IonityLogo } from '@/components/ui/IonityLogo/IonityLogo';

export const Navbar = () => {
  const t = useTranslations('nav');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If we've scrolled more than 50px, add glassmorphism
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    playClickSound();
    setIsOpen(false);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${isOpen ? styles.headerOpen : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="Ionity Home" onClick={handleLinkClick}>
          <IonityLogo size={24} />
          <span className={styles.logoText}>Ionity</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="#features" className={styles.link} onClick={playClickSound}>{t('features')}</Link>
          <Link href="#product" className={styles.link} onClick={playClickSound}>{t('product')}</Link>
          <Link href="#about" className={styles.link} onClick={playClickSound}>{t('about')}</Link>
        </nav>

        <div className={styles.actions}>
          <div className={styles.desktopActions}>
            <LocaleSwitcher />
            <Button variant="primary" size="sm" className={styles.cta} href="#contact" onClick={() => setIsOpen(false)}>
              {t('cta')}
            </Button>
          </div>

          <button 
            className={`${styles.hamburger} ${isOpen ? styles.hamburgerActive : ''}`}
            onClick={() => {
              playClickSound();
              setIsOpen(!isOpen);
            }}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span className={styles.hamburgerBar} />
            <span className={styles.hamburgerBar} />
            <span className={styles.hamburgerBar} />
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Menu Overlay */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <Link href="#features" className={styles.mobileLink} onClick={handleLinkClick}>
            {t('features')}
          </Link>
          <Link href="#product" className={styles.mobileLink} onClick={handleLinkClick}>
            {t('product')}
          </Link>
          <Link href="#about" className={styles.mobileLink} onClick={handleLinkClick}>
            {t('about')}
          </Link>
          
          <div className={styles.mobileSeparator} />
          
          <div className={styles.mobileActionsContainer}>
            <div className={styles.mobileSwitcher}>
              <LocaleSwitcher />
            </div>
            <Button variant="primary" size="lg" className={styles.mobileCta} href="#contact" onClick={handleLinkClick}>
              {t('cta')}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
