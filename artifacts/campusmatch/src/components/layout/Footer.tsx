import React from 'react';
import { Link } from 'wouter';
import { Heart, Instagram, Mail, Shield } from 'lucide-react';

export const Footer = () => (
  <footer className="relative z-10 border-t border-white/5 bg-[#0d0810]/80 backdrop-blur-sm mt-auto">
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#ec4899] flex items-center justify-center"><Heart className="w-4 h-4 text-white fill-white" /></div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>Campus<span className="text-[#ec4899]">Match</span></span>
          </Link>
          <p className="text-sm text-white/50 leading-relaxed" style={{ fontFamily: 'Inter' }}>The exclusive ERP-verified social network for college students.</p>
          <div className="flex items-center gap-3 mt-4">
            <a href="https://www.instagram.com/campusmatch.in/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-pink-400 hover:bg-pink-500/10 transition-all"><Instagram className="w-4 h-4" /></a>
            <a href="mailto:hello@campusmatch.in" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-pink-400 hover:bg-pink-500/10 transition-all"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4" style={{ fontFamily: 'Outfit' }}>Platform</h4>
          <ul className="space-y-3">
            {[['Discover', '/discover'], ['Matches', '/matches'], ['Friends', '/friends'], ['Events', '/events'], ['Marketplace', '/marketplace']].map(([l, h]) => (
              <li key={h}><Link href={h} className="text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: 'Inter' }}>{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4" style={{ fontFamily: 'Outfit' }}>Company</h4>
          <ul className="space-y-3">
            <li><Link href="/" className="text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: 'Inter' }}>About Us</Link></li>
            <li><a href="mailto:hello@campusmatch.in" className="text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: 'Inter' }}>Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4" style={{ fontFamily: 'Outfit' }}>Legal</h4>
          <ul className="space-y-3">
            <li><Link href="/terms" className="text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: 'Inter' }}>Terms of Service</Link></li>
            <li><Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: 'Inter' }}>Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/40" style={{ fontFamily: 'Inter' }}>&copy; {new Date().getFullYear()} CampusMatch. All rights reserved.</p>
        <div className="flex items-center gap-2 text-xs text-white/40" style={{ fontFamily: 'Inter' }}><Shield className="w-3 h-3" /><span>ERP-Verified Student Community</span></div>
      </div>
    </div>
  </footer>
);
