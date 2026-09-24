import React from 'react';
import { CategoryType } from '@/types';

interface BadgeProps {
  category: CategoryType | string;
  label?: string;
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  agriculture: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  education: 'bg-blue-50 text-blue-700 border-blue-200',
  healthcare: 'bg-rose-50 text-rose-700 border-rose-200',
  environment: 'bg-teal-50 text-teal-700 border-teal-200',
  business: 'bg-amber-50 text-amber-700 border-amber-200',
  technology: 'bg-purple-50 text-purple-700 border-purple-200',
  transport: 'bg-sky-50 text-sky-700 border-sky-200',
  government: 'bg-slate-100 text-slate-700 border-slate-300',
  community: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export const Badge: React.FC<BadgeProps> = ({ category, label, className = '' }) => {
  const normalizedCategory = category.toLowerCase();
  const colorClass = CATEGORY_COLORS[normalizedCategory] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      {label || category}
    </span>
  );
};
