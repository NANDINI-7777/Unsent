import { create } from 'zustand';
import { supabase } from '@/lib/supabase-client';
import { useIdentityStore } from './useIdentityStore';
import { useAppStore } from './useAppStore';
import type { Vent, Reply } from '@/types';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  userVents: Vent[];
  
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUserHistory: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  userVents: [],

  initAuth: async () => {
    if (typeof window === 'undefined') return;
    
    // Check Supabase session first if connected
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
          },
        });
        await get().fetchUserHistory();
        return;
      }
    }

    // Otherwise check local mock session
    const mockEmail = localStorage.getItem('unsent_session_email');
    const mockUserId = localStorage.getItem('unsent_session_userid');
    if (mockEmail && mockUserId) {
      set({
        user: {
          id: mockUserId,
          email: mockEmail,
        },
      });
      await get().fetchUserHistory();
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const deviceId = useIdentityStore.getState().deviceId;

    // 1. Supabase Cloud Auth Flow
    if (supabase) {
      try {
        let authenticatedUser = null;

        // Try sign in
        const signInResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // Auto-Register: If user does not exist, automatically sign them up!
        if (signInResult.error && (signInResult.error.message.includes('Invalid login credentials') || signInResult.error.message.includes('User not found'))) {
          console.log('🌱 Account not found. Automatically registering user...');
          const signupResult = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (signupResult.error) throw signupResult.error;
          if (signupResult.data?.user) {
            authenticatedUser = signupResult.data.user;
          }
        } else if (signInResult.error) {
          throw signInResult.error;
        } else if (signInResult.data?.user) {
          authenticatedUser = signInResult.data.user;
        }

        if (authenticatedUser) {
          const authUser = {
            id: authenticatedUser.id,
            email: authenticatedUser.email || '',
          };

          // Link offline history: update any previous anonymous vents on this device to this user!
          try {
            await supabase
              .from('vents')
              .update({ user_id: authenticatedUser.id })
              .eq('device_id', deviceId)
              .is('user_id', null);
          } catch (linkErr) {
            console.warn('⚠️ Non-critical history linking error:', linkErr);
          }

          set({ user: authUser, isLoading: false });
          await get().fetchUserHistory();
          return true;
        }
      } catch (err: any) {
        console.error('Supabase Auth error:', err);
        set({ error: err.message || 'Authentication failed', isLoading: false });
        return false;
      }
    }

    // 2. Persistent Local Mock Auth Fallback Flow
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // fake delay
      
      const accountsJson = localStorage.getItem('unsent_mock_accounts') || '{}';
      const accounts = JSON.parse(accountsJson);

      let userId = accounts[email];
      if (userId) {
        // Account exists, authenticate
        localStorage.setItem('unsent_session_email', email);
        localStorage.setItem('unsent_session_userid', userId);
      } else {
        // Create new account
        userId = 'mock-' + crypto.randomUUID();
        accounts[email] = userId;
        localStorage.setItem('unsent_mock_accounts', JSON.stringify(accounts));
        localStorage.setItem('unsent_session_email', email);
        localStorage.setItem('unsent_session_userid', userId);

        // Link offline history: link local mock vents to this user
        const localVentsJson = localStorage.getItem('unsent_local_history') || '[]';
        const localVents = JSON.parse(localVentsJson);
        const updatedVents = localVents.map((v: any) => {
          if (v.deviceId === deviceId && !v.userId) {
            return { ...v, userId };
          }
          return v;
        });
        localStorage.setItem('unsent_local_history', JSON.stringify(updatedVents));
      }

      set({
        user: { id: userId, email },
        isLoading: false,
      });
      await get().fetchUserHistory();
      return true;
    } catch (err: any) {
      set({ error: 'Mock login failed', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    if (supabase) {
      await supabase.auth.signOut();
    }

    localStorage.removeItem('unsent_session_email');
    localStorage.removeItem('unsent_session_userid');
    
    set({ user: null, userVents: [], isLoading: false });
    useAppStore.getState().navigateTo('landing');
  },

  fetchUserHistory: async () => {
    const deviceId = useIdentityStore.getState().deviceId;
    const currentUser = get().user;

    // 1. Supabase Cloud History Fetch
    if (supabase) {
      try {
        let query = supabase
          .from('vents')
          .select('*, replies(count)');

        if (currentUser) {
          // Fetch vents belonging to this user or this device
          query = query.or(`user_id.eq.${currentUser.id},device_id.eq.${deviceId}`);
        } else {
          // Fetch vents belonging only to this anonymous device
          query = query.eq('device_id', deviceId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        const standardized = (data || []).map((item: any) => ({
          id: item.id,
          content: item.content,
          mood: item.mood,
          moodEmoji: item.mood_emoji,
          moodColor: item.mood_color,
          replyStyle: item.reply_style,
          showOnFeed: item.show_on_feed,
          autoDelete: item.auto_delete,
          deviceId: item.device_id,
          replyCount: item.replies?.[0]?.count || 0,
          gender: item.gender || 'anon',
          createdAt: item.created_at,
          expiresAt: item.expires_at,
        }));

        set({ userVents: standardized });
        return;
      } catch (err) {
        console.error('Supabase fetch history error:', err);
      }
    }

    // 2. Persistent Local Mock History Fallback
    const localVentsJson = localStorage.getItem('unsent_local_history') || '[]';
    let localVents = JSON.parse(localVentsJson);

    // Filter local history
    if (currentUser) {
      localVents = localVents.filter((v: any) => v.userId === currentUser.id || v.deviceId === deviceId);
    } else {
      localVents = localVents.filter((v: any) => v.deviceId === deviceId);
    }

    // Dynamic replyCount calculation from localStorage to resolve the offline zero replies count glitch
    if (typeof window !== 'undefined') {
      try {
        const localRepliesJson = localStorage.getItem('unsent_local_replies') || '[]';
        const localReplies: Reply[] = JSON.parse(localRepliesJson);
        
        localVents = localVents.map((v: any) => {
          const myReplies = localReplies.filter(r => r.ventId === v.id);
          return {
            ...v,
            replyCount: Math.max(v.replyCount || 0, myReplies.length),
          };
        });
      } catch (err) {
        console.error('Failed to sync offline history replyCount:', err);
      }
    }

    // Sort newest first
    localVents.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    set({ userVents: localVents });
  },
}));
