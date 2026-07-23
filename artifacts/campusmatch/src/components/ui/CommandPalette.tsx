import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Command, ArrowRight, LayoutDashboard, Compass, Heart,
  Users, CalendarDays, ShoppingBag, User, ShieldCheck, Settings,
  LogOut, Bell, FileText, TrendingUp, Zap, Moon, Sun, Hash
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  category: string;
  shortcut?: string;
  badge?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useLocation();
  const { user, logoutUser } = useAuth();

  const items: CommandItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', category: 'Navigation', shortcut: 'G D' },
    { id: 'discover', label: 'Discover Students', icon: Compass, href: '/discover', category: 'Navigation', shortcut: 'G S' },
    { id: 'matches', label: 'My Matches', icon: Heart, href: '/matches', category: 'Navigation', shortcut: 'G M' },
    { id: 'friends', label: 'Friends', icon: Users, href: '/friends', category: 'Navigation', shortcut: 'G F' },
    { id: 'events', label: 'Events', icon: CalendarDays, href: '/events', category: 'Navigation', shortcut: 'G E' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, href: '/marketplace', category: 'Navigation', shortcut: 'G K' },
    { id: 'profile', label: 'My Profile', icon: User, href: '/profile', category: 'Navigation', shortcut: 'G P' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/dashboard', category: 'Navigation' },
    { id: 'verification', label: 'Verification Status', icon: ShieldCheck, href: '/verify', category: 'Account' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard', category: 'Account' },
    { id: 'trending', label: 'Trending Students', icon: TrendingUp, href: '/discover', category: 'Explore' },
    { id: 'leaderboard', label: 'Campus Leaderboard', icon: FileText, href: '/dashboard', category: 'Explore', badge: 'New' },
    { id: 'darkmode', label: 'Toggle Dark/Light Mode', icon: Moon, action: () => document.documentElement.classList.toggle('dark'), category: 'Appearance', shortcut: '⌘ D' },
    { id: 'logout', label: 'Sign Out', icon: LogOut, action: () => logoutUser(), category: 'Account' },
  ];

  const filtered = query
    ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || i.category.toLowerCase().includes(query.toLowerCase()))
    : items;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  const executeItem = useCallback((item: CommandItem) => {
    if (item.action) item.action();
    else if (item.href) setLocation(item.href);
    setOpen(false);
  }, [setLocation]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[selectedIndex]) executeItem(filtered[selectedIndex]);
  };

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 text-xs hover:text-white/60 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
        aria-label="Open command palette"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-white/30 border border-white/[0.06]">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg mx-4"
            >
              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                  <Search className="w-5 h-5 text-white/30" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search commands, pages, actions..."
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
                    aria-label="Search commands"
                  />
                  <kbd className="flex items-center px-2 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-white/30 border border-white/[0.06]">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-[360px] overflow-y-auto p-2">
                  {Object.entries(grouped).length === 0 ? (
                    <div className="py-8 text-center text-white/30 text-sm">No results found</div>
                  ) : (
                    Object.entries(grouped).map(([category, items]) => (
                      <div key={category} className="mb-2">
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-white/25 uppercase tracking-wider">{category}</div>
                        {items.map(item => {
                          const globalIndex = filtered.indexOf(item);
                          return (
                            <button
                              key={item.id}
                              onClick={() => executeItem(item)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                globalIndex === selectedIndex
                                  ? 'bg-white/[0.08] text-white'
                                  : 'text-white/50 hover:text-white/70'
                              }`}
                            >
                              <item.icon className="w-4 h-4 shrink-0" />
                              <span className="flex-1 text-left">{item.label}</span>
                              {item.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{item.badge}</span>
                              )}
                              {item.shortcut && (
                                <kbd className="text-[10px] font-mono text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded">{item.shortcut}</kbd>
                              )}
                              <ArrowRight className="w-3 h-3 text-white/20" />
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-white/25">
                  <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.06]">↑↓</kbd> Navigate</span>
                  <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.06]">↵</kbd> Select</span>
                  <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.06]">ESC</kbd> Close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
