import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Command, LayoutDashboard, Compass, Heart,
  Users, CalendarDays, ShoppingBag, Megaphone,
  User, Settings, LogOut, Info, HelpCircle,
  FileText, Shield, BookOpen, Briefcase,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  category: string;
  shortcut?: string;
}

const items: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', category: 'Navigation', shortcut: '⌘D' },
  { id: 'discover', label: 'Discover', icon: Compass, href: '/discover', category: 'Navigation', shortcut: '⌘E' },
  { id: 'matches', label: 'Matches', icon: Heart, href: '/matches', category: 'Navigation', shortcut: '⌘M' },
  { id: 'friends', label: 'Friends', icon: Users, href: '/friends', category: 'Navigation', shortcut: '⌘F' },
  { id: 'events', label: 'Events', icon: CalendarDays, href: '/events', category: 'Navigation', shortcut: '⌘L' },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, href: '/marketplace', category: 'Navigation', shortcut: '⌘P' },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, href: '/announcements', category: 'Navigation' },
  { id: 'edit-profile', label: 'Edit Profile', icon: User, href: '/profile', category: 'Actions' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard', category: 'Actions' },
  { id: 'logout', label: 'Log Out', icon: LogOut, href: '/login', category: 'Actions' },
  { id: 'about', label: 'About', icon: Info, href: '/about', category: 'Pages' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, href: '/faq', category: 'Pages' },
  { id: 'terms', label: 'Terms', icon: FileText, href: '/terms', category: 'Pages' },
  { id: 'privacy', label: 'Privacy', icon: Shield, href: '/privacy', category: 'Pages' },
  { id: 'blog', label: 'Blog', icon: BookOpen, href: '/blog', category: 'Pages' },
  { id: 'careers', label: 'Careers', icon: Briefcase, href: '/careers', category: 'Pages' },
];

let _listeners: Array<() => void> = [];
let _isOpen = false;

function _emit() {
  _listeners.forEach(l => l());
}

function _subscribe(listener: () => void) {
  _listeners = [..._listeners, listener];
  return () => { _listeners = _listeners.filter(l => l !== listener); };
}

function _getSnapshot() {
  return _isOpen;
}

function _setOpen(value: boolean) {
  _isOpen = value;
  _emit();
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      _setOpen(!_isOpen);
    }
  });
}

export function useCommandPalette() {
  const isOpen = useSyncExternalStore(_subscribe, _getSnapshot);
  const open = useCallback(() => _setOpen(true), []);
  const close = useCallback(() => _setOpen(false), []);
  return { isOpen, open, close };
}

export function CommandPalette() {
  const { isOpen, open, close } = useCommandPalette();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  const filtered = query
    ? items.filter(
        i =>
          i.label.toLowerCase().includes(query.toLowerCase()) ||
          i.category.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const categoryOrder = ['Navigation', 'Actions', 'Pages'];
  const sortedCategories = categoryOrder.filter(c => grouped[c]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeItem = useCallback(
    (item: CommandItem) => {
      setLocation(item.href);
      close();
    },
    [setLocation, close]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && filtered[selectedIndex]) {
      executeItem(filtered[selectedIndex]);
    }
    if (e.key === 'Escape') {
      close();
    }
  };

  const flatIndex = (item: CommandItem) => filtered.indexOf(item);

  return (
    <>
      <button
        onClick={open}
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
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={close}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg mx-4"
            >
              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                  <Search className="w-5 h-5 text-white/30" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
                  />
                  <kbd className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-white/30 border border-white/[0.06]">
                    <Command className="w-2.5 h-2.5" />K
                  </kbd>
                </div>

                <div className="max-h-[380px] overflow-y-auto p-2">
                  {sortedCategories.length === 0 ? (
                    <div className="py-8 text-center text-white/30 text-sm">No results found</div>
                  ) : (
                    sortedCategories.map(category => (
                      <div key={category} className="mb-2">
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-white/25 uppercase tracking-wider">
                          {category}
                        </div>
                        {grouped[category].map((item, i) => {
                          const idx = flatIndex(item);
                          return (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.02 }}
                              onClick={() => executeItem(item)}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                idx === selectedIndex
                                  ? 'bg-white/[0.08] text-white'
                                  : 'text-white/50 hover:text-white/70'
                              }`}
                            >
                              <item.icon className="w-4 h-4 shrink-0" />
                              <span className="flex-1 text-left">{item.label}</span>
                              {item.shortcut && (
                                <kbd className="text-[10px] font-mono text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded">
                                  {item.shortcut}
                                </kbd>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-white/25">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.06]">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.06]">↵</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-white/[0.06]">ESC</kbd> Close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default CommandPalette;
