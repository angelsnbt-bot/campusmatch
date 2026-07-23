import React from 'react';
import { useGetMatches } from '@workspace/api-client-react';
import { Loader2, MessageCircle, Heart } from 'lucide-react';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';

export default function Matches() {
  const { data: matches, isLoading } = useGetMatches();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>
        Your Matches
      </h1>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !matches || matches.length === 0 ? (
        <div className="card-premium p-12 text-center rounded-3xl ">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No matches yet</h3>
          <p className="text-white/60 mb-6 max-w-sm mx-auto">
            Keep exploring the campus. Match with people who share your interests in dating, studying, or sports.
          </p>
          <Link href="/discover" className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/20">
            Go to Discover
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <div key={match.id} className="card-premium p-4 rounded-2xl flex flex-col ">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden border-2 border-blue-500">
                    {match.matchedProfile?.avatarUrl ? (
                      <img src={match.matchedProfile.avatarUrl} alt={match.matchedProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl text-blue-400 font-bold">
                        {match.matchedProfile?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border border-white/10 flex items-center justify-center text-[10px]">
                    {match.mode === 'dating' ? '💗' : match.mode === 'study' ? '📚' : match.mode === 'hackathon' ? '💻' : '👥'}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">{match.matchedProfile?.name}</h3>
                  <p className="text-xs text-white/50">{match.matchedProfile?.branch}, Year {match.matchedProfile?.year}</p>
                  <p className="text-[10px] text-white/40 mt-1">Matched {formatDistanceToNow(new Date(match.createdAt))} ago</p>
                </div>
              </div>
              
              <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors mt-auto border border-white/5">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                Say Hi
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
