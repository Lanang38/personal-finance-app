import { Skeleton } from '../common/Skeleton';
import type { JSX } from 'react';

export function GoalSkeleton(): JSX.Element {
  return (
    <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm">
      <Skeleton className="h-5 w-40 rounded-full mb-5" />

      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="border-b border-slate-100 dark:border-dark-skeleton pb-6 last:border-0 last:pb-0"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-36 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            <Skeleton className="h-2 w-full rounded-full mb-2" />

            <div className="flex justify-between mb-3">
              <Skeleton className="h-3 w-32 rounded-full" />
              <Skeleton className="h-3 w-10 rounded-full" />
            </div>

            <div className="flex justify-between mb-4">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>

            <Skeleton className="h-8 w-36 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
