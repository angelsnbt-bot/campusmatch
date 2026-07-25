import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | string;
  userName: string;
  type: 'report' | 'block';
}

const reportReasons = [
  'Harassment',
  'Spam',
  'Fake Profile',
  'Inappropriate Content',
  'Underage User',
  'Other',
];

export default function ReportBlockModal({
  isOpen,
  onClose,
  userId,
  userName,
  type,
}: ReportBlockModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: 'Report submitted. Our team will review it.',
    });
    setReason('');
    setDetails('');
    onClose();
  };

  const handleBlock = () => {
    toast({
      title: `${userName} has been blocked.`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="glass-card relative z-10 w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl shadow-black/40"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-white/40 transition-colors hover:text-white/80"
            >
              <X className="h-4 w-4" />
            </button>

            {type === 'report' ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/20">
                    <Flag className="h-5 w-5 text-pink-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Report {userName}
                  </h2>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">
                    Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                  >
                    <option value="" className="bg-gray-900">
                      Select a reason...
                    </option>
                    {reportReasons.map((r) => (
                      <option key={r} value={r} className="bg-gray-900">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">
                    Additional details{' '}
                    <span className="text-white/30">(optional)</span>
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide any extra context..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!reason}
                  className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-pink-500/20 transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-pink-500/20"
                >
                  Submit Report
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                    <Ban className="h-5 w-5 text-red-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Block {userName}?
                  </h2>
                </div>

                <p className="text-sm leading-relaxed text-white/60">
                  They won't be able to see your profile, send you messages, or
                  find you in search.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBlock}
                    className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-red-500/20 transition-all hover:bg-red-600 hover:shadow-red-500/30"
                  >
                    Block
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
