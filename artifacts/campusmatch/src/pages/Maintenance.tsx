import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Mail, Clock, Wrench } from 'lucide-react';

export default function Maintenance() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: 'linear-gradient(135deg, #0f0515 0%, #150a20 40%, #1a0f2e 100%)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.06)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-card rounded-3xl p-10 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center"
            >
              <Settings className="w-10 h-10 text-purple-400" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center"
            >
              <Wrench className="w-4 h-4 text-pink-400" />
            </motion.div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Under Maintenance</h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed mb-4 max-w-sm mx-auto">
            We're improving CampusMatch. We'll be back soon!
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-white/40 mb-8">
            <Clock className="w-4 h-4" />
            <span>Expected back in ~30 minutes</span>
          </div>

          <div className="w-full max-w-xs mx-auto mb-8">
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[11px] text-white/25 mt-2">Updating in progress...</p>
          </div>

          <div className="relative">
            <p className="text-xs text-white/40 mb-3">Get notified when we're back</p>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-sm text-green-400"
              >
                <Mail className="w-4 h-4" />
                We'll notify you at <span className="font-medium">{email}</span>
              </motion.div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/40 transition-colors"
                />
                <button
                  onClick={() => {
                    if (email.trim()) setSubmitted(true);
                  }}
                  className="h-12 px-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-pink-500/20 cursor-pointer shrink-0"
                >
                  Notify Me
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
