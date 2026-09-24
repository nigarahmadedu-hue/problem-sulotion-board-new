import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="text-xl font-black tracking-tight text-slate-900">
            SOCH<span className="text-emerald-600">.</span>
          </Link>
          <p className="mt-1 text-sm text-slate-500">
            Real problems. Better ideas. Real impact.
          </p>
        </div>

        <div className="flex items-center space-x-6 text-sm font-medium text-slate-600">
          <Link href="/problems" className="hover:text-slate-900 transition-colors">
            Problems
          </Link>
          <Link href="/people" className="hover:text-slate-900 transition-colors">
            People
          </Link>
          <Link href="/submit-problem" className="hover:text-slate-900 transition-colors">
            Submit
          </Link>
          <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
            Dashboard
          </Link>
        </div>

        <p className="text-sm text-slate-400">
          &copy; 2026 SOCH. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
