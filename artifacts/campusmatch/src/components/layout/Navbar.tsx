import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-20 px-6 md:px-[80px] lg:px-[120px] py-[16px]">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#ec4899] flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>Campus<span className="text-[#ec4899]">Match</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                {[['Dashboard', '/dashboard'], ['Discover', '/discover'], ['Matches', '/matches'], ['Friends', '/friends'], ['Events', '/events'], ['Marketplace', '/marketplace']].map(([label, href]) => (
                  <Link key={href} href={href} className="text-sm font-medium text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'Outfit' }}>{label}</Link>
                ))}
                {isAdmin && <Link href="/admin" className="text-sm font-medium text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'Outfit' }}>Admin</Link>}
              </>
            ) : (
              <>
                <a href="/#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'Outfit' }}>Features</a>
                <a href="/#how-it-works" className="text-sm font-medium text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'Outfit' }}>Verification</a>
                <a href="/#faq" className="text-sm font-medium text-white/70 hover:text-white transition-colors" style={{ fontFamily: 'Outfit' }}>FAQ</a>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile"><img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full border border-white/20" /></Link>
                <Button variant="ghost" size="sm" onClick={logoutUser} className="text-white/70 hover:text-white hover:bg-white/10" style={{ fontFamily: 'Outfit' }}>Logout</Button>
              </div>
            ) : (
              <>
                <Link href="/login" className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-white text-gray-900 font-semibold text-sm border border-gray-200 hover:bg-gray-100 transition-all" style={{ fontFamily: 'Outfit' }}>Sign In</Link>
                <Link href="/register" className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#ec4899] text-white font-semibold text-sm shadow-lg shadow-pink-500/20 hover:bg-[#db2777] transition-all" style={{ fontFamily: 'Outfit' }}>Get Started</Link>
              </>
            )}
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden">
            <button className="absolute top-6 right-6 text-white p-2" onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
            {user ? (
              <>
                {[['Dashboard', '/dashboard'], ['Discover', '/discover'], ['Matches', '/matches'], ['Friends', '/friends'], ['Events', '/events'], ['Marketplace', '/marketplace'], ['Profile', '/profile']].map(([label, href]) => (
                  <Link key={href} href={href} className="text-2xl font-medium text-white" style={{ fontFamily: 'Outfit' }} onClick={() => setMobileMenuOpen(false)}>{label}</Link>
                ))}
                <button onClick={async () => { await logoutUser(); setMobileMenuOpen(false); }} className="mt-4 h-12 px-8 rounded-lg bg-white/10 text-white font-semibold" style={{ fontFamily: 'Outfit' }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-2xl font-medium text-white" style={{ fontFamily: 'Outfit' }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/register" className="h-14 px-10 inline-flex items-center justify-center rounded-lg bg-[#ec4899] text-white font-semibold text-lg shadow-lg" style={{ fontFamily: 'Outfit' }} onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
