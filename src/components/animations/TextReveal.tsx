'use client';

import React, { useRef, useEffect, ReactNode } from 'react';

interface TextRevealProps {
  children: ReactNode;
  type?: 'chars' | 'words' | 'lines';
  delay?: number;
  stagger?: number;
  className?: string;
  as?: React.ElementType;
}

/** Clean fade-in text reveal — no word splitting, no GSAP */
export const TextReveal = ({
  children,
  delay = 0,
  className = '',
  as: Component = 'div',
}: TextRevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Component as any;

  return (
    <Comp ref={ref} className={className} data-reveal="">
      {children}
    </Comp>
  );
};

export default TextReveal;
