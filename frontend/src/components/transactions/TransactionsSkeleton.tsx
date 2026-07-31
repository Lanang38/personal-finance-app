import { Skeleton } from '../common/Skeleton';
import type { JSX } from 'react';

export function TransactionsTableSkeleton(): JSX.Element {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-2 border-t border-slate-100 first:border-t-0"
        >
          <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3 rounded-full" />
            <Skeleton className="h-2.5 w-1/3 rounded-full" />
          </div>
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
