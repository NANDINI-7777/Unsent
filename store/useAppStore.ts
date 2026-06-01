import { create } from 'zustand';
import { ScreenName, Vent, Reply } from '@/types';

export interface AppAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  reply: Reply;
}

export interface AppNotification {
  ventId: string;
  alias: string;
  replyContent: string;
}

interface AppStore {
  currentScreen: ScreenName;
  previousScreen: ScreenName | null;
  activeVent: Vent | null;
  currentReply: Reply | null;
  showCrisisModal: boolean;
  showAlertsModal: boolean;
  language: 'en' | 'hi' | 'hinglish';
  pendingVentContent: string;
  
  // Background Notification States
  activeNotification: AppNotification | null;
  isGeneratingReply: boolean;
  unreadAlertCount: number;
  alerts: AppAlert[];

  navigateTo: (screen: ScreenName) => void;
  setActiveVent: (vent: Vent | null) => void;
  setCurrentReply: (reply: Reply | null) => void;
  setShowCrisisModal: (show: boolean) => void;
  setShowAlertsModal: (show: boolean) => void;
  setLanguage: (lang: 'en' | 'hi' | 'hinglish') => void;
  setPendingVentContent: (content: string) => void;
  
  // Notification setters
  setActiveNotification: (notif: AppNotification | null) => void;
  setUnreadAlertCount: (count: number) => void;
  clearAlerts: () => void;
  triggerBackgroundReply: (vent: Vent) => Promise<void>;
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
  
  activeNotification: null,
  isGeneratingReply: false,
  unreadAlertCount: 0,
  alerts: [],

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
  
  setActiveNotification: (activeNotification) => set({ activeNotification }),
  setUnreadAlertCount: (unreadAlertCount) => set({ unreadAlertCount }),
  clearAlerts: () => set({ alerts: [], unreadAlertCount: 0 }),
  
  triggerBackgroundReply: async (vent: Vent) => {
    set({ isGeneratingReply: true });
    
    // Simulate background network delay (similar to waiting screen)
    const delay = 6000 + Math.random() * 5000;
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    try {
      const response = await fetch('/api/reply/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ventId: vent.id,
          ventContent: vent.content,
          mood: vent.mood,
          replyStyle: vent.replyStyle,
          gender: vent.gender,
        }),
      });

      if (response.ok) {
        const reply = await response.json();
        
        // Standardize AI tag alias
        const isAI = !reply.deviceId || reply.deviceId === 'server' || reply.deviceId.startsWith('ai');
        const alias = isAI ? '??? stranger' : 'stranger #anonymous';

        const state = get();
        if (state.currentScreen === 'waiting' && state.activeVent?.id === vent.id) {
          // If user stayed on waiting screen, directly open the thread!
          set({ currentReply: reply, isGeneratingReply: false });
          state.navigateTo('reply');
        } else {
          // User went back home or feed -> trigger notifications!
          set({
            activeNotification: {
              ventId: vent.id,
              alias,
              replyContent: reply.content,
            },
            unreadAlertCount: state.unreadAlertCount + 1,
            alerts: [
              {
                id: reply.id,
                title: `${alias} replied to your vent!`,
                description: reply.content,
                time: 'Just now',
                reply,
              },
              ...state.alerts,
            ],
            isGeneratingReply: false
          });
        }
      } else {
        set({ isGeneratingReply: false });
      }
    } catch (err) {
      console.error('Failed to trigger background AI reply:', err);
      set({ isGeneratingReply: false });
    }
  },
}));
