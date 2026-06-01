import { create } from 'zustand';
import { Vent } from '@/types';

interface FeedStore {
  vents: Vent[];
  filter: string;
  page: number;
  isLoading: boolean;
  hasMore: boolean;
  setVents: (vents: Vent[]) => void;
  appendVents: (vents: Vent[]) => void;
  prependVent: (vent: Vent) => void;
  setFilter: (filter: string) => void;
  setPage: (page: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  incrementReplyCount: (ventId: string) => void;
  reset: () => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  vents: [],
  filter: 'all',
  page: 1,
  isLoading: false,
  hasMore: true,
  setVents: (vents) => set({ vents }),
  appendVents: (newVents) => set((state) => ({ vents: [...state.vents, ...newVents] })),
  prependVent: (vent) => set((state) => ({ vents: [vent, ...state.vents] })),
  setFilter: (filter) => set({ filter, page: 1, vents: [], hasMore: true }),
  setPage: (page) => set({ page }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setHasMore: (hasMore) => set({ hasMore }),
  incrementReplyCount: (ventId) =>
    set((state) => ({
      vents: state.vents.map((v) =>
        v.id === ventId ? { ...v, replyCount: v.replyCount + 1 } : v
      ),
    })),
  reset: () => set({ vents: [], filter: 'all', page: 1, isLoading: false, hasMore: true }),
}));
