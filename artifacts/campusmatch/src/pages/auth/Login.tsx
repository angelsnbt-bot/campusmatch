import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useLogin } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { Link } from 'wouter';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const { setToken, user } = useAuth();
  const [location, setLocation] = useLocation();
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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : { opacity: 1, y: 0 }} transition={isError ? { duration: 0.4 } : { duration: 0.5 }} className="w-full max-w-md glass-card p-8 rounded-2xl relative overflow-hidden cm-card-elevate">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500" />
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#ec4899] flex items-center justify-center mb-4 shadow-lg shadow-pink-500/20">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit' }}>Welcome Back</h1>
          <p className="text-white/60 text-sm text-center" style={{ fontFamily: 'Inter' }}>Enter your credentials to access your campus.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80" style={{ fontFamily: 'Outfit' }}>College Email</Label>
            <Input id="email" type="email" placeholder="name.branch@vgu.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#ec4899]" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-white/80" style={{ fontFamily: 'Outfit' }}>Password</Label>
              <Link href="/forgot-password" className="text-xs text-pink-300 hover:text-pink-200 transition-colors" style={{ fontFamily: 'Outfit' }}>Forgot password?</Link>
            </div>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#ec4899]" />
          </div>
          <Button type="submit" className="w-full bg-[#ec4899] hover:bg-[#db2777] text-white border-0 py-6 mt-4 shadow-lg shadow-pink-500/25 cm-button-glow" style={{ fontFamily: 'Cabin', borderRadius: '10px' }} disabled={loginMutation.isPending}>
            {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-white/60" style={{ fontFamily: 'Outfit' }}>
          Don't have an account? <Link href="/register" className="text-pink-300 hover:text-pink-200 transition-colors">Apply for verification</Link>
        </div>
      </motion.div>
    </div>
  );
}
