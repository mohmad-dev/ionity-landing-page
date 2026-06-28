'use client';

import { useEffect, useRef } from 'react';

/**
 * Generates a clean, premium "click/pop" sound as a WAV data blob.
 * Returns a Blob URL that can be assigned directly to an HTML5 Audio object.
 * This guarantees zero network roundtrips and zero latency.
 */
function generatePremiumClickBlobUrl(): string {
  const sampleRate = 22050;
  const duration = 0.04; // 40ms for high-frequency click feel
  const numSamples = sampleRate * duration;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  /* RIFF identifier */
  view.setUint32(0, 0x52494646, false); // "RIFF"
  /* file length */
  view.setUint32(4, 36 + numSamples * 2, true);
  /* RIFF type */
  view.setUint32(8, 0x57415645, false); // "WAVE"

  /* format chunk identifier */
  view.setUint32(12, 0x666d7420, false); // "fmt "
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true); // PCM
  /* channel count */
  view.setUint16(22, 1, true); // Mono
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate */
  view.setUint32(28, sampleRate * 2, true);
  /* block align */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);

  /* data chunk identifier */
  view.setUint32(36, 0x64617461, false); // "data"
  /* chunk length */
  view.setUint32(40, numSamples * 2, true);

  // Write a crisp sine wave that decays exponentially
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Frequency sweeps from 1200Hz down to 250Hz rapidly
    const freq = 1200 * Math.exp(-t * 85);
    // Fast exponential decay of volume
    const amp = Math.exp(-t * 90);
    const sample = Math.sin(2 * Math.PI * freq * t) * amp * 32767;
    view.setInt16(44 + i * 2, sample, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

/**
 * useUiSound hook: Returns a play function that triggers a subtle, premium click sound.
 * HTML5 Audio is preloaded and has zero latency.
 */
export function useUiSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const blobUrl = generatePremiumClickBlobUrl();
      const audio = new Audio(blobUrl);
      audio.preload = 'auto';
      audio.volume = 0.05; // Softer, premium volume
      audioRef.current = audio;

      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    } catch (e) {
      console.debug('Failed to initialize preloaded UI sound:', e);
    }
  }, []);

  const playSound = () => {
    if (!audioRef.current) return;
    
    try {
      // Reset playback time to allow rapid consecutive clicks without waiting
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Safe catch for browser gesture requirements
      });
    } catch (error) {
      console.debug('UI sound play skipped:', error);
    }
  };

  return playSound;
}
