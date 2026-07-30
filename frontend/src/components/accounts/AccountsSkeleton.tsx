import { Skeleton } from '../common/Skeleton';
import type { JSX } from 'react';

export function AccountsSkeleton(): JSX.Element {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
        >
          <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3 rounded-full" />
            <Skeleton className="h-2.5 w-1/4 rounded-full" />
          </div>
          <Skeleton className="h-4 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}
