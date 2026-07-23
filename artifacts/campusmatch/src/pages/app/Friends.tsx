import React, { useState } from 'react';
import { useGetConnections, useGetConnectionRequests, useAcceptConnection } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, Check, X, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetConnectionsQueryKey, getGetConnectionRequestsQueryKey } from '@workspace/api-client-react';
import { formatDistanceToNow } from 'date-fns';

export default function Friends() {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const { data: connections, isLoading: isLoadingFriends } = useGetConnections();
  const { data: requests, isLoading: isLoadingRequests } = useGetConnectionRequests();
  
  const acceptMutation = useAcceptConnection();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAccept = (connectionId: number, accept: boolean) => {
    acceptMutation.mutate({ connectionId }, {
      onSuccess: () => {
        toast({ title: accept ? 'Request accepted!' : 'Request declined' });
        queryClient.invalidateQueries({ queryKey: getGetConnectionRequestsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetConnectionsQueryKey() });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#ec4899] flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>Friends</h1>
      </div>

      <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
        <button
          className={`text-lg font-medium transition-colors ${activeTab === 'friends' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
          onClick={() => setActiveTab('friends')}
          style={{ fontFamily: 'Outfit' }}
        >
          My Friends ({connections?.length || 0})
        </button>
        <button
          className={`text-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'requests' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
          onClick={() => setActiveTab('requests')}
          style={{ fontFamily: 'Outfit' }}
        >
          Requests 
          {requests && requests.length > 0 && (
            <span className="bg-[#ec4899] text-white text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: 'Space Grotesk' }}>{requests.length}</span>
          )}
        </button>
      </div>

      {activeTab === 'friends' && (
        isLoadingFriends ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-pink-500 animate-spin" /></div>
        ) : connections?.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl cm-card-elevate">
            <p className="text-white/50" style={{ fontFamily: 'Inter' }}>You haven't added any friends yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections?.map(conn => (
              <div key={conn.id} className="glass-card p-4 rounded-2xl flex items-center gap-4 cm-card-elevate">
                <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden shrink-0">
                  {conn.connectedProfile?.avatarUrl ? (
                    <img src={conn.connectedProfile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-400 font-bold" style={{ fontFamily: 'Outfit' }}>
                      {conn.connectedProfile?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white" style={{ fontFamily: 'Outfit' }}>{conn.connectedProfile?.name}</h4>
                  <p className="text-xs text-white/50" style={{ fontFamily: 'Inter' }}>{conn.connectedProfile?.branch}</p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white hover:bg-white/10" style={{ fontFamily: 'Cabin' }}>
                  Message
                </Button>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'requests' && (
        isLoadingRequests ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-pink-500 animate-spin" /></div>
        ) : requests?.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl cm-card-elevate">
            <p className="text-white/50" style={{ fontFamily: 'Inter' }}>No pending friend requests.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests?.map(req => (
              <div key={req.id} className="glass-card p-4 rounded-2xl flex items-center gap-4 cm-card-elevate">
                <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden shrink-0">
                  {req.connectedProfile?.avatarUrl ? (
                    <img src={req.connectedProfile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-400 font-bold" style={{ fontFamily: 'Outfit' }}>
                      {req.connectedProfile?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white" style={{ fontFamily: 'Outfit' }}>{req.connectedProfile?.name}</h4>
                  <p className="text-xs text-white/50" style={{ fontFamily: 'Inter' }}>{req.connectedProfile?.branch} • Sent {formatDistanceToNow(new Date(req.createdAt))} ago</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleAccept(req.id, true)}
                    className="bg-[#ec4899] hover:bg-[#db2777] text-white px-3"
                    disabled={acceptMutation.isPending}
                    style={{ fontFamily: 'Cabin' }}
                  >
                    <Check className="w-4 h-4 mr-1" /> Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleAccept(req.id, false)}
                    className="text-white/60 hover:text-white hover:bg-white/10 px-3"
                    disabled={acceptMutation.isPending}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
