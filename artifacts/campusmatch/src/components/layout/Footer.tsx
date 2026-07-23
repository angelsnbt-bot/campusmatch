import React from 'react';
import { Link } from 'wouter';
import { Zap, Heart, Mail, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import Hyperspeed from '@/components/ui/Hyperspeed';

const footerSections = [
  {
    title: 'Company',
    links: [
      { label: 'About CampusMatch', href: '/about' },
      { label: 'Our Mission', href: '/mission' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: 'mailto:hello@campusmatch.in' },
    ]
  },
  {
    title: 'Features',
    links: [
      { label: 'Student Matching', href: '/discover' },
      { label: 'Verified Students', href: '/verify' },
      { label: 'Events', href: '/events' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Communities', href: '/friends' },
      { label: 'Networking', href: '/discover' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Safety Center', href: '/safety' },
      { label: 'Community Guidelines', href: '/guidelines' },
      { label: 'Release Notes', href: '/releases' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
      { label: 'Refund Policy', href: '/refunds' },
      { label: 'Accessibility', href: '/accessibility' },
    ]
  }
];

const socialLinks = [
  { icon: Mail, href: 'mailto:hello@campusmatch.in', label: 'Email' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/[0.04] mt-20 overflow-hidden">
      <Hyperspeed className="absolute inset-0 opacity-30" effectActive={true} speed={0.4} roadWidth={1.2} colors={['#3b82f6', '#8b5cf6']} quality="medium" />
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Campus<span className="text-gradient-blue">Match</span>
              </span>
            </Link>
            <p className="text-white/30 text-sm leading-relaxed">
              The verified campus network. Real students, real connections. Built for the modern campus experience.
            </p>
            <div className="flex items-center gap-2 mt-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {footerSections.map(section => (
              <div key={section.title}>
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{section.title}</h4>
                <div className="space-y-2.5">
                  {section.links.map(link => (
                    link.href.startsWith('mailto:') ? (
                      <a key={link.label} href={link.href} className="block text-sm text-white/30 hover:text-white/70 transition-colors">{link.label}</a>
                    ) : (
                      <Link key={link.label} href={link.href} className="block text-sm text-white/30 hover:text-white/70 transition-colors">{link.label}</Link>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white/20 text-xs">
            <p>&copy; {new Date().getFullYear()} CampusMatch. All rights reserved.</p>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline" style={{ fontFamily: "'Space Grotesk', monospace" }}>v1.0.0</span>
          </div>
          <div className="flex items-center gap-1 text-white/20 text-xs">
            Built with <Heart className="w-3 h-3 text-blue-400 mx-1" fill="currentColor" /> for verified students
          </div>
        </div>
      </div>
    </footer>
  );
};
