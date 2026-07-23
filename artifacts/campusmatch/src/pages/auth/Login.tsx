import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useLogin } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import LightPillar from '@/components/ui/LightPillar';

type LoginMode = 'password' | 'otp';

export default function Login() {
  const [mode, setMode] = useState<LoginMode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isError, setIsError] = useState(false);
  const { setToken, user } = useAuth();
  const [_, setLocation] = useLocation();
  const loginMutation = useLogin();
  const { toast } = useToast();

  useEffect(() => { if (user) setLocation('/dashboard'); }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);
    loginMutation.mutate({ data: { email, password } }, {
      onSuccess: (data) => { setToken(data.token); toast({ title: 'Welcome back!' }); setLocation('/dashboard'); },
      onError: (err) => { setIsError(true); setTimeout(() => setIsError(false), 500); toast({ title: 'Login failed', description: (err?.data as any)?.error || 'Invalid credentials.', variant: 'destructive' }); }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #050510 0%, #0a0a1a 40%, #0d0d24 100%)' }}>
      <div className="absolute inset-0 z-0">
        <LightPillar topColor="#3b82f6" bottomColor="#8b5cf6" intensity={0.7} rotationSpeed={0.2} glowAmount={0.004} pillarWidth={3.5} pillarHeight={0.35} noiseIntensity={0.3} pillarRotation={15} interactive={false} mixBlendMode="screen" quality="high" />
      </div>
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', top: '10%', left: '20%', filter: 'blur(80px)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', bottom: '20%', right: '10%', filter: 'blur(60px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : { opacity: 1, y: 0, scale: 1 }}
        transition={isError ? { duration: 0.4 } : { type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="flex flex-col items-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
              <Zap className="w-7 h-7 text-white" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-white mb-1">Welcome Back</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/50 text-sm text-center">Sign in to your campus network</motion.p>
          </div>

          {/* Google Sign In */}
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            onClick={() => toast({ title: 'Google Sign In', description: 'Google OAuth coming soon. Use email login for now.' })}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-white/[0.06] border border-white/10 text-white font-medium text-sm hover:bg-white/[0.1] transition-all mb-4">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </motion.button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-white/30">or</span></div>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] mb-6">
            <button onClick={() => setMode('password')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'password' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/60'}`}>Password</button>
            <button onClick={() => setMode('otp')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'otp' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/60'}`}>Email OTP</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="space-y-2">
              <Label htmlFor="email" className="text-white/70 text-sm font-medium">College Email</Label>
              <div className="relative">
                <Input id="email" type="email" placeholder="name.branch@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-premium h-12 pl-10" />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              </div>
            </motion.div>

            {mode === 'password' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-white/70 text-sm font-medium">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="input-premium h-12 pl-10 pr-10" />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <div className="flex items-center gap-2 mb-4">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                <Label htmlFor="remember" className="text-white/50 text-sm cursor-pointer">Remember me</Label>
              </div>
              <Button type="submit" className="w-full btn-premium btn-primary h-12 text-sm font-semibold" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</div>
                ) : (
                  <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-center text-sm text-white/50">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Get Started</Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
