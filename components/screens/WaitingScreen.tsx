'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { MysteryReplierCard } from '@/components/ui/MysteryReplierCard';
import { TRANSLATIONS } from '@/lib/translations';

export function WaitingScreen() {
  const { activeVent, setCurrentReply, navigateTo, language } = useAppStore();
  const t = TRANSLATIONS[language];
  const [strangerNum] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!activeVent || hasTriggeredRef.current) return;

    // After a random delay (8-15 seconds for demo, 60s in production), trigger AI reply
    const delay = 8000 + Math.random() * 7000;
    timerRef.current = setTimeout(async () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      try {
        const response = await fetch('/api/reply/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ventId: activeVent.id,
            ventContent: activeVent.content,
            mood: activeVent.mood,
            replyStyle: activeVent.replyStyle,
          }),
        });

        if (response.ok) {
          const reply = await response.json();
          setCurrentReply(reply);
          navigateTo('reply');
        }
      } catch (error) {
        console.error('Failed to get reply:', error);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeVent, setCurrentReply, navigateTo]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      {/* Pulsing orb */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative mb-10"
      >
        <div className="relative w-28 h-28">
          {/* Outer rings */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-pink-300/30"
              style={{
                animation: `ring-expand 2s ease-out ${i * 0.6}s infinite`,
              }}
            />
          ))}
          {/* Core orb */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 shadow-pink-lg"
            style={{ animation: 'pulse-orb 2s ease-in-out infinite' }}
          />
          {/* Inner glow */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="font-heading italic text-2xl text-text-dark mb-3">
          {t.waitHeader}
        </h2>
        <p className="font-body text-sm text-text-mid leading-relaxed max-w-[280px] mx-auto">
          {t.waitSub}
        </p>
      </motion.div>

      {/* Mystery replier card */}
      <MysteryReplierCard alias={`stranger #${strangerNum}`} />
    </div>
  );
}
