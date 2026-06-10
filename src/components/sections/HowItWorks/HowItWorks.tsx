'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Section } from '@/components/layout/Section/Section';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { TextReveal } from '@/components/animations/TextReveal';
import styles from './HowItWorks.module.css';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorks = () => {
  const t = useTranslations('howItWorks');
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !lineRef.current) return;

    // Animate the connecting line
    gsap.fromTo(lineRef.current, 
      { height: '0%' },
      {
        height: '100%',
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        }
      }
    );

    // Stagger step nodes
    const steps = gsap.utils.toArray(`.${styles.step}`) as HTMLElement[];
    steps.forEach((step, i) => {
      const dot = step.querySelector(`.${styles.dot}`);
      const content = step.querySelector(`.${styles.content}`);
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: step,
          start: "top 75%",
        }
      });

      tl.from(dot, { scale: 0, opacity: 0, duration: 0.4, ease: "power2.out" })
        .from(content, { x: -20, opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
    });
  }, { scope: containerRef });

  return (
    <Section id="process" className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <div className="caption text-accent mb-4 uppercase tracking-widest">{t('overline')}</div>
        </ScrollReveal>
        
        <TextReveal as="h2" type="words" className="h1 mb-16">
          {t('title')}
        </TextReveal>

        <div className={styles.timeline} ref={containerRef}>
          <div className={styles.lineBg} />
          <div className={styles.lineFill} ref={lineRef} />

          {(t.raw('step_details') as { title: string; desc: string }[]).map((step, idx) => (
            <div key={idx} className={styles.step}>
              <div className={styles.dot} />
              <div className={styles.content}>
                <h3 className="h3 mb-2">{step.title}</h3>
                <p className="body text-secondary">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
