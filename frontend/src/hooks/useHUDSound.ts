import { useRef, useCallback } from 'react';

export const useHUDSound = () => {
  const audioCtx = useRef<AudioContext | null>(null);
  const lastPlay = useRef<{ frequency: number; at: number } | null>(null);

  // HUD audio is ON unless the visitor explicitly turns it off (e.g. on mobile).
  const isEnabled = () => {
    return localStorage.getItem('portfolio_sound_enabled') !== 'false';
  };

  const playSound = useCallback((frequency: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 0.05) => {
    if (!isEnabled()) return;

    // Avoid double audio when a component handler and the global click listener fire together.
    const now = Date.now();
    if (lastPlay.current && lastPlay.current.frequency === frequency && now - lastPlay.current.at < 80) return;
    lastPlay.current = { frequency, at: now };

    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }

      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.current.currentTime);
      
      // Pitch slide for "tech" feel
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, audioCtx.current.currentTime + duration);

      gain.gain.setValueAtTime(volume, audioCtx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.current.destination);

      osc.start();
      osc.stop(audioCtx.current.currentTime + duration);
    } catch (e) {
      // Audio might be blocked by browser policy until first interaction
    }
  }, []);

  const playHover = useCallback(() => playSound(880, 'sine', 0.05, 0.02), [playSound]);
  const playClick = useCallback(() => playSound(440, 'square', 0.1, 0.03), [playSound]);
  const playError = useCallback(() => playSound(220, 'sawtooth', 0.3, 0.05), [playSound]);

  return { playHover, playClick, playError };
};
