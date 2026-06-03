import useSWR from 'swr';
import { getUser, getRepositories, getRepoAnalytics } from '@/services/github.service';
import { GitHubUser, GitHubRepository, RepoAnalytics } from '@/types/github';
import { useMemo } from 'react';

// SWR configurations
const swrOptions = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 10000, // 10 seconds
  shouldRetryOnError: false, // Don't spam the GitHub API on errors
};

export function useGitHubUser(username: string | null, token?: string) {
  const { data, error, isLoading, mutate } = useSWR<GitHubUser, Error>(
    username ? ['github-user', username, token] : null,
    async ([_, uname, tok]) => {
      return getUser(uname as string, tok as string);
    },
    swrOptions
  );

  return {
    user: data,
    error,
    isLoading,
    mutate,
  };
}

export function useGitHubRepos(username: string | null, token?: string) {
  const { data, error, isLoading, mutate } = useSWR<GitHubRepository[], Error>(
    username ? ['github-repos', username, token] : null,
    async ([_, uname, tok]) => {
      return getRepositories(uname as string, tok as string);
    },
    swrOptions
  );

  // Compute analytics client-side using useMemo to avoid unnecessary re-renders
  const analytics = useMemo<RepoAnalytics | null>(() => {
    if (!data) return null;
    return getRepoAnalytics(data);
  }, [data]);

  return {
    repos: data,
    analytics,
    error,
    isLoading,
    mutate,
  };
}
