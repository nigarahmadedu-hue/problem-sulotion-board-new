'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Problem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

interface ProblemCardProps {
  problem: Problem;
  onVote?: () => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onVote }) => {
  const [votes, setVotes] = useState(problem.votesCount || 0);
  const [voted, setVoted] = useState(problem.hasVoted || false);
  const [voting, setVoting] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (voting) return;
    setVoting(true);
    try {
      await api.voteProblem(problem.id);
      setVotes(prev => voted ? Math.max(0, prev - 1) : prev + 1);
      setVoted(!voted);
      onVote?.();
    } catch {
      setVotes(prev => voted ? Math.max(0, prev - 1) : prev + 1);
      setVoted(!voted);
    } finally {
      setVoting(false);
    }
  };

  return (
    <article className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between group h-full">
      <div className="flex items-start gap-4 mb-4">
        {/* Upvote Box */}
        <div className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-50 border border-slate-200 rounded-xl min-w-[60px] select-none flex-shrink-0">
          <button
            onClick={handleVote}
            disabled={voting}
            className={`p-1 rounded-md transition-colors text-xs font-bold flex items-center justify-center disabled:opacity-50 ${
              voted
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
            title={voted ? 'Remove upvote' : 'Upvote this problem'}
          >
            ▲
          </button>
          <strong className="text-sm font-bold text-slate-900">{votes}</strong>
        </div>

        {/* Top metadata */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge category={problem.category} label={problem.categoryLabel} />
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              📍 {problem.location}
            </span>
          </div>
          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors line-clamp-2">
            <Link href={`/problems/${problem.id}`} className="hover:underline">
              {problem.title}
            </Link>
          </h3>
        </div>
      </div>

      <div className="relative">
        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
          {problem.description}
        </p>
      </div>

      <div className="mt-auto relative">
        {/* Validation Stage */}
        <div className="flex items-center text-xs font-semibold text-slate-600 mb-4 bg-slate-50 rounded-lg px-3 py-1.5 w-fit border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          <span>{problem.stage}</span>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              💬 {problem.commentsCount}
            </span>
            <span className="flex items-center gap-1">
              💡 {problem.ideasCount}
            </span>
          </div>

          <Link
            href={`/problems/${problem.id}`}
            className="text-emerald-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 relative z-10"
          >
            Explore &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};
