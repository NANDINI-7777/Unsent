'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Vent, Reply } from '@/types';
import { InlineFeedReplyComposer } from './InlineFeedReplyComposer';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS, translateMood } from '@/lib/translations';

interface FeedVentCardProps {
  vent: Vent;
}

export function FeedVentCard({ vent }: FeedVentCardProps) {
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesList, setRepliesList] = useState<Reply[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [replyCount, setReplyCount] = useState(vent.replyCount);
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  const timeAgo = formatDistanceToNow(new Date(vent.createdAt), { addSuffix: false });

  // Stateless, deterministic hashing to assign a consistent, anonymous stranger ID
  const getConsistentAlias = (deviceId: string | undefined): string => {
    if (!deviceId || deviceId === 'server' || deviceId.startsWith('ai')) {
      return '??? stranger';
    }
    let hash = 0;
    for (let i = 0; i < deviceId.length; i++) {
      hash = deviceId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(1000 + (hash % 9000));
    return `stranger #${num}`;
  };

  const toggleReplies = async () => {
    const nextState = !showReplies;
    setShowReplies(nextState);
    
    if (nextState && repliesList.length === 0) {
      setIsFetching(true);
      try {
        const response = await fetch(`/api/vents/${vent.id}/replies`);
        if (response.ok) {
          const data = await response.json();
          setRepliesList(data.replies || []);
        }
      } catch (err) {
        console.error('Failed to fetch replies:', err);
      } finally {
        setIsFetching(false);
      }
    }
  };

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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-100/60 border border-pink-200/40 text-xs font-body select-none">
              <span>{vent.moodEmoji}</span>
              <span className="text-text-mid">{translateMood(vent.mood, language)}</span>
            </span>
            <span className="text-[11px] font-body text-text-soft select-none">{timeAgo} ago</span>
          </div>

          {/* Vent text */}
          <p className="font-accent italic text-[15px] text-text-dark leading-relaxed mb-3">
            {vent.content}
          </p>

          {/* Bottom: reply count + view replies + reply button */}
          <div className="flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <span className="text-xs font-body text-text-soft flex items-center gap-1">
                <MessageCircle size={13} />
                {replyCount} {replyCount === 1 ? t.cardReply : t.cardReplies}
              </span>
              {replyCount > 0 && (
                <button
                  onClick={toggleReplies}
                  className="text-xs font-body font-semibold text-pink-400 hover:text-pink-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {showReplies ? 'Hide replies 💬' : 'View replies 💬'}
                </button>
              )}
            </div>
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
                onReplySent={(newReply) => {
                  setReplyCount(c => c + 1);
                  setRepliesList(prev => [...prev, newReply]);
                  setShowReply(false);
                }}
              />
            )}
          </AnimatePresence>

          {/* Public replies list */}
          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-pink-100/40 flex flex-col gap-2.5 overflow-hidden"
              >
                <span className="text-[10px] font-body text-text-soft tracking-wider uppercase select-none mb-1">Replies Thread</span>
                
                {isFetching ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
                  </div>
                ) : repliesList.length === 0 ? (
                  <p className="text-xs font-body text-text-soft italic text-center py-2">No replies yet.</p>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                    {repliesList.map((reply) => {
                      const isAI = !reply.deviceId || reply.deviceId === 'server' || reply.deviceId.startsWith('ai');
                      const alias = getConsistentAlias(reply.deviceId);
                      const replyTimeAgo = formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true });
                      return (
                        <div 
                          key={reply.id}
                          className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                            isAI 
                              ? 'bg-pink-50/40 border-pink-100/50' 
                              : 'bg-white/40 border-pink-200/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-body font-semibold ${isAI ? 'text-pink-500 font-bold' : 'text-text-dark font-medium'}`}>
                              {alias}
                            </span>
                            <span className="text-[9px] font-body text-text-soft select-none">
                              {replyTimeAgo}
                            </span>
                          </div>
                          <p className="font-body text-xs text-text-mid leading-relaxed select-text">
                            {reply.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
