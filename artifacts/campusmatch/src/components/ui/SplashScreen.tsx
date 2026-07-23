import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

const SPLASH_KEY = 'cm_splash_seen';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<string>('logo');

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) {
      onComplete();
      return;
    }
    const t1 = setTimeout(() => setPhase('text'), 400);
    const t2 = setTimeout(() => setPhase('progress'), 1000);
    const t3 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem(SPLASH_KEY, '1');
      onComplete();
    }, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #050510 0%, #0a0a1a 40%, #0d0d24 100%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', filter: 'blur(60px)', animation: 'splash-glow 3s ease-in-out infinite' }} />
            <div className="absolute w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)', top: '20%', left: '30%', filter: 'blur(50px)', animation: 'splash-glow 4s ease-in-out infinite 0.5s' }} />
          </div>

          {/* Logo icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.8 }}
            className="relative mb-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <motion.div
              className="absolute -inset-3 rounded-3xl border-2 border-blue-500/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={phase !== 'logo' ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
              Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Match</span>
            </h1>
            <p className="text-white/40 text-sm font-medium tracking-wide uppercase">
              Your Campus. Connected.
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={phase === 'progress' || phase === 'done' ? { opacity: 1 } : {}}
            className="mt-8 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.3, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
