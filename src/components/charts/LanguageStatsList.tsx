'use client';

import * as React from 'react';
import { LanguageStat } from '@/types/github';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Terminal } from 'lucide-react';

interface LanguageStatsListProps {
  stats: LanguageStat[];
}

export function LanguageStatsList({ stats }: LanguageStatsListProps) {
  if (stats.length === 0) {
    return (
      <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-6 text-center text-neutral-400 dark:text-neutral-500 italic">
          No programming language data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl overflow-hidden flex flex-col h-full">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-500" />
          Language Statistics
        </CardTitle>
        <CardDescription className="text-xs text-neutral-400 dark:text-neutral-500">
          Distribution of languages across all repositories
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-center">
        {/* Progress Bar Track */}
        <div className="w-full h-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex overflow-hidden mb-6">
          {stats.map((stat) => (
            <div
              key={stat.language}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
              style={{
                width: `${stat.percentage}%`,
                backgroundColor: stat.color,
              }}
              title={`${stat.language}: ${stat.percentage}%`}
            />
          ))}
        </div>

        {/* Detailed Stats List */}
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.language} className="flex flex-col gap-1.5 group">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: stat.color }}
                  />
                  <span className="font-bold text-neutral-700 dark:text-neutral-200">
                    {stat.language}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
                    {stat.percentage}%
                  </span>
                  <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                    ({stat.count} {stat.count === 1 ? 'repo' : 'repos'})
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stat.percentage}%`,
                    backgroundColor: stat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
