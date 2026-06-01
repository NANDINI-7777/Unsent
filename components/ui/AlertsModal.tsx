'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Heart, MessageSquare, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS } from '@/lib/translations';

export function AlertsModal() {
  const { 
    showAlertsModal, 
    setShowAlertsModal, 
    language,
    alerts,
    setCurrentReply,
    navigateTo
  } = useAppStore();
  
  const t = TRANSLATIONS[language];

  const staticAlerts = [
    {
      id: 'static-1',
      icon: Heart,
      iconColor: 'text-pink-500 bg-pink-100',
      title: t.alert1Title,
      description: t.alert1Desc,
      time: '20m',
      reply: undefined,
      isDynamic: false
    },
    {
      id: 'static-2',
      icon: MessageSquare,
      iconColor: 'text-indigo-500 bg-indigo-100',
      title: t.alert2Title,
      description: t.alert2Desc,
      time: '1h',
      reply: undefined,
      isDynamic: false
    }
  ];

  const allAlerts = [
    ...alerts.map((a) => ({
      id: a.id,
      icon: MessageSquare,
      iconColor: 'text-pink-500 bg-pink-100',
      title: a.title,
      description: a.description,
      time: a.time,
      reply: a.reply,
      isDynamic: true
    })),
    ...staticAlerts
  ];

  return (
    <AnimatePresence>
      {showAlertsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-pink-50/70 backdrop-blur-md"
            onClick={() => setShowAlertsModal(false)}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="relative glass-strong rounded-3xl p-6 max-w-sm w-full shadow-pink-lg"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAlertsModal(false)}
              className="absolute top-4 right-4 text-text-soft hover:text-text-mid transition-colors p-1"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-6 select-none">
              <div className="p-2 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500">
                <Bell size={18} />
              </div>
              <h3 className="font-heading text-lg text-text-dark">{t.alertsTitle}</h3>
            </div>

            {/* Alerts List */}
            <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
              {allAlerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <motion.div 
                    key={alert.id}
                    onClick={() => {
                      if (alert.isDynamic && alert.reply) {
                        setCurrentReply(alert.reply);
                        setShowAlertsModal(false);
                        navigateTo('reply');
                      }
                    }}
                    className={`flex gap-3 items-start p-3 rounded-2xl border transition-colors select-none ${
                      alert.isDynamic 
                        ? 'bg-pink-100/40 border-pink-200/30 hover:bg-pink-200/40 cursor-pointer shadow-pink' 
                        : 'bg-white/40 border-pink-200/20 hover:bg-white/60'
                    }`}
                    whileTap={alert.isDynamic ? { scale: 0.98 } : {}}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${alert.iconColor}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-body text-text-dark truncate mr-2">{alert.title}</span>
                        <span className="text-[9px] font-body text-text-soft shrink-0">{alert.time}</span>
                      </div>
                      <p className="text-[11px] font-body text-text-mid leading-relaxed mt-0.5 break-words">
                        {alert.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom info */}
            <p className="text-[10px] text-text-soft font-body text-center mt-6 tracking-wide select-none">
              {t.alertsFooter}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
