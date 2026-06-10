'use client';

import React, { useRef, ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './MagneticButton.module.css';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/** 
 * Subtle magnetic hover — pure CSS transform, no GSAP.
 * Uses mouse position to apply a small translate via inline CSS var.
 */
export const MagneticButton = ({ children, className = '', strength = 8 }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !buttonRef.current) return;

    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2;
    const y = ((e.clientY - top) / height - 0.5) * 2;

    buttonRef.current.style.setProperty('--mag-x', `${x * strength}px`);
    buttonRef.current.style.setProperty('--mag-y', `${y * strength}px`);
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.setProperty('--mag-x', '0px');
    buttonRef.current.style.setProperty('--mag-y', '0px');
  };

  return (
    <div
      ref={buttonRef}
      className={`${styles.magnetic} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};
