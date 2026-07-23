import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode; requireAuth?: boolean; requireVerification?: boolean; requireAdmin?: boolean }> = ({
  children,
  requireAuth = false,
  requireVerification = false,
  requireAdmin = false
}) => {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (requireAuth && !user) setLocation('/login');
    if (requireAuth && user && requireVerification) {
      if (user.verificationStatus !== 'approved' && location !== '/verify') setLocation('/verify');
    }
    if (requireAuth && user && requireAdmin && user.role !== 'admin' && user.role !== 'super_admin') setLocation('/dashboard');
  }, [user, isLoading, requireAuth, requireVerification, requireAdmin, location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse-glow">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-white/30 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative noise-overlay">
      {/* Aurora background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.12] animate-aurora" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)', top: '-10%', left: '-5%', filter: 'blur(80px)' }} />
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08] animate-aurora-2" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)', top: '30%', right: '-10%', filter: 'blur(80px)' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] animate-aurora-3" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)', bottom: '-5%', left: '20%', filter: 'blur(80px)' }} />
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      <Navbar />
      <main className="relative z-10 pt-20 min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
};
