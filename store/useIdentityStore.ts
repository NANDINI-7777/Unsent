import { create } from 'zustand';

interface IdentityStore {
  deviceId: string;
  alias: string;
  isInitialized: boolean;
  initIdentity: () => void;
}

export const useIdentityStore = create<IdentityStore>((set, get) => ({
  deviceId: '',
  alias: '',
  isInitialized: false,
  initIdentity: () => {
    if (get().isInitialized) return;
    if (typeof window === 'undefined') return;
    
    // Import dynamically to avoid SSR issues
    const { generateDeviceId, generateAlias } = require('@/lib/identity');
    const deviceId = generateDeviceId();
    const alias = generateAlias();
    set({ deviceId, alias, isInitialized: true });
  },
}));
