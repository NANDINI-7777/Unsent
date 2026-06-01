'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useIdentityStore } from '@/store/useIdentityStore';
import { useAuthStore } from '@/store/useAuthStore';

interface IdentityContextType {
  deviceId: string;
  alias: string;
  isInitialized: boolean;
}

const IdentityContext = createContext<IdentityContextType>({
  deviceId: '',
  alias: '',
  isInitialized: false,
});

export function IdentityProvider({ children }: { children: ReactNode }) {
  const { deviceId, alias, isInitialized, initIdentity } = useIdentityStore();
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initIdentity();
    initAuth();
  }, [initIdentity, initAuth]);

  return (
    <IdentityContext.Provider value={{ deviceId, alias, isInitialized }}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  return useContext(IdentityContext);
}
