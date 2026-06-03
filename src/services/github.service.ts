import { GitHubUser, GitHubRepository, LanguageStat, RepoAnalytics } from '@/types/github';

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00add8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Shell: '#89e051',
  C: '#555555',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Dart: '#00b4ab',
  Kotlin: '#A97BFF',
  'Objective-C': '#438eff',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Clojure: '#db5855',
  Lua: '#000080',
  R: '#198ce7',
  Julia: '#a270ba',
  Perl: '#0298c3',
  CoffeeScript: '#244776',
};

const DEFAULT_COLOR = '#8b949e'; // GitHub grey

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token && token.trim() !== '') {
    headers['Authorization'] = `token ${token.trim()}`;
  }
  return headers;
}

async function handleResponse(response: Response) {
  if (response.ok) {
    return response.json();
  }

  if (response.status === 404) {
    throw new Error('User not found');
  }

  if (response.status === 403 || response.status === 429) {
    const rateLimitLimit = response.headers.get('X-RateLimit-Limit');
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    if (rateLimitRemaining === '0') {
      throw new Error('GitHub API rate limit exceeded. Please add a Personal Access Token in settings to increase your limit.');
    }
  }

  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || `GitHub API error: ${response.status} ${response.statusText}`);
}

export async function getUser(username: string, token?: string): Promise<GitHubUser> {
  const url = `https://api.github.com/users/${username}`;
  const response = await fetch(url, {
    headers: getHeaders(token),
    next: { revalidate: 3600 } // Cache for 1 hour
  }).catch((err) => {
    throw new Error(`Network error: ${err.message || 'Failed to connect to GitHub'}`);
  });
  return handleResponse(response);
}

export async function getRepositories(username: string, token?: string): Promise<GitHubRepository[]> {
  let page = 1;
  let allRepos: GitHubRepository[] = [];
  let hasMore = true;
  const maxPages = 5; // Fetch up to 500 repos to prevent hitting rate limits

  while (hasMore && page <= maxPages) {
    const url = `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`;
    const response = await fetch(url, {
      headers: getHeaders(token),
      next: { revalidate: 3600 }
    }).catch((err) => {
      throw new Error(`Network error: ${err.message || 'Failed to connect to GitHub'}`);
    });

    const repos: GitHubRepository[] = await handleResponse(response);
    if (repos.length === 0) {
      hasMore = false;
    } else {
      allRepos = [...allRepos, ...repos];
      if (repos.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }
  }

  return allRepos;
}

export function getTopRepositories(
  repos: GitHubRepository[],
  sortBy: 'stars' | 'forks' | 'updated',
  limit = 10
): GitHubRepository[] {
  const sorted = [...repos];
  if (sortBy === 'stars') {
    sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } else if (sortBy === 'forks') {
    sorted.sort((a, b) => b.forks_count - a.forks_count);
  } else if (sortBy === 'updated') {
    sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }
  return sorted.slice(0, limit);
}

export function getLanguageStats(repos: GitHubRepository[]): LanguageStat[] {
  const counts: Record<string, { count: number; stars: number }> = {};
  let totalValidRepos = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      totalValidRepos++;
      if (!counts[repo.language]) {
        counts[repo.language] = { count: 0, stars: 0 };
      }
      counts[repo.language].count++;
      counts[repo.language].stars += repo.stargazers_count;
    }
  });

  if (totalValidRepos === 0) return [];

  const stats: LanguageStat[] = Object.keys(counts).map((lang) => {
    const info = counts[lang];
    const percentage = Math.round((info.count / totalValidRepos) * 100);
    return {
      language: lang,
      percentage,
      count: info.count,
      stars: info.stars,
      color: LANGUAGE_COLORS[lang] || DEFAULT_COLOR,
    };
  });

  // Sort by percentage usage descending
  stats.sort((a, b) => b.percentage - a.percentage);

  // Group languages with low usage into "Other" if there are too many
  const mainStats = stats.filter(s => s.percentage >= 2);
  const otherStats = stats.filter(s => s.percentage < 2);

  if (otherStats.length > 0) {
    const otherCount = otherStats.reduce((acc, curr) => acc + curr.count, 0);
    const otherStars = otherStats.reduce((acc, curr) => acc + curr.stars, 0);
    const otherPercentage = otherStats.reduce((acc, curr) => acc + curr.percentage, 0);
    
    if (otherPercentage > 0) {
      mainStats.push({
        language: 'Other',
        percentage: otherPercentage,
        count: otherCount,
        stars: otherStars,
        color: DEFAULT_COLOR,
      });
    }
  }

  // Adjust total percentage to exactly 100 if it's off due to rounding
  const totalPercentage = mainStats.reduce((sum, item) => sum + item.percentage, 0);
  if (totalPercentage > 0 && totalPercentage !== 100 && mainStats.length > 0) {
    mainStats[0].percentage += (100 - totalPercentage);
  }

  return mainStats.sort((a, b) => b.percentage - a.percentage);
}

