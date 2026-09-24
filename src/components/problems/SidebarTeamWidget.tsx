import React from 'react';
import Link from 'next/link';

export const SidebarTeamWidget: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm mb-6">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
        Build a Team
      </span>
      <h3 className="text-base font-bold text-slate-900 mb-2">
        Want to work on this?
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-5">
        Join others interested in turning this problem into a real solution.
      </p>

      <Link
        href="/people"
        className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
      >
        Find Team Members
      </Link>
    </div>
  );
};
