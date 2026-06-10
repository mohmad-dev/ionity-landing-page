'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './IntroLoader.module.css';

export const IntroLoader = () => {
  const [phase, setPhase] = useState<'visible' | 'hiding' | 'gone'>('visible');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('ionity-intro-played');
    if (hasPlayed === 'true' || prefersReducedMotion) {
      setPhase('gone');
      return;
    }

    // Lock scroll
    document.body.style.overflow = 'hidden';

    // After logo reveal duration → start fade-out
    const hideTimer = setTimeout(() => {
      setPhase('hiding');
    }, 1800);

    // After fade-out → fully remove
    const removeTimer = setTimeout(() => {
      setPhase('gone');
      document.body.style.overflow = '';
      sessionStorage.setItem('ionity-intro-played', 'true');
    }, 2400);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = '';
    };
  }, [prefersReducedMotion]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`${styles.overlay} ${phase === 'hiding' ? styles.hiding : ''}`}
      aria-hidden="true"
    >
      {/* Logo mark */}
      <div className={styles.centerContent}>
        <div className={styles.logoWrap}>
          <svg
            className={styles.svg}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="intro-split-mask">
                <rect x="0" y="0" width="32" height="32" fill="white" />
                <rect x="13" y="0" width="6" height="32" fill="black" />
              </mask>
            </defs>

            {/* 'O' — Split Circle */}
            <circle
              className={styles.logoO}
              cx="16"
              cy="16"
              r="10"
              stroke="var(--accent-100)"
              strokeWidth="5"
              mask="url(#intro-split-mask)"
            />

            {/* 'I' — Vertical line */}
            <rect
              className={styles.logoI}
              x="14.5"
              y="4"
              width="3"
              height="24"
              rx="1.5"
              fill="var(--text-primary)"
            />
          </svg>
        </div>

        <div className={styles.wordmark}>IONITY</div>

        {/* Progress bar */}
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
