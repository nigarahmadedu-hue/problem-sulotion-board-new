'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const CATEGORY_ICONS: Record<string, string> = {
  agriculture: '🌾',
  education: '📚',
  healthcare: '🏥',
  environment: '🌿',
  business: '💼',
  technology: '💻',
  transport: '🚌',
  government: '🏛️',
  community: '🤝',
};

const CATEGORY_LABELS: Record<string, string> = {
  agriculture: 'Agriculture',
  education: 'Education',
  healthcare: 'Healthcare',
  transport: 'Transport',
  environment: 'Environment',
  business: 'Business',
  technology: 'Technology',
  government: 'Government',
  community: 'Community',
};

const STAGE_COLORS: Record<string, string> = {
  Submitted: 'bg-slate-100 text-slate-600',
  Discussion: 'bg-blue-50 text-blue-700',
  Research: 'bg-amber-50 text-amber-700',
  Validated: 'bg-emerald-50 text-emerald-700',
  Prototype: 'bg-violet-50 text-violet-700',
  MVP: 'bg-indigo-50 text-indigo-700',
  Launched: 'bg-green-100 text-green-800',
};

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-black text-slate-900">{value}</span>
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('soch_token') : null;

    if (!token) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    api
      .getDashboard()
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load dashboard. Please log in again.');
        setLoading(false);
        // token may be expired
        localStorage.removeItem('soch_token');
        localStorage.removeItem('soch_user');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border border-rose-200 rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <span className="text-4xl block mb-3">🔒</span>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Sign in required</h2>
          <p className="text-sm text-slate-500 mb-6">
            {error || 'Please log in to view your dashboard.'}
          </p>
          <Link
            href="/login?redirect=/dashboard"
            className="inline-flex items-center px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const { profile, stats, problems, ideas, teams } = data;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
            Your Space
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Welcome back, {profile.name.split(' ')[0]}.
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your problems, ideas and collaborations.
          </p>
        </div>

        <Link
          href="/submit-problem"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-colors whitespace-nowrap"
        >
          + Submit Problem
        </Link>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Problems submitted" value={stats.problemsSubmitted} icon="📋" />
        <StatCard label="Ideas proposed" value={stats.ideasProposed} icon="💡" />
        <StatCard label="Votes received" value={stats.votesReceived} icon="▲" />
        <StatCard label="Collaborations" value={stats.collaborations} icon="🤝" />
      </section>

      {/* 2-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Submitted Problems */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Your Problems
                </span>
                <h2 className="text-lg font-bold text-slate-900">Submitted problems</h2>
              </div>
              <Link
                href="/problems"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
              >
                View all &rarr;
              </Link>
            </div>

            {problems.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl block mb-3">📋</span>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  No problems submitted yet
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  Share a real-world problem to get started.
                </p>
                <Link
                  href="/submit-problem"
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  Submit your first problem
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {problems.map((prob: any) => (
                  <Link
                    key={prob.id}
                    href={`/problems/${prob.id}`}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl flex-shrink-0">
                        {CATEGORY_ICONS[prob.category] || '📌'}
                      </span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {CATEGORY_LABELS[prob.category] || prob.category}
                        </span>
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {prob.title}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ml-3 flex-shrink-0 ${
                        STAGE_COLORS[prob.stage] || 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {prob.stage}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recent Ideas */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="pb-4 border-b border-slate-100 mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Your Ideas
              </span>
              <h2 className="text-lg font-bold text-slate-900">Recent ideas</h2>
            </div>

            {ideas.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl block mb-3">💡</span>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  No ideas proposed yet
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  Browse problems and propose your first idea!
                </p>
                <Link
                  href="/problems"
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  Explore problems
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {ideas.map((idea: any) => (
                  <Link
                    key={idea.id}
                    href={`/problems/${idea.problemId}`}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {idea.title}
                      </p>
                      <span className="text-xs text-slate-400 truncate block">
                        For: {idea.problemTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-3 flex-shrink-0 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                      <span className="text-xs font-bold text-slate-700">▲</span>
                      <span className="text-xs font-bold text-slate-900">{idea.votes}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Profile Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Your Profile
            </span>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-base flex-shrink-0">
                {profile.initials}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{profile.name}</p>
                <p className="text-xs text-slate-400">{profile.email}</p>
                {profile.role && (
                  <p className="text-xs text-slate-500 mt-0.5">{profile.role}</p>
                )}
              </div>
            </div>
            {profile.location && (
              <p className="text-xs text-slate-500 mb-3">📍 {profile.location}</p>
            )}
          </div>

          {/* Teams */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Active Teams
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-4">Your collaborations</h3>

            {teams.length === 0 ? (
              <div className="text-center py-6">
                <span className="text-3xl block mb-2">🤝</span>
                <p className="text-xs text-slate-500">No active team memberships yet.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {teams.map((team: any) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                      {team.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {team.name}
                      </p>
                      {team.role && (
                        <span className="text-xs text-slate-400">{team.role}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/people"
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Find collaborators
            </Link>
          </section>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Quick Actions
            </span>
            <div className="space-y-2">
              <Link
                href="/submit-problem"
                className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors"
              >
                <span>📋</span> Submit a Problem
              </Link>
              <Link
                href="/problems"
                className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
              >
                <span>💡</span> Propose an Idea
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
