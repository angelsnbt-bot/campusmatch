import React, { useState } from 'react';
import { useGetAdminVerificationQueue, useApproveVerification, useRejectVerification, AdminVerificationItem } from '@workspace/api-client-react';
import { Check, X, ShieldCheck, Eye, ZoomIn, FileText, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { getGetAdminVerificationQueueQueryKey } from '@workspace/api-client-react';
import { format } from 'date-fns';

export default function AdminVerification() {
  const { data: queue, isLoading } = useGetAdminVerificationQueue();
  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewId, setViewId] = useState<AdminVerificationItem | null>(null);

  const handleApprove = (id: number) => {
    approveMutation.mutate({ verificationId: id }, {
      onSuccess: () => {
        toast({ title: 'Approved successfully' });
        queryClient.invalidateQueries({ queryKey: getGetAdminVerificationQueueQueryKey() });
      }
    });
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectId || !rejectReason.trim()) return;
    rejectMutation.mutate({ verificationId: rejectId, data: { reason: rejectReason } }, {
      onSuccess: () => {
        toast({ title: 'Rejected successfully' });
        setRejectId(null);
        setRejectReason('');
        queryClient.invalidateQueries({ queryKey: getGetAdminVerificationQueueQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Verification Queue</h1>
          <p className="text-white/40 text-sm mt-1">{queue?.length || 0} pending requests</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-full">
          <Clock className="w-3 h-3" />
          Pending Review
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={!!rejectId} onOpenChange={(open) => !open && setRejectId(null)}>
        <DialogContent className="glass-card border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Reject Verification</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReject} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Reason for Rejection</label>
              <Input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Blurry ID card, ERP doesn't match"
                className="input-premium"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setRejectId(null)} className="btn-premium btn-ghost">Cancel</Button>
              <Button type="submit" variant="destructive" disabled={rejectMutation.isPending} className="btn-premium btn-danger">
                {rejectMutation.isPending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full border-spinner" /> : 'Confirm Reject'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View ID Dialog */}
      <Dialog open={!!viewId} onOpenChange={(open) => !open && setViewId(null)}>
        <DialogContent className="glass-card border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">ID Card Preview</DialogTitle>
          </DialogHeader>
          {viewId && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/40 mb-1">Student Name</p>
                  <p className="text-white font-medium">{viewId.userName}</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">ERP Number</p>
                  <p className="text-white font-mono font-medium">{viewId.erpNumber}</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">Email</p>
                  <p className="text-white font-medium">{viewId.userEmail}</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">Submitted</p>
                  <p className="text-white font-medium">{format(new Date(viewId.createdAt), 'MMM d, yyyy HH:mm')}</p>
                </div>
              </div>
              {viewId.idCardUrl && (
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img src={viewId.idCardUrl} alt="ID Card" className="w-full object-contain max-h-[400px]" />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verification cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="card-premium p-5 rounded-2xl animate-pulse-glow">
              <div className="skeleton w-full h-40 rounded-xl mb-4" />
              <div className="skeleton w-32 h-5 mb-2" />
              <div className="skeleton w-48 h-4" />
            </div>
          ))}
        </div>
      ) : queue?.length === 0 ? (
        <div className="card-premium p-12 rounded-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-white/60 text-lg font-medium">All caught up!</p>
          <p className="text-white/30 text-sm mt-1">No pending verification requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {queue?.map((item) => (
            <div key={item.id} className="card-premium p-5 rounded-2xl group hover:border-white/10 transition-all">
              {/* ID Card preview */}
              {item.idCardUrl ? (
                <div className="relative rounded-xl overflow-hidden mb-4 bg-white/5 h-40">
                  <img src={item.idCardUrl} alt="ID Card" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                    <button
                      onClick={() => setViewId(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors"
                    >
                      <ZoomIn className="w-3 h-3" /> View Full
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl mb-4 bg-white/5 h-40 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white/20" />
                </div>
              )}

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{item.userName}</h3>
                  <span className="text-xs text-white/30">{format(new Date(item.createdAt), 'MMM d')}</span>
                </div>
                <p className="text-xs text-white/40">{item.userEmail}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                    ERP: {item.erpNumber}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 btn-premium btn-success text-xs"
                  onClick={() => handleApprove(item.id)}
                  disabled={approveMutation.isPending}
                >
                  <Check className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  className="flex-1 btn-premium btn-danger text-xs"
                  onClick={() => setRejectId(item.id)}
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
