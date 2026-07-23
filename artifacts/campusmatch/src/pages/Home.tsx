import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ShieldCheck, ChevronDown, ArrowRight, CheckCircle2,
  GraduationCap, CreditCard, Rocket, BadgeCheck, Heart, Globe, Lock
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

function LiveUserCounter() {
  const { data: statsData } = useGetStatsOverview();
  const [count, setCount] = useState(0);
  const target = statsData?.verifiedUsers || 0;

  useEffect(() => {
    if (!target) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-black text-white tabular-nums">
        {count.toLocaleString()}
      </span>
      <span className="text-sm font-semibold text-blue-300/70">+</span>
    </div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const { data: modulesData } = useGetModulesSummary();

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
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Video background */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4" />

        <div className="relative z-10 w-full min-h-screen flex items-center px-6 md:px-[80px] lg:px-[120px] py-24">

          {/* LEFT: Text content */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex-1 max-w-2xl z-10">
            {/* Total Users counter — top left */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 flex items-center gap-3"
            >
              <LiveUserCounter />
              <span className="text-xs text-white/40 uppercase tracking-widest" style={{ fontWeight: 500 }}>Real Users</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-white leading-[1.08] mb-6"
              style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
            >
              Your whole campus,<br />
              <span className="italic">one verified</span> app.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/60 max-w-[520px] mb-10 leading-relaxed"
              style={{ fontSize: '17px' }}
            >
              Find friends, study partners, dates, internships, and campus events — no fakes, no bots, just real ERP-verified students.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link href="/register" className="h-14 px-8 inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-base hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20">
                Get Verified <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="h-14 px-8 inline-flex items-center justify-center rounded-[10px] bg-white/[0.06] text-white/90 font-semibold text-base border border-white/10 hover:bg-white/[0.1] transition-all">
                How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT: Animated profile card */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="hidden lg:flex items-center justify-center flex-shrink-0 ml-12"
          >
            <div className="animate-float">
              {/* Small profile card */}
              <div className="w-[270px] card-premium rounded-2xl p-4 animate-border-flow">
                <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/25" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=c0aede"
                      alt="Demo profile"
                      className="w-22 h-22 rounded-full border-[3px] border-white/20 shadow-lg"
                      style={{ width: '88px', height: '88px' }}
                    />
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] text-blue-300 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Verified
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-0.5">Aarav Mehta</h3>
                <p className="text-[11px] text-blue-300/60 mb-2">B.Tech CSE • 2nd Year • VGU</p>
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/60 border border-white/5">🤖 AI/ML</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/60 border border-white/5">🎮 Gaming</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-white/[0.03] border border-white/5 py-1.5">
                    <div className="text-sm font-bold text-white">96</div>
                    <div className="text-[9px] text-white/35 uppercase tracking-wide">Friends</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] border border-white/5 py-1.5">
                    <div className="text-sm font-bold text-white">24</div>
                    <div className="text-[9px] text-white/35 uppercase tracking-wide">Matches</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] border border-white/5 py-1.5">
                    <div className="text-sm font-bold text-white">5</div>
                    <div className="text-[9px] text-white/35 uppercase tracking-wide">Events</div>
                  </div>
                </div>
              </div>

              {/* Floating notification - purple glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="absolute -top-4 -left-14 w-44 card-premium rounded-xl p-2.5 animate-float shadow-[0_0_20px_rgba(59,130,246,0.15)]"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-purple-400" />
                  </div>
                  <span className="text-[11px] font-semibold text-white">New Match!</span>
                </div>
                <p className="text-[10px] text-white/40">Someone nearby likes you</p>
              </motion.div>

              {/* Floating ERP badge - purple glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="absolute -bottom-3 -left-6 card-premium rounded-xl p-2.5 flex items-center gap-2 animate-float shadow-[0_0_20px_rgba(59,130,246,0.15)]"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white">ERP Verified</div>
                  <div className="text-[9px] text-white/35">Identity Confirmed</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5 text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-24 px-4 md:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">About Us</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">Built by students, for students.</h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
              CampusMatch was born from a simple frustration — college social platforms are filled with fake profiles. We built a space where every user is a verified student.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: '100% Verified', desc: 'Every account verified against university ERP. Only real students.' },
              { icon: Globe, title: 'Beyond Dating', desc: 'Study groups, career networking, hackathons, marketplace, sports.' },
              { icon: Lock, title: 'Privacy First', desc: 'End-to-end encrypted chats, no data selling, no ads.' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="card-premium rounded-2xl p-8 text-center group">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 px-4 md:px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Features</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything Campus. One App.</h2>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((mod) => (
              <motion.div key={mod.id} variants={fadeUp} custom={0} className="card-premium p-6 rounded-2xl group hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="text-3xl">{mod.emoji}</div>
                  <div className="flex gap-1.5">
                    {mod.isPopular && <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">Hot</span>}
                    {mod.isNew && <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">New</span>}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 relative z-10">{mod.name}</h3>
                <p className="text-sm text-white/45 leading-relaxed relative z-10">{mod.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-4 md:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">ERP Verification. Zero Fakes.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-0" />
            {[
              { step: 1, icon: GraduationCap, title: 'Sign Up', desc: 'Create account with college email, verify via OTP.' },
              { step: 2, icon: CreditCard, title: 'Submit ERP', desc: 'Enter ERP number and upload student ID card.' },
              { step: 3, icon: ShieldCheck, title: 'Review', desc: 'Team manually verifies within 24 hours.' },
              { step: 4, icon: Rocket, title: 'Full Access', desc: 'Unlock all modules and features.' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-background border-2 border-blue-500/20 flex items-center justify-center">
                    <s.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">{s.step}</div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-[200px]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 px-4 md:px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Plans</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '₹0', period: 'forever', features: ['Basic profile', 'Friend requests', 'Browse marketplace', 'Join events', 'ERP verification'], cta: 'Get Started', popular: false },
              { name: 'Premium', price: '₹99', period: '/month', features: ['Unlimited matches', 'See who viewed you', 'Priority in discover', 'Advanced filters', 'Read receipts'], cta: 'Go Premium', popular: true },
              { name: 'Lifetime', price: '₹499', period: 'one-time', features: ['Lifetime access', 'Exclusive badge', 'Priority support', 'Early feature access', 'Founding member'], cta: 'Get Lifetime', popular: false },
            ].map((plan, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className={`relative rounded-2xl p-[1px] ${plan.popular ? 'bg-gradient-to-b from-blue-500 to-indigo-500' : 'bg-white/10'}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-blue-500/30">Most Popular</div>}
                <div className={`rounded-[15px] p-7 h-full flex flex-col ${plan.popular ? 'bg-card' : 'bg-card/60'}`}>
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-sm text-white/40">{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 my-6 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className={`h-12 inline-flex items-center justify-center rounded-[10px] font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700' : 'bg-white/[0.06] text-white/90 border border-white/10 hover:bg-white/[0.1]'}`}>
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-24 px-4 md:px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-4">
            {[
              { q: 'Who can use CampusMatch?', a: 'Currently available for VGU students. You need a valid ERP number to register.' },
              { q: 'How does ERP verification work?', a: 'Submit your ERP number and student ID. Our team verifies against the university database within 24 hours.' },
              { q: 'Is CampusMatch free?', a: 'Yes! Completely free for verified students. Premium plans available for power users.' },
              { q: 'Is my data safe?', a: 'End-to-end encryption, no data selling, no ads. Your privacy is our priority.' },
              { q: 'Can I find study partners?', a: 'Yes! Dedicated modules for study groups, hackathons, career networking, and more.' },
            ].map((faq, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="card-premium rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-semibold hover:text-blue-300 transition-colors list-none">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-white/40 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{faq.a}</div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-4 md:px-6 bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center relative p-[1px] rounded-3xl bg-gradient-to-b from-blue-500/20 to-indigo-500/10">
          <div className="bg-card/90 backdrop-blur-2xl rounded-[23px] p-12 md:p-16 relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to join your campus?</h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto relative z-10">
              Join hundreds of verified VGU students. It takes 2 minutes to sign up.
            </p>
            <Link href="/register" className="h-16 px-10 inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 relative z-10 shadow-lg shadow-blue-500/25">
              Apply for Verification Now <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <p className="mt-5 text-sm text-white/30 relative z-10">100% free for verified students.</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