export function getRepoAnalytics(repos: GitHubRepository[]): RepoAnalytics {
  const totalRepos = repos.length;
  if (totalRepos === 0) {
    return {
      totalRepos: 0,
      totalStars: 0,
      totalForks: 0,
      mostStarred: null,
      mostForked: null,
      recentlyUpdated: [],
      avgStars: 0,
      avgForks: 0,
      activityScore: 0,
      languageStats: [],
      timeline: [],
      starsTimeline: [],
    };
  }

  let totalStars = 0;
  let totalForks = 0;
  let mostStarred: GitHubRepository | null = null;
  let mostForked: GitHubRepository | null = null;

  repos.forEach((repo) => {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;

    if (!mostStarred || repo.stargazers_count > mostStarred.stargazers_count) {
      mostStarred = repo;
    }
    if (!mostForked || repo.forks_count > mostForked.forks_count) {
      mostForked = repo;
    }
  });

  const avgStars = Number((totalStars / totalRepos).toFixed(2));
  const avgForks = Number((totalForks / totalRepos).toFixed(2));

  // Recently updated: repos updated in last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentlyUpdated = repos.filter(
    (repo) => new Date(repo.updated_at).getTime() >= thirtyDaysAgo.getTime()
  );

  // Activity Score calculation:
  // - Base score from repo count (up to 20 points, 1 point per repo)
  // - Stars score (up to 40 points, 0.5 points per star)
  // - Forks score (up to 20 points, 1 point per fork)
  // - Recency score (up to 20 points: percentage of recently updated repos * 20)
  const repoPoints = Math.min(totalRepos, 20);
  const starPoints = Math.min(totalStars * 0.5, 40);
  const forkPoints = Math.min(totalForks * 1.0, 20);
  const recencyPercentage = totalRepos > 0 ? recentlyUpdated.length / totalRepos : 0;
  const recencyPoints = recencyPercentage * 20;

  const activityScore = Math.round(repoPoints + starPoints + forkPoints + recencyPoints);

  const languageStats = getLanguageStats(repos);

  // Group by year and month of creation for the timeline chart
  const timelineMap: Record<string, { count: number; name: string }> = {};
  repos.forEach((repo) => {
    const date = new Date(repo.created_at);
    // Format as YYYY-MM
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!timelineMap[yearMonth]) {
      timelineMap[yearMonth] = { count: 0, name: yearMonth };
    }
    timelineMap[yearMonth].count++;
  });

  // Sort timeline chronologically
  const timeline = Object.keys(timelineMap)
    .sort()
    .map((key) => ({
      date: key,
      count: timelineMap[key].count,
      name: key,
    }));

  // Top 8 repos by stars for a bar chart
  const starsTimeline = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 8)
    .map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
    }));

  return {
    totalRepos,
    totalStars,
    totalForks,
    mostStarred,
    mostForked,
    recentlyUpdated: getTopRepositories(repos, 'updated', 5),
    avgStars,
    avgForks,
    activityScore: Math.min(activityScore, 100), // Cap at 100
    languageStats,
    timeline,
    starsTimeline,
  };
}
