import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ShieldCheck, ChevronDown, ArrowRight, CheckCircle2,
  GraduationCap, CreditCard, Rocket, BadgeCheck, Heart, Globe, Lock,
  Users, CalendarDays, TrendingUp, Star, Zap, MessageCircle,
  Sparkles, Award, Clock, ArrowUpRight, Quote, Play,
  Eye, Search, Bell, Smartphone, BookOpen, Target, Flame,
  UserPlus, Upload, ScanLine, ChevronRight, X
} from 'lucide-react';
import { BorderGlow } from '@/components/ui/BorderGlow';
import { ButtonCta } from '@/components/ui/button-shiny';
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

function AnimatedCounter({ target, suffix = '', duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !target) return;
    let start = 0;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, inView]);

  return (
    <div ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

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
      <span className="text-sm font-semibold text-pink-300/70">+</span>
    </div>
  );
}

const testimonials = [
  { name: 'Priya Sharma', role: 'B.Tech CSE, 3rd Year', quote: 'CampusMatch helped me find my study group for finals. We still meet every week!', avatar: 'Priya', rating: 5 },
  { name: 'Rahul Verma', role: 'B.Tech ECE, 2nd Year', quote: 'Found my hackathon team here. We won the college-level competition!', avatar: 'Rahul', rating: 5 },
  { name: 'Aisha Khan', role: 'MBA, 1st Year', quote: 'The marketplace is amazing. Sold my old textbooks in 2 days.', avatar: 'Aisha', rating: 5 },
  { name: 'Dev Patel', role: 'B.Tech IT, 4th Year', quote: 'Landed my internship through CampusMatch career hub. Best platform ever.', avatar: 'Dev', rating: 5 },
  { name: 'Sneha Reddy', role: 'B.Sc CS, 2nd Year', quote: 'Finally a social app where I know everyone is a real student. No catfishing!', avatar: 'Sneha', rating: 5 },
  { name: 'Arjun Nair', role: 'B.Tech ME, 3rd Year', quote: 'The sports module is fantastic. Found teammates for our cricket tournament.', avatar: 'Arjun', rating: 5 },
];

const phoneScreens = [
  { title: 'Feed', emoji: '📱', items: ['What\'s trending on campus', 'New event: Tech Fest 2026', 'Aarav posted in #studygroup'] },
  { title: 'Marketplace', emoji: '🛒', items: ['MacBook Air — ₹42,000', 'Physics Textbook — ₹350', 'Cycle — ₹2,500'] },
  { title: 'Events', emoji: '🎉', items: ['HackNight — Jul 28', 'Freshers Party — Aug 5', 'Sports Meet — Aug 12'] },
  { title: 'Profile', emoji: '👤', items: ['Aarav Mehta • Verified', '96 Friends • 24 Matches', 'B.Tech CSE • 2nd Year'] },
];

const features = [
  { id: 'dating', name: 'Dating', emoji: '💗', description: 'Verified-only matches, mutual likes, safe chat', isPopular: true, label: 'Beta' },
  { id: 'friends', name: 'Friends', emoji: '👥', description: 'Campus friends by branch, year, interests' },
  { id: 'study', name: 'Study Partners', emoji: '📚', description: 'Assignment help, exam prep, lab & project groups' },
  { id: 'career', name: 'Career Hub', emoji: '💼', description: 'Internships, referrals, mock interviews' },
  { id: 'hackathons', name: 'Hackathons', emoji: '💻', description: 'AI team builder, GitHub match, team chat' },
  { id: 'sports', name: 'Sports', emoji: '⚽', description: 'Teams, tournaments, ground booking' },
  { id: 'marketplace', name: 'Marketplace', emoji: '🛒', description: 'Buy & sell books, cycles, electronics', isNew: true },
  { id: 'events', name: 'Events', emoji: '🎉', description: 'RSVP, countdown timers, QR check-in' },
  { id: 'communities', name: 'Communities', emoji: '🌐', description: 'Join clubs, chapters, interest groups' },
  { id: 'mentorship', name: 'Mentorship', emoji: '🎓', description: 'Connect with seniors & alumni mentors' },
];

