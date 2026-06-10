'use client';

import React, { useRef, useEffect, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'fade' | 'none';
  delay?: number;
  className?: string;
}

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const revealType = direction === 'fade' ? 'fade' : direction === 'none' ? 'fade' : 'stagger-none';

    if (delay > 0) {
      el.style.transitionDelay = `${delay * 1000}ms`;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  const dataReveal = direction === 'fade' ? 'fade' : direction === 'none' ? 'fade' : undefined;

  return (
    <div
      ref={ref}
      className={className}
      data-reveal={dataReveal ?? ''}
      style={delay > 0 ? {} : undefined}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
