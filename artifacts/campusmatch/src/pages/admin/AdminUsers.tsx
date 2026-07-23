import React, { useState } from 'react';
import { useGetAdminUsers, useBanUser } from '@workspace/api-client-react';
import { GetAdminUsersStatus } from '@workspace/api-client-react';
import { Loader2, Search, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { getGetAdminUsersQueryKey } from '@workspace/api-client-react';
import { format } from 'date-fns';
import { useDebounce } from '@/hooks/use-debounce';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<GetAdminUsersStatus>(null);
  
  const { data: users, isLoading } = useGetAdminUsers({
    search: debouncedSearch || undefined,
    status: statusFilter || undefined
  });
  
  const banMutation = useBanUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [banId, setBanId] = useState<number | null>(null);
  const [banReason, setBanReason] = useState('');

  const handleBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banId || !banReason.trim()) return;

    banMutation.mutate({
      userId: banId,
      data: { reason: banReason }
    }, {
      onSuccess: () => {
        toast({ title: 'User banned' });
        setBanId(null);
        setBanReason('');
        queryClient.invalidateQueries({ queryKey: getGetAdminUsersQueryKey({ search: debouncedSearch, status: statusFilter }) });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Users</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input 
            placeholder="Search by name, email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <select 
          className="bg-white/5 border border-white/10 text-white rounded-xl px-4 outline-none h-10"
          value={statusFilter || ''}
          onChange={(e) => setStatusFilter((e.target.value || null) as GetAdminUsersStatus)}
        >
          <option value="" className="bg-background">All Statuses</option>
          <option value="active" className="bg-background">Active</option>
          <option value="banned" className="bg-background">Banned</option>
          <option value="pending_verification" className="bg-background">Pending</option>
        </select>
      </div>

      <Dialog open={!!banId} onOpenChange={(open) => !open && setBanId(null)}>
        <DialogContent className="glass-card border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBan} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">Reason for Ban</label>
              <Input 
                value={banReason} 
                onChange={(e) => setBanReason(e.target.value)} 
                placeholder="e.g. Violation of community guidelines" 
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setBanId(null)}>Cancel</Button>
              <Button type="submit" variant="destructive" disabled={banMutation.isPending}>
                {banMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Ban'}
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
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center"><Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" /></td>
                </tr>
              ) : users?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/50">No users found.</td>
                </tr>
              ) : (
                users?.map((u) => (
                  <tr key={u.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white flex items-center gap-2">
                        {u.name}
                        {u.isBanned && <span className="text-[10px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase">Banned</span>}
                      </div>
                      <div className="text-xs text-white/50">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/10 rounded-md text-xs">{u.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs ${
                        u.verificationStatus === 'approved' ? 'bg-green-500/20 text-green-400' : 
                        u.verificationStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {u.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 text-right">
                      {!u.isBanned && u.role !== 'super_admin' && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={() => setBanId(u.id)}
                        >
                          <Ban className="w-4 h-4 mr-1" /> Ban
                        </Button>
                      )}
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
