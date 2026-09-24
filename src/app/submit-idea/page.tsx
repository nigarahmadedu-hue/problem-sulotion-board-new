'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

function SubmitIdeaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = searchParams.get('problemId') || '';

  const [problem, setProblem] = useState<any>(null);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [neededToBuild, setNeededToBuild] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!problemId) {
      setLoadingProblem(false);
      return;
    }
    api.getProblemById(problemId)
      .then((data) => setProblem(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingProblem(false));
  }, [problemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide an idea title and description.');
      return;
    }

    if (!problemId) {
      setError('No valid problem selected.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.createIdea(problemId, {
        title: title.trim(),
        description: description.trim(),
        who_would_use: targetUsers.trim() || undefined,
        needed_to_build: neededToBuild.trim() || undefined,
      });

      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push(`/problems/${problemId}`);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setSubmitting(false);
      setError('Failed to submit idea. Please try again.');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Intro Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
          Propose a Solution
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Turn a problem into an idea.
        </h1>
        <p className="text-sm text-slate-600">
          You don&apos;t need a complete startup. Share a solution that could help solve the problem.
        </p>
      </div>

      {/* Selected Problem Banner */}
      {problem && (
        <div className="mb-6 p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            Target Problem
          </span>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {problem.title}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            🌱 {problem.category} &middot; 📍 {problem.location || 'Global'}
          </span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <span>⚠</span> {error}
        </div>
      )}

      {submitted && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center gap-2">
          <span>✓</span> Idea proposed successfully! Redirecting back to problem discussion...
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Idea title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mobile soil testing"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Describe your idea <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={7}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain how your idea could solve the problem..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Who would use it?
          </label>
          <input
            type="text"
            value={targetUsers}
            onChange={(e) => setTargetUsers(e.target.value)}
            placeholder="e.g. Small farmers, rural health workers"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            What would be needed to build it?
          </label>
          <textarea
            rows={4}
            value={neededToBuild}
            onChange={(e) => setNeededToBuild(e.target.value)}
            placeholder="Technology, people, resources, research..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Link
            href={problemId ? `/problems/${problemId}` : '/problems'}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitted}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-colors"
          >
            Submit Idea &rarr;
          </button>
        </div>
      </form>
    </main>
  );
}

export default function SubmitIdeaPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Loading proposal form...
        </div>
      }
    >
      <SubmitIdeaContent />
    </Suspense>
  );
}
