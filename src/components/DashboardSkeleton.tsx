'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <Card className="overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar Skeleton */}
          <Skeleton className="w-28 h-28 md:w-36 md:h-36 rounded-full mx-auto md:mx-0 shrink-0" />

          {/* Details Skeleton */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-24 mx-auto md:mx-0" />
              </div>
              <div className="flex gap-2 justify-center md:justify-end">
                <Skeleton className="h-9 w-20 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-28 rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-16 w-full max-w-2xl" />
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-neutral-100 dark:border-neutral-800 pt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100/50 dark:border-neutral-800/40">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ContributionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            
            {i === 0 ? (
              <div className="flex flex-col items-center py-4 space-y-4">
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <Skeleton className="h-14 w-full rounded-2xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function LanguageSkeleton() {
  return (
    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl p-6">
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-60" />
        <Skeleton className="h-4 w-full rounded-full mt-4" />
        <div className="space-y-4 pt-2">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl p-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-60" />
          <Skeleton className="h-[250px] w-full rounded-2xl" />
        </div>
      </Card>

      <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl p-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-56" />
          <Skeleton className="h-[250px] w-full rounded-2xl" />
        </div>
      </Card>
    </div>
  );
}

export function RepositoryListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-3.5 w-48" />
        </div>
        <Skeleton className="h-9 w-48 rounded-xl" />
      </div>

      <Skeleton className="h-10 w-full rounded-xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 rounded-2xl">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between items-center pt-3 border-t border-neutral-50 dark:border-neutral-800/40">
                <Skeleton className="h-4.5 w-16" />
                <div className="flex gap-3">
                  <Skeleton className="h-4.5 w-10" />
                  <Skeleton className="h-4.5 w-10" />
                  <Skeleton className="h-4.5 w-24" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <ProfileSkeleton />
      <ContributionSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LanguageSkeleton />
        </div>
        <div className="lg:col-span-2">
          <ChartsSkeleton />
        </div>
      </div>
      <RepositoryListSkeleton />
    </div>
  );
}
