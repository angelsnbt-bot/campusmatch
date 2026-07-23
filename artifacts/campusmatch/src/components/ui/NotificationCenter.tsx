import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageCircle, ShieldCheck, CalendarDays, AtSign, X } from 'lucide-react';

interface Notification {
  id: number;
  type: 'like' | 'message' | 'verification' | 'event' | 'mention' | 'match';
  title: string;
  description: string;
  time: string;
  read: boolean;
  href?: string;
}

const mockNotifications: Notification[] = [
  { id: 1, type: 'like', title: 'Priya liked your post', description: 'Your campus life photo got a reaction', time: '2m ago', read: false, href: '/dashboard' },
  { id: 2, type: 'match', title: 'New Match!', description: 'You and Rahul matched on Study mode', time: '15m ago', read: false, href: '/matches' },
  { id: 3, type: 'message', title: 'New message from Aisha', description: 'Hey, are you coming to the event?', time: '1h ago', read: false, href: '/friends' },
  { id: 4, type: 'verification', title: 'Verification approved', description: 'Your student ID has been verified', time: '3h ago', read: true, href: '/verify' },
  { id: 5, type: 'event', title: 'Tech Fest tomorrow', description: 'Annual coding competition starts at 10 AM', time: '5h ago', read: true, href: '/events' },
  { id: 6, type: 'mention', title: 'Rahul mentioned you', description: 'in the study group discussion', time: '1d ago', read: true, href: '/dashboard' },
];

const iconMap = {
  like: { icon: Heart, color: 'text-pink-400 bg-pink-500/15' },
  message: { icon: MessageCircle, color: 'text-blue-400 bg-blue-500/15' },
  verification: { icon: ShieldCheck, color: 'text-green-400 bg-green-500/15' },
  event: { icon: CalendarDays, color: 'text-orange-400 bg-orange-500/15' },
  mention: { icon: AtSign, color: 'text-purple-400 bg-purple-500/15' },
  match: { icon: Heart, color: 'text-red-400 bg-red-500/15' },
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
      >
        <Bell className="w-4.5 h-4.5" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute right-0 top-full mt-2 w-80 glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unread > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{unread} new</span>}
              </div>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-[320px] overflow-y-auto">
              {notifications.map((n, i) => {
                const { icon: Icon, color } = iconMap[n.type];
                return (
                  <Link
                    key={n.id}
                    href={n.href || '#'}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] ${
                      !n.read ? 'bg-blue-500/[0.03]' : ''
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${!n.read ? 'text-white' : 'text-white/60'}`}>{n.title}</p>
                      <p className="text-[11px] text-white/30 mt-0.5 truncate">{n.description}</p>
                      <p className="text-[10px] text-white/20 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/[0.06]">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-center text-xs text-blue-400 hover:text-blue-300 transition-colors block">
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
