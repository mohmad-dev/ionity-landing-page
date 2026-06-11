/**
 * Web Audio API helper to generate a premium, subtle click sound.
 * Zero-bandwidth, high-performance, and perfectly clean UI feedback.
 */
let audioCtx: AudioContext | null = null;

export const playClickSound = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Lazy initialize AudioContext on user interaction
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    
    if (!audioCtx) return;

    // Resume context if suspended (browser security policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    
    // Softer sound than square wave
    osc.type = 'sine';
    
    // Snap frequency transition for mechanical click feel
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

    // Fast exponential decay of volume
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (error) {
    // Silent fail in case audio context is blocked or unsupported
    console.debug('AudioContext click sound skipped:', error);
  }
};
