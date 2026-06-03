'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { SearchInput } from '@/components/SearchInput';
import { useGitHubUser, useGitHubRepos } from '@/hooks/useGitHubData';
import { ProfileOverview } from '@/components/profile/ProfileOverview';
import { ContributionSummary } from '@/components/profile/ContributionSummary';
import { LanguageStatsList } from '@/components/charts/LanguageStatsList';
import { AnalyticsCharts } from '@/components/charts/AnalyticsCharts';
import { RepositoryList } from '@/components/repositories/RepositoryList';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SettingsModal } from '@/components/SettingsModal';
import {
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Search,
  Key,
  TrendingUp,
  Terminal,
  Activity,
  UserX,
  WifiOff,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = React.useState('');

  // Get username from URL search query parameter
  const username = searchParams.get('username') || null;

  // Read saved GitHub Token on mount
  React.useEffect(() => {
    const savedToken = localStorage.getItem('github_pat') || '';
    setToken(savedToken);
  }, []);

  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    // Mutate SWR hooks automatically to re-fetch with new token headers
    mutateUser();
    mutateRepos();
  };

  // Fetch data using SWR
  const {
    user,
    error: userError,
    isLoading: userLoading,
    mutate: mutateUser,
  } = useGitHubUser(username, token);

  const {
    repos,
    analytics,
    error: reposError,
    isLoading: reposLoading,
    mutate: mutateRepos,
  } = useGitHubRepos(username, token);

  const handleSearch = (newUsername: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newUsername.trim()) {
      params.set('username', newUsername.trim());
    } else {
      params.delete('username');
    }
    router.push(`?${params.toString()}`);
  };

  const handleRetry = () => {
    mutateUser();
    mutateRepos();
  };

  const isLoading = userLoading || reposLoading;
  const error = userError || reposError;

  // Suggestions for home page
  const suggestions = [
    { name: 'Linus Torvalds', username: 'torvalds' },
    { name: 'Dan Abramov', username: 'gaearon' },
    { name: 'Evan You', username: 'yyx990803' },
    { name: 'Sarah Drasner', username: 'sdras' },
    { name: 'Guillermo Rauch', username: 'rauchg' },
    { name: 'TJ Holowaychuk', username: 'tj' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-200">
      <Navbar onTokenChange={handleTokenChange} />

      <main className="flex-1 container max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Search Header Area */}
        <div className="w-full text-center space-y-4">
          {!username && (
            <div className="space-y-2 max-w-2xl mx-auto py-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Next Generation Stats
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                Reveal Your GitHub Story
              </h2>
              <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-medium">
                Enter a GitHub username to visualize code metrics, project timelines, language distribution, and calculate repository productivity analytics.
              </p>
            </div>
          )}

          <SearchInput onSearch={handleSearch} isLoading={isLoading} initialValue={username || ''} />
        </div>

        {/* Dynamic Display Panel */}
        <div className="flex-1 flex flex-col">
          {/* STATE 1: Empty state (No username entered) */}
          {!username && (
            <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-12 max-w-4xl mx-auto w-full gap-8">
              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base mt-4 text-neutral-800 dark:text-neutral-100">
                    Detailed Diagnostics
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-normal leading-relaxed">
                    Aggregate total repos, stars, and forks. Generate a custom activity score derived from repository numbers and recent update frequency.
                  </p>
                </Card>

                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit">
                    <Terminal className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base mt-4 text-neutral-800 dark:text-neutral-100">
                    Language Footprints
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-normal leading-relaxed">
                    Automatically parse repositories to detect primary languages, compute usage percentages, and display results using native GitHub-styled visual elements.
                  </p>
                </Card>

                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base mt-4 text-neutral-800 dark:text-neutral-100">
                    Interactive Graphics
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-normal leading-relaxed">
                    Map code histories using charts: language distribution donuts, top repository star counts, and timelines graphing repo creations.
                  </p>
                </Card>
              </div>

              {/* Suggestions Section */}
              <div className="text-center space-y-3 mt-4">
                <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Search className="h-3.5 w-3.5" />
                  Popular Suggestions
                </span>
                <div className="flex flex-wrap gap-2.5 justify-center max-w-2xl">
                  {suggestions.map((sug) => (
                    <Button
                      key={sug.username}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(sug.username)}
                      className="rounded-xl border-neutral-200 dark:border-neutral-800 hover:border-indigo-400 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 text-xs font-medium cursor-pointer"
                    >
                      <GithubIcon className="h-3 w-3 mr-1.5 text-neutral-400" />
                      {sug.name} ({sug.username})
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Loading State */}
          {username && isLoading && (
            <div className="flex-1">
              <DashboardSkeleton />
            </div>
          )}

          {/* STATE 3: Error State */}
          {username && !isLoading && error && (
            <div className="flex-1 flex items-center justify-center py-12">
              {error.message.includes('rate limit exceeded') ? (
                /* Rate Limit Error Card */
                <Card className="max-w-md w-full border border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/10 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
                  <div className="mx-auto w-14 h-14 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-500">
                    <Key className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                      API Rate Limit Exceeded
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                      GitHub limits anonymous requests to 60 per hour. You can easily add a Personal Access Token to increase this limit to 5,000 per hour.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 pt-2">
                    <div className="inline-flex justify-center">
                      <SettingsModal onTokenChange={handleTokenChange} />
                    </div>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                      Tokens are stored locally in your browser and never sent to external servers.
                    </p>
                  </div>
                </Card>
              ) : error.message.includes('User not found') ? (
                /* 404 User Not Found Card */
                <Card className="max-w-md w-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
                  <div className="mx-auto w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                    <UserX className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                      Developer Not Found
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                      We couldn't find a GitHub profile for <span className="font-extrabold text-indigo-500">"{username}"</span>. Please check the typing and try again.
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSearch('')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl cursor-pointer"
                  >
                    Go Back
                  </Button>
                </Card>
              ) : (
                /* Generic Connection/Network Error Card */
                <Card className="max-w-md w-full border border-red-200 dark:border-red-950 bg-red-50/10 dark:bg-red-950/10 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
                  <div className="mx-auto w-14 h-14 bg-red-100 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
                    <WifiOff className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                      Connection Failed
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                      {error.message || 'An unexpected error occurred while communicating with GitHub.'}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center pt-2">
                    <Button
                      variant="outline"
                      onClick={() => handleSearch('')}
                      className="rounded-xl border-neutral-200 dark:border-neutral-800 cursor-pointer"
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={handleRetry}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* STATE 4: Success - Render analytics dashboard */}
          {username && !isLoading && !error && user && repos && analytics && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <ProfileOverview user={user} rawReposData={repos} />
              
              <ContributionSummary analytics={analytics} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <div className="lg:col-span-1 h-full">
                  <LanguageStatsList stats={analytics.languageStats} />
                </div>
                <div className="lg:col-span-2 h-full">
                  <AnalyticsCharts analytics={analytics} />
                </div>
              </div>

              <RepositoryList repos={repos} />
            </div>
          )}
        </div>
      </main>

      {/* Page Footer */}
      <footer className="py-6 border-t border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 text-center text-xs text-neutral-400 dark:text-neutral-500 font-medium mt-auto transition-colors">
        <p className="flex items-center justify-center gap-1">
          Made with Next.js 15, Tailwind CSS & Recharts • GitHub Profile Analyzer
        </p>
      </footer>
    </div>
  );
}
