import React from 'react';
import { Link } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Heart, Users, BookOpen, Briefcase, Code, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useGetModulesSummary, useGetStatsOverview } from '@workspace/api-client-react';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  const { data: statsData } = useGetStatsOverview();
  const { data: modulesData } = useGetModulesSummary();

  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 35,
        y: (e.clientY - window.innerHeight / 2) / 35,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = statsData || {
    activeModules: 12,
    verifiedUsers: 0,
    erpVerifiedProfiles: "100%",
    verificationTime: "< 24h"
  };

  const modules = modulesData?.modules || [
    { id: 'dating', name: 'Dating', emoji: '💗', description: 'Verified-only matches, mutual likes, safe chat', isNew: false, isPopular: true },
    { id: 'friends', name: 'Friends', emoji: '👥', description: 'Campus friends by branch, year, interests', isNew: false },
    { id: 'study', name: 'Study Partners', emoji: '📚', description: 'Assignment, exam prep, lab & project groups', isNew: false },
    { id: 'career', name: 'Career Hub', emoji: '💼', description: 'Internships, referrals, mock interviews', isNew: false },
    { id: 'hackathons', name: 'Hackathons', emoji: '💻', description: 'AI team builder, GitHub match, team chat', isNew: false, isAi: true },
    { id: 'sports', name: 'Sports', emoji: '⚽', description: 'Teams, tournaments, ground booking', isNew: false },
    { id: 'marketplace', name: 'Marketplace', emoji: '🛒', description: 'Buy & sell books, cycles, electronics', isNew: true },
    { id: 'events', name: 'Events', emoji: '🎉', description: 'RSVP, countdown timers, QR check-in', isNew: false },
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 px-4 md:px-6 overflow-hidden flex flex-col items-center text-center">
        {/* Animated Background Mesh Glows */}
        <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
          <motion.div 
            style={{ 
              x: mousePos.x * 0.4, 
              y: mousePos.y * 0.4,
              background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(236,72,153,0.1) 40%, transparent 70%)',
            }}
            className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-60 CM-animate-float-1" 
          />
          <motion.div 
            style={{ 
              x: -mousePos.x * 0.3, 
              y: -mousePos.y * 0.3,
              background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
            }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-40 CM-animate-float-2"
          />
          
          {/* Floating Rising Particles */}
          {Array.from({ length: 15 }).map((_, idx) => {
            const size = Math.random() * 5 + 2;
            const delay = Math.random() * 8;
            const duration = Math.random() * 12 + 10;
            const left = Math.random() * 100;
            return (
              <motion.div
                key={idx}
                className="absolute rounded-full bg-primary/20 pointer-events-none"
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  bottom: "-20px",
                }}
                animate={{
                  y: ["0vh", "-110vh"],
                  opacity: [0, 0.8, 0],
                  x: [0, Math.sin(idx) * 50, 0]
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: "linear"
                }}
              />
            );
          })}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Currently available for VGU students only
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Your whole campus,<br />
            <span className="pink-gradient-text">one verified app.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            The exclusive social network where every profile is ERP-verified. 
            Find friends, study partners, dates, and campus events—no fakes, no bots, just real students.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium text-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all transform hover:-translate-y-1">
              Get Verified <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center rounded-full bg-white/5 text-white font-medium text-lg border border-white/10 hover:bg-white/10 transition-colors">
              How It Works
            </a>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 px-4"
        >
          {[
            { label: 'Active Modules', value: `${stats.activeModules}+` },
            { label: 'Verified Only', value: stats.erpVerifiedProfiles },
            { label: '1 ERP', value: '1 Account' },
            { label: 'Verification', value: stats.verificationTime },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
              <span className="text-sm text-white/50 font-medium uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* First 100 Card */}
      <section className="px-4 py-10 max-w-5xl mx-auto w-full">
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-primary/50 to-primary/5 overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 pointer-events-none" />
          <div className="bg-card/80 backdrop-blur-2xl p-8 md:p-10 rounded-[23px] flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">First 100 Verified Members</h3>
              <p className="text-white/70 mb-4">
                The first 100 students to complete verification automatically receive: 
                Exclusive Badge, Premium Border, Priority Username, and Lifetime Premium status.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-md bg-white/5 text-xs text-white/90 border border-white/10">🏆 Exclusive Badge</span>
                <span className="px-3 py-1 rounded-md bg-white/5 text-xs text-white/90 border border-white/10">✨ Premium Border</span>
                <span className="px-3 py-1 rounded-md bg-white/5 text-xs text-white/90 border border-white/10">👑 Lifetime Premium</span>
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
              <Link href="/register" className="w-full inline-flex justify-center px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors">
                Claim Your Spot
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section id="modules" className="px-4 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything Campus. One App.</h2>
          <p className="text-white/60 max-w-2xl mx-auto">Toggle between finding a date for the weekend, a team for the next hackathon, or buying second-hand books.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod, i) => (
            <motion.div 
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card p-6 rounded-2xl group hover:border-primary/50 transition-colors relative overflow-hidden CM-card-elevate"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="text-4xl">{mod.emoji}</div>
                <div className="flex gap-2">
                  {mod.isPopular && <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wide">Hot</span>}
                  {mod.isNew && <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wide">New</span>}
                  {mod.isAi && <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wide">AI</span>}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">{mod.name}</h3>
              <p className="text-sm text-white/50 relative z-10">{mod.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Verification Flow */}
      <section id="how-it-works" className="px-4 py-24 bg-card/30 border-y border-white/5 mt-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How Verification Works</h2>
            <p className="text-white/60 max-w-2xl mx-auto">We manually verify every single account against the university ERP system. If you aren't a student, you don't get in.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 z-0"></div>
            
            {[
              { step: 1, title: 'Sign Up', desc: 'Create your account with basic details and verify your college email address via OTP.' },
              { step: 2, title: 'Submit ERP', desc: 'Enter your valid university ERP number and upload your student ID card.' },
              { step: 3, title: 'Get Approved', desc: 'Our team reviews your submission within 24 hours. Once approved, you gain full access.' }
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-card flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] mb-6">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-32 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to join your campus?</h2>
        <Link href="/register" className="h-16 px-10 inline-flex items-center justify-center rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition-colors shadow-2xl shadow-white/10 transform hover:scale-105">
          Apply for Verification Now
        </Link>
        <p className="mt-6 text-white/40">100% free for verified students.</p>
      </section>
    </div>
  );
}
