import React from 'react';
import { Link } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ShieldCheck, Users, Zap, Lock, ChevronDown, ArrowRight,
  CheckCircle2, GraduationCap, CreditCard, Rocket, BadgeCheck,
  Heart, Globe, Crown, Star, Sparkles, ChevronRight
} from 'lucide-react';
import { useGetModulesSummary, useGetStatsOverview } from '@workspace/api-client-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const { data: statsData } = useGetStatsOverview();
  const { data: modulesData } = useGetModulesSummary();

  const stats = statsData || { activeModules: 12, verifiedUsers: 0, erpVerifiedProfiles: '100%', verificationTime: '< 24h' };

  const modules = modulesData?.modules || [
    { id: 'dating', name: 'Dating', emoji: '💗', description: 'Verified-only matches, mutual likes, safe chat', isPopular: true },
    { id: 'friends', name: 'Friends', emoji: '👥', description: 'Campus friends by branch, year, interests' },
    { id: 'study', name: 'Study Partners', emoji: '📚', description: 'Assignment help, exam prep, lab & project groups' },
    { id: 'career', name: 'Career Hub', emoji: '💼', description: 'Internships, referrals, mock interviews' },
    { id: 'hackathons', name: 'Hackathons', emoji: '💻', description: 'AI team builder, GitHub match, team chat' },
    { id: 'sports', name: 'Sports', emoji: '⚽', description: 'Teams, tournaments, ground booking' },
    { id: 'marketplace', name: 'Marketplace', emoji: '🛒', description: 'Buy & sell books, cycles, electronics', isNew: true },
    { id: 'events', name: 'Events', emoji: '🎉', description: 'RSVP, countdown timers, QR check-in' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* ===== HERO WITH VIDEO BG ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Full-screen video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4"
        />

        {/* Hero Content */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full flex flex-col items-center text-center mt-32 px-4 md:px-6 pb-20">
          {/* Glassmorphism tagline pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-pill rounded-[10px] h-[38px] flex items-center gap-2 px-4 mb-10"
          >
            <span className="px-2 py-0.5 rounded-[6px] bg-[#7b39fc] text-xs font-semibold text-white" style={{ fontFamily: 'Cabin' }}>New</span>
            <span className="text-sm font-medium text-white" style={{ fontFamily: 'Cabin' }}>Say Hello to CampusMatch v1.0</span>
          </motion.div>

          {/* Headline - Instrument Serif */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-white leading-[1.1] mb-6 max-w-5xl"
            style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(48px, 8vw, 96px)' }}
          >
            Your whole campus,<br />
            <span className="italic">one verified</span> app.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/70 max-w-[662px] mb-10 leading-relaxed"
            style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 400 }}
          >
            Find friends, study partners, dates, internships, and campus events — no fakes, no bots, just real ERP-verified students.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/register"
              className="h-14 px-8 inline-flex items-center justify-center rounded-[10px] bg-[#7b39fc] text-white font-medium text-base hover:bg-[#6a2ee0] transition-all shadow-lg shadow-[#7b39fc]/25"
              style={{ fontFamily: 'Cabin' }}
            >
              Get Verified <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="h-14 px-8 inline-flex items-center justify-center rounded-[10px] bg-[#2b2344] text-[#f6f7f9] font-medium text-base hover:bg-[#362e54] transition-all"
              style={{ fontFamily: 'Cabin' }}
            >
              How It Works
            </a>
          </motion.div>

          {/* Profile Mockup floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-20 relative hidden lg:block"
          >
            <div className="cm-profile-float">
              <div className="relative w-[340px] glass-card rounded-3xl p-6 cm-glow-border">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7b39fc]/40 to-[#2b2344]/60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=CampusStudent&backgroundColor=b6e3f4" alt="Profile" className="w-28 h-28 rounded-full border-4 border-white/20 shadow-xl" />
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-300 flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Priya Sharma</h3>
                <p className="text-sm text-purple-300/80 mb-3" style={{ fontFamily: 'Manrope' }}>B.Tech CSE • 3rd Year • VGU</p>
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-xs text-white/70 border border-white/10">🎨 UI/UX</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-xs text-white/70 border border-white/10">💻 React</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-xs text-white/70 border border-white/10">☕ Coffee</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 py-2">
                    <div className="text-base font-bold text-white">128</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wide">Friends</div>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 py-2">
                    <div className="text-base font-bold text-white">42</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wide">Matches</div>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 py-2">
                    <div className="text-base font-bold text-white">8</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wide">Events</div>
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute -top-6 -right-10 w-52 glass-card rounded-xl p-3 cm-animate-float-2"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <span className="text-xs font-medium text-white" style={{ fontFamily: 'Manrope' }}>New Match!</span>
                </div>
                <p className="text-[11px] text-white/50">Rahul from CSE wants to connect</p>
              </motion.div>

              {/* Floating ERP badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="absolute -bottom-4 -left-8 glass-card rounded-xl p-3 flex items-center gap-2.5 cm-animate-float-1"
              >
                <div className="w-8 h-8 rounded-lg bg-[#7b39fc]/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#7b39fc]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white" style={{ fontFamily: 'Manrope' }}>ERP Verified</div>
                  <div className="text-[10px] text-white/40">Identity Confirmed</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== ABOUT US ===== */}
      <section className="py-24 px-4 md:px-6 bg-[#0e0a1a]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-[#7b39fc] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Cabin' }}>About Us</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Built by students, for students.
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed" style={{ fontFamily: 'Inter' }}>
              CampusMatch was born from a simple frustration — college social platforms are filled with fake profiles, spam, and noise. We built a space where every single user is a verified student.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: '100% Verified', desc: 'Every account is verified against university ERP. Only real students get in.' },
              { icon: Globe, title: 'Beyond Dating', desc: "Study groups, career networking, hackathons, marketplace, sports — it's your entire campus in one app." },
              { icon: Lock, title: 'Privacy First', desc: 'End-to-end encrypted chats, no data selling, no ads. Your data stays yours.' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="glass-card rounded-2xl p-8 text-center cm-card-elevate group">
                <div className="w-14 h-14 rounded-2xl bg-[#7b39fc]/10 border border-[#7b39fc]/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-[#7b39fc]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Manrope' }}>{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed" style={{ fontFamily: 'Inter' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 px-4 md:px-6 bg-[#120d20] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-[#7b39fc] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Cabin' }}>Features</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Everything Campus. One App.
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg" style={{ fontFamily: 'Inter' }}>
              From finding a date to acing your exams — CampusMatch covers your entire campus life.
            </p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((mod) => (
              <motion.div key={mod.id} variants={fadeUp} custom={0} className="glass-card p-6 rounded-2xl group hover:border-[#7b39fc]/30 transition-all duration-300 relative overflow-hidden cm-card-elevate">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7b39fc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="text-4xl">{mod.emoji}</div>
                  <div className="flex gap-1.5">
                    {mod.isPopular && <span className="px-2 py-0.5 rounded-full bg-[#7b39fc]/20 text-[#a78bfa] text-[10px] font-bold uppercase tracking-wide" style={{ fontFamily: 'Cabin' }}>Hot</span>}
                    {mod.isNew && <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wide" style={{ fontFamily: 'Cabin' }}>New</span>}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 relative z-10" style={{ fontFamily: 'Manrope' }}>{mod.name}</h3>
                <p className="text-sm text-white/45 leading-relaxed relative z-10" style={{ fontFamily: 'Inter' }}>{mod.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW ERP VERIFICATION WORKS ===== */}
      <section id="how-it-works" className="py-24 px-4 md:px-6 bg-[#0e0a1a]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-[#7b39fc] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Cabin' }}>How It Works</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
              ERP Verification. Zero Fakes.
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg" style={{ fontFamily: 'Inter' }}>
              We manually verify every single account against the university ERP system.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-[#7b39fc]/40 to-transparent z-0" />
            {[
              { step: 1, icon: GraduationCap, title: 'Sign Up', desc: 'Create your account with college email and verify via OTP.' },
              { step: 2, icon: CreditCard, title: 'Submit ERP', desc: 'Enter your ERP number and upload your student ID card.' },
              { step: 3, icon: ShieldCheck, title: 'Review', desc: 'Our team manually verifies against the ERP database within 24 hours.' },
              { step: 4, icon: Rocket, title: 'Full Access', desc: 'Unlock all modules — dating, friends, marketplace, events, and more.' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-background border-2 border-[#7b39fc]/30 flex items-center justify-center shadow-lg shadow-[#7b39fc]/10">
                    <s.icon className="w-8 h-8 text-[#7b39fc]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#7b39fc] text-white text-xs font-bold flex items-center justify-center" style={{ fontFamily: 'Cabin' }}>
                    {s.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Manrope' }}>{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-[200px]" style={{ fontFamily: 'Inter' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBSCRIPTION / PRICING ===== */}
      <section id="pricing" className="py-24 px-4 md:px-6 bg-[#120d20] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-[#7b39fc] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Cabin' }}>Plans</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg" style={{ fontFamily: 'Inter' }}>
              Start free. Upgrade when you want superpowers.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '₹0', period: 'forever', desc: 'Everything you need to get started', features: ['Basic profile', 'Friend requests', 'Browse marketplace', 'Join events', 'ERP verification'], cta: 'Get Started', popular: false, href: '/register' },
              { name: 'Premium', price: '₹99', period: '/month', desc: 'Unlock the full campus experience', features: ['Everything in Free', 'Unlimited matches', 'See who viewed you', 'Priority in discover', 'Advanced filters', 'Read receipts'], cta: 'Go Premium', popular: true, href: '/register' },
              { name: 'Lifetime', price: '₹499', period: 'one-time', desc: 'Best value — pay once, use forever', features: ['Everything in Premium', 'Lifetime access', 'Exclusive badge', 'Priority support', 'Early feature access', 'Founding member status'], cta: 'Get Lifetime', popular: false, href: '/register' },
            ].map((plan, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className={`relative rounded-2xl p-[1px] ${plan.popular ? 'bg-gradient-to-b from-[#7b39fc] to-[#2b2344]' : 'bg-white/10'}`}>
                {plan.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#7b39fc] text-xs font-bold text-white shadow-lg shadow-[#7b39fc]/30" style={{ fontFamily: 'Cabin' }}>Most Popular</div>}
                <div className={`rounded-[15px] p-7 h-full flex flex-col ${plan.popular ? 'bg-card' : 'bg-card/60'}`}>
                  <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Manrope' }}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Manrope' }}>{plan.price}</span>
                    <span className="text-sm text-white/40">{plan.period}</span>
                  </div>
                  <p className="text-sm text-white/50 mb-6" style={{ fontFamily: 'Inter' }}>{plan.desc}</p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/60" style={{ fontFamily: 'Inter' }}>
                        <CheckCircle2 className="w-4 h-4 text-[#7b39fc] mt-0.5 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className={`h-12 inline-flex items-center justify-center rounded-[10px] font-semibold transition-all ${plan.popular ? 'bg-[#7b39fc] text-white hover:bg-[#6a2ee0]' : 'bg-[#2b2344] text-[#f6f7f9] hover:bg-[#362e54]'}`} style={{ fontFamily: 'Cabin' }}>
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-24 px-4 md:px-6 bg-[#0e0a1a]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-[#7b39fc] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Cabin' }}>FAQ</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="space-y-4">
            {[
              { q: 'Who can use CampusMatch?', a: 'Currently, CampusMatch is exclusively available for VGU students. You need a valid ERP number to register.' },
              { q: 'How does ERP verification work?', a: 'After signing up, you submit your ERP number and student ID. Our team manually verifies it against the university database within 24 hours.' },
              { q: 'Is CampusMatch free?', a: 'Yes! CampusMatch is completely free for all verified students. We also offer Premium and Lifetime plans for power users.' },
              { q: 'Is my data safe?', a: "Absolutely. We use end-to-end encryption, never sell your data, and don't show ads. Your privacy is our top priority." },
              { q: 'Can I use it for finding study partners?', a: "Yes! CampusMatch has dedicated modules for study partners, hackathons, career networking, and more — it's not just about dating." },
            ].map((faq, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="glass-card rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-semibold hover:text-[#a78bfa] transition-colors list-none" style={{ fontFamily: 'Manrope' }}>
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-white/40 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed" style={{ fontFamily: 'Inter' }}>{faq.a}</div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-4 md:px-6 bg-[#0e0a1a]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center relative p-[1px] rounded-3xl bg-gradient-to-b from-[#7b39fc]/30 to-[#2b2344]/20">
          <div className="bg-card/90 backdrop-blur-2xl rounded-[23px] p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7b39fc]/5 to-transparent pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Ready to join your campus?
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto relative z-10" style={{ fontFamily: 'Inter' }}>
              Join hundreds of verified VGU students already on CampusMatch. It takes 2 minutes to sign up.
            </p>
            <Link href="/register" className="h-16 px-10 inline-flex items-center justify-center rounded-[10px] bg-[#7b39fc] text-white font-bold text-lg hover:bg-[#6a2ee0] transition-all transform hover:scale-105 relative z-10 shadow-lg shadow-[#7b39fc]/25 cm-button-glow" style={{ fontFamily: 'Cabin' }}>
              Apply for Verification Now <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <p className="mt-5 text-sm text-white/30 relative z-10" style={{ fontFamily: 'Inter' }}>100% free for verified students. No credit card needed.</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
