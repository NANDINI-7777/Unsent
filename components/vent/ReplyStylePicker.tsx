'use client';

import { motion } from 'framer-motion';
import { REPLY_STYLES } from '@/types';
import { useVentStore } from '@/store/useVentStore';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS, translateReplyStyle } from '@/lib/translations';
import type { ReplyStyle } from '@/types';

export function ReplyStylePicker() {
  const { replyStyle, setReplyStyle } = useVentStore();
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  return (
    <div className="w-full">
      <p className="text-sm font-body text-text-mid mb-3 px-1">{t.replyQuestion}</p>
      <div className="flex gap-2 px-1">
        {REPLY_STYLES.map((style) => {
          const isActive = replyStyle === style.value;
          const styleInfo = translateReplyStyle(style.value, language);
          
          return (
            <motion.button
              key={style.value}
              onClick={() => setReplyStyle(style.value as ReplyStyle)}
              className={`flex-1 py-3 px-3 rounded-2xl font-body text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-pink border border-transparent'
                  : 'bg-transparent border-[1.5px] border-pink-200/60 text-text-mid hover:border-pink-300'
              }`}
              whileTap={{ scale: 0.95 }}
              title={styleInfo.desc}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{style.emoji}</span>
                <span className="font-medium text-xs tracking-wide">{styleInfo.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
