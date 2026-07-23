import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Discover', href: '/discover' },
  { label: 'Matches', href: '/matches' },
  { label: 'Friends', href: '/friends' },
  { label: 'Events', href: '/events' },
  { label: 'Marketplace', href: '/marketplace' },
];

export const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

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
              <div className="flex items-center gap-2.5">
                <Link href="/profile" className="relative group">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full ring-2 ring-blue-500/0 group-hover:ring-blue-500/30 transition-all" />
                </Link>
                <Button variant="ghost" size="sm" onClick={logoutUser} className="text-white/40 hover:text-white/80 hover:bg-white/[0.06] text-xs">
                  Logout
                </Button>
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
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-full h-full object-cover" />
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
                      <button onClick={async () => { await logoutUser(); setMobileMenuOpen(false); }} className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.04] text-left">
                        Logout
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
