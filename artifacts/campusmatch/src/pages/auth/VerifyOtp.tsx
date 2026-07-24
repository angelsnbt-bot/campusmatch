import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useVerifyEmail, useResendOtp } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MailCheck, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetMeQueryKey } from '@workspace/api-client-react';
import LightPillar from '@/components/ui/LightPillar';
import OtpInput from '@/components/ui/OtpInput';

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const verifyEmail = useVerifyEmail();
  const resendOtp = useResendOtp();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) { setLocation('/login'); return; }
    if (user.emailVerified) { setLocation('/verify'); return; }
  }, [user, setLocation]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const triggerVerification = async (otpString: string) => {
    setIsError(false);
    verifyEmail.mutate({ data: { otp: otpString } }, {
      onSuccess: () => {
        setIsSuccess(true);
        toast({ title: 'Email verified!', description: 'Redirecting to onboarding...' });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setTimeout(() => { setLocation('/verify'); }, 1500);
      },
      onError: (err) => {
        setIsError(true);
        setOtp(Array(6).fill(''));
        toast({ title: 'Verification failed', description: (err?.data as any)?.error || err?.message || 'Invalid OTP.', variant: 'destructive' });
      }
    });
  };

  const handleResend = () => {
    if (countdown > 0) return;
    resendOtp.mutate(undefined, {
      onSuccess: () => { setCountdown(60); setOtp(Array(6).fill('')); toast({ title: 'OTP Resent', description: 'Check your email for the new code.' }); },
      onError: (err) => { toast({ title: 'Failed to resend', description: (err?.data as any)?.error || err?.message || 'An error occurred.', variant: 'destructive' }); }
    });
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0515 0%, #150a20 40%, #1a0f2e 100%)' }}>
      <div className="absolute inset-0 z-0"><LightPillar topColor="#f472b6" bottomColor="#a855f7" intensity={0.5} rotationSpeed={0.15} glowAmount={0.003} pillarWidth={3.0} pillarHeight={0.3} noiseIntensity={0.3} pillarRotation={10} interactive={false} mixBlendMode="screen" quality="medium" /></div>
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.25) 0%, transparent 70%)', top: '10%', left: '20%', filter: 'blur(80px)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)', bottom: '20%', right: '15%', filter: 'blur(60px)' }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md glass-card p-8 rounded-2xl text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500" />

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div key="otp-inputs" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-6 border border-pink-500/20 shadow-lg shadow-pink-500/10">
                <MailCheck className="w-8 h-8 text-pink-400" />
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-2">Check your email</motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-white/60 text-sm mb-8 leading-relaxed">
                We've sent a 6-digit code to <span className="text-pink-300 font-medium">{user.email}</span>. Please verify it below.
              </motion.p>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 20 }}>
                <OtpInput value={otp} onChange={setOtp} onComplete={triggerVerification} error={isError} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
                <Button onClick={() => triggerVerification(otp.join(''))} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 py-6 font-semibold shadow-lg shadow-pink-500/20 rounded-xl transition-all hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98]" disabled={verifyEmail.isPending || otp.join('').length !== 6}>
                  {verifyEmail.isPending ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</span> : "Verify Email"}
                </Button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="mt-8 text-sm text-white/50 flex items-center justify-center gap-2">
                <span>Didn't receive the code?</span>
                <button onClick={handleResend} disabled={countdown > 0 || resendOtp.isPending} className="text-pink-300 hover:text-pink-200 transition-colors font-medium flex items-center gap-1 disabled:text-white/20 disabled:cursor-not-allowed">
                  {resendOtp.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : countdown > 0 ? `Resend in ${countdown}s` : <><RefreshCw className="w-3.5 h-3.5" /> Resend OTP</>}
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 100, damping: 15 }} className="py-6 flex flex-col items-center justify-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2, stiffness: 200, damping: 10 }} className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/10">
                <motion.svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.4 }} />
                </motion.svg>
              </motion.div>
              <h1 className="text-2xl font-bold text-white mb-2">Verification Successful</h1>
              <p className="text-white/60 text-sm">Redirecting to onboarding portal...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
