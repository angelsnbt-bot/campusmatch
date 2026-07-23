import React, { useState } from 'react';
import { useGetDiscoverFeed, useLikeProfile, usePassProfile } from '@workspace/api-client-react';
import { GetDiscoverFeedMode, LikeInputMode } from '@workspace/api-client-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Heart, X, Star, MapPin, GraduationCap, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const MODES: { id: GetDiscoverFeedMode; label: string; icon: string }[] = [
  { id: 'dating', label: 'Dating', icon: '💗' },
  { id: 'friends', label: 'Friends', icon: '👥' },
  { id: 'study', label: 'Study', icon: '📚' },
  { id: 'hackathon', label: 'Hackathons', icon: '💻' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
];

export default function Discover() {
  const [mode, setMode] = useState<GetDiscoverFeedMode>('dating');
  const { data: profiles, isLoading, refetch } = useGetDiscoverFeed({ mode });
  const likeMutation = useLikeProfile();
  const passMutation = usePassProfile();
  const { toast } = useToast();
  
  // Keep track of the active profile locally so we can shift it immediately on action
  const activeProfile = profiles && profiles.length > 0 ? profiles[0] : null;

  const handleAction = (type: 'like' | 'pass' | 'superlike') => {
    if (!activeProfile) return;

    // Optimistically proceed to next profile by refetching or shifting state.
    // Since Orval hooks don't expose a simple setState for data, we'll rely on refetching after mutation 
    // or just let the cache update. For a real app, we'd manage a local queue.
    
    if (type === 'pass') {
      passMutation.mutate({ data: { targetUserId: activeProfile.userId } }, { onSuccess: () => refetch() });
    } else {
      likeMutation.mutate({ 
        data: { 
          targetUserId: activeProfile.userId, 
          mode: mode as LikeInputMode,
          isSuperLike: type === 'superlike' 
        } 
      }, { 
        onSuccess: (res) => {
          if (res.isMatch) {
            toast({ 
              title: 'It\'s a match! 🎉', 
              description: `You and ${activeProfile.name} liked each other.`,
              className: 'bg-primary text-white border-none'
            });
          }
          refetch();
        } 
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md flex flex-col items-center h-[calc(100vh-100px)]">
      
      {/* Mode Selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 w-full justify-center scrollbar-hide shrink-0">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              mode === m.id 
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            }`}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      {/* Cards Area */}
      <div className="flex-1 w-full relative mt-4 flex items-center justify-center">
        {isLoading ? (
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        ) : !activeProfile ? (
          <div className="glass-card p-8 rounded-3xl text-center w-full max-w-sm">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You've seen everyone!</h3>
            <p className="text-white/60 text-sm">Check back later for more profiles or try switching modes.</p>
          </div>
        ) : (
          <div className="relative w-full max-w-sm h-full max-h-[600px]">
            <AnimatePresence>
              <motion.div
                key={activeProfile.userId}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ x: 200, opacity: 0, transition: { duration: 0.2 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  if (swipe > 100) {
                    handleAction('like');
                  } else if (swipe < -100) {
                    handleAction('pass');
                  }
                }}
                className="absolute inset-0 w-full h-full bg-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col cursor-grab active:cursor-grabbing"
              >
                <div className="relative h-2/3 w-full bg-background/50">
                  {activeProfile.avatarUrl ? (
                    <img src={activeProfile.avatarUrl} alt={activeProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-6xl font-bold bg-gradient-to-br from-primary/10 to-secondary/10">
                      {activeProfile.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {activeProfile.matchScore && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-bold">{activeProfile.matchScore}% Match</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-3xl font-bold text-white">{activeProfile.name}</h2>
                      {activeProfile.isVerified && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <GraduationCap className="w-4 h-4" />
                      <span>{activeProfile.branch}, Year {activeProfile.year}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col bg-card relative z-10">
                  <p className="text-white/80 text-sm line-clamp-3 mb-4 flex-1">
                    {activeProfile.bio || "No bio provided."}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeProfile.interests?.slice(0, 3).map(interest => (
                      <span key={interest} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-auto">
                    <button 
                      onClick={() => handleAction('pass')}
                      className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleAction('superlike')}
                      className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                      <Star className="w-5 h-5 fill-blue-400" />
                    </button>
                    <button 
                      onClick={() => handleAction('like')}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
                    >
                      <Heart className="w-6 h-6 fill-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple check icon for verified badge
const Check = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
