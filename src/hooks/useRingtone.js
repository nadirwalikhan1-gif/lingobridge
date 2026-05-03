import { useEffect, useRef } from 'react';

export default function useRingtone(playing) {
  const intervalRef = useRef(null);
  const ctxRef = useRef(null);

  const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  } catch (e) {
    console.log('Audio error:', e);
  }
};

  useEffect(() => {
    if (playing) {
      playBeep();
      intervalRef.current = setInterval(playBeep, 2000);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [playing]);
}