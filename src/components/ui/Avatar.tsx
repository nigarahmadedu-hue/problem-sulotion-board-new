import React from 'react';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-16 h-16 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', className = '' }) => {
  return (
    <div
      className={`rounded-full bg-slate-900 text-white font-semibold flex items-center justify-center select-none shadow-sm flex-shrink-0 ${SIZE_CLASSES[size]} ${className}`}
    >
      {initials}
    </div>
  );
};
