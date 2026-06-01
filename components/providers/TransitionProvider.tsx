'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

const screenVariants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.97,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

interface TransitionProviderProps {
  children: ReactNode;
  screenKey: string;
}

export function TransitionProvider({ children, screenKey }: TransitionProviderProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        variants={screenVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
