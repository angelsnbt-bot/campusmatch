import React from 'react';

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora gradient orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Primary blue orb */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 animate-aurora"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
            top: '-10%',
            left: '-5%',
            filter: 'blur(80px)',
          }}
        />
        {/* Purple orb */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 animate-aurora-2"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
            top: '30%',
            right: '-10%',
            filter: 'blur(80px)',
          }}
        />
        {/* Cyan accent orb */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10 animate-aurora-3"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
            bottom: '-5%',
            left: '20%',
            filter: 'blur(80px)',
          }}
        />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
