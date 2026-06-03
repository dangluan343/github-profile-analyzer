export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
  html_url: string;
  email: string | null;
  twitter_username: string | null;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  size: number;
  topics?: string[];
  watchers_count: number;
  open_issues_count: number;
}

export interface LanguageStat {
  language: string;
  percentage: number;
  count: number;
  stars: number;
  color: string;
}

export interface RepoAnalytics {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  mostStarred: GitHubRepository | null;
  mostForked: GitHubRepository | null;
  recentlyUpdated: GitHubRepository[];
  avgStars: number;
  avgForks: number;
  activityScore: number; // custom calculation
  languageStats: LanguageStat[];
  timeline: { date: string; count: number; name: string }[];
  starsTimeline: { name: string; stars: number }[];
}
