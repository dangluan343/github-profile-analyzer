'use client';

import * as React from 'react';
import { useGitHubUser, useGitHubRepos } from '@/hooks/useGitHubData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GithubIcon } from '@/components/icons/GithubIcon';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  Legend,
} from 'recharts';
import {
  Users,
  FolderGit,
  Star,
  GitFork,
  Activity,
  Award,
  Calendar,
  Building,
  MapPin,
  Flame,
  Crown,
  TrendingUp,
} from 'lucide-react';

interface ProfileCompareProps {
  user1: string;
  user2: string;
  token?: string;
  onClear: () => void;
}

export function ProfileCompare({ user1, user2, token, onClear }: ProfileCompareProps) {
  // Fetch data for Developer 1
  const {
    user: u1,
    error: err1,
    isLoading: loadingU1,
  } = useGitHubUser(user1 || null, token);
  const {
    repos: r1,
    analytics: a1,
    isLoading: loadingR1,
  } = useGitHubRepos(user1 || null, token);

  // Fetch data for Developer 2
  const {
    user: u2,
    error: err2,
    isLoading: loadingU2,
  } = useGitHubUser(user2 || null, token);
  const {
    repos: r2,
    analytics: a2,
    isLoading: loadingR2,
  } = useGitHubRepos(user2 || null, token);

  const isLoading = loadingU1 || loadingR1 || loadingU2 || loadingR2;
  const error = err1 || err2;

  // Render placeholder box if usernames are missing
  if (!user1 || !user2) {
    return (
      <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl p-8 text-center space-y-4 shadow-lg max-w-xl mx-auto">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Users className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
          Ready for Developer Battle?
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
          Please enter both usernames in the search boxes above to visualize and compare their statistics side-by-side.
        </p>
      </Card>
    );
  }

  // Render skeleton state
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-neutral-200 dark:bg-neutral-800/60 rounded-3xl" />
          <div className="h-48 bg-neutral-200 dark:bg-neutral-800/60 rounded-3xl" />
        </div>
        <div className="h-96 bg-neutral-200 dark:bg-neutral-800/60 rounded-3xl" />
      </div>
    );
  }

  // Render fetch errors
  if (error) {
    return (
      <Card className="border border-red-200 dark:border-red-950 bg-red-50/10 dark:bg-red-950/10 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto shadow-xl">
        <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
          <Award className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
          Search Error
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {err1 ? `Developer "${user1}" could not be loaded: ${err1.message}` : ''}
          {err1 && err2 ? ' and ' : ''}
          {err2 ? `Developer "${user2}" could not be loaded: ${err2.message}` : ''}
        </p>
        <Button onClick={onClear} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl cursor-pointer">
          Reset Comparison
        </Button>
      </Card>
    );
  }

  if (!u1 || !u2 || !a1 || !a2) return null;

  // Analytical computations for comparison
  const totalStars1 = a1.totalStars;
  const totalStars2 = a2.totalStars;
  const totalForks1 = a1.totalForks;
  const totalForks2 = a2.totalForks;

  const compareMetrics = [
    {
      label: 'Activity Score',
      v1: a1.activityScore,
      v2: a2.activityScore,
      format: (val: number) => `${val}/100`,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: 'Followers',
      v1: u1.followers,
      v2: u2.followers,
      format: (val: number) => val.toLocaleString(),
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: 'Public Repositories',
      v1: u1.public_repos,
      v2: u2.public_repos,
      format: (val: number) => val.toLocaleString(),
      icon: <FolderGit className="h-4 w-4" />,
    },
    {
      label: 'Total Stars',
      v1: totalStars1,
      v2: totalStars2,
      format: (val: number) => val.toLocaleString(),
      icon: <Star className="h-4 w-4" />,
    },
    {
      label: 'Total Forks',
      v1: totalForks1,
      v2: totalForks2,
      format: (val: number) => val.toLocaleString(),
      icon: <GitFork className="h-4 w-4" />,
    },
    {
      label: 'Average Stars/Repo',
      v1: a1.avgStars,
      v2: a2.avgStars,
      format: (val: number) => val.toFixed(1),
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: 'Average Forks/Repo',
      v1: a1.avgForks,
      v2: a2.avgForks,
      format: (val: number) => val.toFixed(1),
      icon: <GitFork className="h-4 w-4" />,
    },
  ];

  // Helper to determine winner styling
  const getWinner = (v1: number, v2: number) => {
    if (v1 > v2) return 1;
    if (v2 > v1) return 2;
    return 0; // tie
  };

  // Compute overall battle winner
  let wins1 = 0;
  let wins2 = 0;
  compareMetrics.forEach((m) => {
    const win = getWinner(m.v1, m.v2);
    if (win === 1) wins1++;
    if (win === 2) wins2++;
  });

  const overallWinner = wins1 > wins2 ? 1 : wins2 > wins1 ? 2 : 0;

  // Radar Chart data preparation (normalized relative to max value)
  const maxFollowers = Math.max(u1.followers, u2.followers, 1);
  const maxRepos = Math.max(u1.public_repos, u2.public_repos, 1);
  const maxStars = Math.max(totalStars1, totalStars2, 1);
  const maxForks = Math.max(totalForks1, totalForks2, 1);
  const maxAvgStars = Math.max(a1.avgStars, a2.avgStars, 0.1);

  const radarData = [
    {
      subject: 'Followers',
      [u1.login]: Math.round((u1.followers / maxFollowers) * 100),
      [u2.login]: Math.round((u2.followers / maxFollowers) * 100),
      raw1: u1.followers,
      raw2: u2.followers,
    },
    {
      subject: 'Public Repos',
      [u1.login]: Math.round((u1.public_repos / maxRepos) * 100),
      [u2.login]: Math.round((u2.public_repos / maxRepos) * 100),
      raw1: u1.public_repos,
      raw2: u2.public_repos,
    },
    {
      subject: 'Total Stars',
      [u1.login]: Math.round((totalStars1 / maxStars) * 100),
      [u2.login]: Math.round((totalStars2 / maxStars) * 100),
      raw1: totalStars1,
      raw2: totalStars2,
    },
    {
      subject: 'Total Forks',
      [u1.login]: Math.round((totalForks1 / maxForks) * 100),
      [u2.login]: Math.round((totalForks2 / maxForks) * 100),
      raw1: totalForks1,
      raw2: totalForks2,
    },
    {
      subject: 'Avg Stars/Repo',
      [u1.login]: Math.round((a1.avgStars / maxAvgStars) * 100),
      [u2.login]: Math.round((a2.avgStars / maxAvgStars) * 100),
      raw1: a1.avgStars,
      raw2: a2.avgStars,
    },
    {
      subject: 'Activity Score',
      [u1.login]: a1.activityScore,
      [u2.login]: a2.activityScore,
      raw1: a1.activityScore,
      raw2: a2.activityScore,
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full">
      {/* VS Head Header */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-stretch">
        {/* Developer A Card */}
        <Card className={`md:col-span-3 border overflow-hidden rounded-3xl transition-all shadow-lg ${
          overallWinner === 1 
            ? 'border-emerald-500 dark:border-emerald-500/80 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]' 
            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
        }`}>
          <CardContent className="p-6 text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <img
                src={u1.avatar_url}
                alt={u1.name || u1.login}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto object-cover border-4 ${
                  overallWinner === 1 ? 'border-emerald-500' : 'border-indigo-100 dark:border-indigo-950/40'
                }`}
              />
              {overallWinner === 1 && (
                <div className="absolute -top-3 -right-2 bg-yellow-500 text-neutral-900 p-1.5 rounded-full shadow-md animate-bounce">
                  <Crown className="h-4.5 w-4.5 fill-current" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-extrabold truncate">{u1.name || u1.login}</h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold">@{u1.login}</p>
            </div>
            {u1.bio && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 max-w-sm mx-auto font-normal">
                {u1.bio}
              </p>
            )}
            <div className="pt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-800">
              {u1.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{u1.location}</span>
                </div>
              )}
              {u1.company && (
                <div className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5" />
                  <span>{u1.company}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {formatDate(u1.created_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VS Separator */}
        <div className="md:col-span-1 flex flex-col items-center justify-center min-h-[120px] relative">
          <div className="absolute top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800 hidden md:block" />
          <div className="w-14 h-14 rounded-full bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-950 font-black text-lg tracking-wider flex items-center justify-center shadow-2xl relative z-10 select-none border-4 border-neutral-50 dark:border-neutral-950 animate-pulse">
            VS
          </div>
          <div className="text-center mt-2 z-10 md:absolute md:bottom-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
              Developer Battle
            </span>
          </div>
        </div>

        {/* Developer B Card */}
        <Card className={`md:col-span-3 border overflow-hidden rounded-3xl transition-all shadow-lg ${
          overallWinner === 2 
            ? 'border-emerald-500 dark:border-emerald-500/80 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]' 
            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
        }`}>
          <CardContent className="p-6 text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <img
                src={u2.avatar_url}
                alt={u2.name || u2.login}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto object-cover border-4 ${
                  overallWinner === 2 ? 'border-emerald-500' : 'border-indigo-100 dark:border-indigo-950/40'
                }`}
              />
              {overallWinner === 2 && (
                <div className="absolute -top-3 -right-2 bg-yellow-500 text-neutral-900 p-1.5 rounded-full shadow-md animate-bounce">
                  <Crown className="h-4.5 w-4.5 fill-current" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-extrabold truncate">{u2.name || u2.login}</h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold">@{u2.login}</p>
            </div>
            {u2.bio && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 max-w-sm mx-auto font-normal">
                {u2.bio}
              </p>
            )}
            <div className="pt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-800">
              {u2.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{u2.location}</span>
                </div>
              )}
              {u2.company && (
                <div className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5" />
                  <span>{u2.company}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {formatDate(u2.created_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side-by-Side Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        {/* Radar Skills Chart */}
        <Card className="lg:col-span-2 border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl p-6 flex flex-col justify-between">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" />
              Stat Radar Comparison
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400 dark:text-neutral-500">
              Visualizing relative strengths (0 - 100 scale)
            </CardDescription>
          </CardHeader>
          <div className="w-full h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#888888" strokeOpacity={0.2} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 600 }}
                  className="text-neutral-500 dark:text-neutral-400"
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'currentColor', fontSize: 9 }} />
                <Radar
                  name={u1.login}
                  dataKey={u1.login}
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.25}
                />
                <Radar
                  name={u2.login}
                  dataKey={u2.login}
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.25}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-neutral-950 text-white p-3 rounded-xl border border-neutral-800 shadow-xl text-xs space-y-1.5">
                          <p className="font-extrabold text-neutral-300">{data.subject}</p>
                          <p className="flex justify-between gap-6 font-semibold">
                            <span className="text-indigo-400">@{u1.login}:</span>
                            <span>{data.raw1.toLocaleString()}</span>
                          </p>
                          <p className="flex justify-between gap-6 font-semibold">
                            <span className="text-emerald-400">@{u2.login}:</span>
                            <span>{data.raw2.toLocaleString()}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Metrics Grid Comparison Table */}
        <Card className="lg:col-span-3 border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl p-6 flex flex-col justify-between">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              Head-to-Head Comparison
            </CardTitle>
            <CardDescription className="text-xs text-neutral-400 dark:text-neutral-500">
              Breakdown of individual performance indicators
            </CardDescription>
          </CardHeader>
          <div className="space-y-3.5 flex-1 flex flex-col justify-around">
            {compareMetrics.map((m) => {
              const win = getWinner(m.v1, m.v2);
              return (
                <div
                  key={m.label}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100/50 dark:border-neutral-800/40 hover:scale-[1.01] transition-transform gap-4"
                >
                  {/* Left Player Stat */}
                  <div className="w-24 text-right">
                    <span className={`text-sm font-black ${
                      win === 1 ? 'text-emerald-500' : 'text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {m.format(m.v1)}
                    </span>
                    {win === 1 && (
                      <Badge className="ml-1 px-1 bg-emerald-500/10 hover:bg-emerald-500/10 text-emerald-500 text-[9px] border-none font-bold align-middle">
                        WIN
                      </Badge>
                    )}
                  </div>

                  {/* Icon & Label */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-lg w-fit mb-1">
                      {m.icon}
                    </div>
                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 truncate max-w-[150px]">
                      {m.label}
                    </span>
                  </div>

                  {/* Right Player Stat */}
                  <div className="w-24 text-left">
                    <span className={`text-sm font-black ${
                      win === 2 ? 'text-emerald-500' : 'text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {m.format(m.v2)}
                    </span>
                    {win === 2 && (
                      <Badge className="ml-1 px-1 bg-emerald-500/10 hover:bg-emerald-500/10 text-emerald-500 text-[9px] border-none font-bold align-middle">
                        WIN
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Language Breakdown side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm font-extrabold flex items-center gap-1.5 text-indigo-500">
              <GithubIcon className="h-4 w-4" />
              @{u1.login} Language Footprint
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {a1.languageStats.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No language data found.</p>
            ) : (
              a1.languageStats.map((l) => (
                <div key={l.language} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                      {l.language}
                    </span>
                    <span className="text-neutral-400">{l.percentage}% ({l.count} repos)</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: l.color, width: `${l.percentage}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm font-extrabold flex items-center gap-1.5 text-emerald-500">
              <GithubIcon className="h-4 w-4" />
              @{u2.login} Language Footprint
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {a2.languageStats.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No language data found.</p>
            ) : (
              a2.languageStats.map((l) => (
                <div key={l.language} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                      {l.language}
                    </span>
                    <span className="text-neutral-400">{l.percentage}% ({l.count} repos)</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: l.color, width: `${l.percentage}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
