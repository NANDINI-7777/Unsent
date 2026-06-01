'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useVentStore } from '@/store/useVentStore';
import { useAppStore } from '@/store/useAppStore';
import { useIdentityStore } from '@/store/useIdentityStore';
import { useAuthStore } from '@/store/useAuthStore';
import { detectCrisis } from '@/lib/crisis';
import { filterProfanity } from '@/lib/profanity';
import { TRANSLATIONS } from '@/lib/translations';

export function SendVentButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { content, mood, replyStyle, options, gender, reset } = useVentStore();
  const { navigateTo, setActiveVent, setShowCrisisModal, setPendingVentContent, language } = useAppStore();
  const { deviceId } = useIdentityStore();
  const t = TRANSLATIONS[language];

  const isValid = content.trim().length > 0 && mood !== '';

  const handleSend = async () => {
    if (!isValid || isLoading) return;
    setError('');

    // Crisis detection
    const crisisResult = detectCrisis(content);
    if (crisisResult.isCrisis) {
      setPendingVentContent(content);
      setShowCrisisModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const filteredContent = filterProfanity(content);
      const userState = useAuthStore.getState().user;
      const response = await fetch('/api/vents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: filteredContent,
          mood,
          replyStyle,
          showOnFeed: options.showOnFeed,
          autoDelete: options.autoDelete,
          deviceId,
          gender,
          userId: userState ? userState.id : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t.errorGeneric);
      }

      const vent = await response.json();
      setActiveVent(vent);
      
      // Persistent Local History Fallback
      if (typeof window !== 'undefined') {
        const historyJson = localStorage.getItem('unsent_local_history') || '[]';
        const history = JSON.parse(historyJson);
        const userState = useAuthStore.getState().user;
        const newLocalVent = {
          ...vent,
          userId: userState ? userState.id : undefined
        };
        localStorage.setItem('unsent_local_history', JSON.stringify([newLocalVent, ...history]));
        
        // Refresh local memory history
        useAuthStore.getState().fetchUserHistory();
      }

      reset();
      
      // Trigger AI reply generation in the background!
      useAppStore.getState().triggerBackgroundReply(vent);

      navigateTo('waiting');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-1">
      <motion.button
        onClick={handleSend}
        disabled={!isValid || isLoading}
        className={`w-full py-4 rounded-2xl font-body font-semibold text-base tracking-wide transition-all duration-300 ${
          isValid && !isLoading
            ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-pink-lg hover:shadow-pink cursor-pointer'
            : 'bg-pink-100 text-text-soft cursor-not-allowed'
        }`}
        whileTap={isValid ? { scale: 0.97 } : {}}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.sending}
            </motion.span>
          ) : (
            <motion.span
              key="send"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {t.sendButton}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-pink-600 mt-2 font-body"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
