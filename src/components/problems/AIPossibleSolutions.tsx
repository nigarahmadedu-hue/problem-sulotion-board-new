'use client';

import React, { useState } from 'react';
import { Problem } from '@/types';

interface AIPossibleSolutionsProps {
  problem: Problem;
}

interface SolutionSuggestion {
  title: string;
  explanation: string;
  howItAddresses: string;
  whoItHelps: string;
  requirements: string;
}

export function AIPossibleSolutions({ problem }: AIPossibleSolutionsProps) {
  const [solutions, setSolutions] = useState<SolutionSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateSolutions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-solutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: problem.title,
          description: problem.description,
          category: problem.categoryLabel,
          location: problem.location,
          whoFacesIt: problem.whoFacesIt,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate solutions');
      }

      const data = await res.json();
      setSolutions(data.solutions);
      setHasGenerated(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 shadow-sm mb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🤖</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 block">
              AI Possible Solutions
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Generate AI Approaches
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            AI-generated possible approaches based on this problem&apos;s context.
            <br className="hidden sm:block" />
            These are suggestions, not guaranteed solutions.
          </p>
        </div>

        {!hasGenerated && (
          <button
            onClick={generateSolutions}
            disabled={loading}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span> Thinking...
              </>
            ) : (
              <>
                <span>✨</span> Generate Solutions
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          <strong>Oops!</strong> {error}
        </div>
      )}

      {hasGenerated && solutions.length > 0 && (
        <div className="mt-6 space-y-4">
          {solutions.map((sol, index) => (
            <div key={index} className="bg-white/80 backdrop-blur border border-indigo-100/50 rounded-xl p-5">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                <span className="text-indigo-500">{index + 1}.</span> {sol.title}
              </h3>
              <p className="text-sm text-slate-600 mb-4">{sol.explanation}</p>
              
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-indigo-50/50 rounded-lg p-3">
                  <span className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">How it helps</span>
                  <span className="text-slate-700">{sol.howItAddresses}</span>
                </div>
                <div className="bg-indigo-50/50 rounded-lg p-3">
                  <span className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Who it helps</span>
                  <span className="text-slate-700">{sol.whoItHelps}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500 flex items-start gap-1.5">
                <span className="font-semibold text-slate-700">Requirements:</span> 
                {sol.requirements}
              </div>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-indigo-100 flex justify-end">
             <button
              onClick={generateSolutions}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {loading ? 'Regenerating...' : '↻ Regenerate suggestions'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
