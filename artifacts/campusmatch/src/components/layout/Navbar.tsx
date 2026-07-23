import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-20 px-6 md:px-[120px] py-[16px]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#7b39fc] flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-white font-[Manrope]">Campus<span className="text-[#7b39fc]">Match</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                {[
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Discover', href: '/discover' },
                  { label: 'Matches', href: '/matches' },
                  { label: 'Friends', href: '/friends' },
                  { label: 'Events', href: '/events' },
                  { label: 'Marketplace', href: '/marketplace' },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm font-medium text-white/80 hover:text-white transition-opacity hover:opacity-80" style={{ fontFamily: 'Manrope' }}>
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link href="/admin" className="text-sm font-medium text-white/80 hover:text-white transition-opacity hover:opacity-80" style={{ fontFamily: 'Manrope' }}>
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <a href="/#features" className="text-sm font-medium text-white/80 hover:text-white transition-opacity hover:opacity-80" style={{ fontFamily: 'Manrope' }}>Features</a>
                <a href="/#how-it-works" className="text-sm font-medium text-white/80 hover:text-white transition-opacity hover:opacity-80" style={{ fontFamily: 'Manrope' }}>
                  Verification
                </a>
                <a href="/#faq" className="text-sm font-medium text-white/80 hover:text-white transition-opacity hover:opacity-80" style={{ fontFamily: 'Manrope' }}>FAQ</a>
              </>
            )}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full border border-white/20" />
                </Link>
                <Button variant="ghost" size="sm" onClick={logoutUser} className="text-white/70 hover:text-white hover:bg-white/10" style={{ fontFamily: 'Manrope' }}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login" className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-white text-[#171717] font-semibold text-sm border border-[#d4d4d4] hover:bg-white/90 transition-all" style={{ fontFamily: 'Manrope' }}>
                  Sign In
                </Link>
                <Link href="/register" className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#7b39fc] text-[#fafafa] font-semibold text-sm shadow-lg shadow-[#7b39fc]/20 hover:bg-[#6a2ee0] transition-all" style={{ fontFamily: 'Manrope' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Full-screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button className="absolute top-6 right-6 text-white p-2" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>

            {user ? (
              <>
                <Link href="/dashboard" className="text-2xl font-medium text-white" style={{ fontFamily: 'Manrope' }} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <Link href="/discover" className="text-2xl font-medium text-white" style={{ fontFamily: 'Manrope' }} onClick={() => setMobileMenuOpen(false)}>Discover</Link>
                <Link href="/matches" className="text-2xl font-medium text-white" style={{ fontFamily: 'Manrope' }} onClick={() => setMobileMenuOpen(false)}>Matches</Link>
                <Link href="/friends" className="text-2xl font-medium text-white" style={{ fontFamily: 'Manrope' }} onClick={() => setMobileMenuOpen(false)}>Friends</Link>
                <Link href="/events" className="text-2xl font-medium text-white" style={{ fontFamily: 'Manrope' }} onClick={() => setMobileMenuOpen(false)}>Events</Link>
                <Link href="/marketplace" className="text-2xl font-medium text-white" style={{ fontFamily: 'Manrope' }} onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
                <Link href="/profile" className="text-2xl font-medium text-white" style={{ fontFamily: 'Manrope' }} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                {isAdmin && (
                  <Link href="/admin" className="text-2xl font-medium text-white" style={{ fontFamily: 'Manrope' }} onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                )}
                <button onClick={async () => { await logoutUser(); setMobileMenuOpen(false); }} className="mt-4 h-12 px-8 rounded-lg bg-white/10 text-white font-semibold" style={{ fontFamily: 'Manrope' }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-2xl font-medium text-white" style={{ fontFamily: 'Manrope' }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/register" className="h-14 px-10 inline-flex items-center justify-center rounded-lg bg-[#7b39fc] text-white font-semibold text-lg shadow-lg" style={{ fontFamily: 'Manrope' }} onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
