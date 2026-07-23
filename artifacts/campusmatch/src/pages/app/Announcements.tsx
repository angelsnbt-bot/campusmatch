import React from 'react';
import { useGetAnnouncements } from '@workspace/api-client-react';
import { Megaphone } from 'lucide-react';
import { format } from 'date-fns';

export default function Announcements() {
  const { data: announcements, isLoading } = useGetAnnouncements();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'high': return 'text-blue-300 bg-blue-500/15 border-blue-500/25';
      case 'medium': return 'text-blue-400/80 bg-blue-500/10 border-blue-500/20';
      default: return 'text-white/50 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Campus Announcements</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : announcements?.length === 0 ? (
        <div className="card-premium p-12 text-center rounded-3xl">
          <p className="text-white/50">No announcements at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements?.map(ann => (
            <div key={ann.id} className="card-premium p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white">{ann.title}</h3>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${getPriorityColor(ann.priority)}`}>
                  {ann.priority}
                </span>
              </div>
              <p className="text-white/80 whitespace-pre-wrap">{ann.content}</p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs text-white/40">
                Posted on {format(new Date(ann.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
