'use client';

import { useRef, useEffect } from 'react';
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

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }, [content]);

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
        className="w-full min-h-[160px] resize-none bg-transparent font-accent italic text-[19px] leading-relaxed text-text-dark placeholder:text-text-soft/60 placeholder:not-italic p-4 pb-12 focus:outline-none"
        spellCheck={false}
      />
      <div className={`absolute bottom-3 right-4 text-xs font-body ${getCounterColor()} transition-colors duration-300 font-medium`}>
        {content.length}/{maxChars}
      </div>
    </div>
  );
}
