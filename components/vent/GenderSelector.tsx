'use client';

import { motion } from 'framer-motion';
import { useVentStore } from '@/store/useVentStore';
import type { GenderType } from '@/types';

const genderOptions: { value: GenderType; emoji: string; label: string }[] = [
  { value: 'anon', emoji: '🎭', label: 'anon' },
  { value: 'boy', emoji: '👦🏻', label: 'he/him' },
  { value: 'girl', emoji: '👧🏻', label: 'she/her' },
];

export function GenderSelector() {
  const { gender, setGender } = useVentStore();

  return (
    <div className="w-full">
      <p className="text-sm font-body text-text-mid mb-3 px-1">specify your gender? (for specific pronoun replies)</p>
      <div className="flex gap-2 px-1">
        {genderOptions.map((opt) => {
          const isActive = gender === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => setGender(opt.value)}
              className={`chip text-[13px] ${
                isActive
                  ? 'bg-pink-100/80 border-[1.5px] border-pink-300 text-text-dark font-semibold shadow-sm'
                  : 'bg-transparent border-[1.5px] border-dashed border-pink-200 text-text-mid hover:border-pink-300'
              }`}
              whileTap={{ scale: 0.93 }}
            >
              <span>{opt.emoji}</span>
              <span>{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
