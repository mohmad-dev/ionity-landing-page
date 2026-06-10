'use client';

import React, { useRef, useEffect, ReactNode } from 'react';

interface StaggerChildrenProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

export const StaggerChildren = ({
  children,
  delay = 0,
  className = '',
  as: Component = 'div',
}: StaggerChildrenProps) => {
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
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Component as any;

  return (
    <Comp ref={ref} className={className} data-reveal="stagger">
      {children}
    </Comp>
  );
};

export default StaggerChildren;
