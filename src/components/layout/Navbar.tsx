'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { MobileNav } from './MobileNav';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black tracking-tight text-slate-900 flex items-center">
              SOCH<span className="text-emerald-600">.</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/problems"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/problems')
                    ? 'text-slate-900 bg-slate-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Problems
              </Link>
              <Link
                href="/people"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/people')
                    ? 'text-slate-900 bg-slate-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                People
              </Link>
              <Link
                href="/dashboard"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-slate-900 bg-slate-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/submit-problem"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
            >
              Submit Problem
            </Link>

            <NavAuthButtons />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

// Separate client component that reads localStorage only after mount (avoids SSR hydration mismatch)
function NavAuthButtons() {
  const [user, setUser] = React.useState<{ name: string; initials: string } | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('soch_user');
      if (raw) {
        const u = JSON.parse(raw);
        const initials =
          u.name
            ?.split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w: string) => w[0].toUpperCase())
            .join('') || 'U';
        setUser({ name: u.name, initials });
      }
    } catch {
      /* ignore */
    }
  }, []);

  if (!mounted) return null;

  if (user) {
    return (
      <>
        <Link href="/profile" title="View Profile" className="transition-transform hover:scale-105">
          <Avatar initials={user.initials} size="md" />
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('soch_token');
            localStorage.removeItem('soch_user');
            window.location.href = '/login';
          }}
          className="hidden sm:inline-flex text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
        >
          Sign Out
        </button>
      </>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
    >
      Sign In
    </Link>
  );
}
