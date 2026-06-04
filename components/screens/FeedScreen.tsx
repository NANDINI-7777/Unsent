'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { MOODS } from '@/types';
import { useFeedStore } from '@/store/useFeedStore';
import { useAppStore } from '@/store/useAppStore';
import { FeedVentCard } from '@/components/feed/FeedVentCard';
import { TRANSLATIONS, translateMood } from '@/lib/translations';
import { ShareCardModal } from '@/components/ui/ShareCardModal';

const moodFilters = [
  { label: 'all', emoji: '✨' },
  ...MOODS.map((m) => ({ label: m.label, emoji: m.emoji })),
];

export function FeedScreen() {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];
  const {
    vents,
    filter,
    page,
    isLoading,
    hasMore,
    setVents,
    appendVents,
    setFilter,
    setPage,
    setIsLoading,
    setHasMore,
  } = useFeedStore();

  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [sharingVent, setSharingVent] = useState<any>(null);

  const fetchVents = useCallback(
    async (pageNum: number, moodFilter: string, currentStyle: string, append = false) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: '10',
          mood: moodFilter,
          sort: 'latest',
          style: currentStyle,
        });
        const response = await fetch(`/api/vents?${params}`);
        const data = await response.json();

        if (append) {
          appendVents(data.vents);
        } else {
          setVents(data.vents);
        }
        setHasMore(data.hasMore);
      } catch (error) {
        console.error('Failed to fetch vents:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [setVents, appendVents, setIsLoading, setHasMore]
  );

  // Initial load + filter change
  useEffect(() => {
    fetchVents(1, filter, styleFilter);
  }, [filter, styleFilter, fetchVents]);

  const loadMore = () => {
    if (isLoading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVents(nextPage, filter, styleFilter, true);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
    setVents([]);
    setHasMore(true);
  };

  const handleStyleFilterChange = (newStyle: string) => {
    setStyleFilter(newStyle);
    setPage(1);
    setVents([]);
    setHasMore(true);
  };

  return (
    <div className="flex flex-col px-4 py-6 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5 px-1"
      >
        <div>
          <h2 className="font-heading text-2xl text-text-dark">{t.feedHeader}</h2>
          <p className="font-body text-xs text-text-soft mt-0.5">
            {t.feedSub}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100/60 border border-pink-200/40">
          <Radio size={12} className="text-pink-500 animate-pulse" />
          <span className="text-[11px] font-body text-pink-500 font-medium">{t.liveBadge}</span>
        </div>
      </motion.div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-2 px-1"
      >
        {moodFilters.map((m) => {
          const isActive = filter === m.label;
          return (
            <motion.button
              key={m.label}
              onClick={() => handleFilterChange(m.label)}
              className={`chip text-[12px] shrink-0 ${
                isActive ? 'chip-active' : 'chip-inactive'
              }`}
              whileTap={{ scale: 0.93 }}
            >
              <span>{m.emoji}</span>
              <span>{m.label === 'all' ? t.filterAll : translateMood(m.label, language)}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Slide Bar 2: Response Style Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="flex flex-col gap-1 mb-4 px-1.5"
      >
        <span className="text-[9.5px] font-body text-text-soft tracking-wider uppercase select-none">filter by response type</span>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { label: 'all', text: 'All vents ✨' },
            { label: 'heart-to-heart', text: 'Needs comfort 💌' },
            { label: 'fr tho', text: 'Needs advice 💡' },
            { label: 'roast me', text: 'Needs roasts 💀' }
          ].map((item) => {
            const isActive = styleFilter === item.label;
            return (
              <motion.button
                key={item.label}
                onClick={() => handleStyleFilterChange(item.label)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-body font-semibold tracking-wide border shrink-0 transition-all select-none cursor-pointer ${
                  isActive 
                    ? 'bg-pink-500 text-white border-pink-500 shadow-pink' 
                    : 'bg-white/40 border-pink-100 text-text-mid hover:bg-white/70'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Vent cards */}
      <div className="flex flex-col gap-3">
        {/* Soft, quiet dedication card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
          className="p-5 rounded-2xl bg-white/20 border border-pink-200/20 backdrop-blur-sm flex flex-col gap-3 relative overflow-hidden select-none mb-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/5 to-transparent pointer-events-none" />
          
          <p 
            className="font-accent italic text-[13px] leading-relaxed text-center font-normal px-2"
            style={{ color: '#7a4f5a' }}
          >
            "People drift. That's just how it goes. But once in a while someone enters softly — and the world feels a little gentler because of them.
            <br />
            I noticed. I felt it. And I couldn't just watch it fade.
            <br />
            So I built this — not as a memory, but as a feeling that refuses to disappear.
            <br />
            This is where it lives now."
          </p>
          
          <span 
            className="font-body text-[10px] text-center tracking-wide mt-1 block"
            style={{ color: 'rgba(122, 79, 90, 0.65)' }}
          >
            — an unsent feeling, finally finding its place.
          </span>
        </motion.div>

        {vents.map((vent, index) => (
          <motion.div
            key={vent.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <FeedVentCard vent={vent} onShare={() => setSharingVent(vent)} />
          </motion.div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-pink-400"
                  animate={{
                     opacity: [0.3, 1, 0.3],
                     scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                     duration: 1,
                     repeat: Infinity,
                     delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && vents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="font-display italic text-3xl text-pink-300 mb-3">🌸</p>
            <p className="font-heading text-lg text-text-mid">{t.emptyFeedTitle}</p>
            <p className="font-body text-sm text-text-soft mt-1">
              {t.emptyFeedSub}
            </p>
          </motion.div>
        )}

        {/* Load more trigger */}
        {hasMore && !isLoading && vents.length > 0 && (
          <motion.button
            onClick={loadMore}
            className="py-4 text-center text-sm font-body text-pink-500 hover:text-pink-600 transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            {t.loadMore}
          </motion.button>
        )}
      </div>

      {/* Share Card Modal Overlay */}
      {sharingVent && (
        <ShareCardModal
          vent={sharingVent}
          onClose={() => setSharingVent(null)}
          language={language}
        />
      )}
    </div>
  );
}
