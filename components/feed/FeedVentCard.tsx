'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Vent } from '@/types';
import { InlineFeedReplyComposer } from './InlineFeedReplyComposer';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS, translateMood } from '@/lib/translations';

interface FeedVentCardProps {
  vent: Vent;
}

export function FeedVentCard({ vent }: FeedVentCardProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyCount, setReplyCount] = useState(vent.replyCount);
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  const timeAgo = formatDistanceToNow(new Date(vent.createdAt), { addSuffix: false });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl border border-pink-200/40 shadow-pink overflow-hidden"
    >
      <div className="flex">
        {/* Mood accent bar */}
        <div
          className="mood-accent-bar shrink-0"
          style={{ backgroundColor: vent.moodColor }}
        />
        
        <div className="flex-1 p-4">
          {/* Top row: mood + timestamp */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-100/60 border border-pink-200/40 text-xs font-body">
              <span>{vent.moodEmoji}</span>
              <span className="text-text-mid">{translateMood(vent.mood, language)}</span>
            </span>
            <span className="text-[11px] font-body text-text-soft">{timeAgo} ago</span>
          </div>

          {/* Vent text */}
          <p className="font-accent italic text-[15px] text-text-dark leading-relaxed mb-3">
            {vent.content}
          </p>

          {/* Bottom: reply count + reply button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-body text-text-soft flex items-center gap-1">
              <MessageCircle size={13} />
              {replyCount} {replyCount === 1 ? t.cardReply : t.cardReplies}
            </span>
            <motion.button
              onClick={() => setShowReply(!showReply)}
              className="text-xs font-body font-medium text-pink-500 hover:text-pink-600 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {showReply ? t.cardClose : t.cardReplyBtn}
            </motion.button>
          </div>

          {/* Inline reply composer */}
          <AnimatePresence>
            {showReply && (
              <InlineFeedReplyComposer
                ventId={vent.id}
                onReplySent={() => {
                  setReplyCount(c => c + 1);
                  setShowReply(false);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
