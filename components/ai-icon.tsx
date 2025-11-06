// ai-icon.tsx
"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

function AIIconMotion({ level = 0, isSpeaking = false }: { level?: number, isSpeaking?: boolean }) {
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { 
    stiffness: 600,
    damping: 25,
    mass: 0.5
  });

  useEffect(() => {
    const minScale = 1;
    const maxScale = 1.2;
    const speakBoost = 0;
    const enhancedLevel = Math.pow(level, 0.8);
    const mapped = minScale + (maxScale - minScale) * Math.min(1, enhancedLevel + speakBoost);
    raw.set(mapped);
  }, [level, isSpeaking, raw]);

  return (
    <motion.div
      style={{ scale: spring }}
      className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500"
    />
  );
}

export default AIIconMotion;