'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshWireframeProps } from '@react-three/drei';
import * as THREE from 'three';

// ── Icosahedron Hero Object ────────────────────────────────────
interface IcosahedronProps {
  scrollProgress: React.MutableRefObject<number>;
}

export const FloatingIcosahedron = ({ scrollProgress }: IcosahedronProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || !wireRef.current) return;
    const t = state.clock.elapsedTime;
    const s = scrollProgress.current;

    // Continuous slow rotation
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.12;
    wireRef.current.rotation.x = meshRef.current.rotation.x;
    wireRef.current.rotation.y = meshRef.current.rotation.y;

    // Scroll-driven scale: grows from 1 → 0.3 then back to 0.8
    const scale = s < 0.3
      ? THREE.MathUtils.lerp(1.0, 0.6, s / 0.3)
      : s < 0.7
      ? THREE.MathUtils.lerp(0.6, 0.4, (s - 0.3) / 0.4)
      : THREE.MathUtils.lerp(0.4, 0.7, (s - 0.7) / 0.3);

    meshRef.current.scale.setScalar(scale);
    wireRef.current.scale.setScalar(scale * 1.01);

    // Floating bob
    const bobY = Math.sin(t * 0.4) * 0.08;
    meshRef.current.position.y = bobY;
    wireRef.current.position.y = bobY;

    // Scroll-driven position X: start center, move right as we scroll
    const posX = THREE.MathUtils.lerp(0, 3.5, Math.min(s * 3, 1));
    meshRef.current.position.x = posX;
    wireRef.current.position.x = posX;
  });

  return (
    <group>
      {/* Solid inner mesh — very dark */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial
          color="#080808"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      {/* Wireframe overlay — mint green */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial
          color="#00a868"
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
    </group>
  );
};
