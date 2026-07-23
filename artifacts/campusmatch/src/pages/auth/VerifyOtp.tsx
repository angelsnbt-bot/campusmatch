import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useVerifyEmail, useResendOtp } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MailCheck, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetMeQueryKey } from '@workspace/api-client-react';

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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!user) { setLocation('/login'); return; }
    if (user.emailVerified) { setLocation('/verify'); return; }
  }, [user, setLocation]);

  useEffect(() => { setTimeout(() => { inputRefs.current[0]?.focus(); }, 100); }, []);

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
        inputRefs.current[0]?.focus();
        toast({ title: 'Verification failed', description: (err?.data as any)?.error || err?.message || 'Invalid OTP.', variant: 'destructive' });
      }
    });
  };

  const handleInputChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) return;
    const newOtp = [...otp];
    newOtp[index] = cleaned[cleaned.length - 1];
    setOtp(newOtp);
    if (index < 5) inputRefs.current[index + 1]?.focus();
    const completeOtp = newOtp.join('');
    if (completeOtp.length === 6 && index === 5) triggerVerification(completeOtp);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) { newOtp[index] = ''; setOtp(newOtp); }
      else if (index > 0) { newOtp[index - 1] = ''; setOtp(newOtp); inputRefs.current[index - 1]?.focus(); }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) newOtp[i] = pastedData[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    if (pastedData.length === 6) triggerVerification(pastedData);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    resendOtp.mutate(undefined, {
      onSuccess: () => { setCountdown(60); setOtp(Array(6).fill('')); inputRefs.current[0]?.focus(); toast({ title: 'OTP Resent', description: 'Check your email for the new code.' }); },
      onError: (err) => { toast({ title: 'Failed to resend', description: (err?.data as any)?.error || err?.message || 'An error occurred.', variant: 'destructive' }); }
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md card-premium p-8 rounded-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div key="otp-inputs" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <MailCheck className="w-8 h-8 text-blue-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">
                We've sent a 6-digit code to <span className="text-white font-medium">{user.email}</span>. Please verify it below.
              </p>

              <motion.div animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}} transition={{ duration: 0.5 }} className="flex justify-center gap-2 mb-8">
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    whileFocus={{ scale: 1.05 }}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl bg-white/5 border text-white transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${isError ? 'border-red-500 bg-red-500/5' : 'border-white/10 hover:border-white/20 focus:border-blue-500 focus:bg-white/10'}`}
                  />
                ))}
              </motion.div>
              
              <Button onClick={() => triggerVerification(otp.join(''))} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 py-6 font-semibold shadow-lg shadow-blue-500/20 rounded-xl" disabled={verifyEmail.isPending || otp.join('').length !== 6}>
                {verifyEmail.isPending ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</span> : "Verify Email"}
              </Button>

              <div className="mt-8 text-sm text-white/50 flex items-center justify-center gap-2">
                <span>Didn't receive the code?</span>
                <button onClick={handleResend} disabled={countdown > 0 || resendOtp.isPending} className="text-blue-300 hover:text-blue-200 transition-colors font-medium flex items-center gap-1 disabled:text-white/20 disabled:cursor-not-allowed">
                  {resendOtp.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : countdown > 0 ? `Resend in ${countdown}s` : <><RefreshCw className="w-3.5 h-3.5" /> Resend OTP</>}
                </button>
              </div>
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
