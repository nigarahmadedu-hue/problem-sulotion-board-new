import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { CategoryType, ValidationStage } from '@/types';

interface DashboardProblemRowProps {
  id: string;
  category: CategoryType;
  categoryLabel: string;
  title: string;
  stage: ValidationStage;
}

export const DashboardProblemRow: React.FC<DashboardProblemRowProps> = ({
  id,
  category,
  categoryLabel,
  title,
  stage,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl hover:bg-slate-100/80 transition-colors">
      <div className="space-y-1.5">
        <Badge category={category} label={categoryLabel} />
        <h4 className="text-sm font-bold text-slate-900 hover:text-slate-800 transition-colors">
          <Link href={`/problems/${id}`} className="hover:underline">
            {title}
          </Link>
        </h4>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
          {stage}
        </span>
      </div>
    </div>
  );
};
