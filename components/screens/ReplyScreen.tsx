'use client';

import { motion } from 'framer-motion';
import { RefreshCcw, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { MessageThread } from '@/components/reply/MessageThread';
import { ReactionBar } from '@/components/reply/ReactionBar';
import { TRANSLATIONS } from '@/lib/translations';

export function ReplyScreen() {
  const { activeVent, currentReply, navigateTo, language } = useAppStore();
  const t = TRANSLATIONS[language];

  if (!activeVent || !currentReply) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-body text-text-soft">{t.noReplyYet}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-6 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 mb-6"
      >
        <h2 className="font-heading text-xl text-text-dark">{t.replyHeader}</h2>
        <p className="font-body text-xs text-text-soft mt-1">
          {t.replySub}
        </p>
      </motion.div>

      {/* Message thread */}
      <div className="flex-1">
        <MessageThread vent={activeVent} reply={currentReply} />
        <ReactionBar replyId={currentReply.id} />
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-3 px-5 pt-6 pb-4"
      >
        <motion.button
          onClick={() => navigateTo('vent')}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-body font-semibold text-sm shadow-pink flex items-center justify-center gap-2"
          whileTap={{ scale: 0.97 }}
        >
          <RefreshCcw size={16} />
          {t.ventAgain}
        </motion.button>
        <motion.button
          onClick={() => navigateTo('feed')}
          className="flex-1 py-3.5 rounded-2xl border-[1.5px] border-pink-200 text-text-mid font-body text-sm flex items-center justify-center gap-2 hover:bg-pink-50/50 transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          <MessageCircle size={16} />
          {t.seeFeed}
        </motion.button>
      </motion.div>
    </div>
  );
}
