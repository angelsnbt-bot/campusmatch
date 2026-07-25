import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ProfileCompletionNudgeProps {
  completionPercentage: number;
}

function getStorageKey(percentage: number): string {
  const bucket = Math.floor(percentage / 10) * 10;
  return `cm_nudge_dismissed_${bucket}`;
}

export default function ProfileCompletionNudge({ completionPercentage }: ProfileCompletionNudgeProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const key = getStorageKey(completionPercentage);
    const wasDismissed = localStorage.getItem(key) === '1';
    setDismissed(wasDismissed);
  }, [completionPercentage]);

  const handleDismiss = () => {
    const key = getStorageKey(completionPercentage);
    localStorage.setItem(key, '1');
    setDismissed(true);
  };

  if (completionPercentage >= 80) return null;
  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="glass-card rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 mb-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="flex-1 text-sm text-white/80 leading-snug">
            Your profile is{' '}
            <span className="font-semibold text-pink-400">{completionPercentage}%</span>{' '}
            complete — add a bio and interests to get better matches!
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/profile">
              <span className="btn-premium btn-primary text-xs px-4 py-2 rounded-lg cursor-pointer">
                Complete Profile
              </span>
            </Link>
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/40 hover:text-white/80"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-2.5 h-1 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
