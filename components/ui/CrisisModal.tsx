'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/lib/translations';

export function CrisisModal() {
  const { showCrisisModal, setShowCrisisModal, pendingVentContent, language } = useAppStore();
  const t = TRANSLATIONS[language];

  const handleOkay = () => {
    setShowCrisisModal(false);
    // Allow the vent to proceed - user confirmed they're okay
  };

  const handleGetHelp = () => {
    window.open('https://icallhelpline.org/', '_blank');
    setShowCrisisModal(false);
  };

  return (
    <AnimatePresence>
      {showCrisisModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-pink-50/80 backdrop-blur-md"
            onClick={() => setShowCrisisModal(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative glass-strong rounded-3xl p-8 max-w-sm w-full shadow-pink-lg"
          >
            <button
              onClick={() => setShowCrisisModal(false)}
              className="absolute top-4 right-4 text-text-soft hover:text-text-mid transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center">
                <Heart className="text-pink-500" size={28} fill="currentColor" />
              </div>

              <h3 className="font-heading text-xl text-text-dark">
                {t.crisisHeader}
              </h3>
              
              <p className="font-body text-sm text-text-mid leading-relaxed">
                {t.crisisDesc}
              </p>

              <div className="flex flex-col gap-3 w-full mt-2">
                <motion.button
                  onClick={handleGetHelp}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-body font-semibold text-sm shadow-pink"
                  whileTap={{ scale: 0.97 }}
                >
                  {t.crisisBtnHelp}
                </motion.button>
                
                <motion.button
                  onClick={handleOkay}
                  className="w-full py-3.5 rounded-2xl border-[1.5px] border-pink-200 text-text-mid font-body text-sm hover:bg-pink-50 transition-colors"
                  whileTap={{ scale: 0.97 }}
                >
                  {t.crisisBtnBypass}
                </motion.button>
              </div>

              <p className="text-[11px] text-text-soft font-body mt-1">
                {t.crisisFooter}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
