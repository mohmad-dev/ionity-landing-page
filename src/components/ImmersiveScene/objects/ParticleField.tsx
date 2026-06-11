'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  scrollProgress: React.MutableRefObject<number>;
  count?: number;
}

export const ParticleField = ({ scrollProgress, count = 280 }: ParticleFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate stable random positions once
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const s = scrollProgress.current;

    // Very slow drift rotation
    pointsRef.current.rotation.y += delta * 0.015;
    pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.05;

    // Fade out particles slightly as we scroll deeper
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.lerp(0.6, 0.15, s);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00a868"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
};
