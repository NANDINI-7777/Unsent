'use client';

import { motion } from 'framer-motion';
import { Mail, ExternalLink } from 'lucide-react';

export function AppFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-full py-10 px-6 border-t border-pink-200/50 text-center"
    >
      {/* Logo */}
      <div className="font-display italic text-2xl text-text-dark mb-4 select-none tracking-wide">
        unsent<span className="text-pink-500 font-bold font-sans">.</span>
      </div>

      {/* Creator */}
      <p className="font-body text-xs text-text-soft tracking-wide mb-4">
        crafted with 🤍 by <span className="font-semibold text-text-mid hover:text-pink-500 transition-colors">Nandini Soni</span>
      </p>

      {/* Links */}
      <div className="flex flex-col items-center gap-2 mb-5">
        <a
          href="mailto:nandinisoni7014@gmail.com"
          className="inline-flex items-center gap-2 text-text-mid text-sm font-body hover:text-pink-500 hover:underline underline-offset-4 decoration-pink-300 transition-colors"
        >
          <Mail size={14} className="text-pink-400" />
          nandinisoni7014@gmail.com
        </a>
        <a
          href="https://www.linkedin.com/in/nandini-soni-89817029a"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-text-mid text-sm font-body hover:text-pink-500 hover:underline underline-offset-4 decoration-pink-300 transition-colors"
        >
          <ExternalLink size={14} className="text-pink-400" />
          linkedin.com/in/nandini-soni-89817029a
        </a>
      </div>

      {/* Divider */}
      <div className="w-[120px] h-px border-t border-dashed border-pink-200 mx-auto mb-4" />

      {/* Dedication */}
      <p className="font-accent italic text-[13px] text-mauve">
        💗 Dedicated to My Patronus Charm{' '}
        <span className="text-pink-500 font-semibold whitespace-nowrap inline-block">(Pre-Yeah)</span>
      </p>
    </motion.footer>
  );
}
