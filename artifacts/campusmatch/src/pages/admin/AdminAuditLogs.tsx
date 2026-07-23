import React from 'react';
import { useGetAuditLogs } from '@workspace/api-client-react';
import { Loader2, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminAuditLogs() {
  const { data: logs, isLoading } = useGetAuditLogs();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
      </div>

      <div className="glass-card rounded-2xl p-6">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : logs?.length === 0 ? (
          <p className="text-center py-12 text-white/50">No logs found.</p>
        ) : (
          <div className="relative border-l border-white/10 ml-4 space-y-6">
            {logs?.map((log) => (
              <div key={log.id} className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                <div className="text-xs text-white/40 mb-1">{format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-white">{log.adminName || `Admin #${log.adminId}`}</span>
                  <span className="text-white/60">performed</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs font-mono text-white/80">{log.action}</span>
                  <span className="text-white/60">on {log.targetType}</span>
                  {log.targetId && <span className="font-mono text-xs text-primary">#{log.targetId}</span>}
                </div>
                {log.details && (
                  <p className="mt-2 text-sm text-white/50 bg-white/5 p-3 rounded-lg border border-white/5">
                    {log.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
