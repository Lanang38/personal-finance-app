import { Skeleton } from '../common/Skeleton';
import type { JSX } from 'react';

export function TransactionsTableSkeleton(): JSX.Element {
  return (
    <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-3">
      {/* Judul */}
      <Skeleton className="h-5 w-36 rounded-full" />

      {/* Baris transaksi */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2 border-t border-slate-100 dark:border-dark-background first:border-t-0"
        >
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />

          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-2.5 w-2/3 rounded-full" />
            <Skeleton className="h-2 w-1/3 rounded-full" />
          </div>

          <Skeleton className="h-2.5 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}
