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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);        // [0..1] normalized scroll
  const timelineProgress = useRef(0);      // Local timeline pinning progress
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lowPower = useLowPowerMode();

  // ── Global GSAP ScrollTrigger Entrance Animations ───────────
  useGSAP(() => {
    if (lowPower) {
      // Fallback for low-power mode: standard IntersectionObserver
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

    // Normal mode: GSAP reveals
    // 1. Hero immediate reveal (no delay/scroll requirement to prevent white screen text delay)
    const heroEl = document.querySelector('[data-reveal="hero"]');
    if (heroEl) {
      gsap.set(heroEl, { transition: 'none' });
      gsap.fromTo(heroEl,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          delay: 0.15
        }
      );
    }

    // 2. ScrollTrigger reveals for the rest of the sections
    const otherEls = document.querySelectorAll('[data-reveal]:not([data-reveal="hero"])');
    otherEls.forEach(el => {
      const isStagger = el.getAttribute('data-reveal') === 'stagger';
      const targets = isStagger ? Array.from(el.children) : [el];

      // Disable CSS transitions so GSAP can animate cleanly
      gsap.set(targets, { transition: 'none' });

      // If it is a stagger layout, show the parent container itself (so it is not hidden by [data-reveal])
      if (isStagger) {
        gsap.set(el, { opacity: 1, y: 0, translate: '0 0' });
      }

      gsap.fromTo(targets, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: isStagger ? 0.08 : 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  }, { scope: wrapperRef, dependencies: [lowPower] });

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
      
      // Notify ScrollTrigger about scroll updates
      if (typeof window !== 'undefined') {
        const { ScrollTrigger } = require('gsap/ScrollTrigger');
        ScrollTrigger.update();
      }
    });

    // Refresh ScrollTrigger positions after page fully renders
    const refreshTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const { ScrollTrigger } = require('gsap/ScrollTrigger');
        ScrollTrigger.refresh();
      }
    }, 600);

    // Animation loop
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
      {/* Fixed 3D Canvas — behind everything */}
      {!lowPower && <WebGLCanvas scrollProgress={scrollProgress} timelineProgress={timelineProgress} />}

      {/* If low power, just a solid dark background */}
      {lowPower && <div className={styles.fallbackBg} />}

      {/* HTML content scrolls on top */}
      <ScrollContent scrollContainerRef={scrollContainerRef} timelineProgress={timelineProgress} />
    </div>
  );
};
