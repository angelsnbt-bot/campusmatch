import React, { useRef, useCallback } from 'react';
import './BorderGlow.css';

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
  glowColor?: string;
  glowColors?: string[];
  intensity?: number;
}

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  borderRadius = 28,
  glowColor,
  glowColors = ['rgba(59,130,246,0.5)', 'rgba(139,92,246,0.5)', 'rgba(6,182,212,0.5)'],
  intensity = 0.6,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--glow-x', `${x}px`);
    el.style.setProperty('--glow-y', `${y}px`);
    el.style.setProperty('--glow-active', '1');
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--glow-active', '0');
  }, []);

  const color = glowColor || glowColors[0];

  return (
    <div
      ref={ref}
      className={`border-glow-wrapper ${className}`}
      style={{
        '--glow-color': color,
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-active': '0',
        '--glow-intensity': intensity,
        '--glow-radius': `${borderRadius}px`,
      } as React.CSSProperties}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="border-glow-edge" />
      <div className="border-glow-content" style={{ borderRadius }}>
        {children}
      </div>
    </div>
  );
};
