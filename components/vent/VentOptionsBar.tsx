'use client';

import { motion } from 'framer-motion';
import { useVentStore } from '@/store/useVentStore';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/lib/translations';
import type { VentOptions } from '@/types';

const options: { key: keyof VentOptions; emoji: string }[] = [
  { key: 'stayAnon', emoji: '🎭' },
  { key: 'showOnFeed', emoji: '🌍' },
  { key: 'justForMe', emoji: '🔒' },
  { key: 'autoDelete', emoji: '⏳' },
];

export function VentOptionsBar() {
  const { options: ventOptions, setOption } = useVentStore();
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  const getOptLabel = (key: keyof VentOptions) => {
    if (key === 'stayAnon') return t.optionsAnon;
    if (key === 'showOnFeed') return t.optionsFeed;
    if (key === 'justForMe') return t.optionsJustMe;
    if (key === 'autoDelete') return t.optionsAutoDel;
    return '';
  };

  return (
    <div className="w-full">
      <p className="text-sm font-body text-text-mid mb-3 px-1">{t.options}</p>
      <div className="flex gap-2 flex-wrap px-1">
        {options.map((opt) => {
          const isActive = ventOptions[opt.key];
          return (
            <motion.button
              key={opt.key}
              onClick={() => setOption(opt.key, !isActive)}
              className={`chip text-[13px] ${
                isActive
                  ? 'bg-pink-100/80 border-[1.5px] border-pink-300 text-text-dark'
                  : 'bg-transparent border-[1.5px] border-dashed border-pink-200 text-text-mid'
              }`}
              whileTap={{ scale: 0.93 }}
            >
              <span>{opt.emoji}</span>
              <span>{getOptLabel(opt.key)}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
