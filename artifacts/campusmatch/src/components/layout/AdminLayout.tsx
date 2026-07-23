import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard, Users, ShieldCheck, CalendarDays, ShoppingBag,
  FileText, BarChart3, Bell, Settings, LogOut, ChevronLeft,
  Menu, Zap, Activity, HelpCircle, MessageSquare
} from 'lucide-react';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Students', href: '/admin/users', icon: Users },
  { label: 'Verification', href: '/admin/verification', icon: ShieldCheck },
  { label: 'Events', href: '/events', icon: CalendarDays },
  { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { label: 'Reports', href: '/admin/audit-logs', icon: FileText },
  { label: 'Analytics', href: '/admin', icon: BarChart3 },
  { label: 'Notifications', href: '/admin', icon: Bell },
  { label: 'Support', href: '/admin', icon: MessageSquare },
  { label: 'Settings', href: '/admin', icon: Settings },
  { label: 'System Logs', href: '/admin/audit-logs', icon: Activity },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logoutUser } = useAuth();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return location === '/admin';
    return location.startsWith(href);
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] ${collapsed && !isMobile ? 'justify-center px-2' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <div>
            <span className="text-sm font-bold text-white">Campus<span className="text-gradient-blue">Match</span></span>
            <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/10 text-white border border-blue-500/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent'
              } ${collapsed && !isMobile ? 'justify-center px-2' : ''}`}
              title={collapsed && !isMobile ? item.label : undefined}
            >
              <item.icon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-blue-400' : 'text-white/40 group-hover:text-white/60'}`} />
              {(!collapsed || isMobile) && <span>{item.label}</span>}
              {active && (!collapsed || isMobile) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin info */}
      <div className={`px-3 py-4 border-t border-white/[0.06] ${collapsed && !isMobile ? 'px-2' : ''}`}>
        {(!collapsed || isMobile) ? (
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
              <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
        ) : null}
        <button
          onClick={logoutUser}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all ${collapsed && !isMobile ? 'justify-center' : ''}`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || isMobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col shrink-0 glass-surface border-r border-white/[0.06] transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-64'}`}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full glass-card border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors z-10"
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 glass-surface lg:hidden"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center px-4 border-b border-white/[0.06] shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition-all mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-4.5 h-4.5 text-white/40 hover:text-white/70 cursor-pointer transition-colors" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
