import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export function LiveActivityIndicator() {
  const [count, setCount] = useState(247);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(200, Math.min(350, prev + delta));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]"
    >
      <div className="relative">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping opacity-75" />
      </div>
      <span className="text-[11px] font-medium text-white/40">
        <span className="text-white/60 font-semibold" style={{ fontFamily: "'Space Grotesk', monospace" }}>{count}+</span> online
      </span>
    </motion.div>
  );
}
