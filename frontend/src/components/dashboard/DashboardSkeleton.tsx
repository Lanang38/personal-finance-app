import { Skeleton } from '../common/Skeleton';
import type { JSX } from 'react';

export function DashboardSkeleton(): JSX.Element {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-5 bg-white shadow-sm space-y-9">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-xl" />
          </div>
          <div className="flex justify-center py-6">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
