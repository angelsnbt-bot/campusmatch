import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useRegister } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { Link } from 'wouter';

export default function Register() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [erpNumber, setErpNumber] = React.useState('');
  const [college, setCollege] = React.useState('');
  const [course, setCourse] = React.useState('');
  const [branch, setBranch] = React.useState('');
  const [year, setYear] = React.useState(1);
  const [interests, setInterests] = React.useState<string[]>([]);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const { setToken, user } = useAuth();
  const [location, setLocation] = useLocation();
  const registerMutation = useRegister();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { data: { name, email, phone, password, erpNumber, college, course, branch, year, photoUrl: '', interests, acceptTerms } },
      {
        onSuccess: (data) => {
          setToken(data.token);
          toast({ title: 'Account created', description: 'Please verify your email.' });
          setLocation('/verify-otp');
        },
        onError: (err) => {
          toast({ 
            title: 'Registration failed', 
            description: (err?.data as any)?.error || err?.message || 'Could not create account.',
            variant: 'destructive'
          });
        }
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Join CampusMatch</h1>
          <p className="text-white/60 text-sm text-center">Exclusively for VGU students.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/80">Full Name</Label>
            <Input 
              id="name" 
              placeholder="As per student ID" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">College Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name.branch@vgu.ac.in" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white/80">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="+91" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="erpNumber" className="text-white/80">ERP Number</Label>
            <Input 
              id="erpNumber" 
              placeholder="Your ERP number"
              value={erpNumber}
              onChange={(e) => setErpNumber(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="college" className="text-white/80">College</Label>
            <Input 
              id="college" 
              placeholder="College name"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course" className="text-white/80">Course</Label>
            <Input 
              id="course" 
              placeholder="e.g. B.Tech"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch" className="text-white/80">Branch</Label>
            <Input 
              id="branch" 
              placeholder="e.g. CSE"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year" className="text-white/80">Year</Label>
            <Input 
              id="year" 
              type="number" 
              min={1} max={6}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
              className="rounded"
            />
            <Label htmlFor="acceptTerms" className="text-white/80 text-sm">I accept the terms and conditions</Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white border-0 py-6 mt-4 shadow-lg shadow-primary/25"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Apply"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-white/60">
          Already have an account? <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
