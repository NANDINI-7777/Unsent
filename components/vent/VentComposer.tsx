'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useVentStore } from '@/store/useVentStore';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/lib/translations';

export function VentComposer() {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];
  const { content, setContent } = useVentStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 500;
  const remaining = maxChars - content.length;
  
  const [isRephrasing, setIsRephrasing] = useState(false);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }, [content]);

  const handleRephrase = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRephrasing || content.trim().length < 15) return;
    
    setIsRephrasing(true);
    try {
      const response = await fetch('/api/vent/rephrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.rephrased) {
          setContent(data.rephrased.slice(0, maxChars));
        }
      } else {
        console.error('Rephrase API response was not OK');
      }
    } catch (err) {
      console.error('Failed to call rephrase API:', err);
    } finally {
      setIsRephrasing(false);
    }
  };

  const getCounterColor = () => {
    if (remaining <= 10) return 'text-red-400';
    if (remaining <= 50) return 'text-rose-mist';
    return 'text-text-soft';
  };

  return (
    <div className="w-full focus-wash rounded-3xl transition-all duration-300 relative bg-white/20 border border-pink-200/20 backdrop-blur-sm shadow-pink-sm">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          if (e.target.value.length <= maxChars) {
            setContent(e.target.value);
          }
        }}
        placeholder={t.composerPlaceholder}
        className="w-full min-h-[160px] resize-none bg-transparent font-accent italic text-[19px] leading-relaxed text-text-dark placeholder:text-text-soft/60 placeholder:not-italic p-4 pb-14 focus:outline-none"
        spellCheck={false}
        disabled={isRephrasing}
      />
      
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          <AnimatePresence>
            {content.trim().length >= 15 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                onClick={handleRephrase}
                disabled={isRephrasing}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white/95 border border-pink-300/30 text-[11px] font-body font-bold text-pink-500 shadow-pink select-none transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.95 }}
              >
                {isRephrasing ? (
                  <>
                    <Loader2 size={12} className="animate-spin text-pink-500" />
                    <span>Refining...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} className="text-pink-500" />
                    <span>Refine with AI ✨</span>
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <div className={`text-xs font-body ${getCounterColor()} pointer-events-auto select-none font-medium`}>
          {content.length}/{maxChars}
        </div>
      </div>
    </div>
  );
}

