'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/lib/translations';
import { MoodSelector } from '@/components/vent/MoodSelector';
import { VentOptionsBar } from '@/components/vent/VentOptionsBar';
import { GenderSelector } from '@/components/vent/GenderSelector';
import { VentComposer } from '@/components/vent/VentComposer';
import { ReplyStylePicker } from '@/components/vent/ReplyStylePicker';
import { SendVentButton } from '@/components/vent/SendVentButton';

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as const } },
};

export function VentScreen() {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  return (
    <div className="flex flex-col px-5 py-6 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="font-heading text-2xl text-text-dark">{t.ventHeader}</h2>
        <p className="font-body text-sm text-text-soft mt-1">{t.ventSub}</p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6 flex-1"
      >
        <motion.div variants={item}><MoodSelector /></motion.div>
        <motion.div variants={item}><VentComposer /></motion.div>
        <motion.div variants={item}><VentOptionsBar /></motion.div>
        <motion.div variants={item}><GenderSelector /></motion.div>
        <motion.div variants={item}><ReplyStylePicker /></motion.div>
        <motion.div variants={item} className="mt-auto pb-4"><SendVentButton /></motion.div>
      </motion.div>
    </div>
  );
}
