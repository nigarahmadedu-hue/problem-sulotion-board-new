import React from 'react';
import { Avatar } from '@/components/ui/Avatar';

interface ActiveTeamCardProps {
  name: string;
  initials: string;
  membersCount: number;
}

export const ActiveTeamCard: React.FC<ActiveTeamCardProps> = ({
  name,
  initials,
  membersCount,
}) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
      <Avatar initials={initials} size="md" />
      <div>
        <strong className="text-sm font-bold text-slate-900 block">{name}</strong>
        <span className="text-xs text-slate-500">{membersCount} members</span>
      </div>
    </div>
  );
};
