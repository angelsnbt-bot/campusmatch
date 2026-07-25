import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import LightPillar from '@/components/ui/LightPillar';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0515 0%, #150a20 40%, #1a0f2e 100%)' }}
    >
      <div className="absolute inset-0 z-0">
        <LightPillar topColor="#5227FF" bottomColor="#FF9FFC" intensity={0.6} pillarWidth={4.0} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="glass-card rounded-3xl p-10 text-center">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <h1
              className="text-[120px] md:text-[160px] font-black leading-none select-none bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: 'text' }}
            >
              404
            </h1>
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-4">Page Not Found</h2>
          <p className="text-white/50 text-sm md:text-base leading-relaxed mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search CampusMatch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-pink-500/40 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="h-12 px-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-pink-500/20 w-full sm:w-auto"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Return Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="h-12 px-8 inline-flex items-center justify-center rounded-xl bg-white/[0.06] text-white/80 font-semibold text-sm border border-white/10 hover:bg-white/[0.1] transition-all w-full sm:w-auto cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
