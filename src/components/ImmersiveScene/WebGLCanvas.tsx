'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleLogo } from './objects/ParticleLogo';
import { ParticleField } from './objects/ParticleField';
import { SceneBackground } from './objects/SceneBackground';
import { CameraController } from './objects/CameraController';
import styles from './ImmersiveScene.module.css';

interface WebGLCanvasProps {
  scrollProgress: React.MutableRefObject<number>;
  timelineProgress: React.MutableRefObject<number>;
}

export const WebGLCanvas = ({ scrollProgress, timelineProgress }: WebGLCanvasProps) => {
  return (
    <div className={styles.canvasWrap} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 1.8]}
      >
        {/* Dynamic background */}
        <SceneBackground scrollProgress={scrollProgress} />

        {/* Camera */}
        <CameraController scrollProgress={scrollProgress} timelineProgress={timelineProgress} />

        {/* ── CINEMATIC 3-POINT LIGHTING RIG ── */}
        {/* Key light — cool polar white from upper right */}
        <directionalLight position={[6, 8, 5]} intensity={0.5} color="#cce8ff" />
        {/* Fill light — glowing mint from lower left, the Ionity identity */}
        <pointLight position={[-5, -3, 2]} intensity={2.2} color="#00FFB2" distance={20} decay={2} />
        {/* Rim light — deep cyan from behind, adds depth */}
        <pointLight position={[0, 6, -6]} intensity={0.8} color="#00b4d8" distance={22} decay={2} />
        {/* Subtle ambient */}
        <ambientLight intensity={0.06} color="#080d1a" />

        {/* 3D Objects */}
        <ParticleLogo scrollProgress={scrollProgress} timelineProgress={timelineProgress} />
        <ParticleField scrollProgress={scrollProgress} count={500} />
      </Canvas>
    </div>
  );
};
