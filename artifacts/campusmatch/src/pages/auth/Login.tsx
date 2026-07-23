import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useLogin } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Heart, Loader2, Eye, EyeOff, Zap } from 'lucide-react';
import { Link } from 'wouter';
import LightPillar from '@/components/ui/LightPillar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      {/* LightPillar background */}
      <div className="absolute inset-0 z-0">
        <LightPillar
          topColor="#3b82f6"
          bottomColor="#8b5cf6"
          intensity={0.7}
          rotationSpeed={0.2}
          glowAmount={0.004}
          pillarWidth={3.5}
          pillarHeight={0.35}
          noiseIntensity={0.3}
          pillarRotation={15}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
      </div>

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', top: '10%', left: '20%', filter: 'blur(80px)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', bottom: '20%', right: '10%', filter: 'blur(60px)' }} />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : { opacity: 1, y: 0, scale: 1 }}
        transition={isError ? { duration: 0.4 } : { type: 'spring', stiffness: 300, damping: 25, duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 rounded-2xl overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25"
            >
              <Zap className="w-7 h-7 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-1"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/50 text-sm text-center"
            >
              Sign in to your campus network
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-white/70 text-sm font-medium">College Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name.branch@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-premium h-12"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-white/70 text-sm font-medium">Password</Label>
                <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-premium h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Button
                type="submit"
                className="w-full btn-premium btn-primary h-12 text-sm font-semibold mt-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full border-spinner" />
                    Signing in...
                  </div>
                ) : 'Sign In'}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm text-white/50"
          >
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
