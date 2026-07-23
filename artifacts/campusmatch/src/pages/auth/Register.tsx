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
import { Heart, Loader2, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

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

  useEffect(() => {
    if (user) setLocation('/dashboard');
  }, [user, setLocation]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 5MB allowed.', variant: 'destructive' });
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({ title: 'Invalid file type', description: 'Only JPEG, PNG, WebP allowed.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('cm_token');
      const res = await fetch('/api/upload/profile-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setPhotoUrl(data.url);
    } catch {
      toast({ title: 'Upload failed', description: 'Could not upload photo.', variant: 'destructive' });
      setPhotoPreview('');
    }
  };

  const canProceedStep1 = name.trim() && email.trim() && phone.trim() && password.length >= 8;
  const canProceedStep2 = erpNumber.trim() && college.trim() && course.trim() && branch.trim();
  const canSubmit = canProceedStep1 && canProceedStep2 && interests.length > 0 && acceptTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    registerMutation.mutate(
      {
        data: {
          name, email, phone, password, erpNumber, college, course, branch, year,
          photoUrl: photoUrl || `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23666" width="200" height="200"/><text x="50%" y="50%" fill="white" font-size="48" text-anchor="middle" dy=".35em">?</text></svg>')}`,
          interests, acceptTerms,
        },
      },
      {
        onSuccess: (data) => {
          setToken(data.token);
          toast({ title: 'Account created', description: 'Please verify your email.' });
          setLocation('/verify-otp');
        },
        onError: (err) => {
          toast({ title: 'Registration failed', description: (err?.data as any)?.error || err?.message || 'Could not create account.', variant: 'destructive' });
        },
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg card-premium p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Join CampusMatch</h1>
          <p className="text-white/60 text-sm text-center">Exclusively for VGU students.</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? 'w-8 bg-gradient-to-r from-blue-500 to-indigo-600' : s < step ? 'w-4 bg-blue-500/50' : 'w-4 bg-white/20'}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/80">Full Name *</Label>
                <Input id="name" placeholder="As per student ID" value={name} onChange={(e) => setName(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">College Email *</Label>
                <Input id="email" type="email" placeholder="name.branch@vgu.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/80">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="+91" value={phone} onChange={(e) => setPhone(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Password *</Label>
                <Input id="password" type="password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500" />
              </div>
              <Button type="button" onClick={() => canProceedStep1 && setStep(2)} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 py-6 mt-4 shadow-lg shadow-blue-500/25" disabled={!canProceedStep1}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="erp" className="text-white/80">ERP Number *</Label>
                <Input id="erp" placeholder="Your ERP enrollment number" value={erpNumber} onChange={(e) => setErpNumber(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college" className="text-white/80">College *</Label>
                <Input id="college" placeholder="e.g. VGU Jaipur" value={college} onChange={(e) => setCollege(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course" className="text-white/80">Course *</Label>
                <Input id="course" placeholder="e.g. B.Tech, MBA, BCA" value={course} onChange={(e) => setCourse(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-white/80">Branch *</Label>
                <Input id="branch" placeholder="e.g. CSE, ECE, ME" value={branch} onChange={(e) => setBranch(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Year *</Label>
                <div className="flex gap-2">
                  {YEARS.map((y) => (
                    <button key={y} type="button" onClick={() => setYear(y)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${year === y ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                      {y}{y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 border-white/10 text-white hover:bg-white/10">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button type="button" onClick={() => canProceedStep2 && setStep(3)} className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0" disabled={!canProceedStep2}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Profile Photo</Label>
                <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 mx-auto rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-white/30" />
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
                <p className="text-white/40 text-xs text-center">Click to upload (JPEG, PNG, WebP, max 5MB)</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Interests * ({interests.length} selected)</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {INTEREST_SUGGESTIONS.map((interest) => (
                    <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${interests.includes(interest) ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                      {interests.includes(interest) && <X className="w-3 h-3 inline mr-1" />}
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v === true)} className="mt-0.5 border-white/20 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600" />
                <Label htmlFor="terms" className="text-white/60 text-xs leading-relaxed cursor-pointer">
                  I accept the <a href="/terms" target="_blank" className="text-blue-300 hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-blue-300 hover:underline">Privacy Policy</a>. I confirm I am a current VGU student and the information provided is accurate.
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 border-white/10 text-white hover:bg-white/10">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0" disabled={!canSubmit || registerMutation.isPending}>
                  {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                </Button>
              </div>
            </motion.div>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-white/60">
          Already have an account? <Link href="/login" className="text-blue-300 hover:text-blue-200 transition-colors">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
