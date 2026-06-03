'use client';

import * as React from 'react';
import { GitHubRepository } from '@/types/github';
import { getTopRepositories } from '@/services/github.service';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LANGUAGE_COLORS } from '@/services/github.service';
import {
  Star,
  GitFork,
  Calendar,
  FolderOpen,
  Search,
  Scale,
  ExternalLink,
} from 'lucide-react';

interface RepositoryListProps {
  repos: GitHubRepository[];
}

export function RepositoryList({ repos }: RepositoryListProps) {
  const [activeTab, setActiveTab] = React.useState<'stars' | 'forks' | 'updated'>('stars');
  const [searchQuery, setSearchQuery] = React.useState('');

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return 'Updated today';
    if (diffDays === 2) return 'Updated yesterday';
    if (diffDays < 30) return `Updated ${diffDays} days ago`;
    
    return `Updated on ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  const formatSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  // Filter repositories first
  const filteredRepos = React.useMemo(() => {
    if (!searchQuery.trim()) return repos;
    const lowerQuery = searchQuery.toLowerCase();
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(lowerQuery) ||
        (repo.description && repo.description.toLowerCase().includes(lowerQuery))
    );
  }, [repos, searchQuery]);

  // Then sort and take top 10
  const displayedRepos = React.useMemo(() => {
    return getTopRepositories(filteredRepos, activeTab, 10);
  }, [filteredRepos, activeTab]);

  return (
    <div className="space-y-6">
      {/* List Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            <FolderOpen className="h-5.5 w-5.5 text-indigo-500" />
            Top Repositories
          </h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Explore and filter the top 10 repositories
          </p>
        </div>

        {/* Tab Controls */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'stars' | 'forks' | 'updated')}
          className="w-auto self-start"
        >
          <TabsList className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-0.5 rounded-xl">
            <TabsTrigger
              value="stars"
              className="rounded-lg text-xs font-semibold px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm cursor-pointer"
            >
              Stars
            </TabsTrigger>
            <TabsTrigger
              value="forks"
              className="rounded-lg text-xs font-semibold px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm cursor-pointer"
            >
              Forks
            </TabsTrigger>
            <TabsTrigger
              value="updated"
              className="rounded-lg text-xs font-semibold px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm cursor-pointer"
            >
              Updated
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filter Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400 dark:text-neutral-500" />
        <Input
          type="text"
          placeholder="Filter repositories by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-5 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl focus-visible:ring-indigo-500"
        />
      </div>

      {/* Repository Cards Grid */}
      {displayedRepos.length === 0 ? (
        <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-lg rounded-2xl">
          <CardContent className="p-8 text-center text-neutral-400 dark:text-neutral-500 italic">
            No repositories found matching your filter
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedRepos.map((repo) => (
            <Card
              key={repo.id}
              className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-md hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/30 rounded-2xl transition-all duration-300 group flex flex-col justify-between"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-neutral-900 dark:text-neutral-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors break-all flex items-center gap-1 group-hover:translate-x-0.5 duration-200"
                    >
                      {repo.name}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    
                    {repo.size > 0 && (
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 border-none font-medium whitespace-nowrap shrink-0">
                        {formatSize(repo.size)}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 h-8 font-normal leading-relaxed">
                    {repo.description || <span className="text-neutral-400 dark:text-neutral-600 italic">No description provided</span>}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-50 dark:border-neutral-800/40 pt-3 mt-auto">
                  {/* Language dot */}
                  {repo.language ? (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#8b949e' }}
                      />
                      <span className="font-semibold text-[11px] text-neutral-700 dark:text-neutral-300">
                        {repo.language}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] italic text-neutral-400 dark:text-neutral-600">Unknown language</span>
                  )}

                  {/* Stars/Forks/Updated */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1" title="Stars">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/10" />
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">{repo.stargazers_count}</span>
                    </div>
                    
                    <div className="flex items-center gap-1" title="Forks">
                      <GitFork className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">{repo.forks_count}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{formatLastUpdated(repo.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
