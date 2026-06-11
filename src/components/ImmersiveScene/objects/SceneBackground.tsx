'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BackgroundColorProps {
  scrollProgress: React.MutableRefObject<number>;
}

// Dark → Light background transition driven by scroll
const darkColor = new THREE.Color('#080808');
const lightColor = new THREE.Color('#f4f4f2');
const tempColor = new THREE.Color();

export const SceneBackground = ({ scrollProgress }: BackgroundColorProps) => {
  const sceneRef = useRef<THREE.Scene | null>(null);

  useFrame(({ scene }) => {
    const s = scrollProgress.current;
    // Transition starts at 40% scroll, completes at 80%
    const t = THREE.MathUtils.clamp((s - 0.4) / 0.4, 0, 1);
    // Smooth ease
    const eased = t * t * (3 - 2 * t); // smoothstep
    tempColor.copy(darkColor).lerp(lightColor, eased);
    scene.background = tempColor;
  });

  return null;
};
