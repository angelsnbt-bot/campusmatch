import React from 'react';
import { useGetAdminAnalytics } from '@workspace/api-client-react';
import { Loader2, Users, ShieldCheck, FileText, CalendarDays, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useGetAdminAnalytics();

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  const statCards = [
    { label: 'Total Users', value: analytics?.totalUsers || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Verified', value: analytics?.verifiedUsers || 0, icon: ShieldCheck, color: 'text-green-500' },
    { label: 'Pending Auth', value: analytics?.pendingVerifications || 0, icon: ShieldCheck, color: 'text-yellow-500' },
    { label: 'Total Posts', value: analytics?.totalPosts || 0, icon: FileText, color: 'text-purple-500' },
    { label: 'Events', value: analytics?.totalEvents || 0, icon: CalendarDays, color: 'text-orange-500' },
    { label: 'Matches', value: analytics?.totalMatches || 0, icon: Heart, color: 'text-pink-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-6">Daily Signups (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics?.dailySignups || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a0030', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={3} dot={{r: 4, fill: '#ec4899'}} activeDot={{r: 8}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
