'use client';

import React from 'react';
import styles from './IonityLogo.module.css';

interface IonityLogoProps {
  className?: string;
  size?: number;
}

/**
 * IonityLogo — Static SVG mark with CSS animation on hover.
 * No GSAP dependency. The I/O metaphor is always visible.
 */
export const IonityLogo = ({ className = '', size = 32 }: IonityLogoProps) => {
  return (
    <svg
      className={`${styles.logo} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ionity Logo"
    >
      <defs>
        <mask id="logo-split-mask">
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
        stroke="var(--text-primary)"
        strokeWidth="5"
        mask="url(#logo-split-mask)"
      />

      {/* 'I' — Vertical line */}
      <rect
        className={styles.logoI}
        x="14.5"
        y="4"
        width="3"
        height="24"
        rx="1.5"
        fill="var(--accent-100)"
      />
    </svg>
  );
};
