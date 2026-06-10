'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  value: string; // e.g. "99.99%", "<50ms", "10x"
  className?: string;
}

export const AnimatedCounter = ({ value, className = '' }: AnimatedCounterProps) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Parse out the numeric part and suffix/prefix
  const match = value.match(/^([^\d]*)?([\d,.]+)([^\d]*)?$/);
  const prefix = match?.[1] || '';
  const numStr = match?.[2] || value;
  const suffix = match?.[3] || '';
  
  // Clean commas for parsing
  const isFloat = numStr.includes('.');
  const numValue = parseFloat(numStr.replace(/,/g, ''));
  const hasComma = numStr.includes(',');

  useEffect(() => {
    if (prefersReducedMotion || !elementRef.current || isNaN(numValue)) return;

    const obj = { val: 0 };
    
    ScrollTrigger.create({
      trigger: elementRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: numValue,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            if (elementRef.current) {
              let formatted = isFloat 
                ? obj.val.toFixed(2)
                : Math.floor(obj.val).toString();
                
              if (hasComma && !isFloat) {
                formatted = parseInt(formatted).toLocaleString();
              }
              
              elementRef.current.innerText = `${prefix}${formatted}${suffix}`;
            }
          }
        });
      }
    });

  }, [numValue, prefix, suffix, isFloat, hasComma, prefersReducedMotion]);

  if (prefersReducedMotion || isNaN(numValue)) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={elementRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
};
