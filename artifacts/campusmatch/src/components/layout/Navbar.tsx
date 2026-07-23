import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isPublicRoute = ['/', '/login', '/register'].includes(location);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-card border-b border-white/5 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/20">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Campus<span className="text-primary">Match</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/discover" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Discover</Link>
                <Link href="/matches" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Matches</Link>
                <div className="flex items-center gap-4 ml-4">
                  <Link href="/profile" className="flex items-center gap-2">
                    <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full border border-white/20" />
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logoutUser} className="text-white/70 hover:text-white hover:bg-white/10">Logout</Button>
                </div>
              </>
            ) : (
              <>
                <a href="#modules" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Modules</a>
                <a href="#how-it-works" className="text-sm font-medium text-white/80 hover:text-white transition-colors">How it works</a>
                <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Log in</Link>
                <Link href="/register" className="h-10 px-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                  Get Verified
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass-card border-b border-white/10 p-4 md:hidden flex flex-col gap-4"
          >
            {user ? (
              <>
                <Link href="/dashboard" className="p-2 text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <Link href="/discover" className="p-2 text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Discover</Link>
                <Link href="/profile" className="p-2 text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <Button variant="outline" className="w-full justify-center mt-2 border-white/20 text-white" onClick={() => { logoutUser(); setMobileMenuOpen(false); }}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="p-2 text-white/80 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                <Link href="/register" className="w-full h-11 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium mt-2" onClick={() => setMobileMenuOpen(false)}>
                  Get Verified
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
