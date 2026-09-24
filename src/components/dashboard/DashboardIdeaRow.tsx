import React from 'react';

interface DashboardIdeaRowProps {
  title: string;
  problemTitle: string;
  votes: number;
}

export const DashboardIdeaRow: React.FC<DashboardIdeaRowProps> = ({
  title,
  problemTitle,
  votes,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl hover:bg-slate-100/80 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-xl select-none mt-0.5">💡</span>
        <div>
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{problemTitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800">
        <span>{votes}</span>
        <span className="text-emerald-600">↑</span>
      </div>
    </div>
  );
};
