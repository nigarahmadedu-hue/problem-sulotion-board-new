'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ProblemCard } from '@/components/problems/ProblemCard';
import { ProblemFilterBar } from '@/components/problems/ProblemFilterBar';
import { Problem, CategoryType, ValidationStage } from '@/types';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

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
    fullDescription: undefined,
    stage,
    currentStageIndex: Math.max(0, STAGE_ORDER.indexOf(stage)),
    ideasCount: row.ideas?.[0]?.count ?? 0,
    commentsCount: row.comments?.[0]?.count ?? 0,
    votesCount: row.votes?.[0]?.count ?? 0,
    author: {
      name: row.author?.name || row.profiles?.name || 'Anonymous',
      initials: row.author?.initials || row.profiles?.initials || 'AN',
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

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  const ANONYMOUS_AUTHOR_ID = '5a126e26-2720-4c2a-811b-76b7e57ef36e';

  const fetchProblems = async () => {
    try {
      const response = await api.getProblems();
      setProblems((response.data || []).map(mapRowToProblem));
    } catch (error) {
      console.error('Error fetching problems:', error);
      setProblems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleVote = async (problemId: string) => {
    try {
      await api.voteProblem(problemId);
      fetchProblems();
    } catch (error: any) {
      console.error('Error voting:', error);
      alert('Failed to vote or already voted.');
    }
  };

  const filteredProblems = useMemo(() => {
    return problems.filter((prob) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || prob.category.toLowerCase() === selectedCategory.toLowerCase();

      // Search match (title, description, location)
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        prob.title.toLowerCase().includes(q) ||
        prob.description.toLowerCase().includes(q) ||
        prob.location.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, problems]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <section className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
          Explore
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Problems worth solving.
        </h1>
        <p className="text-base text-slate-600 max-w-2xl">
          Discover real-world problems submitted by people and communities around the world.
        </p>
      </section>

      {/* Search & Category Filter */}
      <ProblemFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Loading state */}
      {loading && (
        <div className="p-12 text-center text-slate-400 text-sm">Loading problems...</div>
      )}

      {/* Problem Grid */}
      {!loading && filteredProblems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} onVote={() => handleVote(problem.id)} />
          ))}
        </div>
      )}

      {!loading && filteredProblems.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-2xl">
          <span className="text-4xl block mb-3">🔍</span>
          <h3 className="text-base font-bold text-slate-900 mb-1">No problems found</h3>
          <p className="text-sm text-slate-500 mb-6">
            Try adjusting your search terms or filter selection.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
}