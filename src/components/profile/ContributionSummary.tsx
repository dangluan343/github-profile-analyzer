'use client';

import * as React from 'react';
import { RepoAnalytics } from '@/types/github';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Star,
  GitFork,
  Activity,
  Award,
  TrendingUp,
  FileCode,
  Info,
} from 'lucide-react';

interface ContributionSummaryProps {
  analytics: RepoAnalytics;
}

export function ContributionSummary({ analytics }: ContributionSummaryProps) {
  // Activity score color mapping
  const getActivityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/10';
    if (score >= 50) return 'text-indigo-500 bg-indigo-500/10 dark:text-indigo-400 dark:bg-indigo-500/10';
    if (score >= 20) return 'text-amber-500 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/10';
    return 'text-rose-500 bg-rose-500/10 dark:text-rose-400 dark:bg-rose-500/10';
  };

  const getActivityBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 dark:bg-emerald-400';
    if (score >= 50) return 'bg-indigo-500 dark:bg-indigo-400';
    if (score >= 20) return 'bg-amber-500 dark:bg-amber-400';
    return 'bg-rose-500 dark:bg-rose-400';
  };

  const getActivityLevel = (score: number) => {
    if (score >= 80) return 'Hyperactive';
    if (score >= 50) return 'High';
    if (score >= 20) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity Score Card */}
      <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl overflow-hidden flex flex-col justify-between">
        <CardHeader className="p-6 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-500" />
                Repo Activity Score
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400 dark:text-neutral-500">
                Overall workspace productivity
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer bg-transparent border-none p-0 inline-flex items-center transition-colors">
                  <Info className="h-4.5 w-4.5" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px] p-3 text-xs bg-neutral-900 dark:bg-neutral-950 text-white rounded-xl shadow-xl border border-neutral-800">
                  <p className="font-bold mb-1.5">Activity Score Calculation:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Total repositories: up to 20 pts (1 pt each)</li>
                    <li>Total stars: up to 40 pts (0.5 pt each)</li>
                    <li>Total forks: up to 20 pts (1 pt each)</li>
                    <li>Recent updates (last 30d): up to 20 pts (percentage-based)</li>
                  </ul>
                  <p className="mt-2 text-[10px] text-neutral-400 border-t border-neutral-800 pt-1.5">
                    Maximum capped at 100 points.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative flex items-center justify-center">
              {/* Radial Score representation */}
              <div className="text-5xl font-extrabold text-neutral-900 dark:text-neutral-50 flex items-baseline">
                {analytics.activityScore}
                <span className="text-xl text-neutral-400 dark:text-neutral-500 font-medium">/100</span>
              </div>
            </div>
            
            <div className="mt-4 w-full">
              <div className="flex justify-between text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-1.5">
                <span>Activity Level</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getActivityColor(analytics.activityScore)}`}>
                  {getActivityLevel(analytics.activityScore)}
                </span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getActivityBarColor(analytics.activityScore)}`}
                  style={{ width: `${analytics.activityScore}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Metrics Card */}
      <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Contribution Averages
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400 dark:text-neutral-500">
            Per repository performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-4 flex-1 flex flex-col justify-around gap-4">
          <div className="flex justify-between items-center p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100/50 dark:border-neutral-800/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl text-yellow-600 dark:text-yellow-500">
                <Star className="h-4.5 w-4.5 fill-current" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">Average Stars</p>
                <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200">{analytics.avgStars}</h4>
              </div>
            </div>
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">stars / repo</span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100/50 dark:border-neutral-800/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl text-indigo-600 dark:text-indigo-500">
                <GitFork className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">Average Forks</p>
                <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200">{analytics.avgForks}</h4>
              </div>
            </div>
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">forks / repo</span>
          </div>
        </CardContent>
      </Card>

      {/* Highlights Card */}
      <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            Repository Highlights
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400 dark:text-neutral-500">
            Standout repositories in this profile
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-4 flex-1 flex flex-col justify-around gap-4">
          {analytics.mostStarred ? (
            <div className="flex flex-col gap-1 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100/50 dark:border-neutral-800/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> Most Starred Repo
              </span>
              <a
                href={analytics.mostStarred.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-neutral-800 dark:text-neutral-100 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors truncate"
              >
                {analytics.mostStarred.name}
              </a>
              <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" />
                  {analytics.mostStarred.stargazers_count}
                </span>
                {analytics.mostStarred.language && (
                  <span className="flex items-center gap-1">
                    <FileCode className="h-3.5 w-3.5" />
                    {analytics.mostStarred.language}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-neutral-400 dark:text-neutral-500 italic p-3 text-center">
              No starred repositories
            </div>
          )}

          {analytics.mostForked ? (
            <div className="flex flex-col gap-1 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100/50 dark:border-neutral-800/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                <GitFork className="h-3 w-3" /> Most Forked Repo
              </span>
              <a
                href={analytics.mostForked.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-neutral-800 dark:text-neutral-100 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors truncate"
              >
                {analytics.mostForked.name}
              </a>
              <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                <span className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5" />
                  {analytics.mostForked.forks_count}
                </span>
                {analytics.mostForked.language && (
                  <span className="flex items-center gap-1">
                    <FileCode className="h-3.5 w-3.5" />
                    {analytics.mostForked.language}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-neutral-400 dark:text-neutral-500 italic p-3 text-center">
              No forked repositories
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
