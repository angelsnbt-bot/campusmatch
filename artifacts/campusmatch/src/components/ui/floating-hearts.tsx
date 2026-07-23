import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; }>>([]);

  useEffect(() => {
    // Generate initial hearts
    const initialHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 15,
      size: 10 + Math.random() * 20,
    }));
    setHearts(initialHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-[-50px] opacity-0"
          initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: [-50, -1000],
            x: [0, Math.sin(heart.id) * 50, -Math.sin(heart.id) * 50],
            opacity: [0, 0.4, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          style={{ left: `${heart.left}%` }}
        >
          <Heart 
            className="text-primary/20 fill-primary/10" 
            style={{ width: heart.size, height: heart.size }} 
          />
        </motion.div>
      ))}
    </div>
  );
};
