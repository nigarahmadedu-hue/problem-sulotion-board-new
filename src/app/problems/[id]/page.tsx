'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Problem, Comment as CommentType, Idea } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { StageTimeline } from '@/components/problems/StageTimeline';
import { EvidenceCard } from '@/components/problems/EvidenceCard';
import { IdeaCard } from '@/components/problems/IdeaCard';
import { CommentSection } from '@/components/problems/CommentSection';
import { SidebarTeamWidget } from '@/components/problems/SidebarTeamWidget';
import { SidebarRolesWidget } from '@/components/problems/SidebarRolesWidget';
import { AIPossibleSolutions } from '@/components/problems/AIPossibleSolutions';

interface ProblemDetailPageProps {
  params: {
    id: string;
  };
}

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

const ANONYMOUS_AUTHOR_ID = '5a126e26-2720-4c2a-811b-76b7e57ef36e';

// Placeholder evidence images (shown when evidence_images > 0, or always as gallery prompt)
const EVIDENCE_IMAGE_PLACEHOLDERS = [
  { label: 'Field documentation', emoji: '📸' },
  { label: 'Survey data', emoji: '📊' },
  { label: 'On-site photo', emoji: '🏞️' },
  { label: 'Research chart', emoji: '📈' },
];

export default function ProblemDetailPage({ params }: ProblemDetailPageProps) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);

  // Problem voting states
  const [problemVotes, setProblemVotes] = useState(0);
  const [hasVotedProblem, setHasVotedProblem] = useState(false);
  const [votingProblem, setVotingProblem] = useState(false);

  // Editable Who Faces It states
  const [newAudience, setNewAudience] = useState('');
  const [addingAudience, setAddingAudience] = useState(false);
  const [showAudienceInput, setShowAudienceInput] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Current user state for conditional rendering
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchProblemAndComments = async () => {
    try {
      const pData = await api.getProblemById(params.id);

      const mappedProblem: Problem = {
        id: pData.id,
        slug: pData.slug,
        title: pData.title,
        category: pData.category as any,
        categoryLabel: CATEGORY_LABELS[pData.category] || pData.category,
        location: pData.location || 'Global',
        description: pData.description,
        fullDescription: pData.full_description,
        stage: pData.stage,
        currentStageIndex: 0,
        ideasCount: pData.ideas?.length || 0,
        commentsCount: pData.comments?.length || 0,
        author: {
          name: pData.author?.name || 'Anonymous',
          initials: pData.author?.initials || 'AN',
          timeAgo: timeAgo(pData.created_at),
        },
        whoFacesIt: pData.who_faces_it || [],
        votesCount: pData.votes_count || 0,
        evidence: {
          references: pData.evidence_references || 0,
          images: pData.evidence_images || 0,
          solutions: pData.evidence_solutions || 0,
        },
        evidence_image_urls: pData.evidence_image_urls || [],
        lookingForRoles: pData.looking_for_roles || [],
      };
      setProblem(mappedProblem);
      setProblemVotes(mappedProblem.votesCount || 0);

      if (pData.ideas) {
        setIdeas(
          pData.ideas.map((idea: any, index: number) => ({
            id: idea.id,
            problemId: idea.problem_id,
            numberLabel: `IDEA ${String(index + 1).padStart(2, '0')}`,
            title: idea.title,
            description: idea.description,
            votes: idea.votes?.length || 0,
            commentsCount: idea.comments?.length || 0,
            whoWouldUse: idea.who_would_use,
            neededToBuild: idea.needed_to_build,
          }))
        );
      }

      if (pData.comments) {
        setComments(
          pData.comments.map((c: any) => ({
            id: c.id,
            problemId: c.problem_id,
            author: {
              name: c.author?.name || 'Anonymous',
              initials: c.author?.initials || 'AN',
            },
            timeAgo: timeAgo(c.created_at),
            content: c.content,
          }))
        );
      }
    } catch (err) {
      console.error(err);
      setProblem(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProblemAndComments();
    
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('soch_token') : null;
    if (token) {
      setCurrentUser(true);
    }
  }, [params.id]);

  const handlePostComment = async (content: string) => {
    try {
      await api.createComment(params.id, {
        content,
        author_id: ANONYMOUS_AUTHOR_ID,
      });
      fetchProblemAndComments();
    } catch (error) {
      console.error(error);
      alert('Failed to post comment');
    }
  };

  const handleVoteProblem = async () => {
    if (votingProblem || !problem) return;
    setVotingProblem(true);
    try {
      await api.voteProblem(problem.id);
      if (hasVotedProblem) {
        setProblemVotes((prev) => Math.max(0, prev - 1));
        setHasVotedProblem(false);
      } else {
        setProblemVotes((prev) => prev + 1);
        setHasVotedProblem(true);
      }
    } catch (err) {
      // Optimistic fallback
      if (hasVotedProblem) {
        setProblemVotes((prev) => Math.max(0, prev - 1));
        setHasVotedProblem(false);
      } else {
        setProblemVotes((prev) => prev + 1);
        setHasVotedProblem(true);
      }
    } finally {
      setVotingProblem(false);
    }
  };

  const handleAddAudience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudience.trim() || !problem) return;
    setAddingAudience(true);
    try {
      const updatedAudience = [...(problem.whoFacesIt || []), newAudience.trim()];
      await api.updateProblem(problem.id, { who_faces_it: updatedAudience });
      setProblem((prev) => (prev ? { ...prev, whoFacesIt: updatedAudience } : null));
      setNewAudience('');
      setShowAudienceInput(false);
    } catch (error) {
      alert('Failed to add audience');
    } finally {
      setAddingAudience(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading problem...</div>;
  if (!problem) return <div className="p-12 text-center text-red-500">Problem not found.</div>;

  const evidenceImagesCount = problem.evidence?.images || 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/problems"
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors gap-1.5"
        >
          &larr; Back to problems
        </Link>
      </div>

      {/* Detail Header Section */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge category={problem.category} label={problem.categoryLabel} />
          <span className="text-xs text-slate-500 font-medium">📍 {problem.location}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4 flex-1">
            {problem.title}
          </h1>

          {/* Problem Voting */}
          <div className="flex flex-col items-center justify-center gap-1.5 p-2 sm:py-3 sm:px-4 bg-slate-50 border border-slate-200 rounded-xl min-w-[70px] select-none flex-shrink-0">
            <button
              onClick={handleVoteProblem}
              disabled={votingProblem}
              className={`p-1.5 rounded-lg transition-colors text-sm font-bold flex items-center justify-center disabled:opacity-50 ${
                hasVotedProblem
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={hasVotedProblem ? 'Remove upvote' : 'Upvote this problem'}
            >
              ▲
            </button>
            <strong className="text-sm font-bold text-slate-900">{problemVotes}</strong>
            <span className="text-[10px] uppercase font-semibold text-slate-400">votes</span>
          </div>
        </div>

        <p className="text-base text-slate-600 leading-relaxed max-w-3xl mb-6">
          {problem.description}
        </p>

        {/* Author Details */}
        <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
          <Avatar initials={problem.author.initials} size="lg" />
          <div>
            <strong className="text-sm font-bold text-slate-900 block">
              {problem.author.name}
            </strong>
            <span className="text-xs text-slate-400">{problem.author.timeAgo}</span>
          </div>
        </div>
      </section>

      {/* Validation Stage Timeline */}
      <StageTimeline
        currentStageIndex={problem.currentStageIndex}
        currentStageName={problem.stage}
      />

      {/* Two Column Layout (Main Content + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Detailed Problem Explanation Card */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              The Problem
            </span>
            <h2 className="text-xl font-bold text-slate-900 mb-4">What&apos;s happening?</h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              {problem.fullDescription?.length ? problem.fullDescription.map((para, i) => (
                <p key={i}>{para}</p>
              )) : <p>{problem.description}</p>}
            </div>
          </section>

          {/* Target Audience Card */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Who Faces It?
              </span>
              {!showAudienceInput && (
                <button
                  onClick={() => setShowAudienceInput(true)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  + Add
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {problem.whoFacesIt?.length ? problem.whoFacesIt.map((audience) => (
                <span
                  key={audience}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  {audience}
                </span>
              )) : (
                <span className="text-sm text-slate-500">General community members</span>
              )}
            </div>

            {showAudienceInput && (
              <form onSubmit={handleAddAudience} className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <input
                  type="text"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  placeholder="e.g. Small business owners"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={addingAudience || !newAudience.trim()}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAudienceInput(false);
                    setNewAudience('');
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </form>
            )}
          </section>

          {/* Evidence Stats + Images Gallery */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-4">
              Evidence &amp; References
            </span>

            {/* Evidence counters */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <EvidenceCard
                count={problem.evidence?.references || 0}
                label="Research references"
              />
              <EvidenceCard
                count={problem.evidence?.images || 0}
                label="Images"
              />
              <EvidenceCard
                count={problem.evidence?.solutions || 0}
                label="Existing solutions"
              />
            </div>

          </section>

          {/* AI Possible Solutions Section */}
          <AIPossibleSolutions problem={problem} />

          {/* ── Proposed Ideas / Solutions Section ── */}
          <section
            id="ideas-section"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Solutions &amp; Ideas
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Proposed Ideas
                  <span className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-sm font-bold">
                    {ideas.length}
                  </span>
                </h2>
              </div>

              {/* Primary CTA — always visible */}
              <Link
                href={`/submit-idea?problemId=${problem.id}`}
                id="propose-idea-btn"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
              >
                <span className="text-base leading-none">💡</span>
                Propose a Solution
              </Link>
            </div>

            {/* Ideas list or prominent empty state */}
            {ideas.length === 0 ? (
              <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/40 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No solutions proposed yet
                </h3>
                <p className="text-sm text-slate-500 mb-5 max-w-xs mx-auto">
                  Be the first to share an idea that could solve this problem. Every great solution
                  starts with a single proposal.
                </p>
                <Link
                  href={`/submit-idea?problemId=${problem.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  <span>💡</span> Propose the First Idea
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}

                {/* Secondary CTA below the list */}
                <div className="pt-2">
                  <Link
                    href={`/submit-idea?problemId=${problem.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    + Add another solution
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Discussion Card */}
          <CommentSection
            initialComments={comments}
            problemId={problem.id}
            onSubmit={handlePostComment}
          />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 sticky top-24 space-y-5">
          <SidebarTeamWidget />
          <SidebarRolesWidget roles={problem.lookingForRoles} problemId={problem.id} isLoggedIn={!!currentUser} />

          {/* Quick links card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Quick Actions
            </span>
            <div className="space-y-2">
              <Link
                href={`/submit-idea?problemId=${problem.id}`}
                className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
              >
                <span>💡</span> Propose a Solution
              </Link>
              <a
                href="#ideas-section"
                className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
              >
                <span>👀</span> View {ideas.length} Idea{ideas.length !== 1 ? 's' : ''}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
