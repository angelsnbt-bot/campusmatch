import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingHearts } from '@/components/ui/floating-hearts';
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

    if (requireAuth && !user) {
      setLocation('/login');
    }

    if (requireAuth && user && requireVerification) {
      if (user.verificationStatus !== 'approved' && location !== '/verify') {
        setLocation('/verify');
      }
    }

    if (requireAuth && user && requireAdmin && user.role !== 'admin' && user.role !== 'super_admin') {
      setLocation('/dashboard');
    }
  }, [user, isLoading, requireAuth, requireVerification, requireAdmin, location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/30 selection:text-white flex flex-col">
      <FloatingHearts />
      <Navbar />
      <main className="relative z-10 pt-20 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
