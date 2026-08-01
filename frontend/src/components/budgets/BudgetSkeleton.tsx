import { Skeleton } from '../common/Skeleton';
import type { JSX } from 'react';

export function BudgetSkeleton(): JSX.Element {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="h-3 w-16 rounded-full" />
      </div>

      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="border-t border-slate-100 first:border-t-0 pt-4 first:pt-0"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <Skeleton className="w-2.5 h-2.5 rounded-full shrink-0" />
              <Skeleton className="h-3 w-28 rounded-full" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-7 h-7 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-2 w-full rounded-full mb-2" />

          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-36 rounded-full" />
            <Skeleton className="h-3 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
