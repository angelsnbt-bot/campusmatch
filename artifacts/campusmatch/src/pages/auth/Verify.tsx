import React, { useState } from 'react';
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
  const [location, setLocation] = useLocation();

  const [erpNumber, setErpNumber] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  // We'll simulate file upload by just using a dummy string for now, or letting the user type a URL
  // In a real app, you'd use a file input and upload to S3/Cloudinary

  if (!user) return null;

  if (user.verificationStatus === 'approved') {
    setLocation('/dashboard');
    return null;
  }

  const isPending = statusData?.status === 'pending' || user.verificationStatus === 'pending';
  const isRejected = statusData?.status === 'rejected' || user.verificationStatus === 'rejected';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerification.mutate({
      data: {
        erpNumber,
        collegeEmail,
        idCardUrl: "https://example.com/dummy-id-card.jpg" // Placeholder for demo
      }
    }, {
      onSuccess: () => {
        toast({ title: 'Verification Submitted', description: 'Our team will review your application shortly.' });
        refetch();
      },
      onError: (err) => {
        toast({ title: 'Submission Failed', description: (err?.data as any)?.error || err?.message || 'Could not submit.', variant: 'destructive' });
      }
    });
  };

  if (isLoadingStatus) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card p-8 rounded-2xl text-center border-primary/20"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Under Review</h1>
          <p className="text-white/60 mb-6">
            We are verifying your ERP details. This usually takes less than 24 hours. You'll receive an email once approved.
          </p>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-left">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-white/50">Status</span>
              <span className="text-primary font-medium px-2 py-1 bg-primary/10 rounded-md">Pending</span>
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass-card p-8 rounded-2xl"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">ERP Verification</h1>
          <p className="text-white/60 text-sm">
            To ensure CampusMatch remains a safe, 100% verified student-only space, we need to verify your university credentials.
          </p>
        </div>

        {isRejected && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex gap-3 text-destructive-foreground">
            <AlertCircle className="w-5 h-5 shrink-0 text-destructive" />
            <div className="text-sm">
              <p className="font-semibold text-destructive">Previous submission rejected</p>
              <p className="opacity-80 mt-1">{statusData?.rejectionReason || 'Please resubmit with valid details.'}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="erpNumber" className="text-white/80">ERP Number</Label>
            <Input 
              id="erpNumber" 
              placeholder="e.g. 21BXX100XX" 
              value={erpNumber}
              onChange={(e) => setErpNumber(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white focus-visible:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="collegeEmail" className="text-white/80">College Email Again (For verification)</Label>
            <Input 
              id="collegeEmail" 
              type="email" 
              placeholder="name.branch@vgu.ac.in" 
              value={collegeEmail}
              onChange={(e) => setCollegeEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Student ID Card (Optional for demo)</Label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer group">
              <UploadCloud className="w-8 h-8 text-white/40 mx-auto mb-3 group-hover:text-primary transition-colors" />
              <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                Drag and drop your ID card image here, or click to browse
              </p>
              <p className="text-xs text-white/40 mt-2">JPG, PNG up to 5MB</p>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white border-0 py-6 mt-2"
            disabled={submitVerification.isPending}
          >
            {submitVerification.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit for Verification"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
