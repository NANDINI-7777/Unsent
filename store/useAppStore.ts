import { create } from 'zustand';
import { ScreenName, Vent, Reply } from '@/types';

interface AppStore {
  currentScreen: ScreenName;
  previousScreen: ScreenName | null;
  activeVent: Vent | null;
  currentReply: Reply | null;
  showCrisisModal: boolean;
  showAlertsModal: boolean;
  language: 'en' | 'hi' | 'hinglish';
  pendingVentContent: string;
  navigateTo: (screen: ScreenName) => void;
  setActiveVent: (vent: Vent | null) => void;
  setCurrentReply: (reply: Reply | null) => void;
  setShowCrisisModal: (show: boolean) => void;
  setShowAlertsModal: (show: boolean) => void;
  setLanguage: (lang: 'en' | 'hi' | 'hinglish') => void;
  setPendingVentContent: (content: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  currentScreen: 'landing',
  previousScreen: null,
  activeVent: null,
  currentReply: null,
  showCrisisModal: false,
  showAlertsModal: false,
  language: 'en',
  pendingVentContent: '',
  navigateTo: (screen) =>
    set((state) => ({
      currentScreen: screen,
      previousScreen: state.currentScreen,
    })),
  setActiveVent: (vent) => set({ activeVent: vent }),
  setCurrentReply: (reply) => set({ currentReply: reply }),
  setShowCrisisModal: (show) => set({ showCrisisModal: show }),
  setShowAlertsModal: (show) => set({ showAlertsModal: show }),
  setLanguage: (language) => set({ language }),
  setPendingVentContent: (content) => set({ pendingVentContent: content }),
}));
