'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Key, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  onTokenChange?: (token: string) => void;
}

export function SettingsModal({ onTokenChange }: SettingsModalProps) {
  const [token, setToken] = React.useState('');
  const [showToken, setShowToken] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'cleared'>('idle');

  React.useEffect(() => {
    // Read from localStorage
    const savedToken = localStorage.getItem('github_pat') || '';
    setToken(savedToken);
  }, []);

  const handleSave = () => {
    localStorage.setItem('github_pat', token.trim());
    if (onTokenChange) {
      onTokenChange(token.trim());
    }
    setStatus('success');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem('github_pat');
    setToken('');
    if (onTokenChange) {
      onTokenChange('');
    }
    setStatus('cleared');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Settings"
          >
            <Settings className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:text-neutral-200" />
            <span className="sr-only">Settings</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-neutral-50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Key className="h-5 w-5 text-indigo-500" />
            GitHub API Settings
          </DialogTitle>
          <DialogDescription className="text-neutral-500 dark:text-neutral-400 text-sm">
            Add a Personal Access Token (PAT) to increase GitHub API rate limits.
            Unauthenticated rate limit is 60 requests/hr. With a PAT, it increases to 5000/hr.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="token" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Personal Access Token
            </label>
            <div className="relative flex items-center">
              <Input
                id="token"
                type={showToken ? 'text' : 'password'}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="pr-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-neutral-50 focus-visible:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Create a token with no scopes at{' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:underline font-medium"
              >
                github.com/settings/tokens
              </a>. No scope is required for public profile reading.
            </p>
          </div>
          
          {status === 'success' && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-lg text-sm border border-emerald-200 dark:border-emerald-900/30">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Token saved successfully! Reloading data...</span>
            </div>
          )}

          {status === 'cleared' && (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg text-sm border border-amber-200 dark:border-amber-900/30">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Token removed. Using public rate limits.</span>
            </div>
          )}
        </div>
        <DialogFooter className="flex sm:justify-between items-center gap-2">
          {token && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="border-red-200 dark:border-red-950 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              Clear Token
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <DialogClose render={<Button variant="ghost">Close</Button>} />
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
