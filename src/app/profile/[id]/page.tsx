'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { getDynamicProfileDefaults } from '@/lib/profileHelpers';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function UserProfilePage({ params }: ProfilePageProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfileById(params.id)
      .then((data) => {
        // Handle parsing skills in case they are string
        const roleCat = (data.role_category as any) || 'developer';
        const defaults = getDynamicProfileDefaults(roleCat);

        const rawSkills = Array.isArray(data.skills)
          ? data.skills
          : typeof data.skills === 'string' && data.skills
          ? data.skills.split(',').map((s: string) => s.trim())
          : [];

        setProfile({
          ...data,
          skills: rawSkills.length ? rawSkills : defaults.skills,
          role: data.role || (roleCat.charAt(0).toUpperCase() + roleCat.slice(1)),
          bio: data.bio || defaults.bio,
          location: data.location || 'Global',
          initials: data.initials || 'AN',
        });
      })
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
        <Link href="/people" className="text-emerald-600 font-semibold hover:underline">
          &larr; Back to People
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link
          href="/people"
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors gap-1.5"
        >
          &larr; Back to community
        </Link>
      </div>

      {/* Profile Header Hero */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <Avatar initials={profile.initials} size="xl" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                {profile.role}
              </p>
              <span className="text-xs text-slate-400 mt-1 block">
                📍 {profile.location}
              </span>
            </div>
          </div>
        </div>

        {/* Bio & Skills */}
        <div className="pt-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            About & Philosophy
          </span>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mb-6">
            {profile.bio}
          </p>

          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Core Skills & Specializations
          </span>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill: string) => (
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
    </main>
  );
}
