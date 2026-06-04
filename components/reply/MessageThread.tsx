'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Vent, Reply } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface MessageThreadProps {
  vent: Vent;
  reply: Reply;
}

const COPING_TIPS: Record<string, Record<string, string>> = {
  'cooked': {
    en: 'splash ice-cold water on your face. it instantly triggers the mammalian dive reflex, naturally slowing your heart rate and grounding you.',
    hinglish: 'face par thoda thanda paani splash krlo yahan. ye mammalian dive reflex trigger krke heart rate ko instantly shant krta h.',
    hi: 'अपने चेहरे पर ठंडा पानी छिड़कें। यह तुरंत आपके दिल की धड़कन को नियंत्रित करता है और आपको शांत महसूस कराता है।'
  },
  'dead inside': {
    en: 'step outside and do a horizon-reset: look at the sky for 60 seconds. physically widening your visual sight instantly resets brain fatigue.',
    hinglish: 'yahan 2 min ke liye bahar jaake sky ko dekho. physical sight ko broaden krne se dimaag ko fresh perspective aur space milta h.',
    hi: '२ मिनट के लिए बाहर जाएं और खुले आसमान को देखें। अपनी दृष्टि को व्यापक करने से मस्तिष्क की थकान तुरंत दूर होती है।'
  },
  'melting': {
    en: 'do a 10-second full-body muscle clench. squeeze your fists tight, hold, and then completely release. physical release brings mental relief.',
    hinglish: 'apne dono fists ko tight band karo, 5 seconds hold karo, fir completely release krdo. physical release se stress shant hota h.',
    hi: 'अपनी मुट्ठियों को जोर से भींचें, ५ सेकंड तक रोकें और फिर पूरी तरह ढीला छोड़ दें। शारीरिक शिथिलता से मानसिक तनाव दूर होता है।'
  },
  'not okay': {
    en: 'grab a pen and just doodle/sketch chaotically on any scrap paper. scribbling and drawing releases trapped emotional stress physically.',
    hinglish: 'ek scrap paper uthao aur doodle krna shuru krdo. drawing aur scribbling krne se trapped emotional tension nikalta h.',
    hi: 'एक कागज उठाएं और उस पर कुछ भी आड़ा-तिरछा बनाना (doodle) शुरू करें। रेखाचित्र बनाने से तनाव दूर होता है।'
  },
  'dissociating': {
    en: '5-4-3-2-1 grounding: find 5 things you can see, 4 things you can touch, 3 things you can hear, and 2 things you can smell right now.',
    hinglish: 'ground yourself: apne aas-paas 5 cheezein dekho jo dikh rhi hain, 4 cheezein jinko touch kr skte ho, aur 3 sounds suno.',
    hi: '५-४-३-२-१ अभ्यास: ५ चीजें देखें, ४ चीजें स्पर्श करें, ३ आवाजें सुनें, २ चीजें सूंघें और १ चीज का स्वाद लें।'
  },
  'it is what it is': {
    en: 'write down a completely raw, chaotic note on paper, then crumple it up and throw it in the bin. the physical toss is incredibly satisfying.',
    hinglish: 'jo dimaag me h paper pr raw likho, fir use crush krke kachre ke dibbe me phek do. that physical toss is so satisfying.',
    hi: 'कागज के एक टुकड़े पर अपने मन की बात लिखें, फिर उसे मोड़कर कचरे के डिब्बे में फेंक दें। यह आपको काफी राहत देगा।'
  },
  "can't breathe": {
    en: '4-7-8 breathing: inhale for 4s, hold for 7s, and exhale slowly for 8s. place a hand on your chest — you are completely safe right here.',
    hinglish: 'place your hand on chest: 4 seconds saans lo, 7 hold karo, 8 seconds exhale karo. tu bilkul safe h yahan.',
    hi: '४-७-८ श्वास लें: ४ सेकंड सांस अंदर लें, ७ सेकंड रोकें, और ८ सेकंड में धीरे-धीरे बाहर छोड़ें। आप सुरक्षित हैं।'
  },
  'totally fine': {
    en: 'brain dump: write down 3 completely silly, minor things that are occupying your head space right now, then fold the paper and forget them.',
    hinglish: 'dimaag se saari choti thoughts nikalne ke liye ek paper pr 3 random aur choti cheezein likh kar page faad do.',
    hi: 'दिमाग खाली करें: ३ छोटी या मामूली चीजें लिखें जो इस समय आपके दिमाग में चल रही हैं, और फिर उन्हें भूल जाएं।'
  }
};

