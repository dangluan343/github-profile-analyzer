'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, History, X, User } from 'lucide-react';

interface SearchInputProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export function SearchInput({ onSearch, isLoading, initialValue = '' }: SearchInputProps) {
  const [query, setQuery] = React.useState(initialValue);
  const [history, setHistory] = React.useState<string[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Sync initialValue with state
  React.useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Load search history from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('github_search_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  // Close history dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus input on mount
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Trigger search
    onSearch(trimmed);
    setShowHistory(false);

    // Save search to history
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5); // Keep top 5
      localStorage.setItem('github_search_history', JSON.stringify(updated));
      return updated;
    });

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleRemoveHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((i) => i !== item);
      localStorage.setItem('github_search_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('github_search_history');
    setHistory([]);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-40">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter GitHub username (e.g. torvalds)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            className="w-full pl-11 pr-10 py-6 text-base bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-lg focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:border-transparent transition-all"
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                if (inputRef.current) inputRef.current.focus();
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-6 py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl dark:bg-indigo-500 dark:hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {/* History dropdown */}
      {showHistory && history.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center px-3 py-1.5 border-b border-neutral-100 dark:border-neutral-800/80 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" />
              Recent Searches
            </span>
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
          <ul className="flex flex-col gap-0.5">
            {history.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    onSearch(item);
                    setShowHistory(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-lg transition-colors text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="font-medium">{item}</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveHistoryItem(e, item)}
                    className="p-1 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all cursor-pointer"
                    title="Remove from history"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
