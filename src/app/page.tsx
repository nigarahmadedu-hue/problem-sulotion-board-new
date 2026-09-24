import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/mockData';
import { ProblemCard } from '@/components/problems/ProblemCard';
import { api } from '@/lib/api';
import { Problem, CategoryType, ValidationStage } from '@/types';

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

const STAGE_ORDER: ValidationStage[] = [
  'Submitted',
  'Discussion',
  'Research',
  'Validated',
  'Prototype',
  'MVP',
  'Launched',
];

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function mapRowToProblem(row: any): Problem {
  const stage: ValidationStage = row.stage || 'Submitted';
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category as CategoryType,
    categoryLabel: CATEGORY_LABELS[row.category] || row.category,
    location: row.location || 'Global',
    description: row.description,
    stage,
    currentStageIndex: Math.max(0, STAGE_ORDER.indexOf(stage)),
    ideasCount: row.ideas?.[0]?.count ?? 0,
    commentsCount: row.comments?.[0]?.count ?? 0,
    votesCount: row.votes_count ?? 0,
    author: {
      name: row.author?.name || 'Anonymous',
      initials: row.author?.initials || 'AN',
      timeAgo: timeAgo(row.created_at),
    },
    whoFacesIt: row.who_faces_it || [],
    evidence: {
      references: row.evidence_references || 0,
      images: row.evidence_images || 0,
      solutions: row.evidence_solutions || 0,
    },
    lookingForRoles: row.looking_for_roles || [],
  };
}

export default async function HomePage() {
  let trendingProblems: Problem[] = [];
  let stats = {
    totalProblems: 0,
    totalIdeas: 0,
    totalBuilders: 0,
    categoryCounts: [] as { category: string; count: number }[],
  };

  try {
    const [problemsRes, statsRes] = await Promise.all([
      api.getProblems({ limit: 3 }),
      api.getStats(),
    ]);
    trendingProblems = (problemsRes.data || []).map(mapRowToProblem);
    stats = statsRes;
  } catch (err) {
    console.error('Failed to fetch home page data', err);
  }

  const dynamicCategories = CATEGORIES.map((cat) => {
    const found = stats.categoryCounts.find((c) => c.category === cat.slug);
    return {
      ...cat,
      problemCount: found ? found.count : 0,
    };
  });

  const processSteps = [
    { num: '01', title: 'Problem', desc: 'Identify a real problem.' },
    { num: '02', title: 'Idea', desc: 'Propose possible solutions.' },
    { num: '03', title: 'People', desc: 'Find people with useful skills.' },
    { num: '04', title: 'Team', desc: 'Build together.' },
    { num: '05', title: 'Launch', desc: 'Turn ideas into reality.' },
  ];

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
                The Problem & Idea Board
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Find problems.<br />
                <span className="text-emerald-600">Build what matters.</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                SOCH connects real-world problems with people, ideas and teams ready to solve them.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/problems"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  Explore Problems &rarr;
                </Link>
                <Link
                  href="/submit-problem"
                  className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
                >
                  Submit a Problem
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100 max-w-md">
                <div>
                  <strong className="text-2xl sm:text-3xl font-black text-slate-900 block">
                    {stats.totalProblems}
                  </strong>
                  <span className="text-xs font-medium text-slate-500">Problems</span>
                </div>
                <div>
                  <strong className="text-2xl sm:text-3xl font-black text-slate-900 block">
                    {stats.totalIdeas}
                  </strong>
                  <span className="text-xs font-medium text-slate-500">Ideas</span>
                </div>
                <div>
                  <strong className="text-2xl sm:text-3xl font-black text-slate-900 block">
                    {stats.totalBuilders}
                  </strong>
                  <span className="text-xs font-medium text-slate-500">Builders</span>
                </div>
              </div>
            </div>

            {/* Right Visual (Floating Interactive Showcase) */}
            <div className="lg:col-span-5 relative flex flex-col items-center gap-4">
              {/* Problem Card */}
              <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl relative z-10 transition-transform hover:-translate-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                  Problem
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Farmers cannot easily test soil nutrients.
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">
                    🌱 Agriculture
                  </span>
                  <span>📍 Punjab</span>
                </div>
              </div>

              {/* Connection Indicator */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-slate-300"></div>
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[11px] text-slate-500 font-bold">
                  &darr;
                </div>
                <div className="w-0.5 h-6 bg-slate-300"></div>
              </div>

              {/* Idea Card */}
              <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl relative z-10 transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block">
                    Ideas
                  </span>
                  <span className="text-xs font-medium text-slate-400">12 possible solutions</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-medium text-slate-800">📱 Mobile soil testing</span>
                    <b className="font-bold text-slate-900">128 ↑</b>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-medium text-slate-800">📡 IoT soil sensor</span>
                    <b className="font-bold text-slate-900">94 ↑</b>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-medium text-slate-800">🤖 AI prediction</span>
                    <b className="font-bold text-slate-900">76 ↑</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Categories Section */}
      <section className="py-16 md:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Discover
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Problems worth solving
              </h2>
            </div>
            <Link
              href="/problems"
              className="text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              View all problems &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {dynamicCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/problems?category=${cat.slug}`}
                className="p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-center flex flex-col items-center justify-center group"
              >
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500">{cat.problemCount} problems</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Problems Section */}
      <section className="py-16 md:py-20 border-b border-slate-200/80 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Trending
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Problems people are discussing
              </h2>
            </div>
            <Link
              href="/problems"
              className="text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              Explore board &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProblems.map((prob) => (
              <ProblemCard key={prob.id} problem={prob} />
            ))}
          </div>
        </div>
      </section>

      {/* The SOCH Loop (Process Section) */}
      <section className="py-16 md:py-24 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            The SOCH Loop
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-14">
            From problem to impact.
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
            {processSteps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-200/60 w-full md:w-44">
                  <span className="text-xs font-black text-emerald-600 mb-1">{step.num}</span>
                  <strong className="text-base font-bold text-slate-900 mb-1">{step.title}</strong>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>

                {idx < processSteps.length - 1 && (
                  <span className="text-slate-300 text-xl font-bold hidden md:block select-none">
                    &rarr;
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
              Start Something
            </span>
            <h2 className="text-3xl font-black tracking-tight mb-2">
              Have a problem that needs solving?
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Put it in front of people who can help.
            </p>
          </div>

          <Link
            href="/submit-problem"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition-all whitespace-nowrap"
          >
            Submit a Problem &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}
