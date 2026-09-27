'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PersonCard } from '@/components/people/PersonCard';
import { PeopleFilterBar } from '@/components/people/PeopleFilterBar';
import { Person } from '@/types';
import { api } from '@/lib/api';
import { getDynamicProfileDefaults } from '@/lib/profileHelpers';

export default function PeoplePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfiles()
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const mapped: Person[] = data.map((p) => {
            const roleCat = (p.role_category as any) || 'developer';
            const defaults = getDynamicProfileDefaults(roleCat);

            const rawSkills = Array.isArray(p.skills)
              ? p.skills
              : typeof p.skills === 'string' && p.skills
              ? p.skills.split(',').map((s: string) => s.trim())
              : [];

            return {
              id: p.id,
              name: p.name || 'Anonymous',
              initials: p.initials || 'AN',
              role: p.role || (roleCat.charAt(0).toUpperCase() + roleCat.slice(1)),
              roleCategory: roleCat,
              bio: p.bio || defaults.bio,
              skills: rawSkills.length ? rawSkills : defaults.skills,
              location: p.location || 'Global',
            };
          });
          setPeople(mapped);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch profiles:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      // Role match
      const matchesRole =
        selectedRole === 'all' || person.roleCategory === selectedRole;

      // Search match (name, role, skills, bio)
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        person.name.toLowerCase().includes(q) ||
        person.role.toLowerCase().includes(q) ||
        person.bio.toLowerCase().includes(q) ||
        person.skills.some((s) => s.toLowerCase().includes(q));

      return matchesRole && matchesSearch;
    });
  }, [searchTerm, selectedRole, people]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <section className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">
          The Community
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Find people to build with.
        </h1>
        <p className="text-base text-slate-600 max-w-2xl">
          Connect with developers, designers, researchers, domain experts and other builders.
        </p>
      </section>

      {/* Search & Role Filter */}
      <PeopleFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading builders...</div>
      ) : filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPeople.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-2xl">
          <span className="text-4xl block mb-3">👥</span>
          <h3 className="text-base font-bold text-slate-900 mb-1">No builders found</h3>
          <p className="text-sm text-slate-500 mb-6">
            Try searching for other skillsets or roles.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRole('all');
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
