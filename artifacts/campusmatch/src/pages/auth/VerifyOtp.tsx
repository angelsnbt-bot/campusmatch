import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useVerifyEmail, useResendOtp } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Loader2, MailCheck } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetMeQueryKey } from '@workspace/api-client-react';

export default function VerifyOtp() {
  const [otp, setOtp] = React.useState('');
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const verifyEmail = useVerifyEmail();
  const resendOtp = useResendOtp();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!user) {
    setLocation('/login');
    return null;
  }

  if (user.emailVerified) {
    setLocation('/verify');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'OTP must be 6 digits.', variant: 'destructive' });
      return;
    }
    
    verifyEmail.mutate(
      { data: { otp } },
      {
        onSuccess: () => {
          toast({ title: 'Email verified!', description: 'You can now proceed to ERP verification.' });
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          setLocation('/verify');
        },
        onError: (err) => {
          toast({ 
            title: 'Verification failed', 
            description: (err?.data as any)?.error || err?.message || 'Invalid OTP.',
            variant: 'destructive'
          });
        }
      }
    );
  };

  const handleResend = () => {
    resendOtp.mutate(undefined, {
      onSuccess: () => {
        toast({ title: 'OTP Resent', description: 'Check your email for the new code.' });
      },
      onError: (err) => {
        toast({ title: 'Failed to resend', description: (err?.data as any)?.error || err?.message || 'An error occurred.', variant: 'destructive' });
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 rounded-2xl relative overflow-hidden text-center"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <MailCheck className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-white/60 text-sm mb-8">
          We've sent a 6-digit code to <strong className="text-white">{user.email}</strong>. 
          Enter it below to verify your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <Input 
              type="text" 
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="text-center text-3xl tracking-[0.5em] font-mono h-16 bg-white/5 border-white/20 text-white w-48 focus-visible:ring-primary"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-white hover:bg-white/90 text-black border-0 py-6"
            disabled={verifyEmail.isPending || otp.length !== 6}
          >
            {verifyEmail.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Email"}
          </Button>
        </form>

        <div className="mt-8 text-sm text-white/60">
          Didn't receive the code?{' '}
          <button 
            onClick={handleResend}
            disabled={resendOtp.isPending}
            className="text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            {resendOtp.isPending ? "Resending..." : "Click to resend"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
