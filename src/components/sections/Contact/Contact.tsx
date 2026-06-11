'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section/Section';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { TextReveal } from '@/components/animations/TextReveal';
import { Button } from '@/components/ui/Button/Button';
import { MagneticButton } from '@/components/ui/MagneticButton/MagneticButton';
import styles from './Contact.module.css';

export const Contact = () => {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate API request and trigger success state
    setIsSubmitted(true);
    setTimeout(() => {
      // Open WhatsApp pre-filled message with details
      const text = `Hello Ionity, my name is ${formData.name} (${formData.email}). Message: ${formData.message}`;
      window.open(`https://wa.me/1234567890?text=${encodeURIComponent(text)}`, '_blank');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 1200);
  };

  return (
    <Section id="contact" className={styles.section} withOrb orbColor="cool" orbPosition="center">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left: Contact Info */}
          <div className={styles.left}>
            <ScrollReveal>
              <div className="caption text-accent mb-4 uppercase tracking-widest">
                {t('overline')}
              </div>
            </ScrollReveal>
            <TextReveal as="h2" type="words" className="h2 mb-6">
              {t('title')}
            </TextReveal>
            <ScrollReveal delay={0.2}>
              <p className="body text-secondary mb-10 max-w-md">
                {t('subtitle')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3} className={styles.details}>
              <div className={styles.detailItem}>
                <div className={styles.iconWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div className="caption text-tertiary">{t('email')}</div>
                  <a href="mailto:hello@ionitytech.com" className="body text-primary font-bold hover:text-accent-100 transition-colors">
                    hello@ionitytech.com
                  </a>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.iconWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div className="caption text-tertiary">{t('whatsapp')}</div>
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="body text-primary font-bold hover:text-accent-100 transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Contact Form */}
          <div className={styles.right}>
            <ScrollReveal delay={0.2} className={styles.formCard}>
              {isSubmitted ? (
                <div className={styles.successMessage}>
                  <div className={styles.successRing}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="h3 mt-6 mb-2">{t('success_title')}</h3>
                  <p className="body text-secondary text-center">{t('success_desc')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.field}>
                    <label htmlFor="name" className="caption text-secondary mb-2 block">
                      {t('label_name')}
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      placeholder={t('placeholder_name')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="email" className="caption text-secondary mb-2 block">
                      {t('label_email')}
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      placeholder={t('placeholder_email')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="message" className="caption text-secondary mb-2 block">
                      {t('label_message')}
                    </label>
                    <textarea 
                      id="message" 
                      required
                      rows={5}
                      placeholder={t('placeholder_message')}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={styles.textarea}
                    />
                  </div>

                  <MagneticButton strength={4}>
                    <button type="submit" className={styles.submitBtn}>
                      {t('submit')}
                    </button>
                  </MagneticButton>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
