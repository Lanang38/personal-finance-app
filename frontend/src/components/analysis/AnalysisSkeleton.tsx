import { Skeleton } from '../common/Skeleton';
import type { JSX } from 'react';

export function AnalysisSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      {/* Suggestion Panel */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <Skeleton className="h-5 w-52 rounded-full mb-5" />

        <div className="space-y-4">
          {Array.from({ length: 0 }).map((_, index) => (
            <div
              key={index}
              className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
            >
              <Skeleton className="h-4 w-4 rounded-full mt-1 shrink-0" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-full rounded-full" />
                <Skeleton className="h-3 w-10/12 rounded-full" />
              </div>

              <Skeleton className="h-8 w-24 rounded-full shrink-0" />

              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-6 w-44 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>

          <Skeleton className="h-3 w-2/3 rounded-full mb-6" />

          <Skeleton className="w-full h-72 rounded-2xl" />
        </div>

        {/* Analysis Donut */}
        <div className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>

          <Skeleton className="h-3 w-2/3 rounded-full mb-5" />

          <div className="flex-1 flex items-center justify-center">
            <Skeleton className="w-56 h-56 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
