'use client';

import * as React from 'react';
import { GitHubUser } from '@/types/github';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Building,
  Link as LinkIcon,
  Calendar,
  Users,
  GitFork,
  BookOpen,
  FolderGit,
  Share2,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';


interface ProfileOverviewProps {
  user: GitHubUser;
  rawReposData?: any; // To enable JSON download of the combined analytics payload
}

export function ProfileOverview({ user, rawReposData }: ProfileOverviewProps) {
  const [copiedShare, setCopiedShare] = React.useState(false);
  const [copiedProfile, setCopiedProfile] = React.useState(false);

  const formattedDate = React.useMemo(() => {
    return new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [user.created_at]);

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (err) {
      console.error('Failed to copy share link: ', err);
    }
  };

  const handleCopyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(user.html_url);
      setCopiedProfile(true);
      setTimeout(() => setCopiedProfile(false), 2000);
    } catch (err) {
      console.error('Failed to copy GitHub profile URL: ', err);
    }
  };

  const handleDownloadJson = () => {
    const payload = {
      analyzer: 'GitHub Profile Analyzer',
      analyzedAt: new Date().toISOString(),
      user: user,
      repositories: rawReposData || [],
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.login}_github_analytics.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="overflow-hidden border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar Section */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-indigo-50 dark:border-indigo-950/50 object-cover shadow-md"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <Badge className="bg-indigo-600 hover:bg-indigo-600 dark:bg-indigo-500 text-white font-medium text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap shadow border-none">
                @{user.login}
              </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
                  {user.name || user.login}
                </h1>
                {user.name && (
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {user.login}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-end shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyShareLink}
                  className="rounded-xl border-neutral-200 dark:border-neutral-800 font-semibold text-xs cursor-pointer h-9 px-3 gap-1.5"
                >
                  {copiedShare ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyProfileUrl}
                  className="rounded-xl border-neutral-200 dark:border-neutral-800 font-semibold text-xs cursor-pointer h-9 px-3 gap-1.5"
                >
                  {copiedProfile ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Copied GitHub URL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadJson}
                  className="rounded-xl border-neutral-200 dark:border-neutral-800 font-semibold text-xs cursor-pointer h-9 px-3 gap-1.5"
                  title="Download Analytics data as JSON"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download JSON</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => window.open(user.html_url, '_blank', 'noopener,noreferrer')}
                  className="rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:hover:bg-neutral-200 dark:text-neutral-900 text-white font-semibold text-xs cursor-pointer h-9 px-3 gap-1.5"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  <span>GitHub Profile</span>
                </Button>
              </div>
            </div>

            {user.bio && (
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl font-normal">
                {user.bio}
              </p>
            )}

            {/* Info Badges/Items */}
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-sm text-neutral-500 dark:text-neutral-400">
              {user.company && (
                <div className="flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span>{user.company}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.blog && (
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="h-4 w-4 text-neutral-400 shrink-0" />
                  <a
                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 break-all"
                  >
                    {user.blog}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                <span>Joined {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-neutral-100 dark:border-neutral-800/80 pt-6">
          <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-neutral-100/50 dark:border-neutral-800/40 hover:scale-[1.01] transition-transform">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Followers
              </p>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {user.followers.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-neutral-100/50 dark:border-neutral-800/40 hover:scale-[1.01] transition-transform">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Following
              </p>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {user.following.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-neutral-100/50 dark:border-neutral-800/40 hover:scale-[1.01] transition-transform">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
              <FolderGit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Public Repos
              </p>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {user.public_repos.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-neutral-100/50 dark:border-neutral-800/40 hover:scale-[1.01] transition-transform">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Public Gists
              </p>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {user.public_gists.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
