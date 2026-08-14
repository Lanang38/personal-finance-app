import { Skeleton } from '../common/Skeleton';
import type { JSX } from 'react';

export function DashboardSkeleton(): JSX.Element {
  return (
    <div>
      {/* STAT CARD SKELETON */}
      <div className="relative mb-6">
        {/* MOBILE */}
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          <div className="rounded-2xl p-5 bg-white dark:bg-dark-component shadow-sm space-y-7">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-lg" />
          </div>
        </div>

        {/* TABLET */}
        <div className="grid-cols-2 gap-4 tablet-skeleton-grid">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 bg-white dark:bg-dark-component shadow-sm space-y-7"
            >
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-lg" />
            </div>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="grid-cols-3 gap-4 desktop-skeleton-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 bg-white dark:bg-dark-component shadow-sm space-y-7"
            >
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-lg" />
            </div>
          ))}
        </div>

        {/* DESKTOP ARROW */}
        <div className="hidden min-[1281px]:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-dark-component shadow-md border border-slate-200 dark:border-dark-background">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>

        <div className="hidden min-[1281px]:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-dark-component shadow-md border border-slate-200 dark:border-dark-background">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>

      {/* CHART SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>

          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-dark-component rounded-3xl p-6 shadow-sm space-y-6">
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
