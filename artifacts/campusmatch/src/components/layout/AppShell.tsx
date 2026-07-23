import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { FloatingHearts } from '@/components/ui/floating-hearts';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode; requireAuth?: boolean; requireVerification?: boolean }> = ({ 
  children, 
  requireAuth = false,
  requireVerification = false 
}) => {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !user) {
      setLocation('/login');
    }

    if (requireAuth && user && requireVerification) {
      // If user needs to verify email
      if (!user.emailVerified && location !== '/verify-otp') {
        setLocation('/verify-otp');
      } 
      // If user needs to verify ERP
      else if (user.emailVerified && user.verificationStatus === 'unverified' && location !== '/verify') {
        setLocation('/verify');
      }
      // If verification is pending, they can still access /verify where they see "Under Review" status
    }
  }, [user, isLoading, requireAuth, requireVerification, location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/30 selection:text-white">
      <FloatingHearts />
      <Navbar />
      <main className="relative z-10 pt-20">
        {children}
      </main>
    </div>
  );
};
