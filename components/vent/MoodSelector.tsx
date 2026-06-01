'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOODS } from '@/types';
import { useVentStore } from '@/store/useVentStore';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS, translateMood } from '@/lib/translations';

export function MoodSelector() {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];
  const { mood, setMood, moodEmoji } = useVentStore();
  const [isCustom, setIsCustom] = useState(false);
  const [customVal, setCustomVal] = useState('');
  const [customEmoji, setCustomEmoji] = useState('💭');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state if store resets or standard mood is selected
  useEffect(() => {
    if (!mood) {
      setIsCustom(false);
      setCustomVal('');
      setCustomEmoji('💭');
    } else {
      const isStandard = MOODS.some((m) => m.label === mood);
      if (!isStandard) {
        setIsCustom(true);
        setCustomVal(mood);
        setCustomEmoji(moodEmoji || '💭');
      } else {
        setIsCustom(false);
      }
    }
  }, [mood, moodEmoji]);

  const handleCustomSubmit = () => {
    if (customVal.trim()) {
      setMood(customVal.trim().toLowerCase(), customEmoji, '#ffaac8');
    }
  };

  const customEmojis = ['💭', '🥀', '🖤', '🧠', '🌪️', '🧸', '🔋', '🩹', '🍦', '🐈‍⬛'];

  return (
    <div className="w-full">
      <p className="text-sm font-body text-text-mid mb-3 px-1">{t.feeling}</p>
      
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
        {MOODS.map((m) => {
          const isActive = mood === m.label && !isCustom;
          return (
            <motion.button
              key={m.label}
              onClick={() => {
                setIsCustom(false);
                setMood(m.label, m.emoji, m.color);
              }}
              className={`chip ${isActive ? 'chip-active' : 'chip-inactive'}`}
              whileTap={{ scale: 0.93 }}
              animate={{ scale: isActive ? 1.04 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <span className="text-base">{m.emoji}</span>
              <span className="text-[13px]">{translateMood(m.label, language)}</span>
            </motion.button>
          );
        })}

        {/* Custom mood chip */}
        <motion.button
          onClick={() => {
            setIsCustom(true);
            setMood(customVal || 'custom', customEmoji, '#ffaac8');
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className={`chip ${isCustom ? 'chip-active' : 'chip-inactive'}`}
          whileTap={{ scale: 0.93 }}
        >
          <span className="text-base">{customEmoji}</span>
          <span className="text-[13px]">{customVal ? customVal : t.customMoodBtn}</span>
        </motion.button>
      </div>

      {/* Inline custom mood input */}
      <AnimatePresence>
        {isCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-3 px-1 overflow-hidden"
          >
            <div className="flex items-center gap-2 bg-white/40 border border-pink-200/50 rounded-2xl p-2 shadow-sm">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-10 h-10 rounded-xl bg-pink-100/50 hover:bg-pink-100 flex items-center justify-center text-lg transition-colors"
                title="Choose emoji"
              >
                {customEmoji}
              </button>
              
              <input
                ref={inputRef}
                type="text"
                value={customVal === 'custom' ? '' : customVal}
                onChange={(e) => {
                  setCustomVal(e.target.value);
                  setMood(e.target.value.toLowerCase() || 'custom', customEmoji, '#ffaac8');
                }}
                onBlur={handleCustomSubmit}
                placeholder={t.customMoodPlaceholder}
                className="flex-1 bg-transparent border-none text-[14px] text-text-dark font-body placeholder:text-text-soft/60 focus:outline-none"
              />
            </div>

            {/* Quick emoji selection */}
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 mt-2 p-2 bg-white/60 border border-pink-200/30 rounded-xl overflow-x-auto no-scrollbar"
              >
                {customEmojis.map((em) => (
                  <button
                    key={em}
                    onClick={() => {
                      setCustomEmoji(em);
                      setMood(customVal || 'custom', em, '#ffaac8');
                      setShowEmojiPicker(false);
                    }}
                    className="text-lg p-1 hover:scale-125 transition-transform"
                  >
                    {em}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
