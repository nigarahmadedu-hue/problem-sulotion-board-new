'use client';

import React, { useState } from 'react';
import { Idea } from '@/types';
import { api } from '@/lib/api';

interface IdeaCardProps {
  idea: Idea;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const [votes, setVotes] = useState(idea.votes);
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  const handleVote = async () => {
    if (voting) return;
    setVoting(true);
    try {
      await api.voteIdea(idea.id);
      if (voted) {
        setVotes((prev) => Math.max(0, prev - 1));
        setVoted(false);
      } else {
        setVotes((prev) => prev + 1);
        setVoted(true);
      }
    } catch {
      // Optimistic fallback — toggle locally even if API fails (anonymous)
      if (voted) {
        setVotes((prev) => Math.max(0, prev - 1));
        setVoted(false);
      } else {
        setVotes((prev) => prev + 1);
        setVoted(true);
      }
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-slate-300 transition-all shadow-sm">
      {/* Upvote Box */}
      <div className="flex sm:flex-col items-center justify-center gap-1.5 p-2 sm:py-3 sm:px-4 bg-slate-50 border border-slate-200 rounded-xl min-w-[70px] select-none flex-shrink-0">
        <button
          onClick={handleVote}
          disabled={voting}
          className={`p-1.5 rounded-lg transition-colors text-sm font-bold flex items-center justify-center disabled:opacity-50 ${
            voted
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
          title={voted ? 'Remove upvote' : 'Upvote this idea'}
          aria-label={voted ? 'Remove upvote' : 'Upvote this idea'}
        >
          ▲
        </button>
        <strong className="text-sm font-bold text-slate-900">{votes}</strong>
        <span className="text-[10px] uppercase font-semibold text-slate-400">votes</span>
      </div>

      {/* Idea Content */}
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1 block">
          {idea.numberLabel}
        </span>
        <h4 className="text-base font-bold text-slate-900 mb-2">{idea.title}</h4>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{idea.description}</p>

        {idea.whoWouldUse && (
          <div className="text-xs text-slate-500 mb-2 flex items-start gap-1.5">
            <span className="text-base leading-none">👥</span>
            <span>
              <span className="font-semibold text-slate-700">Who would use it: </span>
              {idea.whoWouldUse}
            </span>
          </div>
        )}

        {idea.neededToBuild && (
          <div className="text-xs text-slate-500 mb-3 flex items-start gap-1.5">
            <span className="text-base leading-none">🔧</span>
            <span>
              <span className="font-semibold text-slate-700">Needed to build: </span>
              {idea.neededToBuild}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>💬 {idea.commentsCount ?? 0} comments</span>
          <span
            className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] ${
              voted
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {voted ? '✓ Voted' : 'Not voted'}
          </span>
        </div>
      </div>
    </div>
  );
};
