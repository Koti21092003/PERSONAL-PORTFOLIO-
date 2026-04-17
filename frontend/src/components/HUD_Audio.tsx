import React, { createContext, useContext, useState } from 'react';

interface AudioContextType {
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  playHUD: (type: 'click' | 'success' | 'hover' | 'error') => void;
}

const HUDContext = createContext<AudioContextType | null>(null);

export const HUD_Audio_Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  const playHUD = (type: 'click' | 'success' | 'hover' | 'error') => {
    if (isMuted) return;

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
      } else if (type === 'hover') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        oscillator.start(now);
        oscillator.stop(now + 0.05);
      } else if (type === 'success') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
      } else if (type === 'error') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, now);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
      }
    } catch (e) {
      console.warn("HUD Audio initialization failed - browser restriction or context error.");
    }
  };

  return (
    <HUDContext.Provider value={{ isMuted, setIsMuted, playHUD }}>
      {children}
    </HUDContext.Provider>
  );
};

export const useHUD = () => {
  const context = useContext(HUDContext);
  if (!context) throw new Error("useHUD must be used within HUD_Audio_Provider");
  return context;
};
