'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  scrollProgress: React.MutableRefObject<number>;
}

// Camera path keyframes — [scroll_t, x, y, z]
const PATH = [
  { t: 0.00, x: 0,    y: 0,    z: 7   },  // Hero: straight ahead
  { t: 0.20, x: -0.5, y: 0.3,  z: 6.5 },  // Entering services
  { t: 0.40, x: -1.2, y: 0.8,  z: 5.8 },  // Deep services
  { t: 0.55, x: -0.8, y: 1.2,  z: 5.5 },  // How it works
  { t: 0.70, x: 0,    y: 0.5,  z: 6   },  // Metrics
  { t: 0.85, x: 0.3,  y: -0.2, z: 6.5 },  // CTA approach
  { t: 1.00, x: 0,    y: 0,    z: 7   },  // Rest
];

// Smooth cubic interpolation between keyframes
function samplePath(s: number) {
  // Find surrounding keyframes
  let lo = PATH[0], hi = PATH[PATH.length - 1];
  for (let i = 0; i < PATH.length - 1; i++) {
    if (s >= PATH[i].t && s <= PATH[i + 1].t) {
      lo = PATH[i];
      hi = PATH[i + 1];
      break;
    }
  }
  const range = hi.t - lo.t;
  const t = range === 0 ? 0 : (s - lo.t) / range;
  const e = t * t * (3 - 2 * t); // smoothstep
  return {
    x: lo.x + (hi.x - lo.x) * e,
    y: lo.y + (hi.y - lo.y) * e,
    z: lo.z + (hi.z - lo.z) * e,
  };
}

const _target = new THREE.Vector3();
const _current = new THREE.Vector3();

export const CameraController = ({ scrollProgress }: CameraControllerProps) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const s = scrollProgress.current;
    const pt = samplePath(s);
    _target.set(pt.x, pt.y, pt.z);
    // Smooth follow — lerp camera toward target
    _current.copy(camera.position);
    camera.position.lerp(_target, delta * 3.5);
    // Always look at origin
    camera.lookAt(0, 0, 0);
  });

  return null;
};
