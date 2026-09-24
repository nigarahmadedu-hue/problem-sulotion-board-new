'use client';

import React from 'react';

interface PeopleFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const ROLES_FILTER = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI Engineer' },
  { id: 'developer', label: 'Developer' },
  { id: 'designer', label: 'Designer' },
  { id: 'researcher', label: 'Researcher' },
  { id: 'expert', label: 'Domain Expert' },
];

export const PeopleFilterBar: React.FC<PeopleFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Search Input */}
      <div className="relative max-w-xl">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-lg">
          ⌕
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search people by name, role or skills (e.g. Python, UX, AI)..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Role Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ROLES_FILTER.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onRoleChange(r.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
