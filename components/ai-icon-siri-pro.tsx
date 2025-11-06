// ai-icon-siri-pro.tsx
"use client";
import { useEffect, useRef } from "react";

/**
 * Siri Professional Animation
 * Based on Apple's original Siri waveform (iOS 7-10)
 * Uses multiple sine waves with different attenuation and opacity
 */

interface SiriCurve {
  attenuation: number;
  lineWidth: number;
  opacity: number;
}

function AISiriPro({ 
  level = 0, 
  isSpeaking = false 
}: { 
  level?: number; 
  isSpeaking?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  
  // Siri's exact curve configuration (from SiriWave.js)
  const curves: SiriCurve[] = [
    { attenuation: -2, lineWidth: 1, opacity: 0.1 },
    { attenuation: -6, lineWidth: 1, opacity: 0.2 },
    { attenuation: 4,  lineWidth: 1, opacity: 0.4 },
    { attenuation: 2,  lineWidth: 1, opacity: 0.6 },
    { attenuation: 1,  lineWidth: 1.5, opacity: 1 }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Animation parameters
    const frequency = 2;
    const speed = 0.02;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const amplifiedLevel = level * 3;
      const globalAmplitude = isSpeaking ? Math.max(amplifiedLevel, 0.15) : 0.05;

      curves.forEach((curve) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(20, 184, 166, ${curve.opacity})`;
        ctx.lineWidth = curve.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw the sine wave
        for (let x = 0; x < width; x += 1) {
          // Normalize x to [-1, 1] range
          const normalizedX = (x / width) * 2 - 1;
          
          // Calculate wave position with phase
          const wavePosition = frequency * normalizedX - phaseRef.current;
          
          // Calculate sine value
          const sineValue = Math.sin(wavePosition);
          
          // Apply attenuation function (makes wave flatten at edges)
          const attenuation = Math.pow(
            Math.max(0, 1 - Math.pow(normalizedX, 2)),
            2
          );
          
          // Calculate final y position
          // زيادة المضاعف من 6 إلى 4 لجعل الموجات أكبر
          const amplitude = (height / 4) * globalAmplitude * attenuation;
          const y = centerY + sineValue * amplitude * (1 / Math.abs(curve.attenuation));

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      // Update phase for animation
      phaseRef.current = (phaseRef.current + (Math.PI / 2) * speed) % (2 * Math.PI);

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [level, isSpeaking]);

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Canvas for waves */}
      <canvas 
        ref={canvasRef}
        width={64}
        height={64}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Background glow */}
      <div 
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{
          background: `radial-gradient(circle, 
            rgba(20, 184, 166, ${isSpeaking ? 0.3 : 0.1}), 
            transparent 70%)`,
          filter: `blur(${isSpeaking ? 12 : 6}px)`,
        }}
      />

      {/* Outer ring when speaking */}
      {isSpeaking && (
        <div 
          className="absolute inset-[-4px] rounded-full border border-teal-400/20 animate-pulse"
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      )}
    </div>
  );
}

export default AISiriPro;