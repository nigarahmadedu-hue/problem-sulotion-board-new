import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  delta: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, delta }) => {
  const formattedVal = typeof value === 'number' && value < 10 ? `0${value}` : `${value}`;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
        {label}
      </span>
      <strong className="text-3xl font-black text-slate-900 block mb-2 tracking-tight">
        {formattedVal}
      </strong>
      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 inline-block">
        {delta}
      </span>
    </div>
  );
};
