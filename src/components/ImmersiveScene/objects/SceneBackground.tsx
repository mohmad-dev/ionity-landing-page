'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BackgroundColorProps {
  scrollProgress: React.MutableRefObject<number>;
}

// Color scheme — dark canvas with deep void
const darkColor  = new THREE.Color('#080810');   // deep near-black with slight blue
const midColor   = new THREE.Color('#0a0f1e');   // deep navy for transition
const lightColor = new THREE.Color('#f0f4f8');   // cooler, premium off-white
const tempColor  = new THREE.Color();

let lastS = -1;

export const SceneBackground = ({ scrollProgress }: BackgroundColorProps) => {
  useFrame(({ scene }) => {
    const s = scrollProgress.current;

    // Only update when scroll actually changes (perf)
    if (Math.abs(s - lastS) < 0.0005) return;
    lastS = s;

    let t = 0; // 0 = dark, 1 = light

    // Dark → Light → Dark mapping:
    // Hero (dark) → Services (dark) → Metrics (light) → CTA/Footer (light)
    if (s < 0.09) {
      t = 0;
    } else if (s >= 0.09 && s < 0.20) {
      t = 0; // stays dark during services entrance
    } else if (s >= 0.20 && s < 0.68) {
      t = 0; // fully dark for Services + Timeline
    } else if (s >= 0.68 && s < 0.78) {
      // Transition dark → light
      t = (s - 0.68) / 0.10;
    } else {
      t = 1; // light for Metrics, CTA, Contact
    }

    // Smooth hermite easing
    const eased = t * t * (3 - 2 * t);
    tempColor.copy(darkColor).lerp(lightColor, eased);
    scene.background = tempColor;

    // Keep CSS body background perfectly synced (prevents seams)
    if (typeof document !== 'undefined') {
      const hex = '#' + tempColor.getHexString();
      document.body.style.backgroundColor = hex;

      // Drive CSS variables for text color transitions
      const isLight = eased > 0.5;
      document.documentElement.style.setProperty(
        '--scene-text-primary',
        isLight ? '#1a1a2e' : '#f0f4f8'
      );
      document.documentElement.style.setProperty(
        '--scene-text-secondary',
        isLight ? 'rgba(26,26,46,0.6)' : 'rgba(240,244,248,0.5)'
      );
      document.documentElement.style.setProperty(
        '--scene-bg-mode',
        isLight ? '1' : '0'
      );
    }
  });

  return null;
};
