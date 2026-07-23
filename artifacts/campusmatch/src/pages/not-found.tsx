import { Link } from 'wouter';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl cm-card-elevate">
        <div className="flex mb-4 gap-3 items-center">
          <AlertCircle className="h-8 w-8 text-pink-400" />
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>404 — Page Not Found</h1>
        </div>
        <p className="mt-4 text-sm text-white/60 mb-6" style={{ fontFamily: 'Inter' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ec4899] text-white font-medium hover:bg-[#db2777] transition-colors shadow-lg shadow-pink-500/20" style={{ fontFamily: 'Cabin' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
