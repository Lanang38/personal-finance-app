import { Skeleton } from '../common/Skeleton';
import type { JSX } from 'react';

export function AccountsSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-4.5">
        <Skeleton className="h-4 w-28 rounded-full mb-1" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-dark-background"
          >
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3 rounded-full" />
              <Skeleton className="h-2.5 w-1/4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-9">
        <Skeleton className="h-4 w-40 rounded-full mb-4" />
        <div className="flex justify-center py-4">
          <Skeleton className="h-44 w-44 rounded-full" />
        </div>
      </div>
    </div>
  );
}
