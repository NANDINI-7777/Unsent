'use client';

import { motion } from 'framer-motion';
import { Home, MessageCircle, PenLine, History } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/lib/translations';
import type { ScreenName } from '@/types';

const navItems: { icon: typeof Home; label: string; screen: ScreenName }[] = [
  { icon: Home, label: 'home', screen: 'landing' },
  { icon: MessageCircle, label: 'feed', screen: 'feed' },
  { icon: PenLine, label: 'vent', screen: 'vent' },
  { icon: History, label: 'history', screen: 'history' },
];

export function BottomNavBar() {
  const { currentScreen, navigateTo, language } = useAppStore();
  const t = TRANSLATIONS[language];

  const getNavLabel = (label: string) => {
    if (label === 'home') return t.navHome;
    if (label === 'feed') return t.navFeed;
    if (label === 'vent') return t.navVent;
    if (label === 'history') return 'History';
    return label;
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[420px] z-50 glass-nav rounded-3xl border border-pink-200/50 shadow-pink">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.screen ||
            (item.screen === 'landing' && item.label === 'home' && currentScreen === 'landing') ||
            (item.screen === 'feed' && currentScreen === 'feed') ||
            (item.screen === 'vent' && (currentScreen === 'vent' || currentScreen === 'waiting' || currentScreen === 'reply')) ||
            (item.screen === 'history' && currentScreen === 'history');

          return (
            <motion.button
              key={item.label}
              onClick={() => navigateTo(item.screen)}
              className="flex flex-col items-center gap-1 py-2 px-4 relative"
              whileTap={{ scale: 0.9 }}
            >
              <Icon
                size={22}
                className={isActive ? 'text-pink-500' : 'text-text-soft'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] font-body tracking-wide ${
                  isActive ? 'text-pink-500 font-semibold' : 'text-text-soft'
                }`}
              >
                {getNavLabel(item.label)}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-0.5 w-5 h-[3px] rounded-full bg-pink-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
