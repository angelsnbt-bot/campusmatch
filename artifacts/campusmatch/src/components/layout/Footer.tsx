import React from 'react';
import { Link } from 'wouter';
import { Zap, Github, Twitter, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/[0.04] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Campus<span className="text-gradient-blue">Match</span>
              </span>
            </Link>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              The verified campus network. Real students, real connections.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Platform</h4>
            <div className="space-y-2.5">
              {['Discover', 'Matches', 'Friends', 'Events', 'Marketplace'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="block text-sm text-white/30 hover:text-white/70 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Company</h4>
            <div className="space-y-2.5">
              {[
                { label: 'About', href: '/#about' },
                { label: 'Careers', href: '/' },
                { label: 'Blog', href: '/' },
                { label: 'Press', href: '/' },
              ].map(item => (
                <a key={item.label} href={item.href} className="block text-sm text-white/30 hover:text-white/70 transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Legal</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/' },
                { label: 'Security', href: '/' },
              ].map(item => (
                <Link key={item.label} href={item.href} className="block text-sm text-white/30 hover:text-white/70 transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} CampusMatch. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-white/20 text-xs">
            Built with <Heart className="w-3 h-3 text-blue-400 mx-1" fill="currentColor" /> for verified students
          </div>
        </div>
      </div>
    </footer>
  );
};
