'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface ParticleLogoProps {
  scrollProgress: React.MutableRefObject<number>;
  timelineProgress: React.MutableRefObject<number>;
}

// Client-side text rasterizer to sample 3D points
function sampleTextPoints(text: string, count: number): { x: number; y: number; z: number }[] {
  if (typeof document === 'undefined') {
    return Array.from({ length: count }, () => ({ x: 0, y: 0, z: 0 }));
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Array.from({ length: count }, () => ({ x: 0, y: 0, z: 0 }));

  // Clear background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw bold brand text centered
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const activePixels: { x: number; y: number }[] = [];

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const red = data[(y * canvas.width + x) * 4];
      if (red > 128) {
        activePixels.push({ x, y });
      }
    }
  }

  const points = [];
  if (activePixels.length === 0) {
    return Array.from({ length: count }, () => ({ x: 0, y: 0, z: 0 }));
  }

  for (let i = 0; i < count; i++) {
    const pixel = activePixels[Math.floor(Math.random() * activePixels.length)];
    // Map canvas coordinates to 3D space
    const tx = ((pixel.x - 128) / 128) * 3.0 + (Math.random() - 0.5) * 0.05;
    const ty = -((pixel.y - 32) / 32) * 0.75 + (Math.random() - 0.5) * 0.05;
    const tz = (Math.random() - 0.5) * 0.15;

    points.push({ x: tx, y: ty, z: tz });
  }

  return points;
}