export function MessageThread({ vent, reply }: MessageThreadProps) {
  const { language, setCurrentReply } = useAppStore();
  const [isRefining, setIsRefining] = useState(false);

  const moodKey = vent.mood.toLowerCase().trim();
  const copingTip = COPING_TIPS[moodKey]?.[language] || COPING_TIPS['totally fine'][language];

  const isAI = !reply.deviceId || reply.deviceId === 'server' || reply.deviceId.startsWith('ai');

  const handleRefine = async () => {
    if (isRefining) return;
    setIsRefining(true);
    try {
      const response = await fetch('/api/reply/ai/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyId: reply.id,
          ventContent: vent.content,
          mood: vent.mood,
          replyStyle: vent.replyStyle,
          gender: vent.gender || 'anon',
          previousReply: reply.content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine reply');
      }

      const data = await response.json();
      if (data.reply) {
        // Update AppStore state
        setCurrentReply(data.reply);

        // Update localStorage
        if (typeof window !== 'undefined') {
          try {
            const localRepliesJson = localStorage.getItem('unsent_local_replies') || '[]';
            const localReplies = JSON.parse(localRepliesJson);
            const updatedReplies = localReplies.map((r: any) => {
              if (r.id === reply.id) {
                return data.reply;
              }
              return r;
            });
            localStorage.setItem('unsent_local_replies', JSON.stringify(updatedReplies));
          } catch (err) {
            console.error('Failed to sync updated reply to local storage:', err);
          }
        }
      }
    } catch (err) {
      console.error('Error refining AI reply:', err);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4">
      {/* Sent bubble (user's vent) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="self-end max-w-[85%]"
      >
        <div className="bubble-sent px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{vent.moodEmoji}</span>
            <span className="text-xs font-body text-text-soft">{vent.mood}</span>
          </div>
          <p className="font-accent italic text-[15px] text-text-dark leading-relaxed">
            {vent.content}
          </p>
        </div>
        <p className="text-[11px] text-text-soft font-body text-right mt-1 pr-2">you</p>
      </motion.div>

      {/* Received bubble (stranger's reply) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="self-start max-w-[85%] flex flex-col gap-3"
      >
        <div className="bubble-received px-5 py-4 relative">
          {/* Mystery label */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">?</span>
            </div>
            <span className="text-xs font-body text-pink-500 font-medium">??? stranger</span>
          </div>
          <p className="font-body text-[15px] text-text-dark leading-relaxed pr-2">
            {reply.content}
          </p>

          {/* AI Refine Button */}
          {isAI && (
            <div className="mt-3 pt-2 border-t border-pink-100/50 flex justify-end">
              <motion.button
                onClick={handleRefine}
                disabled={isRefining}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200/60 text-pink-500 font-body text-xs font-semibold tracking-wide transition-all duration-300 disabled:opacity-60 cursor-pointer"
                whileTap={{ scale: 0.96 }}
              >
                {isRefining ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>refining...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Refine Reply ✨</span>
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>
        
        {/* Physiological Coping Suggestion Card */}
        {copingTip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="p-4 rounded-2xl bg-white/40 border border-pink-200/50 backdrop-blur-sm shadow-pink flex flex-col gap-2 relative overflow-hidden select-none"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-1.5 text-pink-500 font-semibold tracking-wider">
              <span>✍️</span>
              <span className="font-body text-[10px] uppercase">stranger's chill note</span>
            </div>
            <p className="font-accent italic text-[12.5px] leading-relaxed text-text-mid">
              "{copingTip}"
            </p>
          </motion.div>
        )}
        
        <p className="text-[11px] text-text-soft font-body mt-1 pl-2">a stranger who gets it</p>
      </motion.div>
    </div>
  );
}
