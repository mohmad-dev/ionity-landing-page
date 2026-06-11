'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { FloatingIcosahedron } from './objects/FloatingIcosahedron';
import { ParticleField } from './objects/ParticleField';
import { SceneBackground } from './objects/SceneBackground';
import { CameraController } from './objects/CameraController';
import styles from './ImmersiveScene.module.css';

interface WebGLCanvasProps {
  scrollProgress: React.MutableRefObject<number>;
}

export const WebGLCanvas = ({ scrollProgress }: WebGLCanvasProps) => {
  return (
    <div className={styles.canvasWrap} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        {/* Dynamic background color */}
        <SceneBackground scrollProgress={scrollProgress} />

        {/* Camera driven by scroll */}
        <CameraController scrollProgress={scrollProgress} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, -3, -2]} intensity={0.4} color="#00a868" />
        <pointLight position={[0, -5, 3]} intensity={0.3} color="#00a868" />

        {/* 3D Objects */}
        <FloatingIcosahedron scrollProgress={scrollProgress} />
        <ParticleField scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};
