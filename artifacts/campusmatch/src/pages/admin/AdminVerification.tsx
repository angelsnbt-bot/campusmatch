import React, { useState } from 'react';
import { useGetAdminVerificationQueue, useApproveVerification, useRejectVerification } from '@workspace/api-client-react';
import { Loader2, Check, X, ShieldCheck } from 'lucide-react';
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

    rejectMutation.mutate({
      verificationId: rejectId,
      data: { reason: rejectReason }
    }, {
      onSuccess: () => {
        toast({ title: 'Rejected successfully' });
        setRejectId(null);
        setRejectReason('');
        queryClient.invalidateQueries({ queryKey: getGetAdminVerificationQueueQueryKey() });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Verification Queue</h1>
      </div>

      <Dialog open={!!rejectId} onOpenChange={(open) => !open && setRejectId(null)}>
        <DialogContent className="glass-card border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReject} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">Reason for Rejection</label>
              <Input 
                value={rejectReason} 
                onChange={(e) => setRejectReason(e.target.value)} 
                placeholder="e.g. Blurry ID card, ERP doesn't match" 
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setRejectId(null)}>Cancel</Button>
              <Button type="submit" variant="destructive" disabled={rejectMutation.isPending}>
                {rejectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Reject'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-white/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">ERP Number</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
                <th className="px-6 py-4 font-medium">ID Card</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center"><Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" /></td>
                </tr>
              ) : queue?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/50">Queue is empty.</td>
                </tr>
              ) : (
                queue?.map((item) => (
                  <tr key={item.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{item.userName}</div>
                      <div className="text-xs text-white/50">{item.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">{item.erpNumber}</td>
                    <td className="px-6 py-4">{format(new Date(item.createdAt), 'MMM d, HH:mm')}</td>
                    <td className="px-6 py-4">
                      {item.idCardUrl ? (
                        <a href={item.idCardUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">View ID</a>
                      ) : (
                        <span className="text-white/30 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white"
                          onClick={() => handleApprove(item.id)}
                          disabled={approveMutation.isPending}
                        >
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white"
                          onClick={() => setRejectId(item.id)}
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
