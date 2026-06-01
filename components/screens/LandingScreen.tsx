import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bell, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FloatingVentCard } from '@/components/ui/FloatingVentCard';
import { AppFooter } from '@/components/layout/AppFooter';
import { TRANSLATIONS } from '@/lib/translations';

const QUOTE_POOL = [
  {
    text: "i hate how a single minor tone change in a text can completely ruin my mood",
    moodEmoji: '🫠',
    moodColor: '#ff85ae',
    rotation: 0.5,
  },
  {
    text: "it's exhausting being a person who notices everything—the shift in a gaze, the delay in a reply, the missing warmth in a laugh",
    moodEmoji: '😶‍🌫️',
    moodColor: '#e8b4c4',
    rotation: -0.3,
  },
  {
    text: "i carry so many unsent paragraphs for people who don't even read my silence",
    moodEmoji: '🥀',
    moodColor: '#d94478',
    rotation: -0.5,
  },
  {
    text: "Even on the days you feel invisible, your presence is a quiet melody in someone else’s life.",
    moodEmoji: '🙃',
    moodColor: '#ffc9dd',
    rotation: 0.3,
  },
  {
    text: "I wonder if people can see the 'please be kind' sign I’m carrying in my eyes today.",
    moodEmoji: '🫁',
    moodColor: '#b07080',
    rotation: -0.4,
  },
  {
    text: "Softness is not a weakness; it takes a lot of courage to stay gentle in a world that can be so loud and harsh.",
    moodEmoji: '🤌',
    moodColor: '#f56393',
    rotation: 0.4,
  },
  {
    text: "The version of you that you’re becoming is worth letting go of the version that is currently hurting.",
    moodEmoji: '💀',
    moodColor: '#c9788f',
    rotation: -0.2,
  },
  {
    text: "Sunsets are proof that endings can be beautiful, too",
    moodEmoji: '🙃',
    moodColor: '#ffc9dd',
    rotation: 0.2,
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as const },
  },
};

export function LandingScreen() {
  const { navigateTo, setShowAlertsModal, language } = useAppStore();
  const t = TRANSLATIONS[language];
  const [activeVents, setActiveVents] = useState(() => QUOTE_POOL.slice(0, 3));

  const shuffleQuotes = () => {
    // Pick 3 unique random quotes
    const shuffled = [...QUOTE_POOL].sort(() => 0.5 - Math.random());
    setActiveVents(shuffled.slice(0, 3));
  };

  return (
    <div className="flex flex-col items-center px-6 py-10 min-h-screen relative w-full">
      {/* Alerts Bell Icon - Top Right */}
      <motion.button
        onClick={() => setShowAlertsModal(true)}
        className="absolute top-4 right-2 p-3 rounded-full bg-white/40 border border-pink-200/30 shadow-pink text-text-soft hover:text-pink-500 hover:bg-white/80 transition-all z-20 cursor-pointer"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        title="View Alerts"
      >
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-blink" />
      </motion.button>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-6 w-full max-w-sm"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-1 mt-4">
          <h1 className="font-display italic text-5xl text-text-dark tracking-tight">
            unsent<span className="text-pink-500 font-bold font-sans">.</span>
          </h1>
          <p className="font-body text-[10px] text-text-soft tracking-[0.22em] uppercase font-bold mt-1">
            {t.tagline}
          </p>
        </motion.div>

        {/* Anonymous badge */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-pink-200/40 shadow-pink"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="text-xs font-body text-text-mid font-medium">{t.anonBadge}</span>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="font-body text-center text-text-mid text-[15px] leading-relaxed px-2"
        >
          {t.landingDesc}
        </motion.p>

        {/* Floating vent cards section with Shuffle capability */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full mt-2 relative">
          <div className="flex items-center justify-between w-full px-1.5 mb-1 select-none">
            <span className="text-[9.5px] font-body text-text-soft tracking-wider uppercase">from the unsent box</span>
            <motion.button
              onClick={shuffleQuotes}
              className="flex items-center gap-1 text-[10px] font-body text-pink-500 hover:text-pink-600 font-semibold cursor-pointer transition-colors"
              whileTap={{ scale: 0.93 }}
            >
              <Sparkles size={11} className="text-pink-400 animate-pulse" />
              shuffle quotes
            </motion.button>
          </div>
          <div className="flex flex-col gap-3.5 w-full">
            {activeVents.map((vent, i) => (
              <FloatingVentCard 
                key={vent.text} 
                text={vent.text} 
                moodEmoji={vent.moodEmoji} 
                moodColor={vent.moodColor} 
                rotation={vent.rotation}
                delay={i * 0.15}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full mt-4">
          <motion.button
            onClick={() => navigateTo('vent')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-body font-semibold text-base shadow-pink-lg hover:shadow-pink transition-shadow"
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -2 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={18} />
              {t.ctaStart}
            </span>
          </motion.button>

          <motion.button
            onClick={() => navigateTo('feed')}
            className="w-full py-3.5 rounded-2xl border-[1.5px] border-pink-200 text-text-mid font-body text-sm hover:bg-pink-50/50 transition-all"
            whileTap={{ scale: 0.97 }}
          >
            {t.ctaFeed}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="mt-auto pt-12 w-full">
        <AppFooter />
      </div>
    </div>
  );
}
