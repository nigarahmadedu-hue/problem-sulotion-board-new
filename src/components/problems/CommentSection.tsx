'use client';

import React, { useState } from 'react';
import { Comment } from '@/types';
import { Avatar } from '@/components/ui/Avatar';

interface CommentSectionProps {
  initialComments: Comment[];
  problemId: string;
  onSubmit?: (content: string) => Promise<void>;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  initialComments,
  problemId,
  onSubmit
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(newComment.trim());
        setNewComment('');
      } catch (err) {
        console.error('Failed to post comment', err);
        alert('Failed to post comment.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Fallback if no onSubmit
      setNewComment('');
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
        Discussion
      </span>
      <h3 className="text-xl font-bold text-slate-900 mb-6">What do you think?</h3>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts, domain insights, or critique..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 rounded-lg transition-colors shadow-sm"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {initialComments.map((c) => (
          <div key={c.id} className="flex items-start gap-3.5 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
            <Avatar initials={c.author.initials} size="md" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <strong className="text-sm font-bold text-slate-900">{c.author.name}</strong>
                <span className="text-xs text-slate-400">• {c.timeAgo}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
