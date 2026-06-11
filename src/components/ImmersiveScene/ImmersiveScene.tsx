'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';
import { ScrollContent } from './ScrollContent';
import styles from './ImmersiveScene.module.css';

// Lazy-load the WebGL canvas — avoids SSR issues
const WebGLCanvas = dynamic(
  () => import('./WebGLCanvas').then(m => ({ default: m.WebGLCanvas })),
  { ssr: false }
);

// Detect low-power devices (mobile / reduced motion preference)
function useLowPowerMode() {
  const [lowPower, setLowPower] = useState(false);
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    // Also check for GPU limits via canvas
    setLowPower(reducedMotion || (isMobile && window.innerWidth < 768));
  }, []);
  return lowPower;
}

export const ImmersiveScene = () => {
  const scrollProgress = useRef(0);        // [0..1] normalized scroll
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lowPower = useLowPowerMode();

  // ── Global IntersectionObserver for [data-reveal] elements ───
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Lenis smooth scroll + scroll progress tracker ────────────
  useEffect(() => {
    if (lowPower) return;

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Track normalized scroll progress
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      scrollProgress.current = progress;
    });

    // Animation loop
    let raf: number;
    function raf_fn(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(raf_fn);
    }
    raf = requestAnimationFrame(raf_fn);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [lowPower]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Fixed 3D Canvas — behind everything */}
      {!lowPower && <WebGLCanvas scrollProgress={scrollProgress} />}

      {/* If low power, just a solid dark background */}
      {lowPower && <div className={styles.fallbackBg} />}

      {/* HTML content scrolls on top */}
      <ScrollContent scrollContainerRef={scrollContainerRef} />
    </div>
  );
};
