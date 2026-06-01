'use client';

import { AppShell } from '@/components/layout/AppShell';
import { IdentityProvider } from '@/components/providers/IdentityProvider';
import { TransitionProvider } from '@/components/providers/TransitionProvider';
import { CrisisModal } from '@/components/ui/CrisisModal';
import { useAppStore } from '@/store/useAppStore';

import { LandingScreen } from '@/components/screens/LandingScreen';
import { VentScreen } from '@/components/screens/VentScreen';
import { WaitingScreen } from '@/components/screens/WaitingScreen';
import { ReplyScreen } from '@/components/screens/ReplyScreen';
import { FeedScreen } from '@/components/screens/FeedScreen';
import { HistoryScreen } from '@/components/screens/HistoryScreen';

const screens = {
  landing: LandingScreen,
  vent: VentScreen,
  waiting: WaitingScreen,
  reply: ReplyScreen,
  feed: FeedScreen,
  history: HistoryScreen,
};

export default function Home() {
  const { currentScreen } = useAppStore();
  const ScreenComponent = screens[currentScreen];

  return (
    <IdentityProvider>
      <AppShell>
        <TransitionProvider screenKey={currentScreen}>
          <ScreenComponent />
        </TransitionProvider>
        <CrisisModal />
      </AppShell>
    </IdentityProvider>
  );
}
