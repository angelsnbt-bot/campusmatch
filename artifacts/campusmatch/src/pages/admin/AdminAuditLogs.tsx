import React from 'react';
import { useGetAuditLogs } from '@workspace/api-client-react';
import { Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminAuditLogs() {
  const { data: logs, isLoading } = useGetAuditLogs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
        <p className="text-white/40 text-sm mt-1">System activity and admin actions</p>
      </div>

      <div className="card-premium rounded-2xl p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-3">
                <div className="skeleton w-3 h-3 rounded-full mt-1.5" />
                <div className="flex-1">
                  <div className="skeleton w-48 h-4 mb-2" />
                  <div className="skeleton w-full h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : logs?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/50">No logs found.</p>
          </div>
        ) : (
          <div className="relative border-l border-white/10 ml-3 space-y-6">
            {logs?.map((log) => (
              <div key={log.id} className="relative pl-8 group">
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-[hsl(235,22%,8%)] group-hover:ring-blue-500/20 transition-all" />

                {/* Content */}
                <div className="p-3 rounded-xl group-hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-white/30">{format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}</span>
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">{log.adminName || `Admin #${log.adminId}`}</span>
                    <span className="text-white/40 text-xs">performed</span>
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-xs font-mono font-medium">{log.action}</span>
                    <span className="text-white/40 text-xs">on</span>
                    <span className="text-white/60 text-xs">{log.targetType}</span>
                    {log.targetId && <span className="font-mono text-xs text-blue-400">#{log.targetId}</span>}
                  </div>
                  {log.details && (
                    <p className="mt-2 text-xs text-white/40 bg-white/[0.03] p-3 rounded-lg border border-white/[0.04]">
                      {log.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
