import { Skeleton } from '../common/Skeleton';
import type { JSX } from 'react';

export function CategoryListSkeleton(): JSX.Element {
  return (
    <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm h-full flex flex-col">
      {/* Judul */}
      <Skeleton className="h-5 w-32 rounded-full mb-5" />

      {/* List */}
      <div className="space-y-2.5 flex-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-slate-50 dark:bg-dark-background rounded-xl px-4 py-3"
          >
            {/* Bulatan */}
            <Skeleton className="w-3 h-3 rounded-full shrink-0" />

            {/* Nama & Jenis */}
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="h-3.5 w-24 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>

            {/* Edit */}
            <Skeleton className="w-4 h-4 rounded" />

            {/* Delete */}
            <Skeleton className="w-4 h-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
