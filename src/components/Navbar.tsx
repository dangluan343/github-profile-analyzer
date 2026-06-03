'use client';

import * as React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { SettingsModal } from './SettingsModal';
import { BarChart3 } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

interface NavbarProps {
  onTokenChange?: (token: string) => void;
}

export function Navbar({ onTokenChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-md transition-colors">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center p-2 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
            <GithubIcon className="h-5 w-5 absolute opacity-30" />
            <BarChart3 className="h-5 w-5 relative z-10" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight leading-none">
              GitHub Profile Analyzer
            </h1>
            <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
              Personalized Analytics Engine
            </span>
          </div>
        </div>

        {/* Toolbar Section */}
        <div className="flex items-center gap-2">
          <SettingsModal onTokenChange={onTokenChange} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
export default Navbar;
