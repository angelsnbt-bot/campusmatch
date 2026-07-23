import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Lightning } from '@/components/ui/HeroOdyssey';

const SPLASH_KEY = 'cm_splash_seen';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<string>('logo');
  const [hue, setHue] = useState(280);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) {
      onComplete();
      return;
    }
    const t1 = setTimeout(() => setPhase('text'), 600);
    const t2 = setTimeout(() => setPhase('progress'), 1200);
    const t3 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem(SPLASH_KEY, '1');
      onComplete();
    }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  useEffect(() => {
    let animId: number;
    let start = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - start) / 1000;
      setHue(280 + Math.sin(elapsed * 0.3) * 40);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#050510' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Lightning background */}
          <div className="absolute inset-0 z-0">
            <Lightning
              hue={hue}
              xOffset={0}
              speed={1.4}
              intensity={0.5}
              size={2}
            />
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 z-10 bg-black/70" />

          {/* Glowing circle */}
          <div className="absolute z-10 top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-pink-500/15 to-purple-600/10 blur-3xl" />

          {/* Planet/sphere */}
          <div className="absolute z-10 top-[55%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] backdrop-blur-3xl rounded-full" style={{ background: 'radial-gradient(circle at 25% 90%, #1e386b 15%, #000000de 70%, #000000ed 100%)' }} />

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center">
            {/* Logo icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.8 }}
              className="relative mb-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <motion.div
                className="absolute -inset-3 rounded-3xl border-2 border-purple-500/30"
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
                Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Match</span>
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
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
