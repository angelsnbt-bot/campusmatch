import { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, ChevronDown, Mail, RefreshCw } from 'lucide-react';

const fakeStackTrace = `Error: Unable to process request
    at CampusMatchAPI.handleRequest (/app/src/api/handler.ts:142:15)
    at Router.processRoute (/app/src/router/index.ts:87:23)
    at AuthService.verifyToken (/app/src/auth/token.ts:56:11)
    at DatabasePool.query (/app/src/db/pool.ts:203:9)
    at CampusMatchAPI.handleRequest (/app/src/api/handler.ts:142:15)
    at async Promise.all (index 0)
    at async ModuleLoader.import (/app/src/modules/loader.ts:34:5)`;

export default function ErrorPage() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: 'linear-gradient(135deg, #0f0515 0%, #150a20 40%, #1a0f2e 100%)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.06)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-card rounded-3xl p-10 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed mb-8 max-w-sm mx-auto">
            An unexpected error occurred while processing your request. Our team has been notified and is working on a fix.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={() => window.location.reload()}
              className="h-12 px-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-pink-500/20 w-full sm:w-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            <a
              href={`mailto:support@campusmatch.in?subject=Bug Report&body=Hi CampusMatch team,%0A%0AI encountered an error:%0A%0APage: ${window.location.href}%0ATimestamp: ${new Date().toISOString()}%0A%0APlease help resolve this.`}
              className="h-12 px-8 inline-flex items-center justify-center rounded-xl bg-white/[0.06] text-white/80 font-semibold text-sm border border-white/10 hover:bg-white/[0.1] transition-all w-full sm:w-auto"
            >
              <Mail className="w-4 h-4 mr-2" />
              Report Issue
            </a>
          </div>

          <div className="border-t border-white/5 pt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 mx-auto text-xs text-white/30 hover:text-white/50 transition-colors cursor-pointer"
            >
              Error Details
              <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3 h-3" />
              </motion.div>
            </button>
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <pre className="mt-3 p-4 rounded-xl bg-black/40 border border-white/5 text-left text-[11px] text-red-400/70 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {fakeStackTrace}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
