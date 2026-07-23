import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Menu, X, Zap, ChevronDown, User, Settings, ShieldCheck, LogOut, HelpCircle, Bell, Edit3 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Discover', href: '/discover' },
  { label: 'Matches', href: '/matches' },
  { label: 'Friends', href: '/friends' },
  { label: 'Events', href: '/events' },
  { label: 'Marketplace', href: '/marketplace' },
];

const dropdownItems = [
  { label: 'My Profile', href: '/profile', icon: User },
  { label: 'Edit Profile', href: '/profile', icon: Edit3 },
  { label: 'Verification', href: '/verify', icon: ShieldCheck },
  { label: 'Notifications', href: '/dashboard', icon: Bell },
  { label: 'Settings', href: '/dashboard', icon: Settings },
  { label: 'Help', href: '/#faq', icon: HelpCircle },
];

export const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const direction = latest > lastScrollY ? 'down' : 'up';
    if (latest > 60) {
      setHidden(direction === 'down' && latest > 200);
      setScrolled(true);
    } else {
      setHidden(false);
      setScrolled(false);
    }
    setLastScrollY(latest);
  });

  useEffect(() => { setMobileMenuOpen(false); setDropdownOpen(false); }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const activeLink = navLinks.find(l => l.href === location);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-5xl transition-all duration-300 ${
          scrolled ? 'glass-nav rounded-2xl px-4 py-2.5' : 'px-6 py-3'
        }`}
        style={{ borderRadius: scrolled ? '16px' : '0' }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Campus<span className="text-gradient-blue">Match</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location === link.href
                      ? 'text-white bg-white/[0.08]'
                      : 'text-white/50 hover:text-white/90 hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))
            ) : (
              <>
                <a href="/#features" className="px-3.5 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.04] transition-all">Features</a>
                <a href="/#how-it-works" className="px-3.5 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.04] transition-all">Verification</a>
                <a href="/#faq" className="px-3.5 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.04] transition-all">FAQ</a>
              </>
            )}
            {isAdmin && (
              <Link href="/admin" className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.startsWith('/admin') ? 'text-white bg-white/[0.08]' : 'text-white/50 hover:text-white/90 hover:bg-white/[0.04]'}`}>
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile avatar + dropdown trigger */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/[0.06] transition-all group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-blue-500/30 transition-colors">
                      <img
                        src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {user.verificationStatus === 'approved' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[hsl(235,25%,8%)] flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute right-0 top-full mt-2 w-64 glass-card rounded-2xl p-2 shadow-2xl shadow-black/40 overflow-hidden"
                    >
                      {/* User info */}
                      <div className="px-3 py-3 mb-1 border-b border-white/[0.06]">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/40 truncate">{user.email}</p>
                        {user.verificationStatus && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className={`w-2 h-2 rounded-full ${user.verificationStatus === 'approved' ? 'bg-green-500' : user.verificationStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                            <span className="text-xs text-white/50 capitalize">{user.verificationStatus}</span>
                          </div>
                        )}
                      </div>

                      {/* Menu items */}
                      {dropdownItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}

                      {/* Logout */}
                      <div className="mt-1 pt-1 border-t border-white/[0.06]">
                        <button
                          onClick={async () => { await logoutUser(); setDropdownOpen(false); }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-premium btn-secondary h-9 px-4 text-xs">
                  Sign In
                </Link>
                <Link href="/register" className="btn-premium btn-primary h-9 px-4 text-xs">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/[0.06] transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl md:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-72 glass-surface p-6 pt-20"
            >
              <button
                className="absolute top-5 right-5 text-white/60 hover:text-white p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                          <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        {user.verificationStatus === 'approved' && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[hsl(235,22%,8%)] flex items-center justify-center">
                            <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-white/40">{user.email}</p>
                      </div>
                    </div>
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          location === link.href ? 'text-white bg-white/[0.08]' : 'text-white/50 hover:text-white/90 hover:bg-white/[0.04]'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.04]">
                        Admin
                      </Link>
                    )}
                    <div className="pt-4 mt-4 border-t border-white/[0.06]">
                      {dropdownItems.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white/90 hover:bg-white/[0.04]"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="pt-2 mt-2 border-t border-white/[0.06]">
                      <button onClick={async () => { await logoutUser(); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 text-left">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.04]">Sign In</Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block mt-2">
                      <div className="btn-premium btn-primary w-full text-center">Get Started</div>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
