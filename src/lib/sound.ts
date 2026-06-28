/**
 * Preloaded HTML5 Audio utility to play a premium, subtle click sound.
 * Zero-bandwidth, zero-latency, and perfectly clean UI feedback.
 */

let preloadedAudio: HTMLAudioElement | null = null;

// Generate WAV Blob URL dynamically for zero network fetches
function generateWavBlob(): string {
  const sampleRate = 22050;
  const duration = 0.04;
  const numSamples = sampleRate * duration;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + numSamples * 2, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"

  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);

  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 1200 * Math.exp(-t * 85);
    const amp = Math.exp(-t * 90);
    const sample = Math.sin(2 * Math.PI * freq * t) * amp * 32767;
    view.setInt16(44 + i * 2, sample, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// Preload the sound on the client-side as soon as possible
if (typeof window !== 'undefined') {
  try {
    const url = generateWavBlob();
    preloadedAudio = new Audio(url);
    preloadedAudio.preload = 'auto';
    preloadedAudio.volume = 0.05;
  } catch (e) {
    console.debug('Failed to preload legacy sound utility:', e);
  }
}

export const playClickSound = () => {
  if (!preloadedAudio) return;

  try {
    preloadedAudio.currentTime = 0;
    preloadedAudio.play().catch(() => {
      // Catch standard browser interaction block errors
    });
  } catch (error) {
    console.debug('Failed to play click sound:', error);
  }
};
