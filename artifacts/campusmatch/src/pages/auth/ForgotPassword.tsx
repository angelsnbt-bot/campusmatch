import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, KeyRound, ArrowRight, ShieldCheck, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Link } from 'wouter';
import LightPillar from '@/components/ui/LightPillar';
import OtpInput from '@/components/ui/OtpInput';

type Step = 'request' | 'verify' | 'reset' | 'done';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resetToken, setResetToken] = useState('');
  const [isError, setIsError] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const apiBase = (import.meta.env.VITE_API_URL || 'https://campusmatch-api.onrender.com') + '/api';

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error('Email not found');
      setStep('verify'); setCountdown(60); setOtp(Array(6).fill('')); setIsError(false);
      toast({ title: 'OTP Sent', description: 'Check your email for the verification code.' });
    } catch (err) {
      setIsError(true); setTimeout(() => setIsError(false), 500);
      toast({ title: 'Failed', description: 'Email not found in our system.', variant: 'destructive' });
    }
  };

  const handleVerifyOtp = async (otpString: string) => {
    setIsError(true); setOtpError(false);
    try {
      const res = await fetch(`${apiBase}/auth/verify-forgot-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp: otpString }) });
      if (!res.ok) throw new Error('Invalid OTP');
      const data = await res.json();
      setResetToken(data.resetToken); setStep('reset'); setIsError(false);
      toast({ title: 'OTP Verified', description: 'Set your new password.' });
    } catch (err) {
      setIsError(true); setOtpError(true);
      toast({ title: 'Verification Failed', description: 'Invalid or expired OTP. Please try again.', variant: 'destructive' });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(true);
    try {
      const res = await fetch(`${apiBase}/auth/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resetToken, newPassword }) });
      if (!res.ok) throw new Error('Failed');
      setStep('done'); setIsError(false);
      toast({ title: 'Password Reset', description: 'Your password has been updated!' });
    } catch {
      setIsError(true); setTimeout(() => setIsError(false), 500);
      toast({ title: 'Failed', description: 'Could not reset password.', variant: 'destructive' });
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch(`${apiBase}/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error('Failed');
      setCountdown(60); setOtp(Array(6).fill('')); setOtpError(false);
      toast({ title: 'OTP Resent', description: 'Check your email for the new code.' });
    } catch {
      toast({ title: 'Failed', description: 'Could not resend OTP. Try again.', variant: 'destructive' });
    }
  };

  const steps: Step[] = ['request', 'verify', 'reset', 'done'];

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0515 0%, #150a20 40%, #1a0f2e 100%)' }}>
      <div className="absolute inset-0 z-0"><LightPillar topColor="#f472b6" bottomColor="#a855f7" intensity={0.5} rotationSpeed={0.15} glowAmount={0.003} pillarWidth={3.0} pillarHeight={0.3} noiseIntensity={0.3} pillarRotation={10} interactive={false} mixBlendMode="screen" quality="medium" /></div>
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.25) 0%, transparent 70%)', top: '10%', left: '20%', filter: 'blur(80px)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)', bottom: '20%', right: '15%', filter: 'blur(60px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : { opacity: 1, y: 0 }}
        transition={isError ? { duration: 0.4 } : { type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-md glass-card p-8 rounded-2xl text-center overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500" />

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => {
            const active = steps.indexOf(step) === i;
            const done = steps.indexOf(step) > i;
            return (
              <React.Fragment key={s}>
                <motion.div animate={{ scale: active ? 1.2 : 1, backgroundColor: active ? '#ec4899' : done ? '#a855f7' : 'rgba(255,255,255,0.1)' }} className="w-2.5 h-2.5 rounded-full" />
                {i < steps.length - 1 && <div className={`w-6 h-[2px] ${done ? 'bg-purple-500' : 'bg-white/10'}`} />}
              </React.Fragment>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 'request' && (
            <motion.form key="request" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleRequestOtp}>
              <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-6 border border-pink-500/20 shadow-lg shadow-pink-500/10">
                <Mail className="w-8 h-8 text-pink-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-white/50 text-sm mb-8">Enter your email to receive a verification code.</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">Email</Label>
                  <div className="relative">
                    <Input type="email" placeholder="name.branch@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-premium h-12 pl-10 focus-visible:ring-pink-500/50" />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 h-12 rounded-xl shadow-lg shadow-pink-500/20 transition-all hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98]" disabled={false}>
                  <span className="flex items-center gap-2 justify-center">Send Code <ArrowRight className="w-4 h-4" /></span>
                </Button>
              </div>
            </motion.form>
          )}

          {step === 'verify' && (
            <motion.div key="verify" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-lg shadow-purple-500/10">
                <KeyRound className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Enter Code</h1>
              <p className="text-white/50 text-sm mb-8">Check <span className="text-pink-300">{email}</span> for the 6-digit code.</p>
              <div className={isError ? 'animate-[shake_0.5s_ease-in-out]' : ''}>
                <OtpInput value={otp} onChange={setOtp} onComplete={handleVerifyOtp} error={otpError} />
              </div>
              <div className="mt-6">
                <Button onClick={() => handleVerifyOtp(otp.join(''))} disabled={otp.join('').length < 6} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 h-12 rounded-xl shadow-lg shadow-pink-500/20 transition-all hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98]" type="button">
                  Verify
                </Button>
              </div>
              <div className="mt-4 text-sm text-white/50 flex items-center justify-center gap-2">
                <button onClick={handleResendOtp} disabled={countdown > 0} className="text-pink-300 hover:text-pink-200 transition-colors font-medium flex items-center gap-1 disabled:text-white/20 disabled:cursor-not-allowed">
                  <RotateCcw className="w-3.5 h-3.5" /> {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'reset' && (
            <motion.form key="reset" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleResetPassword}>
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-lg shadow-green-500/10">
                <ShieldCheck className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">New Password</h1>
              <p className="text-white/50 text-sm mb-8">Create a strong, new password.</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm">New Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className="input-premium h-12 pl-10 pr-10 focus-visible:ring-pink-500/50" />
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 h-12 rounded-xl shadow-lg shadow-pink-500/20 transition-all hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98]">
                  <span className="flex items-center gap-2 justify-center">Reset Password <ArrowRight className="w-4 h-4" /></span>
                </Button>
              </div>
            </motion.form>
          )}

          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/10">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h1 className="text-2xl font-bold text-white mb-2">All Done!</h1>
              <p className="text-white/50 text-sm mb-8">You can now sign in with your new password.</p>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 h-12 rounded-xl shadow-lg shadow-pink-500/20 transition-all hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98]">
                  <span className="flex items-center gap-2 justify-center">Go to Login <ArrowRight className="w-4 h-4" /></span>
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {step !== 'done' && (
          <div className="mt-6 text-sm text-white/50">
            <Link href="/login" className="text-pink-400 hover:text-pink-300 transition-colors">Back to Login</Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
