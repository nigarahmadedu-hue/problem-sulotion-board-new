import React from 'react';

interface EvidenceCardProps {
  count: number;
  label: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ count, label }) => {
  const formatted = count < 10 ? `0${count}` : `${count}`;

  return (
    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-center flex flex-col justify-center">
      <strong className="text-2xl font-black text-slate-900 block mb-1">
        {formatted}
      </strong>
      <span className="text-xs font-medium text-slate-500">{label}</span>
    </div>
  );
};
