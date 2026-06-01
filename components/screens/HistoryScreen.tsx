'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, LogOut, Key, Mail, ShieldAlert, ChevronRight, PenLine, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { translateMood } from '@/lib/translations';

export function HistoryScreen() {
  const { user, isLoading, error, userVents, login, logout, fetchUserHistory, initAuth } = useAuthStore();
  const { navigateTo, setActiveVent, setCurrentReply } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAnonHistory, setShowAnonHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Initialize auth session on load
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLocalError(null);
    setIsSubmitting(true);

    try {
      const success = await login(email.trim(), password);
      if (!success) {
        setLocalError(error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setLocalError('Failed to access database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenVentReplies = async (vent: any) => {
    setActiveVent(vent);
    
    // Fetch latest reply for this vent to open the thread
    try {
      const response = await fetch(`/api/vents/${vent.id}/replies`);
      if (response.ok) {
        const data = await response.json();
        const replies = data.replies || [];
        if (replies.length > 0) {
          // Open thread with the latest reply
          setCurrentReply(replies[replies.length - 1]);
        } else {
          setCurrentReply(null);
        }
        navigateTo('reply');
      }
    } catch (err) {
      console.error('Failed to open replies thread:', err);
    }
  };

  const isFormValid = email.includes('@') && password.length >= 6;

  // Split View: Display history if user is logged in OR chose to view anonymous device history
  const shouldShowHistory = user !== null || showAnonHistory;

  return (
    <div className="flex flex-col py-6 px-1 min-h-[calc(100vh-80px)] select-none">
      <AnimatePresence mode="wait">
        {!shouldShowHistory ? (
          /* LOGGED OUT: LOGIN / AUTH PORTAL */
          <motion.div
            key="login-portal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center py-8"
          >
            <div className="w-full max-w-sm glass rounded-3xl p-6 border border-pink-200/50 shadow-pink relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100/5 to-transparent pointer-events-none" />

              {/* Icon & Title */}
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500 mb-3 shadow-pink">
                  <History size={22} className="animate-spin-slow" />
                </div>
                <h3 className="font-heading text-xl text-text-dark">recover your diary</h3>
                <p className="font-body text-xs text-text-soft mt-1 leading-relaxed max-w-[280px]">
                  optionally log in or create an account to recover and sync your vents history across devices.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-body text-text-soft uppercase tracking-wider pl-1">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-soft" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. hello@unsent.app"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-100 bg-white/40 font-body text-xs focus:bg-white focus:border-pink-300 transition-all outline-none text-text-dark"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-body text-text-soft uppercase tracking-wider pl-1">Password</label>
                  <div className="relative">
                    <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-soft" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="min. 6 characters"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-100 bg-white/40 font-body text-xs focus:bg-white focus:border-pink-300 transition-all outline-none text-text-dark"
                      required
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {(localError || error) && (
                  <div className="flex gap-2 p-3 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 text-[11px] font-body items-start">
                    <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                    <span>{localError || error}</span>
                  </div>
                )}

                {/* CTA Button */}
                <motion.button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-3.5 rounded-xl font-body font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isFormValid && !isSubmitting
                      ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-pink cursor-pointer'
                      : 'bg-pink-100 text-text-soft cursor-not-allowed'
                  }`}
                  whileTap={isFormValid && !isSubmitting ? { scale: 0.97 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Syncing History...
                    </>
                  ) : (
                    <>
                      Access My History
                      <ArrowRight size={13} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Bypass Anonymous Option */}
              <div className="relative flex py-3 items-center select-none mt-2">
                <div className="flex-grow border-t border-pink-100/50"></div>
                <span className="flex-shrink mx-3 text-[10px] font-body text-text-soft">or</span>
                <div className="flex-grow border-t border-pink-100/50"></div>
              </div>

              <motion.button
                onClick={() => {
                  setShowAnonHistory(true);
                  fetchUserHistory();
                }}
                className="w-full py-3 rounded-xl font-body font-semibold text-xs text-text-mid bg-white/40 border border-pink-100 hover:bg-white/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-pink"
                whileTap={{ scale: 0.97 }}
              >
                Continue Anonymously 🌸
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* LOGGED IN / ANON HISTORY VIEW */
          <motion.div
            key="history-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col"
          >
            {/* Header Profile Tag */}
            <div className="flex items-center justify-between mb-5 px-1 bg-white/20 border border-pink-200/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] font-body font-bold text-pink-500 uppercase tracking-wider select-none">
                  {user ? 'synced cloud diary' : 'offline device diary'}
                </span>
                <span className="text-xs font-body text-text-dark font-medium mt-0.5">
                  {user ? user.email : 'private device history'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!user && (
                  <button
                    onClick={() => setShowAnonHistory(false)}
                    className="px-2.5 py-1 text-[10px] font-body font-semibold bg-pink-100 text-pink-500 rounded-lg hover:bg-pink-200/60 transition-colors cursor-pointer"
                  >
                    Sync
                  </button>
                )}
                {user && (
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg bg-pink-50 text-text-mid hover:text-pink-600 hover:bg-pink-100 transition-colors flex items-center justify-center cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* List of Vents */}
            <div className="flex flex-col gap-3 flex-1 pb-16">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2.5">
                  <Loader2 size={24} className="animate-spin text-pink-400" />
                  <span className="text-xs font-body text-text-soft">Loading your diary...</span>
                </div>
              ) : userVents.length === 0 ? (
                /* EMPTY STATE */
                <div className="flex-grow flex flex-col items-center justify-center py-20 text-center select-none">
                  <div className="p-4 rounded-2xl bg-pink-100/50 text-pink-400 mb-4 shadow-pink">
                    <PenLine size={24} />
                  </div>
                  <h4 className="font-heading text-lg text-text-dark">no entries in your diary</h4>
                  <p className="font-body text-xs text-text-soft mt-1 leading-relaxed max-w-[240px]">
                    your past vents will appear here so you can revisit and re-read the replies anytime.
                  </p>
                  <motion.button
                    onClick={() => navigateTo('vent')}
                    className="mt-6 px-5 py-2.5 rounded-xl font-body font-semibold text-xs text-white bg-gradient-to-r from-pink-400 to-pink-500 shadow-pink cursor-pointer flex items-center gap-1"
                    whileTap={{ scale: 0.95 }}
                  >
                    Vent your heart out ✍️
                  </motion.button>
                </div>
              ) : (
                /* HISTORY CARDS */
                <>
                  <h4 className="text-[10px] font-body text-text-soft tracking-wider uppercase pl-1.5 select-none">Diary Entries ({userVents.length})</h4>
                  <div className="flex flex-col gap-3">
                    {userVents.map((vent) => (
                      <motion.div
                        key={vent.id}
                        onClick={() => handleOpenVentReplies(vent)}
                        whileHover={{ y: -2 }}
                        className="glass p-4 rounded-2xl border border-pink-200/30 hover:border-pink-300/40 hover:bg-white/40 cursor-pointer flex gap-3 shadow-pink transition-all select-none"
                      >
                        {/* Accent Orb bar */}
                        <div 
                          className="w-1.5 rounded-full shrink-0" 
                          style={{ backgroundColor: vent.moodColor }}
                        />
                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                          {/* Top Row */}
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-pink-100/50 border border-pink-200/20 text-[10px] font-body">
                              <span>{vent.moodEmoji}</span>
                              <span className="text-text-mid font-medium">{translateMood(vent.mood, 'en')}</span>
                            </span>
                            <span className="text-[9px] font-body text-text-soft">
                              {new Date(vent.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>

                          {/* Content Snip */}
                          <p className="font-accent italic text-sm text-text-dark leading-relaxed truncate select-text">
                            "{vent.content}"
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-1 border-t border-pink-100/30">
                            <span className="text-[10px] font-body text-text-soft">
                              {vent.replyCount} {vent.replyCount === 1 ? 'reply' : 'replies'} 💬
                            </span>
                            <span className="text-[10px] font-body font-semibold text-pink-500 flex items-center gap-0.5">
                              Open Thread
                              <ChevronRight size={10} />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
