'use client';

import { ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { BottomNavBar } from './BottomNavBar';
import { TRANSLATIONS } from '@/lib/translations';
import { ShaderBackground } from '@/components/ui/ShaderBackground';
import { AlertsModal } from '@/components/ui/AlertsModal';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { currentScreen, navigateTo, setShowAlertsModal, language, setLanguage } = useAppStore();
  const t = TRANSLATIONS[language];

  return (
    <div className="relative min-h-dvh flex flex-col w-full">
      {/* Calming GPU-accelerated WebGL Shader Background */}
      <ShaderBackground />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Header bar (Sticky at the top on both mobile and desktop, except landing and waiting screens) */}
      {currentScreen !== 'landing' && currentScreen !== 'waiting' && (
        <header className="w-full px-5 py-4 border-b border-pink-200/20 bg-white/30 backdrop-blur-md flex items-center justify-between z-20 sticky top-0">
          <div className="w-full max-w-xl mx-auto flex items-center justify-between">
            <div
              className="font-display italic text-xl text-text-dark font-bold select-none cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigateTo('landing')}
            >
              unsent<span className="text-pink-500 font-bold font-sans">.</span>
            </div>
            <div className="flex items-center gap-2.5">

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 border border-pink-200/30 text-[10px] font-body text-text-soft font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.anonymousHeaderBadge}
              </div>
              <button
                onClick={() => setShowAlertsModal(true)}
                className="p-1.5 rounded-full hover:bg-white/50 text-text-soft hover:text-pink-500 transition-colors relative cursor-pointer flex items-center justify-center"
                title="View Alerts"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-pink-500 animate-blink" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Centered content block for ideal desktop readability and mobile fit */}
      <main className="main-content flex-1 w-full max-w-xl mx-auto px-4 relative z-10">
        {children}
      </main>

      {/* Floating navigation bar */}
      <BottomNavBar />

      {/* Inbox Alerts Popup */}
      <AlertsModal />
    </div>
  );
}
