'use client';

import { useState, useEffect, RefObject } from 'react';

export const useScrollProgress = (ref?: RefObject<HTMLElement | null>) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref && ref.current) {
        // Calculate progress based on element's position
        const element = ref.current;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 0 when top enters bottom of screen, 1 when bottom leaves top of screen
        const totalDistance = windowHeight + rect.height;
        const scrolled = windowHeight - rect.top;
        
        const currentProgress = Math.min(Math.max(scrolled / totalDistance, 0), 1);
        setProgress(currentProgress);
      } else {
        // Global scroll progress
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrolled = window.scrollY;
        
        const currentProgress = scrolled / (documentHeight - windowHeight);
        setProgress(Math.min(Math.max(currentProgress, 0), 1));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  return progress;
};
