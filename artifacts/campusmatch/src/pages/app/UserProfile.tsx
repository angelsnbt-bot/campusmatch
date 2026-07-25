import React, { useState } from 'react';
import { useGetUserProfile } from '@workspace/api-client-react';
import { Loader2, ShieldCheck, Trophy, Book, MapPin, Flag, Ban, ArrowLeft } from 'lucide-react';
import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import ReportBlockModal from '@/components/ui/ReportBlockModal';

export default function UserProfile() {
  const params = useParams<{ userId: string }>();
  const userId = parseInt(params.userId || '0', 10);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [modal, setModal] = useState<'report' | 'block' | null>(null);
  
  const { data: profile, isLoading } = useGetUserProfile(userId, {
    query: { enabled: !!userId, queryKey: ['profile', userId] }
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!profile) {
    return <div className="text-center py-20 text-white/50">User not found</div>;
  }

  const isOwnProfile = user?.id === userId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setLocation('/dashboard')} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {!isOwnProfile && (
            <div className="flex items-center gap-2">
              <button onClick={() => setModal('report')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-yellow-400 hover:border-yellow-500/30 text-xs transition-colors">
                <Flag className="w-3.5 h-3.5" /> Report
              </button>
              <button onClick={() => setModal('block')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/30 text-xs transition-colors">
                <Ban className="w-3.5 h-3.5" /> Block
              </button>
            </div>
          )}
        </div>

        <div className="h-48 md:h-64 w-full rounded-3xl bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-[#0a0a14] overflow-hidden relative border border-white/5">
        </div>

        <div className="absolute left-8 -bottom-16 flex items-end gap-6">
          <div className="w-32 h-32 rounded-2xl bg-card border-4 border-[#0a0a14] overflow-hidden shadow-2xl">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-pink-400 bg-white/5">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20 px-2">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
          {profile.isVerified && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-medium">
              <ShieldCheck className="w-3 h-3" /> Verified Student
            </div>
          )}
        </div>

        {profile.isFirst100 && (
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 text-yellow-500 text-sm font-semibold">
            <Trophy className="w-4 h-4" /> First 100 Member
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-6 text-white/60 text-sm">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Book className="w-4 h-4 text-pink-400" /> <span>{profile.branch}, Year {profile.year}</span>
          </div>
          {profile.hostel && (
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <MapPin className="w-4 h-4 text-pink-400" /> <span>{profile.hostel} Hostel</span>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-3">About</h3>
            <p className="text-white/90 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5">
              {profile.bio || <span className="italic opacity-50">No bio provided.</span>}
            </p>
          </div>

          {profile.interests && profile.interests.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map(int => (
                  <span key={int} className="px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-xl text-white text-sm font-medium">
                    {int}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ReportBlockModal
          isOpen={!!modal}
          onClose={() => setModal(null)}
          userId={userId}
          userName={profile.name}
          type={modal}
        />
      )}
    </div>
  );
}
