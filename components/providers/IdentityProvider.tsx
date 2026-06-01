'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useIdentityStore } from '@/store/useIdentityStore';

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

  useEffect(() => {
    initIdentity();
  }, [initIdentity]);

  return (
    <IdentityContext.Provider value={{ deviceId, alias, isInitialized }}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  return useContext(IdentityContext);
}
