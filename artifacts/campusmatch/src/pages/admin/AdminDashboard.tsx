import React from 'react';
import { useGetAdminAnalytics } from '@workspace/api-client-react';
import { Users, ShieldCheck, FileText, CalendarDays, Heart, TrendingUp, Activity, Clock, AlertTriangle, UserPlus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useGetAdminAnalytics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="card-premium p-6 rounded-2xl animate-pulse-glow">
            <div className="skeleton w-10 h-10 rounded-xl mb-3" />
            <div className="skeleton w-20 h-6 mb-2" />
            <div className="skeleton w-16 h-4" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    { label: 'Total Students', value: analytics?.totalUsers || 0, icon: Users, color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400', change: '+12%', changeUp: true },
    { label: 'Verified', value: analytics?.verifiedUsers || 0, icon: ShieldCheck, color: 'from-green-500/20 to-green-600/10', iconColor: 'text-green-400', change: '+8%', changeUp: true },
    { label: 'Pending', value: analytics?.pendingVerifications || 0, icon: Clock, color: 'from-yellow-500/20 to-yellow-600/10', iconColor: 'text-yellow-400', change: '-3%', changeUp: false },
    { label: 'Total Posts', value: analytics?.totalPosts || 0, icon: FileText, color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400', change: '+24%', changeUp: true },
    { label: 'Events', value: analytics?.totalEvents || 0, icon: CalendarDays, color: 'from-orange-500/20 to-orange-600/10', iconColor: 'text-orange-400', change: '+5%', changeUp: true },
    { label: 'Matches', value: analytics?.totalMatches || 0, icon: Heart, color: 'from-pink-500/20 to-pink-600/10', iconColor: 'text-pink-400', change: '+18%', changeUp: true },
    { label: 'Active Users', value: Math.round((analytics?.verifiedUsers || 0) * 0.7), icon: Activity, color: 'from-cyan-500/20 to-cyan-600/10', iconColor: 'text-cyan-400', change: '+9%', changeUp: true },
    { label: 'Today Registrations', value: 3, icon: UserPlus, color: 'from-indigo-500/20 to-indigo-600/10', iconColor: 'text-indigo-400', change: '+2', changeUp: true },
  ];

  const quickActions = [
    { label: 'Review Verifications', href: '/admin/verification', icon: ShieldCheck, color: 'text-yellow-400 bg-yellow-500/10' },
    { label: 'Manage Students', href: '/admin/users', icon: Users, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'View Audit Logs', href: '/admin/audit-logs', icon: FileText, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'System Health', href: '/admin', icon: Activity, color: 'text-green-400 bg-green-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back. Here's what's happening on campus.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="card-premium p-5 rounded-2xl group hover:scale-[1.02] transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.changeUp ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value.toLocaleString()}</p>
            <p className="text-xs text-white/40 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts + Quick Actions row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 card-premium p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Daily Signups</h3>
              <p className="text-xs text-white/40 mt-1">Last 7 days</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +18% this week
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.dailySignups || []}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 11}} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 11}} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(235,22%,10%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#blueGradient)" dot={{r: 3, fill: '#3b82f6', strokeWidth: 0}} activeDot={{r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-premium p-6 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all group"
              >
                <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-premium p-6 rounded-2xl">
        <h3 className="text-base font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { text: 'New student registration: Priya Sharma', time: '2 min ago', color: 'bg-green-500' },
            { text: 'Verification request from Rahul Verma', time: '15 min ago', color: 'bg-yellow-500' },
            { text: 'New event posted: Annual Tech Fest', time: '1 hour ago', color: 'bg-blue-500' },
            { text: 'Marketplace listing: Used textbooks', time: '3 hours ago', color: 'bg-purple-500' },
            { text: 'Admin action: Approved 5 verifications', time: '5 hours ago', color: 'bg-cyan-500' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activity.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/70">{activity.text}</p>
                <p className="text-xs text-white/30 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