export const ParticleLogo = ({ scrollProgress, timelineProgress }: ParticleLogoProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const prevPositions = useRef<Float32Array | null>(null);

  // Refs for GSAP-cushioned scroll variables
  const smoothS = useRef(0);
  const smoothTp = useRef(0);

  const particleCount = 10000;
  const ringCount = 7000;
  const lineCount = 3000;

  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  // Generate a soft circular particle texture dynamically
  const circleTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Generate particle data (positions, scattered coordinates, colors, and target coordinates)
  const particleData = useMemo(() => {
    const data = [];
    const ionityPoints = sampleTextPoints("IONITY", particleCount);
    const scalePoints = sampleTextPoints("SCALE", particleCount);

    const step1Points: { x: number; y: number; z: number }[] = [];
    const step2Points: { x: number; y: number; z: number }[] = [];
    const step3Points: { x: number; y: number; z: number }[] = [];
    const step4Points: { x: number; y: number; z: number }[] = [];
    const step5Points: { x: number; y: number; z: number }[] = [];
    const step6Points: { x: number; y: number; z: number }[] = [];

    // Magnifying glass (Step 1)
    const splitIdx = Math.floor(particleCount * 0.7);
    for (let i = 0; i < particleCount; i++) {
      if (i < splitIdx) {
        const theta = (i / splitIdx) * Math.PI * 2;
        const x = 0.9 * Math.cos(theta) + rand(-0.03, 0.03);
        const y = 0.9 * Math.sin(theta) + 0.4 + rand(-0.03, 0.03);
        const z = rand(-0.05, 0.05);
        step1Points.push({ x, y, z });
      } else {
        const t = (i - splitIdx) / (particleCount - splitIdx);
        const x = -t * 1.1 + rand(-0.03, 0.03);
        const y = -0.1 - t * 1.1 + rand(-0.03, 0.03);
        const z = rand(-0.05, 0.05);
        step1Points.push({ x, y, z });
      }
    }

    // Page Document (Step 2)
    for (let i = 0; i < particleCount; i++) {
      if (i % 3 === 0) {
        const L = (i % 18) / 3;
        const x = rand(-0.6, 0.6);
        const y = 0.7 - L * 0.26 + rand(-0.015, 0.015);
        const z = Math.sin((x + 0.75) / 1.5 * Math.PI) * 0.2;
        step2Points.push({ x, y, z });
      } else {
        const x = rand(-0.7, 0.7);
        const y = rand(-0.9, 0.9);
        const z = Math.sin((x + 0.75) / 1.5 * Math.PI) * 0.2 + rand(-0.02, 0.02);
        step2Points.push({ x, y, z });
      }
    }

    // 3D Wireframe Cube (Step 3)
    for (let i = 0; i < particleCount; i++) {
      const face = i % 6;
      let x = 0, y = 0, z = 0;
      if (face === 0) { x = 0.9; y = rand(-0.9, 0.9); z = rand(-0.9, 0.9); }
      else if (face === 1) { x = -0.9; y = rand(-0.9, 0.9); z = rand(-0.9, 0.9); }
      else if (face === 2) { y = 0.9; x = rand(-0.9, 0.9); z = rand(-0.9, 0.9); }
      else if (face === 3) { y = -0.9; x = rand(-0.9, 0.9); z = rand(-0.9, 0.9); }
      else if (face === 4) { z = 0.9; x = rand(-0.9, 0.9); y = rand(-0.9, 0.9); }
      else { z = -0.9; x = rand(-0.9, 0.9); y = rand(-0.9, 0.9); }
      step3Points.push({ x: x + rand(-0.02, 0.02), y: y + rand(-0.02, 0.02), z: z + rand(-0.02, 0.02) });
    }

    // Computer screen (Step 4)
    const b1 = Math.floor(particleCount * 0.44);
    const b2 = Math.floor(particleCount * 0.72);
    const b3 = Math.floor(particleCount * 0.86);
    for (let i = 0; i < particleCount; i++) {
      if (i < b1) {
        const p = rand(0, 7.6);
        let x = 0, y = 0;
        if (p < 2.6) { x = -1.3 + p; y = 0.8; }
        else if (p < 3.8) { x = 1.3; y = 0.8 - (p - 2.6); }
        else if (p < 6.4) { x = 1.3 - (p - 3.8); y = -0.4; }
        else { x = -1.3; y = -0.4 + (p - 6.4); }
        step4Points.push({ x: x + rand(-0.02, 0.02), y: y + rand(-0.02, 0.02), z: rand(-0.03, 0.03) });
      } else if (i < b2) {
        const x = rand(-1.2, 1.2);
        const y = rand(-0.3, 0.7);
        step4Points.push({ x, y, z: rand(-0.03, 0.03) });
      } else if (i < b3) {
        const x = rand(-0.07, 0.07);
        const y = rand(-0.8, -0.4);
        step4Points.push({ x, y, z: rand(-0.03, 0.03) });
      } else {
        const x = rand(-0.5, 0.5);
        const y = -0.8 + rand(-0.04, 0.04);
        step4Points.push({ x, y, z: rand(-0.03, 0.03) });
      }
    }

    // Checkmark inside circle ring (Step 5)
    const checkIdx1 = Math.floor(particleCount * 0.15);
    const checkIdx2 = Math.floor(particleCount * 0.50);
    for (let i = 0; i < particleCount; i++) {
      if (i < checkIdx1) {
        const t = i / checkIdx1;
        const x = -0.6 + t * 0.45 + rand(-0.03, 0.03);
        const y = -0.1 - t * 0.45 + rand(-0.03, 0.03);
        step5Points.push({ x, y, z: rand(-0.03, 0.03) });
      } else if (i < checkIdx2) {
        const t = (i - checkIdx1) / (checkIdx2 - checkIdx1);
        const x = -0.15 + t * 0.85 + rand(-0.03, 0.03);
        const y = -0.55 + t * 0.95 + rand(-0.03, 0.03);
        step5Points.push({ x, y, z: rand(-0.03, 0.03) });
      } else {
        // Outer success circle ring
        const theta = ((i - checkIdx2) / (particleCount - checkIdx2)) * Math.PI * 2;
        const x = 1.1 * Math.cos(theta) + rand(-0.02, 0.02);
        const y = 1.1 * Math.sin(theta) + rand(-0.02, 0.02);
        step5Points.push({ x, y, z: rand(-0.03, 0.03) });
      }
    }

    // Rocket spaceship (Step 6)
    const r1 = Math.floor(particleCount * 0.3);
    const r2 = Math.floor(particleCount * 0.7);
    const r3 = Math.floor(particleCount * 0.8);
    for (let i = 0; i < particleCount; i++) {
      if (i < r1) {
        const h = (i / r1);
        const y = 0.3 + h * 0.7;
        const r = 0.35 * (1.0 - h);
        const theta = rand(0, Math.PI * 2);
        step6Points.push({
          x: r * Math.cos(theta) + rand(-0.02, 0.02),
          y: y + rand(-0.02, 0.02),
          z: r * Math.sin(theta) + rand(-0.02, 0.02)
        });
      } else if (i < r2) {
        const h = (i - r1) / (r2 - r1);
        const y = -0.5 + h * 0.8;
        const theta = rand(0, Math.PI * 2);
        step6Points.push({
          x: 0.35 * Math.cos(theta) + rand(-0.02, 0.02),
          y: y + rand(-0.02, 0.02),
          z: 0.35 * Math.sin(theta) + rand(-0.02, 0.02)
        });
      } else if (i < r3) {
        const wingSide = (i % 2 === 0) ? 1 : -1;
        const h = (i - r2) / (r3 - r2);
        const y = -0.5 + h * 0.4;
        const x = wingSide * (0.35 + (1.0 - h) * 0.35);
        step6Points.push({ x, y, z: rand(-0.04, 0.04) });
      } else {
        const y = -0.5 - rand(0.1, 0.7);
        const theta = rand(0, Math.PI * 2);
        const r = rand(0, 0.2);
        step6Points.push({
          x: r * Math.cos(theta) + rand(-0.02, 0.02),
          y: y + rand(-0.02, 0.02),
          z: r * Math.sin(theta) + rand(-0.02, 0.02)
        });
      }
    }

    // 1. Generate split circle ring ("O") particles
    for (let i = 0; i < ringCount; i++) {
      let theta = Math.random() * Math.PI * 2;
      while (Math.abs(Math.cos(theta)) < 0.15) {
        theta = Math.random() * Math.PI * 2;
      }

      const radius = 1.8;
      const tx = radius * Math.cos(theta) + rand(-0.06, 0.06);
      const ty = radius * Math.sin(theta) + rand(-0.06, 0.06);
      const tz = rand(-0.08, 0.08);

      const sAngle = Math.random() * Math.PI * 2;
      const sRad = rand(2.0, 5.0);
      const sx = sRad * Math.cos(sAngle) + rand(-0.5, 0.5);
      const sy = rand(-2.5, 2.5);
      const sz = rand(-2.5, 2.5);

      // Soft, professional Emerald Teal to Mint Cyan colors (harmonious and relaxing)
      const colorMix = Math.random();
      const r = 0.02;
      const g = 0.72 + colorMix * 0.22;
      const b = 0.58 + colorMix * 0.22;

      const ionityX = ionityPoints[i].x;
      const ionityY = ionityPoints[i].y;
      const ionityZ = ionityPoints[i].z;

      const scaleX = scalePoints[i].x;
      const scaleY = scalePoints[i].y;
      const scaleZ = scalePoints[i].z;

      const step1X = step1Points[i].x;
      const step1Y = step1Points[i].y;
      const step1Z = step1Points[i].z;

      const step2X = step2Points[i].x;
      const step2Y = step2Points[i].y;
      const step2Z = step2Points[i].z;

      const step3X = step3Points[i].x;
      const step3Y = step3Points[i].y;
      const step3Z = step3Points[i].z;

      const step4X = step4Points[i].x;
      const step4Y = step4Points[i].y;
      const step4Z = step4Points[i].z;

      const step5X = step5Points[i].x;
      const step5Y = step5Points[i].y;
      const step5Z = step5Points[i].z;

      const step6X = step6Points[i].x;
      const step6Y = step6Points[i].y;
      const step6Z = step6Points[i].z;

      data.push({
        tx, ty, tz, sx, sy, sz,
        ionityX, ionityY, ionityZ,
        scaleX, scaleY, scaleZ,
        step1X, step1Y, step1Z,
        step2X, step2Y, step2Z,
        step3X, step3Y, step3Z,
        step4X, step4Y, step4Z,
        step5X, step5Y, step5Z,
        step6X, step6Y, step6Z,
        r, g, b
      });
    }

    // 2. Generate vertical center line ("I") particles
    for (let i = 0; i < lineCount; i++) {
      const tx = rand(-0.06, 0.06);
      const ty = rand(-2.2, 2.2) + rand(-0.06, 0.06);
      const tz = rand(-0.06, 0.06);

      const sAngle = Math.random() * Math.PI * 2;
      const sRad = rand(1.5, 4.0);
      const sx = sRad * Math.cos(sAngle) + rand(-0.5, 0.5);
      const sy = rand(-3.0, 3.0);
      const sz = rand(-3.0, 3.0);

      // Warm, engineering-focused Jade-Mint colors
      const colorMix = Math.random();
      const r = 0.02;
      const g = 0.78 + colorMix * 0.16;
      const b = 0.44 + colorMix * 0.16;

      const globalIdx = ringCount + i;
      const ionityX = ionityPoints[globalIdx].x;
      const ionityY = ionityPoints[globalIdx].y;
      const ionityZ = ionityPoints[globalIdx].z;

      const scaleX = scalePoints[globalIdx].x;
      const scaleY = scalePoints[globalIdx].y;
      const scaleZ = scalePoints[globalIdx].z;

      const step1X = step1Points[globalIdx].x;
      const step1Y = step1Points[globalIdx].y;
      const step1Z = step1Points[globalIdx].z;

      const step2X = step2Points[globalIdx].x;
      const step2Y = step2Points[globalIdx].y;
      const step2Z = step2Points[globalIdx].z;

      const step3X = step3Points[globalIdx].x;
      const step3Y = step3Points[globalIdx].y;
      const step3Z = step3Points[globalIdx].z;

      const step4X = step4Points[globalIdx].x;
      const step4Y = step4Points[globalIdx].y;
      const step4Z = step4Points[globalIdx].z;

      const step5X = step5Points[globalIdx].x;
      const step5Y = step5Points[globalIdx].y;
      const step5Z = step5Points[globalIdx].z;

      const step6X = step6Points[globalIdx].x;
      const step6Y = step6Points[globalIdx].y;
      const step6Z = step6Points[globalIdx].z;

      data.push({
        tx, ty, tz, sx, sy, sz,
        ionityX, ionityY, ionityZ,
        scaleX, scaleY, scaleZ,
        step1X, step1Y, step1Z,
        step2X, step2Y, step2Z,
        step3X, step3Y, step3Z,
        step4X, step4Y, step4Z,
        step5X, step5Y, step5Z,
        step6X, step6Y, step6Z,
        r, g, b
      });
    }

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = data[i].tx;
      positions[i * 3 + 1] = data[i].ty;
      positions[i * 3 + 2] = data[i].tz;

      colors[i * 3] = data[i].r;
      colors[i * 3 + 1] = data[i].g;
      colors[i * 3 + 2] = data[i].b;
    }

    return { data, positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    // Use GSAP to animate smoothS.current and smoothTp.current to actual scroll values
    gsap.to(smoothS, {
      current: scrollProgress.current,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    gsap.to(smoothTp, {
      current: timelineProgress.current,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    const s = smoothS.current;
    const tp = smoothTp.current;
    const time = state.clock.getElapsedTime();

    const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
    const timelineX = isRtl ? state.viewport.width * 0.31 : -state.viewport.width * 0.31;
    const servicesX = isRtl ? -state.viewport.width * 0.31 : state.viewport.width * 0.31;

    const mouseX = (state.pointer.x * state.viewport.width) / 2;
    const mouseY = (state.pointer.y * state.viewport.height) / 2;

    let centerX = servicesX;
    let opacity = 0.8;
    let scale = 1.0;
    let zOffset = 0;

    let wLogo = 0;
    let wIonity = 0;
    let wScale = 0;
    let wScatter = 0;
    const wStep = [0, 0, 0, 0, 0, 0];

    if (tp > 0) {
      // ── Timeline progress active ──
      centerX = servicesX;
      scale = 1.0;

      if (tp <= 0.90) {
        const normalizedTp = tp / 0.90;
        const position = normalizedTp * 5;
        const index = Math.floor(position);
        const fraction = position - index;

        if (index < 5) {
          wStep[index] = 1.0 - fraction;
          wStep[index + 1] = fraction;
        } else {
          wStep[5] = 1.0;
        }
        opacity = 0.8;
        zOffset = 0;
      } else {
        const p_zoom = (tp - 0.90) / 0.10;
        wStep[5] = 1.0 - p_zoom;
        wScatter = p_zoom;
        centerX = THREE.MathUtils.lerp(servicesX, 0.0, p_zoom);
        scale = 1.0 + p_zoom * 3.5;
        opacity = Math.max(0, 0.8 - p_zoom * 0.8);
        zOffset = p_zoom * 8.5;
      }
    } else {
      // ── Global scroll progress active (Hero / Services) ──
      centerX = servicesX;

      if (s < 0.04) {
        wLogo = 1.0;
        scale = 1.0;
        opacity = 0.8;
        zOffset = 0;
      } else if (s >= 0.04 && s < 0.09) {
        const t = (s - 0.04) / 0.05;
        wLogo = 1.0 - t;
        wIonity = t;
        scale = 1.0;
        opacity = 0.8;
        zOffset = 0;
      } else if (s >= 0.09 && s < 0.15) {
        const t = (s - 0.09) / 0.06;
        wIonity = 1.0 - t;
        wScatter = t;
        scale = 0.95;
        opacity = 0.75;
        zOffset = 0;
      } else if (s >= 0.15 && s < 0.22) {
        const t = (s - 0.15) / 0.07;
        wScatter = 1.0 - t;
        wScale = t;
        scale = 0.9;
        opacity = 0.7;
        zOffset = 0;
      } else if (s >= 0.22 && s < 0.31) {
        const t = (s - 0.22) / 0.09;
        wScale = 1.0 - t;
        wStep[0] = t;
        scale = 1.0;
        opacity = 0.8;
        zOffset = 0;
      } else {
        wStep[0] = 1.0;
        scale = 1.0;
        opacity = 0.8;
        zOffset = 0;
      }
    }

    if (typeof window !== 'undefined') {
      (window as any).debugWebGL = { isRtl, timelineX, servicesX, tp, s, centerX, wLogo, wIonity, wScale, wScatter, wStep };
    }

    pointsRef.current.position.x = centerX;
    pointsRef.current.position.z = zOffset;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    // Initialize previous positions array on first render
    if (!prevPositions.current) {
      prevPositions.current = new Float32Array(particleData.positions);
    }
    const prevPosArray = prevPositions.current;

    const waveX = Math.sin(time * 0.3) * 0.03;
    const waveY = Math.cos(time * 0.2) * 0.03;

    const localMouseX = mouseX - centerX;

    // Precalculate cube rotation matrix values to avoid redundant calls
    const cAngY = time * 0.18;
    const cAngX = time * 0.12;
    const cosY = Math.cos(cAngY), sinY = Math.sin(cAngY);
    const cosX = Math.cos(cAngX), sinX = Math.sin(cAngX);

    const b3 = Math.floor(particleCount * 0.86);
    const r3 = Math.floor(particleCount * 0.8);

    for (let i = 0; i < particleCount; i++) {
      const pt = particleData.data[i];

      // Read previous coordinates
      const prevX = prevPosArray[i * 3];
      const prevY = prevPosArray[i * 3 + 1];
      const prevZ = prevPosArray[i * 3 + 2];

      // Local 3D rotation for the wireframe cube (Step 3)
      let cubeX = pt.step3X;
      let cubeY = pt.step3Y;
      let cubeZ = pt.step3Z;

      if (wStep[2] > 0.001) {
        // Rotate around Y axis
        const rx = pt.step3X * cosY - pt.step3Z * sinY;
        const rz = pt.step3X * sinY + pt.step3Z * cosY;
        // Rotate around X axis
        cubeX = rx;
        cubeY = pt.step3Y * cosX - rz * sinX;
        cubeZ = pt.step3Y * sinX + rz * cosX;
      }

      // Exhaust flame flickering for Rocket (Step 6)
      let flameX = 0;
      let flameY = 0;
      if (wStep[5] > 0.001 && i >= r3) {
        const flickerFreq = time * 28.0 + i;
        flameX = Math.sin(flickerFreq) * 0.05;
        flameY = -Math.abs(Math.cos(flickerFreq * 0.9)) * 0.16; // flicker downwards
      }

      const baseX = pt.tx * wLogo + pt.ionityX * wIonity + pt.scaleX * wScale + pt.sx * wScatter +
                    pt.step1X * wStep[0] + pt.step2X * wStep[1] + cubeX * wStep[2] +
                    pt.step4X * wStep[3] + pt.step5X * wStep[4] + (pt.step6X + flameX) * wStep[5];

      const baseY = pt.ty * wLogo + pt.ionityY * wIonity + pt.scaleY * wScale + pt.sy * wScatter +
                    pt.step1Y * wStep[0] + pt.step2Y * wStep[1] + cubeY * wStep[2] +
                    pt.step4Y * wStep[3] + pt.step5Y * wStep[4] + (pt.step6Y + flameY) * wStep[5];

      const baseZ = pt.tz * wLogo + pt.ionityZ * wIonity + pt.scaleZ * wScale + pt.sz * wScatter +
                    pt.step1Z * wStep[0] + pt.step2Z * wStep[1] + cubeZ * wStep[2] +
                    pt.step4Z * wStep[3] + pt.step5Z * wStep[4] + pt.step6Z * wStep[5];

      // Holographic breathing / ripple effect (wow factor)
      // Gently distorts the shape like a living holographic transmission
      const rippleX = Math.sin(time * 1.4 + baseY * 2.5) * 0.05 * (1.0 - wScatter);
      const rippleY = Math.cos(time * 1.2 + baseX * 2.5) * 0.05 * (1.0 - wScatter);
      const rippleZ = Math.sin(time * 1.6 + baseX * 2.0) * 0.04 * (1.0 - wScatter);

      const finalBaseX = baseX + rippleX;
      const finalBaseY = baseY + rippleY;
      const finalBaseZ = baseZ + rippleZ;

      const noiseX = Math.sin(time + i) * 0.025;
      const noiseY = Math.cos(time * 1.2 + i) * 0.025;

      const dx = finalBaseX - localMouseX;
      const dy = finalBaseY - mouseY;
      const distSq = dx * dx + dy * dy;

      const influenceRadius = 2.8;
      const influenceRadiusSq = influenceRadius * influenceRadius;

      let forceX = 0;
      let forceY = 0;
      let forceZ = 0;

      if (distSq < influenceRadiusSq) {
        const dist = Math.sqrt(distSq);
        const force = (1.0 - dist / influenceRadius) * 0.85;
        
        // Swirling vortex: tangential vector perpendicular to radial vector (dx, dy) -> (-dy, dx)
        const swirlX = -dy / (dist || 0.001);
        const swirlY = dx / (dist || 0.001);
        
        // Blend radial repulsion (0.2x) with strong tangential swirl (1.8x)
        forceX = (dx / (dist || 0.001)) * force * 0.2 + swirlX * force * 1.8;
        forceY = (dy / (dist || 0.001)) * force * 0.2 + swirlY * force * 1.8;
        
        // Wave depth swirl
        forceZ = Math.sin(time * 6.0 + dist * 3.0) * force * 0.6;
      }

      // Calculate new target coordinates
      const targetX = finalBaseX + waveX + noiseX + forceX;
      const targetY = finalBaseY + waveY + noiseY + forceY;
      const targetZ = finalBaseZ + noiseX + forceZ;

      // Apply fluid damping interpolation (lerp)
      const nextX = prevX + (targetX - prevX) * 0.08;
      const nextY = prevY + (targetY - prevY) * 0.08;
      const nextZ = prevZ + (targetZ - prevZ) * 0.08;

      prevPosArray[i * 3] = nextX;
      prevPosArray[i * 3 + 1] = nextY;
      prevPosArray[i * 3 + 2] = nextZ;

      posAttr.setX(i, nextX);
      posAttr.setY(i, nextY);
      posAttr.setZ(i, nextZ);
    }

    posAttr.needsUpdate = true;

    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = opacity;
    
    // Smooth dynamic blending mode, size, and color based on scroll background mode
    if (s < 0.31) {
      // Light background: render deep pine/emerald green ink cloud with NormalBlending
      mat.size = 0.022 * scale;
      mat.color.set('#004d40');
      mat.blending = THREE.NormalBlending;
      mat.opacity = opacity * 1.15; // slightly higher opacity for contrast on white bg
    } else {
      // Dark background: render glowing cyan/mint additive particles
      mat.size = 0.016 * scale;
      mat.color.set('#ffffff');
      mat.blending = THREE.AdditiveBlending;
    }
    
    // Smooth tilt rotation
    pointsRef.current.rotation.y = state.pointer.x * 0.25;
    pointsRef.current.rotation.x = state.pointer.y * 0.20;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleData.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={circleTexture || undefined}
        alphaTest={0.001}
      />
    </points>
  );
};
