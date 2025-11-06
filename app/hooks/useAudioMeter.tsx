"use client";
import { useEffect, useRef, useState } from "react";

export default function useAudioMeter(stream: MediaStream | null) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);
  const [level, setLevel] = useState(0);

  const smoothedRef = useRef(0);
  const lastUpdateRef = useRef(0);
  const updateCounterRef = useRef(0);
  const smoothingFactor = 0.25;

  useEffect(() => {
    if (!stream) {
      setLevel(0);
      smoothedRef.current = 0;
      lastUpdateRef.current = 0;
      return;
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioCtx = audioCtxRef.current;

    if (!analyserRef.current) {
      analyserRef.current = audioCtx.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.6;
    }
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const buffer = new ArrayBuffer(bufferLength);
    dataArrayRef.current = new Uint8Array(buffer);

    let source: MediaStreamAudioSourceNode | null = null;
    try {
      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
    } catch (e) {
      console.error("Failed to create audio stream source:", e);
    }

    const tick = () => {
      if (!analyser || !dataArrayRef.current) return;
      
      const data = dataArrayRef.current;
      // @ts-ignore - TypeScript type mismatch but works correctly at runtime
      analyser.getByteTimeDomainData(data);

      // Calculate RMS (Root Mean Square)
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const normalized = (data[i] - 128) / 128; 
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / data.length);
      const mapped = Math.pow(rms, 0.6);

      const targetSmoothing = mapped > smoothedRef.current ? smoothingFactor * 1.2 : smoothingFactor * 0.9;
      smoothedRef.current = smoothedRef.current * (1 - targetSmoothing) + mapped * targetSmoothing;

      const finalLevel = Math.min(1, Math.max(0, smoothedRef.current));
      const threshold = 0.008;
      const cleanLevel = finalLevel > threshold ? finalLevel : 0;
      
      // Update every 3 frames to reduce re-renders
      updateCounterRef.current++;
      if (updateCounterRef.current >= 3) {
        updateCounterRef.current = 0;
        
        const diff = Math.abs(cleanLevel - lastUpdateRef.current);
        if (diff > 0.02) {
          lastUpdateRef.current = cleanLevel;
          setLevel(cleanLevel);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      try {
        if (source) source.disconnect();
        if (analyser) analyser.disconnect();
      } catch (e) {
        console.error("Error disconnecting audio meter:", e);
      }
    };
  }, [stream]);

  return { level };
}