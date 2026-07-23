import React from 'react';
import { Link } from 'wouter';
import { Heart, Instagram, Mail, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/20">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Campus<span className="text-primary">Match</span></span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              The exclusive ERP-verified social network for college students. No fakes, no bots, just real students.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://www.instagram.com/campusmatch.in/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/30 transition-all" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="mailto:hello@campusmatch.in" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all" aria-label="Email us">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/discover" className="text-sm text-white/50 hover:text-white transition-colors">Discover</Link></li>
              <li><Link href="/matches" className="text-sm text-white/50 hover:text-white transition-colors">Matches</Link></li>
              <li><Link href="/friends" className="text-sm text-white/50 hover:text-white transition-colors">Friends</Link></li>
              <li><Link href="/events" className="text-sm text-white/50 hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/marketplace" className="text-sm text-white/50 hover:text-white transition-colors">Marketplace</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">About Us</Link></li>
              <li><a href="mailto:hello@campusmatch.in" className="text-sm text-white/50 hover:text-white transition-colors">Contact</a></li>
              <li><a href="mailto:hello@campusmatch.in" className="text-sm text-white/50 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><a href="mailto:privacy@campusmatch.in" className="text-sm text-white/50 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} CampusMatch. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Shield className="w-3 h-3" />
            <span>ERP-Verified Student Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
