'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/lib/translations';
import type { Reply } from '@/types';

interface InlineFeedReplyComposerProps {
  ventId: string;
  onReplySent: (reply: Reply) => void;
}

export function InlineFeedReplyComposer({ ventId, onReplySent }: InlineFeedReplyComposerProps) {
  const [content, setContent] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { deviceId } = useIdentityStore();
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!content.trim()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ventId, content, deviceId }),
      });
      if (response.ok) {
        const reply = await response.json();
        
        if (typeof window !== 'undefined') {
          try {
            const localRepliesJson = localStorage.getItem('unsent_local_replies') || '[]';
            const localReplies = JSON.parse(localRepliesJson);
            localReplies.push(reply);
            localStorage.setItem('unsent_local_replies', JSON.stringify(localReplies));
          } catch (err) {
            console.error('Failed to save reply to localStorage:', err);
          }
        }

        setContent('');
        onReplySent(reply);
      }
    } catch (e) {
      console.error('Failed to send reply:', e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="mt-3 pt-3 border-t border-pink-200/30"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-body text-text-soft">{t.inlineCommentLabel}</span>
      </div>
      <div className="flex gap-2">
        <motion.textarea
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t.inlineCommentPlaceholder}
          rows={2}
          className={`flex-1 px-4 py-3 rounded-2xl bg-white/50 border border-pink-200/40 font-accent italic text-sm text-text-dark placeholder:text-text-soft/50 placeholder:not-italic resize-none focus:outline-none focus:border-pink-300 transition-colors`}
          animate={isShaking ? { x: [-4, 4, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
        />
        <motion.button
          onClick={handleSend}
          disabled={isSending}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 self-end transition-all ${
            content.trim()
              ? 'bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-pink'
              : 'bg-pink-100 text-text-soft'
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <Send size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}
