'use client';

import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BackgroundColorProps {
  scrollProgress: React.MutableRefObject<number>;
}

// Background colors
const lightColor = new THREE.Color('#f5f5f7');
const darkColor = new THREE.Color('#0e0e11');
const tempColor = new THREE.Color();

export const SceneBackground = ({ scrollProgress }: BackgroundColorProps) => {
  useFrame(({ scene }) => {
    const s = scrollProgress.current;
    let t = 0; // 0 represents lightColor, 1 represents darkColor

    // Transition from Light to Dark, and back to Light
    if (s < 0.09) {
      t = 0; // Hero section stays fully light
    } else if (s >= 0.09 && s < 0.20) {
      t = (s - 0.09) / 0.11; // Fade into dark during Services entrance
    } else if (s >= 0.20 && s < 0.68) {
      t = 1; // Stay fully dark for Services and Timeline sections
    } else if (s >= 0.68 && s < 0.78) {
      t = 1 - (s - 0.68) / 0.10; // Fade back to light before Metrics section
    } else {
      t = 0; // Stay fully light for Metrics, CTA, Contact, and Footer
    }

    // Smoothstep interpolation
    const eased = t * t * (3 - 2 * t);
    tempColor.copy(lightColor).lerp(darkColor, eased);
    scene.background = tempColor;

    // Keep the document body background perfectly synced to prevent seams
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = tempColor.getStyle();
    }
  });

  return null;
};
