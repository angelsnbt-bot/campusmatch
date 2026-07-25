import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
        >
          <Link href="/register">
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 transition-all cursor-pointer">
              <span>Join CampusMatch</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white/50 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
