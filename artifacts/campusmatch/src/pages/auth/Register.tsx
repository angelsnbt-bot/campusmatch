import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useRegister } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, Zap, Mail, Phone, Lock, User, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import LightPillar from '@/components/ui/LightPillar';

const INTEREST_SUGGESTIONS = [
  'Coding', 'Music', 'Sports', 'Photography', 'Reading', 'Gaming', 'Art',
  'Travel', 'Cooking', 'Fitness', 'Movies', 'Debate', 'Robotics', 'Design',
  'Volunteering', 'Entrepreneurship', 'AI/ML', 'Web Dev', 'Dance', 'Hiking',
];

const YEARS = [1, 2, 3, 4, 5];

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [erpNumber, setErpNumber] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState<number>(1);
  const [photoUrl, setPhotoUrl] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setToken, user } = useAuth();
  const [, setLocation] = useLocation();
  const registerMutation = useRegister();
  const { toast } = useToast();

  useEffect(() => { if (user) setLocation('/dashboard'); }, [user, setLocation]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) => prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: 'File too large', description: 'Max 5MB allowed.', variant: 'destructive' }); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { toast({ title: 'Invalid file type', description: 'Only JPEG, PNG, WebP allowed.', variant: 'destructive' }); return; }
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('cm_token');
      const res = await fetch('/api/upload/profile-image', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setPhotoUrl(data.url);
    } catch { toast({ title: 'Upload failed', description: 'Could not upload photo.', variant: 'destructive' }); setPhotoPreview(''); }
  };

  const canProceedStep1 = name.trim() && email.trim() && phone.trim() && password.length >= 8;
  const canProceedStep2 = erpNumber.trim() && college.trim() && course.trim() && branch.trim();
  const canSubmit = canProceedStep1 && canProceedStep2 && interests.length > 0 && acceptTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    registerMutation.mutate({
      data: {
        name, email, phone, password, erpNumber, college, course, branch, year,
        photoUrl: photoUrl || `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23666" width="200" height="200"/><text x="50%" y="50%" fill="white" font-size="48" text-anchor="middle" dy=".35em">?</text></svg>')}`,
        interests, acceptTerms,
      },
    }, {
      onSuccess: (data) => { setToken(data.token); toast({ title: 'Account created', description: 'Please verify your email.' }); setLocation('/verify-otp'); },
      onError: (err) => { toast({ title: 'Registration failed', description: (err?.data as any)?.error || err?.message || 'Could not create account.', variant: 'destructive' }); },
    });
  };

  const stepIcons = [User, GraduationCap, Camera];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4" style={{ background: 'linear-gradient(135deg, #050510 0%, #0a0a1a 40%, #0d0d24 100%)' }}>
      <div className="absolute inset-0 z-0">
        <LightPillar topColor="#8b5cf6" bottomColor="#3b82f6" intensity={0.5} rotationSpeed={0.15} glowAmount={0.003} pillarWidth={3.0} pillarHeight={0.3} noiseIntensity={0.3} pillarRotation={-10} interactive={false} mixBlendMode="screen" quality="medium" />
      </div>
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', top: '15%', right: '15%', filter: 'blur(80px)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)', bottom: '15%', left: '10%', filter: 'blur(60px)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-lg mx-4">
        <div className="glass-card p-8 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="flex flex-col items-center mb-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/25">
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">Join CampusMatch</h1>
            <p className="text-white/50 text-sm text-center">Exclusively for verified students.</p>
          </div>

          {/* Google Sign In */}
          <button onClick={() => toast({ title: 'Google Sign Up', description: 'Google OAuth coming soon. Use email registration for now.' })}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-white/[0.06] border border-white/10 text-white font-medium text-sm hover:bg-white/[0.1] transition-all mb-4">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-white/30">or register with email</span></div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => {
              const Icon = stepIcons[s - 1];
              return (
                <React.Fragment key={s}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${s === step ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : s < step ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 text-white/30'}`}>
                    {s < step ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg> : <Icon className="w-4 h-4" />}
                  </div>
                  {s < 3 && <div className={`w-8 h-[2px] rounded-full transition-all ${s < step ? 'bg-blue-500/50' : 'bg-white/10'}`} />}
                </React.Fragment>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm font-medium">Full Name</Label>
                  <div className="relative"><Input placeholder="As per student ID" value={name} onChange={(e) => setName(e.target.value)} required className="input-premium h-12 pl-10" /><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm font-medium">College Email</Label>
                  <div className="relative"><Input type="email" placeholder="name.branch@vgu.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-premium h-12 pl-10" /><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm font-medium">Phone Number</Label>
                  <div className="relative"><Input type="tel" placeholder="+91" value={phone} onChange={(e) => setPhone(e.target.value)} required className="input-premium h-12 pl-10" /><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm font-medium">Password</Label>
                  <div className="relative"><Input type="password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="input-premium h-12 pl-10" /><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /></div>
                </div>
                <Button type="button" onClick={() => canProceedStep1 && setStep(2)} className="w-full btn-premium btn-primary h-12 text-sm font-semibold mt-2" disabled={!canProceedStep1}>
                  <span className="flex items-center gap-2">Next Step <ArrowRight className="w-4 h-4" /></span>
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm font-medium">ERP Number</Label>
                  <div className="relative"><Input placeholder="Your ERP enrollment number" value={erpNumber} onChange={(e) => setErpNumber(e.target.value)} required className="input-premium h-12 pl-10" /><GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm font-medium">College</Label>
                  <Input placeholder="e.g. VGU Jaipur" value={college} onChange={(e) => setCollege(e.target.value)} required className="input-premium h-12" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm font-medium">Course</Label>
                    <Input placeholder="e.g. B.Tech" value={course} onChange={(e) => setCourse(e.target.value)} required className="input-premium h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm font-medium">Branch</Label>
                    <Input placeholder="e.g. CSE" value={branch} onChange={(e) => setBranch(e.target.value)} required className="input-premium h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm font-medium">Year</Label>
                  <div className="flex gap-2">
                    {YEARS.map((y) => (
                      <button key={y} type="button" onClick={() => setYear(y)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${year === y ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                        {y}{y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 border-white/10 text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
                  <Button type="button" onClick={() => canProceedStep2 && setStep(3)} className="flex-1 h-12 btn-premium btn-primary" disabled={!canProceedStep2}><span className="flex items-center gap-2">Next Step <ArrowRight className="w-4 h-4" /></span></Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm font-medium">Profile Photo</Label>
                  <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 mx-auto rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors overflow-hidden">
                    {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-white/30" />}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
                  <p className="text-white/40 text-xs text-center">Click to upload (JPEG, PNG, WebP, max 5MB)</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-sm font-medium">Interests ({interests.length} selected)</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                    {INTEREST_SUGGESTIONS.map((interest) => (
                      <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${interests.includes(interest) ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                        {interests.includes(interest) && <X className="w-3 h-3 inline mr-1" />}{interest}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v === true)} className="mt-0.5 border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                  <Label htmlFor="terms" className="text-white/50 text-xs leading-relaxed cursor-pointer">
                    I accept the <a href="/terms" className="text-blue-400 hover:underline">Terms</a> and <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>. I confirm I am a current student.
                  </Label>
                </div>
                <div className="flex gap-3 mt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 border-white/10 text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
                  <Button type="submit" className="flex-1 h-12 btn-premium btn-primary" disabled={!canSubmit || registerMutation.isPending}>
                    {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-center text-sm text-white/50">
            Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Sign in</Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
