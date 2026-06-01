'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { REACTIONS } from '@/types';
import { useIdentityStore } from '@/store/useIdentityStore';

interface ReactionBarProps {
  replyId: string;
}

export function ReactionBar({ replyId }: ReactionBarProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [commentSent, setCommentSent] = useState(false);
  const { deviceId } = useIdentityStore();

  const handleReaction = async (reaction: string) => {
    setSelectedReaction(reaction);
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyId, reaction, deviceId }),
      });
    } catch (e) {
      // silently fail
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || commentSent) return;
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyId, reaction: 'comment', ownComment: comment, deviceId }),
      });
      setCommentSent(true);
    } catch (e) {
      // silently fail
    }
  };

  return (
    <div className="px-4 mt-6">
      {/* Quick reactions */}
      <p className="text-xs font-body text-text-soft mb-3">react to this reply:</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {REACTIONS.map((r) => {
          const isSelected = selectedReaction === r.label;
          return (
            <motion.button
              key={r.label}
              onClick={() => handleReaction(r.label)}
              className={`chip text-[12px] ${
                isSelected
                  ? 'bg-pink-100 border-[1.5px] border-pink-400 text-text-dark'
                  : 'bg-white/40 border-[1.5px] border-pink-200/50 text-text-mid'
              }`}
              whileTap={{ scale: 0.9 }}
              animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
            >
              <span>{r.emoji}</span>
              <span>{r.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Own comment input */}
      <div>
        <p className="text-xs font-body text-text-soft mb-2">add your own thought... (anon obv 🕶️)</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 120))}
            placeholder="say something..."
            disabled={commentSent}
            className="flex-1 px-4 py-3 rounded-2xl glass border border-pink-200/40 font-accent italic text-sm text-text-dark placeholder:text-text-soft/50 placeholder:not-italic disabled:opacity-50"
          />
          <motion.button
            onClick={handleComment}
            disabled={!comment.trim() || commentSent}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              comment.trim() && !commentSent
                ? 'bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-pink'
                : 'bg-pink-100 text-text-soft'
            }`}
            whileTap={comment.trim() ? { scale: 0.9 } : {}}
          >
            <Send size={16} />
          </motion.button>
        </div>
        <AnimatePresence>
          {commentSent && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-pink-500 mt-2 font-body text-center"
            >
              sent! 🌸 they&apos;ll see it anonymously
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
