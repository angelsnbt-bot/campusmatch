import React, { useState } from 'react';
import { useGetAdminUsers, useBanUser } from '@workspace/api-client-react';
import { GetAdminUsersStatus, AdminUser } from '@workspace/api-client-react';
import { Search, Ban, Users as UsersIcon, ShieldCheck, AlertTriangle } from 'lucide-react';
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
    banMutation.mutate({ userId: banId, data: { reason: banReason } }, {
      onSuccess: () => {
        toast({ title: 'User banned' });
        setBanId(null);
        setBanReason('');
        queryClient.invalidateQueries({ queryKey: getGetAdminUsersQueryKey({ search: debouncedSearch, status: statusFilter }) });
      }
    });
  };

  const totalUsers = users?.length || 0;
  const verifiedUsers = users?.filter(u => u.verificationStatus === 'approved').length || 0;
  const bannedUsers = users?.filter(u => u.isBanned).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Student Management</h1>
        <p className="text-white/40 text-sm mt-1">Manage all registered students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-premium p-4 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <UsersIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{totalUsers}</p>
            <p className="text-xs text-white/40">Total</p>
          </div>
        </div>
        <div className="card-premium p-4 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <ShieldCheck className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{verifiedUsers}</p>
            <p className="text-xs text-white/40">Verified</p>
          </div>
        </div>
        <div className="card-premium p-4 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{bannedUsers}</p>
            <p className="text-xs text-white/40">Banned</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium pl-10"
          />
        </div>
        <select
          className="input-premium h-10 px-4 text-sm appearance-none cursor-pointer"
          value={statusFilter || ''}
          onChange={(e) => setStatusFilter((e.target.value || null) as GetAdminUsersStatus)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="pending_verification">Pending</option>
        </select>
      </div>

      {/* Ban Dialog */}
      <Dialog open={!!banId} onOpenChange={(open) => !open && setBanId(null)}>
        <DialogContent className="glass-card border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Ban Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBan} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80 font-medium">Reason for Ban</label>
              <Input
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="e.g. Violation of community guidelines"
                className="input-premium"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setBanId(null)} className="btn-premium btn-ghost">Cancel</Button>
              <Button type="submit" variant="destructive" disabled={banMutation.isPending} className="btn-premium btn-danger">
                {banMutation.isPending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full border-spinner" /> : 'Confirm Ban'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Users list */}
      <div className="card-premium rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.03] border-b border-white/[0.06]">
              <tr>
                <th className="px-5 py-3.5 font-medium text-white/50 text-xs uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 font-medium text-white/50 text-xs uppercase tracking-wider">Role</th>
                <th className="px-5 py-3.5 font-medium text-white/50 text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 font-medium text-white/50 text-xs uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3.5 font-medium text-white/50 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full border-spinner mx-auto" />
                  </td>
                </tr>
              ) : users?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-white/40">No students found.</td>
                </tr>
              ) : (
                users?.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-white flex items-center gap-2">
                            {u.name}
                            {u.isBanned && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">Banned</span>}
                          </div>
                          <div className="text-xs text-white/40">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-1 bg-white/[0.06] rounded-md text-xs font-medium text-white/60">{u.role}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.verificationStatus === 'approved' ? 'bg-green-500/15 text-green-400' :
                        u.verificationStatus === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                        'bg-white/[0.06] text-white/40'
                      }`}>
                        {u.verificationStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/40 text-xs">
                      {format(new Date(u.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {!u.isBanned && u.role !== 'super_admin' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
                          onClick={() => setBanId(u.id)}
                        >
                          <Ban className="w-3.5 h-3.5 mr-1" /> Ban
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
