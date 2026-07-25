import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

type Tab = 'bug' | 'feature';

export default function FeedbackWidget() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('bug');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 200) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const reset = useCallback(() => {
    setTab('bug');
    setDescription('');
    setEmail('');
    setSubmitted(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(reset, 200);
  }, [reset]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2000);
  }, [handleClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute bottom-16 left-0 w-80 glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 px-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-4"
                >
                  <span className="text-white text-lg">✓</span>
                </motion.div>
                <p className="text-white font-semibold text-sm">Thank you!</p>
                <p className="text-white/40 text-xs mt-1">Your feedback helps us improve.</p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-white">Send Feedback</h3>
                  <button onClick={handleClose} className="text-white/30 hover:text-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex border-b border-white/[0.06]">
                  {(['bug', 'feature'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                        tab === t
                          ? 'text-white border-b-2 border-pink-500'
                          : 'text-white/35 hover:text-white/55'
                      }`}
                    >
                      {t === 'bug' ? 'Report Bug' : 'Suggest Feature'}
                    </button>
                  ))}
                </div>

                <div className="p-4 space-y-3">
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder={
                      tab === 'bug'
                        ? 'Describe the bug you encountered...'
                        : 'Describe your feature idea...'
                    }
                    rows={4}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-pink-500/40 transition-colors resize-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-pink-500/40 transition-colors"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!description.trim()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Submit Feedback
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(prev => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 text-white"
        aria-label="Open feedback"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>

        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-600"
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.button>
    </div>
  );
}
