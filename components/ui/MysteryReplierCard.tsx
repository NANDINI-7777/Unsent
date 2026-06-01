'use client';

import { motion } from 'framer-motion';

interface MysteryReplierCardProps {
  alias?: string;
  isTyping?: boolean;
}

export function MysteryReplierCard({ alias = 'stranger #????', isTyping = true }: MysteryReplierCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="glass rounded-2xl p-5 border border-pink-200/40 shadow-pink max-w-[300px] mx-auto"
    >
      <div className="flex items-center gap-4">
        {/* Mystery avatar */}
        <div className="relative w-12 h-12 rounded-full shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 blur-sm opacity-60" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center">
            <span className="text-white text-xl font-heading">?</span>
          </div>
        </div>
        
        <div className="flex-1">
          <p className="font-body text-sm font-medium text-text-dark">{alias}</p>
          {isTyping && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-text-soft font-body">replying now</span>
              <div className="flex gap-[3px] ml-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-[5px] h-[5px] rounded-full bg-pink-400"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
