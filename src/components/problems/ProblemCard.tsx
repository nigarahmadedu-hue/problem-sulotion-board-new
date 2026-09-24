'use client';

import React from 'react';
import Link from 'next/link';
import { Problem } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface ProblemCardProps {
  problem: Problem;
  onVote?: () => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onVote }) => {
  return (
    <article className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Top metadata */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge category={problem.category} label={problem.categoryLabel} />
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            📍 {problem.location}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors line-clamp-2 mb-2.5">
          <Link href={`/problems/${problem.id}`} className="hover:underline">
            {problem.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
          {problem.description}
        </p>
      </div>

      <div>
        {/* Validation Stage */}
        <div className="flex items-center text-xs font-semibold text-slate-600 mb-4 bg-slate-50 rounded-lg px-3 py-1.5 w-fit border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          <span>{problem.stage}</span>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => {
                e.preventDefault();
                onVote?.();
              }}
              className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              {problem.votesCount || 0}
            </button>
            <span className="flex items-center gap-1">
              💬 {problem.commentsCount}
            </span>
          </div>

          <Link
            href={`/problems/${problem.id}`}
            className="text-slate-900 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
          >
            Explore &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};
