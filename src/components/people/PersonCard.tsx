import React from 'react';
import Link from 'next/link';
import { Person } from '@/types';
import { Avatar } from '@/components/ui/Avatar';

interface PersonCardProps {
  person: Person;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  return (
    <article className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between text-center items-center group">
      <div className="flex flex-col items-center w-full">
        {/* Avatar */}
        <div className="mb-4 group-hover:scale-105 transition-transform">
          <Avatar initials={person.initials} size="xl" />
        </div>

        {/* Name & Role */}
        <h3 className="text-lg font-bold text-slate-900 mb-1">{person.name}</h3>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full mb-3">
          {person.role}
        </span>

        {/* Bio */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4 px-2">
          {person.bio}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
          {person.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Profile Button */}
      <Link
        href="/profile"
        className="w-full py-2 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
      >
        View Profile
      </Link>
    </article>
  );
};
