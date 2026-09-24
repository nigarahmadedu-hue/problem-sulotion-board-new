'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CURRENT_USER, PROBLEMS, IDEAS, ACTIVE_TEAMS } from '@/data/mockData';
import { Avatar } from '@/components/ui/Avatar';
import { ProblemCard } from '@/components/problems/ProblemCard';
import { IdeaCard } from '@/components/problems/IdeaCard';
import { ActiveTeamCard } from '@/components/dashboard/ActiveTeamCard';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'problems' | 'ideas' | 'teams'>('problems');

  const userProblems = PROBLEMS.slice(0, 2);
  const userIdeas = IDEAS.slice(0, 2);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header Hero */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <Avatar initials={CURRENT_USER.initials} size="xl" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {CURRENT_USER.name}
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                {CURRENT_USER.role}
              </p>
              <span className="text-xs text-slate-400 mt-1 block">
                📍 {CURRENT_USER.location} &middot; Member since 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/submit-problem"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              + Submit Problem
            </Link>
          </div>
        </div>

        {/* Bio & Skills */}
        <div className="pt-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            About & Philosophy
          </span>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mb-6">
            {CURRENT_USER.bio}
          </p>

          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Core Skills & Specializations
          </span>
          <div className="flex flex-wrap gap-2">
            {CURRENT_USER.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 mb-8 pb-3">
        <button
          onClick={() => setActiveTab('problems')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
            activeTab === 'problems'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Submitted Problems ({userProblems.length})
        </button>
        <button
          onClick={() => setActiveTab('ideas')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
            activeTab === 'ideas'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Proposed Ideas ({userIdeas.length})
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
            activeTab === 'teams'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Active Teams ({ACTIVE_TEAMS.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'problems' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProblems.map((prob) => (
            <ProblemCard key={prob.id} problem={prob} />
          ))}
        </div>
      )}

      {activeTab === 'ideas' && (
        <div className="space-y-4 max-w-4xl">
          {userIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {ACTIVE_TEAMS.map((team) => (
            <ActiveTeamCard
              key={team.id}
              name={team.name}
              initials={team.initials}
              membersCount={team.membersCount}
            />
          ))}
        </div>
      )}
    </main>
  );
}
