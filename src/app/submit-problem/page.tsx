'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CategoryType } from '@/types';

const CATEGORIES: { value: CategoryType; label: string; icon: string }[] = [
  { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'environment', label: 'Environment', icon: '🌿' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'transport', label: 'Transport', icon: '🚌' },
  { value: 'government', label: 'Government', icon: '🏛️' },
  { value: 'community', label: 'Community', icon: '🤝' },
];

const ANONYMOUS_AUTHOR_ID = '5a126e26-2720-4c2a-811b-76b7e57ef36e';

function generateSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 70);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${randomSuffix}`;
}

export default function SubmitProblemPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType | ''>('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [whoFacesIt, setWhoFacesIt] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !category || !description.trim()) {
      setError('Please fill in the required fields: title, category, and description.');
      return;
    }

    setSubmitting(true);

    const whoFacesItArray = whoFacesIt
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const fullDescArray = fullDescription
      .split('\n\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const slug = generateSlug(title);

    try {
      const newProblem = await api.createProblem({
        title: title.trim(),
        slug,
        category,
        location: location.trim() || 'Global',
        description: description.trim(),
        full_description: fullDescArray.length ? fullDescArray : null,
        who_faces_it: whoFacesItArray.length ? whoFacesItArray : null,
        stage: 'Submitted',
        author_id: ANONYMOUS_AUTHOR_ID,
      });

      if (evidenceImage && newProblem?.id) {
        await api.uploadEvidenceImage(newProblem.id, evidenceImage);
      }

      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push('/problems');
      }, 1800);
    } catch (err: any) {
      console.error(err);
      setSubmitting(false);
      setError('Something went wrong while submitting. Please try again.');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-8">
        <Link
          href="/problems"
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors gap-1.5 mb-6"
        >
          &larr; Back to problems
        </Link>

        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
          Submit a Problem
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Share a real-world problem.
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
          Put your problem in front of people who can help. Be clear, specific, and honest — the
          best ideas come from the most accurate descriptions.
        </p>
      </div>

      {/* Success Banner */}
      {submitted && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center gap-2">
          <span className="text-lg">✓</span>
          Problem submitted successfully! Redirecting to the board…
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <span className="text-lg">⚠</span>
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-7"
      >
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Problem title <span className="text-rose-500">*</span>
          </label>
          <input
            id="problem-title"
            type="text"
            required
            maxLength={140}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Farmers cannot easily test soil nutrients"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
          <p className="mt-1.5 text-xs text-slate-400">{title.length}/140 characters</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Category <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                  category === cat.value
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl leading-none">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Location
          </label>
          <input
            id="problem-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Punjab, Pakistan (leave blank for Global)"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Short description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="problem-description"
            rows={4}
            required
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem in 1–3 sentences. What's happening and why does it matter?"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none"
          />
          <p className="mt-1.5 text-xs text-slate-400">{description.length}/500 characters</p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-1">
          <p className="text-xs text-slate-400 font-medium">
            Optional — but helps attract the right people
          </p>
        </div>

        {/* Who Faces It */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Who faces this problem?
          </label>
          <input
            id="problem-who-faces-it"
            type="text"
            value={whoFacesIt}
            onChange={(e) => setWhoFacesIt(e.target.value)}
            placeholder="e.g. Small farmers, rural health workers, students (comma-separated)"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Full problem description
          </label>
          <textarea
            id="problem-full-description"
            rows={7}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            placeholder={
              'Add more context, background, causes, and impact...\n\nSeparate paragraphs with a blank line.'
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Evidence Image */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Evidence Image (Optional)
          </label>
          <input
            id="problem-evidence-image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setEvidenceImage(e.target.files[0]);
              }
            }}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/problems"
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            id="submit-problem-btn"
            type="submit"
            disabled={submitting || submitted}
            className="px-7 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting…
              </>
            ) : submitted ? (
              '✓ Submitted!'
            ) : (
              'Submit Problem →'
            )}
          </button>
        </div>
      </form>

      {/* Tips Card */}
      <div className="mt-6 p-5 bg-slate-50 border border-slate-200/80 rounded-2xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Tips for a great submission
        </h3>
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold mt-0.5">→</span>
            <span>Be specific — "farmers can't test soil pH cheaply" is better than "agriculture problems"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold mt-0.5">→</span>
            <span>Describe the impact — who is affected and how badly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold mt-0.5">→</span>
            <span>Don't propose a solution — focus purely on the problem</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold mt-0.5">→</span>
            <span>Add a location so local builders can find and connect with you</span>
          </li>
        </ul>
      </div>
    </main>
  );
}