const faqs = [
  { q: 'Who can use CampusMatch?', a: 'Currently available for VGU students. You need a valid ERP number to register and get verified.' },
  { q: 'How does ERP verification work?', a: 'Submit your ERP number and student ID card. Our team cross-references against the university database and verifies within 24 hours.' },
  { q: 'Is CampusMatch free?', a: 'Yes! CampusMatch is completely free for all verified students. We also offer optional Premium and Lifetime plans with extra features.' },
  { q: 'Is my data safe?', a: 'Absolutely. We use end-to-end encryption, never sell your data, and have zero tolerance for fake profiles. Your privacy is our top priority.' },
  { q: 'Can I find study partners?', a: 'Yes! CampusMatch has dedicated modules for study groups, hackathons, career networking, mentorship, and more — all with verified students.' },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const { data: modulesData } = useGetModulesSummary();
  const { data: statsData } = useGetStatsOverview();

  const [phoneScreenIndex, setPhoneScreenIndex] = useState(0);
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhoneScreenIndex((prev) => (prev + 1) % phoneScreens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const verificationSteps = [
    { icon: UserPlus, title: 'Sign Up', desc: 'Create account with your college email' },
    { icon: Upload, title: 'ID Upload', desc: 'Upload your student ID card' },
    { icon: ScanLine, title: 'OCR Scan', desc: 'AI reads & validates your details' },
    { icon: BadgeCheck, title: 'Verified', desc: 'Get your verified badge instantly' },
  ];

  const moduleData = modulesData?.modules || features;

  return (
    <div className="flex flex-col w-full">
      {/* ===== 1. ANNOUNCEMENT BANNER ===== */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.5 }}
        className="relative z-20 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-fuchsia-500/10 border-b border-white/[0.04]"
      >
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
          <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
          <p className="text-xs sm:text-sm text-white/60">
            <span className="font-semibold text-white/80">New:</span> Campus Marketplace is live! Buy & sell with verified students.
          </p>
          <Link href="/marketplace" className="text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors shrink-0 flex items-center gap-1">
            Check it out <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>

      {/* ===== 2. HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4" />
        <div className="absolute inset-0 z-[1] bg-white/40 backdrop-blur-[2px]" />

        <div className="relative z-10 w-full min-h-screen flex items-center px-6 md:px-[80px] lg:px-[120px] py-24">
          {/* LEFT: Text content */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex-1 max-w-2xl z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 flex items-center gap-3"
            >
              <LiveUserCounter />
              <span className="text-xs text-gray-900/70 uppercase tracking-widest" style={{ fontWeight: 500 }}>Real Users</span>
            </motion.div>

            {/* Word-by-word headline */}
            <h1 className="text-gray-900 leading-[1.08] mb-6" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
              {'Your whole campus, one verified app.'.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="inline-block mr-[0.3em]"
                >
                  {word === 'verified' ? (
                    <span className="italic bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{word}</span>
                  ) : word}
                </motion.span>
              ))}
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="text-gray-800 max-w-[520px] mb-10 leading-relaxed"
              style={{ fontSize: '17px' }}
            >
              Find friends, study partners, dates, internships, and campus events — no fakes, no bots, just real ERP-verified students.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link href="/register" className="h-14 px-8 inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-base hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-pink-500/30">
                Join CampusMatch <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a href="#features" className="h-14 px-8 inline-flex items-center justify-center rounded-[10px] bg-gray-900/80 text-white font-semibold text-base border border-gray-700 hover:bg-gray-900 transition-all">
                Explore Features
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT: Phone mockup with auto-transitioning screens (desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="hidden lg:flex items-center justify-center flex-shrink-0 ml-12"
          >
            <div className="relative">
              {/* Phone bezel frame */}
              <div className="w-[280px] h-[560px] rounded-[40px] border-[3px] border-white/15 bg-black/60 backdrop-blur-xl p-3 shadow-2xl shadow-purple-500/10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-b-2xl z-20" />
                {/* Screen */}
                <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-gradient-to-b from-gray-900 to-black">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={phoneScreenIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 p-5 pt-10"
                    >
                      {/* Screen header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-[10px] text-pink-400 uppercase tracking-wider font-semibold">CampusMatch</p>
                          <h3 className="text-lg font-bold text-white mt-0.5">{phoneScreens[phoneScreenIndex].emoji} {phoneScreens[phoneScreenIndex].title}</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-pink-400" />
                        </div>
                      </div>
                      {/* Screen items */}
                      <div className="space-y-3">
                        {phoneScreens[phoneScreenIndex].items.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.1 }}
                            className="bg-white/[0.06] rounded-xl p-3 border border-white/[0.06]"
                          >
                            <p className="text-xs text-white/80">{item}</p>
                          </motion.div>
                        ))}
                      </div>
                      {/* Bottom nav dots */}
                      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
                        {phoneScreens.map((_, idx) => (
                          <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === phoneScreenIndex ? 'bg-pink-400 w-4' : 'bg-white/20'}`} />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Floating "New Match!" notification */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="absolute -top-4 -left-14 w-44 rounded-xl p-2.5 bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(236,72,153,0.15)] animate-float"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-pink-400" />
                  </div>
                  <span className="text-[11px] font-semibold text-white">New Match!</span>
                </div>
                <p className="text-[10px] text-white/40">Someone nearby likes you</p>
              </motion.div>

              {/* Floating ERP badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="absolute -bottom-3 -left-6 rounded-xl p-2.5 flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(236,72,153,0.15)] animate-float"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white">ERP Verified</div>
                  <div className="text-[9px] text-white/35">Identity Confirmed</div>
                </div>
              </motion.div>

              {/* Founding Member badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="absolute -top-6 -right-10 rounded-xl p-3 bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.2)] animate-float"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center animate-pulse">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">Founding Member</p>
                    <p className="text-[9px] text-pink-300/70">Limited to First 100 Students</p>
                  </div>
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

      {/* ===== 3. SOCIAL PROOF BAR ===== */}
      <section className="py-16 px-4 md:px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-white/40 mb-10 uppercase tracking-[0.15em] font-medium"
          >
            Trusted by students from leading universities
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Verified Students', value: statsData?.verifiedUsers || 247, suffix: '+', icon: Users, color: 'text-pink-400' },
              { label: 'Matches Made', value: 1840, suffix: '+', icon: Heart, color: 'text-fuchsia-400' },
              { label: 'Events Hosted', value: 56, suffix: '', icon: CalendarDays, color: 'text-purple-400' },
              { label: 'Campus Rating', value: 4.9, suffix: '/5', icon: Star, color: 'text-yellow-400', isDecimal: true },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {stat.isDecimal ? (
                    <span>{stat.value}</span>
                  ) : (
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <p className="text-xs text-white/40 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. ANIMATED VERIFICATION DEMO ===== */}
      <section className="py-24 px-4 md:px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-pink-400 uppercase tracking-[0.2em] mb-4">Verification</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How We Verify Students</h2>
            <p className="text-white/40 max-w-xl mx-auto">A seamless 4-step process powered by AI and manual review</p>
          </motion.div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[52px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent z-0" />

            {verificationSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center w-full md:w-auto"
              >
                <div className="relative mb-6">
                  <motion.div
                    animate={demoStep === i ? { scale: [1, 1.15, 1], boxShadow: ['0 0 0px rgba(236,72,153,0)', '0 0 30px rgba(236,72,153,0.3)', '0 0 0px rgba(236,72,153,0)'] } : {}}
                    transition={{ duration: 0.6 }}
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      demoStep >= i
                        ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-2 border-pink-500/40'
                        : 'bg-background border-2 border-white/10'
                    }`}
                  >
                    <step.icon className={`w-8 h-8 transition-colors duration-500 ${demoStep >= i ? 'text-pink-400' : 'text-white/30'}`} />
                  </motion.div>
                  <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center transition-all duration-500 ${
                    demoStep >= i ? 'bg-gradient-to-r from-pink-500 to-purple-600 scale-110' : 'bg-white/10'
                  }`}>
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-[180px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. FEATURES SECTION ===== */}
      <section id="features" className="py-24 px-4 md:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-pink-400 uppercase tracking-[0.2em] mb-4">Features</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything Campus. One App.</h2>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {moduleData.map((mod: any) => (
              <motion.div key={mod.id} variants={fadeUp} custom={0} className="card-premium p-6 rounded-2xl group hover:border-pink-500/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="text-3xl">{mod.emoji}</div>
                  <div className="flex gap-1.5">
                    {mod.isPopular && <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold uppercase">{mod.label || 'Hot'}</span>}
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

      {/* ===== 6. HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-4 md:px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-pink-400 uppercase tracking-[0.2em] mb-4">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">ERP Verification. Zero Fakes.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent z-0" />
            {[
              { step: 1, icon: GraduationCap, title: 'Create Account', desc: 'Sign up with your college email and verify via OTP.' },
              { step: 2, icon: CreditCard, title: 'Upload Student ID', desc: 'Enter your ERP number and upload your student ID card.' },
              { step: 3, icon: ShieldCheck, title: 'AI OCR + Review', desc: 'AI scans your ID and our team reviews within 24 hours.' },
              { step: 4, icon: Rocket, title: 'Verified Badge', desc: 'Unlock your verified badge and full access to all features.' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-background border-2 border-pink-500/20 flex items-center justify-center group-hover:border-pink-500/40 transition-colors">
                    <s.icon className="w-8 h-8 text-pink-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center">{s.step}</div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-[200px]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. DATING SECTION ===== */}
      <section className="py-24 px-4 md:px-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Coming Soon / Beta</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Campus Dating, <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Reimagined</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">Meet verified students. No catfishing. No surprises. Just real connections.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: BadgeCheck, title: 'Verified Students Only', desc: 'Every profile is ERP-verified. Know they\'re real.' },
              { icon: ShieldCheck, title: 'Safe Connections', desc: 'Report & block features. Moderated conversations.' },
              { icon: Heart, title: 'Interest Matching', desc: 'Match based on courses, hobbies, and campus activities.' },
              { icon: Lock, title: 'Privacy First', desc: 'Control who sees your profile. incognito mode available.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-premium p-6 rounded-2xl group hover:border-pink-500/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                  <item.icon className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. PRICING SECTION ===== */}
      <section id="pricing" className="py-24 px-4 md:px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-pink-400 uppercase tracking-[0.2em] mb-4">Plans</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '₹0', period: 'forever', features: ['Basic profile', 'Friend requests', 'Browse marketplace', 'Join events', 'ERP verification'], cta: 'Get Started', popular: false },
              { name: 'Premium', price: '₹99', period: '/month', features: ['Unlimited matches', 'See who viewed you', 'Priority in discover', 'Advanced filters', 'Read receipts'], cta: 'Go Premium', popular: true },
              { name: 'Lifetime', price: '₹499', period: 'one-time', features: ['Lifetime access', 'Exclusive badge', 'Priority support', 'Early feature access', 'Founding member'], cta: 'Get Lifetime', popular: false },
            ].map((plan, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <BorderGlow
                  borderRadius={28}
                  intensity={plan.popular ? 0.8 : 0.5}
                  glowColors={plan.popular ? ['rgba(236,72,153,0.5)', 'rgba(168,85,247,0.5)', 'rgba(217,70,239,0.5)'] : undefined}
                  className="w-full"
                >
                  <div className={`relative rounded-2xl p-[1px] ${plan.popular ? 'bg-gradient-to-b from-pink-500 to-purple-500' : 'bg-white/10'}`}>
                    {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-pink-500/30">Most Popular</div>}
                    <div className={`rounded-[15px] p-7 h-full flex flex-col ${plan.popular ? 'bg-card' : 'bg-card/60'}`}>
                      <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                        <span className="text-sm text-white/40">{plan.period}</span>
                      </div>
                      <ul className="space-y-2.5 my-6 flex-1">
                        {plan.features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-white/60">
                            <CheckCircle2 className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                      <Link href="/register" className={`h-12 inline-flex items-center justify-center rounded-[10px] font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/20' : 'bg-white/[0.06] text-white/90 border border-white/10 hover:bg-white/[0.1]'}`}>
                        {plan.cta}
                      </Link>
                    </div>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. TESTIMONIALS ===== */}
      <section className="py-24 px-4 md:px-6 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-pink-400 uppercase tracking-[0.2em] mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Loved by Students</h2>
            <p className="text-white/40 max-w-xl mx-auto">Hear from verified students who transformed their campus experience.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-premium p-6 rounded-2xl group hover:border-pink-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-pink-500/30 mb-3" />
                <p className="text-sm text-white/60 leading-relaxed mb-5">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatar}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-[11px] text-white/35">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 10. TRUST / SECURITY ===== */}
      <section className="py-20 px-4 md:px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-pink-400 uppercase tracking-[0.2em] mb-4">Why Trust Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Security & Privacy</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, label: 'ERP Verified', desc: 'University database check', color: 'text-green-400 bg-green-500/10' },
              { icon: Lock, label: 'E2E Encrypted', desc: 'Chats are private', color: 'text-pink-400 bg-pink-500/10' },
              { icon: Eye, label: 'No Data Selling', desc: 'Your data stays yours', color: 'text-purple-400 bg-purple-500/10' },
              { icon: Target, label: 'Zero Tolerance', desc: 'Fake profiles banned', color: 'text-red-400 bg-red-500/10' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-premium p-5 rounded-2xl text-center group hover:border-pink-500/30 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-white mb-1">{item.label}</p>
                <p className="text-[11px] text-white/35">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 11. FAQ ACCORDION ===== */}
      <section id="faq" className="py-24 px-4 md:px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-pink-400 uppercase tracking-[0.2em] mb-4">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="card-premium rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-semibold hover:text-pink-300 transition-colors list-none">
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

      {/* ===== 12. FINAL CTA ===== */}
      <section className="py-24 px-4 md:px-6 bg-white/[0.01] border-t border-white/5">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center relative p-[1px] rounded-3xl bg-gradient-to-b from-pink-500/20 to-purple-500/10">
          <div className="bg-card/90 backdrop-blur-2xl rounded-[23px] p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-500" />
            <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to join your campus?</h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto relative z-10">
              Join hundreds of verified students. It takes 2 minutes to sign up and get started.
            </p>
            <Link href="/register" className="h-16 px-10 inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 relative z-10 shadow-lg shadow-pink-500/25">
              Join CampusMatch <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <p className="mt-5 text-sm text-white/30 relative z-10">100% free for verified students.</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
