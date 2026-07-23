import React, { useEffect, useRef } from 'react';
import './GradientText.css';

interface GradientTextProps {
  children: React.ReactNode;
  colors?: string[];
  speed?: number;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors = ['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa'],
  speed = 3,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const gradient = `linear-gradient(90deg, ${colors.join(', ')})`;
    el.style.background = gradient;
    el.style.backgroundSize = `${colors.length * 100}% 100%`;
    el.style.webkitBackgroundClip = 'text';
    el.style.backgroundClip = 'text';

    let animId: number;
    let start = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - start) / 1000;
      const offset = (elapsed * speed) % colors.length;
      el.style.backgroundPosition = `${offset * 100}% 0`;
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [colors, speed]);

  return (
    <span ref={ref} className={`gradient-text ${className}`}>
      {children}
    </span>
  );
};
