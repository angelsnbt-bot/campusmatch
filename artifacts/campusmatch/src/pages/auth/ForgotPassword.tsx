import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Mail, Key, CheckCircle2, Lock, Eye, EyeOff, RefreshCw, Heart } from 'lucide-react';
import { Link } from 'wouter';
import {
  useForgotPasswordRequest,
  useVerifyForgotOtpCode,
  useResetPasswordSubmit,
} from '@workspace/api-client-react';

type Step = 'email' | 'otp' | 'reset' | 'done';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isError, setIsError] = useState(false);

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const sendOtpMutation = useForgotPasswordRequest();
  const verifyOtpMutation = useVerifyForgotOtpCode();
  const resetPasswordMutation = useResetPasswordSubmit();

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Autofocus first OTP box when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    sendOtpMutation.mutate(
      { data: { email } },
      {
        onSuccess: () => {
          setStep('otp');
          setCountdown(60);
          toast({ title: 'OTP Sent', description: 'Check your email for the 6-digit verification code.' });
        },
        onError: (err) => {
          toast({
            title: 'Request failed',
            description: (err?.data as any)?.error || err?.message || 'Failed to send OTP.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleVerifyOTP = async (otpString: string) => {
    setIsError(false);
    verifyOtpMutation.mutate(
      { data: { email, otp: otpString } },
      {
        onSuccess: (data) => {
          setResetToken(data.resetToken);
          setStep('reset');
          toast({ title: 'OTP Verified', description: 'You can now set a new password.' });
        },
        onError: (err) => {
          setIsError(true);
          setOtp(Array(6).fill(''));
          otpRefs.current[0]?.focus();
          toast({
            title: 'Verification failed',
            description: (err?.data as any)?.error || err?.message || 'Invalid or expired OTP.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (password.length < 8) {
      toast({ title: 'Password too short', description: 'Minimum 8 characters required.', variant: 'destructive' });
      return;
    }

    resetPasswordMutation.mutate(
      { data: { resetToken, password } },
      {
        onSuccess: () => {
          setStep('done');
          toast({ title: 'Password reset successful!', description: 'Redirecting to login...' });
          setTimeout(() => setLocation('/login'), 2000);
        },
        onError: (err) => {
          toast({
            title: 'Reset failed',
            description: (err?.data as any)?.error || err?.message || 'Failed to reset password.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleOTPChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) return;

    const newOtp = [...otp];
    newOtp[index] = cleaned[cleaned.length - 1];
    setOtp(newOtp);

    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    const completeOtp = newOtp.join('');
    if (completeOtp.length === 6 && index === 5) {
      handleVerifyOTP(completeOtp);
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const focusIdx = Math.min(pastedData.length, 5);
    otpRefs.current[focusIdx]?.focus();

    if (pastedData.length === 6) {
      handleVerifyOTP(pastedData);
    }
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    sendOtpMutation.mutate(
      { data: { email } },
      {
        onSuccess: () => {
          setCountdown(60);
          setOtp(Array(6).fill(''));
          otpRefs.current[0]?.focus();
          toast({ title: 'OTP Resent', description: 'Check your email for the new code.' });
        },
        onError: (err) => {
          toast({
            title: 'Failed to resend',
            description: (err?.data as any)?.error || err?.message || 'An error occurred.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === 'email' && 'Reset Password'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'reset' && 'Set New Password'}
            {step === 'done' && 'Reset Complete!'}
          </h1>
          <p className="text-white/60 text-sm text-center">
            {step === 'email' && "Enter your email and we'll send you a verification code."}
            {step === 'otp' && `Enter the 6-digit code sent to ${email}`}
            {step === 'reset' && 'Enter your new password below.'}
            {step === 'done' && 'Your password has been successfully updated.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.form
              key="email-step"
              onSubmit={handleSendOTP}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white border-0 py-6 mt-4 shadow-lg shadow-primary/25 rounded-xl font-semibold"
                disabled={sendOtpMutation.isPending}
              >
                {sendOtpMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
              </Button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <motion.div
                animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="flex justify-center gap-2"
              >
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(i, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(i, e)}
                    onPaste={handlePaste}
                    whileFocus={{ scale: 1.05 }}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl bg-white/5 border text-white transition-all focus:outline-none focus:ring-1 focus:ring-primary ${
                      isError
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-white/10 hover:border-white/20 focus:border-primary focus:bg-white/10'
                    }`}
                  />
                ))}
              </motion.div>

              <Button
                onClick={() => handleVerifyOTP(otp.join(''))}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white border-0 py-6 font-semibold shadow-lg shadow-primary/20 rounded-xl"
                disabled={verifyOtpMutation.isPending || otp.join('').length !== 6}
              >
                {verifyOtpMutation.isPending ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || sendOtpMutation.isPending}
                  className="text-sm text-primary/80 hover:text-primary disabled:text-white/30 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-1.5 mx-auto"
                >
                  {sendOtpMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'reset' && (
            <motion.form
              key="reset-step"
              onSubmit={handleResetPassword}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary pl-10"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/80">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary pl-10"
                  />
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white border-0 py-6 mt-4 shadow-lg shadow-primary/25 rounded-xl font-semibold"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </Button>
            </motion.form>
          )}

          {step === 'done' && (
            <motion.div
              key="done-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200, damping: 10 }}
                className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/10"
              >
                <motion.svg
                  className="w-10 h-10 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  />
                </motion.svg>
              </motion.div>
              <h1 className="text-xl font-bold text-white mb-2">Password Reset Successfully</h1>
              <p className="text-white/60 text-sm mb-6">Redirecting to login portal...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {step !== 'done' && (
          <div className="mt-6 text-center text-sm text-white/60">
            <Link href="/login" className="text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Back to Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
