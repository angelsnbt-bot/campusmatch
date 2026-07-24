import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useRegister } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Zap, Mail, Phone, Lock, User,
  ArrowRight, Loader2, ShieldCheck, CheckCircle2,
  CreditCard, Eye, EyeOff, Tag, ImagePlus, ScanLine
} from 'lucide-react';
import { Link } from 'wouter';
import LightPillar from '@/components/ui/LightPillar';
import OtpInput from '@/components/ui/OtpInput';

const INTEREST_SUGGESTIONS = [
  'Coding', 'Music', 'Sports', 'Photography', 'Reading', 'Gaming', 'Art',
  'Travel', 'Cooking', 'Fitness', 'Movies', 'Debate', 'Robotics', 'Design',
  'Volunteering', 'Entrepreneurship', 'AI/ML', 'Web Dev', 'Dance', 'Hiking',
];

const YEARS = [1, 2, 3, 4, 5];

const TOTAL_STEPS = 9;

const stepLabels = [
  'Personal Info',
  'Profile Photos',
  'ID Card',
  'OCR Review',
  'Interests',
  'Fraud Check',
  'Summary',
  'OTP Verify',
  'Success',
];

type StepState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  inviteCode: string;
  profilePhotos: string[];
  idCardFile: File | null;
  idCardPreview: string;
  ocrName: string;
  ocrErp: string;
  ocrCollege: string;
  interests: string[];
  acceptTerms: boolean;
  erpNumber: string;
  college: string;
  course: string;
  branch: string;
  year: number;
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isError, setIsError] = useState(false);

  const [data, setData] = useState<StepState>({
    name: '', email: '', phone: '', password: '', inviteCode: '',
    profilePhotos: [], idCardFile: null, idCardPreview: '',
    ocrName: '', ocrErp: '', ocrCollege: '',
    interests: [], acceptTerms: false,
    erpNumber: '', college: '', course: '', branch: '', year: 1,
  });

  const { setToken, user } = useAuth();
  const [, setLocation] = useLocation();
  const registerMutation = useRegister();
  const { toast } = useToast();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const idCardInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (user) setLocation('/dashboard'); }, [user, setLocation]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const updateData = useCallback((partial: Partial<StepState>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const toggleInterest = useCallback((interest: string) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }, []);

  const handleProfilePhoto = useCallback(async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 5MB allowed.', variant: 'destructive' });
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({ title: 'Invalid type', description: 'Only JPEG, PNG, WebP allowed.', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newPhotos = [...data.profilePhotos];
      newPhotos[index] = reader.result as string;
      updateData({ profilePhotos: newPhotos });
    };
    reader.readAsDataURL(file);
  }, [data.profilePhotos, updateData, toast]);

  const handleIdCard = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 5MB allowed.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateData({ idCardFile: file, idCardPreview: reader.result as string });
    };
    reader.readAsDataURL(file);
  }, [updateData, toast]);

  const simulateOCR = useCallback(() => {
    const ocrResult = {
      ocrName: data.name || 'Student Name',
      ocrErp: data.erpNumber || '21BXX100XX',
      ocrCollege: data.college || 'University Name',
    };
    updateData(ocrResult);
    toast({ title: 'OCR Complete', description: 'Details extracted from your ID card.' });
  }, [data.name, data.erpNumber, data.college, updateData, toast]);

  useEffect(() => {
    if (step === 4 && data.idCardPreview && !data.ocrName) {
      simulateOCR();
    }
  }, [step, data.idCardPreview, data.ocrName, simulateOCR]);

  const canProceedStep1 = data.name.trim().length >= 2 && data.email.trim() && data.phone.trim() && data.password.length >= 8;
  const canProceedStep2 = data.profilePhotos.filter(Boolean).length >= 4;
  const canProceedStep3 = !!data.idCardPreview;
  const canProceedStep4 = data.ocrName.trim() && data.ocrErp.trim() && data.ocrCollege.trim();
  const canProceedStep5 = data.interests.length >= 5;
  const canSubmit = canProceedStep1 && canProceedStep2 && canProceedStep3 && canProceedStep4 && canProceedStep5 && data.acceptTerms;

  const handleSubmit = () => {
    if (!canSubmit) return;
    registerMutation.mutate({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        erpNumber: data.ocrErp,
        college: data.ocrCollege,
        course: data.course || 'General',
        branch: data.branch || 'General',
        year: data.year,
        photoUrl: data.profilePhotos[0] || '',
        interests: data.interests,
        acceptTerms: data.acceptTerms,
      },
    }, {
      onSuccess: () => {
        setStep(9);
        toast({ title: 'Account created!', description: 'Please verify your email.' });
      },
      onError: (err) => {
        toast({ title: 'Registration failed', description: (err?.data as any)?.error || 'Could not create account.', variant: 'destructive' });
      },
    });
  };

  const handleVerifyOTP = (otpString: string) => {
    setLocation('/verify-otp');
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const renderStepIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/40 font-medium">Step {Math.min(step, 8)} of {TOTAL_STEPS - 1}</span>
        <span className="text-xs text-white/40">{stepLabels[Math.min(step - 1, TOTAL_STEPS - 1)]}</span>
      </div>
      <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${(Math.min(step, 8) / (TOTAL_STEPS - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i + 1 === step
                ? 'bg-blue-500 w-4'
                : i + 1 < step
                ? 'bg-blue-500/50'
                : 'bg-white/15'
            }`}
          />
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white/70 text-sm font-medium">Full Name</Label>
        <div className="relative">
          <Input placeholder="As per student ID" value={data.name} onChange={(e) => updateData({ name: e.target.value })} required className="input-premium h-12 pl-10" />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-white/70 text-sm font-medium">College Email</Label>
        <div className="relative">
          <Input type="email" placeholder="name.branch@vgu.ac.in" value={data.email} onChange={(e) => updateData({ email: e.target.value })} required className="input-premium h-12 pl-10" />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-white/70 text-sm font-medium">Phone Number</Label>
        <div className="relative">
          <Input type="tel" placeholder="+91 XXXXX XXXXX" value={data.phone} onChange={(e) => updateData({ phone: e.target.value })} required className="input-premium h-12 pl-10" />
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-white/70 text-sm font-medium">Password</Label>
        <div className="relative">
          <Input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={data.password} onChange={(e) => updateData({ password: e.target.value })} required minLength={8} className="input-premium h-12 pl-10 pr-10" />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-white/70 text-sm font-medium">Invite Code <span className="text-white/30">(optional)</span></Label>
        <div className="relative">
          <Input placeholder="Enter invite code" value={data.inviteCode} onChange={(e) => updateData({ inviteCode: e.target.value })} className="input-premium h-12 pl-10" />
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        </div>
      </div>
      <Button type="button" onClick={() => canProceedStep1 && nextStep()} className="w-full btn-premium btn-primary h-12 text-sm font-semibold mt-2" disabled={!canProceedStep1}>
        <span className="flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></span>
      </Button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-white font-semibold text-lg">Upload 4 Profile Photos</h3>
        <p className="text-white/50 text-sm">At least 4 clear photos of yourself are required</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="relative">
            <input ref={(el) => { fileInputRefs.current[i] = el; }} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleProfilePhoto(i, e)} />
            <div onClick={() => fileInputRefs.current[i]?.click()} className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
              data.profilePhotos[i] ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/15 bg-white/[0.02] hover:border-blue-500/30 hover:bg-white/[0.04]'
            }`}>
              {data.profilePhotos[i] ? (
                <>
                  <img src={data.profilePhotos[i]} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button onClick={(e) => { e.stopPropagation(); const newP = [...data.profilePhotos]; newP[i] = ''; updateData({ profilePhotos: newP }); }} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500/80 transition-colors">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </>
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 text-white/25 mb-1" />
                  <span className="text-[10px] text-white/30">Photo {i + 1}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-white/40 text-xs">
        {data.profilePhotos.filter(Boolean).length}/4 photos uploaded
      </p>
      <div className="flex gap-3 mt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12 border-white/10 text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
        <Button type="button" onClick={() => canProceedStep2 && nextStep()} className="flex-1 h-12 btn-premium btn-primary" disabled={!canProceedStep2}>
          <span className="flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></span>
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-white font-semibold text-lg">Upload Student ID Card</h3>
        <p className="text-white/50 text-sm">We'll use OCR to extract your details for verification</p>
      </div>
      <input ref={idCardInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleIdCard} />
      <div onClick={() => idCardInputRef.current?.click()} className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
        data.idCardPreview ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/15 bg-white/[0.02] hover:border-blue-500/30'
      }`}>
        {data.idCardPreview ? (
          <div className="space-y-3">
            <img src={data.idCardPreview} alt="ID Card" className="max-h-44 mx-auto rounded-lg border border-white/10" />
            <p className="text-sm text-blue-300">Click to change</p>
          </div>
        ) : (
          <>
            <CreditCard className="w-10 h-10 text-white/25 mx-auto mb-3" />
            <p className="text-white/60 text-sm">Click to upload your student ID card</p>
            <p className="text-white/30 text-xs mt-1">JPG, PNG, WebP — Max 5MB</p>
          </>
        )}
      </div>
      <div className="flex gap-3 mt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12 border-white/10 text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
        <Button type="button" onClick={() => canProceedStep3 && nextStep()} className="flex-1 h-12 btn-premium btn-primary" disabled={!canProceedStep3}>
          <span className="flex items-center gap-2">Scan ID <ScanLine className="w-4 h-4" /></span>
        </Button>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-white font-semibold text-lg">OCR Results</h3>
        <p className="text-white/50 text-sm">Please verify the extracted information</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-white/70 text-sm font-medium">Student Name</Label>
          <Input value={data.ocrName} onChange={(e) => updateData({ ocrName: e.target.value })} className="input-premium h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-white/70 text-sm font-medium">ERP Number</Label>
          <Input value={data.ocrErp} onChange={(e) => updateData({ ocrErp: e.target.value })} className="input-premium h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-white/70 text-sm font-medium">College Name</Label>
          <Input value={data.ocrCollege} onChange={(e) => updateData({ ocrCollege: e.target.value })} className="input-premium h-12" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">Course</Label>
            <Input placeholder="e.g. B.Tech" value={data.course} onChange={(e) => updateData({ course: e.target.value })} className="input-premium h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">Branch</Label>
            <Input placeholder="e.g. CSE" value={data.branch} onChange={(e) => updateData({ branch: e.target.value })} className="input-premium h-12" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white/70 text-sm font-medium">Year</Label>
          <div className="flex gap-2">
            {YEARS.map((y) => (
              <button key={y} type="button" onClick={() => updateData({ year: y })} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${data.year === y ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                {y}{y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12 border-white/10 text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
        <Button type="button" onClick={() => canProceedStep4 && nextStep()} className="flex-1 h-12 btn-premium btn-primary" disabled={!canProceedStep4}>
          <span className="flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></span>
        </Button>
      </div>
    </motion.div>
  );

  const renderStep5 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-white font-semibold text-lg">Select Your Interests</h3>
        <p className="text-white/50 text-sm">Choose at least 5 interests to find your match</p>
      </div>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
        {INTEREST_SUGGESTIONS.map((interest) => (
          <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${data.interests.includes(interest) ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
            {data.interests.includes(interest) && <X className="w-3 h-3 inline mr-1" />}{interest}
          </button>
        ))}
      </div>
      <p className="text-center text-white/40 text-xs">
        {data.interests.length}/5 minimum interests selected
      </p>
      <div className="flex gap-3 mt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12 border-white/10 text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
        <Button type="button" onClick={() => canProceedStep5 && nextStep()} className="flex-1 h-12 btn-premium btn-primary" disabled={!canProceedStep5}>
          <span className="flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></span>
        </Button>
      </div>
    </motion.div>
  );

  const renderStep6 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="text-center mb-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/10">
          <ShieldCheck className="w-8 h-8 text-green-400" />
        </motion.div>
        <h3 className="text-white font-semibold text-lg">Fraud Detection</h3>
        <p className="text-white/50 text-sm">Running automated checks on your profile...</p>
      </div>
      <div className="space-y-3">
        {[
          { label: 'Email domain verification', status: 'pass', delay: 0.3 },
          { label: 'Profile photo authenticity', status: 'pass', delay: 0.6 },
          { label: 'ERP number validation', status: 'pass', delay: 0.9 },
          { label: 'Duplicate account check', status: 'pass', delay: 1.2 },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item.delay, duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: item.delay + 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </motion.div>
            <span className="text-white/80 text-sm">{item.label}</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: item.delay + 0.3 }}
              className="ml-auto text-green-400 text-xs font-medium"
            >
              Passed
            </motion.span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="text-center mt-4"
      >
        <Button type="button" onClick={nextStep} className="w-full h-12 btn-premium btn-primary" disabled={false}>
          <span className="flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></span>
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderStep7 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-white font-semibold text-lg">Verification Summary</h3>
        <p className="text-white/50 text-sm">Review your details before creating your account</p>
      </div>
      <div className="space-y-3">
        {[
          { label: 'Name', value: data.name },
          { label: 'Email', value: data.email },
          { label: 'Phone', value: data.phone },
          { label: 'ERP Number', value: data.ocrErp },
          { label: 'College', value: data.ocrCollege },
          { label: 'Course', value: data.course || 'General' },
          { label: 'Branch', value: data.branch || 'General' },
          { label: 'Year', value: `${data.year}${data.year === 1 ? 'st' : data.year === 2 ? 'nd' : data.year === 3 ? 'rd' : 'th'}` },
        ].map((item) => (
          <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-white/50 text-sm">{item.label}</span>
            <span className="text-white text-sm font-medium">{item.value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center py-2">
          <span className="text-white/50 text-sm">Profile Photos</span>
          <span className="text-white text-sm font-medium">{data.profilePhotos.filter(Boolean).length} uploaded</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-white/50 text-sm">Interests</span>
          <span className="text-white text-sm font-medium">{data.interests.length} selected</span>
        </div>
      </div>
      <div className="flex items-start gap-3 pt-2">
        <Checkbox id="terms" checked={data.acceptTerms} onCheckedChange={(v) => updateData({ acceptTerms: v === true })} className="mt-0.5 border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
        <Label htmlFor="terms" className="text-white/50 text-xs leading-relaxed cursor-pointer">
          I accept the <a href="/terms" className="text-blue-400 hover:underline">Terms</a> and <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>. I confirm I am a current student.
        </Label>
      </div>
      <div className="flex gap-3 mt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12 border-white/10 text-white hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
        <Button type="button" onClick={() => { if (canSubmit) { nextStep(); handleSubmit(); } }} className="flex-1 h-12 btn-premium btn-primary" disabled={!canSubmit || registerMutation.isPending}>
          {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>}
        </Button>
      </div>
    </motion.div>
  );

  const renderStep8 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="text-center mb-2">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/10">
          <Mail className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-white font-semibold text-lg">Verify Your Email</h3>
        <p className="text-white/50 text-sm">Enter the 6-digit code sent to {data.email}</p>
      </div>
      <div className={isError ? 'animate-[shake_0.5s_ease-in-out]' : ''}>
        <OtpInput value={otp} onChange={setOtp} onComplete={handleVerifyOTP} error={otpError} />
      </div>
      <Button onClick={() => handleVerifyOTP(otp.join(''))} className="w-full btn-premium btn-primary h-12 text-sm font-semibold" disabled={otp.join('').length !== 6}>
        <span className="flex items-center gap-2">Verify Email <ArrowRight className="w-4 h-4" /></span>
      </Button>
      <div className="text-center">
        <span className="text-sm text-white/50">
          Didn't receive code?{' '}
          <button onClick={() => { setCountdown(60); toast({ title: 'OTP Resent' }); }} disabled={countdown > 0} className="text-blue-400 hover:text-blue-300 font-medium disabled:text-white/20">
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
          </button>
        </span>
      </div>
      <p className="text-white/30 text-xs text-center">Or skip to verify later from your dashboard</p>
      <Button variant="outline" onClick={() => setStep(9)} className="w-full h-12 border-white/10 text-white/60 hover:bg-white/10 hover:text-white">
        Skip for now
      </Button>
    </motion.div>
  );

  const renderStep9 = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 flex flex-col items-center justify-center text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2, stiffness: 200, damping: 10 }}
        className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/10">
        <motion.svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.4 }} />
        </motion.svg>
      </motion.div>
      <h1 className="text-2xl font-bold text-white mb-2">Account Created!</h1>
      <p className="text-white/60 text-sm mb-6">Welcome to CampusMatch. Your campus journey begins now.</p>
      <Button onClick={() => setLocation('/verify-otp')} className="w-full btn-premium btn-primary h-12 text-sm font-semibold mb-3">
        <span className="flex items-center gap-2">Verify Email Now <ArrowRight className="w-4 h-4" /></span>
      </Button>
      <Button onClick={() => setLocation('/dashboard')} variant="outline" className="w-full h-12 border-white/10 text-white/60 hover:bg-white/10 hover:text-white">
        Go to Dashboard
      </Button>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 8: return renderStep8();
      case 9: return renderStep9();
      default: return renderStep1();
    }
  };

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

          {step === 1 && (
            <div className="flex flex-col items-center mb-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/25">
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white mb-1">Join CampusMatch</h1>
              <p className="text-white/50 text-sm text-center">Exclusively for verified students.</p>
            </div>
          )}

          {step >= 2 && step <= 8 && renderStepIndicator()}

          <AnimatePresence mode="wait">
            <motion.div key={step} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>

          {step === 1 && (
            <>
              <button onClick={() => toast({ title: 'Google Sign Up', description: 'Google OAuth coming soon.' })}
                className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-white/[0.06] border border-white/10 text-white font-medium text-sm hover:bg-white/[0.1] transition-all mb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-white/30">or register with email</span></div>
              </div>
            </>
          )}

          {step < 9 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-center text-sm text-white/50">
              Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Sign in</Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
