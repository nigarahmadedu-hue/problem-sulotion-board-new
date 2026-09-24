'use client';

import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'outline' | 'light' | 'ghost';
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  href,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium text-sm transition-colors rounded-lg px-4 py-2.5 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1';

  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
    dark: 'bg-slate-950 text-white hover:bg-slate-900 shadow-sm',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400',
    light: 'bg-white text-slate-900 hover:bg-slate-100 shadow-sm border border-slate-200',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
