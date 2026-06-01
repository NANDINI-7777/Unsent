import { create } from 'zustand';
import { GenderType, ReplyStyle, VentOptions } from '@/types';

interface VentStore {
  content: string;
  mood: string;
  moodEmoji: string;
  moodColor: string;
  replyStyle: ReplyStyle;
  options: VentOptions;
  gender: GenderType;
  setContent: (content: string) => void;
  setMood: (mood: string, emoji: string, color: string) => void;
  setReplyStyle: (style: ReplyStyle) => void;
  setOption: (key: keyof VentOptions, value: boolean) => void;
  setGender: (gender: GenderType) => void;
  reset: () => void;
}

const defaultOptions: VentOptions = {
  stayAnon: true,
  showOnFeed: true,
  justForMe: false,
  autoDelete: false,
};

export const useVentStore = create<VentStore>((set) => ({
  content: '',
  mood: '',
  moodEmoji: '',
  moodColor: '',
  replyStyle: 'heart-to-heart',
  options: { ...defaultOptions },
  gender: 'anon',
  setContent: (content) => set({ content }),
  setMood: (mood, moodEmoji, moodColor) => set({ mood, moodEmoji, moodColor }),
  setReplyStyle: (replyStyle) => set({ replyStyle }),
  setOption: (key, value) =>
    set((state) => {
      const newOptions = { ...state.options, [key]: value };
      // Mutual exclusion: justForMe and showOnFeed
      if (key === 'justForMe' && value) {
        newOptions.showOnFeed = false;
      } else if (key === 'showOnFeed' && value) {
        newOptions.justForMe = false;
      }
      return { options: newOptions };
    }),
  setGender: (gender) => set({ gender }),
  reset: () =>
    set({
      content: '',
      mood: '',
      moodEmoji: '',
      moodColor: '',
      replyStyle: 'heart-to-heart',
      options: { ...defaultOptions },
      gender: 'anon',
    }),
}));
