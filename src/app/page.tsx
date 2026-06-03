import { Suspense } from 'react';
import DashboardContent from '@/components/DashboardContent';

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-950 dark:border-t-indigo-500"></div>
          <p className="mt-4 text-sm font-semibold text-neutral-400 dark:text-neutral-500 animate-pulse">
            Loading Analyzer Dashboard...
          </p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

