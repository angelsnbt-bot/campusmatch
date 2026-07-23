import { Link } from 'wouter';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md card-premium p-8 rounded-2xl">
        <div className="flex mb-4 gap-3 items-center">
          <AlertCircle className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">404 — Page Not Found</h1>
        </div>
        <p className="mt-4 text-sm text-white/60 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-lg shadow-blue-500/20">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
