'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ScrollContent } from './ScrollContent';
import styles from './ImmersiveScene.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Lazy-load the WebGL canvas — avoids SSR issues
const WebGLCanvas = dynamic(
  () => import('./WebGLCanvas').then(m => ({ default: m.WebGLCanvas })),
  { ssr: false }
);

// Detect low-power devices
function useLowPowerMode() {
  const [lowPower, setLowPower] = useState(false);
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    setLowPower(reducedMotion || (isMobile && window.innerWidth < 768));
  }, []);
  return lowPower;
}

export const ImmersiveScene = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const timelineProgress = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lowPower = useLowPowerMode();
  const entryDone = useRef(false);

  // ── CINEMATIC ENTRY TIMELINE ───────────────────────────────
  useEffect(() => {
    if (lowPower || entryDone.current || typeof window === 'undefined') return;
    entryDone.current = true;

    // Lock scroll during entry
    document.body.style.overflow = 'hidden';

    // Create master timeline
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
      },
    });

    // Phase 0: Start everything invisible
    gsap.set('[data-entry]', { opacity: 0, y: 48 });
    gsap.set('[data-entry-canvas]', { opacity: 0 });
    gsap.set('[data-entry-overline]', { opacity: 0, y: 20, letterSpacing: '0.4em' });
    gsap.set('[data-entry-headline]', { opacity: 0, y: 60, skewY: 2 });
    gsap.set('[data-entry-sub]', { opacity: 0, y: 30 });
    gsap.set('[data-entry-actions]', { opacity: 0, y: 20 });
    gsap.set('[data-entry-metrics]', { opacity: 0, y: 16 });
    gsap.set('[data-entry-scroll]', { opacity: 0 });

    // Phase 1 (0s → 0.6s): WebGL Canvas fades in
    tl.to('[data-entry-canvas]', {
      opacity: 1,
      duration: 0.9,
      ease: 'power2.inOut',
    }, 0.1);

    // Phase 2 (0.4s → 0.8s): Overline badge snaps in with letter-spacing collapse
    tl.to('[data-entry-overline]', {
      opacity: 1,
      y: 0,
      letterSpacing: '0.14em',
      duration: 0.7,
      ease: 'expo.out',
    }, 0.5);

    // Phase 3 (0.7s → 1.2s): Headline sweeps up with skew correction
    tl.to('[data-entry-headline]', {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: 0.85,
      ease: 'expo.out',
    }, 0.75);

    // Phase 4 (1.0s): Subtitle & actions stagger in
    tl.to('[data-entry-sub]', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, 1.05);

    tl.to('[data-entry-actions]', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, 1.25);

    // Phase 5 (1.4s): Metrics bar slides in
    tl.to('[data-entry-metrics]', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, 1.45);

    // Phase 6 (1.7s): Scroll hint fades
    tl.to('[data-entry-scroll]', {
      opacity: 0.4,
      duration: 0.8,
      ease: 'power1.inOut',
    }, 1.7);

    return () => { tl.kill(); };
  }, [lowPower]);

  // ── ScrollTrigger reveals for non-hero sections ────────────
  useGSAP(() => {
    if (lowPower) {
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
    }

    const otherEls = document.querySelectorAll('[data-reveal]:not([data-reveal="hero"])');
    otherEls.forEach(el => {
      const isStagger = el.getAttribute('data-reveal') === 'stagger';
      const targets = isStagger ? Array.from(el.children) : [el];

      gsap.set(targets, { transition: 'none' });
      if (isStagger) {
        gsap.set(el, { opacity: 1, y: 0, translate: '0 0' });
      }

      gsap.fromTo(targets,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: isStagger ? 0.07 : 0,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  }, { scope: wrapperRef, dependencies: [lowPower] });

  // ── Lenis smooth scroll ────────────────────────────────────
  useEffect(() => {
    if (lowPower) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ({ progress }: { progress: number }) => {
      scrollProgress.current = progress;
      if (typeof window !== 'undefined') {
        const { ScrollTrigger } = require('gsap/ScrollTrigger');
        ScrollTrigger.update();
      }
    });

    const refreshTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const { ScrollTrigger } = require('gsap/ScrollTrigger');
        ScrollTrigger.refresh();
      }
    }, 500);

    let raf: number;
    function raf_fn(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(raf_fn);
    }
    raf = requestAnimationFrame(raf_fn);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(refreshTimer);
      lenis.destroy();
    };
  }, [lowPower]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Fixed 3D Canvas */}
      {!lowPower && (
        <div data-entry-canvas>
          <WebGLCanvas scrollProgress={scrollProgress} timelineProgress={timelineProgress} />
        </div>
      )}

      {/* Fallback for low-power devices */}
      {lowPower && <div className={styles.fallbackBg} />}

      {/* HTML content */}
      <ScrollContent scrollContainerRef={scrollContainerRef} timelineProgress={timelineProgress} />
    </div>
  );
};
