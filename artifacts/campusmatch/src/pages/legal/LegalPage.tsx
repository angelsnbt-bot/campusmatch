import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

interface LegalPageProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated = 'July 21, 2026', children }: LegalPageProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-white/40 text-sm mb-8">Last updated: {lastUpdated}</p>
        <div className="space-y-8 text-white/70 leading-relaxed">
          {children}
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
            Back to CampusMatch
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}

export function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}
