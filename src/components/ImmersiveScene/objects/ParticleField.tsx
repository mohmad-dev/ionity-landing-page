'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  scrollProgress: React.MutableRefObject<number>;
  count?: number;
}

// Curl noise helpers for smooth divergence-free ambient drift
function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
function grad(hash: number, x: number, y: number, z: number) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : (h === 12 || h === 14) ? x : z;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}
const P = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5);
const perm = [...P, ...P];
function perlin(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const a = perm[X] + Y, b = perm[X + 1] + Y;
  return lerp(
    lerp(lerp(grad(perm[a + Z], x, y, z), grad(perm[b + Z], x - 1, y, z), u),
         lerp(grad(perm[a + 1 + Z], x, y - 1, z), grad(perm[b + 1 + Z], x - 1, y - 1, z), u), v),
    lerp(lerp(grad(perm[a + Z + 1], x, y, z - 1), grad(perm[b + Z + 1], x - 1, y, z - 1), u),
         lerp(grad(perm[a + 1 + Z + 1], x, y - 1, z - 1), grad(perm[b + 1 + Z + 1], x - 1, y - 1, z - 1), u), v),
    w
  );
}

// Curl noise — divergence-free 3D vector field for fluid-like drift
function curlNoise(x: number, y: number, z: number, eps = 0.0001) {
  const dx = (perlin(x, y + eps, z) - perlin(x, y - eps, z)) / (2 * eps);
  const dy = (perlin(x + eps, y, z) - perlin(x - eps, y, z)) / (2 * eps);
  return { cx: dx, cy: -dy };
}

export const ParticleField = ({ scrollProgress, count = 400 }: ParticleFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Particle state: position, velocity, orbit phase
  const state = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);   // velocity
    const phase = new Float32Array(count);      // per-particle orbit phase offset
    const mass = new Float32Array(count);       // per-particle "orbit radius" affinity

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      vel[i * 3]     = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;
      phase[i] = Math.random() * Math.PI * 2;
      mass[i]  = 0.5 + Math.random() * 0.8; // 0.5 → 1.3
    }
    return { pos, vel, phase, mass };
  }, [count]);

  // Glowing mint texture
  const mintTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0,   'rgba(0,255,178,1)');
    g.addColorStop(0.25,'rgba(0,255,178,0.7)');
    g.addColorStop(0.6, 'rgba(0,255,178,0.15)');
    g.addColorStop(1,   'rgba(0,255,178,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((threeState, delta) => {
    if (!pointsRef.current) return;
    const dt = Math.min(delta, 0.05); // cap to prevent explosion
    const t  = threeState.clock.elapsedTime;
    const s  = scrollProgress.current;

    // World-space mouse position
    const mx = (threeState.pointer.x * threeState.viewport.width)  / 2;
    const my = (threeState.pointer.y * threeState.viewport.height) / 2;

    const { pos, vel, phase, mass } = state;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    // Gravity & orbit constants
    const ATTRACT_STRENGTH  = 6.5;
    const ORBIT_TANGENT     = 3.8;   // tangential kick for spiral orbit
    const DAMPING           = 0.92;  // velocity damping per frame
    const MAX_SPEED         = 3.5;
    const CAPTURE_RADIUS    = 0.8;   // below this → particle orbits stably
    const INFLUENCE_RADIUS  = 6.0;
    const CURL_SCALE        = 0.15;  // ambient curl drift strength

    for (let i = 0; i < count; i++) {
      const xi = i * 3, yi = xi + 1, zi = xi + 2;

      let px = pos[xi], py = pos[yi], pz = pos[zi];
      let vx = vel[xi], vy = vel[yi], vz = vel[zi];

      // ─── 1. GRAVITATIONAL ATTRACTION + ORBITAL TANGENT ────────────
      const dx = mx - px;
      const dy = my - py;
      const distSq = dx * dx + dy * dy + 0.01;
      const dist   = Math.sqrt(distSq);

      if (dist < INFLUENCE_RADIUS) {
        const norm     = 1 / dist;
        const radialX  = dx * norm;
        const radialY  = dy * norm;

        // Gravitational pull — falls off with distance (1/dist²)
        const gravFactor = ATTRACT_STRENGTH / distSq * mass[i];
        const gravX = radialX * gravFactor;
        const gravY = radialY * gravFactor;

        // Orbital tangent (perpendicular) — creates the spiral/orbit
        // Direction: perpendicular to radial = (-radialY, radialX)
        const orbitDir   = dist < CAPTURE_RADIUS ? 1 : 1;  // always orbit same dir
        const tangentX   = -radialY * orbitDir;
        const tangentY   =  radialX * orbitDir;
        const tangFactor = ORBIT_TANGENT / (dist + 0.5) * mass[i];
        const tangX      = tangentX * tangFactor;
        const tangY      = tangentY * tangFactor;

        vx += (gravX + tangX) * dt;
        vy += (gravY + tangY) * dt;
      }

      // ─── 2. AMBIENT CURL NOISE DRIFT ──────────────────────────────
      const curlT = t * 0.07 + phase[i] * 0.5;
      const { cx, cy } = curlNoise(px * 0.08 + curlT, py * 0.08, pz * 0.05 + curlT);
      vx += cx * CURL_SCALE * dt;
      vy += cy * CURL_SCALE * dt;

      // ─── 3. DAMPING + SPEED LIMIT ─────────────────────────────────
      vx *= DAMPING;
      vy *= DAMPING;
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > MAX_SPEED) {
        const inv = MAX_SPEED / speed;
        vx *= inv; vy *= inv;
      }

      // ─── 4. INTEGRATE POSITION ────────────────────────────────────
      px += vx * dt;
      py += vy * dt;

      // ─── 5. BOUNDARY WRAP — Infinite field ────────────────────────
      if (px > 10)  { px = -10; vx *= 0; }
      if (px < -10) { px =  10; vx *= 0; }
      if (py > 7)   { py = -7;  vy *= 0; }
      if (py < -7)  { py =  7;  vy *= 0; }

      pos[xi] = px; pos[yi] = py; pos[zi] = pz;
      vel[xi] = vx; vel[yi] = vy; vel[zi] = vz;

      posAttr.setXYZ(i, px, py, pz);
    }
    posAttr.needsUpdate = true;

    // Fade particles on scroll into deep sections
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.lerp(0.75, 0.08, s * 1.4);
    // Particle size breathes subtly
    mat.size = 0.028 + Math.sin(t * 0.6) * 0.004;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[state.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00FFB2"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={mintTexture || undefined}
        alphaTest={0.001}
      />
    </points>
  );
};
