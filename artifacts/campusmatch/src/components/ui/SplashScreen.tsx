import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

const SPLASH_KEY = 'cm_splash_seen';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'text' | 'done'>('logo');

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) {
      onComplete();
      return;
    }
    const t1 = setTimeout(() => setPhase('text'), 400);
    const t2 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem(SPLASH_KEY, '1');
      onComplete();
    }, 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#0f0515' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-pink-500/15 to-purple-600/10 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.5 }}
              className="relative mb-6"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <motion.div
                className="absolute -inset-2 rounded-2xl border border-pink-500/30"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={phase !== 'logo' ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
                Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Match</span>
              </h1>
              <p className="text-white/40 text-xs font-medium tracking-wide uppercase">
                Your Campus. Connected.
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase === 'text' ? { opacity: 1 } : {}}
              className="mt-6 w-32 h-[2px] bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
