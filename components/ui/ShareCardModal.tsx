'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, Check } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import type { Vent } from '@/types';
import { translateMood } from '@/lib/translations';

interface ShareCardModalProps {
  vent: Vent | null;
  onClose: () => void;
  language?: 'en' | 'hi' | 'hinglish';
}

interface Theme {
  id: string;
  name: string;
  backgroundClass: string;
  textClass: string;
  accentClass: string;
  brandClass: string;
  subtextClass: string;
}

const THEMES: Theme[] = [
  {
    id: 'sweet-blush',
    name: 'Sweet Blush 🌸',
    backgroundClass: 'bg-gradient-to-br from-[#fff0f5] via-[#ffe4ee] to-[#ffc9dd]',
    textClass: 'text-[#3d1f2b]',
    accentClass: 'bg-[#ffe4ee]/80 border-[#ffc9dd]/50 text-[#7a3d52]',
    brandClass: 'text-[#3d1f2b]',
    subtextClass: 'text-[#7a3d52]/60',
  },
  {
    id: 'midnight-secret',
    name: 'Midnight Secret 🔮',
    backgroundClass: 'bg-gradient-to-br from-[#1e0b1c] via-[#3a0d2e] to-[#731950]',
    textClass: 'text-white',
    accentClass: 'bg-white/10 border-white/20 text-pink-200',
    brandClass: 'text-white',
    subtextClass: 'text-pink-100/60',
  },
  {
    id: 'sunrise-tea',
    name: 'Sunrise Tea ☕',
    backgroundClass: 'bg-gradient-to-br from-[#fff3e8] via-[#ffd9d9] to-[#ffa4c4]',
    textClass: 'text-[#481e1e]',
    accentClass: 'bg-[#ffd9d9]/80 border-[#ffa4c4]/40 text-[#852f2f]',
    brandClass: 'text-[#481e1e]',
    subtextClass: 'text-[#852f2f]/60',
  },
  {
    id: 'minimal-calm',
    name: 'Minimal Calm 🍃',
    backgroundClass: 'bg-gradient-to-br from-white to-[#fff8fb]',
    textClass: 'text-[#3d1f2b]',
    accentClass: 'bg-[#fff0f5] border-pink-100 text-[#b07080]',
    brandClass: 'text-[#3d1f2b]',
    subtextClass: 'text-[#b07080]/60',
  },
];

export function ShareCardModal({ vent, onClose, language = 'en' }: ShareCardModalProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!vent) return null;

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      // Small defensive delay to let styles paint completely
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2, // High resolution download
        style: {
          transform: 'scale(1)',
          borderRadius: '0px' // Clean edge cuts in the final image file
        }
      });

      const link = document.createElement('a');
      link.download = `unsent-thought-${vent.id.slice(0, 5)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to capture card image:', error);
      alert('Could not download image. Please try again!');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#3d1f2b]/40 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="relative z-10 w-full max-w-sm glass border border-pink-200/40 rounded-3xl p-5 shadow-pink-lg flex flex-col gap-5 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-body font-bold text-text-dark tracking-wider uppercase">Share Card 📲</span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/40 text-text-soft hover:text-text-dark transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* 1:1 Quote Card Container for Capture */}
          <div className="w-full flex justify-center">
            <div
              ref={cardRef}
              id="unsent-share-card"
              className={`w-[320px] h-[320px] aspect-square rounded-2xl p-6 flex flex-col justify-between shadow-pink-md relative overflow-hidden transition-all duration-300 ${selectedTheme.backgroundClass}`}
            >
              {/* Top Watermark Logo */}
              <div className="flex items-center justify-between select-none">
                <span className={`font-display italic text-lg font-bold ${selectedTheme.brandClass}`}>
                  unsent<span className="text-pink-500 font-sans font-bold">.</span>
                </span>
                <span className={`text-[9px] font-body font-semibold tracking-wider uppercase opacity-80 ${selectedTheme.subtextClass}`}>
                  say it. someone hears it.
                </span>
              </div>

              {/* Central Vent Content */}
              <div className="flex-1 flex items-center justify-center py-4">
                <p className={`font-accent italic text-[16px] text-center leading-relaxed font-medium break-words w-full ${selectedTheme.textClass}`}>
                  "{vent.content}"
                </p>
              </div>

              {/* Bottom Metadata */}
              <div className="flex items-center justify-between mt-auto select-none">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-body ${selectedTheme.accentClass}`}>
                  <span>{vent.moodEmoji}</span>
                  <span>{translateMood(vent.mood, language)}</span>
                </span>
                <span className={`text-[10px] font-body font-semibold ${selectedTheme.subtextClass}`}>
                  — anonymous
                </span>
              </div>
            </div>
          </div>

          {/* Theme Toggles */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9.5px] font-body text-text-soft tracking-wider uppercase pl-1 select-none">Select Theme</span>
            <div className="flex justify-between gap-2.5">
              {THEMES.map((theme) => {
                const isActive = selectedTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`flex-1 py-2 rounded-xl text-[10.5px] font-body font-bold transition-all border cursor-pointer ${
                      isActive 
                        ? 'bg-pink-500 border-pink-500 text-white shadow-pink-sm' 
                        : 'bg-white/40 border-pink-100/50 text-text-mid hover:bg-white/70'
                    }`}
                  >
                    {theme.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-2.5">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-3 rounded-2xl glass border border-pink-200/40 text-xs font-body font-bold text-text-dark hover:bg-white/50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isCopied ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 shadow-pink text-xs font-body font-bold text-white hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isDownloading ? (
                <span>Downloading...</span>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download Card</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
