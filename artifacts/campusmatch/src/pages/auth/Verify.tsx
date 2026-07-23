import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSubmitVerification, useGetVerificationStatus } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ShieldCheck, UploadCloud, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Verify() {
  const { user } = useAuth();
  const { data: statusData, isLoading: isLoadingStatus, refetch } = useGetVerificationStatus();
  const submitVerification = useSubmitVerification();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [erpNumber, setErpNumber] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoadingStatus && user?.verificationStatus === 'approved') {
      setLocation('/dashboard');
    }
  }, [user, isLoadingStatus, setLocation]);

  if (!user || user.verificationStatus === 'approved') return null;

  const isPending = statusData?.status === 'pending' || user.verificationStatus === 'pending';
  const isRejected = statusData?.status === 'rejected' || user.verificationStatus === 'rejected';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({ title: 'Unsupported file type', description: 'Please upload a JPG, PNG, or WebP image.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'ID card image must be under 5MB.', variant: 'destructive' });
      return;
    }
    setIdCardFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setIdCardPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!erpNumber.trim()) {
      toast({ title: 'ERP Number required', variant: 'destructive' });
      return;
    }
    if (!collegeEmail.trim()) {
      toast({ title: 'College Email required', variant: 'destructive' });
      return;
    }
    submitVerification.mutate({
      data: { erpNumber: erpNumber.trim(), collegeEmail: collegeEmail.trim(), idCardUrl: idCardPreview || undefined }
    }, {
      onSuccess: () => {
        toast({ title: 'Verification Submitted', description: 'Our team will review your application shortly.' });
        refetch();
      },
      onError: (err) => {
        toast({ title: 'Submission Failed', description: (err as any)?.data?.error || (err as any)?.message || 'Could not submit.', variant: 'destructive' });
      }
    });
  };

  if (isLoadingStatus) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md card-premium p-8 rounded-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Under Review</h1>
          <p className="text-white/60 mb-6">
            We are verifying your ERP details. This usually takes less than 24 hours. You'll receive an email once approved.
          </p>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-left">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-white/50">Status</span>
              <span className="text-blue-400 font-medium px-2 py-1 bg-blue-500/10 rounded-md">Pending</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/50">ERP Number</span>
              <span className="text-white">{statusData?.erpNumber || 'Submitted'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg card-premium p-8 rounded-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">ERP Verification</h1>
          <p className="text-white/60 text-sm">
            To ensure CampusMatch remains a safe, 100% verified student-only space, we need to verify your university credentials.
          </p>
        </div>

        {isRejected && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-blue-400" />
            <div className="text-sm">
              <p className="font-semibold text-blue-400">Previous submission rejected</p>
              <p className="text-blue-300/80 mt-1">{statusData?.rejectionReason || 'Please resubmit with valid details.'}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="erpNumber" className="text-white/80">ERP Number *</Label>
            <Input id="erpNumber" placeholder="e.g. 21BXX100XX" value={erpNumber} onChange={(e) => setErpNumber(e.target.value)} required className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="collegeEmail" className="text-white/80">College Email *</Label>
            <Input id="collegeEmail" type="email" placeholder="name.branch@college.ac.in" value={collegeEmail} onChange={(e) => setCollegeEmail(e.target.value)} required className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500" />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Student ID Card</Label>
            <label className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer group block">
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
              {idCardPreview ? (
                <div className="space-y-3">
                  <img src={idCardPreview} alt="ID Card preview" className="max-h-40 mx-auto rounded-lg border border-white/10" />
                  <p className="text-sm text-blue-300">Click to change</p>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-white/40 mx-auto mb-3 group-hover:text-blue-400 transition-colors" />
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    Drag and drop your ID card image here, or click to browse
                  </p>
                  <p className="text-xs text-white/40 mt-2">JPG, PNG, WebP up to 5MB</p>
                </>
              )}
            </label>
          </div>
          
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 py-6 mt-2 shadow-lg shadow-blue-500/25" disabled={submitVerification.isPending}>
            {submitVerification.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit for Verification"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
