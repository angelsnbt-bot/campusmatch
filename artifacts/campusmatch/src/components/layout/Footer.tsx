import React from 'react';
import { Link } from 'wouter';
import { Zap, Heart, Mail, Instagram, Twitter, Linkedin, Youtube, ExternalLink } from 'lucide-react';
import Hyperspeed from '@/components/ui/Hyperspeed';

const footerSections = [
  {
    title: 'Company',
    links: [
      { label: 'About CampusMatch', href: '/#about' },
      { label: 'Our Mission', href: '/#about' },
      { label: 'Careers', href: '#', modal: 'Careers' },
      { label: 'Press Kit', href: '#', modal: 'Press Kit' },
      { label: 'Blog', href: '#', modal: 'Blog' },
      { label: 'Contact', href: '#', modal: 'Contact' },
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
      { label: 'FAQ', href: '/#faq' },
      { label: 'Documentation', href: '#', modal: 'Documentation' },
      { label: 'Safety Center', href: '#', modal: 'Safety Center' },
      { label: 'Community Guidelines', href: '#', modal: 'Community Guidelines' },
      { label: 'Release Notes', href: '#', modal: 'Release Notes' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '#', modal: 'Cookie Policy' },
      { label: 'GDPR', href: '#', modal: 'GDPR' },
      { label: 'Refund Policy', href: '#', modal: 'Refund Policy' },
      { label: 'Accessibility', href: '#', modal: 'Accessibility' },
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

export function FooterModal({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="text-sm text-white/50 leading-relaxed space-y-3">
          <p>This section is coming soon. CampusMatch is constantly evolving to serve the campus community better.</p>
          <p>Stay tuned for updates, or reach out to us at <span className="text-blue-400">hello@campusmatch.in</span> for any inquiries.</p>
        </div>
        <button onClick={onClose} className="mt-6 w-full btn-premium btn-primary text-sm py-2.5">Got it</button>
      </div>
    </div>
  );
}

export const Footer = () => {
  const [modal, setModal] = React.useState<string | null>(null);

  return (
    <>
      <footer className="relative z-10 border-t border-white/[0.04] mt-20 overflow-hidden">
        <Hyperspeed
          className="absolute inset-0 opacity-30"
          effectActive={true}
          speed={0.4}
          roadWidth={1.2}
          colors={['#3b82f6', '#8b5cf6']}
          quality="medium"
        />
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Top section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
            {/* Brand */}
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
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {footerSections.map(section => (
                <div key={section.title}>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{section.title}</h4>
                  <div className="space-y-2.5">
                    {section.links.map(link => (
                      link.href.startsWith('/') ? (
                        <Link key={link.label} href={link.href} className="block text-sm text-white/30 hover:text-white/70 transition-colors">
                          {link.label}
                        </Link>
                      ) : (
                        <button
                          key={link.label}
                          onClick={() => link.modal ? setModal(link.modal) : window.open(link.href, '_blank')}
                          className="block text-sm text-white/30 hover:text-white/70 transition-colors text-left"
                        >
                          {link.label}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
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

      {modal && <FooterModal title={modal} onClose={() => setModal(null)} />}
    </>
  );
};
