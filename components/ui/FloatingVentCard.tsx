'use client';

import { motion } from 'framer-motion';

interface FloatingVentCardProps {
  text: string;
  moodEmoji: string;
  moodColor: string;
  rotation?: number;
  delay?: number;
}

export function FloatingVentCard({
  text,
  moodEmoji,
  moodColor,
  rotation = 0,
  delay = 0,
}: FloatingVentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      style={{ rotate: rotation }}
      className="glass rounded-2xl p-4 border border-pink-200/50 shadow-pink w-full max-w-[320px]"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-3 h-3 rounded-full mt-1.5 shrink-0"
          style={{ backgroundColor: moodColor }}
        />
        <p className="font-accent italic text-[15px] text-text-dark leading-relaxed">
          {text}
        </p>
      </div>
      <div className="mt-2 text-right">
        <span className="text-xs text-text-soft font-body">— anonymous 🌸</span>
      </div>
    </motion.div>
  );
}
